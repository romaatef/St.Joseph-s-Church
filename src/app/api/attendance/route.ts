import { getCurrentProfile } from "@/lib/auth/profile";
import {
  addAttendancePerson,
  getAccessibleAttendanceGroups,
  getAttendanceDates,
  getAttendanceDatesForGroups,
  getAttendanceForDate,
  getAttendanceForDateForGroups,
  getAttendanceGroupDetails,
  getAttendanceGroups,
  getAttendanceGroupOptions,
  getAttendanceHistories,
  getStageChildren,
  isAttendanceGroup,
  removeAttendancePerson,
  saveAttendanceForChild,
  saveAttendanceForDate,
  updateAttendancePerson,
  type AttendanceGroup,
  type AttendancePersonDetails,
} from "@/lib/google-sheets/attendance.server";
import { normalizeBirthDate, parseBirthDate } from "@/lib/google-sheets/birth-date";
import { normalizePhoneNumber } from "@/lib/utils";
import type { AuthProfile } from "@/lib/auth/profile";

export const dynamic = "force-dynamic";

type AttendanceRequest = {
  action?: unknown;
  group?: unknown;
  groups?: unknown;
  date?: unknown;
  presentRows?: unknown;
  present?: unknown;
  person?: unknown;
  currentName?: unknown;
  row?: unknown;
  name?: unknown;
};

function canAccessGroup(profile: AuthProfile, group: AttendanceGroup) {
  return getAccessibleAttendanceGroups(profile.role, profile.stageIds).includes(group);
}

function getAccessibleGroups(profile: AuthProfile) {
  return getAccessibleAttendanceGroups(profile.role, profile.stageIds);
}

function isWriteAction(action: unknown) {
  return action === "saveAttendance" ||
    action === "saveChildAttendance" ||
    action === "addPerson" ||
    action === "updatePerson" ||
    action === "removePerson";
}

type PersonDetailsResult =
  | { ok: true; person: AttendancePersonDetails }
  | { ok: false; error: string };

function parsePersonDetails(value: unknown): PersonDetailsResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, error: "بيانات الشخص المرسلة غير صالحة." };
  }
  const fields = [
    "name",
    "phone",
    "homeNumber",
    "street",
    "area",
    "birthDate",
    "confessionFather",
    "location",
    "notes",
  ] as const;
  const labels: Record<(typeof fields)[number], string> = {
    name: "الاسم",
    phone: "رقم الهاتف",
    homeNumber: "رقم البيت",
    street: "الشارع",
    area: "المنطقة",
    birthDate: "تاريخ الميلاد",
    confessionFather: "أب الاعتراف",
    location: "الموقع",
    notes: "الملاحظات",
  };
  const person = {} as AttendancePersonDetails;
  for (const field of fields) {
    const entry = (value as Record<string, unknown>)[field];
    if (
      typeof entry !== "string" ||
      entry.length > (field === "name" ? 150 : 500)
    ) {
      return {
        ok: false,
        error: `حقل ${labels[field]} غير صالح أو يتجاوز الحد المسموح.`,
      };
    }
    person[field] = entry.trim();
  }
  if (!person.name) {
    return { ok: false, error: "الاسم مطلوب." };
  }
  if (person.birthDate) {
    const parsedBirthDate = parseBirthDate(person.birthDate);
    if (!parsedBirthDate) {
      return {
        ok: false,
        error: "صيغة تاريخ الميلاد غير صحيحة. استخدمي يوم/شهر/سنة.",
      };
    }
    person.birthDate = normalizeBirthDate(parsedBirthDate);
  }
  return { ok: true, person };
}

function parseSheetDate(value: string): Date | null {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])));
  if (
    date.getUTCFullYear() !== Number(match[3]) ||
    date.getUTCMonth() !== Number(match[2]) - 1 ||
    date.getUTCDate() !== Number(match[1])
  ) {
    return null;
  }
  return date;
}

function getCurrentFridayInCairo(): Date {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((item) => item.type === type)?.value);
  const today = new Date(Date.UTC(part("year"), part("month") - 1, part("day")));
  const daysUntilFriday = (5 - today.getUTCDay() + 7) % 7;
  today.setUTCDate(today.getUTCDate() + daysUntilFriday);
  return today;
}

function getStreakDates(dates: string[]) {
  const currentFriday = getCurrentFridayInCairo();
  return dates
    .map((value) => ({ value, date: parseSheetDate(value) }))
    .filter(
      (entry): entry is { value: string; date: Date } =>
        entry.date !== null &&
        entry.date.getUTCDay() === 5 &&
        entry.date < currentFriday,
    )
    .sort((left, right) => right.date.getTime() - left.date.getTime());
}

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("ar");
}

async function createRepeatedAbsenceReport(profile: AuthProfile) {
  const groups = getAccessibleGroups(profile);
  if (groups.length === 0) return [];
  const stageIds = [...new Set(groups.map((group) => getAttendanceGroupDetails(group).stageId))];
  const [histories, stageChildren] = await Promise.all([
    getAttendanceHistories(groups),
    Promise.all(
      stageIds.map(async (stageId) => {
        const result = await getStageChildren(stageId);
        if (!result.ok) throw new Error(result.error);
        return result.groups;
      }),
    ),
  ]);
  const childrenByGroup = new Map(
    stageChildren.flatMap((stageGroups) =>
      stageGroups.map((group) => [group.id, group.rows] as const),
    ),
  );

  const report = histories.flatMap(({ group, dates, children }) => {
    const groupDetails = getAttendanceGroupDetails(group);
    const rosterRows = childrenByGroup.get(group);
    if (!rosterRows) {
      throw new Error("تعذر مطابقة مجموعة الغياب مع قائمة بيانات الأطفال.");
    }
    const rosterIndexesByName = new Map<string, number[]>();
    rosterRows.forEach((row, index) => {
      const name = normalizeName(row[1]);
      const indexes = rosterIndexesByName.get(name) ?? [];
      indexes.push(index);
      rosterIndexesByName.set(name, indexes);
    });
    const reportedRosterIndexes = new Set<number>();
    const streakDates = getStreakDates(dates.map((date) => date.value));
    return children.flatMap((child) => {
      let consecutiveAbsences = 0;
      const absentDates: string[] = [];
      for (const date of streakDates) {
        if (child.attendance[date.value] !== false) break;
        consecutiveAbsences += 1;
        absentDates.push(date.value);
      }
      if (consecutiveAbsences < 2) return [];
      const matchingIndexes = rosterIndexesByName.get(normalizeName(child.name)) ?? [];
      if (matchingIndexes.length !== 1 || reportedRosterIndexes.has(matchingIndexes[0])) {
        return [];
      }
      const rosterIndex = matchingIndexes[0];
      reportedRosterIndexes.add(rosterIndex);
      return [{
        group,
        row: rosterIndex + 1,
        groupLabel: groupDetails.label,
        name: rosterRows[rosterIndex][1],
        phone: normalizePhoneNumber(rosterRows[rosterIndex][2]),
        consecutiveAbsences,
        absentDates,
      }];
    });
  });
  return report.sort(
    (left, right) =>
      right.consecutiveAbsences - left.consecutiveAbsences ||
      left.groupLabel.localeCompare(right.groupLabel, "ar") ||
      left.name.localeCompare(right.name, "ar"),
  );
}

function invalidRequest(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (!origin || origin !== requestUrl.origin) {
    return invalidRequest("الطلب غير مسموح.", 403);
  }

  const profile = await getCurrentProfile();
  if (!profile) return invalidRequest("انتهت الجلسة. سجّلي الدخول مرة أخرى.", 401);

  let input: AttendanceRequest;
  try {
    input = await request.json() as AttendanceRequest;
  } catch {
    return invalidRequest("تعذر قراءة الطلب المرسل.");
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return invalidRequest("صيغة الطلب غير صالحة.");
  }
  if (profile.role === "viewer" && isWriteAction(input.action)) {
    return invalidRequest("حساب Viewer مخصص للعرض فقط ولا يمكنه تغيير البيانات.", 403);
  }
  const writerRole =
    profile.role === "admin" || profile.role === "stage_responsible"
      ? profile.role
      : null;

  try {
    switch (input.action) {
      case "getGroups": {
        const accessibleGroups = getAccessibleGroups(profile);
        if (accessibleGroups.length === 0) {
          return Response.json(
            { groups: [] },
            { headers: { "cache-control": "no-store" } },
          );
        }
        const groups = await getAttendanceGroupOptions();
        const allowedGroups = new Set(accessibleGroups);
        return Response.json(
          { groups: groups.filter((group) => allowedGroups.has(group.id)) },
          { headers: { "cache-control": "no-store" } },
        );
      }
      case "getDates": {
        if (!isAttendanceGroup(input.group)) return invalidRequest("المجموعة غير صالحة.");
        if (!canAccessGroup(profile, input.group)) {
          return invalidRequest("لا تملكين صلاحية الوصول إلى مجموعات الحضور.", 403);
        }
        const dates = await getAttendanceDates(input.group);
        return Response.json(
          { dates },
          { headers: { "cache-control": "no-store" } },
        );
      }
      case "getDatesForGroups": {
        if (
          !Array.isArray(input.groups) ||
          input.groups.length === 0 ||
          input.groups.some((group) => !isAttendanceGroup(group)) ||
          new Set(input.groups).size !== input.groups.length
        ) {
          return invalidRequest("قائمة المجموعات غير صالحة.");
        }
        const groups = input.groups as AttendanceGroup[];
        if (groups.some((group) => !canAccessGroup(profile, group))) {
          return invalidRequest("لا تملكين صلاحية الوصول إلى مجموعات الحضور.", 403);
        }
        const dates = await getAttendanceDatesForGroups(groups);
        return Response.json(
          { groups: dates },
          { headers: { "cache-control": "no-store" } },
        );
      }
      case "getAttendance": {
        if (!isAttendanceGroup(input.group)) return invalidRequest("المجموعة غير صالحة.");
        if (!canAccessGroup(profile, input.group)) {
          return invalidRequest("لا تملكين صلاحية الوصول إلى هذه المجموعة.", 403);
        }
        if (typeof input.date !== "string") return invalidRequest("يرجى اختيار تاريخ صحيح.");
        const children = await getAttendanceForDate(input.group, input.date);
        return Response.json(
          { children },
          { headers: { "cache-control": "no-store" } },
        );
      }
      case "getAttendanceForGroups": {
        if (
          !Array.isArray(input.groups) ||
          input.groups.length === 0 ||
          input.groups.some((group) => !isAttendanceGroup(group)) ||
          new Set(input.groups).size !== input.groups.length
        ) {
          return invalidRequest("قائمة المجموعات غير صالحة.");
        }
        if (typeof input.date !== "string") return invalidRequest("يرجى اختيار تاريخ صحيح.");
        const groups = input.groups as AttendanceGroup[];
        if (groups.some((group) => !canAccessGroup(profile, group))) {
          return invalidRequest("لا تملكين صلاحية الوصول إلى مجموعات الحضور.", 403);
        }
        const attendance = await getAttendanceForDateForGroups(groups, input.date);
        return Response.json(
          { groups: attendance },
          { headers: { "cache-control": "no-store" } },
        );
      }
      case "saveAttendance": {
        if (!isAttendanceGroup(input.group)) return invalidRequest("المجموعة غير صالحة.");
        if (!canAccessGroup(profile, input.group)) {
          return invalidRequest("لا تملكين صلاحية تعديل هذه المجموعة.", 403);
        }
        if (
          typeof input.date !== "string" ||
          !Array.isArray(input.presentRows) ||
          input.presentRows.length > 500 ||
          input.presentRows.some((row) => !Number.isSafeInteger(row)) ||
          new Set(input.presentRows).size !== input.presentRows.length
        ) {
          return invalidRequest("بيانات الحضور المرسلة غير صالحة.");
        }

        const presentRows = input.presentRows as number[];

        if (!writerRole) {
          return invalidRequest("حساب Viewer مخصص للعرض فقط ولا يمكنه تغيير البيانات.", 403);
        }
        const result = await saveAttendanceForDate(
          input.group,
          input.date,
          presentRows,
          writerRole,
        );
        return Response.json(
          { success: true, updated: result.updated, message: "تم حفظ سجل الحضور بنجاح." },
          { headers: { "cache-control": "no-store" } },
        );
      }
      case "saveChildAttendance": {
        if (!isAttendanceGroup(input.group)) return invalidRequest("المجموعة غير صالحة.");
        if (!canAccessGroup(profile, input.group)) {
          return invalidRequest("لا تملكين صلاحية تعديل هذه المجموعة.", 403);
        }
        if (!writerRole) {
          return invalidRequest("حساب Viewer مخصص للعرض فقط ولا يمكنه تغيير البيانات.", 403);
        }
        if (
          typeof input.date !== "string" ||
          typeof input.row !== "number" ||
          !Number.isSafeInteger(input.row) ||
          typeof input.present !== "boolean"
        ) {
          return invalidRequest("بيانات حضور الطفل غير صالحة.");
        }
        // Apps Script validates the date and row against the selected group while saving.
        const result = await saveAttendanceForChild(
          input.group,
          input.date,
          input.row,
          input.present,
          writerRole,
        );
        return Response.json(
          { success: true, updated: result.updated, message: result.message },
          { headers: { "cache-control": "no-store" } },
        );
      }
      case "addPerson": {
        if (!isAttendanceGroup(input.group)) return invalidRequest("المجموعة غير صالحة.");
        if (!canAccessGroup(profile, input.group)) {
          return invalidRequest("لا تملكين صلاحية تعديل هذه المجموعة.", 403);
        }
        const parsedPerson = parsePersonDetails(input.person);
        if (!parsedPerson.ok) return invalidRequest(parsedPerson.error);
        if (!writerRole) {
          return invalidRequest("حساب Viewer مخصص للعرض فقط ولا يمكنه تغيير البيانات.", 403);
        }
        const message = await addAttendancePerson(input.group, parsedPerson.person, writerRole);
        return Response.json(
          { success: true, message },
          { headers: { "cache-control": "no-store" } },
        );
      }
      case "updatePerson": {
        if (!isAttendanceGroup(input.group)) return invalidRequest("المجموعة غير صالحة.");
        if (!canAccessGroup(profile, input.group)) {
          return invalidRequest("لا تملكين صلاحية تعديل هذه المجموعة.", 403);
        }
        if (
          typeof input.currentName !== "string" ||
          !input.currentName.trim() ||
          input.currentName.trim().length > 150
        ) {
          return invalidRequest("اسم الشخص الحالي غير صالح.");
        }
        const parsedPerson = parsePersonDetails(input.person);
        if (!parsedPerson.ok) return invalidRequest(parsedPerson.error);
        if (!writerRole) {
          return invalidRequest("حساب Viewer مخصص للعرض فقط ولا يمكنه تغيير البيانات.", 403);
        }
        const message = await updateAttendancePerson(
          input.group,
          input.currentName,
          parsedPerson.person,
          writerRole,
        );
        return Response.json(
          { success: true, message },
          { headers: { "cache-control": "no-store" } },
        );
      }
      case "removePerson": {
        if (!isAttendanceGroup(input.group)) return invalidRequest("المجموعة غير صالحة.");
        if (!canAccessGroup(profile, input.group)) {
          return invalidRequest("لا تملكين صلاحية تعديل هذه المجموعة.", 403);
        }
        if (
          typeof input.row !== "number" ||
          !Number.isSafeInteger(input.row) ||
          typeof input.name !== "string" ||
          !input.name.trim()
        ) {
          return invalidRequest("بيانات الشخص المطلوب حذفه غير صالحة.");
        }
        const groups = await getAttendanceGroups(
          getAttendanceGroupDetails(input.group).stageId,
        );
        const selectedGroup = groups.find((group) => group.id === input.group);
        const selectedPerson = selectedGroup?.children.find((child) => child.row === input.row);
        if (!selectedPerson || selectedPerson.name !== input.name) {
          return invalidRequest("تغيرت قائمة المجموعة. حدّثي الصفحة وحاولي مرة أخرى.");
        }
        if (!writerRole) {
          return invalidRequest("حساب Viewer مخصص للعرض فقط ولا يمكنه تغيير البيانات.", 403);
        }
        const message = await removeAttendancePerson(
          input.group,
          input.row,
          input.name,
          writerRole,
        );
        return Response.json(
          { success: true, message },
          { headers: { "cache-control": "no-store" } },
        );
      }
      case "getRepeatedAbsence": {
        const report = await createRepeatedAbsenceReport(profile);
        return Response.json(
          { report },
          { headers: { "cache-control": "no-store" } },
        );
      }
      default:
        return invalidRequest("الإجراء المطلوب غير معروف.");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "حدث خطأ أثناء الاتصال بسجل الغياب.";
    return Response.json({ error: message }, { status: 502 });
  }
}

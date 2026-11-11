import "server-only";

import { createHmac } from "node:crypto";
import { STAGES, type StageId } from "@/config/stages";
import type { FiveSixChildRow } from "@/types/google-sheets";

export const ATTENDANCE_STAGES = [
  {
    id: "kg",
    name: "K.G",
    dataSpreadsheetId: "10c7C4VkEtHfg-z4bQ4_WHxFB0VRoztW7",
    attendanceSpreadsheetId: "1S19IVVQvJ32y9nIfS0IJk0C0D_MgG75NVGHT6zmbtG8",
    groups: [
      { id: "kg-servants", name: "خدام", dataAliases: ["خدام"], attendanceAliases: ["خدام"], dataRows: [5, 17], attendanceRows: [3, 15] },
      { id: "kg-g1-boys", name: "كي جي 1 بنين", dataAliases: ["كي جي 1 بنين", "كي جي 1 ولاد", "KG 1 Boys"], attendanceAliases: ["كي جي 1 ولاد"], dataRows: [19, 38], attendanceRows: [58, 84] },
      { id: "kg-g2-boys", name: "كي جي 2 بنين", dataAliases: ["كي جي 2 بنين", "كي جي 2 ولاد", "KG 2 Boys"], attendanceAliases: ["كي جي 2 ولاد"], dataRows: [40, 57], attendanceRows: [88, 105] },
      { id: "kg-g1-girls", name: "كي جي 1 بنات", dataAliases: ["كي جي 1 بنات", "KG 1 Girls"], dataRows: [59, 93], attendanceRows: [19, 54] },
      { id: "kg-g2-girls", name: "كي جي 2 بنات", dataAliases: ["كي جي 2 بنات", "KG 2 Girls"], dataRows: [95, 104], attendanceRows: [109, 118] },
    ],
  },
  {
    id: "g1-g2",
    name: "أولى وتانية",
    dataSpreadsheetId: "18r_3eOrq0zoM4-sSDfjLPbOdJ7NSbb9L",
    attendanceSpreadsheetId: "1fXK09bBYjKEO_XVSo7D5ecFdH3oYslLnS1eKWv5j3B8",
    groups: [
      { id: "g1-g2-servants", name: "خدام", dataAliases: ["خدام"] },
      { id: "g1-boys", name: "أولى بنين", dataAliases: ["أولى بنين", "أولى ولاد", "اولى بنين", "اولى ولاد"], attendanceAliases: ["اولي بنين"] },
      { id: "g2-boys", name: "تانية بنين", dataAliases: ["تانية بنين", "تانية ولاد", "ثانية بنين", "ثانية ولاد"], attendanceAliases: ["تانيه بنين"] },
      { id: "g1-girls", name: "أولى بنات", dataAliases: ["أولى بنات", "اولى بنات"], attendanceAliases: ["اولي بنات"] },
      { id: "g2-girls", name: "تانية بنات", dataAliases: ["تانية بنات", "ثانية بنات"], attendanceAliases: ["تانيه بنات"] },
    ],
  },
  {
    id: "g3-g4",
    name: "تالتة ورابعة",
    dataSpreadsheetId: "1Yv5CYlJujiY_sxS1g-X7Bj5a-hVcMdsRZSFND-gFonM",
    attendanceSpreadsheetId: "1rcHfeucECkcKhoLs-TAIHiz7dX7-my7yE2IeyjVQiWA",
    groups: [
      { id: "g3-g4-servants", name: "خدام", dataAliases: ["خدام"] },
      { id: "g3-boys", name: "تالتة بنين", dataAliases: ["تالتة بنين", "تالتة ولاد", "ثالثة بنين", "ثالثة ولاد", "تالته ولاد"], attendanceAliases: ["تالته بنين"] },
      { id: "g4-boys", name: "رابعة بنين", dataAliases: ["رابعة بنين", "رابعة ولاد", "رابعه بنين", "رابعه ولاد"], attendanceAliases: ["رابعه بنين"] },
      { id: "g3-girls", name: "تالتة بنات", dataAliases: ["تالتة بنات", "ثالثة بنات"], attendanceAliases: ["تالته بنات"] },
      { id: "g4-girls", name: "رابعة بنات", dataAliases: ["رابعة بنات", "رابعه بنات"], attendanceAliases: ["رابعه بنات"] },
    ],
  },
  {
    id: "g5-g6",
    name: "خامسة وسادسة",
    dataSpreadsheetId: "1FDO_WDPin3RWjvGDt4_awMEwMklSka8r",
    attendanceSpreadsheetId: "1xb7dc0jA8uMlgUDKDtsEIUWRyaYDx4KuAOdpxOIMfrA",
    groups: [
      { id: "g5-g6-servants", name: "خدام", dataAliases: ["خدام"] },
      { id: "g5-boys", name: "خامسة بنين", dataAliases: ["خامسة بنين", "خامسة ولاد", "خامسه ولاد"] },
      { id: "g6-boys", name: "ستة بنين", dataAliases: ["ستة بنين", "ستة ولاد", "سته ولاد", "سادسة ولاد"] },
      { id: "g5-girls", name: "خامسة بنات", dataAliases: ["خامسة بنات", "خامسه بنات"] },
      { id: "g6-girls", name: "ستة بنات", dataAliases: ["ستة بنات", "سته بنات", "سادسة بنات", "سادسه بنات"] },
    ],
  },
  {
    id: "prep",
    name: "إعدادي",
    dataSpreadsheetId: "1J0voPh-JtSuk4itpAdbL3hvG-YjWY9hmKlyyB-fbltY",
    attendanceSpreadsheetId: "1vMV0Z_IMuta-8FiwOfr4dpnXWpCSFtdLMrI3d2-HUMs",
    groups: [
      { id: "prep-servants", name: "خدام", dataAliases: ["خدام"], dataRows: [5, 25] },
      { id: "prep-g1-boys", name: "أولى إعدادي بنين", dataAliases: ["أولى إعدادي بنين", "اولى اعدادي بنين"], attendanceAliases: ["اولي اعدادي بنين"], dataRows: [27, 65] },
      { id: "prep-g2-boys", name: "تانية إعدادي بنين", dataAliases: ["تانية إعدادي بنين", "ثانية إعدادي بنين", "تانيه اعدادي بنين"], attendanceAliases: ["تانيه اعدادي بنين"], dataRows: [96, 137] },
      { id: "prep-g3-boys", name: "تالتة إعدادي بنين", dataAliases: ["تالتة إعدادي بنين", "ثالثة إعدادي بنين"], attendanceAliases: ["تالته اعدادي بنين"], dataRows: [175, 215] },
      { id: "prep-g1-girls", name: "أولى إعدادي بنات", dataAliases: ["أولى إعدادي بنات", "اولى اعدادي بنات"], attendanceAliases: ["اولي اعدادي بنات"], dataRows: [67, 94] },
      { id: "prep-g2-girls", name: "تانية إعدادي بنات", dataAliases: ["تانية إعدادي بنات", "ثانية إعدادي بنات", "تانيه اعدادي بنات"], attendanceAliases: ["تانيه اعدادي بنات"], dataRows: [139, 173] },
      { id: "prep-g3-girls", name: "تالتة إعدادي بنات", dataAliases: ["تالتة إعدادي بنات", "ثالثة إعدادي بنات"], attendanceAliases: ["تالته اعدادي بنات"], dataRows: [217, 265] },
    ],
  },
  {
    id: "secondary",
    name: "ثانوي",
    dataSpreadsheetId: "1Nv4Vj7zHA6AYeHDrHsR9JDzTvK2QAucyI_-oDnrBV84",
    attendanceSpreadsheetId: "1OYhfanV-LQO44Ph_Re6dNoJWSTh5ZEEVr8DpKOc9_EY",
    groups: [
      { id: "secondary-servants", name: "خدام", dataAliases: ["خدام"], dataRows: [5, 22] },
      { id: "secondary-g1-boys", name: "أولى ثانوي بنين", dataAliases: ["أولى ثانوي بنين", "اولى ثانوي بنين", "أولى ثانوي ولاد", "اولى ثانوي ولاد"], attendanceAliases: ["اولي ثانوي بنين"], dataRows: [24, 49] },
      { id: "secondary-g2-boys", name: "تانية ثانوي بنين", dataAliases: ["تانية ثانوي بنين", "ثانية ثانوي بنين", "تانية ثانوي ولاد", "ثانية ثانوي ولاد"], attendanceAliases: ["تانيه ثانوي بنين"], dataRows: [81, 110] },
      { id: "secondary-g3-boys", name: "تالتة ثانوي بنين", dataAliases: ["تالتة ثانوي بنين", "ثالثة ثانوي بنين", "تالتة ثانوي ولاد", "ثالثة ثانوي ولاد"], attendanceAliases: ["تالته ثانوي بنين"], dataRows: [140, 170] },
      { id: "secondary-g1-girls", name: "أولى ثانوي بنات", dataAliases: ["أولى ثانوي بنات", "اولى ثانوي بنات"], attendanceAliases: ["اولي ثانوي بنات"], dataRows: [51, 79] },
      { id: "secondary-g2-girls", name: "تانية ثانوي بنات", dataAliases: ["تانية ثانوي بنات", "ثانية ثانوي بنات"], attendanceAliases: ["تانيه ثانوي بنات"], dataRows: [112, 138] },
      { id: "secondary-g3-girls", name: "تالتة ثانوي بنات", dataAliases: ["تالتة ثانوي بنات", "ثالثة ثانوي بنات"], attendanceAliases: ["تالته ثانوي بنات"], dataRows: [172, 200] },
    ],
  },
  {
    id: "servants",
    name: "الخدام",
    dataSpreadsheetId: "155Eo2CCPy8nIF2u5cDAoDTdtk0OM4cJws8_wkVBJjAI",
    attendanceSpreadsheetId: "12lsNHbeUtjkjtUUCF3ia0xydqHvcXXG3",
    groups: [
      { id: "servants-had", name: "حضانة الحد", dataAliases: ["حضانة الحد"], attendanceAliases: ["حضانة"] },
      { id: "servants-kg", name: "كي جي", dataAliases: ["كي جي", "KG", "K.G"], attendanceAliases: ["كيجي"] },
      { id: "servants-g1-g2", name: "أولى وتانية", dataAliases: ["أولى وتانية", "اولى وتانية"], attendanceAliases: ["اولي وتانية"] },
      { id: "servants-g3-g4", name: "تالتة ورابعة", dataAliases: ["تالتة ورابعة", "ثالثة ورابعة"] },
      { id: "servants-g5-g6", name: "خامسة وسادسة", dataAliases: ["خامسة وسادسة", "خامسه وسادسه"], attendanceAliases: ["خامسة وستة"] },
      { id: "servants-prep", name: "إعدادي", dataAliases: ["إعدادي", "اعدادي"], attendanceAliases: ["اعدادي"] },
      { id: "servants-secondary", name: "ثانوي", dataAliases: ["ثانوي"] },
      { id: "servants-meeting", name: "خدام الاجتماع", dataAliases: ["خدام الاجتماع"] },
    ],
  },
] as const;

export type AttendanceGroup = (typeof ATTENDANCE_STAGES)[number]["groups"][number]["id"];
export type AttendanceWriterRole = "admin" | "stage_responsible";
function getLinkedAttendanceStages() {
  return ATTENDANCE_STAGES.filter((stage) =>
    STAGES.some((configuredStage) =>
      configuredStage.id === stage.id && configuredStage.sheetsLinked,
    ),
  );
}

export const ATTENDANCE_GROUPS = getLinkedAttendanceStages().flatMap((stage) =>
  stage.groups.map((group) => group.id),
) as AttendanceGroup[];

export type AttendanceGroupDetails = {
  id: AttendanceGroup;
  name: string;
  stageId: StageId;
  stageName: string;
  label: string;
};

export function getAttendanceGroupDetails(groupId: AttendanceGroup): AttendanceGroupDetails {
  for (const stage of ATTENDANCE_STAGES) {
    const group = stage.groups.find((entry) => entry.id === groupId);
    if (group) {
      return {
        id: group.id,
        name: group.name,
        stageId: stage.id,
        stageName: stage.name,
        label: `${stage.name} — ${group.name}`,
      };
    }
  }
  throw new Error("مجموعة الحضور غير معروفة.");
}

export function isAttendanceStage(stageId: StageId): boolean {
  return getLinkedAttendanceStages().some((stage) => stage.id === stageId);
}

export function getAccessibleAttendanceStages(
  role: "admin" | "stage_responsible" | "viewer",
  stageIds: readonly StageId[],
) {
  return getLinkedAttendanceStages().filter(
    (stage) => role === "admin" || stageIds.includes(stage.id),
  );
}

export function getAccessibleAttendanceGroups(
  role: "admin" | "stage_responsible" | "viewer",
  stageIds: readonly StageId[],
): AttendanceGroup[] {
  return getAccessibleAttendanceStages(role, stageIds)
    .flatMap((stage) => stage.groups.map((group) => group.id));
}

export type AttendanceChild = {
  row: number;
  name: string;
  present: boolean;
  notRegistered: boolean;
};

type AttendanceRosterChild = Pick<AttendanceChild, "row" | "name">;

export type AttendanceDate = {
  value: string;
  column: number;
};

export type AttendanceHistoryChild = {
  row: number;
  name: string;
  attendance: Record<string, boolean | null>;
};

export type AttendanceGroupHistory = {
  group: AttendanceGroup;
  stageId: StageId;
  groupName: string;
  stageName: string;
  groupLabel: string;
  dates: AttendanceDate[];
  children: AttendanceHistoryChild[];
};

export type StageChildrenGroup = {
  id: AttendanceGroup;
  name: string;
  rows: FiveSixChildRow[];
};

export type StageChildrenResult =
  | { ok: true; groups: StageChildrenGroup[] }
  | { ok: false; error: string };

export type AttendancePersonDetails = {
  name: string;
  phone: string;
  homeNumber: string;
  street: string;
  area: string;
  birthDate: string;
  confessionFather: string;
  location: string;
  notes: string;
};

type ScriptResponse<T> = { success: true } & T;

function getAttendanceConfig(stageId: StageId) {
  const scriptUrl = (
    stageId === "kg"
      ? process.env.KG_ATTENDANCE_SCRIPT_URL
      : stageId === "g1-g2"
        ? process.env.ATTENDANCE_SCRIPT_URL
      : stageId === "g3-g4"
        ? process.env.G3_G4_ATTENDANCE_SCRIPT_URL
        : stageId === "g5-g6"
          ? process.env.G5_G6_ATTENDANCE_SCRIPT_URL
            : stageId === "prep"
              ? process.env.PREP_ATTENDANCE_SCRIPT_URL
              : stageId === "secondary"
                ? process.env.SECONDARY_ATTENDANCE_SCRIPT_URL
                : stageId === "servants"
                  ? process.env.SERVANTS_ATTENDANCE_SCRIPT_URL
                : undefined
  )?.trim();
  const secret = process.env.ATTENDANCE_API_SECRET;
  if (!scriptUrl || !secret) {
    throw new Error(`إعداد ربط سجل الغياب لمرحلة ${stageId} غير مكتمل على الخادم.`);
  }

  let url: URL;
  try {
    url = new URL(scriptUrl);
  } catch {
    throw new Error("رابط Apps Script لسجل الغياب غير صالح.");
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== "script.google.com" ||
    !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) ||
    url.search ||
    url.hash
  ) {
    throw new Error("رابط Apps Script لسجل الغياب غير صالح.");
  }
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("سر HMAC لسجل الغياب يجب أن يحتوي على 32 بايت على الأقل.");
  }

  return { scriptUrl: url.toString(), secret };
}

function getRequestStageId(data: Record<string, unknown>): StageId {
  const groupIds =
    typeof data.group === "string"
      ? [data.group]
      : Array.isArray(data.groups)
        ? data.groups
        : [];
  const groupStageIds = groupIds.map((group) => {
    if (!isAttendanceGroup(group)) {
      throw new Error("مجموعة الحضور المطلوبة غير معروفة.");
    }
    return getAttendanceGroupDetails(group).stageId;
  });
  if (new Set(groupStageIds).size > 1) {
    throw new Error("يجب إرسال طلبات المراحل إلى روابط Apps Script مستقلة.");
  }

  const requestedStageId =
    typeof data.stageId === "string"
      ? data.stageId
      : groupStageIds[0];
  const configuredStage = STAGES.find(
    (stage) => stage.id === requestedStageId && stage.sheetsLinked,
  );
  if (!configuredStage) {
    throw new Error("مرحلة الحضور المطلوبة غير مرتبطة بإعدادات الخادم.");
  }
  if (groupStageIds[0] && groupStageIds[0] !== configuredStage.id) {
    throw new Error("مرحلة الطلب لا تطابق مجموعة الحضور المطلوبة.");
  }
  return configuredStage.id;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseResponse<T>(value: unknown): ScriptResponse<T> {
  if (!isRecord(value)) {
    throw new Error("رفض Apps Script الطلب أو أعاد استجابة غير صالحة.");
  }
  if (value.success !== true) {
    if (value.error === "Group not found") {
      throw new Error(
        "نسخة Apps Script المنشورة قديمة: لا تتعرف على صفوف ملخص المجموعات. انشري الكود الحالي من apps-script/attendance.gs.",
      );
    }
    if (
      value.error === "Unsupported action" ||
      value.error === "المرحلة غير مرتبطة بمصدر بيانات."
    ) {
      throw new Error(
        "نسخة Apps Script المنشورة لا تتضمن إعدادات المرحلة أو الإجراء المطلوب. انشري الكود الحالي من apps-script/attendance.gs.",
      );
    }
    if (
      typeof value.error === "string" &&
      value.error.startsWith("Could not identify one summary row for group:")
    ) {
      throw new Error(
        "تعذر مطابقة صف إجمالي إحدى المجموعات في العمود A. راجعي نص صفوف الإجمالي في الشيت قبل تفعيل الحفظ.",
      );
    }
    if (value.error === "Unauthorized") {
      throw new Error("رفض Apps Script الطلب؛ تحققي من تطابق سر HMAC بين الخادم وScript Properties.");
    }
    if (typeof value.error === "string" && value.error.startsWith("Roster action: ")) {
      throw new Error(value.error.slice("Roster action: ".length));
    }
    if (typeof value.error === "string" && value.error.trim()) {
      throw new Error(value.error);
    }
    throw new Error("رفض Apps Script الطلب أو أعاد استجابة غير صالحة.");
  }
  return value as ScriptResponse<T>;
}

export async function callAttendanceScript<T>(data: Record<string, unknown>): Promise<T> {
  const { scriptUrl, secret } = getAttendanceConfig(getRequestStageId(data));
  const payload = JSON.stringify(data).replace(
    /[\u007f-\uffff]/g,
    (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
  const signature = createHmac("sha256", secret).update(payload, "utf8").digest("base64");

  let response: Response;
  try {
    response = await fetch(scriptUrl, {
      method: "POST",
      cache: "no-store",
      redirect: "follow",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ payload, signature }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error("انتهت مهلة الاتصال بخدمة سجل الغياب بعد 30 ثانية.");
    }
    const cause = error instanceof Error ? error.cause : null;
    if (cause && typeof cause === "object" && "code" in cause && typeof cause.code === "string") {
      throw new Error(`تعذر الاتصال بخدمة سجل الغياب (${cause.code}).`);
    }
    throw new Error("تعذر الاتصال بخدمة سجل الغياب. حاولي مرة أخرى.");
  }

  if (!response.ok) {
    throw new Error(`تعذر الاتصال بخدمة سجل الغياب (رمز ${response.status}).`);
  }

  let responseBody: unknown;
  try {
    responseBody = await response.json();
  } catch {
    throw new Error("أعاد Apps Script استجابة غير مفهومة.");
  }

  return parseResponse<T>(responseBody);
}

export function isAttendanceGroup(value: unknown): value is AttendanceGroup {
  return typeof value === "string" &&
    getLinkedAttendanceStages().some((stage) =>
      stage.groups.some((group) => group.id === value),
    );
}

function isAttendanceChild(value: unknown): value is AttendanceChild {
  return (
    isRecord(value) &&
    Number.isSafeInteger(value.row) &&
    (value.row as number) > 1 &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.present === "boolean" &&
    typeof value.notRegistered === "boolean"
  );
}

function isAttendanceRosterChild(value: unknown): value is AttendanceRosterChild {
  return (
    isRecord(value) &&
    Number.isSafeInteger(value.row) &&
    (value.row as number) > 1 &&
    typeof value.name === "string" &&
    value.name.trim().length > 0
  );
}

export async function getAttendanceGroupOptions() {
  const stages = getLinkedAttendanceStages();
  const stageGroups = await Promise.all(stages.map(async (stage) => {
    const result = await callAttendanceScript<{ groups: unknown }>({
      action: "getGroupOptions",
      stageId: stage.id,
    });
    if (!Array.isArray(result.groups) || result.groups.length !== stage.groups.length) {
      throw new Error(`قائمة مجموعات مرحلة ${stage.name} غير مكتملة.`);
    }
    const returnedGroups = new Map<AttendanceGroup, string>();
    for (const entry of result.groups) {
      if (
        !isRecord(entry) ||
        !isAttendanceGroup(entry.id) ||
        typeof entry.name !== "string" ||
        returnedGroups.has(entry.id)
      ) {
        throw new Error(`قائمة مجموعات مرحلة ${stage.name} غير صالحة.`);
      }
      returnedGroups.set(entry.id, entry.name);
    }
    return stage.groups.map((group) => {
      if (returnedGroups.get(group.id) !== group.name) {
        throw new Error(`قائمة مجموعات مرحلة ${stage.name} لا تطابق إعداد الخادم.`);
      }
      return getAttendanceGroupDetails(group.id);
    });
  }));
  return stageGroups.flat();
}

export async function getAttendanceGroups(stageId?: StageId) {
  if (stageId && !isAttendanceStage(stageId)) {
    throw new Error("مرحلة الحضور المطلوبة غير مرتبطة.");
  }
  const stages = getLinkedAttendanceStages().filter((stage) => !stageId || stage.id === stageId);
  const stageGroups = await Promise.all(stages.map(async (stage) => {
    const result = await callAttendanceScript<{ groups: unknown }>({
      action: "getGroups",
      stageId: stage.id,
    });
    if (!Array.isArray(result.groups)) {
      throw new Error("قائمة مجموعات الغياب غير صالحة.");
    }

    const expectedGroups = stage.groups.map((group) => group.id);
    const seenGroups = new Set<AttendanceGroup>();
    const groups = result.groups.map((entry) => {
      if (
        !isRecord(entry) ||
        !isAttendanceGroup(entry.id) ||
        !expectedGroups.includes(entry.id) ||
        typeof entry.name !== "string" ||
        !Array.isArray(entry.children)
      ) {
        throw new Error("صيغة مجموعات الغياب لا تطابق المرحلة المطلوبة.");
      }

      if (seenGroups.has(entry.id)) {
        throw new Error("تحتوي استجابة مجموعات الغياب على مجموعة مكررة.");
      }
      seenGroups.add(entry.id);

      const details = getAttendanceGroupDetails(entry.id);
      if (entry.name !== details.name) {
        throw new Error("اسم مجموعة الغياب لا يطابق إعداد المرحلة.");
      }
      const seenRows = new Set<number>();
      const children = entry.children.map((child) => {
        if (!isAttendanceRosterChild(child)) {
          throw new Error("تحتوي استجابة أسماء الأطفال على سجل غير صالح.");
        }
        if (seenRows.has(child.row)) throw new Error("يوجد رقم صف مكرر في مجموعة الغياب.");
        seenRows.add(child.row);
        return child;
      });
      return { ...details, children };
    });

    if (
      seenGroups.size !== expectedGroups.length ||
      expectedGroups.some((group) => !seenGroups.has(group))
    ) {
      throw new Error(
        `نسخة Apps Script المنشورة لمرحلة ${stage.name} لا تشمل جميع المجموعات المطلوبة.`,
      );
    }
    return groups;
  }));
  return stageGroups.flat();
}

export async function getAttendanceDates(group: AttendanceGroup): Promise<AttendanceDate[]> {
  const result = await callAttendanceScript<{ dates: unknown }>({
    action: "getDates",
    group,
  });
  if (!Array.isArray(result.dates)) throw new Error("قائمة تواريخ الغياب غير صالحة.");

  return parseAttendanceDates(result.dates);
}

function parseAttendanceDates(value: unknown): AttendanceDate[] {
  if (!Array.isArray(value)) throw new Error("قائمة تواريخ الغياب غير صالحة.");
  return value.map((entry) => {
    if (
      !isRecord(entry) ||
      typeof entry.value !== "string" ||
      !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(entry.value) ||
      !Number.isSafeInteger(entry.column) ||
      (entry.column as number) < 2
    ) {
      throw new Error("يوجد تاريخ غير صالح في رؤوس شيت الغياب.");
    }
    return { value: entry.value, column: entry.column as number };
  });
}

export async function getAttendanceDatesForGroups(
  requestedGroups: AttendanceGroup[],
): Promise<Array<{ group: AttendanceGroup; dates: AttendanceDate[] }>> {
  if (
    requestedGroups.length === 0 ||
    new Set(requestedGroups).size !== requestedGroups.length ||
    requestedGroups.some((group) => !isAttendanceGroup(group))
  ) {
    throw new Error("قائمة مجموعات الحضور المطلوبة غير صالحة.");
  }

  const groupsByStage = new Map<StageId, AttendanceGroup[]>();
  requestedGroups.forEach((group) => {
    const stageId = getAttendanceGroupDetails(group).stageId;
    groupsByStage.set(stageId, [...(groupsByStage.get(stageId) ?? []), group]);
  });
  const results = await Promise.all([...groupsByStage].map(async ([stageId, groups]) => {
    const response = await callAttendanceScript<{ groups: unknown }>({
      action: "getDatesForGroups",
      stageId,
      groups,
    });
    if (!Array.isArray(response.groups) || response.groups.length !== groups.length) {
      throw new Error("استجابة تواريخ المجموعات غير مكتملة.");
    }
    return response.groups.map((entry) => {
      if (
        !isRecord(entry) ||
        !isAttendanceGroup(entry.group) ||
        !groups.includes(entry.group)
      ) {
        throw new Error("استجابة تواريخ المجموعات غير صالحة.");
      }
      return {
        group: entry.group,
        dates: parseAttendanceDates(entry.dates),
      };
    });
  }));
  const byGroup = new Map(results.flat().map((entry) => [entry.group, entry]));
  return requestedGroups.map((group) => {
    const result = byGroup.get(group);
    if (!result) throw new Error("استجابة تواريخ المجموعات لا تشمل كل المجموعات.");
    return result;
  });
}

export async function getAttendanceForDate(group: AttendanceGroup, date: string) {
  const result = await callAttendanceScript<{
    group: unknown;
    date: unknown;
    children: unknown;
  }>({ action: "getAttendance", group, date });

  if (result.group !== group || result.date !== date || !Array.isArray(result.children)) {
    throw new Error("استجابة حضور المجموعة والتاريخ غير صالحة.");
  }
  return result.children.map((child) => {
    if (!isAttendanceChild(child)) throw new Error("يوجد سجل حضور غير صالح.");
    return child;
  });
}

export async function getAttendanceForDateForGroups(
  requestedGroups: AttendanceGroup[],
  date: string,
): Promise<Array<{ group: AttendanceGroup; children: AttendanceChild[] }>> {
  if (
    requestedGroups.length === 0 ||
    new Set(requestedGroups).size !== requestedGroups.length ||
    requestedGroups.some((group) => !isAttendanceGroup(group))
  ) {
    throw new Error("قائمة مجموعات الحضور المطلوبة غير صالحة.");
  }

  const groupsByStage = new Map<StageId, AttendanceGroup[]>();
  requestedGroups.forEach((group) => {
    const stageId = getAttendanceGroupDetails(group).stageId;
    groupsByStage.set(stageId, [...(groupsByStage.get(stageId) ?? []), group]);
  });
  const results = await Promise.all([...groupsByStage].map(async ([stageId, groups]) => {
    const response = await callAttendanceScript<{
      date: unknown;
      groups: unknown;
    }>({
      action: "getAttendanceForGroups",
      stageId,
      groups,
      date,
    });
    if (response.date !== date || !Array.isArray(response.groups) || response.groups.length !== groups.length) {
      throw new Error("استجابة الحضور للمجموعات غير مكتملة.");
    }
    return response.groups.map((entry) => {
      if (
        !isRecord(entry) ||
        !isAttendanceGroup(entry.group) ||
        !groups.includes(entry.group) ||
        !Array.isArray(entry.children)
      ) {
        throw new Error("استجابة الحضور للمجموعات غير صالحة.");
      }
      const children = entry.children.map((child) => {
        if (!isAttendanceChild(child)) throw new Error("يوجد سجل حضور غير صالح.");
        return child;
      });
      return { group: entry.group, children };
    });
  }));
  const byGroup = new Map(results.flat().map((entry) => [entry.group, entry]));
  return requestedGroups.map((group) => {
    const result = byGroup.get(group);
    if (!result) throw new Error("استجابة الحضور لا تشمل كل المجموعات المطلوبة.");
    return result;
  });
}

export async function getAttendanceHistory(group: AttendanceGroup) {
  const result = await callAttendanceScript<{
    group: unknown;
    dates: unknown;
    children: unknown;
  }>({ action: "getAttendanceHistory", group });

  return parseAttendanceHistory(group, result);
}

function parseAttendanceHistory(group: AttendanceGroup, result: unknown) {
  if (
    !isRecord(result) ||
    result.group !== group ||
    !Array.isArray(result.dates) ||
    !Array.isArray(result.children)
  ) {
    throw new Error("استجابة سجل الغياب المتكرر غير صالحة.");
  }

  const dates = result.dates.map((date) => {
    if (
      !isRecord(date) ||
      typeof date.value !== "string" ||
      !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date.value) ||
      !Number.isSafeInteger(date.column)
    ) {
      throw new Error("يوجد تاريخ غير صالح في سجل الحضور.");
    }
    return { value: date.value, column: date.column as number };
  });

  const children = result.children.map((child) => {
    if (
      !isRecord(child) ||
      !Number.isSafeInteger(child.row) ||
      typeof child.name !== "string" ||
      !child.name.trim() ||
      !isRecord(child.attendance)
    ) {
      throw new Error("يوجد سجل غياب متكرر غير صالح.");
    }
    const attendance: Record<string, boolean | null> = {};
    for (const date of dates) {
      const present = child.attendance[date.value];
      if (typeof present !== "boolean" && present !== null) {
        throw new Error("سجل الحضور التاريخي ناقص.");
      }
      attendance[date.value] = present;
    }
    return { row: child.row as number, name: child.name, attendance };
  });

  const details = getAttendanceGroupDetails(group);
  return { ...details, dates, children };
}

export async function getAttendanceHistories(
  requestedGroups: AttendanceGroup[],
): Promise<AttendanceGroupHistory[]> {
  if (
    requestedGroups.length === 0 ||
    new Set(requestedGroups).size !== requestedGroups.length ||
    requestedGroups.some((group) => !isAttendanceGroup(group))
  ) {
    throw new Error("قائمة مجموعات سجل الغياب المتكرر غير صالحة.");
  }

  const histories = new Map<AttendanceGroup, ReturnType<typeof parseAttendanceHistory>>();
  const groupsByStage = new Map<StageId, AttendanceGroup[]>();
  requestedGroups.forEach((group) => {
    const stageId = getAttendanceGroupDetails(group).stageId;
    groupsByStage.set(stageId, [...(groupsByStage.get(stageId) ?? []), group]);
  });
  await Promise.all([...groupsByStage].map(async ([stageId, groups]) => {
    const result = await callAttendanceScript<{ groups: unknown }>({
      action: "getAttendanceHistories",
      stageId,
      groups,
    });
    if (!Array.isArray(result.groups) || result.groups.length !== groups.length) {
      throw new Error("استجابة سجلات الغياب المتكرر غير مكتملة.");
    }

    for (const entry of result.groups) {
      if (
        !isRecord(entry) ||
        !isAttendanceGroup(entry.group) ||
        !groups.includes(entry.group) ||
        histories.has(entry.group)
      ) {
        throw new Error("تحتوي استجابة سجلات الغياب المتكرر على مجموعة غير صالحة.");
      }
      histories.set(entry.group, parseAttendanceHistory(entry.group, entry));
    }
  }));

  return requestedGroups.map((group) => {
    const history = histories.get(group);
    if (!history) throw new Error("استجابة سجلات الغياب المتكرر لا تحتوي كل المجموعات المطلوبة.");
    return {
      ...history,
      group,
      stageId: history.stageId,
      groupName: history.name,
      groupLabel: history.label,
    };
  });
}

export async function getStageChildren(stageId: StageId): Promise<StageChildrenResult> {
  const configuredStage = STAGES.find((stage) => stage.id === stageId);
  const attendanceStage = ATTENDANCE_STAGES.find((stage) => stage.id === stageId);
  if (!configuredStage?.sheetsLinked || !attendanceStage) {
    return {
      ok: false,
      error: `لم يتم ربط بيانات مرحلة ${configuredStage?.name ?? stageId} بعد.`,
    };
  }

  try {
    const result = await callAttendanceScript<{ groups: unknown }>({
      action: "getStageChildren",
      stageId,
    });
    const stage = attendanceStage;
    if (!Array.isArray(result.groups) || result.groups.length !== stage.groups.length) {
      throw new Error(`استجابة بيانات ${stage.name} لا تشمل كل الأقسام المطلوبة.`);
    }

    const parsedGroups = new Map<AttendanceGroup, FiveSixChildRow[]>();
    for (const entry of result.groups) {
      if (
        !isRecord(entry) ||
        !isAttendanceGroup(entry.id) ||
        !stage.groups.some((group) => group.id === entry.id) ||
        typeof entry.name !== "string" ||
        parsedGroups.has(entry.id) ||
        !Array.isArray(entry.rows)
      ) {
        throw new Error(`صيغة بيانات أقسام ${stage.name} غير صالحة.`);
      }

      const rows = entry.rows.map((row): FiveSixChildRow => {
        if (
          !Array.isArray(row) ||
          row.length !== 10 ||
          !row.every((cell): cell is string => typeof cell === "string")
        ) {
          throw new Error(`يوجد سجل غير صالح في بيانات ${stage.name}.`);
        }
        const [
          number,
          name,
          phone,
          homeNumber,
          street,
          area,
          birthDate,
          confessionFather,
          location,
          notes,
        ] = row;
        return [
          number,
          name,
          phone,
          homeNumber,
          street,
          area,
          birthDate,
          confessionFather,
          location,
          notes,
        ];
      });
      parsedGroups.set(entry.id, rows);
    }

    return {
      ok: true,
      groups: stage.groups.map((group) => {
        const rows = parsedGroups.get(group.id);
        if (!rows) throw new Error(`استجابة بيانات ${stage.name} لا تشمل كل الأقسام المطلوبة.`);
        return { id: group.id, name: group.name, rows };
      }),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error
        ? error.message
        : "تعذر تحميل بيانات المرحلة.",
    };
  }
}

export async function getStageChildrenForStages(
  stageIds: readonly StageId[],
): Promise<StageChildrenResult> {
  if (
    stageIds.length === 0 ||
    new Set(stageIds).size !== stageIds.length ||
    stageIds.some((stageId) => !isAttendanceStage(stageId))
  ) {
    return { ok: false, error: "لم يتم تحديد مراحل مرتبطة بمصادر بيانات صالحة." };
  }

  const results = await Promise.all(stageIds.map(getStageChildren));
  const failed = results.flatMap((result, index) =>
    result.ok ? [] : [`${ATTENDANCE_STAGES.find((stage) => stage.id === stageIds[index])?.name}: ${result.error}`],
  );
  if (failed.length > 0) {
    return { ok: false, error: failed.join(" ") };
  }

  return {
    ok: true,
    groups: results.flatMap((result) => result.ok ? result.groups : []),
  };
}

export async function saveAttendanceForDate(
  group: AttendanceGroup,
  date: string,
  presentRows: number[],
  actorRole: AttendanceWriterRole,
) {
  const result = await callAttendanceScript<{
    updated: unknown;
    message: unknown;
  }>({ action: "saveAttendance", group, date, presentRows, actorRole });
  if (!Number.isSafeInteger(result.updated) || typeof result.message !== "string") {
    throw new Error("لم يؤكد Apps Script نتيجة حفظ الحضور.");
  }
  return { updated: result.updated as number, message: result.message };
}

export async function saveAttendanceForChild(
  group: AttendanceGroup,
  date: string,
  row: number,
  present: boolean,
  actorRole: AttendanceWriterRole,
) {
  const result = await callAttendanceScript<{
    updated: unknown;
    message: unknown;
  }>({ action: "saveChildAttendance", group, date, row, present, actorRole });
  if (!Number.isSafeInteger(result.updated) || typeof result.message !== "string") {
    throw new Error("لم يؤكد Apps Script حفظ حالة حضور الطفل.");
  }
  return { updated: result.updated as number, message: result.message };
}

export async function addAttendancePerson(
  group: AttendanceGroup,
  person: AttendancePersonDetails,
  actorRole: AttendanceWriterRole,
) {
  const result = await callAttendanceScript<{ message: unknown }>({
    action: "addPerson",
    group,
    person,
    actorRole,
  });
  if (typeof result.message !== "string") {
    throw new Error("لم يؤكد Apps Script إضافة الشخص إلى الشيتين.");
  }
  return result.message;
}

export async function updateAttendancePerson(
  group: AttendanceGroup,
  currentName: string,
  person: AttendancePersonDetails,
  actorRole: AttendanceWriterRole,
) {
  const result = await callAttendanceScript<{ message: unknown }>({
    action: "updatePerson",
    group,
    currentName,
    person,
    actorRole,
  });
  if (typeof result.message !== "string") {
    throw new Error("لم يؤكد Apps Script تحديث بيانات الشخص.");
  }
  return result.message;
}

export async function removeAttendancePerson(
  group: AttendanceGroup,
  row: number,
  name: string,
  actorRole: AttendanceWriterRole,
) {
  const result = await callAttendanceScript<{ message: unknown }>({
    action: "removePerson",
    group,
    row,
    name,
    actorRole,
  });
  if (typeof result.message !== "string") {
    throw new Error("لم يؤكد Apps Script حذف الشخص من الشيتين.");
  }
  return result.message;
}

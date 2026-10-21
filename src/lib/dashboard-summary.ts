import "server-only";

import { type AuthProfile } from "@/lib/auth/profile";
import {
  getAccessibleAttendanceStages,
  getAccessibleAttendanceGroups,
  getAttendanceHistories,
  getStageChildrenForStages,
  type AttendanceGroupHistory,
  type StageChildrenGroup,
} from "@/lib/google-sheets/attendance.server";
import { getBirthdayEntriesFromGroups } from "@/lib/google-sheets/birthdays";
import { getVisitationRows } from "@/lib/google-sheets/visitation.server";

export type DashboardSummary = {
  dataAccessible: boolean;
  attendanceGroups: number;
  totalChildren?: number;
  birthdaysToday?: number;
  upcomingBirthdays?: number;
  visitationRecords?: number;
  repeatedAbsenceCount?: number;
  sourceError?: string;
  visitationError?: string;
  attendanceError?: string;
};

function getAccessibleGroups(profile: AuthProfile) {
  return getAccessibleAttendanceGroups(profile.role, profile.stageIds);
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
        entry.date !== null && entry.date.getUTCDay() === 5 && entry.date < currentFriday,
    )
    .sort((left, right) => right.date.getTime() - left.date.getTime());
}

function getRepeatedAbsenceCount(
  histories: AttendanceGroupHistory[],
  rosterGroups: StageChildrenGroup[],
) {
  const rostersByGroup = new Map(rosterGroups.map((group) => [group.id, group.rows]));
  const repeatedChildren = new Set<string>();

  for (const { group, dates, children } of histories) {
    const rosterRows = rostersByGroup.get(group);
    if (!rosterRows) {
      throw new Error("تعذر مطابقة مجموعة الغياب مع قائمة بيانات الأطفال.");
    }
    const rosterIndexesByName = new Map<string, number[]>();
    rosterRows.forEach((row, index) => {
      const name = row[1].trim().replace(/\s+/g, " ").toLocaleLowerCase("ar");
      const indexes = rosterIndexesByName.get(name) ?? [];
      indexes.push(index);
      rosterIndexesByName.set(name, indexes);
    });
    const streakDates = getStreakDates(dates.map((date) => date.value));

    for (const child of children) {
      let consecutiveAbsences = 0;
      for (const date of streakDates) {
        if (child.attendance[date.value] !== false) break;
        consecutiveAbsences += 1;
      }
      if (consecutiveAbsences < 2) continue;
      const name = child.name.trim().replace(/\s+/g, " ").toLocaleLowerCase("ar");
      const matchingIndexes = rosterIndexesByName.get(name) ?? [];
      if (matchingIndexes.length === 1) {
        repeatedChildren.add(`${group}:${matchingIndexes[0]}`);
      }
    }
  }

  return repeatedChildren.size;
}

export async function getDashboardSummary(profile: AuthProfile): Promise<DashboardSummary> {
  const accessibleStages = getAccessibleAttendanceStages(profile.role, profile.stageIds);
  const dataAccessible = accessibleStages.length > 0;
  if (!dataAccessible) {
    return {
      dataAccessible: false,
      attendanceGroups: 0,
    };
  }

  const [childrenOutcome, absenceOutcome] = await Promise.allSettled([
    getStageChildrenForStages(accessibleStages.map((stage) => stage.id)),
    getAttendanceHistories(getAccessibleGroups(profile)),
  ]);

  const summary: DashboardSummary = {
    dataAccessible: true,
    attendanceGroups: getAccessibleGroups(profile).length,
  };

  if (childrenOutcome.status === "fulfilled") {
    const childrenResult = childrenOutcome.value;
    if (childrenResult.ok) {
      const birthdayEntries = getBirthdayEntriesFromGroups(childrenResult.groups);
      const visitationResult = getVisitationRows(childrenResult.groups);
      summary.totalChildren = childrenResult.groups.reduce(
        (total, group) => total + group.rows.length,
        0,
      );
      summary.birthdaysToday = birthdayEntries.filter((entry) => entry.isToday).length;
      summary.upcomingBirthdays = birthdayEntries.filter((entry) => !entry.isToday).length;
      if (visitationResult.ok) {
        summary.visitationRecords = visitationResult.data.length;
      } else {
        summary.visitationError = visitationResult.error;
      }
    } else {
      summary.sourceError = childrenResult.error;
    }
  } else {
    summary.sourceError =
      childrenOutcome.reason instanceof Error
        ? childrenOutcome.reason.message
        : "تعذر تحميل بيانات الشيت.";
  }

  if (absenceOutcome.status === "rejected") {
    summary.attendanceError =
      absenceOutcome.reason instanceof Error
        ? absenceOutcome.reason.message
        : "تعذر تحميل بيانات الغياب.";
  } else if (childrenOutcome.status === "fulfilled" && childrenOutcome.value.ok) {
    try {
      summary.repeatedAbsenceCount = getRepeatedAbsenceCount(
        absenceOutcome.value,
        childrenOutcome.value.groups,
      );
    } catch (error) {
      summary.attendanceError =
        error instanceof Error ? error.message : "تعذر مطابقة بيانات الأطفال والغياب.";
    }
  } else {
    summary.attendanceError = "تعذر مطابقة بيانات الأطفال والغياب.";
  }

  return summary;
}

import "server-only";

import { parseBirthDate } from "@/lib/google-sheets/birth-date";
import type { FiveSixChildRow, FiveSixSheetData } from "@/types/google-sheets";

export type BirthdayEntry = {
  id: string;
  name: string;
  phone: string;
  sectionName: string;
  birthDate: string;
  nextBirthday: string;
  daysLeft: number;
  isToday: boolean;
};

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDateParts(date: Date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
}

function computeNextBirthday(date: Date): { nextBirthday: Date; daysLeft: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((item) => item.type === type)?.value);
  const today = new Date(Date.UTC(part("year"), part("month") - 1, part("day")));

  const { month: birthMonth, day: birthDay } = getDateParts(date);
  let targetYear = today.getUTCFullYear();

  let targetDate: Date;
  if (birthMonth === 1 && birthDay === 29 && !isLeapYear(targetYear)) {
    targetDate = new Date(Date.UTC(targetYear, 2, 1));
  } else {
    targetDate = new Date(Date.UTC(targetYear, birthMonth, birthDay));
  }

  if (targetDate < today) {
    targetYear += 1;
    if (birthMonth === 1 && birthDay === 29 && !isLeapYear(targetYear)) {
      targetDate = new Date(Date.UTC(targetYear, 2, 1));
    } else {
      targetDate = new Date(Date.UTC(targetYear, birthMonth, birthDay));
    }
  }

  const diffMs = targetDate.getTime() - today.getTime();
  const daysLeft = Math.round(diffMs / 86400000);

  return { nextBirthday: targetDate, daysLeft };
}

export function getBirthdayEntries(data: FiveSixSheetData): BirthdayEntry[] {
  return getBirthdayEntriesFromGroups(
    data.sections.map((section) => ({
      id: section.id,
      name: section.name,
      rows: section.rows,
    })),
  );
}

export function getBirthdayEntriesFromGroups(
  groups: ReadonlyArray<{ id: string; name: string; rows: FiveSixChildRow[] }>,
): BirthdayEntry[] {
  return groups
    .flatMap((section) =>
      section.rows.map((row) => {
        const rawDate = row[6] ?? "";
        const birthDate = parseBirthDate(rawDate);
        if (!birthDate) return null;

        const { nextBirthday, daysLeft } = computeNextBirthday(birthDate);

        return {
          id: `${section.id}-${row[0] ?? "row"}-${row[1] ?? "name"}`,
          name: String(row[1] ?? "").trim(),
          phone: String(row[2] ?? "").trim(),
          sectionName: section.name,
          birthDate: rawDate.trim(),
          nextBirthday: nextBirthday.toISOString(),
          daysLeft,
          isToday: daysLeft === 0,
        };
      }),
    )
    .filter((entry): entry is BirthdayEntry => Boolean(entry && entry.name));
}

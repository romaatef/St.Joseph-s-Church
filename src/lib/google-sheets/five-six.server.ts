import "server-only";

import type {
  FiveSixChildRow,
  FiveSixChildrenSection,
  FiveSixSectionId,
  FiveSixSheetData,
} from "@/types/google-sheets";
import { normalizeBirthDate } from "@/lib/google-sheets/birth-date";

const FIVE_SIX_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz8JyBYukjxQ3pF07aXGiN2o50GopNygrckcn1gVhAh8F8g_zAZRrfE2_WMQZ_mWmIBQg/exec";

const sectionNames: Record<FiveSixSectionId, string> = {
  "fifth-girls": "خامسة بنات",
  "fifth-boys": "خامسة ولاد",
  "sixth-girls": "سادسة بنات",
  "sixth-boys": "سادسة ولاد",
};

const sectionAliases: Record<FiveSixSectionId, readonly string[]> = {
  "fifth-girls": ["خامسة بنات", "خامسة بنات ", "خامسة بنات ", "خامسه بنات"],
  "fifth-boys": ["خامسه ولاد", "خامسة ولاد", "خامسه ولاد ", "خامسة ولاد "],
  "sixth-girls": ["ستة بنات", "سته بنات", "سادسة بنات", "سادسه بنات", "سادسة بنات ", "سادسه بنات "],
  "sixth-boys": ["سته ولاد", "ستة ولاد", "سادسة ولاد", "سادسه ولاد", "سادسة ولاد ", "سادسه ولاد "],
};

export type FiveSixSheetResult =
  | { ok: true; data: FiveSixSheetData }
  | { ok: false; error: string };

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return String(value);
}

function normalizeRow(value: unknown): FiveSixChildRow | null {
  if (!Array.isArray(value)) return null;

  const cells = value.slice(0, 10).map((cell, index) =>
    index === 6 ? normalizeBirthDate(cell) : normalizeCell(cell),
  );
  while (cells.length < 10) cells.push("");

  if (cells.length !== 10) return null;

  return cells as unknown as FiveSixChildRow;
}

function getHeaderIndex(rows: FiveSixChildRow[]): number {
  return rows.findIndex((row) => {
    const firstCells = row.slice(0, 10).map((cell) => cell.trim());
    return (
      firstCells[0] === "الرقم" ||
      firstCells[0] === "رقم" ||
      firstCells[1] === "الأسم" ||
      firstCells[1] === "الاسم"
    );
  });
}

function identifySection(value: string): FiveSixSectionId | null {
  const heading = value.trim().replace(/\s+/g, " ");
  for (const [id, aliases] of Object.entries(sectionAliases) as [
    FiveSixSectionId,
    readonly string[],
  ][]) {
    if (aliases.some((alias) => alias.trim() === heading)) return id;
  }
  return null;
}

function isSectionSeparator(row: FiveSixChildRow) {
  return row[0].trim().length > 0 && row.slice(1).every((cell) => !cell.trim());
}

function parseSheetResponse(value: unknown): FiveSixSheetData | null {
  if (!value || typeof value !== "object" || !("success" in value) || !("data" in value)) {
    return null;
  }

  const payload = value as { success: unknown; data: unknown };
  if (payload.success !== true || !Array.isArray(payload.data)) return null;

  const rows: FiveSixChildRow[] = [];
  for (const row of payload.data) {
    const normalizedRow = normalizeRow(row);
    if (!normalizedRow) return null;
    rows.push(normalizedRow);
  }

  const headerIndex = getHeaderIndex(rows);
  if (headerIndex < 0) return null;

  const headers = rows[headerIndex];
  const sections = new Map<FiveSixSectionId, FiveSixChildrenSection>();
  const servants: FiveSixChildRow[] = [];
  const allRows: FiveSixChildRow[] = [];
  let activeSection: FiveSixSectionId | "servants" | null = null;

  for (let index = headerIndex + 1; index < rows.length; index += 1) {
    const row = rows[index];
    if (!row.some((cell) => cell.trim())) continue;

    if (isSectionSeparator(row)) {
      const sectionHeading = row[0].trim().replace(/\s+/g, " ");
      activeSection = sectionHeading === "خدام" ? "servants" : identifySection(sectionHeading);
      if (activeSection && activeSection !== "servants" && !sections.has(activeSection)) {
        sections.set(activeSection, {
          id: activeSection,
          name: sectionNames[activeSection],
          rows: [],
        });
      }
      continue;
    }

    if (activeSection === "servants") {
      servants.push(row);
    } else {
      allRows.push(row);
      if (activeSection) sections.get(activeSection)?.rows.push(row);
    }
  }

  return {
    headers,
    sections: [...sections.values()],
    servants,
    allRows,
  };
}

export async function getFiveSixChildren(): Promise<FiveSixSheetResult> {
  let response: Response;
  try {
    response = await fetch(FIVE_SIX_APPS_SCRIPT_URL, {
      cache: "no-store",
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return {
      ok: false,
      error: "تعذر الاتصال بمصدر بيانات خامسة وسادسة. حاول تحديث الصفحة.",
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: `تعذر تحميل بيانات خامسة وسادسة (رمز الاستجابة ${response.status}).`,
    };
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return {
      ok: false,
      error: "استجابة مصدر بيانات خامسة وسادسة ليست بصيغة JSON صالحة.",
    };
  }

  const data = parseSheetResponse(payload);
  if (!data) {
    return {
      ok: false,
      error: "صيغة بيانات خامسة وسادسة لا تطابق الأعمدة المتوقعة في الشيت.",
    };
  }

  return { ok: true, data };
}

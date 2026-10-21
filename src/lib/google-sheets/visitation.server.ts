import "server-only";

import {
  getStageChildrenForStages,
} from "@/lib/google-sheets/attendance.server";
import type { StageId } from "@/config/stages";

export type VisitationRow = {
  name: string;
  phone: string;
  homeNumber: string;
  street: string;
  area: string;
};

export type VisitationResult =
  | { ok: true; data: VisitationRow[] }
  | { ok: false; error: string };

function normalizeText(value: string): string {
  return value
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getVisitationRows(
  groups: ReadonlyArray<{ rows: readonly (readonly string[])[] }>,
): VisitationResult {
  const data = groups.flatMap((group) =>
    group.rows.flatMap((row) => {
      const name = normalizeText(row[1] ?? "");
      if (!name) return [];

      const area = normalizeText(row[5] ?? "");
      const street = normalizeText(row[4] ?? "");

      return [
        {
          name,
          phone: normalizeText(row[2] ?? ""),
          homeNumber: normalizeText(row[3] ?? ""),
          street: street || "غير محدد",
          area: area || "غير محدد",
        },
      ];
    }),
  );

  return { ok: true, data };
}

export async function getVisitationSheet(stageIds: readonly StageId[]): Promise<VisitationResult> {
  const sheetResult = await getStageChildrenForStages(stageIds);
  if (!sheetResult.ok) {
    return sheetResult;
  }
  return getVisitationRows(sheetResult.groups);
}

export const STAGE_IDS = [
  "had-nursery",
  "kg",
  "g1-g2",
  "g3-g4",
  "g5-g6",
  "prep",
  "secondary",
  "servants",
] as const;

export type StageId = (typeof STAGE_IDS)[number];

export function isStageId(value: string): value is StageId {
  return STAGE_IDS.some((stageId) => stageId === value);
}

export type Stage = {
  id: StageId;
  name: string;
  order: number;
  sheetsLinked: boolean;
};

export const STAGES: readonly Stage[] = [
  { id: "had-nursery", name: "حضانة الحد", order: 1, sheetsLinked: false },
  { id: "kg", name: "K.G", order: 2, sheetsLinked: true },
  { id: "g1-g2", name: "أولى وتانية", order: 3, sheetsLinked: true },
  { id: "g3-g4", name: "تالتة ورابعة", order: 4, sheetsLinked: true },
  { id: "g5-g6", name: "خامسة وسادسة", order: 5, sheetsLinked: true },
  { id: "prep", name: "إعدادي", order: 6, sheetsLinked: true },
  { id: "secondary", name: "ثانوي", order: 7, sheetsLinked: true },
  { id: "servants", name: "الخدام", order: 8, sheetsLinked: true },
] as const;

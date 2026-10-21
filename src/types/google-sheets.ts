export type FiveSixChildRow = readonly [
  number: string,
  name: string,
  phoneNumber: string,
  homeNumber: string,
  street: string,
  area: string,
  birthDate: string,
  confessionFather: string,
  location: string,
  notes: string,
];

export type FiveSixSectionId =
  | "fifth-girls"
  | "fifth-boys"
  | "sixth-girls"
  | "sixth-boys";

export type FiveSixChildrenSection = {
  id: FiveSixSectionId;
  name: string;
  rows: FiveSixChildRow[];
};

export type FiveSixSheetData = {
  headers: FiveSixChildRow;
  sections: FiveSixChildrenSection[];
  servants: FiveSixChildRow[];
  allRows: FiveSixChildRow[];
};

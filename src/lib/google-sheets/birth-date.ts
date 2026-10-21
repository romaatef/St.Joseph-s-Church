function toWesternDigits(value: string) {
  return value.replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776));
}

function createDate(year: number, month: number, day: number): Date | null {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function parseBirthDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return createDate(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const serialDay = Math.floor(value);
    const date = new Date(Date.UTC(1899, 11, 30 + serialDay));
    return createDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  }

  if (typeof value !== "string") return null;
  const normalized = toWesternDigits(value.trim());
  if (!normalized) return null;

  if (/^\d{5,6}$/.test(normalized)) {
    return parseBirthDate(Number(normalized));
  }

  const yearFirst = normalized.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (yearFirst) {
    return createDate(Number(yearFirst[1]), Number(yearFirst[2]), Number(yearFirst[3]));
  }

  const dayFirst = normalized.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (dayFirst) {
    const year = Number(dayFirst[3]);
    return createDate(year < 100 ? 2000 + year : year, Number(dayFirst[2]), Number(dayFirst[1]));
  }

  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return createDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function normalizeBirthDate(value: unknown): string {
  const date = parseBirthDate(value);
  if (!date) return typeof value === "string" ? toWesternDigits(value.trim()) : "";
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
}

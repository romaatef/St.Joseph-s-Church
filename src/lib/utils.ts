import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizePhoneNumber(value: string) {
  return value
    .replace(/[٠-٩۰-۹]/g, (digit) => {
      const code = digit.charCodeAt(0);
      const zero = code >= 0x06f0 ? 0x06f0 : 0x0660;
      return String(code - zero);
    })
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "");
}

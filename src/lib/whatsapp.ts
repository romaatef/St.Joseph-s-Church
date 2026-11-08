export function normalizeWhatsAppNumber(value: string): string | null {
  let digits = value
    .replace(/[٠-٩۰-۹]/g, (digit) => {
      const code = digit.charCodeAt(0);
      const zero = code >= 0x06f0 ? 0x06f0 : 0x0660;
      return String(code - zero);
    })
    .replace(/\D/g, "");

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^01\d{9}$/.test(digits)) digits = `2${digits}`;

  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}

"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import type { FiveSixChildRow } from "@/types/google-sheets";
import { normalizePhoneNumber } from "@/lib/utils";
import { Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

const birthDateFormatter = new Intl.DateTimeFormat("ar-EG", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatBirthDate(value: string) {
  const normalized = value
    .trim()
    .replace(/[٠-٩۰-۹]/g, (digit) => {
      const code = digit.charCodeAt(0);
      const zero = code >= 0x06f0 ? 0x06f0 : 0x0660;
      return String(code - zero);
    });
  if (!normalized) return normalized;

  let year: number;
  let month: number;
  let day: number;
  const slashDate = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  const isoDate = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:T.*)?$/);

  if (slashDate) {
    day = Number(slashDate[1]);
    month = Number(slashDate[2]);
    year = Number(slashDate[3]);
    if (year < 100) year += 2000;
  } else if (isoDate) {
    year = Number(isoDate[1]);
    month = Number(isoDate[2]);
    day = Number(isoDate[3]);
  } else if (/^\d+(?:\.\d+)?$/.test(normalized)) {
    const serial = Number(normalized);
    if (!Number.isFinite(serial)) return value;
    const date = new Date(Date.UTC(1899, 11, 30) + Math.floor(serial) * 86_400_000);
    if (!Number.isFinite(date.getTime())) return value;
    return birthDateFormatter.format(date);
  } else {
    return value;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return value;
  }
  return birthDateFormatter.format(date);
}

export function ServantsView({ servants }: { servants: FiveSixChildRow[] }) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase("ar");

  const filteredServants = useMemo(() => {
    if (!query) return servants;
    const normalizedPhoneQuery = normalizePhoneNumber(query);

    return servants.filter((servant) => {
      const searchableValues = [
        servant[1],
        servant[2],
        servant[3],
        servant[4],
        servant[5],
        servant[6],
        servant[7],
        servant[8],
        servant[9],
      ];

      return searchableValues.some(
        (value) =>
          value.toLocaleLowerCase("ar").includes(query) ||
          (normalizedPhoneQuery.length > 0 &&
            normalizePhoneNumber(value).includes(normalizedPhoneQuery)),
      );
    });
  }, [query, servants]);

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <label className="relative block">
          <span className="sr-only">بحث</span>
          <Search
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث بالاسم أو الهاتف أو العنوان"
            aria-label="بحث في بيانات الخدام"
            className="h-11 w-full rounded-xl border border-border bg-background pr-10 text-right text-sm outline-none transition focus:border-primary"
          />
        </label>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <CardTitle>بيانات الخدام</CardTitle>
            <CardDescription>{filteredServants.length} خادم</CardDescription>
          </div>
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-sm font-medium text-primary-dark hover:underline"
            >
              مسح البحث
            </button>
          ) : null}
        </div>

        {filteredServants.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            لا توجد نتائج مطابقة للبحث.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServants.map((servant, index) => {
              const details = ([
                ["رقم البيت", servant[3]],
                ["الشارع", servant[4]],
                ["المنطقة", servant[5]],
                ["تاريخ الميلاد", formatBirthDate(servant[6])],
                ["أب الاعتراف", servant[7]],
                ["الموقع", servant[8]],
                ["ملاحظات", servant[9]],
              ] as Array<[string, string]>).filter(([, value]) => value.trim());

              return (
                <li
                  key={`${servant[0]}-${servant[1]}-${index}`}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {servant[1] || "اسم غير متوفر"}
                      </p>
                      {servant[2] ? (
                        <p className="mt-1 text-sm text-muted-foreground">{servant[2]}</p>
                      ) : null}
                    </div>
                    {servant[2] ? (
                      <a
                        href={`tel:${normalizePhoneNumber(servant[2])}`}
                        aria-label={`اتصال مباشر بـ ${servant[1]}`}
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark"
                      >
                        <Phone className="size-4" aria-hidden />
                      </a>
                    ) : null}
                  </div>

                  {details.length > 0 ? (
                    <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                      {details.map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-3">
                          <dt>{label}</dt>
                          <dd className="text-left text-foreground">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {servant[2] ? (
                    <div className="mt-4 flex justify-end">
                      <a
                        href={`tel:${normalizePhoneNumber(servant[2])}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                      >
                        <Phone className="size-4" aria-hidden />
                        اتصال مباشر
                      </a>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

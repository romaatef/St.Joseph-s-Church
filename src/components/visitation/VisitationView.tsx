"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import type { VisitationResult, VisitationRow } from "@/lib/google-sheets/visitation.server";
import { normalizePhoneNumber } from "@/lib/utils";
import { ArrowLeft, Building2, MapPin, Phone, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type HierarchyMap = {
  areas: Array<{
    name: string;
    count: number;
    streets: Array<{
      name: string;
      count: number;
      records: VisitationRow[];
    }>;
  }>;
};

type VisitationViewProps = {
  result: VisitationResult;
};

function normalizeQuery(value: string) {
  return value.trim().toLocaleLowerCase("ar");
}

function isRecordMatch(record: VisitationRow, query: string) {
  if (!query) return true;
  const haystack = [record.name, record.phone, record.street, record.homeNumber, record.area]
    .join(" ")
    .toLocaleLowerCase("ar");
  return haystack.includes(query);
}

function getAreaGroupName(area: string) {
  const normalizedArea = area.replace(/ة/g, "ه").toLocaleLowerCase("ar");
  const knownAreas = ["الملكة", "سوزان", "المزرعه", "القصاص"];
  const matchedArea = knownAreas.find((name) =>
    normalizedArea.includes(name.replace(/ة/g, "ه")),
  );

  if (matchedArea === "المزرعه") return "المزرعة";
  return matchedArea ?? "مناطق بعيدة";
}

function buildHierarchy(records: VisitationRow[]): HierarchyMap {
  const areaMap = new Map<string, Map<string, VisitationRow[]>>();

  for (const record of records) {
    const areaName = getAreaGroupName(record.area);
    const streetName = record.street || "غير محدد";

    if (!areaMap.has(areaName)) {
      areaMap.set(areaName, new Map());
    }

    const streetMap = areaMap.get(areaName)!;
    if (!streetMap.has(streetName)) {
      streetMap.set(streetName, []);
    }

    streetMap.get(streetName)!.push(record);
  }

  const areas = Array.from(areaMap.entries())
    .map(([name, streetMap]) => ({
      name,
      count: Array.from(streetMap.values()).reduce((sum, rows) => sum + rows.length, 0),
      streets: Array.from(streetMap.entries())
        .map(([streetName, rows]) => ({
          name: streetName,
          count: rows.length,
          records: rows,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { areas };
}

export function VisitationView({ result }: VisitationViewProps) {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<VisitationRow | null>(null);

  const query = normalizeQuery(search);

  useEffect(() => {
    if (!selectedRecord) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedRecord(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRecord]);

  const hierarchy = useMemo(() => {
    if (!result.ok) return { areas: [] };
    return buildHierarchy(result.data);
  }, [result]);

  const visibleAreas = useMemo(() => {
    if (!query) return hierarchy.areas;

    return hierarchy.areas
      .map((area) => ({
        ...area,
        streets: area.streets
          .map((street) => ({
            ...street,
            records: street.records.filter(
              (record) =>
                area.name.toLocaleLowerCase("ar").includes(query) ||
                isRecordMatch(record, query),
            ),
          }))
          .filter((street) => street.records.length > 0),
      }))
      .map((area) => ({
        ...area,
        count: area.streets.reduce((sum, street) => sum + street.records.length, 0),
      }))
      .filter((area) => area.count > 0);
  }, [hierarchy, query]);

  const activeArea =
    selectedArea && visibleAreas.find((area) => area.name === selectedArea)
      ? visibleAreas.find((area) => area.name === selectedArea)
      : selectedArea
        ? hierarchy.areas.find((area) => area.name === selectedArea) ?? null
        : null;

  const streetOptions = useMemo(() => {
    if (!activeArea) return [];
    const areaMatches = activeArea.name.toLocaleLowerCase("ar").includes(query);
    const areaStreets = activeArea.streets.filter((street) => {
      if (!query || areaMatches) return true;
      return street.records.some((record) => isRecordMatch(record, query));
    });

    return areaStreets
      .map((street) => ({
        ...street,
        count: areaMatches
          ? street.records.length
          : street.records.filter((record) => isRecordMatch(record, query)).length,
      }))
      .filter((street) => street.count > 0);
  }, [activeArea, query]);

  const people = useMemo(() => {
    if (!selectedArea || !selectedStreet) return [];
    const area = hierarchy.areas.find((entry) => entry.name === selectedArea);
    const street = area?.streets.find((entry) => entry.name === selectedStreet);
    if (!street) return [];

    return street.records.filter(
      (record) =>
        selectedArea.toLocaleLowerCase("ar").includes(query) ||
        isRecordMatch(record, query),
    );
  }, [hierarchy, query, selectedArea, selectedStreet]);

  if (!result.ok) {
    return (
      <Card role="alert">
        <CardTitle>تعذر تحميل قوائم الافتقاد</CardTitle>
        <CardDescription>{result.error}</CardDescription>
      </Card>
    );
  }

  if (result.data.length === 0) {
    return (
      <Card>
        <CardTitle>لا توجد بيانات</CardTitle>
        <CardDescription>
          لم تُعثر على سجلات في قوائم الافتقاد حتى الآن. تأكد من ربط رابط Google Sheets الصحيح.
        </CardDescription>
      </Card>
    );
  }

  const showAreas = !selectedArea;
  const showStreets = Boolean(selectedArea) && !selectedStreet;

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <label className="relative block">
          <span className="sr-only">بحث</span>
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="search"
            placeholder="ابحث بالاسم أو الهاتف أو رقم البيت أو الشارع أو المنطقة"
            aria-label="بحث في قوائم الافتقاد"
            className="h-11 w-full rounded-xl border border-border bg-background pr-10 text-right text-sm outline-none transition focus:border-primary"
          />
        </label>
      </Card>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <button type="button" onClick={() => { setSelectedArea(null); setSelectedStreet(null); setSelectedRecord(null); }} className="font-medium text-primary-dark hover:underline">
            قوائم الافتقاد
          </button>
          {selectedArea ? (
            <>
              <ArrowLeft className="size-4" aria-hidden />
              <button type="button" onClick={() => { setSelectedStreet(null); setSelectedRecord(null); }} className="font-medium text-primary-dark hover:underline">
                {selectedArea}
              </button>
            </>
          ) : null}
          {selectedStreet ? (
            <>
              <ArrowLeft className="size-4" aria-hidden />
              <span className="font-medium text-foreground">{selectedStreet}</span>
            </>
          ) : null}
        </div>
      </Card>

      {showAreas ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleAreas.length === 0 ? (
            <Card className="sm:col-span-2 xl:col-span-3 p-4">
              <CardTitle>لا توجد مناطق مطابقة</CardTitle>
              <CardDescription>لا توجد بيانات تنطبق على البحث الحالي في أي منطقة.</CardDescription>
            </Card>
          ) : (
            visibleAreas.map((area) => (
              <button
                key={area.name}
                type="button"
                onClick={() => {
                  setSelectedArea(area.name);
                  setSelectedStreet(null);
                  setSelectedRecord(null);
                }}
                className="rounded-2xl border border-border bg-surface p-4 text-right shadow-soft transition hover:border-primary/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-primary-dark">
                    <Building2 className="size-4" aria-hidden />
                    <span className="font-semibold">{area.name}</span>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {area.count} شخص
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {area.streets.length} شارع
                </p>
              </button>
            ))
          )}
        </div>
      ) : null}

      {showStreets ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <CardTitle>{selectedArea}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => { setSelectedArea(null); setSelectedStreet(null); setSelectedRecord(null); }}>
              العودة للمناطق
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {streetOptions.length === 0 ? (
              <Card className="sm:col-span-2 xl:col-span-3 p-4">
                <CardTitle>لا توجد شوارع مطابقة</CardTitle>
                <CardDescription>لا توجد شوارع في هذه المنطقة تنطبق على البحث الحالي.</CardDescription>
              </Card>
            ) : (
              streetOptions.map((street) => (
                <button
                  key={street.name}
                  type="button"
                  onClick={() => {
                    setSelectedStreet(street.name);
                    setSelectedRecord(null);
                  }}
                  className="rounded-2xl border border-border bg-surface p-4 text-right shadow-soft transition hover:border-primary/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-primary-dark">
                      <MapPin className="size-4" aria-hidden />
                      <span className="font-semibold">{street.name}</span>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                      {street.count} شخص
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}

      {!showAreas && !showStreets && selectedArea && selectedStreet ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{selectedStreet}</CardTitle>
              <CardDescription>{selectedArea}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setSelectedStreet(null); setSelectedRecord(null); }}>
                العودة للشوارع
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setSelectedArea(null); setSelectedStreet(null); setSelectedRecord(null); }}>
                العودة للمناطق
              </Button>
            </div>
          </div>

          {people.length === 0 ? (
            <Card>
              <CardTitle>لا توجد بيانات في هذا الشارع</CardTitle>
              <CardDescription>لا يوجد شخص في هذا الشارع يطابق البحث الحالي.</CardDescription>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {people.map((person, index) => (
                <Card key={`${person.name}-${person.phone}-${person.homeNumber}-${index}`} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{person.name || "اسم غير متوفر"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{selectedArea} • {selectedStreet}</p>
                    </div>
                    {person.phone ? (
                      <a href={`tel:${normalizePhoneNumber(person.phone)}`} aria-label={`اتصال مباشر بـ ${person.name}`} className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                        <Phone className="size-4" aria-hidden />
                      </a>
                    ) : null}
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center justify-between gap-3">
                      <span>رقم التليفون</span>
                      <span className="font-medium text-foreground">{person.phone || "—"}</span>
                    </p>
                    <p className="flex items-center justify-between gap-3">
                      <span>رقم البيت</span>
                      <span className="font-medium text-foreground">{person.homeNumber || "—"}</span>
                    </p>
                    <p className="flex items-center justify-between gap-3">
                      <span>المنطقة</span>
                      <span className="font-medium text-foreground">{person.area || "—"}</span>
                    </p>
                    <p className="flex items-center justify-between gap-3">
                      <span>الشارع</span>
                      <span className="font-medium text-foreground">{person.street || "—"}</span>
                    </p>
                  </div>

                  {person.phone ? (
                    <div className="mt-4 flex justify-end">
                      <a href={`tel:${normalizePhoneNumber(person.phone)}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                        <Phone className="size-4" aria-hidden />
                        اتصال مباشر
                      </a>
                    </div>
                  ) : null}
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setSelectedRecord(person)}>
                      تفاصيل السجل
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {selectedRecord ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-foreground/30 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedRecord(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="visitation-dialog-title"
            className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">بيانات الشخص</p>
                <CardTitle id="visitation-dialog-title" className="mt-1">{selectedRecord.name || "اسم غير متوفر"}</CardTitle>
              </div>
              <button type="button" onClick={() => setSelectedRecord(null)} className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80" aria-label="إغلاق التفاصيل">
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <p className="flex items-center justify-between gap-3"><span>رقم الهاتف</span><span>{selectedRecord.phone || "—"}</span></p>
              <p className="flex items-center justify-between gap-3"><span>رقم البيت</span><span>{selectedRecord.homeNumber || "—"}</span></p>
              <p className="flex items-center justify-between gap-3"><span>المنطقة</span><span>{selectedRecord.area || "—"}</span></p>
              <p className="flex items-center justify-between gap-3"><span>الشارع</span><span>{selectedRecord.street || "—"}</span></p>
            </div>
            {selectedRecord.phone ? (
              <div className="mt-5 flex justify-end">
                <a href={`tel:${normalizePhoneNumber(selectedRecord.phone)}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
                  <Phone className="size-4" aria-hidden />
                  اتصال مباشر
                </a>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}

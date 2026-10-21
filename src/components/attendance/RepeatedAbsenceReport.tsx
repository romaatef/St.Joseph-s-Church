"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import type { AttendanceGroup } from "@/lib/google-sheets/attendance.server";
import { normalizePhoneNumber } from "@/lib/utils";
import { Phone } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

type RepeatedAbsenceEntry = {
  group: AttendanceGroup;
  row: number;
  groupLabel: string;
  name: string;
  phone: string;
  consecutiveAbsences: number;
  absentDates: string[];
};

export function RepeatedAbsenceReport() {
  const [report, setReport] = useState<RepeatedAbsenceEntry[]>([]);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/attendance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "getRepeatedAbsence" }),
    })
      .then(async (response) => {
        const result: unknown = await response.json();
        if (!response.ok) {
          const message =
            result && typeof result === "object" && "error" in result && typeof result.error === "string"
              ? result.error
              : "تعذر تحميل تقرير الغياب المتكرر.";
          throw new Error(message);
        }
        if (
          !result ||
          typeof result !== "object" ||
          !("report" in result) ||
          !Array.isArray(result.report)
        ) {
          throw new Error("استجابة تقرير الغياب المتكرر غير صالحة.");
        }
        return result.report as RepeatedAbsenceEntry[];
      })
      .then((entries) => {
        if (active) setReport(entries);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "تعذر تحميل تقرير الغياب المتكرر.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <Card role="alert" className="p-4">
        <CardTitle>تعذر تحميل التقرير</CardTitle>
        <CardDescription>{error}</CardDescription>
      </Card>
    );
  }

  if (loading) {
    return <Card className="p-4"><CardDescription className="mt-0">جارٍ تحميل سجل الجمعات السابقة...</CardDescription></Card>;
  }

  if (report.length === 0) {
    return (
      <Card className="p-4">
        <CardTitle>لا يوجد غياب متتالٍ متكرر</CardTitle>
        <CardDescription>
          لا توجد أسماء غابت في جمعتين فائتتين متتاليتين أو أكثر. الجمعة الحالية مستبعدة من التقرير.
        </CardDescription>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border p-4">
        <CardTitle>الأطفال ذوو الغياب المتتالي</CardTitle>
        <CardDescription>
          يحتسب التقرير الجمعات السابقة فقط، ويستبعد جمعة الأسبوع الحالي.
        </CardDescription>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-right text-sm">
          <thead className="bg-muted/70 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-3 font-semibold">الاسم</th>
              <th className="px-3 py-3 font-semibold">المجموعة</th>
              <th className="px-3 py-3 font-semibold">مرات الغياب</th>
              <th className="px-3 py-3 font-semibold">التفاصيل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {report.map((entry) => {
              const entryId = `${entry.group}-${entry.row}`;
              const isExpanded = expandedEntries.has(entryId);
              const detailsId = `absence-details-${encodeURIComponent(entryId)}`;

              return (
                <Fragment key={entryId}>
                  <tr key={entryId}>
                    <td className="px-3 py-3 font-medium">{entry.name}</td>
                    <td className="px-3 py-3">{entry.groupLabel}</td>
                    <td className="px-3 py-3">{entry.consecutiveAbsences}</td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        onClick={() =>
                          setExpandedEntries((current) => {
                            const updated = new Set(current);
                            if (updated.has(entryId)) updated.delete(entryId);
                            else updated.add(entryId);
                            return updated;
                          })
                        }
                        className="font-medium text-primary-dark hover:underline"
                      >
                        {isExpanded ? "إخفاء التفاصيل" : "التفاصيل"}
                      </button>
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr key={`${entryId}-details`}>
                      <td id={detailsId} colSpan={4} className="bg-muted/30 px-4 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">
                              تواريخ الغياب ({entry.absentDates.length})
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {entry.absentDates.join("، ")}
                            </p>
                          </div>
                          {entry.phone ? (
                            <a
                              href={`tel:${normalizePhoneNumber(entry.phone)}`}
                              aria-label={`اتصال مباشر بـ ${entry.name}`}
                              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                            >
                              <Phone className="size-4" aria-hidden />
                              اتصال
                            </a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

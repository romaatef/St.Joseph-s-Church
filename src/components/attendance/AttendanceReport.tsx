"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import type {
  AttendanceGroup,
  AttendanceGroupHistory,
} from "@/lib/google-sheets/attendance.server";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type AttendanceReportProps = {
  groups: AttendanceGroupHistory[];
  initialGroup?: AttendanceGroup;
  initialDate?: string;
};

type ReportRow = {
  group: AttendanceGroup;
  row: number;
  groupLabel: string;
  name: string;
  selectedAttendance: boolean | null;
  present: number;
  absent: number;
  total: number;
};

type RingProps = {
  label: string;
  value: number;
  total: number;
  color: string;
};

const CIRCLE_LENGTH = 2 * Math.PI * 46;

function dateKey(value: string) {
  const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return "";
  return `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

function getTodayKeyInCairo() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function formatPercent(value: number, total: number) {
  if (total === 0) return "—";
  return `${((value / total) * 100).toFixed(1)}٪`;
}

function PercentageRing({ label, value, total, color }: RingProps) {
  const percent = total === 0 ? 0 : (value / total) * 100;
  const dashLength = (percent / 100) * CIRCLE_LENGTH;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative size-32"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number(percent.toFixed(1))}
      >
        <svg viewBox="0 0 112 112" className="size-full -rotate-90" aria-hidden="true">
          <circle
            cx="56"
            cy="56"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-muted"
          />
          <circle
            cx="56"
            cy="56"
            r="46"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dashLength} ${CIRCLE_LENGTH}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
          {formatPercent(value, total)}
        </span>
      </div>
      <span className="text-center text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{value} من {total}</span>
    </div>
  );
}

export function AttendanceReport({
  groups,
  initialGroup,
  initialDate,
}: AttendanceReportProps) {
  const dates = useMemo(
    () => [...new Map(
      groups.flatMap((group) => group.dates.map((date) => [date.value, date] as const)),
    ).values()].sort((left, right) =>
      dateKey(left.value).localeCompare(dateKey(right.value)),
    ),
    [groups],
  );
  const todayKey = getTodayKeyInCairo();
  const pastDates = dates.filter((date) => dateKey(date.value) <= todayKey);
  const [selectedGroup, setSelectedGroup] = useState<AttendanceGroup | "all">(initialGroup ?? "all");
  const [selectedDate, setSelectedDate] = useState(
    initialDate && dates.some((date) => date.value === initialDate)
      ? initialDate
      : dates.at(-1)?.value ?? "",
  );
  const effectiveDate = pastDates.some((date) => date.value === selectedDate)
    ? selectedDate
    : pastDates.at(-1)?.value ?? "";
  const selectedDateKey = dateKey(effectiveDate);
  const cumulativeDates = pastDates.filter((date) => dateKey(date.value) <= selectedDateKey);

  const rows: ReportRow[] = groups
    .filter((entry) => selectedGroup === "all" || entry.group === selectedGroup)
    .flatMap((entry) =>
      entry.children.map((child) => {
        let present = 0;
        let absent = 0;
        for (const date of cumulativeDates) {
          const status = child.attendance[date.value];
          if (status === true) present += 1;
          if (status === false) absent += 1;
        }
        return {
          group: entry.group,
          row: child.row,
          groupLabel: entry.groupLabel,
          name: child.name,
          selectedAttendance: effectiveDate ? child.attendance[effectiveDate] ?? null : null,
          present,
          absent,
          total: present + absent,
        };
      }),
    )
    .sort((left, right) =>
      left.groupLabel.localeCompare(right.groupLabel, "ar") ||
      left.name.localeCompare(right.name, "ar"),
    );

  const dayTotals = rows.reduce(
    (result, row) => {
      if (row.selectedAttendance === true) result.present += 1;
      if (row.selectedAttendance === false) result.absent += 1;
      return result;
    },
    { present: 0, absent: 0 },
  );
  const overallTotals = rows.reduce(
    (result, row) => ({
      present: result.present + row.present,
      absent: result.absent + row.absent,
      total: result.total + row.total,
    }),
    { present: 0, absent: 0, total: 0 },
  );
  const dayTotal = dayTotals.present + dayTotals.absent;
  const groupLabel = selectedGroup === "all"
    ? "كل المجموعات"
    : groups.find((entry) => entry.group === selectedGroup)?.groupLabel ?? selectedGroup;

  return (
    <div className="attendance-report-print space-y-5">
      <div className="print:hidden">
        <div className="mb-4">
          <Link
            href="/attendance"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-dark hover:underline"
          >
            <ArrowRight className="size-4" aria-hidden />
            العودة لصفحة الغياب
          </Link>
        </div>
        <Card className="p-4">
          <div className="mb-4">
            <CardTitle>إعداد التقرير</CardTitle>
            <CardDescription>اختاري المجموعة ويوم الجمعة لحساب النسب.</CardDescription>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              المجموعة
              <select
                value={selectedGroup}
                onChange={(event) =>
                  setSelectedGroup(event.target.value === "all"
                    ? "all"
                    : groups.find((entry) => entry.group === event.target.value)?.group ?? "all")
                }
                className="h-11 rounded-xl border border-border bg-background px-3 text-right text-sm outline-none focus:border-primary"
              >
                <option value="all">كل المجموعات</option>
                {groups.map((entry) => (
                  <option key={entry.group} value={entry.group}>{entry.groupLabel}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              يوم الجمعة
              <select
                value={effectiveDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                disabled={pastDates.length === 0}
                className="h-11 rounded-xl border border-border bg-background px-3 text-right text-sm outline-none focus:border-primary disabled:opacity-60"
              >
                {pastDates.map((date) => (
                  <option key={date.value} value={date.value}>{date.value}</option>
                ))}
                {pastDates.length === 0 ? <option value="">لا توجد جمعات سابقة مسجلة</option> : null}
              </select>
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={() => window.print()} disabled={rows.length === 0 || !effectiveDate}>
              <Download className="size-4" aria-hidden />
              تنزيل التقرير PDF
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">تقرير نسب الحضور والغياب</p>
            <CardTitle className="mt-1">{groupLabel}</CardTitle>
            <CardDescription>
              الجمعة المحددة: {effectiveDate || "لا توجد بيانات"}
              {" | "}النسبة العامة حتى هذا التاريخ ({cumulativeDates.length} جمعة)
            </CardDescription>
          </div>
          <p className="text-sm text-muted-foreground">عدد الأطفال: {rows.length}</p>
        </div>

        <div className="mb-6 grid gap-6 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
          <section className="space-y-4">
            <h3 className="text-center font-semibold">نسبة الجمعة المحددة ({effectiveDate || "—"})</h3>
            <div className="grid grid-cols-2 gap-2">
              <PercentageRing
                label="الحضور"
                value={dayTotals.present}
                total={dayTotal}
                color="#2d6d6a"
              />
              <PercentageRing
                label="الغياب"
                value={dayTotals.absent}
                total={dayTotal}
                color="#b54747"
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {dayTotal} طفلًا مسجلًا في هذه الجمعة
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                <h4 className="mb-2 text-sm font-semibold text-primary-dark">الحضور</h4>
                <ul className="space-y-1 text-sm">
                  {rows.filter((row) => row.selectedAttendance === true).map((row) => (
                    <li key={`${row.group}-${row.row}`}>
                      {selectedGroup === "all" ? `${row.name} — ${row.groupLabel}` : row.name}
                    </li>
                  ))}
                  {dayTotals.present === 0 ? (
                    <li className="text-muted-foreground">لا يوجد حضور مسجل.</li>
                  ) : null}
                </ul>
              </div>
              <div className="rounded-xl border border-danger/20 bg-danger/5 p-3">
                <h4 className="mb-2 text-sm font-semibold text-danger">الغياب</h4>
                <ul className="space-y-1 text-sm">
                  {rows.filter((row) => row.selectedAttendance === false).map((row) => (
                    <li key={`${row.group}-${row.row}`}>
                      {selectedGroup === "all" ? `${row.name} — ${row.groupLabel}` : row.name}
                    </li>
                  ))}
                  {dayTotals.absent === 0 ? (
                    <li className="text-muted-foreground">لا يوجد غياب مسجل.</li>
                  ) : null}
                </ul>
              </div>
            </div>
          </section>
          <section className="space-y-4 border-border sm:border-r sm:pr-6">
            <h3 className="text-center font-semibold">النسبة العامة للجمعات السابقة</h3>
            <div className="grid grid-cols-2 gap-2">
              <PercentageRing
                label="الحضور"
                value={overallTotals.present}
                total={overallTotals.total}
                color="#2d6d6a"
              />
              <PercentageRing
                label="الغياب"
                value={overallTotals.absent}
                total={overallTotals.total}
                color="#b54747"
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {overallTotals.total} حالة حضور أو غياب عبر {cumulativeDates.length} جمعة
            </p>
          </section>
        </div>

      </Card>
    </div>
  );
}

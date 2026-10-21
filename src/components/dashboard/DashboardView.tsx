import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { AddPersonDialog } from "@/components/attendance/AddPersonDialog";
import { church } from "@/config/church";
import { STAGES, type StageId } from "@/config/stages";
import type { DashboardSummary } from "@/lib/dashboard-summary";
import type { AttendanceGroupDetails } from "@/lib/google-sheets/attendance.server";
import Link from "next/link";
import {
  Cake,
  CalendarDays,
  CalendarX,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

type DashboardViewProps = {
  stageIds?: StageId[];
  summary?: DashboardSummary;
  addPersonGroups?: AttendanceGroupDetails[];
};

export function DashboardView({ stageIds, summary, addPersonGroups = [] }: DashboardViewProps = {}) {
  const visibleStages = stageIds ? STAGES.filter((stage) => stageIds.includes(stage.id)) : STAGES;
  const canViewConnectedStageData =
    stageIds === undefined ||
    visibleStages.some((stage) => stage.sheetsLinked);

  const summaryCards: Array<{
    label: string;
    icon: LucideIcon;
    value: string;
    hint: string;
    href: string | null;
  }> = [
    {
      label: "إجمالي الأولاد",
      icon: UsersRound,
      href: canViewConnectedStageData ? "/stages" : null,
      value: summary?.dataAccessible
        ? summary.totalChildren?.toLocaleString("ar-EG") ?? "غير متاح"
        : "—",
      hint: summary && !summary.dataAccessible
        ? "بيانات هذه المرحلة غير متاحة من المصادر المرتبطة."
        : summary?.sourceError ?? "مجموع السجلات في المراحل المتاحة لحسابك",
    },
    {
      label: "أعياد اليوم",
      icon: Cake,
      href: canViewConnectedStageData ? "/birthdays" : null,
      value: summary?.dataAccessible
        ? summary.birthdaysToday?.toLocaleString("ar-EG") ?? "غير متاح"
        : "—",
      hint: summary && !summary.dataAccessible
        ? "بيانات هذه المرحلة غير متاحة من المصادر المرتبطة."
        : summary?.sourceError ?? "أعياد ميلاد تمت معاينتها من تاريخ الميلاد",
    },
    {
      label: "الأعياد القادمة",
      icon: CalendarDays,
      href: canViewConnectedStageData ? "/birthdays" : null,
      value: summary?.dataAccessible
        ? summary.upcomingBirthdays?.toLocaleString("ar-EG") ?? "غير متاح"
        : "—",
      hint: summary && !summary.dataAccessible
        ? "بيانات هذه المرحلة غير متاحة من المصادر المرتبطة."
        : summary?.sourceError ?? "عدد الأعياد القادمة خلال الاثني عشر شهرًا التالية",
    },
    {
      label: "الحضور",
      icon: UserRoundCheck,
      href: canViewConnectedStageData ? "/attendance" : null,
      value: summary
        ? summary.dataAccessible
          ? summary.attendanceError
            ? "غير متاح"
            : "مستعد"
          : "—"
        : "—",
      hint: summary && !summary.dataAccessible
        ? "الحضور غير متاح لهذه المراحل."
        : summary?.attendanceError ?? `${summary?.attendanceGroups ?? 0} مجموعة متاحة للحضور`,
    },
    {
      label: "الغياب المتكرر",
      icon: UserRoundX,
      href: canViewConnectedStageData ? "/repeated-absence" : null,
      value: summary?.dataAccessible
        ? summary.repeatedAbsenceCount?.toLocaleString("ar-EG") ?? "غير متاح"
        : "—",
      hint: summary && !summary.dataAccessible
        ? "الغياب غير متاح لهذه المراحل."
        : summary?.attendanceError ?? "عدد الأطفال المطابقين لقائمة البيانات ممن غابوا في جمعتين فائتتين متتاليتين أو أكثر",
    },
    {
      label: "قوائم الافتقاد",
      icon: CalendarX,
      href: canViewConnectedStageData ? "/visitation" : null,
      value: summary?.dataAccessible
        ? summary.visitationRecords?.toLocaleString("ar-EG") ?? "غير متاح"
        : "—",
      hint: summary && !summary.dataAccessible
        ? "الافتقاد غير متاح لهذه المراحل."
        : summary?.visitationError ??
          summary?.sourceError ??
          "سجلات مرتبطة بالمنطقة والشارع",
    },
  ];

  return (
    <>
      <PageHeader
        title="الرئيسية"
        description={`مرحبًا بكم في نظام إدارة ${church.name}. البيانات أدناه تُحدَّث مباشرة من مصادر الكنيسة الحالية.`}
      />

      {addPersonGroups.length > 0 ? <AddPersonDialog groups={addPersonGroups} /> : null}

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">ملخص الخدمة</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map(({ label, icon: Icon, value, hint, href }) => (
            <div key={label}>
              {href ? (
                <Link
                  href={href}
                  className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <Card className="flex h-full min-h-32 items-start gap-4 p-4 transition-colors hover:border-primary/50">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-dark">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">{label}</p>
                      <p className="mt-2 text-2xl font-bold leading-8 text-foreground">{value}</p>
                      <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
                    </div>
                  </Card>
                </Link>
              ) : (
                <Card className="flex h-full min-h-32 items-start gap-4 p-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-dark">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <p className="mt-2 text-2xl font-bold leading-8 text-foreground">{value}</p>
                    <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
                  </div>
                </Card>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">مراحل الخدمة</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visibleStages.map((stage) => (
            <Link
              key={stage.id}
              href={`/stages/${stage.id}`}
              className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Card className="flex h-full min-h-24 items-center gap-3 p-4 transition-colors hover:border-primary/50">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary-dark">
                  {stage.order}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{stage.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {stage.sheetsLinked
                      ? "بيانات مباشرة متاحة"
                      : "لم يتم ربط بيانات هذه المرحلة بعد"}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

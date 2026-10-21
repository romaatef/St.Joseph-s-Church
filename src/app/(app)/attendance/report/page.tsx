import { AttendanceReport } from "@/components/attendance/AttendanceReport";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCurrentProfile } from "@/lib/auth/profile";
import {
  getAccessibleAttendanceGroups,
  getAttendanceHistories,
  isAttendanceGroup,
} from "@/lib/google-sheets/attendance.server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تقرير الحضور والغياب",
};

export default async function AttendanceReportPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string | string[]; date?: string | string[] }>;
}) {
  const query = await searchParams;
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const allowedGroups = getAccessibleAttendanceGroups(profile.role, profile.stageIds);
  let reportGroups;
  let reportError = "";
  if (allowedGroups.length > 0) {
    try {
      reportGroups = await getAttendanceHistories(allowedGroups);
    } catch (error) {
      reportError = error instanceof Error
        ? error.message
        : "تعذر تحميل تقرير الحضور والغياب.";
    }
  }
  const requestedGroup = Array.isArray(query.group) ? query.group[0] : query.group;
  const requestedDate = Array.isArray(query.date) ? query.date[0] : query.date;
  const initialGroup = requestedGroup &&
    isAttendanceGroup(requestedGroup) &&
    allowedGroups.includes(requestedGroup)
    ? requestedGroup
    : undefined;
  const initialDate = requestedDate &&
    reportGroups?.some((group) =>
      group.dates.some((date) => date.value === requestedDate),
    )
    ? requestedDate
    : undefined;

  return (
    <>
      <PageHeader
        title="تقرير الحضور والغياب"
        description="تابعي نسب الحضور والغياب حسب المجموعة والفترة، واطبعي التقرير أو احفظيه PDF."
      />
      {allowedGroups.length > 0 ? (
        reportGroups ? (
          <AttendanceReport
            groups={reportGroups}
            initialGroup={initialGroup}
            initialDate={initialDate}
          />
        ) : (
          <Card role="alert">
            <CardTitle>تعذر تحميل التقرير</CardTitle>
            <CardDescription>{reportError}</CardDescription>
            <a
              href="/attendance/report"
              className="mt-4 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-dark"
            >
              إعادة المحاولة
            </a>
          </Card>
        )
      ) : (
        <Card role="alert">
          <CardTitle>لا توجد مجموعات غياب مخصصة لحسابك</CardTitle>
          <CardDescription>
            لم يتم تخصيص مجموعات حضور وغياب لحسابك بعد. يرجى التواصل مع مسؤول النظام.
          </CardDescription>
        </Card>
      )}
    </>
  );
}

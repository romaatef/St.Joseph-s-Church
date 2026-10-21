import { AttendanceManager } from "@/components/attendance/AttendanceManager";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAccessibleAttendanceGroups } from "@/lib/google-sheets/attendance.server";
import { requireAuthenticated } from "@/lib/auth/guards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الغياب",
};

export default async function AttendancePage() {
  const profile = await requireAuthenticated();
  const allowedGroups = getAccessibleAttendanceGroups(profile.role, profile.stageIds);

  return (
    <>
      <PageHeader
        title="الغياب"
        description={profile.role === "viewer"
          ? "عرض سجل الحضور والغياب دون إمكانية إجراء تغييرات."
          : "اختاري مجموعة وتاريخ الجمعة لتسجيل الحضور والغياب في شيت الخدمة."}
      />
      {allowedGroups.length > 0 ? (
        <AttendanceManager allowedGroups={allowedGroups} readOnly={profile.role === "viewer"} />
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

import { RepeatedAbsenceReport } from "@/components/attendance/RepeatedAbsenceReport";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { requireAuthenticated } from "@/lib/auth/guards";
import { getAccessibleAttendanceGroups } from "@/lib/google-sheets/attendance.server";

export const metadata: Metadata = {
  title: "الغياب المتكرر",
};

export default async function RepeatedAbsencePage() {
  const profile = await requireAuthenticated();
  const groups = getAccessibleAttendanceGroups(profile.role, profile.stageIds);

  return (
    <>
      <PageHeader
        title="الغياب المتكرر"
        description="متابعة الأطفال الذين تكرر غيابهم في جمعات سابقة متتالية."
      />
      {groups.length > 0 ? (
        <RepeatedAbsenceReport />
      ) : (
        <Card>
          <CardTitle>لا توجد مجموعات غياب مخصصة لحسابك</CardTitle>
          <CardDescription>
            لم يتم تخصيص مجموعات حضور وغياب لحسابك بعد. يرجى التواصل مع مسؤول النظام.
          </CardDescription>
        </Card>
      )}
    </>
  );
}

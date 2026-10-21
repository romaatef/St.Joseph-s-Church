import { BirthdayOverview } from "@/components/birthdays/BirthdayOverview";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireAuthenticated } from "@/lib/auth/guards";
import { getBirthdayEntriesFromGroups } from "@/lib/google-sheets/birthdays";
import {
  getAccessibleAttendanceStages,
  getStageChildrenForStages,
} from "@/lib/google-sheets/attendance.server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أعياد الميلاد",
};

export default async function BirthdaysPage() {
  const profile = await requireAuthenticated();
  const stages = getAccessibleAttendanceStages(profile.role, profile.stageIds);
  if (stages.length === 0) redirect("/stages?error=not-authorized");

  const result = await getStageChildrenForStages(stages.map((stage) => stage.id));
  const birthdayEntries = result.ok ? getBirthdayEntriesFromGroups(result.groups) : [];

  return (
    <>
      <PageHeader
        title="أعياد الميلاد"
        description="عرض أعياد ميلاد مراحل الخدمة المتاحة لحسابك بناءً على تواريخ الميلاد المسجلة."
      />

      {result.ok ? (
        <BirthdayOverview
          items={birthdayEntries}
          sourceRecordCount={result.groups.reduce(
            (total, group) => total + group.rows.length,
            0,
          )}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground">تعذر تحميل أعياد الميلاد</h2>
          <p className="mt-2 text-sm text-muted-foreground">{result.error}</p>
        </div>
      )}
    </>
  );
}

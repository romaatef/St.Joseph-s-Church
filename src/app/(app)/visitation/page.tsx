import { PageHeader } from "@/components/ui/PageHeader";
import { VisitationView } from "@/components/visitation/VisitationView";
import { requireAuthenticated } from "@/lib/auth/guards";
import { getVisitationSheet } from "@/lib/google-sheets/visitation.server";
import { getAccessibleAttendanceStages } from "@/lib/google-sheets/attendance.server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "قوائم الافتقاد",
};

export default async function VisitationPage() {
  const profile = await requireAuthenticated();
  const stages = getAccessibleAttendanceStages(profile.role, profile.stageIds);
  if (stages.length === 0) redirect("/stages?error=not-authorized");

  const result = await getVisitationSheet(stages.map((stage) => stage.id));

  return (
    <>
      <PageHeader
        title="قوائم الافتقاد"
        description="عرض قوائم الافتقاد لمراحل الخدمة المتاحة لحسابك حسب المنطقة والشارع."
      />
      <VisitationView result={result} />
    </>
  );
}

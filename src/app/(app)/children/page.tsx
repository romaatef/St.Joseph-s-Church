import { FiveSixChildrenView } from "@/components/children/FiveSixChildrenView";
import { PageHeader } from "@/components/ui/PageHeader";
import { getStageChildren } from "@/lib/google-sheets/attendance.server";
import { requireAuthenticated } from "@/lib/auth/guards";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "بيانات الأولاد",
};

export default async function ChildrenPage() {
  const profile = await requireAuthenticated();
  if (
    profile.role !== "admin" &&
    !profile.stageIds.includes("g1-g2")
  ) {
    redirect("/stages?error=not-authorized");
  }

  const result = await getStageChildren("g1-g2");

  return (
    <>
      <PageHeader
        title="بيانات الأولاد"
        description="عرض بيانات أولى وتانية من مصدر Google Sheets."
      />
      <FiveSixChildrenView
        result={result}
        readOnly={profile.role === "viewer"}
        stageName="أولى وتانية"
      />
    </>
  );
}

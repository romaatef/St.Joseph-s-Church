import { StageChildrenView } from "@/components/children/StageChildrenView";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { isStageId, STAGES } from "@/config/stages";
import { getCurrentProfile } from "@/lib/auth/profile";
import {
  getStageChildren,
  isAttendanceStage,
} from "@/lib/google-sheets/attendance.server";
import { notFound, redirect } from "next/navigation";

export default async function StagePage({
  params,
}: {
  params: Promise<{ stageId: string }>;
}) {
  const { stageId } = await params;
  if (!isStageId(stageId)) notFound();

  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (
    profile.role !== "admin" &&
    !profile.stageIds.includes(stageId)
  ) {
    redirect("/stages?error=not-authorized");
  }

  const stage = STAGES.find((item) => item.id === stageId);
  if (!stage) notFound();

  if (stage.sheetsLinked && isAttendanceStage(stageId)) {
    const result = await getStageChildren(stageId);
    return (
      <>
        <PageHeader
          title={stage.name}
          description={`بيانات أطفال ${stage.name} من شيت Google Sheets الخاص بالمرحلة.`}
        />
        <StageChildrenView result={result} readOnly={profile.role === "viewer"} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={stage.name}
        description={`لم يتم ربط بيانات مرحلة ${stage.name} بعد.`}
      />
      <Card role="status">
        <CardTitle>المرحلة غير مربوطة</CardTitle>
        <CardDescription>
          ستظهر بيانات الأطفال والحضور هنا بعد إعداد ربط ملفات هذه المرحلة.
        </CardDescription>
      </Card>
    </>
  );
}

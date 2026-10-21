import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ServantsView } from "@/components/servants/ServantsView";
import { PageHeader } from "@/components/ui/PageHeader";
import { requiredStageAccess } from "@/lib/auth/guards";
import { getStageChildren } from "@/lib/google-sheets/attendance.server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "بيانات الخدام",
};

export default async function ServantsPage() {
  await requiredStageAccess("servants");

  const result = await getStageChildren("servants");
  const servants = result.ok
    ? result.groups.find((group) => group.id === "servants-meeting")?.rows ?? []
    : [];

  return (
    <>
      <PageHeader
        title="بيانات الخدام"
        description="بيانات مرحلة الخدام من شيت المرحلة المخصص."
      />
      {!result.ok ? (
        <Card role="alert">
          <CardTitle>تعذر تحميل بيانات الخدام</CardTitle>
          <CardDescription>{result.error}</CardDescription>
        </Card>
      ) : servants.length === 0 ? (
        <Card>
          <CardTitle>لا توجد أسماء مسجلة</CardTitle>
          <CardDescription>لم تُعثر على سجلات في قسم «خدام الاجتماع» بشيت البيانات.</CardDescription>
        </Card>
      ) : (
        <ServantsView servants={servants} />
      )}
    </>
  );
}

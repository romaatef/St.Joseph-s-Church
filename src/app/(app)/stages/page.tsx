import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { STAGES } from "@/config/stages";
import { getCurrentProfile } from "@/lib/auth/profile";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StagesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role === "admin") redirect("/");

  const allowedStages = STAGES.filter((stage) =>
    profile.role === "admin" || profile.stageIds.includes(stage.id),
  );
  const { error } = await searchParams;

  return (
    <>
      <PageHeader
        title="المراحل المخصصة لك"
        description="اختر مرحلة من المراحل المسموح لك بمتابعتها."
      />
      {error === "not-authorized" ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          لا تملك صلاحية الوصول إلى هذه المرحلة.
        </p>
      ) : null}
      {allowedStages.length === 0 ? (
        <Card>
          <CardTitle>لا توجد مراحل مخصصة</CardTitle>
          <CardDescription>
            لم يتم تخصيص مرحلة لحسابك بعد. يرجى التواصل مع مسؤول النظام.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {allowedStages.map((stage) => (
            <Link key={stage.id} href={`/stages/${stage.id}`}>
              <Card className="flex h-full items-center gap-4 transition-shadow hover:shadow-md">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary-dark">
                  {stage.order}
                </span>
                <div>
                  <CardTitle className="text-base">{stage.name}</CardTitle>
                  <CardDescription>فتح لوحة المرحلة</CardDescription>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

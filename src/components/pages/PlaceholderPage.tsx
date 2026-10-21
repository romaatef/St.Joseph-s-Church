import { ComingSoon } from "@/components/ui/ComingSoon";
import { PageHeader } from "@/components/ui/PageHeader";
import { STAGES } from "@/config/stages";
import { requireAuthenticated } from "@/lib/auth/guards";

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export async function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const profile = await requireAuthenticated();
  const allowedStages =
    profile.role === "admin"
      ? STAGES
      : STAGES.filter((stage) => profile.stageIds.includes(stage.id));
  const stageNames = allowedStages.map((stage) => stage.name);

  return (
    <>
      <PageHeader title={title} description={description} />
      {profile.role !== "admin" ? (
        <p className="mb-4 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
          نطاق الوصول لهذه الصفحة يقتصر على:{" "}
          {stageNames.length > 0 ? stageNames.join("، ") : "لا توجد مراحل مخصصة لحسابك"}.
        </p>
      ) : null}
      <ComingSoon title={title} description={description} />
    </>
  );
}

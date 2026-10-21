import { Card } from "@/components/ui/Card";

export default function LoadingVisitationPage() {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="h-11 animate-pulse rounded-xl bg-muted" />
      </Card>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-4 w-32 animate-pulse rounded bg-muted" />
          </Card>
        ))}
      </div>
    </div>
  );
}

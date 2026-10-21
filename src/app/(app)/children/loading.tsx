import { Card } from "@/components/ui/Card";

export default function ChildrenLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="جارٍ تحميل بيانات الأولاد">
      <Card className="h-20 animate-pulse bg-muted" />
      <Card className="h-64 animate-pulse bg-muted" />
    </div>
  );
}

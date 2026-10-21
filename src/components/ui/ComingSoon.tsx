import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

type ComingSoonProps = {
  title: string;
  description: string;
};

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <Card className="max-w-2xl">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <p className="mt-4 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        هذا القسم قيد التجهيز. سيتم ربط البيانات والمنطق لاحقًا.
      </p>
    </Card>
  );
}

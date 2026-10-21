import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireAuthenticated } from "@/lib/auth/guards";
import { getDashboardSummary } from "@/lib/dashboard-summary";
import { Bell, Cake, CalendarDays, CalendarX, CircleAlert } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الإشعارات",
};

export default async function NotificationsPage() {
  const profile = await requireAuthenticated();
  const summary = await getDashboardSummary(profile);

  const notifications = [
    {
      title: "أعياد اليوم",
      value: summary.birthdaysToday,
      error: summary.sourceError,
      description: (count: number) =>
        count > 0 ? `${count} طفلًا يحتفل بعيد ميلاده اليوم.` : "لا توجد أعياد ميلاد اليوم.",
      href: "/birthdays",
      icon: Cake,
    },
    {
      title: "الأعياد القادمة",
      value: summary.upcomingBirthdays,
      error: summary.sourceError,
      description: (count: number) => `${count} عيد ميلاد قادم خلال الاثني عشر شهرًا التالية.`,
      href: "/birthdays",
      icon: CalendarDays,
    },
    {
      title: "الغياب المتكرر",
      value: summary.repeatedAbsenceCount,
      error: summary.attendanceError,
      description: (count: number) =>
        count > 0 ? `${count} حالة غياب متتالية تحتاج متابعة.` : "لا توجد حالات غياب متتالٍ.",
      href: "/repeated-absence",
      icon: CalendarX,
    },
    {
      title: "سجلات الافتقاد",
      value: summary.visitationRecords,
      error: summary.visitationError ?? summary.sourceError,
      description: (count: number) => `${count} سجلًا متاحًا ضمن قوائم الافتقاد.`,
      href: "/visitation",
      icon: CircleAlert,
    },
  ];

  return (
    <>
      <PageHeader
        title="الإشعارات"
        description="عرض تنبيهات التشغيل المباشرة المستندة إلى بيانات الكنيسة الحالية والأنشطة المتكررة."
      />

      {summary.dataAccessible ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {notifications.map(({ title, value, error, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Card className="h-full p-4 transition-colors group-hover:border-primary/50">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary-dark">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <Bell className="size-4 text-muted-foreground" aria-hidden />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="mt-2">
                  {error ?? (value === undefined ? "البيانات غير متاحة حاليًا." : description(value))}
                </CardDescription>
                <p className="mt-3 text-sm font-medium text-primary-dark">فتح التفاصيل</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardTitle>لا توجد مصادر بيانات مخصصة لهذا الحساب</CardTitle>
          <CardDescription>
            تعرض هذه الصفحة بيانات مجموعات خامسة وسادسة، وهي غير متاحة ضمن المراحل المخصصة لحسابك.
          </CardDescription>
        </Card>
      )}
    </>
  );
}

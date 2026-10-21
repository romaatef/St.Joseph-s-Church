import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import type { BirthdayEntry } from "@/lib/google-sheets/birthdays";
import { normalizePhoneNumber } from "@/lib/utils";
import { Cake, CalendarDays, PhoneCall } from "lucide-react";

type BirthdayOverviewProps = {
  items: BirthdayEntry[];
  sourceRecordCount: number;
};

function formatBirthdayLabel(value: string) {
  if (!value) return "—";

  const slashDate = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  const date = slashDate
    ? new Date(Date.UTC(Number(slashDate[3]), Number(slashDate[2]) - 1, Number(slashDate[1])))
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Cairo",
  }).format(date);
}

export function BirthdayOverview({ items, sourceRecordCount }: BirthdayOverviewProps) {
  const todayBirthdays = items.filter((item) => item.isToday).sort((a, b) => a.name.localeCompare(b.name));
  const allUpcomingBirthdays = items
    .filter((item) => !item.isToday)
    .sort((a, b) => a.daysLeft - b.daysLeft || a.name.localeCompare(b.name));
  const upcomingBirthdays = allUpcomingBirthdays.slice(0, 12);

  return (
    <div className="space-y-6">
      <section className="grid gap-3 md:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
              <Cake className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">أعياد الميلاد اليوم</p>
              <p className="mt-1 text-2xl font-bold">{todayBirthdays.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
              <CalendarDays className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">الأعياد القادمة</p>
              <p className="mt-1 text-2xl font-bold">{allUpcomingBirthdays.length}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <CardTitle>أعياد الميلاد اليوم</CardTitle>
            <CardDescription>
              {todayBirthdays.length > 0
                ? "الطفل أو الأطفال الذين يحتفلون بعيد ميلادهم اليوم."
                : "لا توجد أعياد ميلاد اليوم في البيانات الحالية."}
            </CardDescription>
          </div>

          {todayBirthdays.length > 0 ? (
            <div className="divide-y divide-border">
              {todayBirthdays.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.sectionName}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{formatBirthdayLabel(item.nextBirthday)}</span>
                  </div>
                  {item.phone ? (
                    <a
                      href={`tel:${normalizePhoneNumber(item.phone)}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary-dark"
                    >
                      <PhoneCall className="size-4" aria-hidden />
                      اتصال
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-6 text-sm text-muted-foreground">لا توجد أعياد ميلاد اليوم.</div>
          )}
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <CardTitle>الأعياد القادمة</CardTitle>
            <CardDescription>
              {allUpcomingBirthdays.length > 12
                ? `أقرب 12 عيد ميلاد من أصل ${allUpcomingBirthdays.length} مناسبة قادمة.`
                : "أقرب أعياد الميلاد القادمة مع عدد الأيام المتبقية حتى كل مناسبة."}
            </CardDescription>
          </div>

          {upcomingBirthdays.length > 0 ? (
            <div className="divide-y divide-border">
              {upcomingBirthdays.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.sectionName} • {formatBirthdayLabel(item.nextBirthday)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="rounded-full bg-muted px-2 py-1 text-primary-dark">
                      {item.daysLeft} يوم
                    </span>
                    {item.phone ? (
                      <a
                        href={`tel:${normalizePhoneNumber(item.phone)}`}
                        className="inline-flex items-center gap-1 text-primary-dark"
                        aria-label={`اتصال مباشر بـ ${item.name}`}
                      >
                        <PhoneCall className="size-4" aria-hidden />
                        اتصال
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-6 text-sm text-muted-foreground">
              {sourceRecordCount > 0 && items.length === 0
                ? "لا توجد تواريخ ميلاد صالحة في السجلات الحالية."
                : "لا توجد أعياد قادمة في البيانات الحالية."}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

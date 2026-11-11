"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import type { BirthdayEntry } from "@/lib/google-sheets/birthdays";
import type { StageId } from "@/config/stages";
import { normalizePhoneNumber } from "@/lib/utils";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { Cake, CalendarDays, MessageCircle, PhoneCall } from "lucide-react";

type StageBirthdayGroup = {
  stageId: StageId;
  stageName: string;
  children: BirthdayEntry[];
  whatsappNumbers: string[];
};
type BirthdayOverviewProps = {
  items: BirthdayEntry[];
  birthdayStages: StageBirthdayGroup[];
  isAdmin: boolean;
  whatsappContactsError?: string;
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

function createWhatsAppMessage(stage: StageBirthdayGroup) {
  const children = stage.children.map((child, index) => {
    const phone = child.phone
      ? normalizeWhatsAppNumber(child.phone) ?? child.phone
      : "الرقم غير مسجل";
    return `${index + 1}. ${child.name} — ${phone}`;
  });
  return `صباح الخير ❤️\nأعياد ميلاد اليوم في مرحلة ${stage.stageName} 🎂\n\n${children.join("\n")}\nكل سنة وهم طيبين ❤️`;
}

export function BirthdayOverview({
  items,
  birthdayStages,
  isAdmin,
  whatsappContactsError,
  sourceRecordCount,
}: BirthdayOverviewProps) {
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

          {birthdayStages.length > 0 ? (
            <div className="divide-y divide-border">
              {birthdayStages.map((stage) => {
                const whatsappNumbers = stage.whatsappNumbers
                  .map((phone) => normalizeWhatsAppNumber(phone))
                  .filter((phone): phone is string => phone !== null);
                const message = createWhatsAppMessage(stage);

                return (
                  <section key={stage.stageId} className="px-5 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{stage.stageName}</h3>
                          <span className="rounded-full bg-muted px-2 py-1 text-xs text-primary-dark">
                            {stage.children.length}
                          </span>
                        </div>
                        {stage.children.length === 0 ? (
                          <p className="mt-1 text-sm text-muted-foreground">
                            لا توجد أعياد ميلاد اليوم في هذه المرحلة.
                          </p>
                        ) : null}
                      </div>
                      {isAdmin ? (
                        whatsappNumbers.length > 0 && stage.children.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {whatsappNumbers.map((whatsappNumber) => (
                              <a
                                key={whatsappNumber}
                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(event) => {
                                  if (
                                    !window.confirm(
                                      `فتح واتساب لإرسال رسالة لمسؤول مرحلة ${stage.stageName} (${whatsappNumber}) عن ${stage.children.length} طفل؟`,
                                    )
                                  ) {
                                    event.preventDefault();
                                  }
                                }}
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark"
                                aria-label={`إرسال أعياد ميلاد ${stage.stageName} إلى ${whatsappNumber} عبر واتساب`}
                              >
                                <MessageCircle className="size-4" aria-hidden />
                                واتساب {whatsappNumber}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-muted px-3 text-sm font-medium text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <MessageCircle className="size-4" aria-hidden />
                            إرسال واتساب
                          </button>
                        )
                      ) : null}
                    </div>
                    {isAdmin && stage.children.length > 0 && whatsappNumbers.length === 0 ? (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {whatsappContactsError ??
                          "سجّل رقم واتساب مسؤول هذه المرحلة من الإعدادات لتفعيل الإرسال."}
                      </p>
                    ) : null}
                    {stage.children.length > 0 ? (
                      <div className="mt-3 divide-y divide-border">
                        {stage.children.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.sectionName} • {formatBirthdayLabel(item.nextBirthday)}
                              </p>
                            </div>
                            {item.phone ? (
                              <a
                                href={`tel:${normalizePhoneNumber(item.phone)}`}
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary-dark"
                              >
                                <PhoneCall className="size-4" aria-hidden />
                                اتصال
                              </a>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                رقم الهاتف غير مسجل
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </section>
                );
              })}
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

"use client";

import {
  removeStageWhatsAppAction,
  saveStageWhatsAppAction,
  type StageWhatsAppActionState,
} from "@/app/actions/stage-whatsapp";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { STAGES, type StageId } from "@/config/stages";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

type StageWhatsAppSettingsProps = {
  contacts: Partial<Record<StageId, string[]>>;
  loadError?: string;
};

function StageContactForm({
  stageId,
  stageName,
  contacts,
}: {
  stageId: StageId;
  stageName: string;
  contacts: string[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    StageWhatsAppActionState,
    FormData
  >(saveStageWhatsAppAction, {});
  const [removeState, removeAction, removePending] = useActionState<
    StageWhatsAppActionState,
    FormData
  >(removeStageWhatsAppAction, {});

  useEffect(() => {
    if (state.success || removeState.success) router.refresh();
  }, [router, state.success, removeState.success]);

  return (
    <div className="space-y-3">
      {contacts.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {contacts.map((phone) => (
            <li
              key={phone}
              className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
            >
              <span dir="ltr" className="font-mono text-sm">{phone}</span>
              <form action={removeAction}>
                <input type="hidden" name="stageId" value={stageId} />
                <input type="hidden" name="phone" value={phone} />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="text-danger"
                  aria-label={`حذف رقم ${phone}`}
                  disabled={removePending}
                >
                  <Trash2 className="size-4" aria-hidden />
                  حذف
                </Button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">لا توجد أرقام مسجلة لهذه المرحلة.</p>
      )}

      <form action={action} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <input type="hidden" name="stageId" value={stageId} />
        <Field label={`إضافة رقم واتساب لمسؤولي ${stageName}`}>
          <Input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="أدخل الرقم بصيغته الدولية"
            aria-describedby={`stage-phone-hint-${stageId}`}
          />
          <span
            id={`stage-phone-hint-${stageId}`}
            className="mt-1 block text-xs text-muted-foreground"
          >
            يقبل رقمًا دوليًا أو رقم محمول مصري محلي.
          </span>
        </Field>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "جارٍ الإضافة..." : "إضافة الرقم"}
        </Button>
        {state.error ? (
          <p className="text-sm text-danger sm:col-span-2" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-primary-dark sm:col-span-2" role="status">
            {state.success}
          </p>
        ) : null}
      </form>
      {removeState.error ? (
        <p className="text-sm text-danger" role="alert">{removeState.error}</p>
      ) : null}
      {removeState.success ? (
        <p className="text-sm text-primary-dark" role="status">{removeState.success}</p>
      ) : null}
    </div>
  );
}

export function StageWhatsAppSettings({
  contacts,
  loadError,
}: StageWhatsAppSettingsProps) {
  return (
    <Card className="p-4 md:col-span-2">
      <CardTitle>أرقام واتساب مسؤولي المراحل</CardTitle>
      <CardDescription className="mt-2">
        تُستخدم الأرقام لفتح محادثة واتساب برسالة جاهزة لأعياد ميلاد اليوم. لا
        تُرسل الرسالة إلا بعد مراجعتها والضغط على إرسال داخل واتساب.
      </CardDescription>
      {loadError ? (
        <p className="mt-4 text-sm text-danger" role="alert">
          {loadError}
        </p>
      ) : (
        <div className="mt-5 divide-y divide-border">
          {STAGES.map((stage) => (
            <div key={stage.id} className="py-4 first:pt-0 last:pb-0">
              <StageContactForm
                stageId={stage.id}
                stageName={stage.name}
                contacts={contacts[stage.id] ?? []}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

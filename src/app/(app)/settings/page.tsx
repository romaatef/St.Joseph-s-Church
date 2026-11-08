import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { church } from "@/config/church";
import { STAGES } from "@/config/stages";
import { requireAuthenticated } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StageId } from "@/config/stages";
import { StageWhatsAppSettings } from "@/components/settings/StageWhatsAppSettings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الإعدادات",
};

export default async function SettingsPage() {
  const profile = await requireAuthenticated();
  let stageContacts: Partial<Record<StageId, string[]>> = {};
  let stageContactsError: string | undefined;

  if (profile.role === "admin") {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("stage_whatsapp_contacts")
      .select("stage_id, whatsapp_phone");
    if (error) {
      console.error("Failed to load stage WhatsApp contacts:", error.code);
      stageContactsError =
        "تعذر تحميل أرقام المسؤولين. تحقق من تشغيل ترحيل قاعدة البيانات الخاص بأرقام واتساب المراحل.";
    } else {
      stageContacts = data.reduce<Partial<Record<StageId, string[]>>>(
        (contacts, contact) => {
          const stageId = contact.stage_id as StageId;
          contacts[stageId] = [
            ...(contacts[stageId] ?? []),
            contact.whatsapp_phone,
          ];
          return contacts;
        },
        {},
      );
    }
  }

  return (
    <>
      <PageHeader
        title="الإعدادات"
        description="معلومات الحساب والكنيسة، وإرشادات إدارة الحساب والبيانات دون تغيير إعدادات حساسة من هذه الشاشة."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {profile.role === "admin" ? (
          <StageWhatsAppSettings
            contacts={stageContacts}
            loadError={stageContactsError}
          />
        ) : null}
        <Card className="p-4">
          <CardTitle>بيانات الكنيسة</CardTitle>
          <CardDescription className="mt-3 space-y-2">
            <span className="block">اسم الكنيسة: {church.name}</span>
            <span className="block">الاسم المختصر: {church.shortName}</span>
            <span className="block">تطبيق الإدارة: {church.appName}</span>
            <span className="block">لغة العرض: العربية</span>
            <span className="block">اتجاه العرض: من اليمين إلى اليسار</span>
          </CardDescription>
        </Card>

        <Card className="p-4">
          <CardTitle>حساب المستخدم الحالي</CardTitle>
          <CardDescription className="mt-3 space-y-2">
            <span className="block">الاسم: {profile.name || "غير محدد"}</span>
            <span className="block">
              الدور: {profile.role === "admin"
                ? "مدير"
                : profile.role === "viewer"
                  ? "Viewer (Read-Only)"
                  : "مسؤول مرحلة"}
            </span>
            <span className="block">
              المراحل المخصصة:{" "}
              {profile.role === "admin"
                ? "جميع المراحل"
                : profile.role === "viewer"
                  ? profile.stageIds.length
                    ? profile.stageIds
                        .map((stageId) => STAGES.find((stage) => stage.id === stageId)?.name)
                        .filter(Boolean)
                        .join("، ")
                    : "لا توجد مراحل مخصصة"
                : profile.stageIds.length
                  ? profile.stageIds
                      .map((stageId) => STAGES.find((stage) => stage.id === stageId)?.name)
                      .filter(Boolean)
                      .join("، ")
                  : "لا توجد مراحل"}
            </span>
          </CardDescription>
        </Card>

        <Card className="p-4 md:col-span-2">
          <CardTitle>مصادر البيانات</CardTitle>
          <CardDescription className="mt-3 space-y-2">
            <span className="block">
              بيانات الأطفال وأعياد الميلاد والافتقاد: Google Sheets للمراحل المرتبطة، مع بقاء حضانة الحد وكي جي غير مربوطتين حاليًا.
            </span>
            <span className="block">
              الحضور والغياب المتكرر: Google Sheets عبر Apps Script موثّق بتوقيع HMAC.
            </span>
            <span className="block">
              الحسابات والصلاحيات: Supabase Auth وملفات الصلاحيات المرتبطة بالمستخدم.
            </span>
            <span className="block">
              لتغيير المراحل أو حالة الحساب، تواصلي مع مدير النظام؛ هذه الصفحة للعرض فقط.
            </span>
          </CardDescription>
        </Card>
      </div>
    </>
  );
}

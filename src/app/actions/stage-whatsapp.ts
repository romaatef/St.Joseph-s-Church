"use server";

import { isStageId } from "@/config/stages";
import { getCurrentProfile } from "@/lib/auth/profile";
import { normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { createSupabaseActionClient } from "@/lib/supabase/server";

export type StageWhatsAppActionState = {
  error?: string;
  success?: string;
};

export async function saveStageWhatsAppAction(
  _previousState: StageWhatsAppActionState,
  formData: FormData,
): Promise<StageWhatsAppActionState> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return { error: "لا تملك صلاحية تنفيذ هذا الإجراء." };
  }

  const stageId = String(formData.get("stageId") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  if (!isStageId(stageId)) return { error: "المرحلة المحددة غير صالحة." };
  if (!phone) {
    return { error: "أدخل رقم واتساب أولًا." };
  }

  const whatsappPhone = normalizeWhatsAppNumber(phone);
  if (!whatsappPhone) {
    return {
      error: "أدخل رقمًا دوليًا صحيحًا (8 إلى 15 رقمًا)، أو رقم محمول مصري محلي.",
    };
  }

  const supabase = await createSupabaseActionClient();
  const { error } = await supabase.from("stage_whatsapp_contacts").insert({
    stage_id: stageId,
    whatsapp_phone: whatsappPhone,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to save stage WhatsApp contact:", error.code);
    if (error.code === "23505") {
      return { error: "هذا الرقم مسجل بالفعل لهذه المرحلة." };
    }
    return { error: "تعذر حفظ رقم مسؤول المرحلة." };
  }

  return { success: `تمت إضافة الرقم ${whatsappPhone}.` };
}

export async function removeStageWhatsAppAction(
  _previousState: StageWhatsAppActionState,
  formData: FormData,
): Promise<StageWhatsAppActionState> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return { error: "لا تملك صلاحية تنفيذ هذا الإجراء." };
  }

  const stageId = String(formData.get("stageId") ?? "");
  const phone = normalizeWhatsAppNumber(String(formData.get("phone") ?? ""));
  if (!isStageId(stageId) || !phone) {
    return { error: "بيانات رقم المسؤول غير صالحة." };
  }

  const supabase = await createSupabaseActionClient();
  const { error } = await supabase
    .from("stage_whatsapp_contacts")
    .delete()
    .eq("stage_id", stageId)
    .eq("whatsapp_phone", phone);

  if (error) {
    console.error("Failed to remove stage WhatsApp contact:", error.code);
    return { error: "تعذر حذف رقم مسؤول المرحلة." };
  }

  return { success: `تم حذف الرقم ${phone}.` };
}

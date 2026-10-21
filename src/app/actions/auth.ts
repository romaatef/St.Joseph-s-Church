"use server";

import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseActionClient } from "@/lib/supabase/server";
import { isStageId } from "@/config/stages";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
  emailError?: string;
  passwordError?: string;
};

export async function signInAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!getSupabaseConfig()) {
    return { error: "تعذر تسجيل الدخول: إعدادات Supabase غير مكتملة." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const emailError = !email
    ? "يرجى إدخال البريد الإلكتروني."
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "يرجى إدخال بريد إلكتروني صحيح."
      : undefined;
  const passwordError = password ? undefined : "يرجى إدخال كلمة المرور.";

  if (emailError || passwordError) {
    return { emailError, passwordError };
  }

  const supabase = await createSupabaseActionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    if (error?.code === "email_not_confirmed") {
      return {
        error: "لم يتم تأكيد البريد الإلكتروني لهذا الحساب. أكّد البريد من Supabase ثم حاول مجددًا.",
      };
    }
    if (error?.code === "user_banned") {
      return { error: "تم إيقاف حساب Supabase هذا. يرجى التواصل مع مسؤول المشروع." };
    }
    if (error?.code === "over_request_rate_limit" || error?.status === 429) {
      return { error: "تكررت محاولات الدخول. انتظر قليلًا ثم حاول مجددًا." };
    }
    if (
      error &&
      (error.status === 0 || (error.status !== undefined && error.status >= 500))
    ) {
      return { error: "تعذر الاتصال بخدمة تسجيل الدخول. يرجى المحاولة لاحقًا." };
    }
    return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();
    return { error: "تعذر التحقق من صلاحيات الحساب. يرجى المحاولة لاحقًا." };
  }

  if (
    !profile ||
    (profile.role !== "admin" &&
      profile.role !== "stage_responsible" &&
      profile.role !== "viewer")
  ) {
    await supabase.auth.signOut();
    return { error: "هذا الحساب غير مفعّل في نظام الكنيسة." };
  }
  if (!profile.active) {
    await supabase.auth.signOut();
    return { error: "تم إيقاف هذا الحساب. يرجى التواصل مع مسؤول النظام." };
  }

  if (profile.role === "admin") redirect("/");
  if (profile.role === "viewer") redirect("/");

  const { data: assignments, error: assignmentsError } = await supabase
    .from("stage_responsibilities")
    .select("stage_id")
    .eq("user_id", data.user.id);

  if (assignmentsError) {
    await supabase.auth.signOut();
    return { error: "تعذر قراءة المراحل المخصصة لهذا الحساب." };
  }

  const allowedStages = assignments
    .map(({ stage_id }) => stage_id)
    .filter(isStageId);

  if (allowedStages.length === 0) {
    await supabase.auth.signOut();
    return { error: "لم يتم تخصيص أي مرحلة لهذا الحساب. يرجى التواصل مع المسؤول." };
  }

  if (allowedStages.length === 1) redirect(`/stages/${allowedStages[0]}`);
  redirect("/stages");
}

export async function signOutAction() {
  const supabase = await createSupabaseActionClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("تعذر تسجيل الخروج. يرجى إعادة المحاولة.");
  redirect("/login");
}

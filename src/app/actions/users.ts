"use server";

import { isStageId } from "@/config/stages";
import { getCurrentProfile } from "@/lib/auth/profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseActionClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";
import type { AuthError } from "@supabase/supabase-js";

export type UserActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function getAdminContext() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") return null;

  return {
    profile,
    supabase: await createSupabaseActionClient(),
  };
}

function readUserForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleValue = String(formData.get("role") ?? "");
  const stageIds = [...new Set(formData.getAll("stageIds").map(String))];
  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "يرجى إدخال الاسم (حرفان على الأقل).";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "يرجى إدخال بريد إلكتروني صالح.";
  }
  if (
    roleValue !== "admin" &&
    roleValue !== "stage_responsible" &&
    roleValue !== "viewer"
  ) {
    errors.role = "يرجى اختيار دور صالح.";
  }
  if (
    (roleValue === "stage_responsible" || roleValue === "viewer") &&
    stageIds.length === 0
  ) {
    errors.stageIds = "يجب اختيار مرحلة واحدة على الأقل لهذا الحساب.";
  }
  if (stageIds.some((stageId) => !isStageId(stageId))) {
    errors.stageIds = "يتضمن الاختيار مرحلة غير صالحة.";
  }
  if (!formData.get("userId") && password.length < 8) {
    errors.password = "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.";
  }

  return {
    name,
    email,
    password,
    role: roleValue as UserRole,
    stageIds:
      roleValue === "stage_responsible" || roleValue === "viewer"
        ? stageIds.filter(isStageId)
        : [],
    userId: String(formData.get("userId") ?? "").trim(),
    errors,
  };
}

function authErrorMessage(error: AuthError) {
  if (
    error.code === "email_exists" ||
    error.code === "user_already_exists" ||
    /already been registered|already exists/i.test(error.message)
  ) {
    return "هذا البريد الإلكتروني مستخدم بالفعل.";
  }
  if (error.code === "invalid_email") return "صيغة البريد الإلكتروني غير صالحة.";
  if (
    error.code === "weak_password" ||
    /password.*(weak|characters|digit|letter|special)/i.test(error.message)
  ) {
    return "كلمة المرور ضعيفة. استخدم 8 أحرف على الأقل وكلمة مرور أقوى.";
  }
  return "حدث خطأ أثناء تنفيذ العملية. يرجى المحاولة مرة أخرى.";
}

export async function saveUserAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const context = await getAdminContext();
  if (!context) return { error: "لا تملك صلاحية تنفيذ هذا الإجراء." };

  const input = readUserForm(formData);
  if (Object.keys(input.errors).length > 0) return { fieldErrors: input.errors };
  const isEdit = Boolean(input.userId);

  if (isEdit && !isUuid(input.userId)) {
    return { error: "تعذر تحديد الحساب المطلوب." };
  }

  try {
    const admin = createSupabaseAdminClient();
    let userId = input.userId;

    if (!isEdit) {
      const { data, error } = await admin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: { name: input.name },
      });

      if (error) return { error: authErrorMessage(error) };
      userId = data.user.id;
    } else {
      const { data: existingUser, error } = await admin.auth.admin.getUserById(userId);
      if (error || !existingUser.user) {
        return { error: "تعذر العثور على حساب المستخدم." };
      }
    }

    const { error: saveError } = await context.supabase.rpc("admin_save_profile", {
      p_user_id: userId,
      p_name: input.name,
      p_role: input.role,
      p_stage_ids: input.stageIds,
    });

    if (saveError) {
      let rollbackFailed = false;
      if (!isEdit) {
        const { error: rollbackError } = await admin.auth.admin.deleteUser(userId);
        if (rollbackError) {
          rollbackFailed = true;
          console.error("Failed to roll back Auth user after profile save failure:", rollbackError.code);
        }
      }
      const rollbackWarning = rollbackFailed
        ? " لم يكتمل حذف حساب الدخول الذي أُنشئ؛ تحققي من Supabase Auth قبل إعادة المحاولة."
        : "";
      if (saveError.code === "PGRST202") {
        return {
          error: rollbackFailed
            ? "دالة حفظ المستخدم غير متاحة ولم يكتمل حذف حساب الدخول تلقائيًا. تحققي من حساب Auth ثم راجعي ترحيلي Viewer المحدودين."
            : "دالة حفظ المستخدم غير متاحة. راجعي ترحيلي Viewer المحدودين بعد فحص مخطط Supabase.",
        };
      }
      if (
        saveError.code === "22P02" &&
        saveError.message.includes("user_role")
      ) {
        return {
          error: `قاعدة البيانات لم تُحدّث لدعم دور Viewer. راجعي ترحيلي Viewer المحدودين بعد فحص المخطط.${rollbackWarning}`,
        };
      }
      if (
        saveError.code === "23514" &&
        saveError.message.includes("profiles_role_allowed")
      ) {
        return {
          error: `قيد الأدوار في قاعدة البيانات قديم. راجعي ترحيل Viewer المحدود بعد فحص تعريف القيد.${rollbackWarning}`,
        };
      }
      if (saveError.code === "42P01" || saveError.code === "42703") {
        console.error("Supabase profile schema is incomplete:", saveError.code);
        return {
          error: `جداول أو أعمدة الصلاحيات غير محدثة. يلزم فحص مخطط Supabase قبل أي ترحيل.${rollbackWarning}`,
        };
      }
      if (saveError.message.includes("not_authorized")) {
        return { error: "لا تملك صلاحية تنفيذ هذا الإجراء." };
      }
      if (saveError.message.includes("stage_required")) {
        return {
          fieldErrors: {
            stageIds: "يجب اختيار مرحلة واحدة على الأقل لهذا الحساب.",
          },
        };
      }
      if (saveError.message.includes("invalid_stage")) {
        return { fieldErrors: { stageIds: "يتضمن الاختيار مرحلة غير صالحة." } };
      }
      if (
        saveError.message.includes("target_auth_user_not_found") ||
        saveError.message.includes("target_profile_not_found")
      ) {
        return { error: "لم يتم العثور على حساب المستخدم في Supabase Auth." };
      }
      if (saveError.message.includes("last_active_admin")) {
        return { error: "لا يمكن تغيير دور آخر Admin نشط." };
      }
      console.error("Supabase profile save failed:", saveError.code);
      return {
        error: "حدث خطأ أثناء حفظ بيانات المستخدم والصلاحيات.",
      };
    }

    return {
      success: isEdit ? "تم تحديث بيانات المستخدم." : "تمت إضافة المستخدم بنجاح.",
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("إعداد إدارة المستخدمين")) {
      return { error: error.message };
    }
    console.error("User save action failed:", error instanceof Error ? error.name : "UnknownError");
    return { error: "حدث خطأ أثناء إنشاء المستخدم. تحقق من إعداد الخادم ثم حاول مجددًا." };
  }
}

export async function setUserActiveAction(
  userId: string,
  active: boolean,
): Promise<UserActionState> {
  const context = await getAdminContext();
  if (!context) return { error: "لا تملك صلاحية تنفيذ هذا الإجراء." };
  if (!isUuid(userId)) {
    return { error: "تعذر تحديد الحساب المطلوب." };
  }

  const { error } = await context.supabase.rpc("admin_set_profile_active", {
    p_user_id: userId,
    p_active: active,
  });

  if (error) {
    if (error.code === "PGRST202") {
      return {
        error: "إعداد قاعدة البيانات غير مكتمل: شغّل ملف supabase/user-management.sql في Supabase SQL Editor.",
      };
    }
    if (error.message.includes("last_active_admin")) {
      return { error: "لا يمكن تعطيل آخر Admin نشط." };
    }
    if (error.message.includes("target_profile_not_found")) {
      return { error: "لم يتم العثور على حساب المستخدم." };
    }
    return { error: "حدث خطأ أثناء تحديث حالة الحساب." };
  }

  return { success: active ? "تم تفعيل الحساب." : "تم تعطيل الحساب." };
}

export async function deleteUserAction(userId: string): Promise<UserActionState> {
  const context = await getAdminContext();
  if (!context) return { error: "لا تملك صلاحية تنفيذ هذا الإجراء." };
  if (!isUuid(userId)) {
    return { error: "تعذر تحديد الحساب المطلوب." };
  }
  if (context.profile.id === userId) {
    return { error: "لا يمكن حذف حسابك الحالي." };
  }

  try {
    const admin = createSupabaseAdminClient();
    const { data: target, error: profileError } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Failed to verify account before deletion:", profileError.code);
      return { error: "تعذر التحقق من الحساب المطلوب حذفه." };
    }
    if (!target) return { error: "لم يتم العثور على حساب المستخدم." };
    if (target.role === "admin") {
      return { error: "لا يمكن حذف حساب Admin من هذه الشاشة." };
    }

    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) {
      console.error("Supabase Auth account deletion failed:", error.code);
      return {
        error: "تعذر حذف الحساب. لم تُحذف بياناته؛ تحققي من إعدادات Supabase وحاولي مرة أخرى.",
      };
    }

    return { success: "تم حذف الحساب." };
  } catch (error) {
    if (error instanceof Error && error.message.includes("إعداد إدارة المستخدمين")) {
      return { error: error.message };
    }
    console.error(
      "User deletion action failed:",
      error instanceof Error ? error.name : "UnknownError",
    );
    return { error: "حدث خطأ أثناء حذف الحساب." };
  }
}

export async function resetUserPasswordAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const context = await getAdminContext();
  if (!context) return { error: "لا تملك صلاحية تنفيذ هذا الإجراء." };

  const userId = String(formData.get("userId") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!isUuid(userId)) {
    return { error: "تعذر تحديد الحساب المطلوب." };
  }
  if (password.length < 8) {
    return { fieldErrors: { password: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل." } };
  }

  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.auth.admin.updateUserById(userId, { password });
    if (error) return { error: authErrorMessage(error) };
    return { success: "تم تعيين كلمة المرور الجديدة." };
  } catch (error) {
    if (error instanceof Error && error.message.includes("إعداد إدارة المستخدمين")) {
      return { error: error.message };
    }
    console.error(
      "Password reset action failed:",
      error instanceof Error ? error.name : "UnknownError",
    );
    return { error: "حدث خطأ أثناء تعيين كلمة المرور الجديدة." };
  }
}

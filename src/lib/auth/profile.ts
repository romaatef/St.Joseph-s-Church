import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isInvalidRefreshTokenError } from "@/lib/auth/session-errors";
import type { StageId } from "@/config/stages";
import type { UserRole } from "@/types/database";

export type AuthProfile = {
  id: string;
  name: string;
  role: UserRole;
  active: boolean;
  stageIds: StageId[];
};

export async function getCurrentProfile(): Promise<AuthProfile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (
    userError?.name === "AuthSessionMissingError" ||
    isInvalidRefreshTokenError(userError)
  ) {
    return null;
  }
  if (userError) throw new Error("تعذر التحقق من جلسة المستخدم.");
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, role, active")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw new Error("تعذر قراءة صلاحيات المستخدم.");
  if (
    !profile ||
    (profile.role !== "admin" &&
      profile.role !== "stage_responsible" &&
      profile.role !== "viewer")
  ) {
    return null;
  }
  if (!profile.active) return null;

  const { data: assignments, error: assignmentsError } = await supabase
    .from("stage_responsibilities")
    .select("stage_id")
    .eq("user_id", user.id);

  if (assignmentsError) throw new Error("تعذر قراءة المراحل المخصصة للمستخدم.");

  return {
    id: profile.id,
    name: profile.name,
    role: profile.role,
    active: profile.active,
    stageIds: assignments.map((assignment) => assignment.stage_id),
  };
}

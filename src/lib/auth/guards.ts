import { type StageId } from "@/config/stages";
import { getCurrentProfile } from "@/lib/auth/profile";
import { redirect } from "next/navigation";

export async function requireAuthenticated() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireAdmin() {
  const profile = await requireAuthenticated();
  if (profile.role !== "admin") redirect("/stages");
  return profile;
}

export async function requiredStageAccess(requiredStageId: StageId | StageId[]) {
  const profile = await requireAuthenticated();
  const ids = Array.isArray(requiredStageId) ? requiredStageId : [requiredStageId];
  const hasAccess =
    profile.role === "admin" ||
    ids.some((stageId) => profile.stageIds.includes(stageId));
  if (!hasAccess) redirect("/stages?error=not-authorized");
  return profile;
}

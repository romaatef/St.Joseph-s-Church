import { DashboardView } from "@/components/dashboard/DashboardView";
import { getCurrentProfile } from "@/lib/auth/profile";
import { getDashboardSummary } from "@/lib/dashboard-summary";
import {
  getAccessibleAttendanceGroups,
  getAttendanceGroupDetails,
} from "@/lib/google-sheets/attendance.server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "الرئيسية",
};

export default async function HomePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const summary = await getDashboardSummary(profile);
  const addPersonGroups = profile.role === "viewer"
    ? []
    : getAccessibleAttendanceGroups(profile.role, profile.stageIds)
        .map(getAttendanceGroupDetails);

  return (
    <DashboardView
      stageIds={profile.role === "admin" ? undefined : profile.stageIds}
      summary={summary}
      addPersonGroups={addPersonGroups}
    />
  );
}

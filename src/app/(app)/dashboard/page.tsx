import { DashboardView } from "@/components/dashboard/DashboardView";
import { requireAuthenticated } from "@/lib/auth/guards";
import {
  getAccessibleAttendanceGroups,
  getAttendanceGroupDetails,
} from "@/lib/google-sheets/attendance.server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم",
};

export default async function DashboardPage() {
  const profile = await requireAuthenticated();
  const addPersonGroups =
    profile.role === "viewer"
      ? []
    : getAccessibleAttendanceGroups(profile.role, profile.stageIds)
        .map(getAttendanceGroupDetails);
  return (
    <DashboardView
      stageIds={profile.role === "admin" ? undefined : profile.stageIds}
      addPersonGroups={addPersonGroups}
    />
  );
}

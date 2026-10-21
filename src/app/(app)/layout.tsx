import { AppShell } from "@/components/layout/AppShell";
import { getCurrentProfile } from "@/lib/auth/profile";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  if (!getSupabaseConfig()) redirect("/login?error=supabase-config");

  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <AppShell role={profile.role} stageIds={profile.stageIds}>
      {children}
    </AppShell>
  );
}

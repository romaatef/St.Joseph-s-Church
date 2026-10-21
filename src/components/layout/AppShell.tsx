"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { STAGES } from "@/config/stages";
import type { StageId } from "@/config/stages";
import { mainNav } from "@/config/navigation";
import type { UserRole } from "@/types/database";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  role: UserRole;
  stageIds: StageId[];
};

export function AppShell({ children, role, stageIds }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentStage = STAGES.find((stage) => pathname === `/stages/${stage.id}`);
  const current =
    mainNav.find((item) => item.href === pathname) ??
    (pathname === "/dashboard" ? mainNav[0] : undefined);

  return (
    <div className="min-h-full bg-background">
      <div className="lg:ps-[18.5rem]">
        <Header
          title={current?.label ?? currentStage?.name ?? "نظام الإدارة"}
          onMenuClick={() => setOpen(true)}
        />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" data-user-role={role}>
          {children}
        </main>
      </div>
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        role={role}
        stageIds={stageIds}
      />
    </div>
  );
}

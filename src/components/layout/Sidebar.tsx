"use client";

import { ChurchMark } from "@/components/brand/ChurchMark";
import { signOutAction } from "@/app/actions/auth";
import { church } from "@/config/church";
import { mainNav } from "@/config/navigation";
import { STAGES } from "@/config/stages";
import type { StageId } from "@/config/stages";
import type { UserRole } from "@/types/database";
import { cn } from "@/lib/utils";
import { LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  role: UserRole;
  stageIds: StageId[];
};

export function Sidebar({ open, onClose, role, stageIds }: SidebarProps) {
  const pathname = usePathname();
  const hasConnectedStageAccess = stageIds.some((stageId) =>
    STAGES.some((stage) => stage.id === stageId && stage.sheetsLinked),
  );
  const firstAccessibleConnectedStage = STAGES.find(
    (stage) => stage.sheetsLinked && (role === "admin" || stageIds.includes(stage.id)),
  );
  const visibleStages =
    role === "admin"
      ? STAGES
      : STAGES.filter((stage) => stageIds.includes(stage.id));
  const visibleSections =
    role === "admin"
      ? mainNav
      : mainNav.filter(
          (item) =>
            (item.href !== "/children" || Boolean(firstAccessibleConnectedStage)) &&
            (hasConnectedStageAccess ||
              ![
                "/attendance",
                "/repeated-absence",
                "/visitation",
                "/birthdays",
              ].includes(item.href)) &&
            (item.href !== "/servants" || stageIds.includes("servants")),
        );

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-[min(18.5rem,92vw)] flex-col border-e border-border bg-surface",
          "shadow-soft transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-5">
          <Link href="/" className="flex items-start gap-3" onClick={onClose}>
            <ChurchMark />
            <span className="block">
              <span className="block text-sm font-bold leading-6 text-foreground">
                {church.shortName}
              </span>
              <span className="block text-xs leading-5 text-muted-foreground">نظام الإدارة</span>
            </span>
          </Link>
          <button
            type="button"
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={onClose}
            aria-label="إغلاق القائمة"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground">الأقسام</p>
          <ul className="space-y-1">
            {visibleSections.map((item) => {
              const href =
                item.href === "/children" &&
                role !== "admin" &&
                !stageIds.includes("g1-g2") &&
                firstAccessibleConnectedStage
                  ? `/stages/${firstAccessibleConnectedStage.id}`
                  : item.href;
              const active =
                pathname === href ||
                (item.href === "/" && pathname === "/dashboard");
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mb-2 mt-6 px-3 text-xs font-semibold text-muted-foreground">المراحل</p>
          <ul className="space-y-1 px-1">
            {visibleStages.map((stage) => (
              <li key={stage.id}>
                <Link
                  href={`/stages/${stage.id}`}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
                    pathname === `/stages/${stage.id}`
                      ? "bg-muted font-medium text-primary-dark"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-primary-dark">
                    {stage.order}
                  </span>
                  <span>{stage.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <form action={signOutAction}>
            <button
              type="submit"
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              <LogOut className="size-4" />
              تسجيل الخروج
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

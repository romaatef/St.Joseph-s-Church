"use client";

import { church } from "@/config/church";
import { Menu } from "lucide-react";

type HeaderProps = {
  title: string;
  onMenuClick: () => void;
};

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="rounded-xl p-2 text-foreground hover:bg-muted lg:hidden"
          onClick={onMenuClick}
          aria-label="فتح القائمة"
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground sm:text-base">
            {title}
          </p>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {church.name}
          </p>
        </div>
      </div>
    </header>
  );
}

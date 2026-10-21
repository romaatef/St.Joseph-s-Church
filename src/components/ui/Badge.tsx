import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeTone = "neutral" | "primary" | "accent";

const toneClass: Record<BadgeTone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary/10 text-primary-dark",
  accent: "bg-accent/20 text-accent-foreground",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}

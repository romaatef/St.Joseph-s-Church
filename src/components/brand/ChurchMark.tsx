import { cn } from "@/lib/utils";

type ChurchMarkProps = {
  className?: string;
};

export function ChurchMark({ className }: ChurchMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <path
          d="M12 3v18M8 7h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 20h12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

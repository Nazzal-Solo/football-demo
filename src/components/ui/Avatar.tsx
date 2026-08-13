import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  clubColor?: string;
  className?: string;
  highlight?: boolean;
}

const sizes = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-sm",
  xl: "h-20 w-20 text-lg",
};

export function Avatar({
  initials,
  size = "md",
  clubColor = "#2dd67b",
  className,
  highlight,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl font-bold text-white shadow-inner",
        sizes[size],
        highlight && "ring-2 ring-[var(--pitch)] ring-offset-2 ring-offset-[#05080f]",
        className
      )}
      style={{
        background: `linear-gradient(145deg, ${clubColor}, #0b1220 70%)`,
      }}
      aria-hidden
    >
      <span className="latin-meta">{initials}</span>
    </div>
  );
}

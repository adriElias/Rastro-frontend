/* eslint-disable react-refresh/only-export-components -- statusColor is a public style map used alongside StatusBadge. */
import { Heart, Search, Sparkles } from "lucide-react";
import type { PetStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

const styles: Record<
  PetStatus,
  { label: string; className: string; Icon: typeof Search }
> = {
  lost: { label: "Lost", className: "bg-primary text-primary-foreground", Icon: Search },
  found: { label: "Found", className: "bg-info text-white", Icon: Sparkles },
  reunited: { label: "Reunited", className: "bg-success text-white", Icon: Heart },
};

export function StatusBadge({
  status,
  className,
  pulse = false,
}: {
  status: PetStatus;
  className?: string;
  pulse?: boolean;
}) {
  const { label, className: tone, Icon } = styles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide shadow-sm",
        tone,
        className,
      )}
    >
      {pulse && status === "lost" ? (
        <span className="relative flex size-2" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/80 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-white" />
        </span>
      ) : (
        <Icon className="size-3.5" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

export const statusColor: Record<PetStatus, string> = {
  lost: "#FF7A59",
  found: "#4D96FF",
  reunited: "#4CAF50",
};

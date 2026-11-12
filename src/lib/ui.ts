import { cva, type VariantProps } from "class-variance-authority";

export const action = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[var(--shadow-lift)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0",
        outline:
          "border-2 border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent",
        ghost: "text-foreground hover:bg-muted",
        soft: "bg-accent text-accent-foreground hover:bg-primary/15",
        info: "bg-info text-white hover:-translate-y-0.5 hover:brightness-105",
        success: "bg-success text-white hover:-translate-y-0.5 hover:brightness-105",
        danger: "bg-destructive/10 text-destructive hover:bg-destructive/15",
      },
      size: {
        sm: "h-9 px-4 text-sm [&_svg]:size-4",
        md: "h-11 px-5 text-sm [&_svg]:size-4",
        lg: "h-14 px-7 text-base [&_svg]:size-5",
        icon: "size-10 [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ActionProps = VariantProps<typeof action>;

export const card = "rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]";

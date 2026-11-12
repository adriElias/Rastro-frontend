import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

function shouldSkipMotion() {
  return prefersReducedMotion() || typeof IntersectionObserver === "undefined";
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(shouldSkipMotion);

  useEffect(() => {
    const node = ref.current;
    if (shouldSkipMotion()) return;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none",
        visible || shouldSkipMotion()
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function AnimatedCounter({
  value,
  duration = 1600,
  className,
  suffix = "",
}: {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => (shouldSkipMotion() ? value : 0));

  useEffect(() => {
    const node = ref.current;
    if (shouldSkipMotion()) return;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {(shouldSkipMotion() ? value : display).toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

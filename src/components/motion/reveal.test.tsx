import { act, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnimatedCounter, Reveal } from "@/components/motion/reveal";

let intersectionCallback: IntersectionObserverCallback;
let observerCount = 0;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: number[] = [];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
    observerCount += 1;
  }

  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  static intersect() {
    const entry = { isIntersecting: true } as IntersectionObserverEntry;
    intersectionCallback([entry], {} as IntersectionObserver);
  }
}

function enableIntersectionObserver() {
  observerCount = 0;
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
}

afterEach(() => {
  Reflect.deleteProperty(window, "matchMedia");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function preferReducedMotion() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn() }),
  });
}

describe("Reveal", () => {
  it("reveals content when it intersects and supports a semantic element", () => {
    enableIntersectionObserver();
    const { container } = render(
      <Reveal as="li" delay={120}>
        Revealed content
      </Reveal>,
    );

    const item = container.querySelector("li");
    expect(item).toHaveClass("translate-y-6", "opacity-0");
    expect(item).toHaveStyle({ transitionDelay: "120ms" });

    act(() => MockIntersectionObserver.intersect());
    expect(item).toHaveClass("translate-y-0", "opacity-100");
  });

  it("shows content immediately and skips observation when reduced motion is preferred", () => {
    enableIntersectionObserver();
    preferReducedMotion();
    const { getByText } = render(<Reveal>Accessible motion</Reveal>);

    expect(getByText("Accessible motion")).toHaveClass(
      "translate-y-0",
      "opacity-100",
    );
    expect(observerCount).toBe(0);
  });
});

describe("AnimatedCounter", () => {
  it("animates to its value after entering the viewport and appends its suffix", () => {
    enableIntersectionObserver();
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.stubGlobal(
      "requestAnimationFrame",
      (callback: FrameRequestCallback) => {
        callback(1600);
        return 1;
      },
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    const { container } = render(<AnimatedCounter value={3216} suffix="+" />);

    expect(within(container).getByText("0+")).toBeInTheDocument();
    act(() => MockIntersectionObserver.intersect());
    expect(within(container).getByText("3,216+")).toBeInTheDocument();
  });

  it("shows the final value without animation for reduced-motion users", () => {
    enableIntersectionObserver();
    preferReducedMotion();
    const { container } = render(<AnimatedCounter value={1287} suffix=" pets" />);

    expect(within(container).getByText("1,287 pets")).toBeInTheDocument();
    expect(observerCount).toBe(0);
  });
});

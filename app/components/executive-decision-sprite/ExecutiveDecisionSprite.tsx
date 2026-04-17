"use client";

import { useEffect, useRef } from "react";
import { createSpriteAnimator } from "./animator";
import "./executive-decision-sprite.css";

export type ExecutiveDecisionVariant = "blue" | "red";

type Props = {
  variant: ExecutiveDecisionVariant;
  /** Hide the floating “ask a question” / “one moment” copy */
  hideLabels?: boolean;
  /** Tighter spacing for narrow columns (e.g. hero grid) */
  compact?: boolean;
  className?: string;
};

export function ExecutiveDecisionSprite({
  variant,
  hideLabels = false,
  compact = false,
  className = "",
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const sheetIndex = variant === "blue" ? 0 : 1;
    const animator = createSpriteAnimator(el, sheetIndex);
    animator.start();

    return () => {
      animator.destroy();
    };
  }, [variant]);

  return (
    <div
      ref={mountRef}
      className={[
        "edm-root",
        variant === "blue" ? "edm-blue" : "edm-red",
        compact ? "edm-root--compact" : "",
        hideLabels ? "edm-hide-labels" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="button"
      tabIndex={0}
      aria-label="Animated character — click to get a random answer animation"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          mountRef.current?.querySelector(".edm-container")?.dispatchEvent(
            new MouseEvent("click", { bubbles: true, cancelable: true })
          );
        }
      }}
    />
  );
}

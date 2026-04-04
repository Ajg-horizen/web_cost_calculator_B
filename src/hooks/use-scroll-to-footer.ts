import { useEffect, useRef } from "react";
import { useIsMobile } from "./use-mobile";

export function useScrollToFooter(deps: unknown[]) {
  const footerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;
    // Small delay to let the UI settle after selection
    const timeout = setTimeout(() => {
      footerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 250);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return footerRef;
}

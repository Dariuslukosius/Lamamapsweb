import { createContext, useContext, useCallback, useEffect, useMemo } from "react";
import { trackMetaEvent } from "@/lib/metaPixel";
import { openCalendlyPopup } from "./calendlyPopup";
import { trackHormozi, HORMOZI_EVENTS } from "./tracking";

/** Which of the page's two CTAs opened the modal. */
export type CtaVariant = "primary" | "secondary";

interface TrialModalContextValue {
  openTrialModal: (variant?: CtaVariant) => void;
}

const TrialModalContext = createContext<TrialModalContextValue | null>(null);

export function useTrialModal() {
  const ctx = useContext(TrialModalContext);
  if (!ctx) throw new Error("useTrialModal must be used within TrialModalProvider");
  return ctx;
}

function isCalendlyEvent(e: MessageEvent) {
  return e.origin === "https://calendly.com" && typeof e.data === "object" && e.data?.event?.indexOf("calendly.") === 0;
}

export function TrialModalProvider({ children }: { children: React.ReactNode }) {
  // Uses Calendly's own native popup widget (same one the rest of the site relies
  // on) rather than an inline embed inside our own dialog — Calendly's inline embed
  // caps its content at ~700px wide regardless of container width, so it never
  // reaches the two-column "profile left / calendar right" desktop layout. The
  // native popup sizes itself against the real viewport and gets that layout.
  const openTrialModal = useCallback((variant: CtaVariant = "primary") => {
    // Unchanged from /trial — the standard Lead event keeps the exact same name
    // and payload on both pages so historical reporting stays continuous.
    trackMetaEvent("Lead", { content_name: "Free Trial Form" });
    // Added alongside it, in its own namespace, so the two pages can be split.
    trackHormozi(variant === "primary" ? HORMOZI_EVENTS.ctaPrimary : HORMOZI_EVENTS.ctaSecondary, {
      cta_text: variant,
    });
    openCalendlyPopup();
  }, []);
  const value = useMemo(() => ({ openTrialModal }), [openTrialModal]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (isCalendlyEvent(e) && e.data.event === "calendly.event_scheduled") {
        trackMetaEvent("Schedule", { content_name: "Free Trial Call Booked" });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return <TrialModalContext.Provider value={value}>{children}</TrialModalContext.Provider>;
}

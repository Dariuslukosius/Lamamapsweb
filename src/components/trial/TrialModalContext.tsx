import { createContext, useContext, useCallback, useMemo } from "react";
import { trackMetaEvent } from "@/lib/metaPixel";
import { openCalendlyPopup } from "@/lib/calendlyPopup";

interface TrialModalContextValue {
  openTrialModal: () => void;
}

const TrialModalContext = createContext<TrialModalContextValue | null>(null);

export function useTrialModal() {
  const ctx = useContext(TrialModalContext);
  if (!ctx) throw new Error("useTrialModal must be used within TrialModalProvider");
  return ctx;
}

export function TrialModalProvider({ children }: { children: React.ReactNode }) {
  // Uses Calendly's own native popup widget (same one the rest of the site relies
  // on) rather than an inline embed inside our own dialog — Calendly's inline embed
  // caps its content at ~700px wide regardless of container width, so it never
  // reaches the two-column "profile left / calendar right" desktop layout. The
  // native popup sizes itself against the real viewport and gets that layout.
  const openTrialModal = useCallback(() => {
    trackMetaEvent("Lead", { content_name: "Free Trial Form" });
    openCalendlyPopup();
  }, []);
  const value = useMemo(() => ({ openTrialModal }), [openTrialModal]);

  return <TrialModalContext.Provider value={value}>{children}</TrialModalContext.Provider>;
}

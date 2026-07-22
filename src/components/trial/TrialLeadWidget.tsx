import { useEffect, useRef } from "react";
import { trackMetaEvent } from "@/lib/metaPixel";

const CALENDLY_URL = "https://calendly.com/llamamaps/30min";

function isCalendlyEvent(e: MessageEvent) {
  return e.origin === "https://calendly.com" && typeof e.data === "object" && e.data?.event?.indexOf("calendly.") === 0;
}

// Calendly's widget.js augments `window` at runtime and ships no official types;
// read it through an unknown-cast instead of a global Window augmentation, since
// this project already declares a differently-shaped `Window.Calendly` elsewhere.
function getCalendlyInlineWidget() {
  const calendly = (window as unknown as { Calendly?: { initInlineWidget?: (options: {
    url: string;
    parentElement: HTMLElement;
    prefill?: Record<string, unknown>;
    utm?: Record<string, unknown>;
  }) => void } }).Calendly;
  return calendly?.initInlineWidget;
}

interface TrialLeadWidgetProps {
  calendlyHeight?: number;
}

const TrialLeadWidget = ({ calendlyHeight = 680 }: TrialLeadWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // This listener also catches bookings made through the native Calendly popup
  // (triggered elsewhere on the page via openCalendlyPopup) — postMessage
  // listeners are global to the window, not scoped to a single iframe instance.
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (isCalendlyEvent(e) && e.data.event === "calendly.event_scheduled") {
        trackMetaEvent("Schedule", { content_name: "Free Trial Call Booked" });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    const initializeCalendly = () => {
      getCalendlyInlineWidget()?.({ url: CALENDLY_URL, parentElement: container, utm: {} });
    };

    const existingScript = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]',
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (getCalendlyInlineWidget()) {
        initializeCalendly();
      } else {
        existingScript.addEventListener("load", initializeCalendly);
        return () => existingScript.removeEventListener("load", initializeCalendly);
      }
    } else {
      if (!document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://assets.calendly.com/assets/external/widget.css";
        document.head.appendChild(link);
      }
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.addEventListener("load", initializeCalendly);
      document.body.appendChild(script);
      return () => script.removeEventListener("load", initializeCalendly);
    }
  }, []);

  return (
    <div className="tp-widget">
      <div className="tp-widget-calendar">
        <div ref={containerRef} style={{ minWidth: "280px", height: `${calendlyHeight}px` }} />
      </div>
    </div>
  );
};

export default TrialLeadWidget;

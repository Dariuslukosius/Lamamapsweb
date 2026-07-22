import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/metaPixel";
import { openCalendlyPopup } from "@/lib/calendlyPopup";

function isCalendlyEvent(e: MessageEvent) {
  return e.origin === "https://calendly.com" && typeof e.data === "object" && e.data?.event?.indexOf("calendly.") === 0;
}

const CalendlyBadge = () => {
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (isCalendlyEvent(e) && e.data.event === "calendly.event_scheduled") {
        trackMetaEvent("Schedule", { content_name: "Free Trial Call Booked" });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <button
      type="button"
      onClick={openCalendlyPopup}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        backgroundColor: "#0069ff",
        color: "#ffffff",
        border: "none",
        borderRadius: "9999px",
        padding: "12px 20px",
        fontSize: "14px",
        fontWeight: 600,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        cursor: "pointer",
      }}
    >
      Schedule time with me
    </button>
  );
};

export default CalendlyBadge;

const CALENDLY_URL = "https://calendly.com/llamamaps/30min";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

function ensureCalendlyAssets(onReady: () => void) {
  if (!document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);
  }

  if (window.Calendly) {
    onReady();
    return;
  }

  const existingScript = document.querySelector(
    'script[src="https://assets.calendly.com/assets/external/widget.js"]'
  ) as HTMLScriptElement | null;

  if (existingScript) {
    existingScript.addEventListener("load", onReady, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  script.addEventListener("load", onReady, { once: true });
  document.body.appendChild(script);
}

export function openCalendlyPopup() {
  ensureCalendlyAssets(() => {
    window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
  });
}

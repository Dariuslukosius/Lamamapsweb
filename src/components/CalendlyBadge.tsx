import { useEffect } from "react";

const CalendlyBadge = () => {
  useEffect(() => {
    // Add CSS
    if (!document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement("link");
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    const initBadge = () => {
      // @ts-ignore
      if (window.Calendly && !document.querySelector(".calendly-badge-widget")) {
        // @ts-ignore
        window.Calendly.initBadgeWidget({
          url: 'https://calendly.com/llamamaps/30min',
          text: 'Schedule time with me',
          color: '#0069ff',
          textColor: '#ffffff',
          branding: false
        });
      }
    };

    // Add Script and initialize
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]') as HTMLScriptElement;
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = initBadge;
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      if (window.Calendly) {
        initBadge();
      } else {
        existingScript.addEventListener("load", initBadge);
      }
    }

    return () => {
      // Cleanup the badge when component unmounts to prevent duplicates
      const badge = document.querySelector(".calendly-badge-widget");
      if (badge) {
        badge.remove();
      }
    };
  }, []);

  return null;
};

export default CalendlyBadge;

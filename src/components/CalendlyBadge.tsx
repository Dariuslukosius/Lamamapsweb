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

    // Add Script and initialize
    if (!document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = () => {
        // @ts-ignore - Calendly is added to window by the external script
        if (window.Calendly) {
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
      document.body.appendChild(script);
    } else {
      // If script is already loaded but badge is not initialized (e.g. HMR or navigating back)
      // @ts-ignore
      if (window.Calendly) {
          // @ts-ignore
          window.Calendly.initBadgeWidget({
            url: 'https://calendly.com/llamamaps/30min',
            text: 'Schedule time with me',
            color: '#0069ff',
            textColor: '#ffffff',
            branding: false
          });
      }
    }
  }, []);

  return null;
};

export default CalendlyBadge;

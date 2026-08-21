import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import MetaPixelPageView from "@/components/MetaPixelPageView";
import Index from "./pages/Index.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";
import ContactsPage from "./pages/ContactsPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import FreeTrialPage from "./pages/FreeTrialPage.tsx";
import TrialPage from "./pages/TrialPage.tsx";
import TrialHormoziPage from "./pages/TrialHormoziPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import CalendlyBadge from "./components/CalendlyBadge.tsx";

const queryClient = new QueryClient();

// The /trial landing page is a fully isolated destination for ad traffic — it
// must only ever open its own dedicated booking modal, never the site-wide
// Calendly badge's popup. /trial-hormozi is its A/B variant and has to be
// suppressed on the same terms, or the variant would carry an extra CTA the
// control does not and the test would measure that instead of the copy.
const ISOLATED_LANDING_PATHS = new Set(["/trial", "/trial-hormozi"]);

const GlobalCalendlyBadge = () => {
  const { pathname } = useLocation();
  // Match on a normalised path, not the raw one. Ad URLs arrive in whatever
  // shape they were pasted into the ad platform, and llamamaps.com serves
  // "/trial/" with a 200 rather than redirecting it to "/trial" — so the raw
  // lookup missed, the badge rendered on the landing page anyway, and it sits
  // in the same corner as the page's own floating CTA, intercepting its clicks.
  // Paid traffic would have been sent to the one URL shape that breaks the CTA.
  const normalizedPath = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  if (ISOLATED_LANDING_PATHS.has(normalizedPath)) return null;
  return <CalendlyBadge />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <MetaPixelPageView />
        <GlobalCalendlyBadge />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/free-trial" element={<FreeTrialPage />} />
          <Route path="/trial" element={<TrialPage />} />
          <Route path="/trial-hormozi" element={<TrialHormoziPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

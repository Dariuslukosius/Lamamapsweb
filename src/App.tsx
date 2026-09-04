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
import LandingPageV3Page from "./pages/LandingPageV3Page.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import CalendlyBadge from "./components/CalendlyBadge.tsx";

const queryClient = new QueryClient();

// /trial is a fully isolated destination for ad traffic — it must only ever
// open its own dedicated booking modal, never the site-wide Calendly badge's
// popup, or the badge would sit in the same bottom corner as the page's own
// floating CTA and intercept its clicks.
//
// /services carries the same landingpage-v3 content (see LandingPageV3Page's
// `chrome` prop) and therefore the same floating CTA, so it is isolated for
// the identical reason even though it is an ordinary, indexable page of the
// site rather than an ad landing.
const ISOLATED_LANDING_PATHS = new Set(["/trial", "/services"]);

const GlobalCalendlyBadge = () => {
  const { pathname } = useLocation();
  // Match on a normalised path, not the raw one. Ad URLs arrive in whatever
  // shape they were pasted into the ad platform, and llamamaps.com serves
  // "/trial/" with a 200 rather than redirecting it to "/trial" — so the raw
  // lookup missed, the badge rendered on the landing page anyway, and it sits
  // in the same corner as the page's own floating CTA, intercepting its clicks.
  const normalizedPath = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  if (ISOLATED_LANDING_PATHS.has(normalizedPath)) return null;
  return <CalendlyBadge />;
};

// This project now builds one product only — llamamaps.com — so there is no
// longer a DEPLOY_TARGET branch to pick between. See CLEANUP-TRIAL-ONLY-PROMPT.md
// for what used to live here: /free-trial, /landingpage, /trial-v2..v4 and
// /landingpage-v2 were each their own page or their own single-page domain
// build; all of that was retired in favour of one /trial landing page carrying
// the landingpage-v3 content, and the redirects below send anything that still
// links to the old paths there instead of 404ing.
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/contacts" element={<ContactsPage />} />
    <Route path="/trial" element={<LandingPageV3Page />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <MetaPixelPageView />
        <GlobalCalendlyBadge />
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

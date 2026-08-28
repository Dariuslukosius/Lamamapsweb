import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import MetaPixelPageView from "@/components/MetaPixelPageView";
import { DEPLOY_TARGET } from "@/lib/siteConfig";
import Index from "./pages/Index.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";
import ContactsPage from "./pages/ContactsPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import FreeTrialPage from "./pages/FreeTrialPage.tsx";
import TrialPage from "./pages/TrialPage.tsx";
import TrialHormoziPage from "./pages/TrialHormoziPage.tsx";
import TrialV2Page from "./pages/TrialV2Page.tsx";
import LandingPageV2Page from "./pages/LandingPageV2Page.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import CalendlyBadge from "./components/CalendlyBadge.tsx";

const queryClient = new QueryClient();

// The /trial landing page is a fully isolated destination for ad traffic — it
// must only ever open its own dedicated booking modal, never the site-wide
// Calendly badge's popup. /landingpage is its A/B variant and has to be
// suppressed on the same terms, or the variant would carry an extra CTA the
// control does not and the test would measure that instead of the copy.
//
// On the single-landing-page targets the badge is not rendered at all, so the
// path list only has to cover the main site, where both live on sub-paths.
const ISOLATED_LANDING_PATHS = new Set(["/trial", "/landingpage", "/trial-v2", "/landingpage-v2"]);

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

// Written as a literal if/else on a build-time constant rather than a lookup
// table so Rollup can fold the comparison and drop the branches this build does
// not take — a landing-page deployment then ships without the rest of the site
// in its bundle, which is the whole point of giving it its own domain.
//
// The old sub-path stays mapped on the landing targets and redirects to "/".
// Ads, QR codes and bookmarks pointing at <domain>/trial were created before
// the split and must not start 404ing the day the domain changes; Cloudflare
// answers them with a 301 before the SPA loads (see scripts/site-files.mjs),
// and this route is the client-side equivalent for in-app navigation.
const AppRoutes = () => {
  if (DEPLOY_TARGET === "trial") {
    return (
      <Routes>
        <Route path="/" element={<TrialPage />} />
        <Route path="/trial" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  if (DEPLOY_TARGET === "landingpage") {
    return (
      <Routes>
        <Route path="/" element={<TrialHormoziPage />} />
        <Route path="/landingpage" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/free-trial" element={<FreeTrialPage />} />
      <Route path="/trial" element={<TrialPage />} />
      <Route path="/landingpage" element={<TrialHormoziPage />} />
      {/* Reworked versions of the two landing pages, kept alongside the
          originals so the two can be compared at the same time. Main
          target only: the single-page deployments each ship one product,
          and adding a second copy of it to those bundles is exactly the
          weight the domain split exists to avoid. */}
      <Route path="/trial-v2" element={<TrialV2Page />} />
      <Route path="/landingpage-v2" element={<LandingPageV2Page />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <MetaPixelPageView />
        {DEPLOY_TARGET === "main" && <GlobalCalendlyBadge />}
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

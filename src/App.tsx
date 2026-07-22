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
import PrivacyPage from "./pages/PrivacyPage.tsx";
import CalendlyBadge from "./components/CalendlyBadge.tsx";

const queryClient = new QueryClient();

// The /trial landing page is a fully isolated destination for ad traffic — it
// must only ever open its own dedicated booking modal, never the site-wide
// Calendly badge's popup.
const GlobalCalendlyBadge = () => {
  const { pathname } = useLocation();
  if (pathname === "/trial") return null;
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
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

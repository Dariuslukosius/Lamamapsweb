import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {/* Without this the page inherited index.html's head verbatim: the site
          title, "index, follow", and a canonical claiming to be the home page.
          Cloudflare serves this component's prerendered snapshot for every
          unknown URL, so that head would have invited Google to index an
          unlimited number of URLs as duplicates of the home page. */}
      <SEO
        title="404 — Page Not Found | Llamamaps"
        description="This page does not exist. Return to Llamamaps for local SEO services that put your business in the TOP 3 on Google Maps."
        noindex
      />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-[#C9A24A] underline hover:text-[#DEC584]">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

import { useEffect, useRef, useState } from "react";

/**
 * Reports whether an element has come within `rootMargin` of the viewport, and
 * latches true once it has.
 *
 * This exists because `loading="lazy"` alone does not hold these pages back.
 * Two things defeat it:
 *
 *  1. Chrome's lazy-load threshold is a heuristic that widens on slow
 *     connections — exactly the visitors this is meant to protect. Measured on
 *     a throttled mobile profile, the built page fetched 57 of its 91 images
 *     before the visitor scrolled once, reaching ~7,300px down a 915px
 *     viewport.
 *  2. The pages are prerendered but mounted with `createRoot().render()`, not
 *     `hydrateRoot()`. React therefore throws the snapshot's DOM away and
 *     rebuilds it. While that rebuild is in flight the document is far shorter
 *     than its final ~29,000px, so images that will end up far below the fold
 *     are momentarily close to it, and the heuristic fires on them.
 *
 * An explicit observer is immune to both: it measures the real, settled
 * position of the real element.
 */
export function useNearViewport<T extends Element>(rootMargin = "600px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;

    // Old browsers, and the prerender snapshot's own environment, just get the
    // images immediately — degrading to today's behaviour rather than to a
    // page with no screenshots on it.
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return [ref, near] as const;
}

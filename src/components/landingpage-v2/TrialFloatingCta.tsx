import { useEffect, useState } from "react";
import { useTrialModal } from "./TrialModalContext";
import { COPY } from "./copy";

// The floating CTA carries the secondary action: once it appears it follows the
// visitor down the whole page, and the low-commitment ask is the one that
// survives being asked repeatedly. The primary CTA stays anchored to the
// sections that have just earned it.
const TrialFloatingCta = () => {
  const { openTrialModal } = useTrialModal();

  // The hero carries its own primary CTA, and on a 390px-wide phone the floating
  // pill lands directly on top of it — covering part of its label at first paint,
  // on the page's most valuable click. Hold the pill back until the hero has
  // scrolled out of view; from then on it follows the visitor down the page.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("l2-home");
    if (!hero || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <button
      type="button"
      className={`l2-floating-cta${shown ? " l2-floating-cta--in" : ""}`}
      onClick={() => openTrialModal("secondary")}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
    >
      {COPY.cta.secondary}
    </button>
  );
};

export default TrialFloatingCta;

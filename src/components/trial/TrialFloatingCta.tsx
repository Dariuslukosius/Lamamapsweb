import { useEffect, useState } from "react";
import { useTrialModal } from "./TrialModalContext";

const TrialFloatingCta = () => {
  const { openTrialModal } = useTrialModal();

  // The hero carries its own primary CTA, and on a 390px-wide phone the floating
  // pill lands directly on top of it — covering part of its label at first paint,
  // on the page's most valuable click. Hold the pill back until the hero has
  // scrolled out of view; from then on it follows the visitor down the page.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("tp-home");
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
      className={`tp-floating-cta${shown ? " tp-floating-cta--in" : ""}`}
      onClick={openTrialModal}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
    >
      Schedule time with us
    </button>
  );
};

export default TrialFloatingCta;

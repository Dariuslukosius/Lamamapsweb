import { useEffect, useRef, useState } from "react";
import { useTrialModal } from "./TrialModalContext";

const TrialFloatingCta = () => {
  const { openTrialModal } = useTrialModal();

  // Two independent conditions gate visibility, both must allow it:
  //
  // pastHero: the hero carries its own primary CTA, and on a 390px-wide phone
  // the floating pill would land directly on top of it at first paint,
  // covering part of its label on the page's most valuable click. Held back
  // until the hero has scrolled out of view.
  //
  // settled: a `position: fixed` pill has no idea what content is currently
  // under it — on a page this long (~30,000px on /trial-v2) that corner
  // passes over review stars, testimonial text, section headings and other
  // buttons dozens of times per scroll. Rather than trying to detect and dodge
  // each one individually (fragile, and still misses plain text), it hides
  // for the whole time the page is actively moving and only reappears once
  // scrolling has stopped — the same pattern mobile Safari's own toolbar
  // uses. A user mid-scroll is reading, not deciding; a user who has stopped
  // is a fair moment to offer the CTA, and by then whatever is under the
  // pill is content they have already scrolled past, not new text arriving.
  const [pastHero, setPastHero] = useState(false);
  const [settled, setSettled] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("t2-home");
    if (!hero || typeof IntersectionObserver === "undefined") {
      setPastHero(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setSettled(false);
      clearTimeout(timer);
      timer = setTimeout(() => setSettled(true), 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const shown = pastHero && settled;

  return (
    <button
      type="button"
      className={`t2-floating-cta${shown ? " t2-floating-cta--in" : ""}`}
      onClick={openTrialModal}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
    >
      Schedule time with us
    </button>
  );
};

export default TrialFloatingCta;

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useTrialModal } from "./TrialModalContext";
import { COPY } from "./copy";
import TrustBadges from "./TrustBadges";

const competitors = ["Competitor Dental Studio", "Bright Smile Clinic", "City Dental Group"];

// Conveys "you exist, but nobody scrolls far enough to find you": a search bar
// types out a query, results reveal one by one, and the viewer's own business
// shows up buried near the bottom while a scroll indicator sweeps straight past
// it without stopping. Runs once when the section enters the viewport.
const TrialInvisibilitySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const { openTrialModal } = useTrialModal();

  return (
    <section className="l2-section l2-section--sm">
      <div className="l2-container">
        <div className="l2-center" style={{ maxWidth: 720 }}>
          <span className="l2-eyebrow">The hidden problem</span>
          <h2 className="l2-h2">
            Why aren't you visible on <em>Google</em>?
          </h2>
          <p className="l2-lead l2-center">
            Your business exists. It just isn't showing up first — and customers rarely scroll far enough to find you
            anyway.
          </p>
        </div>

        <div ref={ref} className={`l2-invisible-demo${inView ? " is-active" : ""}`}>
          <div className="l2-invisible-search">
            <span className="l2-invisible-search-icon">🔍</span>
            <span className="l2-invisible-search-text">dentist near me</span>
          </div>

          <div className="l2-invisible-list">
            {competitors.map((name, i) => (
              <div key={name} className="l2-invisible-row" style={{ transitionDelay: `${0.5 + i * 0.12}s` }}>
                <span className="l2-invisible-row-rank">{i + 1}</span>
                <span>{name}</span>
              </div>
            ))}
            <div className="l2-invisible-ellipsis">···</div>
            <div className="l2-invisible-row l2-invisible-row--you" style={{ transitionDelay: "1.1s" }}>
              <span className="l2-invisible-row-rank">14</span>
              <span>Your Business</span>
            </div>
          </div>

          <div className="l2-invisible-scrolltrack">
            <div className="l2-invisible-scrollthumb" />
          </div>
        </div>

        <p className="l2-lead l2-center" style={{ marginTop: 44 }}>
          Stop losing customers to competitors. See where you rank — free.
        </p>
        <div className="l2-cta-row">
          <button type="button" className="l2-btn" onClick={() => openTrialModal("primary")}>
            {COPY.cta.primary}
          </button>
          <button type="button" className="l2-btn l2-btn--ghost" onClick={() => openTrialModal("secondary")}>
            {COPY.cta.secondary}
          </button>
        </div>
        <TrustBadges />
      </div>
    </section>
  );
};

export default TrialInvisibilitySection;

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useTrialModal } from "./TrialModalContext";

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
    <section className="t4-section t4-section--sm">
      <div className="t4-container">
        <div className="t4-center" style={{ maxWidth: 720 }}>
          <span className="t4-eyebrow">The hidden problem</span>
          <h2 className="t4-h2">
            Why aren't you visible on <em>Google</em>?
          </h2>
          <p className="t4-lead t4-center">
            Your business exists. It just isn't showing up first — and customers rarely scroll far enough to find you
            anyway.
          </p>
        </div>

        <div ref={ref} className={`t4-invisible-demo${inView ? " is-active" : ""}`}>
          <div className="t4-invisible-search">
            <span className="t4-invisible-search-icon">🔍</span>
            <span className="t4-invisible-search-text">dentist near me</span>
          </div>

          <div className="t4-invisible-list">
            {competitors.map((name, i) => (
              <div key={name} className="t4-invisible-row" style={{ transitionDelay: `${0.5 + i * 0.12}s` }}>
                <span className="t4-invisible-row-rank">{i + 1}</span>
                <span>{name}</span>
              </div>
            ))}
            <div className="t4-invisible-ellipsis">···</div>
            <div className="t4-invisible-row t4-invisible-row--you" style={{ transitionDelay: "1.1s" }}>
              <span className="t4-invisible-row-rank">14</span>
              <span>Your Business</span>
            </div>
          </div>

          <div className="t4-invisible-scrolltrack">
            <div className="t4-invisible-scrollthumb" />
          </div>
        </div>

        <p className="t4-lead t4-center" style={{ marginTop: 44 }}>
          Stop losing customers to competitors. See where you rank — free.
        </p>
        <div className="t4-cta-row">
          <button type="button" className="t4-btn" onClick={openTrialModal}>
            Get Your Free Trial
          </button>
          <button type="button" className="t4-btn t4-btn--outline" onClick={openTrialModal}>
            Schedule Time With Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrialInvisibilitySection;

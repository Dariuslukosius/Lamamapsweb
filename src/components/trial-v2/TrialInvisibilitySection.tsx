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
    <section className="t2-section t2-section--sm">
      <div className="t2-container">
        <div className="t2-center" style={{ maxWidth: 720 }}>
          <span className="t2-eyebrow">The hidden problem</span>
          <h2 className="t2-h2">
            Why aren't you visible on <em>Google</em>?
          </h2>
          <p className="t2-lead t2-center">
            Your business exists. It just isn't showing up first — and customers rarely scroll far enough to find you
            anyway.
          </p>
        </div>

        <div ref={ref} className={`t2-invisible-demo${inView ? " is-active" : ""}`}>
          <div className="t2-invisible-search">
            <span className="t2-invisible-search-icon">🔍</span>
            <span className="t2-invisible-search-text">dentist near me</span>
          </div>

          <div className="t2-invisible-list">
            {competitors.map((name, i) => (
              <div key={name} className="t2-invisible-row" style={{ transitionDelay: `${0.5 + i * 0.12}s` }}>
                <span className="t2-invisible-row-rank">{i + 1}</span>
                <span>{name}</span>
              </div>
            ))}
            <div className="t2-invisible-ellipsis">···</div>
            <div className="t2-invisible-row t2-invisible-row--you" style={{ transitionDelay: "1.1s" }}>
              <span className="t2-invisible-row-rank">14</span>
              <span>Your Business</span>
            </div>
          </div>

          <div className="t2-invisible-scrolltrack">
            <div className="t2-invisible-scrollthumb" />
          </div>
        </div>

        <p className="t2-lead t2-center" style={{ marginTop: 44 }}>
          Stop losing customers to competitors. See where you rank — free.
        </p>
        <div className="t2-cta-row">
          <button type="button" className="t2-btn" onClick={openTrialModal}>
            Get Your Free Trial
          </button>
          <button type="button" className="t2-btn t2-btn--outline" onClick={openTrialModal}>
            Schedule Time With Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrialInvisibilitySection;

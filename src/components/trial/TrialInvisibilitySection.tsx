import { useRef } from "react";
import { useInView } from "framer-motion";

const competitors = ["Competitor Dental Studio", "Bright Smile Clinic", "City Dental Group"];

// Conveys "you exist, but nobody scrolls far enough to find you": a search bar
// types out a query, results reveal one by one, and the viewer's own business
// shows up buried near the bottom while a scroll indicator sweeps straight past
// it without stopping. Runs once when the section enters the viewport.
const TrialInvisibilitySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section className="tp-section tp-section--sm">
      <div className="tp-container">
        <div className="tp-center" style={{ maxWidth: 720 }}>
          <span className="tp-eyebrow">The hidden problem</span>
          <h2 className="tp-h2">
            Why aren't you visible on <em>Google</em>?
          </h2>
          <p className="tp-lead tp-center">
            Your business exists. It just isn't showing up first — and customers rarely scroll far enough to find you
            anyway.
          </p>
        </div>

        <div ref={ref} className={`tp-invisible-demo${inView ? " is-active" : ""}`}>
          <div className="tp-invisible-search">
            <span className="tp-invisible-search-icon">🔍</span>
            <span className="tp-invisible-search-text">dentist near me</span>
          </div>

          <div className="tp-invisible-list">
            {competitors.map((name, i) => (
              <div key={name} className="tp-invisible-row" style={{ transitionDelay: `${0.5 + i * 0.12}s` }}>
                <span className="tp-invisible-row-rank">{i + 1}</span>
                <span>{name}</span>
              </div>
            ))}
            <div className="tp-invisible-ellipsis">···</div>
            <div className="tp-invisible-row tp-invisible-row--you" style={{ transitionDelay: "1.1s" }}>
              <span className="tp-invisible-row-rank">14</span>
              <span>Your Business</span>
            </div>
          </div>

          <div className="tp-invisible-scrolltrack">
            <div className="tp-invisible-scrollthumb" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrialInvisibilitySection;

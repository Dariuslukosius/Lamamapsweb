import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Only counts downward (better position = lower number) until it reaches #1,
// then resets back to the start — no going back up in between.
const SEQUENCE = [21, 18, 15, 12, 9, 7, 5, 3, 2, 1];

const RankCounter = () => {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SEQUENCE.length);
    }, 900);
    return () => clearInterval(t);
  }, [reduceMotion]);

  // With reduced motion, freeze on the final, most meaningful value (#3)
  // instead of cycling indefinitely.
  const rank = reduceMotion ? 3 : SEQUENCE[index];

  return (
    <div className="tp-rank-counter">
      <span className="tp-rank-counter-label">Typical client ranking movement</span>
      <div className="tp-rank-counter-display">
        <span className="tp-rank-counter-hash">#</span>
        <span className="tp-rank-counter-num">{rank}</span>
      </div>
    </div>
  );
};

export default RankCounter;

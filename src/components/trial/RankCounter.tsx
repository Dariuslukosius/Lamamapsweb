import { useEffect, useState } from "react";

// Only counts downward (better position = lower number) until it reaches #1,
// then resets back to the start — no going back up in between.
const SEQUENCE = [21, 18, 15, 12, 9, 7, 5, 3, 2, 1];

const RankCounter = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SEQUENCE.length);
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="tp-rank-counter">
      <span className="tp-rank-counter-label">Typical client ranking movement</span>
      <div className="tp-rank-counter-display">
        <span className="tp-rank-counter-hash">#</span>
        <span className="tp-rank-counter-num">{SEQUENCE[index]}</span>
      </div>
    </div>
  );
};

export default RankCounter;

import { useState } from "react";

interface RankCrossfadeBadgeProps {
  before: string;
  after: string;
}

// Hover (desktop) / tap (mobile) crossfades between the before and after rank
// instead of showing both at once — a small "transformation" moment tied to
// the user's own interaction.
const RankCrossfadeBadge = ({ before, after }: RankCrossfadeBadgeProps) => {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <button
      type="button"
      className="l2-rank-crossfade"
      onMouseEnter={() => setShowAfter(true)}
      onMouseLeave={() => setShowAfter(false)}
      onClick={() => setShowAfter((v) => !v)}
      aria-label={showAfter ? `After: ${after}` : `Before: ${before}`}
    >
      <span className={`l2-rank-crossfade-face${!showAfter ? " is-visible" : ""}`}>Before: {before}</span>
      <span className={`l2-rank-crossfade-face l2-rank-crossfade-face--after${showAfter ? " is-visible" : ""}`}>
        After: {after}
      </span>
    </button>
  );
};

export default RankCrossfadeBadge;

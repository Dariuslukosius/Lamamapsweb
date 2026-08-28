// TODO: replace with real product demo video loop when ready — this is a
// lightweight CSS placeholder conveying the same idea (climbing to a top rank).
const competitors = ["Competitor Dental Studio", "Bright Smile Clinic", "City Dental Group", "Riverside Practice"];

const HeroRankClimb = () => (
  <div className="l2-rankclimb">
    <div className="l2-rankclimb-label">
      <span>📍</span>
      <span>Your Google Maps position</span>
    </div>
    <div className="l2-rankclimb-list">
      {competitors.map((name, i) => (
        <div key={name} className="l2-rankclimb-row">
          <span className="l2-rankclimb-row-rank">{i + 2}</span>
          <span>{name}</span>
        </div>
      ))}
      <div className="l2-rankclimb-you">
        <span className="l2-rankclimb-row-rank l2-rankclimb-row-rank--you">1</span>
        <span>Your Business</span>
      </div>
    </div>
  </div>
);

export default HeroRankClimb;

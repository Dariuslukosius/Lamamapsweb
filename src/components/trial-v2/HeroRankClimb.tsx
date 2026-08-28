// TODO: replace with real product demo video loop when ready — this is a
// lightweight CSS placeholder conveying the same idea (climbing to a top rank).
const competitors = ["Competitor Dental Studio", "Bright Smile Clinic", "City Dental Group", "Riverside Practice"];

const HeroRankClimb = () => (
  <div className="t2-rankclimb">
    <div className="t2-rankclimb-label">
      <span>📍</span>
      <span>Your Google Maps position</span>
    </div>
    <div className="t2-rankclimb-list">
      {competitors.map((name, i) => (
        <div key={name} className="t2-rankclimb-row">
          <span className="t2-rankclimb-row-rank">{i + 2}</span>
          <span>{name}</span>
        </div>
      ))}
      <div className="t2-rankclimb-you">
        <span className="t2-rankclimb-row-rank t2-rankclimb-row-rank--you">1</span>
        <span>Your Business</span>
      </div>
    </div>
  </div>
);

export default HeroRankClimb;

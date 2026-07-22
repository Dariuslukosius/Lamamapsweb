// TODO: replace with real product demo video loop when ready — this is a
// lightweight CSS placeholder conveying the same idea (climbing to a top rank).
const competitors = ["Competitor Dental Studio", "Bright Smile Clinic", "City Dental Group", "Riverside Practice"];

const HeroRankClimb = () => (
  <div className="tp-rankclimb">
    <div className="tp-rankclimb-searchbar">
      <span>🔍</span>
      <span>dentist near me</span>
    </div>
    <div className="tp-rankclimb-list">
      {competitors.map((name, i) => (
        <div key={name} className="tp-rankclimb-row">
          <span className="tp-rankclimb-row-rank">{i + 2}</span>
          <span>{name}</span>
        </div>
      ))}
      <div className="tp-rankclimb-you">
        <span className="tp-rankclimb-row-rank tp-rankclimb-row-rank--you">1</span>
        <span>Your Business</span>
      </div>
    </div>
  </div>
);

export default HeroRankClimb;

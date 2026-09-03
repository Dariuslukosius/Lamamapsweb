import { useState, useEffect } from "react";

const RANKS    = [12, 10, 7, 4, 1];
const LIST_POS = [5,  4,  3, 2, 1];   // 1-indexed slot in results list
const STEP_MS  = 2100;
const ITEM_H   = 58;                   // px — height of each result row

const STARS = ["★★☆☆☆", "★★★☆☆", "★★★★☆", "★★★★☆", "★★★★★"];

const COMPS = [
  { name: "Brew House",   cat: "Coffee Shop", rating: "4.3", rev: 98,  dist: "0.4 mi", open: "Closes 6PM", bg: "#cdd9e5" },
  { name: "Maple & Bean", cat: "Coffee Shop", rating: "4.2", rev: 73,  dist: "0.6 mi", open: "Closes 6PM", bg: "#c2d0df" },
  { name: "Daily Grind",  cat: "Café",        rating: "4.1", rev: 64,  dist: "0.8 mi", open: "Closes 5PM", bg: "#b8c8d8" },
  { name: "Corner Café",  cat: "Café",        rating: "4.0", rev: 51,  dist: "1.0 mi", open: "Closes 5PM", bg: "#adc0d2" },
];

// Map marker positions [cx, cy] in the right-panel SVG (0-300 x 0-420 viewBox)
const MAP_POSITIONS: [number, number][] = [
  [220, 310],  // rank 12
  [175, 255],  // rank 10
  [225, 195],  // rank 7
  [160, 140],  // rank 4
  [210,  72],  // rank 1
];

const CSS = `
.mrka {
  display: grid;
  grid-template-columns: 128px 204px 1fr;
  gap: 10px;
  align-items: center;
  padding: 22px 16px 16px;
  background: linear-gradient(145deg, #f4f7ff 0%, #edf1ff 55%, #f0f4ff 100%);
  border-radius: 24px;
  min-height: 460px;
  font-family: 'DM Sans', 'Space Grotesk', sans-serif;
  position: relative;
  overflow: hidden;
  user-select: none;
}
.mrka::before {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 260px; height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(66,133,244,0.07), transparent 70%);
  pointer-events: none;
}

/* ── LEFT: rank cards ── */
.mrka-cards {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}
.mrka-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid #e2e8f4;
  border-radius: 12px;
  background: rgba(255,255,255,0.55);
  padding: 7px 8px 7px 6px;
  transition: all 0.35s ease;
  opacity: 0.6;
}
.mrka-card.is-active {
  border-color: #4285f4;
  background: #fff;
  box-shadow: 0 4px 18px rgba(66,133,244,0.18);
  opacity: 1;
  transform: scale(1.03);
}
.mrka-card.is-past {
  opacity: 0.45;
}
.mrka-card-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 50%;
  background: #e8edf8; color: #5f6b8a;
  font-size: 11px; font-weight: 800; flex-shrink: 0;
  transition: all 0.35s ease;
}
.mrka-card.is-active .mrka-card-num {
  background: #4285f4; color: #fff;
  box-shadow: 0 3px 10px rgba(66,133,244,0.36);
}
.mrka-card-info { min-width: 0; flex: 1; }
.mrka-card-name { font-size: 9.5px; font-weight: 700; color: #1e293b; line-height: 1.2; }
.mrka-card-stars { font-size: 8px; color: #f59e0b; margin-top: 2px; line-height: 1; }
.mrka-card-stars span { color: #94a3b8; }

.mrka-arrow {
  display: flex; align-items: center; justify-content: center;
  color: #B7C0D0; font-size: 13px; font-weight: 700;
  padding: 2px 0;
  transition: color 0.35s;
}
.mrka-arrow.done { color: #C9A24A; }

/* /free-trial is out of scope for the dark green redesign and renders this same
 * widget, so it keeps the original blues. */
.lm-page .mrka-arrow { color: #93c5fd; }
.lm-page .mrka-arrow.done { color: #3b82f6; }
.lm-page .mrka-rising { color: #3b82f6; }

.mrka-rising {
  text-align: center;
  font-size: 8px; font-weight: 800;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: #C9A24A;
  margin-top: 6px;
  animation: mrkaBlink 1.4s ease-in-out infinite;
}
@keyframes mrkaBlink {
  0%,100% { opacity: 1; }
  50% { opacity: 0.35; }
}

/* ── CENTER: phone ── */
.mrka-phone {
  position: relative;
  width: 204px;
  flex-shrink: 0;
}
.mrka-phone-frame {
  width: 204px;
  background: #111318;
  border-radius: 36px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.08),
    0 2px 0 1px rgba(255,255,255,0.04),
    0 40px 80px rgba(0,0,0,0.38),
    0 12px 28px rgba(0,0,0,0.22);
  padding: 8px;
  position: relative;
}
.mrka-phone-frame::before {
  content: '';
  position: absolute;
  top: 13px; left: 50%;
  transform: translateX(-50%);
  width: 48px; height: 11px;
  background: #111318;
  border-radius: 999px;
  z-index: 10;
}
.mrka-phone-frame::after {
  content: '';
  position: absolute;
  top: 16px; left: 50%;
  margin-left: 14px;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #1e2530;
  z-index: 11;
}
.mrka-screen {
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 390px;
}

/* status bar */
.mrka-status {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px 4px;
  font-size: 9px; font-weight: 700; color: #1e293b;
  flex-shrink: 0;
}
.mrka-status-icons { display: flex; align-items: center; gap: 4px; }

/* search bar */
.mrka-searchbar {
  display: flex; align-items: center; gap: 7px;
  margin: 4px 8px 6px;
  height: 32px;
  background: #f1f3f4;
  border-radius: 16px;
  padding: 0 12px;
  flex-shrink: 0;
}
.mrka-searchbar-text {
  font-size: 10px; color: #3c4043; font-weight: 500; flex: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* results list */
.mrka-list {
  position: relative;
  flex: 1;
  overflow: hidden;
}
.mrka-list-item {
  position: absolute;
  left: 0; right: 0;
  height: 58px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border-bottom: 1px solid #f1f3f4;
  transition: top 0.75s cubic-bezier(0.34,1.2,0.64,1);
}
.mrka-list-photo {
  width: 44px; height: 44px;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}
.mrka-list-body { min-width: 0; flex: 1; }
.mrka-list-name { font-size: 10.5px; font-weight: 700; color: #1e293b; line-height: 1.2; }
.mrka-list-stars { display: flex; align-items: center; gap: 3px; margin-top: 2px; }
.mrka-list-rating { font-size: 9px; font-weight: 700; color: #1e293b; }
.mrka-list-star-row { font-size: 8.5px; color: #f59e0b; }
.mrka-list-rev { font-size: 8.5px; color: #80868b; }
.mrka-list-sub { font-size: 8.5px; color: #80868b; margin-top: 1px; }
.mrka-list-open { font-size: 8.5px; color: #80868b; }

/* your business */
.mrka-yourbiz {
  background: #fff;
  z-index: 4;
  border-left: 3px solid transparent;
  transition: top 0.75s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.4s ease, border-color 0.4s ease;
}
.mrka-yourbiz.is-first {
  border-left-color: #4285f4;
  box-shadow: 0 4px 20px rgba(66,133,244,0.18);
  z-index: 5;
}
.mrka-yourbiz-photo {
  background: linear-gradient(135deg, #1e7a42, #4ade80) !important;
}
.mrka-yourbiz-name { color: #1a1a1a !important; }
.mrka-yourbiz-badge {
  position: absolute;
  right: 8px; top: 8px;
  background: #4285f4;
  color: #fff;
  font-size: 7.5px; font-weight: 800;
  letter-spacing: 0.04em;
  padding: 3px 6px;
  border-radius: 6px;
  white-space: nowrap;
}

/* bottom nav */
.mrka-bottom-nav {
  display: flex;
  border-top: 1px solid #e8eaed;
  background: #fff;
  flex-shrink: 0;
  height: 44px;
}
.mrka-nav-tab {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px;
  font-size: 7.5px; font-weight: 600; color: #80868b;
}
.mrka-nav-tab.active { color: #4285f4; }

/* ── RIGHT: map ── */
.mrka-map {
  align-self: stretch;
  border-radius: 18px;
  overflow: hidden;
  min-height: 390px;
  position: relative;
}
.mrka-map svg {
  width: 100%; height: 100%;
  display: block;
}

/* Map markers */
.mrka-map-marker {
  transition: all 0.5s ease;
}
.mrka-map-marker circle { transition: all 0.5s ease; }

/* Dashed path animation */
.mrka-dash-path {
  stroke-dasharray: 8 5;
  animation: mrkaDash 18s linear infinite;
}
@keyframes mrkaDash {
  to { stroke-dashoffset: -260; }
}

/* Pulse at active marker */
.mrka-pulse-ring {
  animation: mrkaPulseRing 1.8s ease-out infinite;
  transform-origin: center;
}
@keyframes mrkaPulseRing {
  0%   { r: 13; opacity: 0.7; }
  100% { r: 26; opacity: 0; }
}

/* ── Responsive ── */
@media (max-width: 700px) {
  .mrka {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 16px;
  }
  .mrka-cards, .mrka-map { display: none; }
  .mrka-phone { justify-self: center; }
}
@media (min-width: 700px) and (max-width: 900px) {
  .mrka {
    grid-template-columns: 110px 190px 1fr;
    gap: 8px;
  }
}
`;

export default function MapRankAnimation() {
  const [idx, setIdx] = useState(0);
  const [numKey, setNumKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx(i => (i + 1) % RANKS.length);
      setNumKey(k => k + 1);
    }, STEP_MS);
    return () => clearInterval(t);
  }, []);

  const rank    = RANKS[idx];
  const listPos = LIST_POS[idx];       // 1-indexed
  const isTop   = rank === 1;
  const bizTop  = (listPos - 1) * ITEM_H;

  // Which competitor fills each slot (0-indexed)?
  const yourSlot = listPos - 1;
  const compSlots = [0, 1, 2, 3, 4].filter(s => s !== yourSlot);

  // Active map marker = current idx
  const [mpx, mpy] = MAP_POSITIONS[idx];

  return (
    <div className="mrka">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── LEFT: rank cards ── */}
      <div className="mrka-cards">
        {RANKS.map((r, i) => (
          <div key={r}>
            <div className={`mrka-card ${i === idx ? "is-active" : i < idx ? "is-past" : ""}`}>
              <div className="mrka-card-num">{r === 1 ? "🥇" : r}</div>
              <div className="mrka-card-info">
                <div className="mrka-card-name">Your Business</div>
                <div className="mrka-card-stars">
                  {STARS[i]}<span> (128)</span>
                </div>
              </div>
            </div>
            {i < RANKS.length - 1 && (
              <div className={`mrka-arrow${i < idx ? " done" : ""}`}>↑</div>
            )}
          </div>
        ))}
        {idx > 0 && <div className="mrka-rising">RISING...</div>}
      </div>

      {/* ── CENTER: phone ── */}
      <div className="mrka-phone">
        <div className="mrka-phone-frame">
          <div className="mrka-screen">
            {/* Status bar */}
            <div className="mrka-status">
              <span>9:41</span>
              <div className="mrka-status-icons">
                <svg width="12" height="8" viewBox="0 0 12 8"><rect x="0" y="5" width="2" height="3" rx="0.5" fill="#1e293b"/><rect x="3" y="3" width="2" height="5" rx="0.5" fill="#1e293b"/><rect x="6" y="1" width="2" height="7" rx="0.5" fill="#1e293b"/><rect x="9" y="0" width="3" height="8" rx="0.5" fill="#1e293b"/></svg>
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M6 2 C3 2 1 4 1 4 L6 9 L11 4 C11 4 9 2 6 2Z" stroke="#1e293b" strokeWidth="1.2" fill="none"/><path d="M6 4 C4.5 4 3.5 5 3.5 5 L6 7.5 L8.5 5 C8.5 5 7.5 4 6 4Z" fill="#1e293b"/></svg>
                <svg width="20" height="10" viewBox="0 0 20 10"><rect x="0" y="2" width="17" height="7" rx="2" stroke="#1e293b" strokeWidth="1.2" fill="none"/><rect x="1" y="3" width="12" height="5" rx="1.2" fill="#1e293b"/><rect x="17.5" y="3.5" width="2" height="4" rx="1" fill="#1e293b" opacity="0.5"/></svg>
              </div>
            </div>

            {/* Search bar */}
            <div className="mrka-searchbar">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#80868b" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
              <span className="mrka-searchbar-text">coffee shop near me</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="17" y2="12"/><line x1="4" y1="18" x2="13" y2="18"/></svg>
            </div>

            {/* Results list */}
            <div className="mrka-list">
              {/* Competitor slots */}
              {[0, 1, 2, 3, 4].map(slot => {
                const ci = compSlots.indexOf(slot);
                if (ci < 0) return null;
                const c = COMPS[ci];
                return (
                  <div key={slot} className="mrka-list-item" style={{ top: slot * ITEM_H }}>
                    <div className="mrka-list-photo" style={{ background: c.bg }} />
                    <div className="mrka-list-body">
                      <div className="mrka-list-name">{c.name}</div>
                      <div className="mrka-list-stars">
                        <span className="mrka-list-rating">{c.rating}</span>
                        <span className="mrka-list-star-row">★★★★</span>
                        <span className="mrka-list-rev">({c.rev})</span>
                      </div>
                      <div className="mrka-list-sub">{c.cat} · {c.dist}</div>
                    </div>
                  </div>
                );
              })}

              {/* Your Business — slides */}
              <div
                key="yourbiz"
                className={`mrka-list-item mrka-yourbiz${isTop ? " is-first" : ""}`}
                style={{ top: bizTop }}
              >
                <div className="mrka-list-photo mrka-yourbiz-photo">🏪</div>
                <div className="mrka-list-body">
                  <div className="mrka-list-name mrka-yourbiz-name">Your Business</div>
                  <div className="mrka-list-stars">
                    <span className="mrka-list-rating">4.8</span>
                    <span className="mrka-list-star-row" style={{ color: "#fbbc04" }}>★★★★★</span>
                    <span className="mrka-list-rev">(128)</span>
                  </div>
                  <div className="mrka-list-sub">Coffee Shop · 0.2 mi</div>
                  <div className="mrka-list-open" style={{ color: "#1a73e8", fontSize: 8.5 }}>Open · Closes 7PM</div>
                </div>
                {isTop && <div className="mrka-yourbiz-badge">Your Business</div>}
              </div>
            </div>

            {/* Bottom nav */}
            <div className="mrka-bottom-nav">
              {[
                { label: "Explore", active: true,
                  icon: <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg> },
                { label: "Go",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24"><path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42z" fill="currentColor"/></svg> },
                { label: "Saved",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> },
                { label: "Updates",
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
              ].map(({ label, active, icon }) => (
                <div key={label} className={`mrka-nav-tab${active ? " active" : ""}`}>
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: stylized map ── */}
      <div className="mrka-map">
        <svg viewBox="0 0 240 420" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          {/* Sky-blue map background */}
          <defs>
            <linearGradient id="mapBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c8ddf5"/>
              <stop offset="100%" stopColor="#d8e8f8"/>
            </linearGradient>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9bbfe0"/>
              <stop offset="100%" stopColor="#a8ccec"/>
            </linearGradient>
          </defs>
          <rect width="240" height="420" fill="url(#mapBg)"/>

          {/* Water / river */}
          <path d="M0 310 Q30 320 60 310 Q90 300 120 315 Q150 330 180 310 L180 340 Q150 360 120 345 Q90 330 60 340 Q30 350 0 340Z" fill="url(#waterGrad)" opacity="0.65"/>

          {/* Parks / green */}
          <rect x="10"  y="60"  width="55" height="50" rx="4" fill="#b8d9b0" opacity="0.8"/>
          <rect x="170" y="200" width="55" height="55" rx="4" fill="#b8d9b0" opacity="0.75"/>
          <rect x="10"  y="230" width="45" height="40" rx="4" fill="#b8d9b0" opacity="0.7"/>
          {/* Tree dots */}
          {[[30,78],[45,90],[22,85],[60,75],[50,78]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="5" fill="#8dc47f" opacity="0.85"/>)}
          {[[192,220],[205,235],[185,230]].map(([x,y],i) => <circle key={i+5} cx={x} cy={y} r="5" fill="#8dc47f" opacity="0.85"/>)}

          {/* City blocks (light) */}
          <rect x="10"  y="130" width="55" height="50" rx="4" fill="#dce6f2" opacity="0.9"/>
          <rect x="80"  y="50"  width="55" height="65" rx="4" fill="#dce6f2" opacity="0.9"/>
          <rect x="155" y="50"  width="70" height="65" rx="4" fill="#dce6f2" opacity="0.9"/>
          <rect x="80"  y="135" width="55" height="45" rx="4" fill="#d4dff0" opacity="0.9"/>
          <rect x="10"  y="190" width="55" height="40" rx="4" fill="#d4dff0" opacity="0.9"/>
          <rect x="80"  y="200" width="80" height="60" rx="4" fill="#cdd9ee" opacity="0.9"/>
          <rect x="10"  y="360" width="95" height="50" rx="4" fill="#d4dff0" opacity="0.9"/>
          <rect x="155" y="270" width="70" height="60" rx="4" fill="#d4dff0" opacity="0.9"/>
          <rect x="155" y="345" width="70" height="65" rx="4" fill="#cdd9ee" opacity="0.9"/>

          {/* Roads */}
          <rect x="70"  y="0"   width="10" height="420" fill="#c0cfe8" opacity="0.55"/>
          <rect x="145" y="0"   width="10" height="420" fill="#c0cfe8" opacity="0.55"/>
          <rect x="0"   y="120" width="240" height="10" fill="#c0cfe8" opacity="0.55"/>
          <rect x="0"   y="195" width="240" height="10" fill="#c0cfe8" opacity="0.55"/>
          <rect x="0"   y="290" width="240" height="10" fill="#c0cfe8" opacity="0.55"/>
          <rect x="0"   y="355" width="240" height="10" fill="#c0cfe8" opacity="0.55"/>

          {/* Yellow major roads */}
          <rect x="70"  y="0"   width="10" height="420" fill="#e8d47a" opacity="0.25"/>
          <rect x="0"   y="195" width="240" height="10" fill="#e8d47a" opacity="0.22"/>

          {/* Dashed route path 12→1 */}
          <polyline
            points={MAP_POSITIONS.map(([x,y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="#4285f4"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mrka-dash-path"
            opacity="0.75"
          />

          {/* Past/future markers (all shown, dimmed) */}
          {MAP_POSITIONS.map(([cx, cy], i) => {
            const isActive = i === idx;
            const isPast   = i < idx;
            const r        = RANKS[i];
            return (
              <g key={i} className="mrka-map-marker">
                {/* Pulse ring only for active */}
                {isActive && (
                  <circle className="mrka-pulse-ring" cx={cx} cy={cy} r="13" fill="none" stroke="#4285f4" strokeWidth="2" opacity="0.5"/>
                )}
                {/* Shadow */}
                <ellipse cx={cx+1} cy={cy+2} rx={isActive ? 14 : 11} ry={isActive ? 6 : 4.5} fill="rgba(0,0,0,0.15)"/>
                {/* Pin body */}
                <circle
                  cx={cx} cy={cy}
                  r={isActive ? 15 : 11}
                  fill={isActive ? "#4285f4" : isPast ? "#93c5fd" : "#9fb3d0"}
                  stroke="#fff"
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                {/* Rank number */}
                <text
                  x={cx} y={cy + (isActive ? 5 : 4)}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={isActive ? 11 : 8.5}
                  fontWeight="900"
                  fontFamily="DM Sans, sans-serif"
                >
                  {r === 1 ? "1" : r}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

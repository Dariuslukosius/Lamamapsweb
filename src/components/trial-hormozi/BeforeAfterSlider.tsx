import { useRef, useState } from "react";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
}

const BeforeAfterSlider = ({ before, after, beforeLabel, afterLabel }: BeforeAfterSliderProps) => {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = (clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const transitionStyle = dragging ? "none" : undefined;

  return (
    <div className="tp-baf">
      <div className="tp-baf-labels">
        <span className="tp-baf-label tp-baf-label--before">{beforeLabel}</span>
        <span className="tp-baf-label tp-baf-label--after">{afterLabel}</span>
      </div>
      <div
        className="tp-baf-frame"
        ref={frameRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <img
          src={after}
          alt="After"
          className="tp-baf-img"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
        <div
          className="tp-baf-clip"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: transitionStyle }}
        >
          <img
            src={before}
            alt="Before"
            className="tp-baf-img"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="tp-baf-line" style={{ left: `${pos}%`, transition: transitionStyle }} />
        <div className="tp-baf-handle" style={{ left: `${pos}%`, transition: transitionStyle }}>
          <span className="tp-baf-handle-arrow">‹</span>
          <span className="tp-baf-handle-arrow">›</span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;

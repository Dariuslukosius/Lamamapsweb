import { useRef, useState } from "react";

import { useNearViewport } from "@/components/landingpage-v2/useNearViewport";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  /**
   * The client's logo, rendered as a map pin over the scan. Optional: cards
   * whose client we hold no logo for pass nothing and get no pin, rather than
   * a stand-in mark on someone else's map.
   */
  pin?: React.ReactNode;
}

const BeforeAfterSlider = ({ before, after, beforeLabel, afterLabel, pin }: BeforeAfterSliderProps) => {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  // Seventeen of these cards sit below the fold, two 800px screenshots each.
  // They are only worth fetching once the reader is heading for them.
  const [cardRef, near] = useNearViewport<HTMLDivElement>();

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
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const transitionStyle = dragging ? "none" : undefined;

  return (
    <div className="l2-baf" ref={cardRef}>
      <div className="l2-baf-labels">
        <span className="l2-baf-label l2-baf-label--before">{beforeLabel}</span>
        <span className="l2-baf-label l2-baf-label--after">{afterLabel}</span>
      </div>
      <div
        className="l2-baf-frame"
        ref={frameRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          src={near ? after : undefined}
          alt="After"
          className="l2-baf-img"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
        <div
          className="l2-baf-clip"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, transition: transitionStyle }}
        >
          <img
            src={near ? before : undefined}
            alt="Before"
            className="l2-baf-img"
            draggable={false}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="l2-baf-line" style={{ left: `${pos}%`, transition: transitionStyle }} />
        <div className="l2-baf-handle" style={{ left: `${pos}%`, transition: transitionStyle }}>
          <span className="l2-baf-handle-arrow">‹</span>
          <span className="l2-baf-handle-arrow">›</span>
        </div>
        {pin}
      </div>
    </div>
  );
};

export default BeforeAfterSlider;

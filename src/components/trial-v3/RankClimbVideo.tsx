import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import rankClimbVideo from "@/assets/trial-v3/rank-climb-demo.webm";

// Real Google Maps rank-climb footage (12 → 1) in place of the animated
// #-counter badge. Reduced-motion visitors get the first frame, paused.
const RankClimbVideo = () => {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Firefox's autoplay gate is stricter than Chromium's about the
    // `autoplay` attribute alone once React has hydrated over prerendered
    // markup — muted has to be set as a DOM property (not just the
    // attribute) before play() is called, or the request is silently
    // refused instead of just rejecting the promise.
    if (reduceMotion || !videoRef.current) return;
    const video = videoRef.current;
    video.muted = true;
    video.play().catch(() => {
      // Autoplay refused (e.g. a strict browser autoplay policy) — the
      // element still shows its current frame, which preload="auto" below
      // guarantees is the real first frame rather than a blank box.
    });
  }, [reduceMotion]);

  return (
    <div className="t3-rank-climb-video">
      <span className="t3-rank-climb-video-label">Typical client ranking movement</span>
      <video
        ref={videoRef}
        className="t3-rank-climb-video-media"
        src={rankClimbVideo}
        autoPlay={!reduceMotion}
        loop={!reduceMotion}
        muted
        playsInline
        preload="auto"
        aria-label="Business climbing from rank 12 to rank 1 on Google Maps"
      />
    </div>
  );
};

export default RankClimbVideo;

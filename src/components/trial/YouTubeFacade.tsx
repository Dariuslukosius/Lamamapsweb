import { useState } from "react";

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  /** Locally hosted 9:16 poster from src/assets/video-posters. */
  poster: string;
}

/**
 * A click-to-load stand-in for a YouTube <iframe>.
 *
 * Four embedded testimonials used to cost 3.6 MB of YouTube player JavaScript
 * on every single page load — 67% of the page's total transfer, downloaded and
 * parsed on the main thread whether or not anyone pressed play. On a throttled
 * mobile connection that is most of the gap between a fast page and a page that
 * times out behind an ad click.
 *
 * So the page ships a 20 kB poster instead, and only builds the real iframe on
 * click. Visitors who watch a testimonial get the identical player one tap
 * later; visitors who don't — the large majority — never pay for it.
 */
const YouTubeFacade = ({ videoId, title, poster }: YouTubeFacadeProps) => {
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <iframe
        // nocookie, and only ever mounted after a deliberate click: the embed
        // now sets no third-party storage on visitors who never press play.
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="tp-video-facade"
      // Pointer-down and focus both mean "about to press play". Warming the two
      // origins the player needs here hides a chunk of the connection setup
      // behind the user's own reaction time.
      onPointerEnter={warmYouTubeOrigins}
      onFocus={warmYouTubeOrigins}
      onClick={() => setActivated(true)}
      aria-label={`Play video testimonial: ${title}`}
    >
      <img
        src={poster}
        alt=""
        className="tp-video-poster"
        loading="lazy"
        decoding="async"
        width={405}
        height={720}
      />
      <span className="tp-video-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M8 5.14v13.72a.5.5 0 0 0 .76.43l11.14-6.86a.5.5 0 0 0 0-.86L8.76 4.71A.5.5 0 0 0 8 5.14Z" />
        </svg>
      </span>
    </button>
  );
};

/**
 * Adds <link rel="preconnect"> for the player's origins, once per page.
 * These are deliberately NOT in index.html: putting them there would open the
 * connections on every load and give back part of what the facade just saved.
 */
function warmYouTubeOrigins() {
  for (const href of ["https://www.youtube-nocookie.com", "https://i.ytimg.com"]) {
    if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    document.head.appendChild(link);
  }
}

export default YouTubeFacade;

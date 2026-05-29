import { useState } from "react";
import { motion } from "framer-motion";

const clientVideos = [
  {
    id: "-8SFE-Pbm9g",
    title: "Client Review 1",
    shortsUrl: "https://www.youtube.com/shorts/-8SFE-Pbm9g",
  },
  {
    id: "Mlt9xpYy00w",
    title: "Client Review 2",
    shortsUrl: "https://www.youtube.com/shorts/Mlt9xpYy00w",
  },
  {
    id: "pWQ4tIjI2ZA",
    title: "Client Review 3",
    shortsUrl: "https://www.youtube.com/shorts/pWQ4tIjI2ZA",
  },
];

const VideoCard = ({ video, index }: { video: typeof clientVideos[0]; index: number }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="w-full max-w-[320px] mx-auto overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
    >
      <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <a
            href={video.shortsUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-6 bg-[#0f0f0f] group"
          >
            {/* YouTube icon */}
            <svg viewBox="0 0 90 63" className="w-24 h-auto drop-shadow-lg group-hover:scale-110 transition-transform duration-200" fill="none">
              <rect width="90" height="63" rx="14" fill="#FF0000"/>
              <path d="M37 44V19l24 12.5L37 44z" fill="white"/>
            </svg>

            {/* Shorts badge */}
            <span className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-red-400">
                <path d="M17.77 10.32l-1.2-.5L18 8.4c1.18-2.05.48-4.67-1.56-5.85-2.05-1.18-4.67-.48-5.85 1.56l-1.97 3.4-1.2-.5C6.1 6.7 4.64 7.8 4.64 9.2v8.57c0 1.4 1.46 2.5 2.83 1.97l10.5-4.37c1.37-.57 1.37-2.48 0-3.05h-.2z"/>
              </svg>
              YouTube Shorts
            </span>

            <span className="text-white/50 text-xs">Tap to watch</span>
          </a>
        )}
      </div>
    </motion.div>
  );
};


const ClientReviewsSection = () => (
  <section className="bg-background py-20 md:py-24">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h3 className="text-3xl font-bold text-foreground md:text-4xl">Client reviews</h3>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Hear directly from our clients about their experience and growth on Google.
        </p>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto justify-center">
        {clientVideos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default ClientReviewsSection;


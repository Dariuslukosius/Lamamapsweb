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
  const thumbnail = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

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
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group"
            aria-label={`Play ${video.title}`}
          >
            <img
              src={thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            {/* dark overlay */}
            <span className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            {/* play button */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl group-hover:scale-110 transition-transform duration-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7 text-red-600 ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
            {/* YouTube badge */}
            <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-red-500">
                <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.4 5 12 5 12 5s-4.4 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.8C6.6 19 12 19 12 19s4.4 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.4 2.8-5.4 2.7z"/>
              </svg>
              YouTube
            </span>
          </button>
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


import { useState } from "react";
import { motion } from "framer-motion";
import autoRepairThumb from "@/assets/Reviews/auto-repair.png";
import onlineMoversThumb from "@/assets/Reviews/online-movers.png";
import dentalClinicThumb from "@/assets/Reviews/dental-clinic.png";

const clientVideos = [
  {
    id: "-8SFE-Pbm9g",
    title: "Auto Repair Shop Testimonial",
    shortsUrl: "https://www.youtube.com/shorts/-8SFE-Pbm9g",
    thumbnail: autoRepairThumb,
  },
  {
    id: "Mlt9xpYy00w",
    title: "Online Movers and Storage",
    shortsUrl: "https://www.youtube.com/shorts/Mlt9xpYy00w",
    thumbnail: onlineMoversThumb,
  },
  {
    id: "pWQ4tIjI2ZA",
    title: "Dental Clinic Testimonial",
    shortsUrl: "https://www.youtube.com/shorts/pWQ4tIjI2ZA",
    thumbnail: dentalClinicThumb,
  },
];

const VideoCard = ({ video, index }: { video: typeof clientVideos[0]; index: number }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
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
            className="absolute inset-0 w-full h-full flex items-center justify-center group focus:outline-none"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay for better readability of play button */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200" />

            {/* Play overlay button */}
            <div className="absolute z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:bg-red-700 group-hover:scale-110 transition-all duration-200">
                <svg className="w-6 h-6 text-white fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="rounded-full bg-black/60 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
                Žiūrėti video
              </span>
            </div>
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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


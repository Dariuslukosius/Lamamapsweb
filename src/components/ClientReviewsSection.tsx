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
    id: "z7HUliWQ_NU",
    title: "Dental Clinic Testimonial",
    shortsUrl: "https://www.youtube.com/shorts/z7HUliWQ_NU",
    thumbnail: dentalClinicThumb,
  },
];

const VideoCard = ({ video, index }: { video: typeof clientVideos[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="w-[280px] xs:w-[320px] sm:w-full max-w-[320px] mx-auto overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
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

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto justify-items-center">
        {clientVideos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default ClientReviewsSection;


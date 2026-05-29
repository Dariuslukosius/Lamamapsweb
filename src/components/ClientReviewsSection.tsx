import { motion } from "framer-motion";

const clientVideos = [
  {
    id: "-8SFE-Pbm9g",
    title: "Client Review 1",
  },
  {
    id: "Mlt9xpYy00w",
    title: "Client Review 2",
  },
  {
    id: "pWQ4tIjI2ZA",
    title: "Client Review 3",
  },
];

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
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="w-full max-w-[320px] mx-auto overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-md hover:shadow-lg transition-shadow duration-350 flex flex-col items-center"
          >
            <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              ></iframe>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ClientReviewsSection;

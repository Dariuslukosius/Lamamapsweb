import { motion } from "framer-motion";

import artfiksa from "@/assets/brands/artfiksa.webp";
import autoVela from "@/assets/brands/auto-vela.webp";
import clinicDpc from "@/assets/brands/clinic-dpc.webp";
import ecoResort from "@/assets/brands/eco-resort.webp";
import eraEsthetic from "@/assets/brands/era-esthetic.webp";
import fastCar from "@/assets/brands/fast-car.webp";
import motoSvajone from "@/assets/brands/moto-svajone.webp";
import royalHorse from "@/assets/brands/royal-horse.webp";
import sokrato from "@/assets/brands/sokrato.webp";
import svajonuSpa from "@/assets/brands/svajoniu-spa.webp";
import televizoriu from "@/assets/brands/televizoriu.webp";
import wheelshop from "@/assets/brands/wheelshop.webp";

const brands = [
  { src: artfiksa, alt: "Artfiksa Plytelės" },
  { src: autoVela, alt: "Auto Vela" },
  { src: clinicDpc, alt: "Clinic DPC" },
  { src: ecoResort, alt: "Eco Resort Trakai" },
  { src: eraEsthetic, alt: "Era Esthetic Dental" },
  { src: fastCar, alt: "Fast Car Shop" },
  { src: motoSvajone, alt: "Moto Svajonė" },
  { src: royalHorse, alt: "Royal Horse Resort" },
  { src: sokrato, alt: "Sokrato Clinica" },
  { src: svajonuSpa, alt: "Svajonių SPA" },
  { src: televizoriu, alt: "Televizorių Išparduotuvė" },
  { src: wheelshop, alt: "Wheelshop.lt" },
];

const BrandsSection = () => (
  <section className="pt-2 pb-14 bg-background">
    <div className="container mx-auto px-4 md:px-8">
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8">
        {brands.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <img loading="lazy" decoding="async"
              src={b.src}
              alt={b.alt}
              loading="lazy"
              className="h-14 md:h-16 w-auto object-contain brightness-0"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BrandsSection;

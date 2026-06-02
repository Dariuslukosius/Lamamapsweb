import { motion } from "framer-motion";

import artfiksa from "@/assets/brands/artfiksa.png";
import autoVela from "@/assets/brands/auto-vela.png";
import clinicDpc from "@/assets/brands/clinic-dpc.png";
import ecoResort from "@/assets/brands/eco-resort.png";
import eraEsthetic from "@/assets/brands/era-esthetic.png";
import fastCar from "@/assets/brands/fast-car.png";
import motoSvajone from "@/assets/brands/moto-svajone.png";
import royalHorse from "@/assets/brands/royal-horse.png";
import sokrato from "@/assets/brands/sokrato.png";
import svajonuSpa from "@/assets/brands/svajoniu-spa.png";
import televizoriu from "@/assets/brands/televizoriu.png";
import wheelshop from "@/assets/brands/wheelshop.png";

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
            <img
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

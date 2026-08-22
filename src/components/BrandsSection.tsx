import { motion } from "framer-motion";

import agrija from "@/assets/brands/agrija.webp";
import artfiksa from "@/assets/brands/artfiksa.webp";
import autoVela from "@/assets/brands/auto-vela.webp";
import clinicDpc from "@/assets/brands/clinic-dpc.webp";
import ecoResort from "@/assets/brands/eco-resort.webp";
import eraEsthetic from "@/assets/brands/era-esthetic.webp";
import fastCar from "@/assets/brands/fast-car.webp";
import geraDovana from "@/assets/brands/gera-dovana.webp";
import gok from "@/assets/brands/gok.webp";
import kurtasService from "@/assets/brands/kurtas-service.webp";
import miracleK9Academy from "@/assets/brands/miracle-k9-academy.webp";
import motoSvajone from "@/assets/brands/moto-svajone.webp";
import proteraServisas from "@/assets/brands/protera-servisas.webp";
import royalHorse from "@/assets/brands/royal-horse.webp";
import sokrato from "@/assets/brands/sokrato.webp";
import svajonuSpa from "@/assets/brands/svajoniu-spa.webp";
import svytintysDantys from "@/assets/brands/svytintys-dantys.webp";
import televizoriu from "@/assets/brands/televizoriu.webp";
import wheelshop from "@/assets/brands/wheelshop.webp";
import zeeinklover from "@/assets/brands/zeeinklover.webp";

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
  { src: gok, alt: "GOK Grožio ir Odontologijos Klinika" },
  { src: geraDovana, alt: "Gera Dovana" },
  { src: zeeinklover, alt: "Zeeinklover" },
  { src: proteraServisas, alt: "ProTera Servisas" },
  { src: miracleK9Academy, alt: "Miracle K9 Academy" },
  { src: kurtasService, alt: "Kurtas Service" },
  { src: agrija, alt: "Agrija" },
  { src: svytintysDantys, alt: "Švytintys Dantys" },
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

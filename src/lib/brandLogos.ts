/* The client logo wall, in one place.
 *
 * It is rendered twice — the v3 page's logo strip and the home page's brands row
 * — and the two had drifted: five of these marks were re-cut for the landing page
 * (the brands-v2 files below) while the home page still imported the originals,
 * so the same client appeared in two different weights depending on the page.
 * One list, imported by both, is what stops that happening again.
 *
 * Both call sites render these as a single-colour wall (grayscale + brightness(0)
 * + invert), so a mark being colour or black artwork does not matter here — but
 * it does mean a mark with no solid shape of its own will not show. */
import proteraServisasClean from "@/assets/brands-v2/protera-servisas.webp";
import kurtasServiceClean from "@/assets/brands-v2/kurtas-service.webp";
import agrijaClean from "@/assets/brands-v2/agrija.svg";
import geraDovanaClean from "@/assets/brands-v2/gera-dovana-v2.webp";
import artfiksa from "@/assets/brands/artfiksa.webp";
import autoVela from "@/assets/brands/auto-vela.webp";
import clinicDpcLogo from "@/assets/brands/clinic-dpc.webp";
import ecoResort from "@/assets/brands/eco-resort.webp";
import eraEsthetic from "@/assets/brands/era-esthetic.webp";
import fastCar from "@/assets/brands/fast-car.webp";
import gok from "@/assets/brands/gok.webp";
import miracleK9Academy from "@/assets/brands/miracle-k9-academy.webp";
import motoSvajone from "@/assets/brands/moto-svajone.webp";
import royalHorse from "@/assets/brands/royal-horse.webp";
import sokrato from "@/assets/brands/sokrato.webp";
import svajoniuSpaLogo from "@/assets/brands/svajoniu-spa.webp";
import svytintysDantysBrand from "@/assets/brands-v2/svytintys-dantys.webp";
import televizoriu from "@/assets/brands/televizoriu.webp";
import wheelshopBrand from "@/assets/brands/wheelshop.webp";
import zeeinklover from "@/assets/brands/zeeinklover.webp";

export const brandLogos = [
  { src: artfiksa, alt: "Artfiksa Plytelės" },
  { src: autoVela, alt: "Auto Vela" },
  { src: clinicDpcLogo, alt: "Clinic DPC" },
  { src: ecoResort, alt: "Eco Resort Trakai" },
  { src: eraEsthetic, alt: "Era Esthetic Dental" },
  { src: fastCar, alt: "Fast Car Shop" },
  { src: motoSvajone, alt: "Moto Svajonė" },
  { src: royalHorse, alt: "Royal Horse Resort" },
  { src: sokrato, alt: "Sokrato Clinica" },
  { src: svajoniuSpaLogo, alt: "Svajonių SPA" },
  { src: televizoriu, alt: "Televizorių Išparduotuvė" },
  { src: wheelshopBrand, alt: "Wheelshop.lt" },
  { src: gok, alt: "GOK Grožio ir Odontologijos Klinika" },
  { src: geraDovanaClean, alt: "Gera Dovana" },
  { src: zeeinklover, alt: "Zeeinklover" },
  { src: proteraServisasClean, alt: "ProTera Servisas" },
  { src: miracleK9Academy, alt: "Miracle K9 Academy" },
  { src: kurtasServiceClean, alt: "Kurtas Service" },
  { src: agrijaClean, alt: "Agrija" },
  { src: svytintysDantysBrand, alt: "Švytintys Dantys" },
];

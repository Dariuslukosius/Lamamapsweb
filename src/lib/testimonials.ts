import azuolasDanielius from "@/assets/testimonials/azuolas-danielius.webp";
import kurtasServiceLogo from "@/assets/testimonials/kurtas-service-logo.jpg";
import agrijaLogo from "@/assets/testimonials/agrija-logo.png";

/**
 * Client testimonials shown on /trial and /landingpage.
 *
 * Shared for the same reason `caseStudies` is: the two pages are an A/B pair, so
 * a quote edited on one and not the other would eventually publish two different
 * versions of what a named real person said.
 *
 * Every quote here is a real client's own words, reproduced verbatim — do not
 * tighten, paraphrase or "improve" them. Attribution is a real person and their
 * real business, which is exactly why the wording is not ours to edit.
 */
export interface Testimonial {
  name: string;
  company: string;
  /**
   * Photo or company logo. Optional: several clients gave a written review
   * without one, and those render as initials rather than a stock portrait —
   * a stand-in face next to a real person's name would misrepresent them.
   */
  avatar?: string;
  /** Logos need containing and a light backdrop; photos are cropped to fill. */
  avatarFit?: "contain";
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Dr. Ąžuolas Danielius",
    company: "Director, Švytintys dantys, UAB",
    avatar: azuolasDanielius,
    text: "I am very satisfied with the cooperation with this team. SEO services exceeded expectations - organic traffic increased significantly in the first month. Keyword optimization, meta description management and internal link structure - everything was done professionally and on time. I recommend them to all entrepreneurs who want to be visible in Google search.",
  },
  {
    name: "Andrejus Moskaliovas",
    company: "Owner, Miracle K9 Academy",
    text: "Before working with LlamaMaps I was barely visible on Google Maps when people searched for dog training in Birmingham — most of my new clients came through word of mouth and Facebook. Within a couple of months I was sitting at the top of the map for the searches that actually bring in bookings, like 1 on 1 training and residential training, and a few people have even told me they asked an AI assistant for a recommendation and got pointed straight to me. My phone hasn't stopped since — I'd say I'm getting about three times the calls I used to. Really happy with how it's gone.",
  },
  {
    name: "Rolandas Petrulis",
    company: "Founder, Kurtas Service, UAB",
    avatar: kurtasServiceLogo,
    avatarFit: "contain",
    text: "The men know what they are doing! They do their job perfectly. The number of customers has definitely increased! Thanks again!",
  },
  {
    name: "Gražina Drabickienė",
    company: "Owner, Gražina Hair Studio",
    text: "Since LlamaMaps started managing my Google Maps presence, I show up much higher when people search for a hairdresser here in Panevėžys — before that, I was practically impossible to find. New clients tell me all the time that's how they found me, and lately a few have said an AI assistant recommended me too when they asked for a good hairdresser in town. They also got me set up online in the first place, which I needed at the time, but it's the ongoing Maps ranking work that's made the real difference for new bookings. Didn't expect it to make this much difference.",
  },
  {
    name: "Birutė Meškauskienė",
    company: "Director, Birutės Meškauskienės firma „AGRIJA“",
    avatar: agrijaLogo,
    text: "I would highly recommend LlamaMaps to other businesses looking to improve their online presence and attract more customers. Even within a relatively short period, we saw excellent results — our online visibility improved significantly, sales increased, and we started receiving many more customer enquiries. Throughout the process, the team provided professional support, useful recommendations, and practical advice that helped us achieve these results. We are very pleased with the cooperation and the results. Thank you to the LlamaMaps team for your great work!",
  },
  {
    name: "Iveta Gabrienė",
    company: "Aesthetic Cosmetology Specialist",
    text: "My Google Maps visibility completely changed after we started working together — people searching for a cosmetologist here in Palanga, locals and visitors both, actually find me now. New clients regularly mention Google as how they found me. They also put together my website early on — professional, works in Lithuanian and English — but the Maps ranking work is what keeps new people walking through the door. They clearly know what they're doing.",
  },
  {
    name: "Vaidotas Kvedaras",
    company: "Director, Proteros Servisas",
    text: "We run three service points around Panevėžys, and getting all three showing up properly on Google Maps used to be a mess. Since we started working with them, each location is ranking noticeably better, and it shows in the calls we're getting. They started with a proper audit so we understood exactly what needed fixing, and then just kept it running from there. Straightforward to deal with and results speak for themselves.",
  },
];

/** Initials for the avatar fallback: "Andrejus Moskaliovas" -> "AM". */
export const initialsOf = (name: string) =>
  name
    .replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => [...part][0] ?? "")
    .join("")
    .toUpperCase();

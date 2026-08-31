import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { ArrowRight, Check, X, Star, ChevronLeft, ChevronRight } from "lucide-react";

import SEO from "@/components/SEO";
import { organizationSchema, faqSchema } from "@/lib/structuredData";
import TrialNavbar from "@/components/trial-v2/TrialNavbar";
import TrialFooter from "@/components/trial-v2/TrialFooter";
import { TrialModalProvider, useTrialModal } from "@/components/trial-v2/TrialModalContext";
import TrialFloatingCta from "@/components/trial-v2/TrialFloatingCta";
import BeforeAfterSlider from "@/components/trial-v2/BeforeAfterSlider";
import YouTubeFacade from "@/components/trial-v2/YouTubeFacade";
import { caseStudies, type CaseStudy } from "@/lib/caseStudies";
import { caseStudyScansV2 } from "@/lib/caseStudyScansV2";
import CaseStudyLogo from "@/components/trial-v2/CaseStudyLogo";
import PlanRadiusMap, { type PlanRadiusKey } from "@/components/trial-v2/PlanRadiusMap";
import { testimonials, initialsOf } from "@/lib/testimonials";
import RankCounter from "@/components/trial-v2/RankCounter";
import HeroRankClimb from "@/components/trial-v2/HeroRankClimb";
import TrialInvisibilitySection from "@/components/trial-v2/TrialInvisibilitySection";
import CountUpStat from "@/components/trial-v2/CountUpStat";
import RankCrossfadeBadge from "@/components/trial-v2/RankCrossfadeBadge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

import llamaLogo from "@/assets/llama-logo.webp";

import posterAutoRepair from "@/assets/video-posters/auto-repair.webp";
import posterMoversStorage from "@/assets/video-posters/movers-storage.webp";
import posterPhysiotherapy from "@/assets/video-posters/physiotherapy.webp";
import posterDentalClinic from "@/assets/video-posters/dental-clinic.webp";
import googlePartnerLogo from "@/assets/partners/google-partner-logo-png_seeklogo-428155.webp";


// V2-only cleaned copies of four brand-strip logos that came out blurry
// under the strip's white-silhouette filter — see scripts/clean-brand-logos.py
// for why, and why they are not simply overwritten in place (this same file
// path is imported by the V1 pages too).
import proteraServisasClean from "@/assets/brands-v2/protera-servisas.webp";
import kurtasServiceClean from "@/assets/brands-v2/kurtas-service.webp";
// Traced to vector rather than raster-cleaned like the other two, since
// their best available source was too low-resolution for hardening +
// upscaling alone to fix — see scripts/vectorize-logos.py.
import agrijaClean from "@/assets/brands-v2/agrija.svg";
import geraDovanaClean from "@/assets/brands-v2/gera-dovana.svg";
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
import svytintysDantysBrand from "@/assets/brands/svytintys-dantys.webp";
import televizoriu from "@/assets/brands/televizoriu.webp";
import wheelshopBrand from "@/assets/brands/wheelshop.webp";
import zeeinklover from "@/assets/brands/zeeinklover.webp";

// services-v2/ holds the same four illustrations with the Gemini sparkle
// watermark removed from the two that carried one (no-direct-access and
// best-results). Rebuilt by scripts/strip-gemini-watermark.py; the V1 pages
// keep importing the untouched originals from services/.
//
// TODO: the body copy inside these four illustrations is AI-generated and
// visibly garbled ("stuud", "Profiile", "demortats", "keeing"). The watermark
// is gone but the typos are baked into the artwork and need the images
// regenerating or redrawing to fix.
import increaseLocalVisibility from "@/assets/services-v2/increase-local-visibility.webp";
import improveSearchPerformance from "@/assets/services-v2/improve-search-performance.webp";
import noDirectAccess from "@/assets/services-v2/no-direct-access.webp";
import bestResults from "@/assets/services-v2/best-results.webp";

const CSS = `

  .t2-page { overflow-x: hidden; font-family: 'DM Sans', 'DM Sans Fallback', sans-serif; background: var(--t2-bg); color: var(--t2-text); }
  .t2-page {
    --t2-bg: #0B1420;
    --t2-bg-card: #111C2B;
    --t2-text: #F4F1EA;
    --t2-text-muted: #8A93A6;
    /* Subtitles and body leads. Deliberately lighter than --t2-text-muted,
       which V1 used for both: at #8A93A6 the hero subheadline sat so close to
       the background that it read as disabled text rather than as the sentence
       explaining the headline. --t2-text-muted is now reserved for genuinely
       secondary small print (captions, footnotes, metric labels). */
    --t2-text-sub: #B7C0D0;
    --t2-gold: #C9A24A;
    --t2-gold-soft: #DEC584;
    /* Button fill. Buttons carry white text, and white on the display gold
       above is about 2.2:1 -- unreadable in daylight on a phone. Deepening
       just the button fill keeps the palette gold while taking white text to
       ~5:1. The display gold stays exactly as it was everywhere else. */
    --t2-gold-btn: #8A6A1F;
    --t2-gold-btn-hover: #A37D26;
    --t2-emerald: #1F4D3D;
    --t2-border: rgba(138, 147, 166, 0.18);
    --t2-border-strong: rgba(138, 147, 166, 0.32);
    --t2-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    --t2-serif: 'Fraunces', 'Fraunces Fallback', serif;

    /* One radius scale, applied everywhere. V1 mixed 10/12/14/16/18/20px and
       999px pills with no rule about which got what, so a card, the badge on
       it and the button under it could each round differently. */
    --t2-r-card: 16px;      /* panels: cards, sections, media frames */
    --t2-r-control: 12px;   /* things you click or that label something */
    --t2-r-mark: 999px;     /* only for round single-glyph marks and avatars */
  }
  html { scroll-behavior: smooth; scroll-padding-top: 92px; }
  /* Task: content was leaving too much dead space at the sides on a desktop
     screen. Wider ceiling, and side padding that scales instead of sitting at
     a flat 20px whatever the viewport. */
  .t2-container { width: 100%; max-width: 1440px; margin: 0 auto; padding: 0 clamp(20px, 3vw, 44px); }
  .t2-main { padding-top: 72px; }

  /* Subtle topographic-contour texture — the only "decorative" background motif,
     tying the visual language back to maps rather than an abstract color blob. */
  .t2-topo {
    background-image: repeating-radial-gradient(circle at 22% 28%, rgba(201,162,74,0.05) 0px, rgba(201,162,74,0.05) 1px, transparent 1px, transparent 42px),
      repeating-radial-gradient(circle at 84% 74%, rgba(138,147,166,0.05) 0px, rgba(138,147,166,0.05) 1px, transparent 1px, transparent 56px);
  }

  /* Every button on the page renders its label in #FFFFFF, including the
     outline and ghost variants. */
  .t2-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 52px; border: 0; border-radius: var(--t2-r-control);
    background: var(--t2-gold-btn); color: #FFFFFF;
    font-size: 0.86rem; font-weight: 700; letter-spacing: 0.03em;
    padding: 0 28px; text-transform: uppercase; text-align: center;
    box-shadow: var(--t2-shadow); cursor: pointer; text-decoration: none;
    transition: background 0.2s ease;
  }
  .t2-btn:hover { background: var(--t2-gold-btn-hover); }
  .t2-btn--sm { min-height: 44px; padding: 0 20px; font-size: 0.78rem; }
  .t2-btn--outline { background: transparent; border: 1px solid var(--t2-border-strong); color: #FFFFFF; box-shadow: none; }
  .t2-btn--outline:hover { background: rgba(244,241,234,0.06); }
  .t2-btn--ghost { background: transparent; border: 1px solid rgba(201,162,74,0.5); color: #FFFFFF; box-shadow: none; }
  .t2-btn--ghost:hover { background: rgba(201,162,74,0.12); }
  /* Final CTA: the one button on the page with a deliberate, restrained hover
     lift + icon nudge — reserved for the closing conversion moment. */
  .t2-btn--final { transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; }
  .t2-btn--final:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,0,0,0.5); }
  .t2-btn-icon { display: inline-flex; transition: transform 0.2s ease; }
  .t2-btn--final:hover .t2-btn-icon { transform: translateX(3px); }

  /* ── Navbar ── */
  /* position: fixed (not sticky) — .t2-page sets overflow-x: hidden, which forces
     overflow-y to compute as auto and makes it a scroll container; a sticky navbar
     would then stick relative to that box instead of the viewport. */
  .t2-navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(11,20,32,0.94); backdrop-filter: blur(10px); border-bottom: 1px solid var(--t2-border); }
  .t2-navbar-inner { max-width: 1440px; margin: 0 auto; padding: 0 clamp(20px, 3vw, 44px); height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .t2-navbar-logo { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; text-decoration: none; }
  .t2-navbar-logo img { height: 30px; width: auto; display: block; }
  .t2-navbar-logo-text { display: flex; flex-direction: column; align-items: center; gap: 1px; line-height: 1; }
  .t2-navbar-logo-name { color: var(--t2-text); font-size: 0.8rem; font-weight: 700; letter-spacing: -0.01em; }
  /* Task: "Be First On Google" in gold. Full opacity too -- at 0.85 over the
     navbar's translucent fill the gold silted up into a muddy brown. */
  .t2-navbar-logo-tagline { color: var(--t2-gold); font-size: 0.5rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
  .t2-navbar-links { display: none; align-items: center; gap: 24px; margin-left: auto; }
  .t2-navbar-link { color: var(--t2-text); font-size: 0.88rem; font-weight: 500; text-decoration: none; white-space: nowrap; }
  .t2-navbar-link:hover { color: var(--t2-gold); }
  .t2-navbar-cta { display: none; align-items: center; justify-content: center; line-height: 1; min-height: 40px; border: 0; border-radius: var(--t2-r-control); background: var(--t2-gold-btn); color: #FFFFFF; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; padding: 0 18px; cursor: pointer; white-space: nowrap; }
  .t2-navbar-cta:hover { background: var(--t2-gold-btn-hover); }
  .t2-navbar-toggle { display: inline-flex; border: 0; background: transparent; color: var(--t2-text); cursor: pointer; padding: 6px; }
  .t2-navbar-mobile { border-top: 1px solid var(--t2-border); background: var(--t2-bg); padding: 10px 20px 18px; display: grid; gap: 4px; }
  .t2-navbar-mobile-link { padding: 10px 4px; color: var(--t2-text); font-weight: 500; text-decoration: none; font-size: 0.94rem; }
  .t2-navbar-mobile-cta { display: flex; align-items: center; justify-content: center; line-height: 1; margin-top: 8px; min-height: 48px; border: 0; border-radius: var(--t2-r-control); background: var(--t2-gold-btn); color: #FFFFFF; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; font-size: 0.8rem; cursor: pointer; }

  @media (min-width: 900px) {
    .t2-navbar-links { display: flex; }
    .t2-navbar-cta { display: inline-flex; }
    .t2-navbar-toggle { display: none; }
  }

  /* ── Hero ── */
  .t2-hero { position: relative; padding: 24px 0 56px; overflow: hidden; isolation: isolate; background: var(--t2-bg); }
  /* A small white tab hanging just below the navbar — white background because
     the Google Partner badge asset renders its "Google Partner" wordmark in dark
     grey, which needs a light backdrop to stay legible. */
  /* Task: the Google Partner badge was centred directly under the navbar,
     straight above the headline, where it was the first thing the eye landed
     on. It is a trust marker, not the offer, so it moves to the corner at
     every width, including mobile — a small tab tucked against the edge, not
     a centred interruption between the navbar and the H1. */
  .t2-partner-wrap { display: flex; justify-content: flex-end; padding-right: clamp(14px, 4vw, 44px); }
  .t2-partner-strip {
    display: inline-flex; align-items: center; justify-content: center;
    background: #fff; border-radius: 0 0 var(--t2-r-control) var(--t2-r-control);
    padding: 6px 18px 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.28);
  }
  .t2-partner-strip img { height: 42px; width: auto; display: block; }
  .t2-hero-inner { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .t2-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(201,162,74,0.4); border-radius: var(--t2-r-control);
    background: rgba(201,162,74,0.08); color: var(--t2-gold); font-size: 0.8rem; font-weight: 700;
    padding: 8px 16px;
  }
  .t2-hero-eyebrow { display: block; margin-top: 24px; color: var(--t2-text-sub); font-size: 1rem; font-weight: 500; letter-spacing: 0.01em; }
  .t2-hero-h1 { margin-top: 10px; color: var(--t2-text); font-family: var(--t2-serif); font-size: clamp(2.2rem, 6vw, 4.2rem); font-weight: 400; letter-spacing: -0.01em; line-height: 1.12; max-width: 920px; }
  .t2-hero-h1 em { font-style: normal; font-weight: 600; color: var(--t2-gold); }
  .t2-hero-sub { margin-top: 20px; color: var(--t2-text-sub); font-size: 1.06rem; line-height: 1.75; max-width: 680px; }
  .t2-hero-rating { margin-top: 26px; }
  .t2-hero-rating .t2-rating-num { color: var(--t2-text); }
  .t2-hero-rating .t2-rating-count { color: var(--t2-text-sub); }
  .t2-hero-actions { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
  .t2-hero-actions .t2-btn { min-height: 54px; font-size: 0.88rem; }
  .t2-hero-video-wrap { margin-top: 40px; width: 100%; max-width: 640px; border-radius: var(--t2-r-card); border: 1px solid var(--t2-border); background: var(--t2-bg-card); box-shadow: var(--t2-shadow); padding: 10px; }
  .t2-hero-video-inner { position: relative; border-radius: var(--t2-r-control); overflow: hidden; background: #0d1520; }

  /* ── Hero rank-climb placeholder — "finding" concept: a business row climbs
     from a low position to the top of the results, holds, then loops. Base
     state already shows it arrived at the top; the climb is added motion. ── */
  .t2-rankclimb { padding: 22px 20px 24px; }
  /* A map-panel label instead of a search bar — Hero reads as "your live map
     position", the Invisibility section below owns the literal search-bar
     visual, so the two placeholders don't look like duplicates of each other. */
  .t2-rankclimb-label {
    display: flex; align-items: center; gap: 8px;
    color: var(--t2-gold); font-size: 0.76rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 16px;
  }
  .t2-rankclimb-list { position: relative; min-height: 252px; }
  .t2-rankclimb-row, .t2-rankclimb-you {
    display: flex; align-items: center; gap: 12px;
    height: 44px; border-radius: 10px; padding: 0 14px; margin-bottom: 8px;
    font-size: 0.82rem;
  }
  .t2-rankclimb-row { background: var(--t2-bg-card); color: var(--t2-text-muted); }
  .t2-rankclimb-row-rank {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 999px; flex-shrink: 0;
    background: rgba(138,147,166,0.16); color: var(--t2-text-muted);
    font-size: 0.72rem; font-weight: 700;
  }
  .t2-rankclimb-row-rank--you { background: var(--t2-gold); color: var(--t2-bg); }
  /* Solid, fully opaque background — this row is absolutely positioned directly
     on top of the static rows below while it "climbs", and a semi-transparent
     fill let their text show through and garble together mid-transition. */
  .t2-rankclimb-you {
    position: absolute; left: 0; right: 0; top: 0;
    background: #1c1710; border: 1px solid rgba(201,162,74,0.5);
    color: var(--t2-gold); font-weight: 700; z-index: 2;
  }
  @media (prefers-reduced-motion: no-preference) {
    .t2-rankclimb-you { animation: tpRankClimb 7s ease-in-out infinite; }
  }
  @keyframes tpRankClimb {
    0%   { top: 208px; opacity: 1; }
    45%  { top: 0; opacity: 1; }
    82%  { top: 0; opacity: 1; }
    91%  { top: 0; opacity: 0; }
    93%  { top: 208px; opacity: 0; }
    100% { top: 208px; opacity: 1; }
  }

  /* ── Invisibility demo — "you exist but nobody scrolls far enough to find
     you". Base state already shows the finished list (no motion); the
     no-preference query adds the typing/reveal/scroll-past sequence, all
     gated by .is-active so it only plays once, when scrolled into view. ── */
  /* position:relative is load-bearing: the decorative scrolltrack below is
     absolutely positioned at right:-18px and this is the box it anchors to.
     Without it the track resolves against the viewport instead, landing at
     exactly viewport+18px and widening the document at every breakpoint —
     .t2-page's overflow-x:hidden cannot clip it, because its containing
     block is outside .t2-page. That made the whole page scroll sideways. */
  .t2-invisible-demo { max-width: 460px; margin: 44px auto 0; position: relative; }
  .t2-invisible-search { display: flex; align-items: center; gap: 10px; background: var(--t2-bg-card); border: 1px solid var(--t2-border); border-radius: 10px; padding: 12px 16px; }
  .t2-invisible-search-text { color: var(--t2-text-muted); font-size: 0.88rem; }
  .t2-invisible-list { position: relative; margin-top: 16px; }
  .t2-invisible-row {
    display: flex; align-items: center; gap: 12px;
    background: var(--t2-bg-card); border: 1px solid var(--t2-border);
    border-radius: 10px; padding: 12px 16px; margin-bottom: 8px;
    color: var(--t2-text); font-size: 0.86rem;
  }
  .t2-invisible-row-rank {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 999px; flex-shrink: 0;
    background: rgba(138,147,166,0.16); color: var(--t2-text-muted);
    font-size: 0.72rem; font-weight: 700;
  }
  .t2-invisible-ellipsis { text-align: center; color: var(--t2-text-muted); padding: 4px 0; letter-spacing: 0.2em; }
  .t2-invisible-row--you { opacity: 0.6; border-style: dashed; }
  .t2-invisible-scrolltrack { position: absolute; right: -18px; top: 0; bottom: 0; width: 3px; background: rgba(138,147,166,0.14); border-radius: 999px; }
  .t2-invisible-scrollthumb { position: absolute; left: 0; right: 0; top: 0; height: 15%; background: var(--t2-border-strong); border-radius: 999px; }

  @media (prefers-reduced-motion: no-preference) {
    .t2-invisible-search-text {
      display: inline-block; overflow: hidden; white-space: nowrap; width: 0;
      border-right: 2px solid transparent;
    }
    .t2-invisible-demo.is-active .t2-invisible-search-text {
      animation: tpTypeText 1.1s steps(16, end) 0.2s forwards, tpCaretBlink 0.8s step-end 0.2s 3;
    }
    .t2-invisible-row { opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .t2-invisible-demo.is-active .t2-invisible-row { opacity: 1; transform: translateY(0); }
    .t2-invisible-demo.is-active .t2-invisible-row--you { opacity: 0.6; }
    .t2-invisible-scrollthumb { top: -15%; }
    .t2-invisible-demo.is-active .t2-invisible-scrollthumb {
      animation: tpScrollPast 2.2s linear 1.6s forwards;
    }
  }
  @keyframes tpTypeText { from { width: 0; } to { width: 16.5ch; } }
  @keyframes tpCaretBlink { 50% { border-color: var(--t2-text-muted); } }
  @keyframes tpScrollPast { from { top: -15%; } to { top: 100%; } }

  /* ── Signature rank counter (the one place a gradient + glow are allowed) ── */
  .t2-rank-counter { display: inline-flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 30px; }
  .t2-rank-counter-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--t2-text-muted); }
  .t2-rank-counter-display {
    display: inline-flex; align-items: baseline; gap: 2px;
    padding: 10px 30px; border-radius: 18px;
    background: linear-gradient(135deg, rgba(201,162,74,0.12), rgba(31,77,61,0.28));
    border: 1px solid rgba(201,162,74,0.38);
  }
  .t2-rank-counter-hash { font-family: var(--t2-serif); font-size: 1.7rem; color: var(--t2-gold); opacity: 0.75; }
  .t2-rank-counter-num {
    font-family: var(--t2-serif); font-size: 3.4rem; font-weight: 600; line-height: 1;
    background: linear-gradient(135deg, #C9A24A 0%, #E7CF8E 45%, #3d8267 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    text-shadow: 0 0 34px rgba(201,162,74,0.3);
  }

  /* ── Sections ── */
  /* 56px/side = ~112px combined between two adjacent full sections — generous
     enough to read as deliberate breathing room without the ~240px combined
     gap the previous 96/120px-per-side values produced once actually rendered. */
  .t2-section { padding: 48px 0; }
  .t2-section--sm { padding: 32px 0; }
  /* Task: every centred section header used its own inline maxWidth (680,
     720, 760), so consecutive headers wrapped at different measures and the
     column edge wandered down the page. One class, one measure. */
  .t2-section-head { max-width: 760px; margin-left: auto; margin-right: auto; text-align: center; }
  .t2-section-head .t2-lead { margin-left: auto; margin-right: auto; }
  .t2-eyebrow { display: inline-block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--t2-gold); margin-bottom: 16px; }
  .t2-h2 { color: var(--t2-text); font-family: var(--t2-serif); font-size: clamp(1.9rem, 4.6vw, 2.8rem); font-weight: 400; letter-spacing: -0.01em; line-height: 1.16; }
  .t2-h2 em { font-style: normal; font-weight: 600; color: var(--t2-gold); }
  .t2-lead { margin-top: 16px; color: var(--t2-text-sub); font-size: 1.02rem; line-height: 1.8; max-width: 680px; }
  .t2-center { text-align: center; margin-left: auto; margin-right: auto; }
  .t2-cta-row { display: flex; justify-content: center; margin-top: 32px; gap: 14px; flex-wrap: wrap; }

  @media (min-width: 900px) {
    /* Task: compact the desktop layout. V1 went to 72px per side here, which
       is ~144px of dead space between two adjacent sections once both are
       rendered. 56px per side reads as deliberate without the scroll cost. */
    .t2-section { padding: 56px 0; }
    /* Pinned separately here too — without this, this same-specificity rule
       above (later in source, same 900px breakpoint) silently wins over the
       standalone .t2-section--sm rule and re-inflates "small" sections back
       to full size on desktop, stacking with the adjacent section's own
       padding into a much bigger gap than intended. */
    .t2-section--sm { padding: 40px 0; }
  }

  /* ── Rating ── */
  .t2-rating { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .t2-rating-stars { display: flex; gap: 3px; color: var(--t2-gold); }
  .t2-rating-num { font-size: 1.5rem; font-weight: 700; color: var(--t2-text); }
  .t2-rating-count { color: var(--t2-text-muted); font-size: 0.94rem; }

  /* ── Testimonial carousel ── */
  .t2-testimonial-card { border: 1px solid var(--t2-border); border-radius: var(--t2-r-card); background: var(--t2-bg-card); box-shadow: var(--t2-shadow); padding: 24px; height: 100%; }
  @media (max-width: 640px) {
    /* One card is visible at a time here, so equal heights buy nothing and
       cost a lot: every card stretched to match the longest review, leaving
       ~400px of empty card under the short ones. Size to content instead. */
    .t2-testimonial-card { height: auto; }
  }
  .t2-testimonial-head { display: flex; align-items: center; gap: 12px; }
  .t2-testimonial-avatar { width: 52px; height: 52px; border-radius: 999px; object-fit: cover; flex-shrink: 0; }
  /* For clients who left a written review but no photo or logo. Initials rather
     than a stock portrait: a stand-in face beside a real person's name would
     misrepresent them. */
  .t2-testimonial-avatar--initials {
    display: flex; align-items: center; justify-content: center;
    background: var(--t2-bg); border: 1px solid var(--t2-border);
    color: var(--t2-gold); font-size: 0.95rem; font-weight: 700; letter-spacing: 0.02em;
  }
  .t2-testimonial-name { font-weight: 600; color: var(--t2-text-muted); font-size: 0.88rem; }
  .t2-testimonial-company { color: var(--t2-gold); font-size: 0.78rem; font-weight: 600; }
  /* The quote is the point of a testimonial — give it more visual weight than
     the attribution underneath it, not the other way around. */
  .t2-testimonial-text { margin-top: 16px; color: var(--t2-text); font-size: 1.05rem; font-weight: 500; line-height: 1.7; }

  /* ── Logos strip ── */
  .t2-logos-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 32px 48px; }
  .t2-logos-row img { height: 42px; width: auto; object-fit: contain; filter: grayscale(1) brightness(0) invert(1); opacity: 0.8; }

  /* ── Mission ── */
  /* Asymmetric on purpose: the lead stat gets full card treatment (border,
     background, double width) and a bigger, slower count; the other three
     sit as plain, unboxed numbers so they read as supporting context rather
     than four identical tiles. */
  /* Two fixed rows, not one grid with a double-wide first cell. A 4-column
     grid with the lead stat spanning 2 columns leaves exactly 2 columns for
     the remaining 3 items — one of them has nowhere to go and wraps alone
     onto its own row, under a wide gap where the 4th column would have been.
     That happened at every width this grid was used at, not just narrow ones,
     because the mismatch is 3 items into 2 slots, not a viewport problem.
     Splitting into "one full-width featured row" + "three equal columns
     below" removes the mismatch instead of working around it. */
  .t2-mission-stats { display: flex; flex-direction: column; gap: 20px; margin-top: 40px; }
  .t2-mission-stat { padding: 6px 4px; }
  .t2-mission-stat-num { font-family: var(--t2-serif); font-size: 2rem; font-weight: 600; color: var(--t2-gold); line-height: 1; }
  .t2-mission-stat-label { margin-top: 10px; color: var(--t2-text-muted); font-size: 0.88rem; line-height: 1.5; }
  .t2-mission-stat--featured {
    border-radius: var(--t2-r-card); background: var(--t2-bg-card);
    border: 1px solid var(--t2-border); box-shadow: var(--t2-shadow); padding: 24px;
  }
  .t2-mission-stat--featured .t2-mission-stat-num { font-size: 3rem; }
  .t2-mission-stat--featured .t2-mission-stat-label { font-size: 0.92rem; }
  .t2-mission-secondary { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px 20px; }
  @media (min-width: 700px) {
    .t2-mission-stat--featured .t2-mission-stat-num { font-size: 3.6rem; }
  }

  /* ── Case studies ── */
  /* Task: two case studies per row on desktop, one on mobile. Because each
     card is now half as wide, its own internal layout stops being a two-column
     split and stacks instead -- the 280px metrics column and a map beside it
     do not both fit in half a container. */
  /* minmax(0,1fr) on the single mobile column, not just the 2-column desktop
     rule below -- without it, an implicit grid column sizes to its content's
     max-content width instead of clamping to the container, so the widest
     card's keyword-carousel row (nowrap arrows + counter) silently stretched
     every card in the grid past the viewport edge, clipped invisibly by
     .t2-page's overflow-x: hidden rather than showing as a scrollbar. */
  .t2-cases { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; margin-top: 40px; }
  .t2-case {
    display: flex; flex-direction: column; gap: 20px;
    border: 1px solid var(--t2-border); border-radius: var(--t2-r-card);
    background: var(--t2-bg-card); box-shadow: var(--t2-shadow); padding: 24px;
  }
  .t2-case-head { display: flex; align-items: center; gap: 12px; }
  /* min-width: 0 overrides the flex default of min-width: auto, which lets a
     flex child's own intrinsic content width (the business name plus the new
     "N keywords" badge) win over the row's actual available space instead of
     wrapping -- the classic, easy-to-miss way a flex row overflows sideways. */
  .t2-case-head > div:last-child { min-width: 0; }
  .t2-case-head h3 { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  /* One tile spec for both the real logos and the fallback glyph, so a row
     mixing the two still lines up. White fill because the client marks are
     drawn for light backgrounds and several are near-black. */
  .t2-case-logo, .t2-case-logo--glyph {
    width: 52px; height: 52px; border-radius: var(--t2-r-control);
    flex-shrink: 0; border: 1px solid var(--t2-border);
    background: #fff; object-fit: contain; padding: 7px;
  }
  .t2-case-logo--glyph {
    background: var(--t2-bg); display: flex; align-items: center;
    justify-content: center; font-size: 1.4rem; padding: 0;
  }
  /* The client's mark pinned on its own scan. Corner, not centre: the centre
     of a scan is the business's own location and carries the ranking bubble
     the reader is there to check. */
  .t2-baf-pin {
    position: absolute; left: 10px; top: 10px; z-index: 4;
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; padding: 5px; border-radius: var(--t2-r-control);
    background: rgba(255,255,255,0.94); box-shadow: 0 2px 10px rgba(0,0,0,0.35);
    pointer-events: none;
  }
  .t2-case-pin { width: 100%; height: 100%; object-fit: contain; display: block; }
  .t2-case-head h3 { color: var(--t2-text); font-size: 1.05rem; font-weight: 700; line-height: 1.3; }
  .t2-case-head p { color: var(--t2-gold); font-size: 0.8rem; font-weight: 600; margin-top: 2px; }
  /* Keyword switcher for a business tracked on more than one search term —
     arrows cycle in place instead of stacking a near-duplicate card below. */
  .t2-case-keywords {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    margin-top: 14px; padding: 6px 6px 6px 14px; width: 100%;
    box-sizing: border-box; max-width: 100%;
    border-radius: var(--t2-r-control);
    background: rgba(201,162,74,0.08); border: 1px solid rgba(201,162,74,0.3);
  }
  /* Solid fill rather than the outline every other icon-only control on this
     page uses -- deliberately: this is the one place a subtle outline button
     wasn't being noticed against the equally-gold-tinted metric rows right
     below it. A filled gold circle reads as "press me" at a glance instead of
     blending into the card's own accent colour. */
  .t2-case-keyword-arrow {
    display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
    width: 34px; height: 34px; border-radius: 999px; border: 0;
    background: var(--t2-gold-btn); color: #FFFFFF;
    cursor: pointer; transition: background 0.15s ease, transform 0.15s ease;
  }
  .t2-case-keyword-arrow:hover { background: var(--t2-gold-btn-hover); transform: scale(1.06); }
  /* Names how many search terms this business is tracked on, right next to
     its name -- so the reason an arrow control exists on this card is obvious
     before a reader's eye even reaches it. */
  .t2-case-multi-badge {
    display: inline-block; margin-left: 8px; padding: 2px 8px; border-radius: 999px;
    background: rgba(201,162,74,0.16); border: 1px solid rgba(201,162,74,0.4);
    color: var(--t2-gold); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.02em;
    text-transform: uppercase; vertical-align: middle;
  }
  .t2-case-keyword-current {
    flex: 1 1 0%; min-width: 0; max-width: 100%; display: flex;
    align-items: baseline; justify-content: space-between; gap: 10px; box-sizing: border-box;
    color: var(--t2-text); font-size: 0.84rem; font-weight: 600;
  }
  .t2-case-keyword-current > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .t2-case-keyword-count { flex-shrink: 0; color: var(--t2-text-muted); font-size: 0.72rem; font-weight: 500; }
  .t2-case-metrics { display: grid; gap: 8px; margin-top: 20px; }
  .t2-case-metric { display: flex; align-items: center; justify-content: space-between; gap: 10px; border-radius: var(--t2-r-control); background: rgba(244,241,234,0.03); border: 1px solid var(--t2-border); padding: 10px 14px; }
  /* Phrase-length values (the tracked search term) stack under their label —
     opposite it they collide in this narrow column and wrap mid-phrase. */
  .t2-case-metric--stack { flex-direction: column; align-items: flex-start; gap: 4px; }
  .t2-case-metric--stack .t2-case-metric-val { font-size: 0.92rem; line-height: 1.4; }
  .t2-case-metric-val { color: var(--t2-gold); font-size: 1rem; font-weight: 700; }
  .t2-case-metric-label { color: var(--t2-text-muted); font-size: 0.78rem; }
  /* Discloses which numbers on the cards are modelled rather than measured.
     Muted and small, but present on the page itself, not just in the source. */
  .t2-cases-note {
    margin-top: 20px; text-align: center; color: var(--t2-text-muted);
    font-size: 0.76rem; line-height: 1.6; max-width: 720px;
    margin-left: auto; margin-right: auto;
  }


  /* ── Before/after slider ── */
  .t2-baf-labels { display: flex; justify-content: space-between; margin-bottom: 8px; gap: 8px; }
  .t2-baf-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; padding: 5px 10px; border-radius: var(--t2-r-control); }
  .t2-baf-label--before { background: rgba(138,147,166,0.14); color: var(--t2-text-muted); }
  .t2-baf-label--after { background: rgba(201,162,74,0.14); color: var(--t2-gold); }
  /* Fixed aspect-ratio box, with BOTH before/after images object-fit: cover'd into
     it the same way — using one image's natural size to define the box (and only
     force-fitting the other) made mismatched-resolution before/after screenshot
     pairs visibly jump in scale right at the seam.
     800/743 is the exact pixel ratio of the rank-scan frames after their date
     header is cropped off. Matching it means object-fit: cover has nothing to crop,
     so the grid's outermost ranking bubbles stay inside the frame — at 1/1 the
     box ate ~7% of the width and clipped the edge columns. */
  .t2-baf-frame { position: relative; overflow: hidden; border-radius: var(--t2-r-control); border: 1px solid var(--t2-border); background: #0d1520; max-width: 460px; margin: 0 auto; aspect-ratio: 800 / 743; touch-action: none; cursor: ew-resize; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
  .t2-baf-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; -webkit-user-drag: none; -webkit-touch-callout: none; pointer-events: none; }
  .t2-baf-clip { position: absolute; inset: 0; overflow: hidden; }
  .t2-baf-line { position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(244,241,234,0.85); transform: translateX(-50%); pointer-events: none; z-index: 2; }
  .t2-baf-handle { position: absolute; top: 50%; transform: translate(-50%, -50%); z-index: 3; display: flex; align-items: center; gap: 4px; background: var(--t2-text); color: var(--t2-bg); border-radius: 999px; padding: 8px 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.35); pointer-events: none; }
  .t2-baf-handle-arrow { font-size: 0.85rem; font-weight: 700; line-height: 1; }

  /* ── More Leads cards ── */
  .t2-leadcards { display: grid; gap: 20px; margin-top: 44px; }
  .t2-leadcard { display: grid; gap: 24px; border: 1px solid var(--t2-border); border-radius: var(--t2-r-card); background: var(--t2-bg-card); box-shadow: var(--t2-shadow); padding: 24px; align-items: center; }
  .t2-leadcard img { width: 100%; border-radius: 12px; display: block; }
  .t2-leadcard h3 { color: var(--t2-text); font-size: 1.18rem; font-weight: 700; }
  .t2-leadcard-sub { color: var(--t2-gold); font-size: 0.82rem; font-weight: 600; margin-top: 4px; }
  .t2-leadcard p.t2-leadcard-desc { margin-top: 12px; color: var(--t2-text-muted); font-size: 0.94rem; line-height: 1.7; }
  .t2-leadcard .t2-btn { margin-top: 18px; }
  /* Lead card in the set gets more visual weight — bigger padding, border, and
     type — so the four cards don't read as four identical repeats. */
  /* Same padding as its siblings now -- only the border colour and type scale
     mark it out, so the four cards still line up edge to edge. */
  .t2-leadcard--featured { border-color: rgba(201,162,74,0.4); }
  .t2-leadcard--featured h3 { font-size: 1.4rem; }
  .t2-leadcard--featured p.t2-leadcard-desc { font-size: 1rem; }

  /* ── Comparison ── */
  .t2-compare-grid { display: grid; gap: 20px; margin-top: 44px; }
  .t2-compare-col { border-radius: var(--t2-r-card); padding: 24px; border: 1px solid var(--t2-border); background: var(--t2-bg-card); box-shadow: var(--t2-shadow); }
  .t2-compare-col--plus { border-color: rgba(201,162,74,0.4); }
  .t2-compare-col h3 { color: var(--t2-text); font-size: 1.2rem; font-weight: 700; margin-bottom: 22px; }
  .t2-compare-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; color: var(--t2-text); font-size: 0.92rem; font-weight: 500; }
  .t2-compare-mark { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 999px; flex-shrink: 0; }
  .t2-compare-mark--yes { background: var(--t2-gold); color: var(--t2-bg); }
  .t2-compare-mark--no { background: rgba(138,147,166,0.18); color: var(--t2-text-muted); }

  /* ── Video testimonials ── */
  .t2-videos { display: grid; gap: 18px; margin-top: 44px; grid-template-columns: repeat(2, minmax(0,1fr)); }
  .t2-video-card { border-radius: var(--t2-r-card); border: 1px solid var(--t2-border); background: var(--t2-bg-card); box-shadow: var(--t2-shadow); padding: 8px; }
  .t2-video-frame { position: relative; width: 100%; padding-bottom: 177.78%; border-radius: 10px; overflow: hidden; background: #000; }
  .t2-video-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }

  /* Click-to-load poster (see YouTubeFacade). It occupies the frame exactly, so
     swapping it for the real iframe on click shifts no layout — the aspect box
     around it is fixed by .t2-video-frame's padding-bottom either way. */
  .t2-video-facade {
    position: absolute; inset: 0; width: 100%; height: 100%;
    padding: 0; border: 0; background: #000; cursor: pointer; display: block;
  }
  .t2-video-poster { width: 100%; height: 100%; object-fit: cover; display: block; }
  .t2-video-play {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    display: grid; place-items: center; width: 58px; height: 58px; border-radius: 999px;
    background: rgba(12, 20, 32, 0.72); color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(2px);
    padding-left: 4px; /* optical centring: the glyph's mass sits left of centre */
    transition: transform 160ms ease, background 160ms ease;
  }
  .t2-video-facade:hover .t2-video-play { transform: translate(-50%, -50%) scale(1.08); background: rgba(12, 20, 32, 0.88); }
  .t2-video-facade:focus-visible { outline: 2px solid var(--t2-gold); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .t2-video-facade:hover .t2-video-play { transform: translate(-50%, -50%); }
  }
  .t2-video-ranks { margin-top: 10px; padding: 0 4px 4px; }
  /* Crossfades between Before/After on hover (desktop) or tap (mobile) rather
     than showing both at once — a small "transformation" moment tied to the
     viewer's own interaction. */
  .t2-rank-crossfade { position: relative; display: block; width: 100%; height: 38px; border: 0; border-radius: 8px; background: rgba(244,241,234,0.04); cursor: pointer; overflow: hidden; padding: 0; }
  .t2-rank-crossfade-face {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; color: var(--t2-text-muted); opacity: 0;
    transition: opacity 0.35s ease;
  }
  .t2-rank-crossfade-face.is-visible { opacity: 1; }
  .t2-rank-crossfade-face--after { color: var(--t2-gold); }

  /* ── Plans ── */
  .t2-plans { display: grid; gap: 22px; margin-top: 48px; }
  .t2-plan { position: relative; border-radius: var(--t2-r-card); border: 1px solid var(--t2-border); background: var(--t2-bg-card); box-shadow: var(--t2-shadow); padding: 24px; display: flex; flex-direction: column; }
  .t2-plan--popular { border-color: var(--t2-gold); }
  .t2-plan-popular-tag { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--t2-gold-btn); color: #FFFFFF; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 7px 16px; border-radius: var(--t2-r-control); }
  .t2-plan-badge { display: inline-block; align-self: flex-start; background: rgba(201,162,74,0.12); color: var(--t2-gold); font-size: 0.72rem; font-weight: 700; padding: 7px 12px; border-radius: var(--t2-r-control); margin-bottom: 18px; }
  .t2-plan-visual { border-radius: var(--t2-r-control); overflow: hidden; margin-bottom: 18px; }
  .t2-plan-visual img { width: 100%; display: block; }

  /* ── Plan coverage map (see PlanRadiusMap.tsx) ── */
  .t2-planmap { position: relative; margin: 0; aspect-ratio: 1; border-radius: var(--t2-r-control); overflow: hidden; border: 1px solid var(--t2-border); }
  .t2-planmap-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .t2-planmap-overlay { position: absolute; inset: 0; width: 100%; height: 100%; }
  /* Centred pill naming the radius, sat directly on the circle it describes —
     the map reads as "this distance" at a glance instead of asking the reader
     to match a corner label back to the ring. Solid gold with navy text: the
     same pairing as every other on-page badge, and ~8:1 contrast against the
     gold fill it sits on. */
  .t2-planmap-radius {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    border-radius: var(--t2-r-control); padding: 9px 16px;
    background: var(--t2-gold); color: var(--t2-bg);
    font-size: 0.86rem; font-weight: 700; letter-spacing: 0.01em; white-space: nowrap;
    box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  }
  @media (max-width: 480px) {
    .t2-planmap-radius { font-size: 0.76rem; padding: 7px 12px; }
  }
  /* Coverage footprint as a bounding square (2x radius) rather than the
     circle's own area — see PlanRadiusMap.tsx for why. Corner placement and
     quieter treatment than the radius pill: it is a supporting figure, not
     the headline of the visual. Top-right rather than bottom-right so it
     never sits over the OSM attribution strip, which owns the bottom edge. */
  .t2-planmap-area {
    position: absolute; right: 10px; top: 10px;
    border-radius: var(--t2-r-control); padding: 5px 10px;
    background: rgba(11,20,32,0.82); border: 1px solid rgba(201,162,74,0.45);
    color: var(--t2-gold); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
  }
  /* Collapsed OSM attribution — a small "i" rather than a text band across
     the map. See the comment beside its markup for why a shrunk icon still
     satisfies OpenStreetMap's attribution requirement. Kept low-contrast at
     rest so it doesn't compete with the radius pill; the hover/focus state
     brings it up to full legibility for anyone who goes looking for it. */
  .t2-planmap-attr {
    position: absolute; right: 8px; bottom: 8px;
    display: flex; align-items: center; justify-content: center;
    width: 17px; height: 17px; border-radius: 50%;
    background: rgba(11,20,32,0.55); color: rgba(244,241,234,0.7);
    font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size: 0.72rem;
    line-height: 1; text-decoration: none;
  }
  .t2-planmap-attr:hover, .t2-planmap-attr:focus-visible {
    background: rgba(11,20,32,0.85); color: var(--t2-text);
  }
  .t2-plan h3 { color: var(--t2-text); font-family: var(--t2-serif); font-size: 1.5rem; font-weight: 500; }
  .t2-plan-desc { margin-top: 8px; color: var(--t2-text-muted); font-size: 0.9rem; line-height: 1.65; min-height: 84px; }
  .t2-plan-price { margin-top: 14px; }
  .t2-plan-included { list-style: none; margin: 18px 0 0; padding: 0; display: grid; gap: 10px; flex: 1; }
  .t2-plan-included li { display: flex; align-items: center; gap: 10px; font-size: 0.88rem; color: var(--t2-text); font-weight: 500; }
  .t2-plan-check { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 999px; flex-shrink: 0; }
  .t2-plan-check--yes { background: var(--t2-gold); color: var(--t2-bg); }
  .t2-plan-check--no { background: rgba(138,147,166,0.16); color: var(--t2-text-muted); }
  .t2-plan .t2-btn { margin-top: 24px; width: 100%; }

  /* ── FAQ ── */
  .t2-faq-item { border-radius: var(--t2-r-card); border: 1px solid var(--t2-border); background: var(--t2-bg-card); box-shadow: var(--t2-shadow); padding: 20px 22px; }
  .t2-faq-item summary { cursor: pointer; list-style: none; font-weight: 600; color: var(--t2-text); display: flex; justify-content: space-between; gap: 16px; }
  .t2-faq-item summary::-webkit-details-marker { display: none; }
  .t2-faq-plus { color: var(--t2-gold); font-size: 1.2rem; line-height: 1; }
  .t2-faq-answer { margin-top: 14px; color: var(--t2-text-muted); font-size: 0.94rem; line-height: 1.75; }

  @media (min-width: 700px) {
    .t2-videos { grid-template-columns: repeat(4, minmax(0,1fr)); }
    .t2-compare-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .t2-plans { grid-template-columns: repeat(2, minmax(0,1fr)); align-items: stretch; }
  }
  @media (min-width: 860px) {
    /* .t2-case no longer takes a two-column rule here. The cards themselves
       are now paired two to a row, so each one has roughly half a container to
       work with and its metrics list and map stack instead of sitting side by
       side. */
    .t2-leadcard { grid-template-columns: 220px minmax(0,1fr); }
    .t2-leadcard:nth-child(even) { direction: rtl; }
    .t2-leadcard:nth-child(even) > * { direction: ltr; }
    .t2-leadcard--featured { grid-template-columns: 220px minmax(0,1fr); }
  }

  /* Task: case studies two per row on desktop, one on mobile. Held back to
     1024px rather than the 860px used elsewhere -- below that the pair of
     cards squeezes the scan images past the point where the ranking numbers
     on the grid stay readable, which is the only reason the images are there. */
  @media (min-width: 1024px) {
    .t2-cases { grid-template-columns: repeat(2, minmax(0,1fr)); align-items: start; }
  }

  /* ── Footer ── */
  .t2-footer { border-top: 1px solid var(--t2-border); padding: 56px 0 32px; }
  .t2-footer-inner { max-width: 1440px; margin: 0 auto; padding: 0 clamp(20px, 3vw, 44px); display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; }
  .t2-footer-logo { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .t2-footer-logo img { height: 30px; width: auto; }
  .t2-footer-logo-name { color: var(--t2-text); font-size: 0.85rem; font-weight: 700; letter-spacing: -0.01em; }
  .t2-footer-tagline { color: var(--t2-text); font-size: 1.2rem; font-weight: 600; letter-spacing: -0.01em; max-width: 520px; line-height: 1.4; }
  .t2-footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
  .t2-footer-links a { color: var(--t2-text-muted); font-size: 0.88rem; font-weight: 500; text-decoration: none; }
  .t2-footer-links a:hover { color: var(--t2-gold); }
  .t2-footer-bottom { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 8px; padding-top: 28px; border-top: 1px solid var(--t2-border); width: 100%; }
  .t2-footer-socials { display: flex; gap: 16px; }
  .t2-footer-socials a { color: var(--t2-gold); }
  .t2-footer-socials a:hover { color: var(--t2-gold-soft); }
  .t2-footer-copy { color: var(--t2-text-muted); font-size: 0.8rem; }

  /* ── Floating CTA ── */
  /* Task: shape consistency. This was the one pill at the bottom of a page
     whose every other control is a rounded rectangle, and it sits in the
     corner next to the footer where the mismatch was most obvious. */
  .t2-floating-cta {
    position: fixed; right: 20px; bottom: 20px; z-index: 90;
    display: inline-flex; align-items: center; justify-content: center; line-height: 1;
    min-height: 50px; border: 0; border-radius: var(--t2-r-control);
    background: var(--t2-gold-btn); color: #FFFFFF;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.02em;
    padding: 0 22px; cursor: pointer; box-shadow: var(--t2-shadow);
    opacity: 0; transform: translateY(8px); pointer-events: none;
    transition: background 0.2s ease, opacity 0.25s ease, transform 0.25s ease;
  }
  /* Applied once the hero (and the primary CTA it contains) leaves the
     viewport, so the pill can never sit on top of that button. */
  .t2-floating-cta--in { opacity: 1; transform: none; pointer-events: auto; }
  .t2-floating-cta:hover { background: var(--t2-gold-btn-hover); }
  @media (max-width: 640px) {
    .t2-floating-cta { right: 14px; bottom: 14px; font-size: 0.74rem; padding: 0 16px; min-height: 46px; }
  }

  @media (min-width: 700px) {
    .t2-footer-bottom { flex-direction: row; justify-content: space-between; }
  }
`;

const brandLogos = [
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

const missionStats = [
  { value: "93%", label: "of consumers use Google to find local businesses" },
  { value: "76%", label: "of mobile local searches lead to a visit within 24 hours" },
  { value: "50%", label: "of clicks go to the top 3 local map results" },
  { value: "28%", label: "of local searches result in a purchase" },
];

const leadCards = [
  {
    title: "Increase Your Local Visibility",
    subtitle: "Google Maps",
    description:
      "We help your business stand out locally by building stronger authority around your Google Business Profile and generating signals that support top map pack visibility.",
    image: increaseLocalVisibility,
  },
  {
    title: "Improve Your Search Performance",
    subtitle: "Google Search",
    description:
      "Our local SEO workflows strengthen search relevance around your services, target locations, and intent-driven keywords so more ready-to-buy people find you.",
    image: improveSearchPerformance,
  },
  {
    title: "No Direct Access Required",
    subtitle: "Safe and effective",
    description:
      "We move rankings forward without risky shortcuts or logging into your accounts — the process is structured to keep everything secure while still building momentum.",
    image: noDirectAccess,
  },
  {
    title: "What's Needed for Best Results",
    subtitle: "The right foundation",
    description:
      "Businesses with a verified profile, strong service pages, and consistent business information usually scale faster. We help tighten each one of those pieces.",
    image: bestResults,
  },
];

const comparisonFeatures = [
  "Link Building",
  "Content Creation",
  "Keyword Optimization",
  "Google Business Profile SEO",
  "GPS-Based Local Activity",
  "Website On-Page Local SEO",
  "Rank Tracking in Local Area",
  "Google Maps Ranking Focus",
  "Google Reviews Automation",
  "Fast Results (Top 3 in ~3 Months)",
];

const traditionalMissing = new Set([
  "Google Business Profile SEO",
  "GPS-Based Local Activity",
  "Website On-Page Local SEO",
  "Rank Tracking in Local Area",
  "Google Maps Ranking Focus",
  "Google Reviews Automation",
  "Fast Results (Top 3 in ~3 Months)",
]);

// First entry intentionally placed last per feedback on video ordering.
const videoTestimonials = [
  { id: "-8SFE-Pbm9g", title: "Auto Repair Shop Testimonial", before: "Not found", after: "Top 3", poster: posterAutoRepair },
  { id: "Mlt9xpYy00w", title: "Online Movers and Storage", before: "Not ranked", after: "Top 3", poster: posterMoversStorage },
  { id: "hp_UzmzN9cU", title: "Physiotherapy Clinic Testimonial", before: "Rank 14", after: "Top 3", poster: posterPhysiotherapy },
  { id: "z7HUliWQ_NU", title: "Dental Clinic Testimonial", before: "Rank 9", after: "Rank 1", poster: posterDentalClinic },
];

const onboardingSteps = ["Start Free Trial", "Try Our System", "Choose Your Plan", "Track Your Progress"];

const onboardingStepDetails = [
  {
    title: "Start Your 7-Day Free Trial",
    description:
      "Begin your trial by booking a short call on this page. We'll set up your account, confirm the details, discuss your goals, and identify your target search terms.",
    introLabel: "What You'll Need:",
    bullets: [
      "Verified Google Business Profile",
      "Content-rich website",
      "15+ Google reviews",
      "3.5+ Google rating",
    ],
  },
  {
    title: "Try Our Local SEO System",
    description:
      "During your free trial, you'll get full visibility into exactly how our Local Activity system works for your business.",
    introLabel: "During your free trial:",
    bullets: [
      "View Your Current Google Maps Rankings - See where your business stands right now.",
      "Track Your Progress - Monitor improvements in keyword positions and local visibility.",
      "Test Features Risk-Free - Explore all tools and insights with no cost, obligation, or risk.",
    ],
  },
  {
    title: "Choose Your Local SEO Plan",
    description:
      "Once you've seen the strategy in action and the results it can deliver, select the plan that best fits your business goals. Our flexible, performance-based options are designed to match your local growth needs:",
    bullets: [
      "Community Plan - Top 3 rankings for 10 keywords within a 2.5-mile radius of your business.",
      "City Plan - Top 3 rankings for 20 keywords within a 5-mile radius.",
    ],
    outro:
      "Pick the coverage that best aligns with your target audience and local service area to maximise your visibility and leads.",
  },
  {
    title: "Track Your Local SEO Progress",
    description:
      "Watch your business climb into the Top 3 on Google Maps — typically within 90 days. Expect a surge in calls, bookings, direction requests, website visits, and new customers as your local visibility skyrockets.",
    bullets: [
      "Bi-Weekly Reports - Detailed updates on keyword positions and Google Business Profile performance.",
      "Track Key Metrics in Your Google Business Profile - Monitor increases in calls, bookings, directions requests, website visits, and all other profile interactions.",
    ],
  },
];

const planFeatureList = [
  "Top 3 Google Maps Positions Targeted",
  "AI-Powered Local Signal Boost",
  "GPS-Based Local Activity",
  "Google Business Profile SEO",
  "Website On-Page Local SEO",
  "Website Off-Page SEO (Link Building)",
  "Rank Tracking in Local Area",
  "Bi-Weekly Performance Reports",
  "Google Reviews Automation",
  "Google Posts Management",
  "Local Citation Management",
  "Cloud Stack Service",
  "Multi-Location Discounts",
  "Medium & Google Pages/Documents",
];

const communityIncluded = new Set(
  planFeatureList.filter((f) => f !== "Medium & Google Pages/Documents"),
);

const plans = [
  {
    name: "Community",
    badge: "Top 3 on Google Maps in 90 Days",
    map: "community" as PlanRadiusKey,
    description: "Perfect for local shops and service businesses that want better Google Maps visibility.",
    radius: "2.5-mile radius · 10 keywords · 10–20 direction signals/day",
    popular: false,
    included: communityIncluded,
  },
  {
    name: "City",
    badge: "Top 3 on Google Maps in 90 Days",
    map: "city" as PlanRadiusKey,
    description: "Ideal for competitive businesses like clinics that want to dominate Google Maps locally.",
    radius: "5-mile radius · 20 keywords · 30–40 direction signals/day",
    popular: true,
    included: new Set(planFeatureList),
  },
];

const faqs = [
  {
    question: "Why don't you need access to my Google Business Profile or website?",
    answer:
      "Our system builds ranking signals externally — through verified local citations, GPS-based activity, and profile optimization techniques — without ever needing login access to your Google Business Profile or website. This keeps your accounts fully secure while we still move your rankings forward.",
  },
  {
    question: "How fast will I see results?",
    answer:
      "Most clients see measurable ranking improvements within 4 to 6 weeks. Top 3 positions typically take 8 to 12 weeks depending on your market's competition. You'll get reports every two weeks tracking progress the entire way.",
  },
  {
    question: "Do I have to sign a contract?",
    answer:
      "No long-term contracts. You pay monthly and can cancel anytime. We don't lock you in because we believe results should speak louder than contracts.",
  },
  {
    question: "What are the requirements for the free trial?",
    answer:
      "You'll get the best results if you already have a verified Google Business Profile, a rating of 3.5 stars or higher, at least 15 reviews, a working website, and you serve customers in a local area.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a short call on this page. We'll review your business, confirm eligibility for the trial, and walk you through goals and next steps on the call.",
  },
  {
    question: "What's the free trial exactly?",
    answer:
      "The free trial gives you 7 days to experience the system. We start the audit, activate your profile optimization, and begin generating ranking signals. You'll see if it works before paying anything. After 7 days, it's your choice to continue or cancel.",
  },
  {
    question: "Is this different from Google Ads or PPC?",
    answer:
      "Completely different. Google Ads requires paying for every click. GMB SEO (organic rankings) means you get free clicks once you're ranked. You pay a flat monthly fee for the service, but each customer call from Google Maps is completely free. Most clients see ROI of 3:1 to 10:1.",
  },
  {
    question: "What if I already have a good Google Business Profile?",
    answer:
      "Even if your profile looks good, there's usually room for optimization. Our audit will show what you're missing. Most businesses have incomplete profiles, missing keywords, weak descriptions, or insufficient ranking signals. We'll fix all of that.",
  },
  {
    question: 'How do I know this is not some "black hat" or risky SEO?',
    answer:
      "Everything we do follows Google's guidelines. We use verified ranking signals, legitimate directory citations, authentic review strategies, and proper profile optimization. This is white-hat SEO that's been proven to work consistently for years.",
  },
  {
    question: "Can you guarantee #1 rankings?",
    answer:
      "No one can guarantee specific rankings because Google changes its algorithm. What we guarantee is effort, transparency, and proven methodology. Our system consistently gets clients into top 3 positions. Some reach #1, but we focus on getting you calls and revenue, not just rankings.",
  },
  {
    question: "How many profiles can I have optimized?",
    answer:
      "Our packages cover a single primary location. If you have multiple locations, we can discuss multi-location pricing. Most solo practices and small businesses start with their main location.",
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You can cancel anytime with no penalty. Your GBP profile stays optimized, but ranking signals and new backlinks stop being generated. Your rankings may gradually decline over time, but the optimization we've done remains.",
  },
  {
    question: "Can I speak with someone before starting?",
    answer:
      "Of course. Book a free consultation with our team using any of the buttons on this page. We'll discuss your specific situation, answer all your questions, and explain exactly how this can help your business.",
  },
];

const TrialPartnerStrip = () => (
  <div className="t2-partner-wrap">
    <div className="t2-partner-strip">
      <img src={googlePartnerLogo} alt="Google Partner" />
    </div>
  </div>
);

const TrialHero = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section id="t2-home" className="t2-hero t2-topo">
      <div className="t2-container t2-hero-inner">
        <span className="t2-hero-badge">Top 3 Google Maps in 90 Days</span>
        <span className="t2-hero-eyebrow">Clinic &amp; Local Business Owners:</span>
        <h1 className="t2-hero-h1">
          Rank <em>TOP 3 on Google Maps</em> <em>in 90 Days</em>
        </h1>
        <p className="t2-hero-sub">
          No paid ads. No outdated SEO tricks. No relying on word of mouth. Just a proven system that pushes your
          Google Maps ranking up — starting with a completely free 7-day trial.
        </p>

        <RankCounter />

        {/* TODO: update rating and review count with real data */}
        <div className="t2-rating t2-hero-rating">
          <div className="t2-rating-stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-5 w-5" fill="#C9A24A" stroke="#C9A24A" />
            ))}
          </div>
          <span className="t2-rating-num">4.8</span>
          <span className="t2-rating-count">from 45 reviews</span>
        </div>

        <div className="t2-hero-actions">
          <button type="button" className="t2-btn" onClick={openTrialModal}>
            Get Ranked Free
          </button>
          <button type="button" className="t2-btn t2-btn--outline" onClick={openTrialModal}>
            Schedule Time for Meeting
          </button>
        </div>

        <div className="t2-hero-video-wrap">
          {/* TODO: replace with real product demo video loop when ready — structure/player must match manvimedia's autoplay + sound-toggle behavior */}
          <div className="t2-hero-video-inner">
            <HeroRankClimb />
          </div>
        </div>
      </div>
    </section>
  );
};

const TrialRatingAndReviews = () => {
  // Embla lays every slide out in one flex row and, per the flexbox spec,
  // sizes that row's own height to its TALLEST slide regardless of
  // align-items -- items-start (below) only stops shorter slides from being
  // stretched to match, it does not shrink the row itself. Left alone, the
  // carousel always reserves space for the longest testimonial in the set,
  // even though only the current one is visible on a phone: a ~640px section
  // for a ~230px review, dead space a visitor scrolling past has no way to
  // account for. Tracking the height of whichever slide(s) are actually in
  // view and applying it to a wrapper OUTSIDE the shared Carousel component
  // (not touched here -- V1 uses it too) makes the section's real footprint
  // match what is actually on screen.
  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  const [carouselHeight, setCarouselHeight] = useState<number>();

  useEffect(() => {
    if (!emblaApi) return;
    const updateHeight = () => {
      const nodes = emblaApi.slideNodes();
      // slidesInView() is IntersectionObserver-backed and reports empty on the
      // very first call, before its observer has had a chance to fire once --
      // which is exactly when this effect's first run needs an answer. Falling
      // back to the single currently-selected slide (always available
      // immediately) means the very first paint still gets a real height
      // instead of the "no height style at all" default this shipped with
      // originally, which is what left the section at its full stretched size.
      let inView = emblaApi.slidesInView();
      if (inView.length === 0) inView = [emblaApi.selectedScrollSnap()];
      const heights = inView.map((i) => nodes[i]?.getBoundingClientRect().height ?? 0);
      if (heights.length) setCarouselHeight(Math.max(...heights));
    };
    updateHeight();
    emblaApi.on("select", updateHeight);
    emblaApi.on("reInit", updateHeight);
    emblaApi.on("resize", updateHeight);
    return () => {
      emblaApi.off("select", updateHeight);
      emblaApi.off("reInit", updateHeight);
      emblaApi.off("resize", updateHeight);
    };
  }, [emblaApi]);

  return (
    <section id="reviews" className="t2-section t2-section--sm">
    <div className="t2-container">
      {/* TODO: update rating and review count with real data */}
      <div className="t2-rating">
        <div className="t2-rating-stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-6 w-6" fill="#C9A24A" stroke="#C9A24A" />
          ))}
        </div>
        <span className="t2-rating-num">4.8</span>
        <span className="t2-rating-count">out of 45 reviews</span>
      </div>

      <div className="t2-center" style={{ marginTop: 48 }}>
        <span className="t2-eyebrow">Client reviews</span>
        <h2 className="t2-h2">What local businesses say</h2>
      </div>

      <div style={{ marginTop: 44, height: carouselHeight, overflow: "hidden", transition: "height 300ms ease" }}>
        <Carousel opts={{ align: "start" }} setApi={setEmblaApi}>
          {/* items-start overrides the shared Carousel component's default flex
              align-items: stretch, which we cannot change there — it is used by
              the V1 pages too. Without it every slide stretches to match the
              tallest testimonial in the set, and on mobile (one slide visible
              at a time) that leaves ~180px of dead space below every shorter
              card, pushed there by a sibling the visitor cannot even see. */}
          <CarouselContent className="items-start">
            {testimonials.map((t, i) => (
              <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3">
                <motion.div
                  className="t2-testimonial-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                >
                  <div className="t2-testimonial-head">
                    {t.avatar ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        className="t2-testimonial-avatar"
                        style={t.avatarFit === "contain" ? { objectFit: "contain", padding: 8, background: "#fff" } : undefined}
                        src={t.avatar}
                        alt={t.name}
                      />
                    ) : (
                      <div className="t2-testimonial-avatar t2-testimonial-avatar--initials" aria-hidden="true">
                        {initialsOf(t.name)}
                      </div>
                    )}
                    <div>
                      <div className="t2-testimonial-name">{t.name}</div>
                      <div className="t2-testimonial-company">{t.company}</div>
                    </div>
                  </div>
                  <p className="t2-testimonial-text">&ldquo;{t.text}&rdquo;</p>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Hidden on phones: at 390px these sit on top of the review text.
              The carousel is swipeable, which is the expected gesture there. */}
          <CarouselPrevious className="-left-4 hidden sm:inline-flex" />
          <CarouselNext className="-right-4 hidden sm:inline-flex" />
        </Carousel>
      </div>
    </div>
    </section>
  );
};

const TrialLogosStrip = () => (
  <section className="t2-section--sm">
    <div className="t2-container">
      {/* TODO: replace with international/UK+Dubai client logos when available */}
      <div className="t2-logos-row">
        {brandLogos.map((b, i) => (
          <motion.img
            key={b.alt}
            src={b.src}
            alt={b.alt}
            loading="lazy"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.09 }}
          />
        ))}
      </div>
    </div>
  </section>
);

const TrialMission = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section className="t2-section">
      <div className="t2-container t2-section-head">
        <span className="t2-eyebrow">Our mission</span>
        <h2 className="t2-h2">
          We believe every local business deserves to be <em>found first</em>
        </h2>
        <p className="t2-lead t2-center">
          Being on page one isn't enough when customers only look at the map. Our mission is to put local business
          owners in front of ready-to-buy customers the moment they search — without ad spend, without shortcuts, and
          without waiting years for organic SEO to catch up.
        </p>
        <div className="t2-mission-stats">
          <div className="t2-mission-stat t2-mission-stat--featured">
            <div className="t2-mission-stat-num">
              <CountUpStat value={missionStats[0].value} duration={1800} />
            </div>
            <div className="t2-mission-stat-label">{missionStats[0].label}</div>
          </div>
          <div className="t2-mission-secondary">
            {missionStats.slice(1).map((s) => (
              <div key={s.label} className="t2-mission-stat">
                <div className="t2-mission-stat-num">
                  <CountUpStat value={s.value} duration={1200} />
                </div>
                <div className="t2-mission-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="t2-cta-row">
          <button type="button" className="t2-btn" onClick={openTrialModal}>
            Start Your Free 7-Day Trial
          </button>
          <button type="button" className="t2-btn t2-btn--ghost" onClick={openTrialModal}>
            Schedule Time for Meeting
          </button>
        </div>
      </div>
    </section>
  );
};

// Several businesses are tracked on more than one search term (Miracle K9 on
// three, Vairalda and Nida on two, Hanse Trailer on three) — see the docblock
// on lib/caseStudies.ts for why each still gets its own full CaseStudy entry
// rather than being folded together. On the page those entries were 17
// separate stacked cards, and on a phone the ones for the same business ran
// back to back with nothing distinguishing them but a shorter search-term
// line — a visitor who cared about one Miracle K9 result had to scroll past
// two more before the next real business started.
//
// Same-business entries are adjacent in caseStudies.ts by construction, so a
// single linear pass groups them correctly without touching that file.
const T2_CASE_GROUPS: CaseStudy[][] = (() => {
  const groups: CaseStudy[][] = [];
  for (const study of caseStudies) {
    const last = groups[groups.length - 1];
    if (last && last[0].business === study.business) last.push(study);
    else groups.push([study]);
  }
  return groups;
})();

const TrialCaseCard = ({ group }: { group: CaseStudy[] }) => {
  const [active, setActive] = useState(0);
  const study = group[active];
  const multi = group.length > 1;

  return (
    <article className="t2-case">
      <div>
        <div className="t2-case-head">
          <CaseStudyLogo slug={study.slug} glyph={study.icon} business={study.business} />
          <div>
            <h3>
              {study.business}
              {multi && <span className="t2-case-multi-badge">{group.length} keywords</span>}
            </h3>
            <p>{study.location}</p>
          </div>
        </div>

        {multi && (
          <div className="t2-case-keywords">
            <button
              type="button"
              className="t2-case-keyword-arrow"
              aria-label="Previous tracked keyword"
              onClick={() => setActive((i) => (i - 1 + group.length) % group.length)}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <span className="t2-case-keyword-current">
              <span>{study.metrics[0].value}</span>
              <span className="t2-case-keyword-count">{active + 1}/{group.length}</span>
            </span>
            <button
              type="button"
              className="t2-case-keyword-arrow"
              aria-label="Next tracked keyword"
              onClick={() => setActive((i) => (i + 1) % group.length)}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        )}

        <div className="t2-case-metrics">
          {study.metrics.map((m) => (
            <div key={m.label} className={`t2-case-metric${m.stack ? " t2-case-metric--stack" : ""}`}>
              <span className="t2-case-metric-label">{m.label}</span>
              <span className="t2-case-metric-val">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
      <BeforeAfterSlider
        key={study.slug}
        before={caseStudyScansV2[study.slug]?.before ?? study.before}
        after={caseStudyScansV2[study.slug]?.after ?? study.after}
        beforeLabel={study.beforeLabel}
        afterLabel={study.afterLabel}
      />
    </article>
  );
};

const TrialCaseStudies = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section id="case-studies" className="t2-section">
      <div className="t2-container">
        <div className="t2-section-head">
          <span className="t2-eyebrow">Real results</span>
          <h2 className="t2-h2">
            How local businesses <em>grew</em> on Google Maps
          </h2>
          <p className="t2-lead t2-center">
            Eleven real clients across five countries, seventeen before/after maps — metalwork in West Sussex, hail repair in Texas, removals on the
            Sunshine Coast. Drag the handle to see the same map before and after.
          </p>
        </div>

        <div className="t2-cases">
          {T2_CASE_GROUPS.map((group) => (
            <TrialCaseCard key={group[0].slug} group={group} />
          ))}
        </div>

        <p className="t2-cases-note">
          Rankings, dates and search terms above are measured directly from the Google Maps grid scans shown.
          Rows marked <em>(est.)</em> are estimates modelled from that ranking change using published local-pack
          click-through rates — not figures reported by the client.
        </p>
        <div className="t2-cta-row">
          <button type="button" className="t2-btn" onClick={openTrialModal}>
            Get Ranked Free
          </button>
        </div>
      </div>
    </section>
  );
};

const TrialMoreLeads = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section className="t2-section">
      <div className="t2-container">
        <div className="t2-section-head">
          <span className="t2-eyebrow">More leads</span>
          <h2 className="t2-h2">More leads. Higher click-through. Lower ad costs.</h2>
        </div>
        <div className="t2-leadcards">
          {leadCards.map((card, i) => (
            <article key={card.title} className={`t2-leadcard${i === 0 ? " t2-leadcard--featured" : ""}`}>
              <img loading="lazy" decoding="async" src={card.image} alt={card.title} />
              <div>
                <h3>{card.title}</h3>
                <div className="t2-leadcard-sub">{card.subtitle}</div>
                <p className="t2-leadcard-desc">{card.description}</p>
                <button type="button" className="t2-btn t2-btn--sm" onClick={openTrialModal}>
                  Get Ranked Free
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrialComparison = () => (
  <section className="t2-section">
    <div className="t2-container">
      <div className="t2-section-head">
        <span className="t2-eyebrow">Comparison</span>
        <h2 className="t2-h2">Standard SEO vs LlamaMaps+</h2>
        <p className="t2-lead t2-center">Our system works around the clock to improve local visibility.</p>
      </div>
      <div className="t2-compare-grid">
        <div className="t2-compare-col">
          <h3>Standard SEO Strategy</h3>
          {comparisonFeatures.map((f) => {
            const missing = traditionalMissing.has(f);
            return (
              <div key={f} className="t2-compare-item">
                <span className={`t2-compare-mark ${missing ? "t2-compare-mark--no" : "t2-compare-mark--yes"}`}>
                  {missing ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                </span>
                {f}
              </div>
            );
          })}
        </div>
        <div className="t2-compare-col t2-compare-col--plus">
          <h3 style={{ display: "flex", alignItems: "center", gap: 10 }}>
            Standard SEO +
            <img src={llamaLogo} alt="LlamaMaps" style={{ height: 30, width: "auto" }} />
          </h3>
          {comparisonFeatures.map((f) => (
            <div key={f} className="t2-compare-item">
              <span className="t2-compare-mark t2-compare-mark--yes">
                <Check className="h-3.5 w-3.5" />
              </span>
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const TrialVideoTestimonials = () => (
  <section className="t2-section">
    <div className="t2-container">
      <div className="t2-section-head">
        <span className="t2-eyebrow">Client reviews</span>
        <h2 className="t2-h2">Hear from real clients</h2>
      </div>
      <div className="t2-videos">
        {videoTestimonials.map((v) => (
          <div key={v.id} className="t2-video-card">
            <div className="t2-video-frame">
              <YouTubeFacade videoId={v.id} title={v.title} poster={v.poster} />
            </div>
            <div className="t2-video-ranks">
              <RankCrossfadeBadge before={v.before} after={v.after} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TrialSteps = () => {
  const { openTrialModal } = useTrialModal();
  const [activeStep, setActiveStep] = useState(0);
  const activeStepContent = onboardingStepDetails[activeStep];

  return (
    <section className="t2-section">
      <div className="t2-container">
        <div className="t2-section-head">
          <span className="t2-eyebrow">How to start</span>
          <h2 className="t2-h2">
            Only <em>4 Simple Steps</em>
          </h2>
          <p className="t2-lead t2-center">
            Start your 7-day free trial with no risk, no lock-in, and a clear step-by-step path to stronger Google
            Maps visibility.
          </p>
        </div>

        <div className="t2-cta-row">
          <button type="button" className="t2-btn t2-btn--sm" onClick={openTrialModal}>
            Get 7-Day Free Trial!
          </button>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.25rem] border border-[var(--t2-border)] bg-[#0d1620] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="grid min-h-[22rem] lg:grid-cols-[0.34fr_0.66fr]">
            <div className="bg-[#0a121b] px-4 py-4 md:px-5 md:py-5">
              <div className="space-y-2.5 md:space-y-3">
                {onboardingSteps.map((step, index) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`group relative flex min-h-[3.8rem] w-full items-center justify-between rounded-xl px-5 py-2.5 text-left text-[0.94rem] font-semibold leading-none transition-colors md:min-h-[4.1rem] md:text-[0.98rem] ${
                      activeStep === index
                        ? "bg-[#8A6A1F] text-white"
                        : "text-[#F4F1EA]/80 hover:bg-white/[0.04] hover:text-[#F4F1EA]"
                    }`}
                  >
                    <span>
                      {index + 1}. {step}
                    </span>
                    {activeStep === index ? (
                      <span className="absolute right-0 flex h-[3.35rem] w-[3.35rem] translate-x-[12%] items-center justify-center rounded-full border-[5px] border-[#0B1420] bg-[#8A6A1F] text-[2rem] font-light text-white md:h-[3.6rem] md:w-[3.6rem]">
                        ›
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111C2B] px-6 py-5 md:px-8 md:py-6"
            >
              <div className="mx-auto max-w-[44rem]">
                <h3
                  className="text-[1.8rem] font-medium leading-[1.15] tracking-[-0.01em] text-[#F4F1EA] md:text-[2.05rem]"
                  style={{ fontFamily: "var(--t2-serif)" }}
                >
                  {activeStepContent.title}
                </h3>
                <p className="mt-3.5 max-w-[40rem] text-[0.95rem] leading-[1.55] text-[#B7C0D0] md:text-[1rem]">
                  {activeStepContent.description}
                </p>

                <div className="mt-5">
                  {activeStepContent.introLabel ? (
                    <p className="mb-2 text-[0.98rem] font-bold text-[#F4F1EA]">{activeStepContent.introLabel}</p>
                  ) : null}

                  <ul className="space-y-2 text-[0.94rem] leading-[1.45] text-[#F4F1EA]/85 md:text-[0.96rem]">
                    {activeStepContent.bullets.map((bullet) => {
                      const [strong, ...restParts] = bullet.split(" - ");
                      const rest = restParts.join(" - ");

                      return (
                        <li key={bullet} className="flex items-start gap-2.5">
                          <span className="mt-[0.1rem] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#C9A24A] text-[0.95rem] font-black leading-none text-[#0B1420]">
                            ✓
                          </span>
                          <span className="pt-[0.05rem]">
                            {rest ? <strong className="font-bold text-[#F4F1EA]">{strong}</strong> : null}
                            {rest ? ` - ${rest}` : bullet}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {activeStepContent.outro ? (
                    <p className="mt-5 text-[0.95rem] leading-[1.55] text-[#B7C0D0] md:text-[0.98rem]">
                      {activeStepContent.outro}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TrialPlans = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section id="plans" className="t2-section">
      <div className="t2-container">
        <div className="t2-section-head">
          <span className="t2-eyebrow">Plans</span>
          <h2 className="t2-h2">Choose your growth plan</h2>
        </div>
        <div className="t2-plans">
          {plans.map((plan) => (
            <article key={plan.name} className={`t2-plan${plan.popular ? " t2-plan--popular" : ""}`}>
              {plan.popular && <span className="t2-plan-popular-tag">Most Popular</span>}
              <span className="t2-plan-badge">{plan.badge}</span>
              <div className="t2-plan-visual">
                <PlanRadiusMap plan={plan.map} />
              </div>
              <h3>{plan.name}</h3>
              <p className="t2-plan-desc">{plan.description}</p>
              <div className="t2-plan-price">
                <span style={{ fontWeight: 700, color: "var(--t2-text)" }}>{plan.radius}</span>
              </div>
              <ul className="t2-plan-included">
                {planFeatureList.map((feature) => {
                  const yes = plan.included.has(feature);
                  return (
                    <li key={feature}>
                      <span className={`t2-plan-check ${yes ? "t2-plan-check--yes" : "t2-plan-check--no"}`}>
                        {yes ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      </span>
                      {feature}
                    </li>
                  );
                })}
              </ul>
              <button type="button" className="t2-btn" onClick={openTrialModal}>
                Start For Free!
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrialFaq = () => (
  <section id="faq" className="t2-section">
    <div className="t2-container">
      <div className="t2-section-head">
        <span className="t2-eyebrow">FAQ</span>
        <h2 className="t2-h2">Frequently Asked Questions</h2>
      </div>
      <div style={{ maxWidth: 780, margin: "44px auto 0", display: "grid", gap: 12 }}>
        {faqs.map((faq) => (
          <details key={faq.question} className="t2-faq-item">
            <summary>
              <span>{faq.question}</span>
              <span className="t2-faq-plus" aria-hidden="true">+</span>
            </summary>
            <p className="t2-faq-answer">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const TrialFinalCta = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section className="t2-section t2-topo">
      <div className="t2-container t2-section-head">
        <h2 className="t2-h2">
          Start your <em>free 7-day trial</em> today
        </h2>
        <p className="t2-lead t2-center">
          No card required. No account access needed. No commitment. See real ranking movement before you pay a
          single euro.
        </p>
        <div className="t2-cta-row">
          <button type="button" className="t2-btn t2-btn--final" onClick={openTrialModal}>
            Get Free Trial <span className="t2-btn-icon"><ArrowRight className="ml-1 h-4 w-4" /></span>
          </button>
          <button type="button" className="t2-btn t2-btn--outline" onClick={openTrialModal}>
            Schedule Time for Meeting
          </button>
        </div>
      </div>
    </section>
  );
};

const TrialPageContent = () => (
  <MotionConfig reducedMotion="user">
    <div className="t2-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <TrialNavbar />
      <main className="t2-main">
        <TrialPartnerStrip />
        <TrialHero />
        <TrialInvisibilitySection />
        <TrialRatingAndReviews />
        <TrialLogosStrip />
        <TrialMission />
        <TrialCaseStudies />
        <TrialMoreLeads />
        <TrialComparison />
        <TrialVideoTestimonials />
        <TrialSteps />
        <TrialPlans />
        <TrialFaq />
        <TrialFinalCta />
        <TrialLogosStrip />
      </main>
      <TrialFooter />
      <TrialFloatingCta />
    </div>
  </MotionConfig>
);

const TrialV2Page = () => {
  useEffect(() => {
    document.body.classList.add("t2-active");
    return () => document.body.classList.remove("t2-active");
  }, []);

  return (
    <>
      <SEO
        title="Free 7-Day Google Maps Trial (V2) | LlamaMaps"
        description="Rank TOP 3 on Google Maps in 90 days. Start your free trial with LlamaMaps, no account access or credit card required."
        noindex
        jsonLd={[organizationSchema(), faqSchema(faqs)]}
      />
      <TrialModalProvider>
        <TrialPageContent />
      </TrialModalProvider>
    </>
  );
};

export default TrialV2Page;

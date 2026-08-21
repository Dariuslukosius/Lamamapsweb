import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { ArrowRight, Check, X, Star } from "lucide-react";

import SEO from "@/components/SEO";
import { organizationSchema, faqSchema } from "@/lib/structuredData";
import TrialNavbar from "@/components/trial/TrialNavbar";
import TrialFooter from "@/components/trial/TrialFooter";
import { TrialModalProvider, useTrialModal } from "@/components/trial/TrialModalContext";
import TrialFloatingCta from "@/components/trial/TrialFloatingCta";
import BeforeAfterSlider from "@/components/trial/BeforeAfterSlider";
import { caseStudies, type CaseStudy } from "@/lib/caseStudies";
import { testimonials, initialsOf } from "@/lib/testimonials";
import RankCounter from "@/components/trial/RankCounter";
import HeroRankClimb from "@/components/trial/HeroRankClimb";
import TrialInvisibilitySection from "@/components/trial/TrialInvisibilitySection";
import CountUpStat from "@/components/trial/CountUpStat";
import RankCrossfadeBadge from "@/components/trial/RankCrossfadeBadge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

import llamaLogo from "@/assets/llama-logo.webp";
import googlePartnerLogo from "@/assets/partners/google-partner-logo-png_seeklogo-428155.webp";


import artfiksa from "@/assets/brands/artfiksa.webp";
import autoVela from "@/assets/brands/auto-vela.webp";
import clinicDpcLogo from "@/assets/brands/clinic-dpc.webp";
import ecoResort from "@/assets/brands/eco-resort.webp";
import eraEsthetic from "@/assets/brands/era-esthetic.webp";
import fastCar from "@/assets/brands/fast-car.webp";
import motoSvajone from "@/assets/brands/moto-svajone.webp";
import royalHorse from "@/assets/brands/royal-horse.webp";
import sokrato from "@/assets/brands/sokrato.webp";
import svajoniuSpaLogo from "@/assets/brands/svajoniu-spa.webp";
import televizoriu from "@/assets/brands/televizoriu.webp";
import wheelshopBrand from "@/assets/brands/wheelshop.webp";

import increaseLocalVisibility from "@/assets/services/increase-local-visibility.webp";
import improveSearchPerformance from "@/assets/services/improve-search-performance.webp";
import noDirectAccess from "@/assets/services/no-direct-access.webp";
import bestResults from "@/assets/services/best-results.webp";

import pricingCommunity from "@/assets/services/pricing-community.webp";
import pricingCity from "@/assets/services/pricing-city.webp";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap');

  .tp-page { overflow-x: hidden; font-family: 'DM Sans', sans-serif; background: var(--tp-bg); color: var(--tp-text); }
  .tp-page {
    --tp-bg: #0B1420;
    --tp-bg-card: #111C2B;
    --tp-text: #F4F1EA;
    --tp-text-muted: #8A93A6;
    --tp-gold: #C9A24A;
    --tp-gold-soft: #DEC584;
    --tp-emerald: #1F4D3D;
    --tp-border: rgba(138, 147, 166, 0.18);
    --tp-border-strong: rgba(138, 147, 166, 0.32);
    --tp-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    --tp-serif: 'Fraunces', serif;
  }
  html { scroll-behavior: smooth; scroll-padding-top: 92px; }
  .tp-container { max-width: 1240px; margin: 0 auto; padding: 0 20px; }
  .tp-main { padding-top: 72px; }

  /* Subtle topographic-contour texture — the only "decorative" background motif,
     tying the visual language back to maps rather than an abstract color blob. */
  .tp-topo {
    background-image: repeating-radial-gradient(circle at 22% 28%, rgba(201,162,74,0.05) 0px, rgba(201,162,74,0.05) 1px, transparent 1px, transparent 42px),
      repeating-radial-gradient(circle at 84% 74%, rgba(138,147,166,0.05) 0px, rgba(138,147,166,0.05) 1px, transparent 1px, transparent 56px);
  }

  .tp-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 52px; border: 0; border-radius: 12px;
    background: var(--tp-gold); color: var(--tp-bg);
    font-size: 0.86rem; font-weight: 700; letter-spacing: 0.03em;
    padding: 0 28px; text-transform: uppercase; text-align: center;
    box-shadow: var(--tp-shadow); cursor: pointer; text-decoration: none;
    transition: background 0.2s ease;
  }
  .tp-btn:hover { background: var(--tp-gold-soft); }
  .tp-btn--sm { min-height: 44px; padding: 0 20px; font-size: 0.78rem; }
  .tp-btn--outline { background: transparent; border: 1px solid var(--tp-border-strong); color: var(--tp-text); box-shadow: none; }
  .tp-btn--outline:hover { background: rgba(244,241,234,0.06); }
  .tp-btn--ghost { background: transparent; border: 1px solid rgba(201,162,74,0.5); color: var(--tp-gold); box-shadow: none; }
  .tp-btn--ghost:hover { background: rgba(201,162,74,0.08); }
  /* Final CTA: the one button on the page with a deliberate, restrained hover
     lift + icon nudge — reserved for the closing conversion moment. */
  .tp-btn--final { transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; }
  .tp-btn--final:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,0,0,0.5); }
  .tp-btn-icon { display: inline-flex; transition: transform 0.2s ease; }
  .tp-btn--final:hover .tp-btn-icon { transform: translateX(3px); }

  /* ── Navbar ── */
  /* position: fixed (not sticky) — .tp-page sets overflow-x: hidden, which forces
     overflow-y to compute as auto and makes it a scroll container; a sticky navbar
     would then stick relative to that box instead of the viewport. */
  .tp-navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(11,20,32,0.94); backdrop-filter: blur(10px); border-bottom: 1px solid var(--tp-border); }
  .tp-navbar-inner { max-width: 1240px; margin: 0 auto; padding: 0 20px; height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .tp-navbar-logo img { height: 34px; width: auto; display: block; }
  .tp-navbar-links { display: none; align-items: center; gap: 24px; margin-left: auto; }
  .tp-navbar-link { color: var(--tp-text); font-size: 0.88rem; font-weight: 500; text-decoration: none; white-space: nowrap; }
  .tp-navbar-link:hover { color: var(--tp-gold); }
  .tp-navbar-cta { display: none; align-items: center; justify-content: center; line-height: 1; min-height: 40px; border: 0; border-radius: 10px; background: var(--tp-gold); color: var(--tp-bg); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; padding: 0 18px; cursor: pointer; white-space: nowrap; }
  .tp-navbar-cta:hover { background: var(--tp-gold-soft); }
  .tp-navbar-toggle { display: inline-flex; border: 0; background: transparent; color: var(--tp-text); cursor: pointer; padding: 6px; }
  .tp-navbar-mobile { border-top: 1px solid var(--tp-border); background: var(--tp-bg); padding: 10px 20px 18px; display: grid; gap: 4px; }
  .tp-navbar-mobile-link { padding: 10px 4px; color: var(--tp-text); font-weight: 500; text-decoration: none; font-size: 0.94rem; }
  .tp-navbar-mobile-cta { display: flex; align-items: center; justify-content: center; line-height: 1; margin-top: 8px; min-height: 48px; border: 0; border-radius: 10px; background: var(--tp-gold); color: var(--tp-bg); font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; font-size: 0.8rem; cursor: pointer; }

  @media (min-width: 900px) {
    .tp-navbar-links { display: flex; }
    .tp-navbar-cta { display: inline-flex; }
    .tp-navbar-toggle { display: none; }
  }

  /* ── Hero ── */
  .tp-hero { position: relative; padding: 64px 0 56px; overflow: hidden; isolation: isolate; background: var(--tp-bg); }
  /* A small white tab hanging just below the navbar — white background because
     the Google Partner badge asset renders its "Google Partner" wordmark in dark
     grey, which needs a light backdrop to stay legible. */
  .tp-partner-wrap { display: flex; justify-content: center; }
  .tp-partner-strip {
    display: inline-flex; align-items: center; justify-content: center;
    background: #fff; border-radius: 0 0 14px 14px;
    padding: 6px 18px 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.28);
  }
  .tp-partner-strip img { height: 42px; width: auto; display: block; }
  .tp-hero-inner { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .tp-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(201,162,74,0.4); border-radius: 999px;
    background: rgba(201,162,74,0.08); color: var(--tp-gold); font-size: 0.8rem; font-weight: 700;
    padding: 8px 16px;
  }
  .tp-hero-eyebrow { display: block; margin-top: 24px; color: var(--tp-text-muted); font-size: 1rem; font-weight: 500; letter-spacing: 0.01em; }
  .tp-hero-h1 { margin-top: 10px; color: var(--tp-text); font-family: var(--tp-serif); font-size: clamp(2.2rem, 6vw, 4.2rem); font-weight: 400; letter-spacing: -0.01em; line-height: 1.12; max-width: 920px; }
  .tp-hero-h1 em { font-style: normal; font-weight: 600; color: var(--tp-gold); }
  .tp-hero-sub { margin-top: 20px; color: var(--tp-text-muted); font-size: 1.06rem; line-height: 1.75; max-width: 640px; }
  .tp-hero-rating { margin-top: 26px; }
  .tp-hero-rating .tp-rating-num { color: var(--tp-text); }
  .tp-hero-rating .tp-rating-count { color: var(--tp-text-muted); }
  .tp-hero-actions { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
  .tp-hero-actions .tp-btn { min-height: 54px; font-size: 0.88rem; }
  .tp-hero-video-wrap { margin-top: 40px; width: 100%; max-width: 640px; border-radius: 20px; border: 1px solid var(--tp-border); background: var(--tp-bg-card); box-shadow: var(--tp-shadow); padding: 10px; }
  .tp-hero-video-inner { position: relative; border-radius: 14px; overflow: hidden; background: #0d1520; }

  /* ── Hero rank-climb placeholder — "finding" concept: a business row climbs
     from a low position to the top of the results, holds, then loops. Base
     state already shows it arrived at the top; the climb is added motion. ── */
  .tp-rankclimb { padding: 22px 20px 24px; }
  /* A map-panel label instead of a search bar — Hero reads as "your live map
     position", the Invisibility section below owns the literal search-bar
     visual, so the two placeholders don't look like duplicates of each other. */
  .tp-rankclimb-label {
    display: flex; align-items: center; gap: 8px;
    color: var(--tp-gold); font-size: 0.76rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 16px;
  }
  .tp-rankclimb-list { position: relative; min-height: 252px; }
  .tp-rankclimb-row, .tp-rankclimb-you {
    display: flex; align-items: center; gap: 12px;
    height: 44px; border-radius: 10px; padding: 0 14px; margin-bottom: 8px;
    font-size: 0.82rem;
  }
  .tp-rankclimb-row { background: var(--tp-bg-card); color: var(--tp-text-muted); }
  .tp-rankclimb-row-rank {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 999px; flex-shrink: 0;
    background: rgba(138,147,166,0.16); color: var(--tp-text-muted);
    font-size: 0.72rem; font-weight: 700;
  }
  .tp-rankclimb-row-rank--you { background: var(--tp-gold); color: var(--tp-bg); }
  /* Solid, fully opaque background — this row is absolutely positioned directly
     on top of the static rows below while it "climbs", and a semi-transparent
     fill let their text show through and garble together mid-transition. */
  .tp-rankclimb-you {
    position: absolute; left: 0; right: 0; top: 0;
    background: #1c1710; border: 1px solid rgba(201,162,74,0.5);
    color: var(--tp-gold); font-weight: 700; z-index: 2;
  }
  @media (prefers-reduced-motion: no-preference) {
    .tp-rankclimb-you { animation: tpRankClimb 7s ease-in-out infinite; }
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
     .tp-page's overflow-x:hidden cannot clip it, because its containing
     block is outside .tp-page. That made the whole page scroll sideways. */
  .tp-invisible-demo { max-width: 460px; margin: 44px auto 0; position: relative; }
  .tp-invisible-search { display: flex; align-items: center; gap: 10px; background: var(--tp-bg-card); border: 1px solid var(--tp-border); border-radius: 10px; padding: 12px 16px; }
  .tp-invisible-search-text { color: var(--tp-text-muted); font-size: 0.88rem; }
  .tp-invisible-list { position: relative; margin-top: 16px; }
  .tp-invisible-row {
    display: flex; align-items: center; gap: 12px;
    background: var(--tp-bg-card); border: 1px solid var(--tp-border);
    border-radius: 10px; padding: 12px 16px; margin-bottom: 8px;
    color: var(--tp-text); font-size: 0.86rem;
  }
  .tp-invisible-row-rank {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 999px; flex-shrink: 0;
    background: rgba(138,147,166,0.16); color: var(--tp-text-muted);
    font-size: 0.72rem; font-weight: 700;
  }
  .tp-invisible-ellipsis { text-align: center; color: var(--tp-text-muted); padding: 4px 0; letter-spacing: 0.2em; }
  .tp-invisible-row--you { opacity: 0.6; border-style: dashed; }
  .tp-invisible-scrolltrack { position: absolute; right: -18px; top: 0; bottom: 0; width: 3px; background: rgba(138,147,166,0.14); border-radius: 999px; }
  .tp-invisible-scrollthumb { position: absolute; left: 0; right: 0; top: 0; height: 15%; background: var(--tp-border-strong); border-radius: 999px; }

  @media (prefers-reduced-motion: no-preference) {
    .tp-invisible-search-text {
      display: inline-block; overflow: hidden; white-space: nowrap; width: 0;
      border-right: 2px solid transparent;
    }
    .tp-invisible-demo.is-active .tp-invisible-search-text {
      animation: tpTypeText 1.1s steps(16, end) 0.2s forwards, tpCaretBlink 0.8s step-end 0.2s 3;
    }
    .tp-invisible-row { opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .tp-invisible-demo.is-active .tp-invisible-row { opacity: 1; transform: translateY(0); }
    .tp-invisible-demo.is-active .tp-invisible-row--you { opacity: 0.6; }
    .tp-invisible-scrollthumb { top: -15%; }
    .tp-invisible-demo.is-active .tp-invisible-scrollthumb {
      animation: tpScrollPast 2.2s linear 1.6s forwards;
    }
  }
  @keyframes tpTypeText { from { width: 0; } to { width: 16.5ch; } }
  @keyframes tpCaretBlink { 50% { border-color: var(--tp-text-muted); } }
  @keyframes tpScrollPast { from { top: -15%; } to { top: 100%; } }

  /* ── Signature rank counter (the one place a gradient + glow are allowed) ── */
  .tp-rank-counter { display: inline-flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 30px; }
  .tp-rank-counter-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--tp-text-muted); }
  .tp-rank-counter-display {
    display: inline-flex; align-items: baseline; gap: 2px;
    padding: 10px 30px; border-radius: 18px;
    background: linear-gradient(135deg, rgba(201,162,74,0.12), rgba(31,77,61,0.28));
    border: 1px solid rgba(201,162,74,0.38);
  }
  .tp-rank-counter-hash { font-family: var(--tp-serif); font-size: 1.7rem; color: var(--tp-gold); opacity: 0.75; }
  .tp-rank-counter-num {
    font-family: var(--tp-serif); font-size: 3.4rem; font-weight: 600; line-height: 1;
    background: linear-gradient(135deg, #C9A24A 0%, #E7CF8E 45%, #3d8267 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    text-shadow: 0 0 34px rgba(201,162,74,0.3);
  }

  /* ── Sections ── */
  /* 56px/side = ~112px combined between two adjacent full sections — generous
     enough to read as deliberate breathing room without the ~240px combined
     gap the previous 96/120px-per-side values produced once actually rendered. */
  .tp-section { padding: 56px 0; }
  .tp-section--sm { padding: 40px 0; }
  .tp-eyebrow { display: inline-block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--tp-gold); margin-bottom: 16px; }
  .tp-h2 { color: var(--tp-text); font-family: var(--tp-serif); font-size: clamp(1.9rem, 4.6vw, 2.8rem); font-weight: 400; letter-spacing: -0.01em; line-height: 1.16; }
  .tp-h2 em { font-style: normal; font-weight: 600; color: var(--tp-gold); }
  .tp-lead { margin-top: 16px; color: var(--tp-text-muted); font-size: 1.02rem; line-height: 1.8; max-width: 680px; }
  .tp-center { text-align: center; margin-left: auto; margin-right: auto; }
  .tp-cta-row { display: flex; justify-content: center; margin-top: 32px; gap: 14px; flex-wrap: wrap; }

  @media (min-width: 900px) {
    .tp-section { padding: 72px 0; }
    /* Pinned separately here too — without this, this same-specificity rule
       above (later in source, same 900px breakpoint) silently wins over the
       standalone .tp-section--sm rule and re-inflates "small" sections back
       to full size on desktop, stacking with the adjacent section's own
       padding into a much bigger gap than intended. */
    .tp-section--sm { padding: 40px 0; }
  }

  /* ── Rating ── */
  .tp-rating { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .tp-rating-stars { display: flex; gap: 3px; color: var(--tp-gold); }
  .tp-rating-num { font-size: 1.5rem; font-weight: 700; color: var(--tp-text); }
  .tp-rating-count { color: var(--tp-text-muted); font-size: 0.94rem; }

  /* ── Testimonial carousel ── */
  .tp-testimonial-card { border: 1px solid var(--tp-border); border-radius: 16px; background: var(--tp-bg-card); box-shadow: var(--tp-shadow); padding: 28px 24px; height: 100%; }
  @media (max-width: 640px) {
    /* One card is visible at a time here, so equal heights buy nothing and
       cost a lot: every card stretched to match the longest review, leaving
       ~400px of empty card under the short ones. Size to content instead. */
    .tp-testimonial-card { height: auto; }
  }
  .tp-testimonial-head { display: flex; align-items: center; gap: 12px; }
  .tp-testimonial-avatar { width: 52px; height: 52px; border-radius: 999px; object-fit: cover; flex-shrink: 0; }
  /* For clients who left a written review but no photo or logo. Initials rather
     than a stock portrait: a stand-in face beside a real person's name would
     misrepresent them. */
  .tp-testimonial-avatar--initials {
    display: flex; align-items: center; justify-content: center;
    background: var(--tp-bg); border: 1px solid var(--tp-border);
    color: var(--tp-gold); font-size: 0.95rem; font-weight: 700; letter-spacing: 0.02em;
  }
  .tp-testimonial-name { font-weight: 600; color: var(--tp-text-muted); font-size: 0.88rem; }
  .tp-testimonial-company { color: var(--tp-gold); font-size: 0.78rem; font-weight: 600; }
  /* The quote is the point of a testimonial — give it more visual weight than
     the attribution underneath it, not the other way around. */
  .tp-testimonial-text { margin-top: 16px; color: var(--tp-text); font-size: 1.05rem; font-weight: 500; line-height: 1.7; }

  /* ── Logos strip ── */
  .tp-logos-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 32px 48px; }
  .tp-logos-row img { height: 42px; width: auto; object-fit: contain; filter: grayscale(1) brightness(0) invert(1); opacity: 0.8; }

  /* ── Mission ── */
  /* Asymmetric on purpose: the lead stat gets full card treatment (border,
     background, double width) and a bigger, slower count; the other three
     sit as plain, unboxed numbers so they read as supporting context rather
     than four identical tiles. */
  .tp-mission-stats { display: grid; gap: 16px 24px; grid-template-columns: repeat(2, minmax(0,1fr)); margin-top: 40px; }
  .tp-mission-stat { padding: 6px 4px; }
  .tp-mission-stat-num { font-family: var(--tp-serif); font-size: 2rem; font-weight: 600; color: var(--tp-gold); line-height: 1; }
  .tp-mission-stat-label { margin-top: 10px; color: var(--tp-text-muted); font-size: 0.88rem; line-height: 1.5; }
  .tp-mission-stat--featured {
    grid-column: span 2; border-radius: 16px; background: var(--tp-bg-card);
    border: 1px solid var(--tp-border); padding: 28px 22px;
  }
  .tp-mission-stat--featured .tp-mission-stat-num { font-size: 3.6rem; }
  .tp-mission-stat--featured .tp-mission-stat-label { font-size: 0.92rem; }

  /* ── Case studies ── */
  .tp-cases { display: grid; gap: 24px; margin-top: 48px; }
  .tp-case { display: grid; gap: 24px; border: 1px solid var(--tp-border); border-radius: 20px; background: var(--tp-bg-card); box-shadow: var(--tp-shadow); padding: 28px; }
  .tp-case-head { display: flex; align-items: center; gap: 12px; }
  .tp-case-logo { width: 50px; height: 50px; border-radius: 12px; border: 1px solid var(--tp-border); background: #fff; object-fit: contain; padding: 7px; flex-shrink: 0; }
  /* Stands in for a client logo — we hold no logo assets for these businesses,
     and a glyph is honest about being decoration in a way a stock mark is not. */
  .tp-case-icon {
    width: 50px; height: 50px; border-radius: 12px; flex-shrink: 0;
    background: var(--tp-bg); border: 1px solid var(--tp-border);
    display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
  }
  .tp-case-head h3 { color: var(--tp-text); font-size: 1.1rem; font-weight: 700; }
  .tp-case-head p { color: var(--tp-gold); font-size: 0.82rem; font-weight: 600; margin-top: 2px; }
  .tp-case-metrics { display: grid; gap: 8px; margin-top: 20px; }
  .tp-case-metric { display: flex; align-items: center; justify-content: space-between; gap: 10px; border-radius: 10px; background: rgba(244,241,234,0.03); border: 1px solid var(--tp-border); padding: 10px 14px; }
  /* Phrase-length values (the tracked search term) stack under their label —
     opposite it they collide in this narrow column and wrap mid-phrase. */
  .tp-case-metric--stack { flex-direction: column; align-items: flex-start; gap: 4px; }
  .tp-case-metric--stack .tp-case-metric-val { font-size: 0.92rem; line-height: 1.4; }
  .tp-case-metric-val { color: var(--tp-gold); font-size: 1rem; font-weight: 700; }
  .tp-case-metric-label { color: var(--tp-text-muted); font-size: 0.78rem; }


  /* ── Before/after slider ── */
  .tp-baf-labels { display: flex; justify-content: space-between; margin-bottom: 8px; gap: 8px; }
  .tp-baf-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; padding: 5px 10px; border-radius: 999px; }
  .tp-baf-label--before { background: rgba(138,147,166,0.14); color: var(--tp-text-muted); }
  .tp-baf-label--after { background: rgba(201,162,74,0.14); color: var(--tp-gold); }
  /* Fixed aspect-ratio box, with BOTH before/after images object-fit: cover'd into
     it the same way — using one image's natural size to define the box (and only
     force-fitting the other) made mismatched-resolution before/after screenshot
     pairs visibly jump in scale right at the seam.
     800/743 is the exact pixel ratio of the rank-scan frames after their date
     header is cropped off. Matching it means object-fit: cover has nothing to crop,
     so the grid's outermost ranking bubbles stay inside the frame — at 1/1 the
     box ate ~7% of the width and clipped the edge columns. */
  .tp-baf-frame { position: relative; overflow: hidden; border-radius: 14px; border: 1px solid var(--tp-border); background: #0d1520; max-width: 460px; margin: 0 auto; aspect-ratio: 800 / 743; touch-action: none; cursor: ew-resize; }
  .tp-baf-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
  .tp-baf-clip { position: absolute; inset: 0; overflow: hidden; }
  .tp-baf-line { position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(244,241,234,0.85); transform: translateX(-50%); pointer-events: none; z-index: 2; }
  .tp-baf-handle { position: absolute; top: 50%; transform: translate(-50%, -50%); z-index: 3; display: flex; align-items: center; gap: 4px; background: var(--tp-text); color: var(--tp-bg); border-radius: 999px; padding: 8px 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.35); pointer-events: none; }
  .tp-baf-handle-arrow { font-size: 0.85rem; font-weight: 700; line-height: 1; }

  /* ── More Leads cards ── */
  .tp-leadcards { display: grid; gap: 20px; margin-top: 44px; }
  .tp-leadcard { display: grid; gap: 24px; border: 1px solid var(--tp-border); border-radius: 18px; background: var(--tp-bg-card); box-shadow: var(--tp-shadow); padding: 24px; align-items: center; }
  .tp-leadcard img { width: 100%; border-radius: 12px; display: block; }
  .tp-leadcard h3 { color: var(--tp-text); font-size: 1.18rem; font-weight: 700; }
  .tp-leadcard-sub { color: var(--tp-gold); font-size: 0.82rem; font-weight: 600; margin-top: 4px; }
  .tp-leadcard p.tp-leadcard-desc { margin-top: 12px; color: var(--tp-text-muted); font-size: 0.94rem; line-height: 1.7; }
  .tp-leadcard .tp-btn { margin-top: 18px; }
  /* Lead card in the set gets more visual weight — bigger padding, border, and
     type — so the four cards don't read as four identical repeats. */
  .tp-leadcard--featured { padding: 32px; border-color: rgba(201,162,74,0.4); }
  .tp-leadcard--featured h3 { font-size: 1.4rem; }
  .tp-leadcard--featured p.tp-leadcard-desc { font-size: 1rem; }

  /* ── Comparison ── */
  .tp-compare-grid { display: grid; gap: 20px; margin-top: 44px; }
  .tp-compare-col { border-radius: 18px; padding: 28px 24px; border: 1px solid var(--tp-border); background: var(--tp-bg-card); }
  .tp-compare-col--plus { border-color: rgba(201,162,74,0.4); }
  .tp-compare-col h3 { color: var(--tp-text); font-size: 1.2rem; font-weight: 700; margin-bottom: 22px; }
  .tp-compare-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; color: var(--tp-text); font-size: 0.92rem; font-weight: 500; }
  .tp-compare-mark { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 999px; flex-shrink: 0; }
  .tp-compare-mark--yes { background: var(--tp-gold); color: var(--tp-bg); }
  .tp-compare-mark--no { background: rgba(138,147,166,0.18); color: var(--tp-text-muted); }

  /* ── Video testimonials ── */
  .tp-videos { display: grid; gap: 18px; margin-top: 44px; grid-template-columns: repeat(2, minmax(0,1fr)); }
  .tp-video-card { border-radius: 16px; border: 1px solid var(--tp-border); background: var(--tp-bg-card); box-shadow: var(--tp-shadow); padding: 8px; }
  .tp-video-frame { position: relative; width: 100%; padding-bottom: 177.78%; border-radius: 10px; overflow: hidden; background: #000; }
  .tp-video-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  .tp-video-ranks { margin-top: 10px; padding: 0 4px 4px; }
  /* Crossfades between Before/After on hover (desktop) or tap (mobile) rather
     than showing both at once — a small "transformation" moment tied to the
     viewer's own interaction. */
  .tp-rank-crossfade { position: relative; display: block; width: 100%; height: 38px; border: 0; border-radius: 8px; background: rgba(244,241,234,0.04); cursor: pointer; overflow: hidden; padding: 0; }
  .tp-rank-crossfade-face {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; color: var(--tp-text-muted); opacity: 0;
    transition: opacity 0.35s ease;
  }
  .tp-rank-crossfade-face.is-visible { opacity: 1; }
  .tp-rank-crossfade-face--after { color: var(--tp-gold); }

  /* ── Plans ── */
  .tp-plans { display: grid; gap: 22px; margin-top: 48px; }
  .tp-plan { position: relative; border-radius: 20px; border: 1px solid var(--tp-border); background: var(--tp-bg-card); box-shadow: var(--tp-shadow); padding: 32px 26px; display: flex; flex-direction: column; }
  .tp-plan--popular { border-color: var(--tp-gold); }
  .tp-plan-popular-tag { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--tp-gold); color: var(--tp-bg); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 7px 16px; border-radius: 999px; }
  .tp-plan-badge { display: inline-block; align-self: flex-start; background: rgba(201,162,74,0.12); color: var(--tp-gold); font-size: 0.72rem; font-weight: 700; padding: 7px 12px; border-radius: 999px; margin-bottom: 18px; }
  .tp-plan-visual { border-radius: 14px; overflow: hidden; margin-bottom: 18px; }
  .tp-plan-visual img { width: 100%; display: block; }
  .tp-plan h3 { color: var(--tp-text); font-family: var(--tp-serif); font-size: 1.5rem; font-weight: 500; }
  .tp-plan-desc { margin-top: 8px; color: var(--tp-text-muted); font-size: 0.9rem; line-height: 1.65; min-height: 84px; }
  .tp-plan-price { margin-top: 14px; }
  .tp-plan-included { list-style: none; margin: 18px 0 0; padding: 0; display: grid; gap: 10px; flex: 1; }
  .tp-plan-included li { display: flex; align-items: center; gap: 10px; font-size: 0.88rem; color: var(--tp-text); font-weight: 500; }
  .tp-plan-check { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 999px; flex-shrink: 0; }
  .tp-plan-check--yes { background: var(--tp-gold); color: var(--tp-bg); }
  .tp-plan-check--no { background: rgba(138,147,166,0.16); color: var(--tp-text-muted); }
  .tp-plan .tp-btn { margin-top: 24px; width: 100%; }

  /* ── FAQ ── */
  .tp-faq-item { border-radius: 14px; border: 1px solid var(--tp-border); background: var(--tp-bg-card); padding: 20px 22px; }
  .tp-faq-item summary { cursor: pointer; list-style: none; font-weight: 600; color: var(--tp-text); display: flex; justify-content: space-between; gap: 16px; }
  .tp-faq-item summary::-webkit-details-marker { display: none; }
  .tp-faq-plus { color: var(--tp-gold); font-size: 1.2rem; line-height: 1; }
  .tp-faq-answer { margin-top: 14px; color: var(--tp-text-muted); font-size: 0.94rem; line-height: 1.75; }

  @media (min-width: 700px) {
    .tp-mission-stats { grid-template-columns: repeat(4, minmax(0,1fr)); }
    .tp-videos { grid-template-columns: repeat(4, minmax(0,1fr)); }
    .tp-compare-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .tp-plans { grid-template-columns: repeat(2, minmax(0,1fr)); align-items: stretch; }
  }
  @media (min-width: 860px) {
    .tp-case { grid-template-columns: 280px minmax(0,1fr); align-items: center; }
    .tp-leadcard { grid-template-columns: 220px minmax(0,1fr); }
    .tp-leadcard:nth-child(even) { direction: rtl; }
    .tp-leadcard:nth-child(even) > * { direction: ltr; }
    .tp-leadcard--featured { grid-template-columns: 280px minmax(0,1fr); }
  }

  /* ── Footer ── */
  .tp-footer { border-top: 1px solid var(--tp-border); padding: 56px 0 32px; }
  .tp-footer-inner { max-width: 1240px; margin: 0 auto; padding: 0 20px; display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; }
  .tp-footer-logo img { height: 30px; width: auto; }
  .tp-footer-tagline { color: var(--tp-text); font-size: 1.2rem; font-weight: 600; letter-spacing: -0.01em; max-width: 520px; line-height: 1.4; }
  .tp-footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
  .tp-footer-links a { color: var(--tp-text-muted); font-size: 0.88rem; font-weight: 500; text-decoration: none; }
  .tp-footer-links a:hover { color: var(--tp-gold); }
  .tp-footer-bottom { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 8px; padding-top: 28px; border-top: 1px solid var(--tp-border); width: 100%; }
  .tp-footer-socials { display: flex; gap: 16px; }
  .tp-footer-socials a { color: var(--tp-text-muted); }
  .tp-footer-socials a:hover { color: var(--tp-gold); }
  .tp-footer-copy { color: var(--tp-text-muted); font-size: 0.8rem; }

  /* ── Floating CTA ── */
  .tp-floating-cta {
    position: fixed; right: 20px; bottom: 20px; z-index: 90;
    display: inline-flex; align-items: center; justify-content: center; line-height: 1;
    min-height: 50px; border: 0; border-radius: 999px;
    background: var(--tp-gold); color: var(--tp-bg);
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.02em;
    padding: 0 22px; cursor: pointer; box-shadow: var(--tp-shadow);
    opacity: 0; transform: translateY(8px); pointer-events: none;
    transition: background 0.2s ease, opacity 0.25s ease, transform 0.25s ease;
  }
  /* Applied once the hero (and the primary CTA it contains) leaves the
     viewport, so the pill can never sit on top of that button. */
  .tp-floating-cta--in { opacity: 1; transform: none; pointer-events: auto; }
  .tp-floating-cta:hover { background: var(--tp-gold-soft); }
  @media (max-width: 640px) {
    .tp-floating-cta { right: 14px; bottom: 14px; font-size: 0.74rem; padding: 0 16px; min-height: 46px; }
  }

  @media (min-width: 700px) {
    .tp-footer-bottom { flex-direction: row; justify-content: space-between; }
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
  { id: "-8SFE-Pbm9g", title: "Auto Repair Shop Testimonial", before: "Not found", after: "Top 3" },
  { id: "Mlt9xpYy00w", title: "Online Movers and Storage", before: "Not ranked", after: "Top 3" },
  { id: "hp_UzmzN9cU", title: "Physiotherapy Clinic Testimonial", before: "Rank 14", after: "Top 3" },
  { id: "z7HUliWQ_NU", title: "Dental Clinic Testimonial", before: "Rank 9", after: "Rank 1" },
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
    image: pricingCommunity,
    description: "Perfect for local shops and service businesses that want better Google Maps visibility.",
    radius: "2.5-mile radius · 10 keywords · 10–20 direction signals/day",
    popular: false,
    included: communityIncluded,
  },
  {
    name: "City",
    badge: "Top 3 on Google Maps in 90 Days",
    image: pricingCity,
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
  <div className="tp-partner-wrap">
    <div className="tp-partner-strip">
      <img src={googlePartnerLogo} alt="Google Partner" />
    </div>
  </div>
);

const TrialHero = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section id="tp-home" className="tp-hero tp-topo">
      <div className="tp-container tp-hero-inner">
        <span className="tp-hero-badge">Top 3 Google Maps in 90 Days</span>
        <span className="tp-hero-eyebrow">Clinic &amp; Local Business Owners:</span>
        <h1 className="tp-hero-h1">
          Rank <em>TOP 3 on Google Maps</em> in 90 Days
        </h1>
        <p className="tp-hero-sub">
          No paid ads. No outdated SEO tricks. No relying on word of mouth. Just a proven system that pushes your
          Google Maps ranking up — starting with a completely free 7-day trial.
        </p>

        <RankCounter />

        {/* TODO: update rating and review count with real data */}
        <div className="tp-rating tp-hero-rating">
          <div className="tp-rating-stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-5 w-5" fill="#C9A24A" stroke="#C9A24A" />
            ))}
          </div>
          <span className="tp-rating-num">4.8</span>
          <span className="tp-rating-count">from 45 reviews</span>
        </div>

        <div className="tp-hero-actions">
          <button type="button" className="tp-btn" onClick={openTrialModal}>
            Get Ranked Free
          </button>
          <button type="button" className="tp-btn tp-btn--outline" onClick={openTrialModal}>
            Schedule Time for Meeting
          </button>
        </div>

        <div className="tp-hero-video-wrap">
          {/* TODO: replace with real product demo video loop when ready — structure/player must match manvimedia's autoplay + sound-toggle behavior */}
          <div className="tp-hero-video-inner">
            <HeroRankClimb />
          </div>
        </div>
      </div>
    </section>
  );
};

const TrialRatingAndReviews = () => (
  <section id="reviews" className="tp-section tp-section--sm">
    <div className="tp-container">
      {/* TODO: update rating and review count with real data */}
      <div className="tp-rating">
        <div className="tp-rating-stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-6 w-6" fill="#C9A24A" stroke="#C9A24A" />
          ))}
        </div>
        <span className="tp-rating-num">4.8</span>
        <span className="tp-rating-count">out of 45 reviews</span>
      </div>

      <div className="tp-center" style={{ marginTop: 48 }}>
        <span className="tp-eyebrow">Client reviews</span>
        <h2 className="tp-h2">What local businesses say</h2>
      </div>

      <div style={{ marginTop: 44 }}>
        <Carousel opts={{ align: "start" }}>
          <CarouselContent>
            {testimonials.map((t, i) => (
              <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3">
                <motion.div
                  className="tp-testimonial-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                >
                  <div className="tp-testimonial-head">
                    {t.avatar ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        className="tp-testimonial-avatar"
                        style={t.avatarFit === "contain" ? { objectFit: "contain", padding: 8, background: "#fff" } : undefined}
                        src={t.avatar}
                        alt={t.name}
                      />
                    ) : (
                      <div className="tp-testimonial-avatar tp-testimonial-avatar--initials" aria-hidden="true">
                        {initialsOf(t.name)}
                      </div>
                    )}
                    <div>
                      <div className="tp-testimonial-name">{t.name}</div>
                      <div className="tp-testimonial-company">{t.company}</div>
                    </div>
                  </div>
                  <p className="tp-testimonial-text">&ldquo;{t.text}&rdquo;</p>
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

const TrialLogosStrip = () => (
  <section className="tp-section--sm">
    <div className="tp-container">
      {/* TODO: replace with international/UK+Dubai client logos when available */}
      <div className="tp-logos-row">
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
    <section className="tp-section">
      <div className="tp-container tp-center" style={{ maxWidth: 760 }}>
        <span className="tp-eyebrow">Our mission</span>
        <h2 className="tp-h2">
          We believe every local business deserves to be <em>found first</em>
        </h2>
        <p className="tp-lead tp-center">
          Being on page one isn't enough when customers only look at the map. Our mission is to put local business
          owners in front of ready-to-buy customers the moment they search — without ad spend, without shortcuts, and
          without waiting years for organic SEO to catch up.
        </p>
        <div className="tp-mission-stats">
          {missionStats.map((s, i) => (
            <div key={s.label} className={`tp-mission-stat${i === 0 ? " tp-mission-stat--featured" : ""}`}>
              <div className="tp-mission-stat-num">
                <CountUpStat value={s.value} duration={i === 0 ? 1800 : 1200} />
              </div>
              <div className="tp-mission-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="tp-cta-row">
          <button type="button" className="tp-btn" onClick={openTrialModal}>
            Start Your Free 7-Day Trial
          </button>
          <button type="button" className="tp-btn tp-btn--ghost" onClick={openTrialModal}>
            Schedule Time for Meeting
          </button>
        </div>
      </div>
    </section>
  );
};

const TrialCaseCard = ({ study }: { study: CaseStudy }) => (
  <article className="tp-case">
    <div>
      <div className="tp-case-head">
        <div className="tp-case-icon" aria-hidden="true">{study.icon}</div>
        <div>
          <h3>{study.business}</h3>
          <p>{study.location}</p>
        </div>
      </div>
      <div className="tp-case-metrics">
        {study.metrics.map((m) => (
          <div key={m.label} className={`tp-case-metric${m.stack ? " tp-case-metric--stack" : ""}`}>
            <span className="tp-case-metric-label">{m.label}</span>
            <span className="tp-case-metric-val">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
    <BeforeAfterSlider
      before={study.before}
      after={study.after}
      beforeLabel={study.beforeLabel}
      afterLabel={study.afterLabel}
    />
  </article>
);

const TrialCaseStudies = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section id="case-studies" className="tp-section">
      <div className="tp-container">
        <div className="tp-center" style={{ maxWidth: 720 }}>
          <span className="tp-eyebrow">Real results</span>
          <h2 className="tp-h2">
            How local businesses <em>grew</em> on Google Maps
          </h2>
          <p className="tp-lead tp-center">
            Eleven real clients across five countries, seventeen before/after maps — metalwork in West Sussex, hail repair in Texas, removals on the
            Sunshine Coast. Drag the handle to see the same map before and after.
          </p>
        </div>

        <div className="tp-cases">
          {caseStudies.map((c) => (
            <TrialCaseCard key={c.slug} study={c} />
          ))}
        </div>

        <div className="tp-cta-row">
          <button type="button" className="tp-btn" onClick={openTrialModal}>
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
    <section className="tp-section">
      <div className="tp-container">
        <div className="tp-center" style={{ maxWidth: 720 }}>
          <span className="tp-eyebrow">More leads</span>
          <h2 className="tp-h2">More leads. Higher click-through. Lower ad costs.</h2>
        </div>
        <div className="tp-leadcards">
          {leadCards.map((card, i) => (
            <article key={card.title} className={`tp-leadcard${i === 0 ? " tp-leadcard--featured" : ""}`}>
              <img loading="lazy" decoding="async" src={card.image} alt={card.title} />
              <div>
                <h3>{card.title}</h3>
                <div className="tp-leadcard-sub">{card.subtitle}</div>
                <p className="tp-leadcard-desc">{card.description}</p>
                <button type="button" className="tp-btn tp-btn--sm" onClick={openTrialModal}>
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
  <section className="tp-section">
    <div className="tp-container">
      <div className="tp-center" style={{ maxWidth: 720 }}>
        <span className="tp-eyebrow">Comparison</span>
        <h2 className="tp-h2">Standard SEO vs LlamaMaps+</h2>
        <p className="tp-lead tp-center">Our system works around the clock to improve local visibility.</p>
      </div>
      <div className="tp-compare-grid">
        <div className="tp-compare-col">
          <h3>Standard SEO Strategy</h3>
          {comparisonFeatures.map((f) => {
            const missing = traditionalMissing.has(f);
            return (
              <div key={f} className="tp-compare-item">
                <span className={`tp-compare-mark ${missing ? "tp-compare-mark--no" : "tp-compare-mark--yes"}`}>
                  {missing ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                </span>
                {f}
              </div>
            );
          })}
        </div>
        <div className="tp-compare-col tp-compare-col--plus">
          <h3 style={{ display: "flex", alignItems: "center", gap: 10 }}>
            Standard SEO +
            <img src={llamaLogo} alt="LlamaMaps" style={{ height: 30, width: "auto" }} />
          </h3>
          {comparisonFeatures.map((f) => (
            <div key={f} className="tp-compare-item">
              <span className="tp-compare-mark tp-compare-mark--yes">
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
  <section className="tp-section">
    <div className="tp-container">
      <div className="tp-center" style={{ maxWidth: 720 }}>
        <span className="tp-eyebrow">Client reviews</span>
        <h2 className="tp-h2">Hear from real clients</h2>
      </div>
      <div className="tp-videos">
        {videoTestimonials.map((v) => (
          <div key={v.id} className="tp-video-card">
            <div className="tp-video-frame">
              <iframe
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="tp-video-ranks">
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
    <section className="tp-section">
      <div className="tp-container">
        <div className="tp-center" style={{ maxWidth: 720 }}>
          <span className="tp-eyebrow">How to start</span>
          <h2 className="tp-h2">
            Only <em>4 Simple Steps</em>
          </h2>
          <p className="tp-lead tp-center">
            Start your 7-day free trial with no risk, no lock-in, and a clear step-by-step path to stronger Google
            Maps visibility.
          </p>
        </div>

        <div className="tp-cta-row">
          <button type="button" className="tp-btn tp-btn--sm" onClick={openTrialModal}>
            Get 7-Day Free Trial!
          </button>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.25rem] border border-[var(--tp-border)] bg-[#0d1620] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="grid min-h-[22rem] lg:grid-cols-[0.34fr_0.66fr]">
            <div className="bg-[#0a121b] px-4 py-4 md:px-5 md:py-5">
              <div className="space-y-2.5 md:space-y-3">
                {onboardingSteps.map((step, index) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`group relative flex min-h-[3.8rem] w-full items-center justify-between rounded-full px-5 py-2.5 text-left text-[0.94rem] font-semibold leading-none transition-colors md:min-h-[4.1rem] md:text-[0.98rem] ${
                      activeStep === index
                        ? "bg-[#C9A24A] text-[#0B1420]"
                        : "text-[#F4F1EA]/80 hover:bg-white/[0.04] hover:text-[#F4F1EA]"
                    }`}
                  >
                    <span>
                      {index + 1}. {step}
                    </span>
                    {activeStep === index ? (
                      <span className="absolute right-0 flex h-[3.35rem] w-[3.35rem] translate-x-[12%] items-center justify-center rounded-full border-[5px] border-[#0B1420] bg-[#C9A24A] text-[2rem] font-light text-[#0B1420] md:h-[3.6rem] md:w-[3.6rem]">
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
                <h3 className="font-['Fraunces'] text-[1.8rem] font-medium leading-[1.15] tracking-[-0.01em] text-[#F4F1EA] md:text-[2.05rem]">
                  {activeStepContent.title}
                </h3>
                <p className="mt-3.5 max-w-[40rem] text-[0.95rem] leading-[1.55] text-[#8A93A6] md:text-[1rem]">
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
                    <p className="mt-5 text-[0.95rem] leading-[1.55] text-[#8A93A6] md:text-[0.98rem]">
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
    <section id="plans" className="tp-section">
      <div className="tp-container">
        <div className="tp-center" style={{ maxWidth: 720 }}>
          <span className="tp-eyebrow">Plans</span>
          <h2 className="tp-h2">Choose your growth plan</h2>
        </div>
        <div className="tp-plans">
          {plans.map((plan) => (
            <article key={plan.name} className={`tp-plan${plan.popular ? " tp-plan--popular" : ""}`}>
              {plan.popular && <span className="tp-plan-popular-tag">Most Popular</span>}
              <span className="tp-plan-badge">{plan.badge}</span>
              <div className="tp-plan-visual">
                <img loading="lazy" decoding="async" src={plan.image} alt={`${plan.name} plan coverage`} />
              </div>
              <h3>{plan.name}</h3>
              <p className="tp-plan-desc">{plan.description}</p>
              <div className="tp-plan-price">
                <span style={{ fontWeight: 700, color: "var(--tp-text)" }}>{plan.radius}</span>
              </div>
              <ul className="tp-plan-included">
                {planFeatureList.map((feature) => {
                  const yes = plan.included.has(feature);
                  return (
                    <li key={feature}>
                      <span className={`tp-plan-check ${yes ? "tp-plan-check--yes" : "tp-plan-check--no"}`}>
                        {yes ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      </span>
                      {feature}
                    </li>
                  );
                })}
              </ul>
              <button type="button" className="tp-btn" onClick={openTrialModal}>
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
  <section id="faq" className="tp-section">
    <div className="tp-container">
      <div className="tp-center" style={{ maxWidth: 720 }}>
        <span className="tp-eyebrow">FAQ</span>
        <h2 className="tp-h2">Frequently Asked Questions</h2>
      </div>
      <div style={{ maxWidth: 780, margin: "44px auto 0", display: "grid", gap: 12 }}>
        {faqs.map((faq) => (
          <details key={faq.question} className="tp-faq-item">
            <summary>
              <span>{faq.question}</span>
              <span className="tp-faq-plus" aria-hidden="true">+</span>
            </summary>
            <p className="tp-faq-answer">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const TrialFinalCta = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section className="tp-section tp-topo">
      <div className="tp-container tp-center" style={{ maxWidth: 680 }}>
        <h2 className="tp-h2">
          Start your <em>free 7-day trial</em> today
        </h2>
        <p className="tp-lead tp-center">
          No card required. No account access needed. No commitment. See real ranking movement before you pay a
          single euro.
        </p>
        <div className="tp-cta-row">
          <button type="button" className="tp-btn tp-btn--final" onClick={openTrialModal}>
            Get Free Trial <span className="tp-btn-icon"><ArrowRight className="ml-1 h-4 w-4" /></span>
          </button>
          <button type="button" className="tp-btn tp-btn--outline" onClick={openTrialModal}>
            Schedule Time for Meeting
          </button>
        </div>
      </div>
    </section>
  );
};

const TrialPageContent = () => (
  <MotionConfig reducedMotion="user">
    <div className="tp-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <TrialNavbar />
      <main className="tp-main">
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

const TrialPage = () => {
  useEffect(() => {
    document.body.classList.add("tp-active");
    return () => document.body.classList.remove("tp-active");
  }, []);

  return (
    <>
      <SEO
        title="Free 7-Day Google Maps Trial | LlamaMaps"
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

export default TrialPage;

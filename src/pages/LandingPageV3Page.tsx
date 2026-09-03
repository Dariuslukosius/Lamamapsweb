import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { ArrowRight, Check, X, Star, ChevronLeft, ChevronRight } from "lucide-react";

import SeoHormozi from "@/components/landingpage-v3/SeoHormozi";
import { organizationSchema, faqSchema } from "@/lib/structuredData";
import TrialNavbar from "@/components/landingpage-v3/TrialNavbar";
import TrialFooter from "@/components/landingpage-v3/TrialFooter";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { TrialModalProvider, useTrialModal } from "@/components/landingpage-v3/TrialModalContext";
import TrialFloatingCta from "@/components/landingpage-v3/TrialFloatingCta";
import BeforeAfterSlider from "@/components/landingpage-v3/BeforeAfterSlider";
import YouTubeFacade from "@/components/landingpage-v3/YouTubeFacade";
import RankClimbVideo from "@/components/landingpage-v3/RankClimbVideo";
import HeroRankClimb from "@/components/landingpage-v3/HeroRankClimb";
import TrialInvisibilitySection from "@/components/landingpage-v3/TrialInvisibilitySection";
import CountUpStat from "@/components/landingpage-v3/CountUpStat";
import RankCrossfadeBadge from "@/components/landingpage-v3/RankCrossfadeBadge";
import TrustBadges from "@/components/landingpage-v3/TrustBadges";
import { COPY } from "@/components/landingpage-v3/copy";
import { faqs } from "@/components/landingpage-v3/faqs";
import { brandLogos } from "@/lib/brandLogos";
import { Link } from "react-router-dom";
import { caseStudies, type CaseStudy } from "@/lib/caseStudies";
import { caseStudyScansV2 } from "@/lib/caseStudyScansV2";
import CaseStudyLogo from "@/components/landingpage-v3/CaseStudyLogo";
import PlanRadiusMap, { type PlanRadiusKey } from "@/components/landingpage-v3/PlanRadiusMap";
import { testimonials, initialsOf } from "@/lib/testimonials";
import { trackHormoziView, installScrollDepthTracking } from "@/components/landingpage-v3/tracking";
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
// Traced to vector rather than raster-cleaned like the other two, since
// their best available source was too low-resolution for hardening +
// upscaling alone to fix — see scripts/vectorize-logos.py.

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

  .l3-page { overflow-x: hidden; font-family: 'DM Sans', 'DM Sans Fallback', sans-serif; background: var(--l3-bg); color: var(--l3-text); }
  .l3-page {
    --l3-bg: #0D1F17;
    --l3-bg-card: #132722;
    --l3-text: #F4F1EA;
    --l3-text-muted: #8A93A6;
    /* Subtitles and body leads. Deliberately lighter than --l3-text-muted,
       which V1 used for both: at #8A93A6 the hero subheadline sat so close to
       the background that it read as disabled text rather than as the sentence
       explaining the headline. --l3-text-muted is now reserved for genuinely
       secondary small print (captions, footnotes, metric labels). */
    --l3-text-sub: #B7C0D0;
    --l3-gold: #C9A24A;
    --l3-gold-soft: #DEC584;
    /* Button fill. Buttons carry white text, and white on the display gold
       above is about 2.2:1 -- unreadable in daylight on a phone. Deepening
       just the button fill keeps the palette gold while taking white text to
       ~5:1. The display gold stays exactly as it was everywhere else. */
    --l3-gold-btn: #8A6A1F;
    --l3-gold-btn-hover: #A37D26;
    --l3-emerald: #1F4D3D;
    --l3-border: rgba(138, 147, 166, 0.18);
    --l3-border-strong: rgba(138, 147, 166, 0.32);
    --l3-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    --l3-serif: 'Fraunces', 'Fraunces Fallback', serif;

    /* One radius scale, applied everywhere. V1 mixed 10/12/14/16/18/20px and
       999px pills with no rule about which got what, so a card, the badge on
       it and the button under it could each round differently. */
    --l3-r-card: 16px;      /* panels: cards, sections, media frames */
    --l3-r-control: 12px;   /* things you click or that label something */
    --l3-r-mark: 999px;     /* only for round single-glyph marks and avatars */
  }
  html { scroll-behavior: smooth; scroll-padding-top: 92px; }
  /* Task: content was leaving too much dead space at the sides on a desktop
     screen. Wider ceiling, and side padding that scales instead of sitting at
     a flat 20px whatever the viewport. */
  .l3-container { width: 100%; max-width: 1440px; margin: 0 auto; padding: 0 clamp(20px, 3vw, 44px); }
  .l3-main { padding-top: 72px; }
  /* The same content under the site-wide navbar, which is 80px tall rather than
     this page's own 72px bar. Matching the offset to the bar that is actually
     rendered is what keeps the first line of the hero clear of it on /services. */
  .l3-main--site { padding-top: 80px; }

  /* Subtle topographic-contour texture — the only "decorative" background motif,
     tying the visual language back to maps rather than an abstract color blob. */
  .l3-topo {
    background-image: repeating-radial-gradient(circle at 22% 28%, rgba(201,162,74,0.05) 0px, rgba(201,162,74,0.05) 1px, transparent 1px, transparent 42px),
      repeating-radial-gradient(circle at 84% 74%, rgba(138,147,166,0.05) 0px, rgba(138,147,166,0.05) 1px, transparent 1px, transparent 56px);
  }

  /* Every button on the page renders its label in #FFFFFF, including the
     outline and ghost variants. */
  .l3-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 52px; border: 0; border-radius: var(--l3-r-control);
    background: var(--l3-gold-btn); color: #FFFFFF;
    font-size: 0.86rem; font-weight: 700; letter-spacing: 0.03em;
    padding: 0 28px; text-transform: uppercase; text-align: center;
    box-shadow: var(--l3-shadow); cursor: pointer; text-decoration: none;
    transition: background 0.2s ease;
  }
  .l3-btn:hover { background: var(--l3-gold-btn-hover); }
  .l3-btn--sm { min-height: 44px; padding: 0 20px; font-size: 0.78rem; }
  .l3-btn--outline { background: transparent; border: 1px solid var(--l3-border-strong); color: #FFFFFF; box-shadow: none; }
  .l3-btn--outline:hover { background: rgba(244,241,234,0.06); }
  .l3-btn--ghost { background: transparent; border: 1px solid rgba(201,162,74,0.5); color: #FFFFFF; box-shadow: none; }
  .l3-btn--ghost:hover { background: rgba(201,162,74,0.12); }
  /* Final CTA: the one button on the page with a deliberate, restrained hover
     lift + icon nudge — reserved for the closing conversion moment. */
  .l3-btn--final { transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; }
  .l3-btn--final:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,0,0,0.5); }
  .l3-btn-icon { display: inline-flex; transition: transform 0.2s ease; }
  .l3-btn--final:hover .l3-btn-icon { transform: translateX(3px); }

  /* ── Navbar ── */
  /* position: fixed (not sticky) — .l3-page sets overflow-x: hidden, which forces
     overflow-y to compute as auto and makes it a scroll container; a sticky navbar
     would then stick relative to that box instead of the viewport. */
  .l3-navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(13,31,23,0.94); backdrop-filter: blur(10px); border-bottom: 1px solid var(--l3-border); }
  .l3-navbar-inner { max-width: 1440px; margin: 0 auto; padding: 0 clamp(20px, 3vw, 44px); height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .l3-navbar-logo { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; text-decoration: none; }
  .l3-navbar-logo img { height: 30px; width: auto; display: block; }
  .l3-navbar-logo-text { display: flex; flex-direction: column; align-items: center; gap: 1px; line-height: 1; }
  .l3-navbar-logo-name { color: var(--l3-text); font-size: 0.8rem; font-weight: 700; letter-spacing: -0.01em; }
  /* Task: "Be First On Google" in gold. Full opacity too -- at 0.85 over the
     navbar's translucent fill the gold silted up into a muddy brown. */
  .l3-navbar-logo-tagline { color: var(--l3-gold); font-size: 0.5rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
  .l3-navbar-links { display: none; align-items: center; gap: 24px; margin-left: auto; }
  .l3-navbar-link { color: var(--l3-text); font-size: 0.88rem; font-weight: 500; text-decoration: none; white-space: nowrap; }
  .l3-navbar-link:hover { color: var(--l3-gold); }
  .l3-navbar-cta { display: none; align-items: center; justify-content: center; line-height: 1; min-height: 40px; border: 0; border-radius: var(--l3-r-control); background: var(--l3-gold-btn); color: #FFFFFF; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; padding: 0 18px; cursor: pointer; white-space: nowrap; }
  .l3-navbar-cta:hover { background: var(--l3-gold-btn-hover); }
  .l3-navbar-toggle { display: inline-flex; border: 0; background: transparent; color: var(--l3-text); cursor: pointer; padding: 6px; }
  .l3-navbar-mobile { border-top: 1px solid var(--l3-border); background: var(--l3-bg); padding: 10px 20px 18px; display: grid; gap: 4px; }
  .l3-navbar-mobile-link { padding: 10px 4px; color: var(--l3-text); font-weight: 500; text-decoration: none; font-size: 0.94rem; }
  .l3-navbar-mobile-cta { display: flex; align-items: center; justify-content: center; line-height: 1; margin-top: 8px; min-height: 48px; border: 0; border-radius: var(--l3-r-control); background: var(--l3-gold-btn); color: #FFFFFF; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; font-size: 0.8rem; cursor: pointer; }

  @media (min-width: 900px) {
    .l3-navbar-links { display: flex; }
    .l3-navbar-cta { display: inline-flex; }
    .l3-navbar-toggle { display: none; }
  }

  /* ── Hero ── */
  .l3-hero { position: relative; padding: 64px 0 56px; overflow: hidden; isolation: isolate; background: var(--l3-bg); }
  /* A small white tab hanging just below the navbar — white background because
     the Google Partner badge asset renders its "Google Partner" wordmark in dark
     grey, which needs a light backdrop to stay legible. */
  /* Task: the Google Partner badge was centred directly under the navbar,
     straight above the headline, where it was the first thing the eye landed
     on. It is a trust marker, not the offer, so it moves to the corner at
     every width, including mobile — a small tab tucked against the edge, not
     a centred interruption between the navbar and the H1. */
  .l3-partner-wrap { display: flex; justify-content: flex-end; padding-right: clamp(14px, 4vw, 44px); }
  .l3-partner-strip {
    display: inline-flex; align-items: center; justify-content: center;
    background: #fff; border-radius: 0 0 var(--l3-r-control) var(--l3-r-control);
    padding: 6px 18px 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.28);
  }
  .l3-partner-strip img { height: 42px; width: auto; display: block; }
  .l3-hero-inner { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .l3-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(201,162,74,0.4); border-radius: var(--l3-r-control);
    background: rgba(201,162,74,0.08); color: var(--l3-gold); font-size: 0.8rem; font-weight: 700;
    padding: 8px 16px;
  }
  .l3-hero-eyebrow { display: block; margin-top: 24px; color: var(--l3-text-sub); font-size: 1rem; font-weight: 500; letter-spacing: 0.01em; }
  .l3-hero-h1 { margin-top: 10px; color: var(--l3-text); font-family: var(--l3-serif); font-size: clamp(2.2rem, 6vw, 4.2rem); font-weight: 400; letter-spacing: -0.01em; line-height: 1.12; max-width: 920px; }
  .l3-hero-h1 em { font-style: normal; font-weight: 600; color: var(--l3-gold); }
  .l3-hero-sub { margin-top: 20px; color: var(--l3-text-sub); font-size: 1.06rem; line-height: 1.75; max-width: 680px; }
  .l3-hero-rating { margin-top: 26px; }
  .l3-hero-rating .l3-rating-num { color: var(--l3-text); }
  .l3-hero-rating .l3-rating-count { color: var(--l3-text-sub); }
  .l3-hero-actions { margin-top: 30px; display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
  .l3-hero-actions .l3-btn { min-height: 54px; font-size: 0.88rem; }
  .l3-hero-video-wrap { margin-top: 40px; width: 100%; max-width: 640px; border-radius: var(--l3-r-card); border: 1px solid var(--l3-border); background: var(--l3-bg-card); box-shadow: var(--l3-shadow); padding: 10px; }
  .l3-hero-video-inner { position: relative; border-radius: var(--l3-r-control); overflow: hidden; background: #0d1f17; }

  /* ── Hero rank-climb placeholder — "finding" concept: a business row climbs
     from a low position to the top of the results, holds, then loops. Base
     state already shows it arrived at the top; the climb is added motion. ── */
  .l3-rankclimb { padding: 22px 20px 24px; }
  /* A map-panel label instead of a search bar — Hero reads as "your live map
     position", the Invisibility section below owns the literal search-bar
     visual, so the two placeholders don't look like duplicates of each other. */
  .l3-rankclimb-label {
    display: flex; align-items: center; gap: 8px;
    color: var(--l3-gold); font-size: 0.76rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 16px;
  }
  .l3-rankclimb-list { position: relative; min-height: 252px; }
  .l3-rankclimb-row, .l3-rankclimb-you {
    display: flex; align-items: center; gap: 12px;
    height: 44px; border-radius: 10px; padding: 0 14px; margin-bottom: 8px;
    font-size: 0.82rem;
  }
  .l3-rankclimb-row { background: var(--l3-bg-card); color: var(--l3-text-muted); }
  .l3-rankclimb-row-rank {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 999px; flex-shrink: 0;
    background: rgba(138,147,166,0.16); color: var(--l3-text-muted);
    font-size: 0.72rem; font-weight: 700;
  }
  .l3-rankclimb-row-rank--you { background: var(--l3-gold); color: var(--l3-bg); }
  /* Solid, fully opaque background — this row is absolutely positioned directly
     on top of the static rows below while it "climbs", and a semi-transparent
     fill let their text show through and garble together mid-transition. */
  .l3-rankclimb-you {
    position: absolute; left: 0; right: 0; top: 0;
    background: #0D1F17; border: 1px solid rgba(201,162,74,0.5);
    color: var(--l3-gold); font-weight: 700; z-index: 2;
  }
  @media (prefers-reduced-motion: no-preference) {
    .l3-rankclimb-you { animation: tpRankClimb 7s ease-in-out infinite; }
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
     .l3-page's overflow-x:hidden cannot clip it, because its containing
     block is outside .l3-page. That made the whole page scroll sideways. */
  .l3-invisible-demo { max-width: 460px; margin: 44px auto 0; position: relative; }
  .l3-invisible-search { display: flex; align-items: center; gap: 10px; background: var(--l3-bg-card); border: 1px solid var(--l3-border); border-radius: 10px; padding: 12px 16px; }
  .l3-invisible-search-text { color: var(--l3-text-muted); font-size: 0.88rem; }
  .l3-invisible-list { position: relative; margin-top: 16px; }
  .l3-invisible-row {
    display: flex; align-items: center; gap: 12px;
    background: var(--l3-bg-card); border: 1px solid var(--l3-border);
    border-radius: 10px; padding: 12px 16px; margin-bottom: 8px;
    color: var(--l3-text); font-size: 0.86rem;
  }
  .l3-invisible-row-rank {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 999px; flex-shrink: 0;
    background: rgba(138,147,166,0.16); color: var(--l3-text-muted);
    font-size: 0.72rem; font-weight: 700;
  }
  .l3-invisible-ellipsis { text-align: center; color: var(--l3-text-muted); padding: 4px 0; letter-spacing: 0.2em; }
  .l3-invisible-row--you { opacity: 0.6; border-style: dashed; }
  .l3-invisible-scrolltrack { position: absolute; right: -18px; top: 0; bottom: 0; width: 3px; background: rgba(138,147,166,0.14); border-radius: 999px; }
  .l3-invisible-scrollthumb { position: absolute; left: 0; right: 0; top: 0; height: 15%; background: var(--l3-border-strong); border-radius: 999px; }

  @media (prefers-reduced-motion: no-preference) {
    .l3-invisible-search-text {
      display: inline-block; overflow: hidden; white-space: nowrap; width: 0;
      border-right: 2px solid transparent;
    }
    .l3-invisible-demo.is-active .l3-invisible-search-text {
      animation: tpTypeText 1.1s steps(16, end) 0.2s forwards, tpCaretBlink 0.8s step-end 0.2s 3;
    }
    .l3-invisible-row { opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .l3-invisible-demo.is-active .l3-invisible-row { opacity: 1; transform: translateY(0); }
    .l3-invisible-demo.is-active .l3-invisible-row--you { opacity: 0.6; }
    .l3-invisible-scrollthumb { top: -15%; }
    .l3-invisible-demo.is-active .l3-invisible-scrollthumb {
      animation: tpScrollPast 2.2s linear 1.6s forwards;
    }
  }
  @keyframes tpTypeText { from { width: 0; } to { width: 16.5ch; } }
  @keyframes tpCaretBlink { 50% { border-color: var(--l3-text-muted); } }
  @keyframes tpScrollPast { from { top: -15%; } to { top: 100%; } }

  /* ── Signature rank-climb video (the one place a gradient + glow are allowed) ── */
  .l3-rank-climb-video { display: inline-flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 30px; width: 100%; max-width: 380px; }
  .l3-rank-climb-video-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--l3-text-muted); }
  .l3-rank-climb-video-media {
    width: 100%; aspect-ratio: 16 / 9; display: block;
    border-radius: 16px; overflow: hidden; object-fit: cover;
    background: rgba(13,31,23,0.28);
    border: 1px solid rgba(201,162,74,0.38);
    box-shadow: 0 0 34px rgba(201,162,74,0.15);
  }

  /* ── Sections ── */
  /* The gap between two sections is purely these two paddings added together —
     nothing on the page contributes a vertical margin at a section boundary,
     so whatever is set here is doubled at every seam. 56px/side therefore read
     as 112px, which looked like dead space rather than rhythm: almost every
     section ends on the small trust-badge line and the next opens on a small
     eyebrow, so the gap is measured by eye between two thin lines of text and
     looks far larger than the same distance between two dense blocks.
     32px/side = 64px combined, which lands the seams in proportion to that
     lightweight content. */
  .l3-section { padding: 32px 0; }
  .l3-section--sm { padding: 24px 0; }
  /* Task: every centred section header used its own inline maxWidth (680,
     720, 760), so consecutive headers wrapped at different measures and the
     column edge wandered down the page. One class, one measure. */
  .l3-section-head { max-width: 760px; margin-left: auto; margin-right: auto; text-align: center; }
  .l3-section-head .l3-lead { margin-left: auto; margin-right: auto; }
  .l3-eyebrow { display: inline-block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--l3-gold); margin-bottom: 16px; }
  .l3-h2 { color: var(--l3-text); font-family: var(--l3-serif); font-size: clamp(1.9rem, 4.6vw, 2.8rem); font-weight: 400; letter-spacing: -0.01em; line-height: 1.16; }
  .l3-h2 em { font-style: normal; font-weight: 600; color: var(--l3-gold); }
  .l3-lead { margin-top: 16px; color: var(--l3-text-sub); font-size: 1.02rem; line-height: 1.8; max-width: 680px; }
  .l3-center { text-align: center; margin-left: auto; margin-right: auto; }
  .l3-cta-row { display: flex; justify-content: center; margin-top: 32px; gap: 14px; flex-wrap: wrap; }

  /* No desktop override for .l3-section: it used to bump the padding to 72px
     above 900px, which is what produced the 144px seams. Section rhythm is now
     one value at every width, so there is nothing here to drift out of sync. */

  /* ── Rating ── */
  .l3-rating { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .l3-rating-stars { display: flex; gap: 3px; color: var(--l3-gold); }
  .l3-rating-num { font-size: 1.5rem; font-weight: 700; color: var(--l3-text); }
  .l3-rating-count { color: var(--l3-text-muted); font-size: 0.94rem; }

  /* ── Testimonial carousel ── */
  .l3-testimonial-card { border: 1px solid var(--l3-border); border-radius: var(--l3-r-card); background: var(--l3-bg-card); box-shadow: var(--l3-shadow); padding: 24px; height: 100%; }
  @media (max-width: 640px) {
    /* One card is visible at a time here, so equal heights buy nothing and
       cost a lot: every card stretched to match the longest review, leaving
       ~400px of empty card under the short ones. Size to content instead. */
    .l3-testimonial-card { height: auto; }
  }
  .l3-testimonial-head { display: flex; align-items: center; gap: 12px; }
  .l3-testimonial-avatar { width: 52px; height: 52px; border-radius: 999px; object-fit: cover; flex-shrink: 0; }
  /* For clients who left a written review but no photo or logo. Initials rather
     than a stock portrait: a stand-in face beside a real person's name would
     misrepresent them. */
  .l3-testimonial-avatar--initials {
    display: flex; align-items: center; justify-content: center;
    background: var(--l3-bg); border: 1px solid var(--l3-border);
    color: var(--l3-gold); font-size: 0.95rem; font-weight: 700; letter-spacing: 0.02em;
  }
  .l3-testimonial-name { font-weight: 600; color: var(--l3-text-muted); font-size: 0.88rem; }
  .l3-testimonial-company { color: var(--l3-gold); font-size: 0.78rem; font-weight: 600; }
  /* The quote is the point of a testimonial — give it more visual weight than
     the attribution underneath it, not the other way around. */
  .l3-testimonial-text { margin-top: 16px; color: var(--l3-text); font-size: 1.05rem; font-weight: 500; line-height: 1.7; }

  /* ── Logos strip ── */
  .l3-logos-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 32px 48px; }
  .l3-logos-row img { height: 42px; width: auto; object-fit: contain; filter: grayscale(1) brightness(0) invert(1); opacity: 0.8; }

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
  .l3-mission-stats { display: flex; flex-direction: column; gap: 20px; margin-top: 40px; }
  .l3-mission-stat { padding: 6px 4px; }
  .l3-mission-stat-num { font-family: var(--l3-serif); font-size: 2rem; font-weight: 600; color: var(--l3-gold); line-height: 1; }
  .l3-mission-stat-label { margin-top: 10px; color: var(--l3-text-muted); font-size: 0.88rem; line-height: 1.5; }
  .l3-mission-stat--featured {
    border-radius: var(--l3-r-card); background: var(--l3-bg-card);
    border: 1px solid var(--l3-border); box-shadow: var(--l3-shadow); padding: 24px;
  }
  .l3-mission-stat--featured .l3-mission-stat-num { font-size: 3rem; }
  .l3-mission-stat--featured .l3-mission-stat-label { font-size: 0.92rem; }
  .l3-mission-secondary { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px 20px; }
  @media (min-width: 700px) {
    .l3-mission-stat--featured .l3-mission-stat-num { font-size: 3.6rem; }
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
     .l3-page's overflow-x: hidden rather than showing as a scrollbar. */
  .l3-cases { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; margin-top: 40px; }
  .l3-cases-note {
    margin-top: 20px; text-align: center; color: var(--l3-text-muted);
    font-size: 0.76rem; line-height: 1.6; max-width: 720px;
    margin-left: auto; margin-right: auto;
  }
  .l3-case {
    display: flex; flex-direction: column; gap: 20px;
    border: 1px solid var(--l3-border); border-radius: var(--l3-r-card);
    background: var(--l3-bg-card); box-shadow: var(--l3-shadow); padding: 24px;
  }
  .l3-case-head { display: flex; align-items: center; gap: 12px; }
  /* min-width: 0 overrides the flex default of min-width: auto, which lets a
     flex child's own intrinsic content width (the business name plus the new
     "N keywords" badge) win over the row's actual available space instead of
     wrapping -- the classic, easy-to-miss way a flex row overflows sideways. */
  .l3-case-head > div:last-child { min-width: 0; }
  .l3-case-head h3 { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  /* One tile spec for both the real logos and the fallback glyph, so a row
     mixing the two still lines up. White fill because the client marks are
     drawn for light backgrounds and several are near-black. */
  .l3-case-logo, .l3-case-logo--glyph {
    width: 52px; height: 52px; border-radius: var(--l3-r-control);
    flex-shrink: 0; border: 1px solid var(--l3-border);
    background: #fff; object-fit: contain; padding: 7px;
  }
  .l3-case-logo--glyph {
    background: var(--l3-bg); display: flex; align-items: center;
    justify-content: center; font-size: 1.4rem; padding: 0;
  }
  /* The client's mark pinned on its own scan. Corner, not centre: the centre
     of a scan is the business's own location and carries the ranking bubble
     the reader is there to check. */
  .l3-baf-pin {
    position: absolute; left: 10px; top: 10px; z-index: 4;
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; padding: 5px; border-radius: var(--l3-r-control);
    background: rgba(255,255,255,0.94); box-shadow: 0 2px 10px rgba(0,0,0,0.35);
    pointer-events: none;
  }
  .l3-case-pin { width: 100%; height: 100%; object-fit: contain; display: block; }
  .l3-case-head h3 { color: var(--l3-text); font-size: 1.05rem; font-weight: 700; line-height: 1.3; }
  .l3-case-head p { color: var(--l3-gold); font-size: 0.8rem; font-weight: 600; margin-top: 2px; }
  /* Keyword switcher for a business tracked on more than one search term —
     arrows cycle in place instead of stacking a near-duplicate card below. */
  .l3-case-keywords {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    margin-top: 14px; padding: 6px 6px 6px 14px; width: 100%;
    box-sizing: border-box; max-width: 100%;
    border-radius: var(--l3-r-control);
    background: rgba(201,162,74,0.08); border: 1px solid rgba(201,162,74,0.3);
  }
  /* Solid fill rather than the outline every other icon-only control on this
     page uses -- deliberately: this is the one place a subtle outline button
     wasn't being noticed against the equally-gold-tinted metric rows right
     below it. A filled gold circle reads as "press me" at a glance instead of
     blending into the card's own accent colour. */
  .l3-case-keyword-arrow {
    display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
    width: 34px; height: 34px; border-radius: 999px; border: 0;
    background: var(--l3-gold-btn); color: #FFFFFF;
    cursor: pointer; transition: background 0.15s ease, transform 0.15s ease;
  }
  .l3-case-keyword-arrow:hover { background: var(--l3-gold-btn-hover); transform: scale(1.06); }
  /* Names how many search terms this business is tracked on, right next to
     its name -- so the reason an arrow control exists on this card is obvious
     before a reader's eye even reaches it. */
  .l3-case-multi-badge {
    display: inline-block; margin-left: 8px; padding: 2px 8px; border-radius: 999px;
    background: rgba(201,162,74,0.16); border: 1px solid rgba(201,162,74,0.4);
    color: var(--l3-gold); font-size: 0.66rem; font-weight: 700; letter-spacing: 0.02em;
    text-transform: uppercase; vertical-align: middle;
  }
  .l3-case-keyword-current {
    flex: 1 1 0%; min-width: 0; max-width: 100%; display: flex;
    align-items: baseline; justify-content: space-between; gap: 10px; box-sizing: border-box;
    color: var(--l3-text); font-size: 0.84rem; font-weight: 600;
  }
  .l3-case-keyword-current > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .l3-case-keyword-count { flex-shrink: 0; color: var(--l3-text-muted); font-size: 0.72rem; font-weight: 500; }
  .l3-case-metrics { display: grid; gap: 8px; margin-top: 20px; }
  .l3-case-metric { display: flex; align-items: center; justify-content: space-between; gap: 10px; border-radius: var(--l3-r-control); background: rgba(244,241,234,0.03); border: 1px solid var(--l3-border); padding: 10px 14px; }
  /* Phrase-length values (the tracked search term) stack under their label —
     opposite it they collide in this narrow column and wrap mid-phrase. */
  .l3-case-metric--stack { flex-direction: column; align-items: flex-start; gap: 4px; }
  .l3-case-metric--stack .l3-case-metric-val { font-size: 0.92rem; line-height: 1.4; }
  .l3-case-metric-val { color: var(--l3-gold); font-size: 1rem; font-weight: 700; }
  .l3-case-metric-label { color: var(--l3-text-muted); font-size: 0.78rem; }


  /* ── Before/after slider ── */
  .l3-baf-labels { display: flex; justify-content: space-between; margin-bottom: 8px; gap: 8px; }
  .l3-baf-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; padding: 5px 10px; border-radius: var(--l3-r-control); }
  .l3-baf-label--before { background: rgba(138,147,166,0.14); color: var(--l3-text-muted); }
  .l3-baf-label--after { background: rgba(201,162,74,0.14); color: var(--l3-gold); }
  /* Fixed aspect-ratio box, with BOTH before/after images object-fit: cover'd into
     it the same way — using one image's natural size to define the box (and only
     force-fitting the other) made mismatched-resolution before/after screenshot
     pairs visibly jump in scale right at the seam.
     800/743 is the exact pixel ratio of the rank-scan frames after their date
     header is cropped off. Matching it means object-fit: cover has nothing to crop,
     so the grid's outermost ranking bubbles stay inside the frame — at 1/1 the
     box ate ~7% of the width and clipped the edge columns. */
  .l3-baf-frame { position: relative; overflow: hidden; border-radius: var(--l3-r-control); border: 1px solid var(--l3-border); background: #0d1f17; max-width: 460px; margin: 0 auto; aspect-ratio: 800 / 743; touch-action: none; cursor: ew-resize; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
  .l3-baf-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; -webkit-user-drag: none; -webkit-touch-callout: none; pointer-events: none; }
  .l3-baf-clip { position: absolute; inset: 0; overflow: hidden; }
  .l3-baf-line { position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(244,241,234,0.85); transform: translateX(-50%); pointer-events: none; z-index: 2; }
  .l3-baf-handle { position: absolute; top: 50%; transform: translate(-50%, -50%); z-index: 3; display: flex; align-items: center; gap: 4px; background: var(--l3-text); color: var(--l3-bg); border-radius: 999px; padding: 8px 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.35); pointer-events: none; }
  .l3-baf-handle-arrow { font-size: 0.85rem; font-weight: 700; line-height: 1; }

  /* ── More Leads cards ── */
  .l3-leadcards { display: grid; gap: 20px; margin-top: 44px; }
  .l3-leadcard { display: grid; gap: 24px; border: 1px solid var(--l3-border); border-radius: var(--l3-r-card); background: var(--l3-bg-card); box-shadow: var(--l3-shadow); padding: 24px; align-items: center; }
  .l3-leadcard img { width: 100%; border-radius: 12px; display: block; }
  .l3-leadcard h3 { color: var(--l3-text); font-size: 1.18rem; font-weight: 700; }
  .l3-leadcard-sub { color: var(--l3-gold); font-size: 0.82rem; font-weight: 600; margin-top: 4px; }
  .l3-leadcard p.l3-leadcard-desc { margin-top: 12px; color: var(--l3-text-muted); font-size: 0.94rem; line-height: 1.7; }
  .l3-leadcard .l3-btn { margin-top: 18px; }
  /* Lead card in the set gets more visual weight — bigger padding, border, and
     type — so the four cards don't read as four identical repeats. */
  /* Same padding as its siblings now -- only the border colour and type scale
     mark it out, so the four cards still line up edge to edge. */
  .l3-leadcard--featured { border-color: rgba(201,162,74,0.4); }
  .l3-leadcard--featured h3 { font-size: 1.4rem; }
  .l3-leadcard--featured p.l3-leadcard-desc { font-size: 1rem; }

  /* ── Comparison ── */
  .l3-compare-grid { display: grid; gap: 20px; margin-top: 44px; }
  .l3-compare-col { border-radius: var(--l3-r-card); padding: 24px; border: 1px solid var(--l3-border); background: var(--l3-bg-card); box-shadow: var(--l3-shadow); }
  .l3-compare-col--plus { border-color: rgba(201,162,74,0.4); }
  .l3-compare-col h3 { color: var(--l3-text); font-size: 1.2rem; font-weight: 700; margin-bottom: 22px; }
  .l3-compare-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; color: var(--l3-text); font-size: 0.92rem; font-weight: 500; }
  .l3-compare-mark { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 999px; flex-shrink: 0; }
  .l3-compare-mark--yes { background: var(--l3-gold); color: var(--l3-bg); }
  .l3-compare-mark--no { background: rgba(138,147,166,0.18); color: var(--l3-text-muted); }

  /* ── Video testimonials ── */
  .l3-videos { display: grid; gap: 18px; margin-top: 44px; grid-template-columns: repeat(2, minmax(0,1fr)); }
  .l3-video-card { border-radius: var(--l3-r-card); border: 1px solid var(--l3-border); background: var(--l3-bg-card); box-shadow: var(--l3-shadow); padding: 8px; }
  .l3-video-frame { position: relative; width: 100%; padding-bottom: 177.78%; border-radius: 10px; overflow: hidden; background: #000; }
  .l3-video-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }

  /* Click-to-load poster (see YouTubeFacade). It occupies the frame exactly, so
     swapping it for the real iframe on click shifts no layout — the aspect box
     around it is fixed by .l3-video-frame's padding-bottom either way. */
  .l3-video-facade {
    position: absolute; inset: 0; width: 100%; height: 100%;
    padding: 0; border: 0; background: #000; cursor: pointer; display: block;
  }
  .l3-video-poster { width: 100%; height: 100%; object-fit: cover; display: block; }
  .l3-video-play {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    display: grid; place-items: center; width: 58px; height: 58px; border-radius: 999px;
    background: rgba(12, 20, 32, 0.72); color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(2px);
    padding-left: 4px; /* optical centring: the glyph's mass sits left of centre */
    transition: transform 160ms ease, background 160ms ease;
  }
  .l3-video-facade:hover .l3-video-play { transform: translate(-50%, -50%) scale(1.08); background: rgba(12, 20, 32, 0.88); }
  .l3-video-facade:focus-visible { outline: 2px solid var(--l3-gold); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .l3-video-facade:hover .l3-video-play { transform: translate(-50%, -50%); }
  }
  .l3-video-ranks { margin-top: 10px; padding: 0 4px 4px; }
  /* Crossfades between Before/After on hover (desktop) or tap (mobile) rather
     than showing both at once — a small "transformation" moment tied to the
     viewer's own interaction. */
  .l3-rank-crossfade { position: relative; display: block; width: 100%; height: 38px; border: 0; border-radius: 8px; background: rgba(244,241,234,0.04); cursor: pointer; overflow: hidden; padding: 0; }
  .l3-rank-crossfade-face {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700; color: var(--l3-text-muted); opacity: 0;
    transition: opacity 0.35s ease;
  }
  .l3-rank-crossfade-face.is-visible { opacity: 1; }
  .l3-rank-crossfade-face--after { color: var(--l3-gold); }

  /* ── Plans ── */
  .l3-plans { display: grid; gap: 22px; margin-top: 48px; }
  .l3-plan { position: relative; border-radius: var(--l3-r-card); border: 1px solid var(--l3-border); background: var(--l3-bg-card); box-shadow: var(--l3-shadow); padding: 24px; display: flex; flex-direction: column; }
  .l3-plan--popular { border-color: var(--l3-gold); }
  .l3-plan-popular-tag { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--l3-gold-btn); color: #FFFFFF; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 7px 16px; border-radius: var(--l3-r-control); }
  .l3-plan-badge { display: inline-block; align-self: flex-start; background: rgba(201,162,74,0.12); color: var(--l3-gold); font-size: 0.72rem; font-weight: 700; padding: 7px 12px; border-radius: var(--l3-r-control); margin-bottom: 18px; }
  .l3-plan-visual { border-radius: var(--l3-r-control); overflow: hidden; margin-bottom: 18px; }
  .l3-plan-visual img { width: 100%; display: block; }

  /* ── Plan coverage map (see PlanRadiusMap.tsx) ── */
  .l3-planmap { position: relative; margin: 0; aspect-ratio: 1; border-radius: var(--l3-r-control); overflow: hidden; border: 1px solid var(--l3-border); }
  .l3-planmap-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .l3-planmap-overlay { position: absolute; inset: 0; width: 100%; height: 100%; }
  /* Centred pill naming the radius, sat directly on the circle it describes —
     the map reads as "this distance" at a glance instead of asking the reader
     to match a corner label back to the ring. Solid gold with navy text: the
     same pairing as every other on-page badge, and ~8:1 contrast against the
     gold fill it sits on. */
  .l3-planmap-radius {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    border-radius: var(--l3-r-control); padding: 9px 16px;
    background: var(--l3-gold); color: var(--l3-bg);
    font-size: 0.86rem; font-weight: 700; letter-spacing: 0.01em; white-space: nowrap;
    box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  }
  @media (max-width: 480px) {
    .l3-planmap-radius { font-size: 0.76rem; padding: 7px 12px; }
  }
  /* Coverage footprint as a bounding square (2x radius) rather than the
     circle's own area — see PlanRadiusMap.tsx for why. Corner placement and
     quieter treatment than the radius pill: it is a supporting figure, not
     the headline of the visual. Top-right rather than bottom-right so it
     never sits over the OSM attribution strip, which owns the bottom edge. */
  .l3-planmap-area {
    position: absolute; right: 10px; top: 10px;
    border-radius: var(--l3-r-control); padding: 5px 10px;
    background: rgba(13,31,23,0.82); border: 1px solid rgba(201,162,74,0.45);
    color: var(--l3-gold); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
  }
  /* Collapsed OSM attribution — a small "i" rather than a text band across
     the map. See the comment beside its markup for why a shrunk icon still
     satisfies OpenStreetMap's attribution requirement. Kept low-contrast at
     rest so it doesn't compete with the radius pill; the hover/focus state
     brings it up to full legibility for anyone who goes looking for it. */
  .l3-planmap-attr {
    position: absolute; right: 8px; bottom: 8px;
    display: flex; align-items: center; justify-content: center;
    width: 17px; height: 17px; border-radius: 50%;
    background: rgba(13,31,23,0.55); color: rgba(244,241,234,0.7);
    font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size: 0.72rem;
    line-height: 1; text-decoration: none;
  }
  .l3-planmap-attr:hover, .l3-planmap-attr:focus-visible {
    background: rgba(13,31,23,0.85); color: var(--l3-text);
  }
  .l3-plan h3 { color: var(--l3-text); font-family: var(--l3-serif); font-size: 1.5rem; font-weight: 500; }
  .l3-plan-desc { margin-top: 8px; color: var(--l3-text-muted); font-size: 0.9rem; line-height: 1.65; min-height: 84px; }
  .l3-plan-price { margin-top: 14px; }
  .l3-plan-included { list-style: none; margin: 18px 0 0; padding: 0; display: grid; gap: 10px; flex: 1; }
  .l3-plan-included li { display: flex; align-items: center; gap: 10px; font-size: 0.88rem; color: var(--l3-text); font-weight: 500; }
  .l3-plan-check { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 999px; flex-shrink: 0; }
  .l3-plan-check--yes { background: var(--l3-gold); color: var(--l3-bg); }
  .l3-plan-check--no { background: rgba(138,147,166,0.16); color: var(--l3-text-muted); }
  .l3-plan .l3-btn { margin-top: 24px; width: 100%; }

  /* ── FAQ ── */
  .l3-faq-item { border-radius: var(--l3-r-card); border: 1px solid var(--l3-border); background: var(--l3-bg-card); box-shadow: var(--l3-shadow); padding: 20px 22px; }
  .l3-faq-item summary { cursor: pointer; list-style: none; font-weight: 600; color: var(--l3-text); display: flex; justify-content: space-between; gap: 16px; }
  .l3-faq-item summary::-webkit-details-marker { display: none; }
  .l3-faq-plus { color: var(--l3-gold); font-size: 1.2rem; line-height: 1; }
  .l3-faq-answer { margin-top: 14px; color: var(--l3-text-muted); font-size: 0.94rem; line-height: 1.75; }

  @media (min-width: 700px) {
    .l3-videos { grid-template-columns: repeat(4, minmax(0,1fr)); }
    .l3-compare-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .l3-plans { grid-template-columns: repeat(2, minmax(0,1fr)); align-items: stretch; }
  }
  @media (min-width: 860px) {
    /* .l3-case no longer takes a two-column rule here. The cards themselves
       are now paired two to a row, so each one has roughly half a container to
       work with and its metrics list and map stack instead of sitting side by
       side. */
    .l3-leadcard { grid-template-columns: 220px minmax(0,1fr); }
    .l3-leadcard:nth-child(even) { direction: rtl; }
    .l3-leadcard:nth-child(even) > * { direction: ltr; }
    .l3-leadcard--featured { grid-template-columns: 220px minmax(0,1fr); }
  }

  /* Task: case studies two per row on desktop, one on mobile. Held back to
     1024px rather than the 860px used elsewhere -- below that the pair of
     cards squeezes the scan images past the point where the ranking numbers
     on the grid stay readable, which is the only reason the images are there. */
  @media (min-width: 1024px) {
    .l3-cases { grid-template-columns: repeat(2, minmax(0,1fr)); align-items: start; }
  }

  /* ── Footer ── */
  .l3-footer { border-top: 1px solid var(--l3-border); padding: 56px 0 32px; }
  .l3-footer-inner { max-width: 1440px; margin: 0 auto; padding: 0 clamp(20px, 3vw, 44px); display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; }
  .l3-footer-logo { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .l3-footer-logo img { height: 30px; width: auto; }
  .l3-footer-logo-name { color: var(--l3-text); font-size: 0.85rem; font-weight: 700; letter-spacing: -0.01em; }
  .l3-footer-tagline { color: var(--l3-text); font-size: 1.2rem; font-weight: 600; letter-spacing: -0.01em; max-width: 520px; line-height: 1.4; }
  .l3-footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
  .l3-footer-links a { color: var(--l3-text-muted); font-size: 0.88rem; font-weight: 500; text-decoration: none; }
  .l3-footer-links a:hover { color: var(--l3-gold); }
  .l3-footer-bottom { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 8px; padding-top: 28px; border-top: 1px solid var(--l3-border); width: 100%; }
  .l3-footer-socials { display: flex; gap: 16px; }
  .l3-footer-socials a { color: var(--l3-gold); }
  .l3-footer-socials a:hover { color: var(--l3-gold-soft); }
  .l3-footer-copy { color: var(--l3-text-muted); font-size: 0.8rem; }

  /* ── Floating CTA ── */
  /* Task: shape consistency. This was the one pill at the bottom of a page
     whose every other control is a rounded rectangle, and it sits in the
     corner next to the footer where the mismatch was most obvious. */
  .l3-floating-cta {
    position: fixed; right: 20px; bottom: 20px; z-index: 90;
    display: inline-flex; align-items: center; justify-content: center; line-height: 1;
    min-height: 50px; border: 0; border-radius: var(--l3-r-control);
    background: var(--l3-gold-btn); color: #FFFFFF;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.02em;
    padding: 0 22px; cursor: pointer; box-shadow: var(--l3-shadow);
    opacity: 0; transform: translateY(8px); pointer-events: none;
    transition: background 0.2s ease, opacity 0.25s ease, transform 0.25s ease;
  }
  /* Applied once the hero (and the primary CTA it contains) leaves the
     viewport, so the pill can never sit on top of that button. */
  .l3-floating-cta--in { opacity: 1; transform: none; pointer-events: auto; }
  .l3-floating-cta:hover { background: var(--l3-gold-btn-hover); }
  @media (max-width: 640px) {
    .l3-floating-cta { right: 14px; bottom: 14px; font-size: 0.74rem; padding: 0 16px; min-height: 46px; }
  }

  @media (min-width: 700px) {
    .l3-footer-bottom { flex-direction: row; justify-content: space-between; }
  }

  /* ══════════════════════════════════════════════════════════════════════
     /landingpage additions — everything below is scoped with a .l3h- prefix.
     Colours, fonts, radii and component styling are inherited unchanged from
     the rules above: this variant is a content test, not a redesign, so any
     visual delta would confound the result.
     ══════════════════════════════════════════════════════════════════════ */

  /* ── Trust badges ── */
  .l3h-badges {
    display: flex; flex-wrap: wrap; justify-content: center;
    gap: 8px 18px; margin: 16px 0 0; padding: 0; list-style: none;
  }
  .l3h-badge {
    display: inline-flex; align-items: center; gap: 6px;
    color: var(--l3-text-muted); font-size: 0.78rem; font-weight: 500;
  }
  .l3h-badge-icon { width: 13px; height: 13px; color: var(--l3-gold); flex-shrink: 0; }

  /* ── Hero ── */
  /* The partner strip used to hang below the navbar above the H1. It now lives
     inside the guarantee block, so the hero starts on the headline. */
  .l3h-partner-wrap { margin-top: 32px; }
  /* Fully rounded here: the bottom-only radius existed so the strip could hang
     off the navbar edge. Inside the guarantee card it is a free-standing chip. */
  .l3h-partner-wrap .l3-partner-strip { border-radius: 14px; }
  /* RankCounter is the last hero element (no video block after it, unlike
     /trial), so the hero's bottom padding adds to the next section's 32px top
     padding with nothing in between. 16px keeps that seam at 48px — slightly
     tighter than the 64px between later sections, which is deliberate: the
     rank widget is a visual claim and the case studies immediately below are
     its evidence, so they should read as one thought. */
  .l3h-hero { padding-top: 40px; padding-bottom: 16px; }
  .l3h-hero-h1 { margin-top: 0; }
  .l3h-hero-sub { margin-top: 16px; }
  .l3h-hero-actions { margin-top: 24px; }
  .l3h-badges--hero { margin-top: 14px; }
  .l3h-hero-rating { margin-top: 16px; }
  .l3h-hero-rating .l3-rating-num { font-size: 1.15rem; }
  .l3h-hero-rating .l3-rating-count { font-size: 0.85rem; }
  .l3h-hero .l3-rank-climb-video { margin-top: 34px; }

  /* Everything from the H1 down to the social-proof line must clear an
     iPhone SE (375x667, leaving 595px under the fixed 72px navbar). Only
     vertical rhythm and heading size are tightened — button sizes and the
     badge row are untouched, since they are the point of the rebuild. */
  @media (max-width: 480px) {
    .l3h-hero { padding-top: 22px; padding-bottom: 20px; }
    .l3h-hero-h1 { font-size: 1.78rem; line-height: 1.14; }
    .l3h-hero-sub { margin-top: 12px; font-size: 0.92rem; line-height: 1.55; }
    .l3h-hero-actions { margin-top: 18px; gap: 10px; width: 100%; }
    /* Stacked, full-width: side by side at this width the two buttons wrap into
       an ambiguous two-row grid where neither reads as the main action. */
    .l3h-hero-actions .l3-btn { width: 100%; min-height: 50px; }
    .l3h-hero-actions .l3-btn--ghost { min-height: 44px; font-size: 0.78rem; }
    .l3h-badges--hero { margin-top: 12px; gap: 6px 12px; }
    .l3h-badges--hero .l3h-badge { font-size: 0.72rem; }
    .l3h-hero-rating { margin-top: 12px; gap: 8px; }
    .l3h-hero .l3-rank-climb-video { margin-top: 26px; }
  }

  /* ── Guarantee ── */
  .l3h-guarantee-section { padding-top: 0; }
  .l3h-guarantee {
    border: 1px solid rgba(201,162,74,0.42); border-radius: 24px;
    background: var(--l3-bg-card); box-shadow: var(--l3-shadow);
    padding: 44px 24px 40px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .l3h-guarantee .l3-lead { margin-left: auto; margin-right: auto; }
  /* No opacity here: dimming this to 0.85 put it at 4.38:1 against the card,
     under the 4.5:1 AA floor. The smaller size already sets it apart, and the
     honesty caveat is the last thing that should be hard to read. */
  .l3h-guarantee-honest { font-size: 0.94rem; }
  .l3h-guarantee-bullets {
    list-style: none; margin: 28px 0 0; padding: 0;
    display: grid; gap: 12px; text-align: left; max-width: 560px; width: 100%;
  }
  .l3h-guarantee-bullets li {
    display: flex; align-items: center; gap: 12px;
    color: var(--l3-text); font-size: 0.92rem; font-weight: 500;
  }

  /* ── Objections ── */
  .l3h-objections { display: grid; gap: 16px; margin-top: 44px; }
  .l3h-objection {
    border: 1px solid var(--l3-border); border-radius: 16px;
    background: var(--l3-bg-card); box-shadow: var(--l3-shadow); padding: 24px 22px;
  }
  .l3h-objection h3 { color: var(--l3-text); font-size: 1.02rem; font-weight: 700; line-height: 1.4; }
  .l3h-objection p { margin-top: 12px; color: var(--l3-text-muted); font-size: 0.94rem; line-height: 1.7; }

  @media (min-width: 700px) {
    .l3h-guarantee { padding: 56px 40px 48px; }
    .l3h-objections { grid-template-columns: repeat(2, minmax(0,1fr)); }
  }
`;


const missionStats = [
  { value: "93%", label: "of consumers use Google to find local businesses" },
  { value: "76%", label: "of mobile local searches lead to a visit within 24 hours" },
  { value: "50%", label: "of clicks go to the top 3 local map results" },
  { value: "28%", label: "of local searches result in a purchase" },
];

// Headings unchanged from /trial; only the bodies are rewritten, so each card
// describes work we do rather than work the reader would have to do.
const leadCards = [
  {
    title: "Increase Your Local Visibility",
    subtitle: "Google Maps",
    description: COPY.leadCardBodies["Increase Your Local Visibility"],
    image: increaseLocalVisibility,
  },
  {
    title: "Improve Your Search Performance",
    subtitle: "Google Search",
    description: COPY.leadCardBodies["Improve Your Search Performance"],
    image: improveSearchPerformance,
  },
  {
    title: "No Direct Access Required",
    subtitle: "Safe and effective",
    description: COPY.leadCardBodies["No Direct Access Required"],
    image: noDirectAccess,
  },
  {
    title: "What's Needed for Best Results",
    subtitle: "The right foundation",
    description: COPY.leadCardBodies["What's Needed for Best Results"],
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
  "Fast Results (Top 3 in 90 Days)",
];

const traditionalMissing = new Set([
  "Google Business Profile SEO",
  "GPS-Based Local Activity",
  "Website On-Page Local SEO",
  "Rank Tracking in Local Area",
  "Google Maps Ranking Focus",
  "Google Reviews Automation",
  "Fast Results (Top 3 in 90 Days)",
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
    badge: COPY.guaranteeShort,
    map: "community" as PlanRadiusKey,
    description: "Perfect for local shops and service businesses that want better Google Maps visibility.",
    radius: "2.5-mile radius · 10 keywords · 10–20 direction signals/day",
    popular: false,
    included: communityIncluded,
  },
  {
    name: "City",
    badge: COPY.guaranteeShort,
    map: "city" as PlanRadiusKey,
    description: "Ideal for competitive businesses like clinics that want to dominate Google Maps locally.",
    radius: "5-mile radius · 20 keywords · 30–40 direction signals/day",
    popular: true,
    included: new Set(planFeatureList),
  },
];

/**
 * Reordered against /trial, not rewritten. The first four are the fear
 * questions — access, speed, lock-in, and "is this dodgy?" — and they now sit
 * above the fold of the FAQ so scepticism is answered before the reader gives
 * up on the section. The remaining nine keep their original order.
 */

const TrialPartnerStrip = () => (
  <div className="l3-partner-wrap l3h-partner-wrap">
    <div className="l3-partner-strip">
      <img src={googlePartnerLogo} alt="Google Partner" />
    </div>
  </div>
);

/**
 * Hero, rebuilt around one rule: a visual cannot answer "why should I care?" —
 * only a sentence can. So the headline, the promise, the ask and the risk
 * removal all land before the rank widget, which now backs up the headline
 * instead of speaking in place of it.
 *
 * Everything down to the social-proof line has to fit an iPhone SE without
 * scrolling; the widget is free to sit below the fold.
 */
const TrialHero = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section id="l3-home" className="l3-hero l3h-hero l3-topo">
      <div className="l3-container l3-hero-inner">
        <h1 className="l3-hero-h1 l3h-hero-h1">{COPY.hero.h1}</h1>
        <p className="l3-hero-sub l3h-hero-sub">{COPY.hero.subheadline}</p>

        <div className="l3-hero-actions l3h-hero-actions">
          <button type="button" className="l3-btn" onClick={() => openTrialModal("primary")}>
            {COPY.cta.primary}
          </button>
          <button type="button" className="l3-btn l3-btn--ghost" onClick={() => openTrialModal("secondary")}>
            {COPY.cta.secondary}
          </button>
        </div>

        <TrustBadges className="l3h-badges--hero" />

        {/* TODO: update rating and review count with real data */}
        <div className="l3-rating l3-hero-rating l3h-hero-rating">
          <div className="l3-rating-stars">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-4 w-4" fill="#C9A24A" stroke="#C9A24A" />
            ))}
          </div>
          <span className="l3-rating-num">{COPY.rating.value}</span>
          <span className="l3-rating-count">from {COPY.rating.countLabel}</span>
        </div>

        <RankClimbVideo />
      </div>
    </section>
  );
};

/**
 * Risk reversal, pulled out of the small print inside the pricing cards and
 * given its own block. An expectation nobody reads sets no expectation.
 */
const TrialGuarantee = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section className="l3-section l3h-guarantee-section">
      <div className="l3-container">
        <div className="l3h-guarantee l3-topo">
          <div className="l3-section-head">
            <span className="l3-eyebrow">{COPY.guarantee.eyebrow}</span>
            <h2 className="l3-h2">{COPY.guarantee.h2}</h2>
            <p className="l3-lead l3-center">{COPY.guarantee.body}</p>
            <p className="l3-lead l3-center l3h-guarantee-honest">{COPY.guarantee.honest}</p>
          </div>

          <ul className="l3h-guarantee-bullets">
            {COPY.guarantee.bullets.map((bullet) => (
              <li key={bullet}>
                <span className="l3-plan-check l3-plan-check--yes">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {bullet}
              </li>
            ))}
          </ul>

          <div className="l3-cta-row">
            <button type="button" className="l3-btn" onClick={() => openTrialModal("primary")}>
              {COPY.cta.primary}
            </button>
          </div>
          <TrustBadges />

          {/* Moved here from the top of the page: an accreditation badge is
              third-party proof, so it does its job next to the promise it is
              vouching for rather than floating above the headline. */}
          <TrialPartnerStrip />
        </div>
      </div>
    </section>
  );
};

/** The four things people actually think before booking, answered plainly. */
const TrialObjections = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section className="l3-section">
      <div className="l3-container">
        <div className="l3-section-head">
          <span className="l3-eyebrow">{COPY.objections.eyebrow}</span>
          <h2 className="l3-h2">{COPY.objections.h2}</h2>
        </div>

        <div className="l3h-objections">
          {COPY.objections.items.map((item) => (
            <article key={item.question} className="l3h-objection">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>

        <div className="l3-cta-row">
          <button type="button" className="l3-btn" onClick={() => openTrialModal("primary")}>
            {COPY.cta.primary}
          </button>
        </div>
        <TrustBadges />
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
    <section id="reviews" className="l3-section l3-section--sm">
    <div className="l3-container">
      {/* TODO: update rating and review count with real data */}
      <div className="l3-rating">
        <div className="l3-rating-stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-6 w-6" fill="#C9A24A" stroke="#C9A24A" />
          ))}
        </div>
        <span className="l3-rating-num">{COPY.rating.value}</span>
        <span className="l3-rating-count">out of {COPY.rating.countLabel}</span>
      </div>

      <div className="l3-center" style={{ marginTop: 48 }}>
        <span className="l3-eyebrow">Client reviews</span>
        <h2 className="l3-h2">What local businesses say</h2>
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
                  className="l3-testimonial-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                >
                  <div className="l3-testimonial-head">
                    {t.avatar ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        className="l3-testimonial-avatar"
                        style={t.avatarFit === "contain" ? { objectFit: "contain", padding: 8, background: "#fff" } : undefined}
                        src={t.avatar}
                        alt={t.name}
                      />
                    ) : (
                      <div className="l3-testimonial-avatar l3-testimonial-avatar--initials" aria-hidden="true">
                        {initialsOf(t.name)}
                      </div>
                    )}
                    <div>
                      <div className="l3-testimonial-name">{t.name}</div>
                      <div className="l3-testimonial-company">{t.company}</div>
                    </div>
                  </div>
                  <p className="l3-testimonial-text">&ldquo;{t.text}&rdquo;</p>
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
  <section className="l3-section--sm">
    <div className="l3-container">
      {/* TODO: replace with international/UK+Dubai client logos when available */}
      <div className="l3-logos-row">
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
    <section className="l3-section">
      <div className="l3-container l3-section-head">
        <span className="l3-eyebrow">Our mission</span>
        <h2 className="l3-h2">
          We believe every local business deserves to be <em>found first</em>
        </h2>
        <p className="l3-lead l3-center">
          Being on page one isn't enough when customers only look at the map. Our mission is to put local business
          owners in front of ready-to-buy customers the moment they search — without ad spend, without shortcuts, and
          without waiting years for organic SEO to catch up.
        </p>
        <div className="l3-mission-stats">
          <div className="l3-mission-stat l3-mission-stat--featured">
            <div className="l3-mission-stat-num">
              <CountUpStat value={missionStats[0].value} duration={1800} />
            </div>
            <div className="l3-mission-stat-label">{missionStats[0].label}</div>
          </div>
          <div className="l3-mission-secondary">
            {missionStats.slice(1).map((s) => (
              <div key={s.label} className="l3-mission-stat">
                <div className="l3-mission-stat-num">
                  <CountUpStat value={s.value} duration={1200} />
                </div>
                <div className="l3-mission-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="l3-cta-row">
          <button type="button" className="l3-btn" onClick={() => openTrialModal("primary")}>
            {COPY.cta.primary}
          </button>
          <button type="button" className="l3-btn l3-btn--ghost" onClick={() => openTrialModal("secondary")}>
            {COPY.cta.secondary}
          </button>
        </div>
        <TrustBadges />
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
const L2_CASE_GROUPS: CaseStudy[][] = (() => {
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
    <article className="l3-case">
      <div>
        <div className="l3-case-head">
          <CaseStudyLogo slug={study.slug} glyph={study.icon} business={study.business} />
          <div>
            <h3>
              {study.business}
              {multi && <span className="l3-case-multi-badge">{group.length} keywords</span>}
            </h3>
            <p>{study.location}</p>
          </div>
        </div>

        {multi && (
          <div className="l3-case-keywords">
            <button
              type="button"
              className="l3-case-keyword-arrow"
              aria-label="Previous tracked keyword"
              onClick={() => setActive((i) => (i - 1 + group.length) % group.length)}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <span className="l3-case-keyword-current">
              <span>{study.metrics[0].value}</span>
              <span className="l3-case-keyword-count">{active + 1}/{group.length}</span>
            </span>
            <button
              type="button"
              className="l3-case-keyword-arrow"
              aria-label="Next tracked keyword"
              onClick={() => setActive((i) => (i + 1) % group.length)}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        )}

        <div className="l3-case-metrics">
          {study.metrics.map((m) => (
            <div key={m.label} className={`l3-case-metric${m.stack ? " l3-case-metric--stack" : ""}`}>
              <span className="l3-case-metric-label">{m.label}</span>
              <span className="l3-case-metric-val">{m.value}</span>
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
    <section id="case-studies" className="l3-section">
      <div className="l3-container">
        <div className="l3-section-head">
          <span className="l3-eyebrow">Real results</span>
          <h2 className="l3-h2">
            How local businesses <em>grew</em> on Google Maps
          </h2>
          <p className="l3-lead l3-center">
            Eleven real clients across five countries, seventeen before/after maps — metalwork in West Sussex, hail repair in Texas, removals on the
            Sunshine Coast. Drag the handle to see the same map before and after.
          </p>
        </div>

        <div className="l3-cases">
          {L2_CASE_GROUPS.map((group) => (
            <TrialCaseCard key={group[0].slug} group={group} />
          ))}
        </div>

        <p className="l3-cases-note">
          Rankings, dates and search terms above are measured directly from the Google Maps grid scans shown.
          Rows marked <em>(est.)</em> are estimates modelled from that ranking change using published local-pack
          click-through rates — not figures reported by the client.
        </p>

        <div className="l3-cta-row">
          <button type="button" className="l3-btn" onClick={() => openTrialModal("primary")}>
            {COPY.cta.primary}
          </button>
        </div>
        <TrustBadges />
      </div>
    </section>
  );
};

/* A short run of the same case-study cards, for the home page.
 *
 * It renders the page's own stylesheet and .l3-page wrapper because these cards
 * are styled entirely by the .l3-* rules in CSS above — there is no Tailwind
 * fallback for them, and forking a subset of those rules into a second file
 * would drift the moment either copy is edited. The <style> is the same string
 * constant, so this costs a second <style> element, not a second stylesheet.
 *
 * No modal provider here: the home page's cards close on a link to /services
 * rather than the trial modal, so this component can be dropped anywhere.
 *
 * The "(est.)" disclaimer travels with the cards deliberately — several metrics
 * on them are modelled rather than measured, and that has to be said wherever
 * the numbers are shown. */
export const LandingV3CaseHighlights = ({ limit = 4 }: { limit?: number }) => (
  <div className="l3-page">
    <style dangerouslySetInnerHTML={{ __html: CSS }} />
    <section className="l3-section">
      <div className="l3-container">
        <div className="l3-section-head">
          <span className="l3-eyebrow">Real results</span>
          <h2 className="l3-h2">
            How local businesses <em>grew</em> on Google Maps
          </h2>
          <p className="l3-lead l3-center">
            Real clients, real before/after Google Maps scans. Drag the handle to see the same map before and after.
          </p>
        </div>

        <div className="l3-cases">
          {L2_CASE_GROUPS.slice(0, limit).map((group) => (
            <TrialCaseCard key={group[0].slug} group={group} />
          ))}
        </div>

        <p className="l3-cases-note">
          Rankings, dates and search terms above are measured directly from the Google Maps grid scans shown.
          Rows marked <em>(est.)</em> are estimates modelled from that ranking change using published local-pack
          click-through rates — not figures reported by the client.
        </p>

        <div className="l3-cta-row">
          <Link to="/services" className="l3-btn">
            See all case studies
          </Link>
        </div>
      </div>
    </section>
  </div>
);

const TrialMoreLeads = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section className="l3-section">
      <div className="l3-container">
        <div className="l3-section-head">
          <span className="l3-eyebrow">More leads</span>
          <h2 className="l3-h2">More leads. Higher click-through. Lower ad costs.</h2>
        </div>
        <div className="l3-leadcards">
          {leadCards.map((card, i) => (
            <article key={card.title} className={`l3-leadcard${i === 0 ? " l3-leadcard--featured" : ""}`}>
              <img loading="lazy" decoding="async" src={card.image} alt={card.title} />
              <div>
                <h3>{card.title}</h3>
                <div className="l3-leadcard-sub">{card.subtitle}</div>
                <p className="l3-leadcard-desc">{card.description}</p>
                <button type="button" className="l3-btn l3-btn--sm" onClick={() => openTrialModal("primary")}>
                  {COPY.cta.primary}
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
  <section className="l3-section">
    <div className="l3-container">
      <div className="l3-section-head">
        <span className="l3-eyebrow">Comparison</span>
        <h2 className="l3-h2">Standard SEO vs LlamaMaps+</h2>
        <p className="l3-lead l3-center">Our system works around the clock to improve local visibility.</p>
      </div>
      <div className="l3-compare-grid">
        <div className="l3-compare-col">
          <h3>Standard SEO Strategy</h3>
          {comparisonFeatures.map((f) => {
            const missing = traditionalMissing.has(f);
            return (
              <div key={f} className="l3-compare-item">
                <span className={`l3-compare-mark ${missing ? "l3-compare-mark--no" : "l3-compare-mark--yes"}`}>
                  {missing ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                </span>
                {f}
              </div>
            );
          })}
        </div>
        <div className="l3-compare-col l3-compare-col--plus">
          <h3 style={{ display: "flex", alignItems: "center", gap: 10 }}>
            Standard SEO +
            <img src={llamaLogo} alt="LlamaMaps" style={{ height: 30, width: "auto" }} />
          </h3>
          {comparisonFeatures.map((f) => (
            <div key={f} className="l3-compare-item">
              <span className="l3-compare-mark l3-compare-mark--yes">
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
  <section className="l3-section">
    <div className="l3-container">
      <div className="l3-section-head">
        <span className="l3-eyebrow">Client reviews</span>
        <h2 className="l3-h2">Hear from real clients</h2>
      </div>
      <div className="l3-videos">
        {videoTestimonials.map((v) => (
          <div key={v.id} className="l3-video-card">
            <div className="l3-video-frame">
              <YouTubeFacade videoId={v.id} title={v.title} poster={v.poster} />
            </div>
            <div className="l3-video-ranks">
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
    <section className="l3-section">
      <div className="l3-container">
        <div className="l3-section-head">
          <span className="l3-eyebrow">How to start</span>
          <h2 className="l3-h2">
            Only <em>4 Simple Steps</em>
          </h2>
          <p className="l3-lead l3-center">
            Start your 7-day free trial with no risk, no lock-in, and a clear step-by-step path to stronger Google
            Maps visibility.
          </p>
        </div>

        <div className="l3-cta-row">
          <button type="button" className="l3-btn l3-btn--sm" onClick={() => openTrialModal("primary")}>
            {COPY.cta.primary}
          </button>
        </div>
        <TrustBadges />

        <div className="mt-10 overflow-hidden rounded-[1.25rem] border border-[var(--l3-border)] bg-[#0f2117] shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="grid min-h-[22rem] lg:grid-cols-[0.34fr_0.66fr]">
            <div className="bg-[#0c1d12] px-4 py-4 md:px-5 md:py-5">
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
                      <span className="absolute right-0 flex h-[3.35rem] w-[3.35rem] translate-x-[12%] items-center justify-center rounded-full border-[5px] border-[#0D1F17] bg-[#8A6A1F] text-[2rem] font-light text-white md:h-[3.6rem] md:w-[3.6rem]">
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
              className="bg-[#132722] px-6 py-5 md:px-8 md:py-6"
            >
              <div className="mx-auto max-w-[44rem]">
                <h3
                  className="text-[1.8rem] font-medium leading-[1.15] tracking-[-0.01em] text-[#F4F1EA] md:text-[2.05rem]"
                  style={{ fontFamily: "var(--l3-serif)" }}
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
                          <span className="mt-[0.1rem] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#C9A24A] text-[0.95rem] font-black leading-none text-[#0D1F17]">
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
    <section id="plans" className="l3-section">
      <div className="l3-container">
        <div className="l3-section-head">
          <span className="l3-eyebrow">Plans</span>
          <h2 className="l3-h2">Choose your growth plan</h2>
        </div>
        <div className="l3-plans">
          {plans.map((plan) => (
            <article key={plan.name} className={`l3-plan${plan.popular ? " l3-plan--popular" : ""}`}>
              {plan.popular && <span className="l3-plan-popular-tag">Most Popular</span>}
              <span className="l3-plan-badge">{plan.badge}</span>
              <div className="l3-plan-visual">
                <PlanRadiusMap plan={plan.map} />
              </div>
              <h3>{plan.name}</h3>
              <p className="l3-plan-desc">{plan.description}</p>
              <div className="l3-plan-price">
                <span style={{ fontWeight: 700, color: "var(--l3-text)" }}>{plan.radius}</span>
              </div>
              <ul className="l3-plan-included">
                {planFeatureList.map((feature) => {
                  const yes = plan.included.has(feature);
                  return (
                    <li key={feature}>
                      <span className={`l3-plan-check ${yes ? "l3-plan-check--yes" : "l3-plan-check--no"}`}>
                        {yes ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                      </span>
                      {feature}
                    </li>
                  );
                })}
              </ul>
              <button type="button" className="l3-btn" onClick={() => openTrialModal("primary")}>
                {COPY.cta.primary}
              </button>
            </article>
          ))}
        </div>
        {/* One badge row under the grid rather than one per card — repeating the
            same three reassurances twice, side by side, reads as filler. */}
        <TrustBadges />
      </div>
    </section>
  );
};

const TrialFaq = () => (
  <section id="faq" className="l3-section">
    <div className="l3-container">
      <div className="l3-section-head">
        <span className="l3-eyebrow">FAQ</span>
        <h2 className="l3-h2">Frequently Asked Questions</h2>
      </div>
      <div style={{ maxWidth: 780, margin: "44px auto 0", display: "grid", gap: 12 }}>
        {faqs.map((faq) => (
          <details key={faq.question} className="l3-faq-item">
            <summary>
              <span>{faq.question}</span>
              <span className="l3-faq-plus" aria-hidden="true">+</span>
            </summary>
            <p className="l3-faq-answer">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const TrialFinalCta = () => {
  const { openTrialModal } = useTrialModal();
  return (
    <section className="l3-section l3-topo">
      <div className="l3-container l3-section-head">
        <h2 className="l3-h2">
          Start your <em>free 7-day trial</em> today
        </h2>
        {/* Built from COPY.badges rather than typed out: this sentence restates
            the same three promises as the badge row below it, and hardcoding
            them is exactly how it came to say "No commitment" while the badges
            said "Cancel anytime". */}
        <p className="l3-lead l3-center">
          {COPY.badges.join(". ")}. See real ranking movement before you pay a single euro.
        </p>
        <div className="l3-cta-row">
          <button type="button" className="l3-btn l3-btn--final" onClick={() => openTrialModal("primary")}>
            {COPY.cta.primary} <span className="l3-btn-icon"><ArrowRight className="ml-1 h-4 w-4" /></span>
          </button>
          <button type="button" className="l3-btn l3-btn--ghost" onClick={() => openTrialModal("secondary")}>
            {COPY.cta.secondary}
          </button>
        </div>
        <TrustBadges />
      </div>
    </section>
  );
};

/* Which chrome wraps the v3 content.
 *
 * "landing" is the original: the page's own compact navbar (in-page anchors, no
 * way out) and its own footer, because /landingpage-v3 is an ad destination and
 * every link off it is a lost conversion.
 *
 * "site" is /services, where the same content is a page of llamamaps.com and has
 * to carry the site's navigation and footer like every other page. The body of
 * the page — every section, every word, every style — is identical between the
 * two; only the top and bottom differ. */
export type LandingV3Chrome = "landing" | "site";

export const LandingPageV3Content = ({ chrome = "landing" }: { chrome?: LandingV3Chrome }) => (
  <MotionConfig reducedMotion="user">
    <div className="l3-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {chrome === "site" ? <Navbar /> : <TrialNavbar />}
      {/* Order is deliberate and differs from /trial: the strongest proof
          (verified before/after maps, then client video) sits immediately under
          the hero and stays statically visible, because roughly 60% of visitors
          never scroll and nobody sees what is parked behind a carousel. The
          weakest proof — the written testimonials — drops to position
          12, and the guarantee and objection blocks are new. */}
      <main className={chrome === "site" ? "l3-main l3-main--site" : "l3-main"}>
        {/* 1 */} <TrialHero />
        {/* Task: the "Why aren't you visible on Google?" section moves up to
            sit directly under the hero. It is the page's problem statement --
            it names the thing the rest of the page sells against -- and it was
            running fourth, after two blocks of proof for a problem the reader
            had not been shown yet. */}
        {/* 2 */} <TrialInvisibilitySection />
        {/* 3 */} <TrialCaseStudies />
        {/* 4 */} <TrialVideoTestimonials />
        {/* 5 */} <TrialMission />
        {/* 6 */} <TrialMoreLeads />
        {/* 7 */} <TrialGuarantee />
        {/* 8 */} <TrialComparison />
        {/* 9 */} <TrialSteps />
        {/* 10 */} <TrialPlans />
        {/* 11 */} <TrialObjections />
        {/* 12 */} <TrialRatingAndReviews />
        {/* 13 */} <TrialFaq />
        {/* 14 */} <TrialFinalCta />
        <TrialLogosStrip />
      </main>
      {chrome === "site" ? <SiteFooter /> : <TrialFooter />}
      <TrialFloatingCta />
    </div>
  </MotionConfig>
);

const LandingPageV3Page = () => {
  useEffect(() => {
    document.body.classList.add("l3-active");
    return () => document.body.classList.remove("l3-active");
  }, []);

  useEffect(() => {
    trackHormoziView();
    return installScrollDepthTracking();
  }, []);

  return (
    <>
      <SeoHormozi
        title="Free 7-Day Google Maps Trial (V2) | LlamaMaps"
        description="Top 3 on Google Maps in 90 days. Start your free 7-day trial with LlamaMaps: no card, no account access, no contract."
        noindex
        // Same A/B relationship as the V1 pair, one level down: this page is
        // the duplicate and /trial-v2 is its original, so the canonical points
        // there. A literal path rather than landingPageCanonical(), which
        // resolves the V1 pair across the .eu/.co.uk domain split -- the V2
        // pages are review builds that exist on the main site only, so there
        // is no second origin for it to resolve against.
        canonicalPath="/trial-v2"
        jsonLd={[organizationSchema(), faqSchema(faqs)]}
      />
      <TrialModalProvider>
        <LandingPageV3Content />
      </TrialModalProvider>
    </>
  );
};

export default LandingPageV3Page;

import { useEffect, useRef, useState } from "react";
import { trackMetaEvent } from "@/lib/metaPixel";
import MapRankAnimation from "@/components/MapRankAnimation";
import Navbar from "@/components/Navbar";
import CalendlyWidget from "@/components/CalendlyWidget";
import llamaLogo from "@/assets/llama-logo.webp";
import clinicBefore from "@/assets/results/clinic-dpc-before.webp";
import clinicAfter from "@/assets/results/clinic-dpc-after.webp";
import wheelshopLogo from "@/assets/results/wheelshop-logo.webp";
import wheelshopBefore from "@/assets/results/wheelshop-before.webp";
import wheelshopAfter from "@/assets/results/wheelshop-after.webp";
import basLogo from "@/assets/results/bas-logo.webp";
import accountingStatistic from "@/assets/results-home/accounting-gmb-statistic.webp";

const CSS = `
  .lm-page { overflow-x: hidden; font-family: 'DM Sans', sans-serif; }

  /* ─── Variables ─── */
  .lm-page {
    --lm-green:        #1a7a42;
    --lm-green-dark:   #155c32;
    --lm-green-light:  #22c55e;
    --lm-forest:       #061510;
    --lm-deep:         #0d3320;
    --lm-mid:          #185c35;
    --lm-soft:         #f0faf4;
    --lm-line:         #c8e8d4;
    --lm-navy:         #0b1f13;
    --lm-text:         #3d5447;
    --lm-surface:      #ffffff;
    --lm-shadow:       0 20px 56px rgba(10, 40, 20, 0.09);
    --lm-radius:       26px;
    --lm-cta:          linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    --lm-cta-hover:    linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    --lm-cta-shadow:   0 16px 38px rgba(124, 58, 237, 0.36), 0 8px 20px rgba(139, 92, 246, 0.22);
    --lm-cta-shadow-h: 0 22px 48px rgba(124, 58, 237, 0.46), 0 10px 24px rgba(139, 92, 246, 0.28);
  }

  html { scroll-behavior: smooth; }
  body.lm-active { margin: 0; background: #fff; }

  .lm-btn, .lm-btn-inline {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 50px; border: 0; border-radius: 14px;
    background: var(--lm-cta); color: #fff;
    font-size: 0.86rem; font-weight: 800; letter-spacing: 0.04em;
    padding: 0 26px; text-align: center; text-transform: uppercase;
    box-shadow: var(--lm-cta-shadow);
    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer; text-decoration: none;
  }
  .lm-btn:hover, .lm-btn-inline:hover {
    background: var(--lm-cta-hover);
    box-shadow: var(--lm-cta-shadow-h);
    transform: translateY(-2px);
  }

  .lm-main { padding-top: 80px; }

  /* ─── Container ─── */
  .container { max-width: 1260px; margin: 0 auto; padding: 0 24px; }

  /* ─── Hero ─── */
  .lm-hero {
    position: relative; padding: 80px 0 120px;
    background:
      radial-gradient(ellipse at 8% 20%, rgba(74, 222, 128, 0.18), transparent 30%),
      radial-gradient(ellipse at 92% 10%, rgba(22, 163, 74, 0.22), transparent 28%),
      radial-gradient(ellipse at 50% 90%, rgba(4, 120, 87, 0.1), transparent 36%),
      linear-gradient(155deg, #061510 0%, #0d3320 35%, #185c35 70%, #1e7a42 100%);
    overflow: hidden;
    isolation: isolate;
  }
  .lm-hero::after {
    position: absolute; left: 0; right: 0; bottom: -1px;
    height: 90px; content: "";
    background: linear-gradient(180deg, transparent 0%, #fff 100%);
    clip-path: polygon(0 44%, 100% 0, 100% 100%, 0 100%);
    z-index: 1;
  }

  /* decorative map-pin dots */
  .lm-hero-dots {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      radial-gradient(circle 2px at 20% 30%, rgba(255,255,255,0.18) 100%, transparent 100%),
      radial-gradient(circle 2px at 70% 20%, rgba(255,255,255,0.14) 100%, transparent 100%),
      radial-gradient(circle 2px at 85% 65%, rgba(255,255,255,0.12) 100%, transparent 100%),
      radial-gradient(circle 2px at 15% 75%, rgba(255,255,255,0.1) 100%, transparent 100%);
  }

  .lm-hero-inner {
    position: relative; z-index: 2;
    display: grid; gap: 60px;
    align-items: center;
  }

  .lm-hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(74, 222, 128, 0.36);
    border-radius: 999px;
    background: rgba(22, 163, 74, 0.18);
    color: #86efac; font-size: 0.74rem; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    padding: 9px 16px;
  }
  .lm-hero-eyebrow::before {
    content: ""; width: 7px; height: 7px; border-radius: 50%;
    background: #4ade80; box-shadow: 0 0 8px #4ade80;
    flex-shrink: 0;
  }

  .lm-hero-h1 {
    margin-top: 20px; color: #fff;
    font-size: clamp(2.6rem, 7vw, 5.4rem);
    font-weight: 700; letter-spacing: -0.045em; line-height: 1;
    text-shadow: 0 16px 38px rgba(6, 21, 16, 0.5);
  }
  .lm-hero-h1 em {
    font-style: normal; display: block;
    background: linear-gradient(130deg, #86efac 0%, #4ade80 40%, #f0fdf4 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    padding-bottom: 0.12em;
  }

  .lm-hero-sub {
    margin-top: 22px; color: rgba(255,255,255,0.8);
    font-size: 1.1rem; line-height: 1.82; max-width: 600px;
  }

  .lm-hero-pills {
    display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px;
  }
  .lm-pill {
    display: inline-flex; align-items: center; gap: 7px;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 999px;
    background: rgba(13, 51, 32, 0.55);
    color: #fff; font-size: 0.88rem; font-weight: 600;
    padding: 9px 15px;
  }
  .lm-pill::before {
    content: "✓"; width: 18px; height: 18px; border-radius: 50%;
    background: rgba(74, 222, 128, 0.2); color: #4ade80;
    font-size: 0.72rem; font-weight: 900;
    display: inline-flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .lm-hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px; }
  .lm-hero-actions .lm-btn { min-height: 58px; font-size: 0.92rem; border-radius: 16px; padding: 0 30px; }
  .lm-hero-ghost {
    color: rgba(255,255,255,0.84); font-size: 0.96rem; font-weight: 600;
    text-decoration: underline; text-underline-offset: 4px;
    background: transparent; border: 0; cursor: pointer; padding: 0;
  }

  /* stats row inside hero */
  .lm-hero-stats {
    display: grid; gap: 16px;
    grid-template-columns: repeat(3, minmax(0,1fr));
  }
  .lm-hero-stat {
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 22px;
    background: rgba(13, 51, 32, 0.52);
    backdrop-filter: blur(10px);
    padding: 22px 18px;
    box-shadow: 0 18px 44px rgba(6, 21, 16, 0.24);
  }
  .lm-hero-stat-num {
    display: block; color: #4ade80;
    font-size: 1.9rem; font-weight: 800;
    letter-spacing: -0.04em; line-height: 1;
  }
  .lm-hero-stat-label {
    display: block; margin-top: 8px;
    color: rgba(255,255,255,0.78); font-size: 0.88rem; font-weight: 600; line-height: 1.5;
  }

  /* ─── Sections ─── */
  .lm-section { padding: 80px 0; }
  .lm-section--sm { padding: 60px 0; }
  .lm-section-label {
    display: inline-block; font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--lm-green); margin-bottom: 12px;
  }
  .lm-h2 {
    color: var(--lm-navy); font-size: clamp(2rem, 5.5vw, 3.6rem);
    font-weight: 700; letter-spacing: -0.04em; line-height: 1.06;
  }
  .lm-h2 em {
    font-style: normal;
    background: linear-gradient(130deg, var(--lm-green-dark), var(--lm-green-light));
    -webkit-background-clip: text; background-clip: text; color: transparent;
    padding-bottom: 0.1em; display: inline-block;
  }
  .lm-lead {
    margin-top: 16px; color: var(--lm-text);
    font-size: 1.02rem; line-height: 1.85;
  }
  .lm-cta-row { display: flex; justify-content: center; margin-top: 32px; }

  /* ─── Plan Table (compact) ─── */
  .lm-ptable-wrap {
    margin-top: 52px;
    overflow-x: auto;
    border-radius: 20px;
    border: 1px solid var(--lm-line);
    box-shadow: 0 12px 40px rgba(15,23,42,0.07);
  }
  .lm-ptable {
    width: 100%;
    border-collapse: collapse;
    min-width: 460px;
    background: #fff;
  }
  .lm-ptable thead tr {
    background: linear-gradient(90deg, #6d3ab2, #8d58cf);
  }
  .lm-ptable thead th {
    padding: 14px 16px;
    color: #fff;
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid #4e3482;
  }
  .lm-ptable thead th:first-child { text-align: left; }
  .lm-ptable thead th:not(:first-child) { text-align: center; }
  .lm-ptable tbody tr:nth-child(odd) { background: #fff; }
  .lm-ptable tbody tr:nth-child(even) { background: #f7f8fc; }
  .lm-ptable td {
    padding: 10px 14px;
    border: 1px solid #c5ccd8;
    font-size: 0.87rem;
    vertical-align: middle;
    line-height: 1.3;
  }
  .lm-ptable td:first-child { font-weight: 700; color: #171717; }
  .lm-ptable td:not(:first-child) { text-align: center; color: #334155; }
  .lm-ptable .lm-pt-plus { font-size: 1.1rem; font-weight: 900; color: #16a34a; }
  .lm-ptable .lm-pt-minus { font-size: 1.1rem; font-weight: 900; color: #cbd5e1; }
  .lm-ptable .lm-pt-maxi-only { background: #f0fdf4; }
  .lm-ptable .lm-pt-maxi-only td:first-child { color: #15803d; }
  /* ─── How it works ─── */
  .lm-steps { display: grid; gap: 2px; margin-top: 44px; }
  .lm-step {
    display: grid; grid-template-columns: 56px minmax(0,1fr);
    gap: 20px; align-items: start;
    border: 1px solid var(--lm-line);
    border-radius: 22px;
    background: #fff;
    box-shadow: var(--lm-shadow);
    padding: 26px 24px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
  }
  .lm-step:hover { transform: translateY(-4px); box-shadow: 0 28px 64px rgba(10,40,20,0.12); }
  .lm-step-num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 52px; height: 52px; border-radius: 16px;
    background: var(--lm-cta);
    color: #fff; font-size: 1.3rem; font-weight: 900;
    box-shadow: 0 12px 28px rgba(22, 163, 74, 0.28);
    flex-shrink: 0;
  }
  .lm-step h3 { color: var(--lm-navy); font-size: 1.18rem; font-weight: 700; letter-spacing: -0.02em; }
  .lm-step p { margin-top: 6px; color: var(--lm-text); font-size: 0.98rem; line-height: 1.78; }

  /* ─── Feature cards ─── */
  .lm-features { display: grid; gap: 18px; margin-top: 44px; }
  .lm-feature {
    display: grid; grid-template-columns: 64px minmax(0,1fr);
    gap: 18px; align-items: start;
    border: 1px solid var(--lm-line);
    border-left: 4px solid transparent;
    border-radius: 20px;
    background: rgba(255,255,255,0.97);
    box-shadow: var(--lm-shadow);
    padding: 26px 22px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .lm-feature:hover { transform: translateX(4px); box-shadow: 0 24px 56px rgba(10,40,20,0.1); }
  .lm-feature:nth-child(1) { border-left-color: #22c55e; }
  .lm-feature:nth-child(2) { border-left-color: #3b82f6; }
  .lm-feature:nth-child(3) { border-left-color: #f59e0b; }
  .lm-feature:nth-child(4) { border-left-color: #8b5cf6; }
  .lm-feature-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.14), rgba(22, 163, 74, 0.2));
    color: var(--lm-green); font-size: 1.4rem; font-weight: 900;
    box-shadow: 0 12px 28px rgba(22, 163, 74, 0.14);
    flex-shrink: 0;
  }
  .lm-feature:nth-child(2) .lm-feature-icon {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.14), rgba(37, 99, 235, 0.18));
    color: #2563eb; box-shadow: 0 12px 28px rgba(37, 99, 235, 0.14);
  }
  .lm-feature:nth-child(3) .lm-feature-icon {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.14), rgba(217, 119, 6, 0.18));
    color: #d97706; box-shadow: 0 12px 28px rgba(217, 119, 6, 0.14);
  }
  .lm-feature:nth-child(4) .lm-feature-icon {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.14), rgba(109, 40, 217, 0.18));
    color: #7c3aed; box-shadow: 0 12px 28px rgba(109, 40, 217, 0.14);
  }
  .lm-feature h3 { color: var(--lm-navy); font-size: 1.12rem; font-weight: 700; letter-spacing: -0.02em; }
  .lm-feature p { margin-top: 8px; color: var(--lm-text); font-size: 0.97rem; line-height: 1.78; }

  /* ─── Case studies ─── */
  .lm-cases { display: grid; gap: 24px; margin-top: 44px; }
  .lm-case {
    border: 1px solid var(--lm-line);
    border-top: 4px solid transparent;
    border-radius: 28px;
    background: linear-gradient(180deg, #fff 0%, #f7fdf9 100%);
    box-shadow: var(--lm-shadow);
    padding: 26px;
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    overflow: hidden; position: relative;
  }
  .lm-case::before {
    position: absolute; top: -28px; right: -28px; width: 110px; height: 110px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(74, 222, 128, 0.1), transparent 70%);
    content: ""; pointer-events: none;
  }
  .lm-case:hover { transform: translateY(-5px); box-shadow: 0 30px 72px rgba(10,40,20,0.13); }
  .lm-case:nth-child(1) { border-top-color: #22c55e; }
  .lm-case:nth-child(2) { border-top-color: #3b82f6; }
  .lm-case:nth-child(3) { border-top-color: #f59e0b; }

  .lm-case-head { display: flex; align-items: center; gap: 14px; }
  .lm-case-icon {
    width: 54px; height: 54px; border-radius: 16px; flex-shrink: 0;
    display: inline-flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, var(--lm-green), var(--lm-green-dark));
    color: #fff; font-size: 1.6rem;
  }
  .lm-case-logo {
    width: 54px; height: 54px; border-radius: 16px; flex-shrink: 0;
    border: 1px solid #e2e8f0; background: #fff;
    object-fit: contain; padding: 8px;
  }
  .lm-case-head h3 { color: var(--lm-navy); font-size: 1.24rem; font-weight: 700; letter-spacing: -0.02em; }
  .lm-case-head p { margin-top: 4px; color: var(--lm-green); font-size: 0.88rem; font-weight: 700; }
  .lm-case-title { margin-top: 16px; color: var(--lm-navy); font-size: 1.36rem; font-weight: 700; letter-spacing: -0.03em; line-height: 1.15; }
  .lm-case-body { margin-top: 12px; color: var(--lm-text); font-size: 0.95rem; line-height: 1.82; }
  .lm-case-quote {
    margin-top: 14px; color: var(--lm-text); font-size: 0.95rem; line-height: 1.8;
    border-left: 3px solid rgba(22, 163, 74, 0.3); padding-left: 14px; font-weight: 600;
  }
  .lm-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
  .lm-tag {
    display: inline-flex; align-items: center;
    border: 1px solid #d1f0de; border-radius: 999px;
    background: #f0faf4; color: #155c32;
    font-size: 0.8rem; font-weight: 600; padding: 7px 12px;
  }

  .lm-proof { margin-top: 20px; }
  .lm-proof-pair { display: grid; gap: 14px; }
  .lm-proof-box {
    overflow: hidden; border-radius: 20px;
    border: 1px solid #dfe7f2; background: #fff;
    box-shadow: 0 12px 30px rgba(10, 40, 20, 0.06);
  }
  .lm-proof-box img { width: 100%; height: auto; display: block; }
  .lm-proof-head, .lm-proof-foot {
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px; padding: 10px 14px;
  }
  .lm-proof-head { border-bottom: 1px solid #eef2f7; }
  .lm-proof-foot { border-top: 1px solid #eef2f7; color: #54657d; font-size: 0.82rem; }
  .lm-proof-before .lm-proof-head, .lm-proof-before .lm-proof-foot { background: #fff7ed; color: #c2410c; }
  .lm-proof-after  .lm-proof-head, .lm-proof-after  .lm-proof-foot { background: #f0fdf4; color: #15803d; }
  .lm-proof-head strong { font-size: 0.88rem; letter-spacing: 0.04em; text-transform: uppercase; }
  .lm-proof-rank {
    border-radius: 999px; color: #fff;
    font-size: 0.78rem; font-weight: 800; padding: 5px 10px;
  }
  .lm-proof-before .lm-proof-rank { background: linear-gradient(135deg, #f97316, #ea580c); }
  .lm-proof-after  .lm-proof-rank { background: linear-gradient(135deg, #22c55e, #16a34a); }

  .lm-proof-single {
    overflow: hidden; border-radius: 22px;
    border: 1px solid #dfe7f2; background: #fff;
    box-shadow: 0 12px 30px rgba(10, 40, 20, 0.06);
  }
  .lm-proof-single img { width: 100%; height: auto; display: block; }
  .lm-proof-single-meta { padding: 14px 16px 18px; }
  .lm-proof-single-meta strong { display: block; color: var(--lm-navy); font-size: 0.96rem; font-weight: 800; margin-bottom: 5px; }
  .lm-proof-single-meta span { color: var(--lm-text); font-size: 0.88rem; line-height: 1.7; }

  /* ─── Checklist ─── */
  .lm-section--dark {
    background:
      radial-gradient(ellipse at top left, rgba(74, 222, 128, 0.1), transparent 28%),
      radial-gradient(ellipse at bottom right, rgba(34, 197, 94, 0.08), transparent 26%),
      linear-gradient(155deg, #0d3320 0%, #185c35 55%, #1e7a42 100%);
    position: relative; overflow: hidden;
  }
  .lm-section--dark::before {
    position: absolute; left: 0; right: 0; top: -1px;
    height: 76px; content: "";
    background: linear-gradient(180deg, #fff 0%, transparent 100%);
    clip-path: polygon(0 0, 100% 44%, 100% 0);
    z-index: 1;
  }
  .lm-section--dark::after {
    position: absolute; left: 0; right: 0; bottom: -1px;
    height: 76px; content: "";
    background: linear-gradient(180deg, transparent 0%, #fff 100%);
    clip-path: polygon(0 0, 100% 30%, 100% 100%, 0 100%);
    z-index: 1;
  }
  .lm-section--dark .lm-section-label { color: #86efac; }
  .lm-section--dark .lm-h2 { color: #fff; }
  .lm-section--dark .lm-h2 em { background: linear-gradient(130deg, #86efac 0%, #4ade80 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .lm-section--dark .lm-lead { color: rgba(255,255,255,0.78); }

  .lm-checklist { display: grid; gap: 12px; margin-top: 40px; max-width: 820px; margin-left: auto; margin-right: auto; }
  .lm-check-item {
    display: flex; align-items: center; gap: 14px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 18px;
    background: rgba(255,255,255,0.07);
    box-shadow: 0 18px 42px rgba(6, 21, 16, 0.2);
    color: #fff; font-size: 1.04rem; font-weight: 700;
    padding: 20px 22px;
    backdrop-filter: blur(6px);
  }
  .lm-check-mark {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 999px; flex-shrink: 0;
    background: rgba(74, 222, 128, 0.18); color: #86efac;
    font-size: 0.9rem; font-weight: 900;
  }
  .lm-section--dark .lm-cta-row { position: relative; z-index: 2; }

  /* ─── Contact ─── */
  .lm-contact-wrap {
    border-radius: 32px; overflow: hidden;
    background:
      radial-gradient(ellipse at top right, rgba(255,255,255,0.08), transparent 32%),
      linear-gradient(145deg, #0d3320 0%, #185c35 52%, #1e7a42 100%);
    box-shadow: 0 28px 68px rgba(10, 40, 20, 0.22);
    color: #fff; padding: 36px 28px;
  }
  .lm-contact-grid { display: grid; gap: 36px; }
  .lm-contact-title { color: #fff; font-size: clamp(2rem, 5.5vw, 3.8rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1.04; }
  .lm-contact-title em { font-style: normal; background: linear-gradient(130deg, #86efac, #4ade80); -webkit-background-clip: text; background-clip: text; color: transparent; padding-bottom: 0.1em; display: inline-block; }
  .lm-contact-copy { margin-top: 14px; color: rgba(255,255,255,0.8); font-size: 0.98rem; line-height: 1.85; max-width: 580px; }

  .lm-contact-info { display: grid; gap: 12px; margin-top: 24px; }
  .lm-info-card {
    border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;
    background: rgba(6, 21, 16, 0.5); backdrop-filter: blur(10px);
    padding: 20px 22px; box-shadow: 0 18px 44px rgba(0,0,0,0.16);
  }
  .lm-info-card h3 { color: #fff; font-size: 1.2rem; font-weight: 700; }
  .lm-info-card p, .lm-info-card a { color: rgba(255,255,255,0.85); font-size: 0.95rem; line-height: 1.8; margin-top: 10px; display: block; }
  .lm-info-card a:hover { color: #fff; }

  .lm-socials { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .lm-socials a {
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 40px; border: 1px solid rgba(255,255,255,0.16); border-radius: 999px;
    background: rgba(255,255,255,0.06); color: #fff;
    font-size: 0.82rem; font-weight: 700; letter-spacing: 0.04em;
    padding: 0 14px; text-transform: uppercase; transition: background 0.2s, border-color 0.2s;
  }
  .lm-socials a:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.28); }

  .lm-form { margin-top: 6px; }
  .lm-form-grid { display: grid; gap: 14px; }
  .lm-input, .lm-textarea {
    width: 100%; box-sizing: border-box;
    border: 1px solid rgba(255,255,255,0.1); border-radius: 18px;
    background: rgba(6, 21, 16, 0.5); color: #fff;
    font-size: 0.98rem; line-height: 1.5; padding: 18px 20px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .lm-input::placeholder, .lm-textarea::placeholder { color: rgba(255,255,255,0.42); }
  .lm-input:focus, .lm-textarea:focus {
    border-color: rgba(74, 222, 128, 0.4);
    box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
  }
  .lm-input { min-height: 62px; }
  .lm-textarea { min-height: 180px; resize: vertical; }
  .lm-form-btn {
    width: 100%; min-height: 58px; border: 0; border-radius: 16px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #fff;
    font-size: 0.98rem; font-weight: 800; letter-spacing: 0.04em;
    text-transform: uppercase; padding: 0 22px;
    cursor: pointer; transition: transform 0.2s, opacity 0.2s;
    box-shadow: var(--lm-cta-shadow);
  }
  .lm-form-btn:hover { transform: translateY(-1px); opacity: 0.96; }
  .lm-form-btn:disabled { opacity: 0.65; cursor: default; transform: none; }
  .lm-form-note { margin-top: 12px; color: rgba(255,255,255,0.74); font-size: 0.84rem; font-weight: 600; letter-spacing: 0.02em; }
  .lm-form-fb { margin-top: 12px; font-size: 0.92rem; font-weight: 700; line-height: 1.6; }
  .lm-form-fb.ok { color: #bbf7d0; }
  .lm-form-fb.err { color: #fecaca; }

  /* ─── Sticky mobile CTA ─── */
  .lm-sticky { display: none; }

  /* ─── Responsive ─── */
  @media (min-width: 680px) {
    .lm-proof-pair, .lm-form-grid--split, .lm-contact-info { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .lm-features { grid-template-columns: repeat(2, minmax(0,1fr)); }
  }

  @media (min-width: 960px) {
    .lm-main { padding-top: 80px; }
    .lm-hero-inner { grid-template-columns: minmax(0,1.1fr) minmax(260px,0.9fr); }
    .lm-steps { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px; }
    .lm-cases { grid-template-columns: repeat(3, minmax(0,1fr)); }
    .lm-contact-grid { grid-template-columns: minmax(0,1fr) minmax(320px,0.96fr); }
    .lm-contact-wrap { padding: 48px; }
    .lm-section { padding: 96px 0; }
    .lm-section--sm { padding: 68px 0; }
  }

  @media (min-width: 1200px) {
    .lm-steps { grid-template-columns: repeat(4, minmax(0,1fr)); }
    .lm-features { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .lm-hero-stats { grid-template-columns: repeat(3, minmax(0,1fr)); }
  }

  @media (max-width: 760px) {
    body.lm-active { padding-bottom: 100px; }
    .lm-hero { padding: 70px 0 100px; }
    .lm-hero-h1 { font-size: clamp(2.7rem, 11vw, 4.2rem); }
    .lm-hero-stats { grid-template-columns: repeat(3, minmax(0,1fr)); }
    .lm-hero-stat-num { font-size: 1.45rem; }
    .lm-sticky {
      position: fixed; left: 16px; right: 16px; bottom: 12px; z-index: 90;
      display: flex; align-items: center; justify-content: center;
      min-height: 56px; border-radius: 14px;
      background: var(--lm-cta); box-shadow: var(--lm-cta-shadow-h);
      color: #fff; font-size: 0.9rem; font-weight: 800;
      letter-spacing: 0.03em; text-transform: uppercase; text-align: center; padding: 0 16px;
    }
    body.lm-active .calendly-badge-widget { bottom: 84px !important; }
  }
`;

const CALENDLY_URL = "/contacts/#llamamaps-contacts-calendar";

export default function FreeTrialPage() {
  const [feedback, setFeedback] = useState<{ msg: string; type: "ok" | "err" | "" }>({ msg: "", type: "" });
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    document.body.classList.add("lm-active");
    return () => document.body.classList.remove("lm-active");
  }, []);

  async function sendEmail(templateId: string, params: Record<string, string>) {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: "service_6i74o6o",
        template_id: templateId,
        user_id: "GNLsUqAy4YbvwMoIc",
        template_params: params,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const name    = (fd.get("name")    as string).trim();
    const email   = (fd.get("email")   as string).trim();
    const phone   = (fd.get("phone")   as string).trim();
    const message = (fd.get("message") as string).trim();

    setSending(true);
    setFeedback({ msg: "", type: "" });

    const params = {
      from_name: name, from_email: email,
      phone: phone || "Not provided",
      message: message || "Not provided",
      reply_to: email,
      company_name: "LlamaMaps",
      inquiry_subject: `New enquiry from ${name}`,
      submitted_at: new Date().toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" }),
    };

    try {
      await sendEmail("template_nbb5j0d", params);
      await sendEmail("template_ango4v7", params);
      formRef.current.reset();
      trackMetaEvent("Lead", { content_name: "Free Trial Form" });
      setFeedback({ msg: "Your message has been sent. We'll be in touch shortly.", type: "ok" });
    } catch {
      setFeedback({ msg: "Couldn't send your message. Please try again in a moment.", type: "err" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="lm-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <Navbar />

      <main className="lm-main">
        {/* ── Hero ── */}
        <section className="lm-hero">
          <div className="lm-hero-dots" />
          <div className="container">
            <div className="lm-hero-inner">
              <div>
                <div className="lm-hero-eyebrow">Free · 7 days · €0</div>
                <h1 className="lm-hero-h1">
                  See exactly where you rank
                  <em>on Google Maps</em>
                </h1>
                <p className="lm-hero-sub">
                  In 7 days we scan 10 local keywords across a 2.5 mi radius around your business and show you your real Google Maps position — no logins, no credit card, no strings.
                </p>
                <div className="lm-hero-pills">
                  <span className="lm-pill">No card required</span>
                  <span className="lm-pill">No account access needed</span>
                  <span className="lm-pill">No commitment</span>
                </div>
                <div className="lm-hero-actions">
                  <a className="lm-btn" href={CALENDLY_URL}>Start Your 7-Day Free Trial</a>
                  <a className="lm-hero-ghost" href="#lm-contact">Or fill in the form ↓</a>
                </div>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                <div style={{
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 32,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.93) 0%, rgba(220,242,228,0.88) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), 0 36px 80px rgba(6,21,16,0.34)",
                  padding: "4px 4px 0",
                  overflow: "hidden",
                }}>
                  <MapRankAnimation />
                </div>
                <div className="lm-hero-stats">
                  <div className="lm-hero-stat">
                    <span className="lm-hero-stat-num">10</span>
                    <span className="lm-hero-stat-label">Keywords scanned within your area</span>
                  </div>
                  <div className="lm-hero-stat">
                    <span className="lm-hero-stat-num">2.5 mi</span>
                    <span className="lm-hero-stat-label">Radius coverage around your location</span>
                  </div>
                  <div className="lm-hero-stat">
                    <span className="lm-hero-stat-num">7</span>
                    <span className="lm-hero-stat-label">Days to your first visibility report</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="lm-section lm-section--sm">
          <div className="container">
            <div className="lm-section-label">Simple process</div>
            <h2 className="lm-h2">How it <em>works</em></h2>
            <p className="lm-lead">Four steps. No technical knowledge needed on your side.</p>

            <div className="lm-steps">
              <article className="lm-step">
                <div className="lm-step-num">1</div>
                <div>
                  <h3>Fill in the form</h3>
                  <p>Share your business name and location — takes under 60 seconds.</p>
                </div>
              </article>
              <article className="lm-step">
                <div className="lm-step-num">2</div>
                <div>
                  <h3>We activate the scanner</h3>
                  <p>No access to your Google account is needed. Our system starts within 24 hours.</p>
                </div>
              </article>
              <article className="lm-step">
                <div className="lm-step-num">3</div>
                <div>
                  <h3>Your rankings, mapped out</h3>
                  <p>See where you appear for 10 keywords across a 2.5 mi grid around your business.</p>
                </div>
              </article>
              <article className="lm-step">
                <div className="lm-step-num">4</div>
                <div>
                  <h3>Review call with clear priorities</h3>
                  <p>We walk you through the data and outline the highest-impact next steps. You decide.</p>
                </div>
              </article>
            </div>

            <div className="lm-cta-row">
              <a className="lm-btn-inline" href={CALENDLY_URL}>Start Your 7-Day Free Trial</a>
            </div>
          </div>
        </section>

        {/* ── What you get ── */}
        <section className="lm-section lm-section--sm" style={{ background: "linear-gradient(180deg, #f7fdf9 0%, #fff 100%)" }}>
          <div className="container">
            <div className="lm-section-label">What's included</div>
            <h2 className="lm-h2">Everything in your <em>free trial</em></h2>
            <p className="lm-lead">One week of real data, zero cost — here's what you actually receive.</p>

            <div className="lm-features">
              <article className="lm-feature">
                <div className="lm-feature-icon">AI</div>
                <div>
                  <h3>AI-powered local signal boost</h3>
                  <p>Our system runs in the background, strengthening local relevance signals without touching your accounts.</p>
                </div>
              </article>
              <article className="lm-feature">
                <div className="lm-feature-icon">10</div>
                <div>
                  <h3>10-keyword ranking scan</h3>
                  <p>Real positions within a 2.5 mi radius — see exactly which searches find you and which don't.</p>
                </div>
              </article>
              <article className="lm-feature">
                <div className="lm-feature-icon">7D</div>
                <div>
                  <h3>Before & after comparison</h3>
                  <p>A second scan on day 7 lets us show you measurable movement, not just a snapshot.</p>
                </div>
              </article>
              <article className="lm-feature">
                <div className="lm-feature-icon">☎</div>
                <div>
                  <h3>Personalised strategy call</h3>
                  <p>We review results together and give you a prioritised growth roadmap. No hard sell.</p>
                </div>
              </article>
            </div>

            <div className="lm-cta-row">
              <a className="lm-btn-inline" href={CALENDLY_URL}>Start Your 7-Day Free Trial</a>
            </div>

            {/* ── Plan Table ── */}
            <div className="lm-ptable-wrap">
              <table className="lm-ptable">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Mini</th>
                    <th>Maxi</th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["Daily Google Maps direction signals", "10–20 / day", "30–40 / day", false],
                    ["Rating grid", "2.5 mi radius", "5 mi radius", false],
                    ["Keywords", "10", "20", false],
                    ["Connecting more than 1 GBP profile", "Multi-location discounts", "Multi-location discounts", false],
                    ["Free 7-day trial", "+", "+", false],
                    ["Guaranteed TOP 3 positions", "+", "+", false],
                    ["GPS local activity enhancement", "+", "+", false],
                    ["Google Business Profile SEO", "+", "+", false],
                    ["Website internal Local SEO", "+", "+", false],
                    ["Cloud stack service", "+", "+", false],
                    ["Position tracking in local search", "+", "+", false],
                    ["Results reports every 2 weeks", "+", "+", false],
                    ["Medium pages", "−", "+", true],
                    ["Google pages", "−", "+", true],
                    ["Google documents", "−", "+", true],
                  ] as [string, string, string, boolean][]).map(([label, mini, maxi, maxiOnly]) => (
                    <tr key={label} className={maxiOnly ? "lm-pt-maxi-only" : ""}>
                      <td>{label}</td>
                      <td className={mini === "+" ? "lm-pt-plus" : mini === "−" ? "lm-pt-minus" : ""}>{mini}</td>
                      <td className={maxi === "+" ? "lm-pt-plus" : ""}>{maxi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Book a call directly on this page ── */}
        <CalendlyWidget />

        {/* ── Video Testimonials ── */}
        <section className="lm-section lm-section--sm" style={{ background: "linear-gradient(180deg, #f7fdf9 0%, #fff 100%)" }}>
          <div className="container">
            <div className="lm-section-label">Client reviews</div>
            <h2 className="lm-h2">Hear from <em>real clients</em></h2>
            <p className="lm-lead">Watch what local business owners say about their Google Maps growth.</p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              marginTop: 40,
            }}>
              {[
                { id: "-8SFE-Pbm9g", title: "Auto Repair Shop" },
                { id: "Mlt9xpYy00w", title: "Online Movers" },
                { id: "z7HUliWQ_NU", title: "Dental Clinic" },
                { id: "hp_UzmzN9cU", title: "Physiotherapy Clinic" },
              ].map(v => (
                <div key={v.id} style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid var(--lm-line)",
                  background: "#fff",
                  boxShadow: "var(--lm-shadow)",
                  padding: 8,
                }}>
                  <div style={{ position: "relative", width: "100%", paddingBottom: "177.78%", borderRadius: 14, overflow: "hidden", background: "#000" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.id}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, borderRadius: 14 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Case Studies ── */}
        <section className="lm-section">
          <div className="container">
            <div className="lm-section-label">Real results</div>
            <h2 className="lm-h2">How local businesses <em>grew</em> on Google Maps</h2>
            <p className="lm-lead">
              From a dental clinic in Utena to an auto repair shop in Kaunas and an accountancy firm in London — these are live projects.
            </p>

            <div className="lm-cases">
              <article className="lm-case">
                <div className="lm-case-head">
                  <div className="lm-case-icon">🦷</div>
                  <div>
                    <h3>Clinic DPC Utena</h3>
                    <p>Local SEO success story</p>
                  </div>
                </div>
                <div className="lm-case-title">Maintained Top 3 rankings and +187% ranking growth</div>
                <p className="lm-case-body">
                  A family dental clinic in Utena was buried among competitors and missing patient calls from Google Maps searches. After the system went live, visibility jumped dramatically.
                </p>
                <p className="lm-case-quote">Rankings improved, profile activity strengthened, and lead quality became noticeably better.</p>
                <div className="lm-tags">
                  <span className="lm-tag">First results: 6 weeks</span>
                  <span className="lm-tag">Long-term partnership</span>
                  <span className="lm-tag">+243 calls / month</span>
                </div>
                <div className="lm-proof">
                  <div className="lm-proof-pair">
                    <div className="lm-proof-box lm-proof-before">
                      <div className="lm-proof-head"><strong>Before</strong><span className="lm-proof-rank">Rank 9</span></div>
                      <img src={clinicBefore} alt="Clinic DPC before" />
                      <div className="lm-proof-foot"><span>Clinic DPC Utena</span><span>Apr 21</span></div>
                    </div>
                    <div className="lm-proof-box lm-proof-after">
                      <div className="lm-proof-head"><strong>After</strong><span className="lm-proof-rank">Rank 1</span></div>
                      <img src={clinicAfter} alt="Clinic DPC after" />
                      <div className="lm-proof-foot"><span>Clinic DPC Utena</span><span>Jul 14</span></div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="lm-case">
                <div className="lm-case-head">
                  <img className="lm-case-logo" src={wheelshopLogo} alt="WheelShop" />
                  <div>
                    <h3>WheelShop Auto Service</h3>
                    <p>Kaunas</p>
                  </div>
                </div>
                <div className="lm-case-title">Top 3 in 8 weeks and +156 enquiries per month</div>
                <p className="lm-case-body">
                  An independent auto repair shop that went from invisible to fully booked — they had to hire two extra mechanics to keep up with Google Maps demand.
                </p>
                <p className="lm-case-quote">We now receive calls and new enquiries from Google Maps every single week.</p>
                <div className="lm-tags">
                  <span className="lm-tag">Top 3 in 8 weeks</span>
                  <span className="lm-tag">+312% visibility</span>
                  <span className="lm-tag">Long-term partnership</span>
                </div>
                <div className="lm-proof">
                  <div className="lm-proof-pair">
                    <div className="lm-proof-box lm-proof-before">
                      <div className="lm-proof-head"><strong>Before</strong><span className="lm-proof-rank">Not found</span></div>
                      <img src={wheelshopBefore} alt="WheelShop before" />
                      <div className="lm-proof-foot"><span>WheelShop</span><span>Jun 19</span></div>
                    </div>
                    <div className="lm-proof-box lm-proof-after">
                      <div className="lm-proof-head"><strong>After</strong><span className="lm-proof-rank">Top 3</span></div>
                      <img src={wheelshopAfter} alt="WheelShop after" />
                      <div className="lm-proof-foot"><span>WheelShop</span><span>Aug 11</span></div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="lm-case">
                <div className="lm-case-head">
                  <img className="lm-case-logo" src={basLogo} alt="Britannia Accountancy" />
                  <div>
                    <h3>Britannia Accountancy Services</h3>
                    <p>London, UK</p>
                  </div>
                </div>
                <div className="lm-case-title">Direction requests grew from 50 to 200 in 2 months</div>
                <p className="lm-case-body">
                  A professional accountancy firm in London wanted steady, measurable local enquiries. After implementing our system, direction requests quadrupled in just two months.
                </p>
                <p className="lm-case-quote">Local visibility improved, and the flow of enquiries became steady, clear, and measurable.</p>
                <div className="lm-tags">
                  <span className="lm-tag">Results in 2 months</span>
                  <span className="lm-tag">Rapid growth</span>
                  <span className="lm-tag">More local enquiries</span>
                </div>
                <div className="lm-proof">
                  <div className="lm-proof-single">
                    <img src={accountingStatistic} alt="Britannia Accountancy results" />
                    <div className="lm-proof-single-meta">
                      <strong>Business impact</strong>
                      <span>Growth in local visibility and map interactions after the system was activated.</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div className="lm-cta-row">
              <a className="lm-btn-inline" href={CALENDLY_URL}>Start Your 7-Day Free Trial</a>
            </div>
          </div>
        </section>

        {/* ── Checklist ── */}
        <section className="lm-section lm-section--dark">
          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className="lm-section-label">Is this right for you?</div>
            <h2 className="lm-h2" style={{ textAlign: "center" }}>
              You'll get the best results when you <em>already have a foundation</em>
            </h2>
            <p className="lm-lead" style={{ textAlign: "center" }}>The free trial works hardest when these five boxes are ticked.</p>

            <div className="lm-checklist">
              <div className="lm-check-item"><span className="lm-check-mark">✓</span><span>You have a Google Business Profile</span></div>
              <div className="lm-check-item"><span className="lm-check-mark">✓</span><span>Your rating is 3.5 stars or higher</span></div>
              <div className="lm-check-item"><span className="lm-check-mark">✓</span><span>You have at least 15 reviews</span></div>
              <div className="lm-check-item"><span className="lm-check-mark">✓</span><span>You have a working website</span></div>
              <div className="lm-check-item"><span className="lm-check-mark">✓</span><span>You serve customers in a local area</span></div>
            </div>

            <div className="lm-cta-row" style={{ marginTop: "36px" }}>
              <a className="lm-btn-inline" href={CALENDLY_URL}>Start Your 7-Day Free Trial</a>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="lm-contact" className="lm-section">
          <div className="container">
            <div className="lm-contact-wrap">
              <div className="lm-contact-grid">
                <div>
                  <h2 className="lm-contact-title">
                    Let's talk <em>growth</em>
                  </h2>
                  <p className="lm-contact-copy">
                    We reply within 24 hours. Book a call straight away using the button above, or leave your details below and we'll reach out.
                  </p>

                  <div className="lm-contact-info">
                    <article className="lm-info-card">
                      <h3>Follow us</h3>
                      <div className="lm-socials">
                        <a href="https://www.facebook.com/profile.php?id=61576212845220" target="_blank" rel="noreferrer">Facebook</a>
                        <a href="https://www.instagram.com/llamamaps/" target="_blank" rel="noreferrer">Instagram</a>
                      </div>
                    </article>
                  </div>
                </div>

                <div>
                  <h2 className="lm-contact-title">Get your <em>free scan</em></h2>
                  <p className="lm-contact-copy">Fill in below and we'll set everything up — no accounts, no tech work on your side.</p>

                  <form ref={formRef} className="lm-form" onSubmit={handleSubmit} noValidate>
                    <div className="lm-form-grid lm-form-grid--split">
                      <input className="lm-input" type="text" name="name" placeholder="Your name" autoComplete="name" required />
                      <input className="lm-input" type="tel" name="phone" placeholder="Your phone number" autoComplete="tel" />
                    </div>
                    <div className="lm-form-grid" style={{ marginTop: 14 }}>
                      <input className="lm-input" type="email" name="email" placeholder="Your email" autoComplete="email" required />
                      <textarea className="lm-textarea" name="message" placeholder="Your business name and city" rows={6} />
                    </div>
                    <div style={{ marginTop: 18 }}>
                      <button className="lm-form-btn" type="submit" disabled={sending}>
                        {sending ? "Sending…" : "Start Your 7-Day Free Trial"}
                      </button>
                      <p className="lm-form-note">No card required · No logins · No commitment</p>
                      {feedback.msg && <p className={`lm-form-fb ${feedback.type}`}>{feedback.msg}</p>}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <a className="lm-sticky" href={CALENDLY_URL}>Start Your 7-Day Free Trial</a>
    </div>
  );
}

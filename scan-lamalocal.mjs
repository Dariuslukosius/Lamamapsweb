import { chromium } from 'playwright-core';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('https://www.lamalocal.lt', { waitUntil: 'networkidle', timeout: 30000 });
await p.waitForTimeout(1500);
const imgs = await p.evaluate(() => {
  const all = [...document.querySelectorAll('img, source, video')];
  return all.map(el => ({ tag: el.tagName, src: el.src || el.getAttribute('src') || el.currentSrc, alt: el.alt }));
});
console.log(JSON.stringify(imgs.filter(i => i.src), null, 2));
await p.screenshot({ path: process.argv[2], fullPage: false });
await b.close();

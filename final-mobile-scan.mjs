import { chromium } from 'playwright-core';
const [url, outPrefix] = process.argv.slice(2);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
await p.goto(url, { waitUntil: 'load', timeout: 60000 });
await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150));} window.scrollTo(0,0); });
await p.waitForTimeout(1500);
const hOverflow = await p.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
const h = await p.evaluate(() => document.body.scrollHeight);
console.log(url, 'overflow:', hOverflow.doc>hOverflow.win+2?'YES BUG':'ok', 'height:', h);
for (let i = 0; i * 800 < h; i++) {
  await p.evaluate(y => window.scrollTo(0, y), i * 800);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${outPrefix}-${String(i).padStart(2,'0')}.png` });
}
await b.close();

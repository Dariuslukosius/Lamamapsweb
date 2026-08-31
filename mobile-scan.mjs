import { chromium } from 'playwright-core';
const [url, outPrefix] = process.argv.slice(2);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();

const overflows = [];
p.on('console', msg => {});

await p.goto(url, { waitUntil: 'load', timeout: 60000 });
await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,150));} window.scrollTo(0,0); });
await p.waitForTimeout(1500);

// Check horizontal overflow (content wider than viewport = broken layout)
const hOverflow = await p.evaluate(() => {
  const docWidth = document.documentElement.scrollWidth;
  const winWidth = window.innerWidth;
  const offenders = [];
  if (docWidth > winWidth + 2) {
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > winWidth + 2 || r.left < -2) {
        offenders.push({ tag: el.tagName, cls: el.className.toString().slice(0,60), right: Math.round(r.right), left: Math.round(r.left) });
      }
    });
  }
  return { docWidth, winWidth, offenders: offenders.slice(0, 15) };
});
console.log(url, 'doc/win width:', hOverflow.docWidth, '/', hOverflow.winWidth, hOverflow.docWidth > hOverflow.winWidth + 2 ? '!! HORIZONTAL OVERFLOW' : 'ok');
if (hOverflow.offenders.length) console.log(JSON.stringify(hOverflow.offenders, null, 2));

// Full page height for reference
const h = await p.evaluate(() => document.body.scrollHeight);
console.log('total height:', h, 'px ->', Math.ceil(h/800), 'screenshots');

// Take sequential viewport screenshots down the page
for (let i = 0; i * 800 < h; i++) {
  await p.evaluate(y => window.scrollTo(0, y), i * 800);
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${outPrefix}-${String(i).padStart(2,'0')}.png` });
}
await b.close();

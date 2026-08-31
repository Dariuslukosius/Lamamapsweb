import { chromium } from 'playwright-core';
import fs from 'fs';
const b = await chromium.launch();
const p = await b.newPage();
const videoPath = process.argv[2];
const buf = fs.readFileSync(videoPath);
const b64 = buf.toString('base64');
await p.setContent(`<video id="v" src="data:video/webm;base64,${b64}" muted></video><canvas id="c"></canvas>`);
await p.waitForFunction(() => {
  const v = document.getElementById('v');
  return v.readyState >= 2 && v.duration > 0;
}, null, { timeout: 15000 });
const duration = await p.evaluate(() => document.getElementById('v').duration);
console.log('duration:', duration);
const times = [0, duration*0.25, duration*0.5, duration*0.75, Math.max(0, duration-0.1)];
for (let i = 0; i < times.length; i++) {
  await p.evaluate((t) => {
    const v = document.getElementById('v');
    return new Promise((res) => { v.onseeked = res; v.currentTime = t; });
  }, times[i]);
  await p.waitForTimeout(200);
  await p.evaluate(() => {
    const v = document.getElementById('v'); const c = document.getElementById('c');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
  });
  const dataUrl = await p.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  fs.writeFileSync(`${process.argv[3]}-${i}.png`, Buffer.from(dataUrl.split(',')[1], 'base64'));
}
await b.close();

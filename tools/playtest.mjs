import { readFileSync, statSync } from 'node:fs';
import { chromium } from '/home/hatch/.npm/_npx/360550e4913b8759/node_modules/playwright/index.mjs';

const origin = `http://127.0.0.1:${process.env.PORT || 8080}`;
const shotDefinitions = JSON.parse(readFileSync(`${process.cwd()}/shots.json`, 'utf8'));
const browser = await chromium.launch({
  headless: true,
  executablePath: '/home/hatch/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const page = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1
});

const errors = [];
const badResponses = [];
page.on('console', message => {
  if (message.type() === 'error') errors.push(message.text());
});
page.on('pageerror', error => errors.push(`page error: ${error.message}`));
page.on('requestfailed', request => errors.push(`request failed: ${request.url()}`));
page.on('response', response => {
  if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
});

const screenshotNames = {
  chase: '1-chase.jpg',
  driving: '2-driving.jpg',
  onfoot: '3-onfoot.jpg',
  mission: '4-mission.jpg'
};

for (const shot of Object.keys(screenshotNames)) {
  const definition = shotDefinitions.find(item => item.file === screenshotNames[shot]);
  await page.goto(`${origin}/${definition.url}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const visibleText = await page.locator('body').innerText();
  for (const expected of definition.visibleChecks) {
    if (!visibleText.includes(expected)) errors.push(`${definition.file} did not show: ${expected}`);
  }
  await page.screenshot({
    path: `${process.cwd()}/screenshots/${screenshotNames[shot]}`,
    type: 'jpeg',
    quality: 97
  });
}

await page.goto(`${origin}/?shot=onfoot&test=1`, { waitUntil: 'networkidle' });
const hooksReady = await page.waitForFunction(() => Boolean(window.__sunwardBayTest), null, { timeout: 5000 });
await page.keyboard.down('KeyW');
await page.waitForTimeout(350);
await page.keyboard.up('KeyW');

// Exercise the actual borrow, wanted, police response, driving and exit handlers.
await page.evaluate(() => window.__sunwardBayTest.borrow());
await page.evaluate(() => window.__sunwardBayTest.update(0.1));
const borrowedState = await page.evaluate(() => window.__sunwardBayTest.state());
await page.keyboard.down('KeyW');
await page.waitForTimeout(450);
await page.keyboard.up('KeyW');
await page.keyboard.press('e');
await page.waitForTimeout(250);
const exitedState = await page.evaluate(() => window.__sunwardBayTest.state());

// Mission 2: obtain a car, reach the courier coupe marker and finish the chapter.
await page.evaluate(() => window.__sunwardBayTest.setMission(1));
await page.evaluate(() => window.__sunwardBayTest.borrow());
await page.evaluate(() => window.__sunwardBayTest.teleport(19, 24));
await page.evaluate(() => window.__sunwardBayTest.interact());
const missionTwo = await page.evaluate(() => window.__sunwardBayTest.state());

// Mission 6: dispatch, passenger pickup and delivery all use the fare handlers.
await page.evaluate(() => window.__sunwardBayTest.setMission(5));
await page.evaluate(() => window.__sunwardBayTest.teleport(0, 0));
await page.evaluate(() => window.__sunwardBayTest.interact());
await page.evaluate(() => window.__sunwardBayTest.arriveAtFare(1, 0));
await page.evaluate(() => window.__sunwardBayTest.arriveAtFare(-28, 8));
const fareState = await page.evaluate(() => window.__sunwardBayTest.state());

// Mission 7: run the three checkpoints in their intended order.
await page.evaluate(() => window.__sunwardBayTest.setMission(6));
if (!(await page.evaluate(() => window.__sunwardBayTest.state().car))) {
  await page.evaluate(() => window.__sunwardBayTest.borrow());
}
await page.evaluate(() => window.__sunwardBayTest.teleport(-20, -20));
await page.evaluate(() => window.__sunwardBayTest.interact());
for (const gate of [0, 1, 2]) await page.evaluate(index => window.__sunwardBayTest.crossGate(index), gate);
const raceState = await page.evaluate(() => window.__sunwardBayTest.state());

// Mission 8: recover all six parcels, then save and reload the resulting chapter.
await page.evaluate(() => window.__sunwardBayTest.setMission(7));
for (const parcel of [0, 1, 2, 3, 4, 5]) {
  await page.evaluate(index => window.__sunwardBayTest.collectParcel(index), parcel);
}
await page.evaluate(() => window.__sunwardBayTest.collectCoin(0));
const beforeReload = await page.evaluate(() => window.__sunwardBayTest.state());
await page.goto(`${origin}/?test=1`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => Boolean(window.__sunwardBayTest));
const afterReload = await page.evaluate(() => window.__sunwardBayTest.state());

const screenshotSizes = Object.fromEntries(Object.entries(screenshotNames).map(([shot, name]) => [
  name,
  statSync(`${process.cwd()}/screenshots/${name}`).size
]));
function jpegDimensions(path) {
  const bytes = readFileSync(path);
  for (let offset = 2; offset < bytes.length - 9;) {
    if (bytes[offset] !== 0xff) { offset += 1; continue; }
    const marker = bytes[offset + 1];
    const length = bytes.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
    }
    offset += 2 + length;
  }
  return { width: 0, height: 0 };
}
const screenshotDimensions = Object.fromEntries(Object.entries(screenshotNames).map(([shot, name]) => [
  name,
  jpegDimensions(`${process.cwd()}/screenshots/${name}`)
]));
const result = {
  hooksReady: Boolean(hooksReady),
  title: await page.title(),
  objective: await page.locator('#objective').textContent(),
  borrowedState,
  exitedState,
  missionTwo,
  fareState,
  raceState,
  beforeReload,
  afterReload,
  screenshotSizes,
  screenshotDimensions,
  errors,
  badResponses
};
console.log(JSON.stringify(result, null, 2));

await browser.close();
if (errors.length || badResponses.length) process.exitCode = 1;
if (borrowedState.wanted !== 1 || !borrowedState.car || borrowedState.patrols < 1) process.exitCode = 1;
if (exitedState.car !== null) process.exitCode = 1;
if (missionTwo.mission !== 2 || fareState.mission !== 6 || fareState.fares !== 1) process.exitCode = 1;
if (raceState.mission !== 7 || beforeReload.mission !== 8 || beforeReload.coins !== 1) process.exitCode = 1;
if (afterReload.mission !== beforeReload.mission || afterReload.cash !== beforeReload.cash) process.exitCode = 1;
if (Object.values(screenshotDimensions).some(size => size.width !== 1280 || size.height !== 720)) process.exitCode = 1;
if (Object.values(screenshotSizes).some(bytes => bytes < 150000 || bytes > 240000)) process.exitCode = 1;

import { chromium } from '@playwright/test';

const chromiumPath = 'C:/Users/PC/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe';
const BASE = 'https://carrer-ready-city.vercel.app';
const OUT = 'C:/Users/PC/AppData/Local/Temp/claude/d--CarrerReadyCity/2af2f703-2583-480f-873e-6a27b6e0d3ac/scratchpad/prod';

const browser = await chromium.launch({ executablePath: chromiumPath });
const page = await browser.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2 });

const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', (err) => pageErrors.push(err.message));
page.on('requestfailed', (req) => failedRequests.push(req.url() + ' :: ' + req.failure()?.errorText));

const log = (msg) => console.log(msg);

await page.goto(BASE + '/');
await page.evaluate(() => localStorage.clear());
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/01-start.png` });
log('start loaded: ' + page.url());

await page.getByRole('button', { name: 'START' }).click();
await page.waitForURL(/\/sid/);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/02-sid.png` });
log('sid loaded');

await page.getByPlaceholder('e.g. S1234567').fill('S1234567');
await page.getByRole('button', { name: 'Verify SID' }).click();
await page.waitForURL(/\/avatar/, { timeout: 3000 });
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/03-avatar.png` });
log('avatar loaded (auto-nav after verify worked)');

await page.getByRole('button', { name: 'Choose avatar 3' }).click();
await page.waitForTimeout(200);
await page.getByRole('button', { name: 'Next' }).click();
await page.waitForURL(/\/profile/);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/04-profile.png` });
log('profile loaded');

await page.getByPlaceholder('e.g. Year 3').fill('Year 2');
await page.getByPlaceholder('e.g. Digital Marketing').fill('Interaction Design');
await page.getByRole('button', { name: 'Next' }).click();
await page.waitForURL(/\/guide/);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/05-guide.png` });
log('guide loaded');

await page.getByRole('button', { name: /Start exploring/i }).click();
await page.waitForURL(/\/city/, { timeout: 10000 });
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/06-city.png` });
log('city loaded');

const places = ['Theatre & Film Club', 'Science & Research Lab', 'The Business District', 'Community & Wellness Centre', 'Maker Workshop', 'Bank & Records Office'];
for (let i = 0; i < places.length; i++) {
  await page.getByRole('button', { name: new RegExp(places[i], 'i') }).click();
  await page.waitForTimeout(300);
  const fieldsets = page.locator('fieldset');
  const count = await fieldsets.count();
  if (count !== 3) log(`*** WARNING: ${places[i]} has ${count} fieldsets, expected 3 ***`);
  for (let q = 0; q < 3; q++) await fieldsets.nth(q).getByRole('button').first().click();
  await page.getByRole('button', { name: /Done|Update/ }).click();
  await page.waitForTimeout(300);
  log(`visited ${places[i]} (${i + 1}/6)`);
}
await page.screenshot({ path: `${OUT}/07-city-complete.png`, fullPage: true });

await page.getByRole('button', { name: /See my result/ }).click();
await page.waitForURL(/\/results/, { timeout: 5000 });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/08-results.png`, fullPage: true });
log('results loaded');

// test accordion interaction
const summaries = page.locator('.result-place summary');
await summaries.nth(1).click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/09-results-expanded.png`, fullPage: true });

// test reload persistence
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const headingVisible = await page.getByRole('heading', { name: 'Your Holland Code' }).isVisible();
log('results persisted after reload: ' + headingVisible);

log('--- console errors: ' + consoleErrors.length);
consoleErrors.forEach((e) => log('  CONSOLE ERROR: ' + e));
log('--- page errors: ' + pageErrors.length);
pageErrors.forEach((e) => log('  PAGE ERROR: ' + e));
log('--- failed requests: ' + failedRequests.length);
failedRequests.forEach((e) => log('  FAILED REQUEST: ' + e));

await browser.close();
log('DONE');

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const BASE_URL = 'http://localhost:3000';

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'models', path: '/models' },
  { name: 'model-detail', path: '/models/guru-rani-x' },
  { name: 'compare', path: '/compare' },
  { name: 'dealers', path: '/dealers' },
  { name: 'support', path: '/support' },
  { name: 'blog', path: '/blog' },
  { name: 'test-ride', path: '/test-ride' },
  { name: 'enquiry', path: '/enquiry' },
  { name: 'admin', path: '/admin' },
  { name: 'admin-products', path: '/admin/products' },
  { name: 'admin-leads', path: '/admin/leads' },
];

async function captureScreenshots() {
  const screenshotsDir = './screenshots';

  if (!existsSync(screenshotsDir)) {
    await mkdir(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  console.log('Capturing screenshots...\n');

  for (const pageInfo of pages) {
    const page = await context.newPage();
    const url = `${BASE_URL}${pageInfo.path}`;

    try {
      console.log(`📸 ${pageInfo.name}: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait a bit for animations
      await page.waitForTimeout(1000);

      // Take screenshot
      await page.screenshot({
        path: `${screenshotsDir}/${pageInfo.name}.png`,
        fullPage: true
      });

      // Check for errors in console
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      // Basic checks
      const title = await page.title();
      const hasNav = await page.locator('nav').count() > 0;
      const hasMain = await page.locator('main').count() > 0;

      console.log(`   ✓ Title: "${title}"`);
      console.log(`   ✓ Has nav: ${hasNav}, Has main: ${hasMain}`);

      if (errors.length > 0) {
        console.log(`   ⚠ Errors: ${errors.join(', ')}`);
      }
      console.log('');

    } catch (error) {
      console.log(`   ✗ Error: ${error.message}\n`);
    }

    await page.close();
  }

  await browser.close();
  console.log(`\n✅ Screenshots saved to ${screenshotsDir}/`);
}

captureScreenshots().catch(console.error);

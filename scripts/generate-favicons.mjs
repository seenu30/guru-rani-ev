import sharp from 'sharp';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const INPUT_IMAGE = '/tmp/logo.jpeg';
const PUBLIC_DIR = join(process.cwd(), 'public');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateFavicons() {
  console.log('Generating favicons...');

  for (const { name, size } of sizes) {
    await sharp(INPUT_IMAGE)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(join(PUBLIC_DIR, name));
    console.log(`Created ${name}`);
  }

  // Generate ICO file (using 32x32 PNG as base)
  await sharp(INPUT_IMAGE)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(join(PUBLIC_DIR, 'favicon.ico'));
  console.log('Created favicon.ico');

  // Create web manifest
  const manifest = {
    name: 'Guru Rani EV',
    short_name: 'Guru Rani',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: '#10B981',
    background_color: '#ffffff',
    display: 'standalone',
  };

  await writeFile(
    join(PUBLIC_DIR, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Created site.webmanifest');

  console.log('Done!');
}

generateFavicons().catch(console.error);

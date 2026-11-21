// Vygeneruje výchozí obrázek pro sdílení (public/og-default.png) a favicon
// z dodaných log v docs/brand/logo/. Spuštění: node scripts/og-default.mjs
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const logo = await readFile('docs/brand/logo/logo_rozsirene_4_rocnik_s_web.svg');
const W = 1200, H = 630;
const logoPng = await sharp(logo, { density: 400 }).resize({ height: 500 }).png().toBuffer();
await sharp({ create: { width: W, height: H, channels: 4, background: '#000000' } })
  .composite([{ input: logoPng, gravity: 'center' }])
  .png({ compressionLevel: 9 })
  .toFile('public/og-default.png');

const ctu = (await readFile('docs/brand/logo/logo_jen_ctu.svg', 'utf8'))
  .replace(/<svg[^>]*>/, '')
  .replace('</svg>', '');
// čtvercový favicon: černé pozadí, logo „čtu“ (viewBox 282×148) uprostřed
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" rx="40" fill="#000"/><g transform="translate(9 76)">${ctu}</g></svg>`;
await writeFile('public/favicon.svg', favicon);
console.log('Hotovo: public/og-default.png, public/favicon.svg');

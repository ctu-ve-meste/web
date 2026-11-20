// Zmenší vybrané fotky na webové WebP verze a uloží je do src/assets/fotky/<rok>/.
//
// Použití:
//   npm run fotky -- <slozka-s-originaly> --rok 2026 --mesto frydek-mistek --akce cteni-na-svobode [--hero]
//
// Originály dejte do _fotky-originaly/ (je v .gitignore, do gitu se nikdy nedostanou).
// Parametry výstupu: WebP, delší strana max. 2000 px (s --hero 2400 px), cíl 150–350 KB.
// Název: rok-mesto-akce-poradi.webp. Na konci vypíše velikost src/assets/ a zastaví se
// (exit kód 2), když překročí rozpočet 300 MB.
import sharp from 'sharp';
import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { parseArgs } from 'node:util';

const ROZPOCET_MB = 300;
const MAX_KB = 350;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    rok: { type: 'string' },
    mesto: { type: 'string' },
    akce: { type: 'string' },
    hero: { type: 'boolean', default: false },
    od: { type: 'string', default: '1' }, // počáteční pořadové číslo
  },
});

const [vstup] = positionals;
if (!vstup || !values.rok || !values.mesto || !values.akce) {
  console.error('Použití: npm run fotky -- <slozka> --rok 2026 --mesto frydek-mistek --akce cteni-na-svobode [--hero] [--od 1]');
  process.exit(1);
}
for (const k of ['mesto', 'akce']) {
  if (!/^[a-z0-9-]+$/.test(values[k])) {
    console.error(`--${k} musí být malými písmeny bez diakritiky (a-z, 0-9, -).`);
    process.exit(1);
  }
}

const maxStrana = values.hero ? 2400 : 2000;
const cil = join('src/assets/fotky', values.rok);
await mkdir(cil, { recursive: true });

const soubory = (await readdir(vstup))
  .filter((f) => ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff'].includes(extname(f).toLowerCase()))
  .sort();

let poradi = Number(values.od);
for (const f of soubory) {
  const nazev = `${values.rok}-${values.mesto}-${values.akce}-${String(poradi).padStart(2, '0')}.webp`;
  const vystup = join(cil, nazev);
  let q = 80;
  let buf;
  do {
    buf = await sharp(join(vstup, f))
      .rotate() // podle EXIF orientace
      .resize({ width: maxStrana, height: maxStrana, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: q, effort: 5 })
      .toBuffer();
    q -= 6;
  } while (buf.length > MAX_KB * 1024 && q >= 50);
  await writeFile(vystup, buf); // sharp metadata (EXIF, GPS) nezachovává
  console.log(`${f} → ${vystup} (${Math.round(buf.length / 1024)} KB, kvalita ${q + 6})`);
  poradi++;
}

async function velikost(dir) {
  let s = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    s += e.isDirectory() ? await velikost(p) : (await stat(p)).size;
  }
  return s;
}
const mb = (await velikost('src/assets')) / 1024 / 1024;
console.log(`\nsrc/assets/ celkem: ${mb.toFixed(1)} MB z rozpočtu ${ROZPOCET_MB} MB.`);
if (mb > ROZPOCET_MB) {
  console.error('Rozpočet překročen! Necommitujte a domluvte se s týmem, které fotky ubrat.');
  process.exit(2);
}

// Připraví materiály pro média do public/media/:
//  - ctu-ve-meste-loga.zip: dodaná SVG loga + PNG verze (průhledné pozadí i černé pozadí)
//  - foto/*.jpg: vybrané fotky ve vysokém rozlišení (delší strana 3000 px)
// Spuštění: node scripts/media-balicek.mjs <slozka-s-originaly-fotek>
import sharp from 'sharp';
import { readdir, mkdir, rm } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { execFileSync } from 'node:child_process';

const LOGA = 'docs/brand/logo';
const TMP = '_fotky-originaly/_loga';
await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });
for (const f of (await readdir(LOGA)).filter((x) => x.endsWith('.svg'))) {
  const name = basename(f, '.svg');
  const svg = join(LOGA, f);
  await sharp(svg, { density: 600 }).resize({ height: 1200 }).png().toFile(join(TMP, `${name}_pruhledne.png`));
  await sharp(svg, { density: 600 }).resize({ height: 1200 }).flatten({ background: '#000000' }).extend({ top: 120, bottom: 120, left: 120, right: 120, background: '#000000' }).png().toFile(join(TMP, `${name}_cerne-pozadi.png`));
  execFileSync('cp', [svg, join(TMP, f)]);
}
await rm('public/media/ctu-ve-meste-loga.zip', { force: true });
execFileSync('zip', ['-j', '-q', '-X', 'public/media/ctu-ve-meste-loga.zip', ...(await readdir(TMP)).map((f) => join(TMP, f))]);
console.log('public/media/ctu-ve-meste-loga.zip');

const [fotky] = process.argv.slice(2);
if (fotky) {
  await mkdir('public/media/foto', { recursive: true });
  let i = 1;
  for (const f of (await readdir(fotky)).filter((x) => /\.(jpe?g|png)$/i.test(x)).sort()) {
    const out = `public/media/foto/ctu-ve-meste-2026-${String(i++).padStart(2, '0')}.jpg`;
    await sharp(join(fotky, f)).rotate().resize({ width: 3000, height: 3000, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
    console.log(out);
  }
}

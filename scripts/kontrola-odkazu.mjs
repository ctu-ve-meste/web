// Kontrola interních odkazů v hotovém webu (dist/). Spuštění: npm run kontrola-odkazu
// Projde všechny HTML soubory, najde href/src na vlastní web a ověří, že cílový soubor existuje.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';
const BASE = (process.env.BASE ?? '/web').replace(/\/$/, '');

async function* soubory(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* soubory(p);
    else yield p;
  }
}

async function existuje(p) {
  try {
    const s = await stat(p);
    if (s.isFile()) return true;
    if (s.isDirectory()) return (await stat(join(p, 'index.html'))).isFile();
  } catch {}
  return false;
}

const chyby = [];
let pocet = 0;
for await (const f of soubory(DIST)) {
  if (!f.endsWith('.html')) continue;
  const html = await readFile(f, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="([^"#?]+)[^"]*"/g)) {
    let u = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(u)) continue;
    if (!u.startsWith('/')) continue; // relativní odkazy nepoužíváme
    pocet++;
    if (!u.startsWith(`${BASE}/`) && u !== BASE && BASE) {
      chyby.push(`${relative(DIST, f)}: odkaz bez base "${u}"`);
      continue;
    }
    const cesta = join(DIST, decodeURIComponent(u.slice(BASE.length)));
    if (!(await existuje(cesta))) chyby.push(`${relative(DIST, f)}: nefunkční odkaz ${u}`);
  }
}

if (chyby.length) {
  console.error(`Nalezeno ${chyby.length} nefunkčních odkazů:\n` + [...new Set(chyby)].join('\n'));
  process.exit(1);
}
console.log(`Odkazy v pořádku (${pocet} interních odkazů).`);

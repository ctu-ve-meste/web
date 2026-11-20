// Ověří, že každé přesměrování ze src/redirects.ts existuje v dist/ a vede na existující stránku.
// Spuštění (po buildu): npm run kontrola-presmerovani
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { redirects } from '../src/redirects.ts';

const BASE = (process.env.BASE ?? '/web').replace(/\/$/, '');
const chyby = [];
for (const [from, to] of Object.entries(redirects)) {
  const soubor = join('dist', decodeURI(from), 'index.html');
  let html;
  try {
    html = await readFile(soubor, 'utf8');
  } catch {
    chyby.push(`chybí přesměrování ${from}`);
    continue;
  }
  const cil = html.match(/url=([^"]+)"/)?.[1];
  if (cil !== `${BASE}${to}`) chyby.push(`${from} vede na ${cil}, čekáno ${BASE}${to}`);
  try {
    await stat(join('dist', to, 'index.html'));
  } catch {
    chyby.push(`${from} → ${to}: cílová stránka neexistuje`);
  }
}
if (chyby.length) {
  console.error(chyby.join('\n'));
  process.exit(1);
}
console.log(`Přesměrování v pořádku (${Object.keys(redirects).length}).`);

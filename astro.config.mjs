// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { redirects } from './src/redirects.ts';

// Dokud web neběží na vlastní doméně, je na https://ctu-ve-meste.github.io/web/.
// Při přepnutí domény (viz CLAUDE.md, fáze Spuštění) stačí nastavit
// SITE=https://www.ctuvemeste.cz a BASE=/ (nebo upravit výchozí hodnoty níže).
const site = process.env.SITE ?? 'https://ctu-ve-meste.github.io';
const base = process.env.BASE ?? '/web';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  output: 'static',
  // Cíle přesměrování musí obsahovat base (web zatím běží v podsložce).
  redirects: Object.fromEntries(
    Object.entries(redirects).map(([from, to]) => [from, `${base.replace(/\/$/, '')}${to}`]),
  ),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/styleguide/'),
    }),
  ],
  build: {
    format: 'directory',
  },
});

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { redirects } from './src/redirects.ts';

// Dokud web neběží na vlastní doméně, je na https://ctu-ve-meste.github.io/web/.
// Při přepnutí domény (viz CLAUDE.md, fáze Spuštění) stačí nastavit
// SITE=https://www.ctuvemeste.cz a BASE=/ (nebo upravit výchozí hodnoty níže).
const site = process.env.SITE ?? 'https://ctu-ve-meste.github.io';
const base = process.env.BASE ?? '/web';

/** Doplní base k interním odkazům v Markdownu ([text](/formaty/) → /web/formaty/). */
function rehypeBase() {
  const prefix = base.replace(/\/$/, '');
  /** @param {any} node */
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href;
      if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') && prefix && !href.startsWith(`${prefix}/`)) {
        node.properties.href = `${prefix}${href}`;
      }
    }
    node.children?.forEach(walk);
  };
  return (/** @type {any} */ tree) => walk(tree);
}

export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeBase],
  },
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
      filter: (page) => !/\/(styleguide|newsletter\/odhlaseni|newsletter\/potvrzeni)\//.test(page),
    }),
  ],
  build: {
    format: 'directory',
  },
});

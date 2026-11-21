// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { redirects } from './src/redirects.ts';

// Dokud web neběží na vlastní doméně, je na https://ctu-ve-meste.github.io/web/.
// Při přepnutí domény (viz CLAUDE.md, fáze Spuštění) stačí nastavit
// SITE=https://www.ctuvemeste.cz a BASE=/ (nebo upravit výchozí hodnoty níže).
const site = process.env.SITE ?? 'https://ctu-ve-meste.github.io';
const base = process.env.BASE ?? '/web';

/**
 * Úpravy HTML z Markdownu:
 *  - interní odkazy dostanou base ([text](/formaty/) → /web/formaty/),
 *  - nadpisy h2 dostanou tečku v barvě akcentu (jen když nekončí ? ! . … nebo uvozovkou),
 *  - za jednopísmenné předložky a spojky se vloží pevná mezera (česká sazba).
 */
function rehypeCtu() {
  const prefix = base.replace(/\/$/, '');
  const nbsp = (/** @type {string} */ t) => t.replace(/(^|[\s(„])([ksvzaiouKSVZAIOU])\s+/g, '$1$2\u00a0');
  /** @param {any} node */
  const walk = (node) => {
    if (node.type === 'text' && typeof node.value === 'string') node.value = nbsp(node.value);
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href;
      if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') && prefix && !href.startsWith(`${prefix}/`)) {
        node.properties.href = `${prefix}${href}`;
      }
    }
    if (node.type === 'element' && node.tagName === 'h2') {
      const text = JSON.stringify(node).match(/"value":"([^"]*)"/g)?.pop() ?? '';
      if (!/[?!.…“"]"$/.test(text)) {
        node.children.push({ type: 'element', tagName: 'span', properties: { className: ['dot'], ariaHidden: 'true' }, children: [{ type: 'text', value: '.' }] });
      }
    }
    node.children?.forEach(walk);
  };
  return (/** @type {any} */ tree) => walk(tree);
}

export default defineConfig({
  markdown: {
    processor: unified({ rehypePlugins: [rehypeCtu] }),
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

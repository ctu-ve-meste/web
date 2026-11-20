/**
 * Přesměrování ze starého webu na Google Sites.
 * Google Sites používá v URL diakritiku. Každou starou adresu uvádíme
 * v podobě s diakritikou i URL-encoded (viz docs/migrace.md).
 * Doplňte sem i jednotlivé proběhlé akce: '/uplynulé-akce/<stará-akce>': '/akce/<slug>/'.
 */
const stare: Record<string, string> = {
  '/úvodní': '/',
  '/galerie-3-ročník': '/rocniky/2026/',
  '/ctupominkove-predmety': '/podporte-nas/',
  '/kdo-jsme/nadcházející-akce': '/program/',
  '/uplynulé-akce': '/akce/',
  '/kontakty': '/kontakt/',
  '/tisnov': '/mesta/tisnov/',
  '/app': '/aplikace/',
  // /manifest, /kdo-jsme, /partneri a /program mají stejnou adresu jako dřív.
};

export const redirects: Record<string, string> = {};
for (const [from, to] of Object.entries(stare)) {
  redirects[from] = to;
  const encoded = encodeURI(from);
  if (encoded !== from) redirects[encoded] = to;
}

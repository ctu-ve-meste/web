/**
 * Přesměrování ze starého webu na Google Sites.
 * Google Sites používá v URL diakritiku. Každou starou adresu uvádíme
 * v podobě s diakritikou i URL-encoded (viz docs/migrace.md).
 * Doplňte sem i jednotlivé proběhlé akce: '/uplynulé-akce/<stará-akce>': '/akce/<slug>/'.
 */
const stare: Record<string, string> = {
  '/úvodní': '/',
  '/galerie-3-ročník': '/rocniky/2026/galerie/',
  '/ctupominkove-predmety': '/podporte-nas/',
  '/kdo-jsme/nadcházející-akce': '/program/',
  '/uplynulé-akce': '/akce/',
  '/kontakty': '/kontakt/',
  '/tisnov': '/mesta/tisnov/',
  '/app': '/aplikace/',
  '/app/tos': '/aplikace/podminky/',
  '/app/privacy-policy': '/aplikace/ochrana-soukromi/',
  // /manifest, /kdo-jsme, /partneri a /program mají stejnou adresu jako dřív.
  // proběhlé akce
  '/uplynulé-akce/den-nošení-knih-ve-fm': '/akce/den-noseni-knih-2024/',
  '/uplynulé-akce/čtu-si-v-autobusi': '/akce/ctu-si-v-autobusi-2024/',
  '/uplynulé-akce/vyvenči-svoji-knihu': '/akce/vyvenci-svoji-knihu-2024/',
  '/uplynulé-akce/noční-čtení-pod-svícnem': '/akce/nocni-cteni-pod-svicnem-2024/',
  '/uplynulé-akce/čteme-ve-městě': '/akce/cteme-ve-meste-2024/',
  '/uplynulé-akce/čtení-pod-dekou': '/akce/cteni-pod-dekou-2024/',
  '/uplynulé-akce/kafekniha': '/akce/kafe-a-kniha-2024/',
  '/uplynulé-akce/knihobudka': '/akce/knihobudka-2024/',
  '/uplynulé-akce/kavárna-paris': '/akce/',
  '/uplynulé-akce/nedělní-chvilka-poezie': '/akce/nedelni-chvilka-poezie-2024/',
  '/uplynulé-akce/dopisy-z-války': '/akce/dopisy-z-valky-2024/',
  '/uplynulé-akce/den-čichání-ke-knihám': '/akce/den-cichani-ke-kniham-2024/',
  '/uplynulé-akce/vánoční-dárky': '/akce/vanocni-darky-2024/',
  '/uplynulé-akce/knihkupectví-snů': '/akce/knihkupectvi-snu-2025/',
  '/uplynulé-akce/den-darování-knih': '/akce/den-darovani-knih-2025/',
  '/uplynulé-akce/čtení-lysé-hoře': '/akce/cteni-lyse-hore-2025/',
  '/uplynulé-akce/šalom-šabat': '/akce/salom-sabat-2025/',
  '/uplynulé-akce/den-nošení-knih-ve-f-m': '/akce/den-noseni-knih-2025/',
  '/uplynulé-akce/čtení-pod-hvězdami': '/akce/cteni-pod-hvezdami-2025/',
  '/uplynulé-akce/vyvenčete-svoji-knihu': '/akce/vyvencete-svoji-knihu-2025/',
  '/uplynulé-akce/čtení-na-svobodě': '/akce/cteni-na-svobode-2025/',
  '/uplynulé-akce/čtenářský-přívoz': '/akce/ctenarsky-privoz-2025/',
  '/uplynulé-akce/čtení-pod-dekou_1': '/akce/cteni-pod-dekou-2025/',
  '/uplynulé-akce/kafekniha_1': '/akce/kafe-a-kniha-2025/',
  '/uplynulé-akce/čtiout-zóna': '/akce/ctiout-zona-2025/',
};

export const redirects: Record<string, string> = {};
for (const [from, to] of Object.entries(stare)) {
  redirects[from] = to;
  const encoded = encodeURI(from);
  if (encoded !== from) redirects[encoded] = to;
}

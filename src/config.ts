/**
 * Hlavní nastavení webu. Většina změn během roku je v src/content/,
 * tady jsou jen věci, které platí pro celý web.
 */
export const config = {
  nazev: 'Čtu ve městě',
  podtitul: 'Opravdu čtenářský festival',
  popis:
    'Čtenářský festival ve Frýdku-Místku, kde hvězdami jsou čtenáři. Sedni si, čti, buď vidět.',

  /**
   * Aktuální ročník. Určuje barvu akcentu celého webu, štítek v logu
   * a co se ukazuje na stránce Program. Na nový ročník změňte jen tento řádek
   * (a založte src/content/rocniky/<rok>.yaml).
   */
  aktualniRocnik: 2027,

  /**
   * Logo v záhlaví na desktopu: 'rozsirene' (čtu + opravdu čtenářský festival,
   * po scrollu se zmenší na „čtu“) nebo 'zakladni' (jen „čtu“). Na mobilu vždy „čtu“.
   * Obě varianty jsou k porovnání na /styleguide/.
   */
  logoZahlavi: 'rozsirene' as 'rozsirene' | 'zakladni',

  email: 'ctuvemeste.cz@gmail.com',
  spolek: {
    nazev: 'Čtu ve městě, z.s.',
    ico: '22293752',
    ulice: 'Hlavní třída 107',
    psc: '738 01',
    mesto: 'Frýdek-Místek',
  },
  site: {
    instagram: 'https://www.instagram.com/ctuvemeste_cz/',
    facebook: 'https://www.facebook.com/ctuvemeste/',
    facebookSkupina: 'https://www.facebook.com/groups/1564955134087653',
    aplikace: 'https://play.google.com/store/apps/details?id=cz.ctuvemeste.app',
  },

  /** URL Google Apps Script web appu. Nastavuje se v .env (PUBLIC_APPS_SCRIPT_URL). */
  appsScriptUrl: import.meta.env.PUBLIC_APPS_SCRIPT_URL ?? '',

  /**
   * Analytika. Zatím žádná. Web nesmí nastavovat cookies.
   * Možnosti: null | { typ: 'goatcounter', kod: 'nazev' } | { typ: 'cloudflare', token: '...' }
   * Google Analytics by vyžadoval lištu se souhlasem (Consent Mode).
   */
  analytika: null as
    | null
    | { typ: 'goatcounter'; kod: string }
    | { typ: 'cloudflare'; token: string },
} as const;

/** Hlavní navigace (max. 6 položek + tlačítko Podpořte nás). */
export const navigace = [
  { href: '/program/', text: 'Program' },
  { href: '/akce/', text: 'Akce' },
  { href: '/mesta/', text: 'Města' },
  { href: '/pridejte-se/', text: 'Přidejte se' },
  { href: '/kdo-jsme/', text: 'O nás' },
  { href: '/kontakt/', text: 'Kontakt' },
] as const;

export const navigaceTlacitko = { href: '/podporte-nas/', text: 'Podpořte nás' } as const;

/** Odkazy v patičce. */
export const paticka = [
  {
    nadpis: 'Festival',
    odkazy: [
      { href: '/program/', text: 'Program' },
      { href: '/akce/', text: 'Všechny akce' },
      { href: '/rocniky/', text: 'Ročníky' },
      { href: '/kafe-a-kniha/', text: 'Kafe&kniha' },
      { href: '/formaty/', text: 'Slovníček formátů' },
      { href: '/aplikace/', text: 'Aplikace' },
    ],
  },
  {
    nadpis: 'Spolek',
    odkazy: [
      { href: '/kdo-jsme/', text: 'Kdo jsme' },
      { href: '/manifest/', text: 'Manifest' },
      { href: '/partneri/', text: 'Partneři' },
      { href: '/podporte-nas/', text: 'Podpořte nás' },
      { href: '/pro-media/', text: 'Pro média' },
    ],
  },
  {
    nadpis: 'Zapojte se',
    odkazy: [
      { href: '/pridejte-se/', text: 'Přidejte se' },
      { href: '/mesta/', text: 'Další města' },
      { href: '/newsletter/', text: 'Newsletter' },
      { href: '/kontakt/', text: 'Kontakt' },
      { href: '/ochrana-osobnich-udaju/', text: 'Ochrana osobních údajů' },
    ],
  },
] as const;

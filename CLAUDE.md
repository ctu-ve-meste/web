# Web ctuvemeste.cz – návod pro tým (a pro Clauda)

Statický web festivalu **Čtu ve městě** v [Astru](https://astro.build). Obsah je v Markdown/YAML souborech
v `src/content/`, šablony v `src/pages/` a `src/components/`. Web se po sloučení do `main` nasadí sám
na GitHub Pages. Žádné CMS, žádná databáze.

Zadání celého webu: `ZADANI-WEB.md`. Ověřená fakta o festivalu: `docs/ctu-ve-meste-kontext.md`.
Brand: `docs/brand/` (brandmanuál, pitch 2027, loga – loga se nepřekreslují).

## Struktura repa

```
src/config.ts              ← aktuální ročník, kontakty, sítě, navigace, analytika
src/redirects.ts           ← přesměrování ze starého webu (Google Sites)
src/content/
  akce/                    ← jedna akce = jeden .md soubor (název souboru = adresa /akce/<nazev>/)
  rocniky/                 ← 2024.yaml, 2025.yaml, … (barva, termín, města, perex, výběr fotek)
  mesta/                   ← jedno město = jeden .md (aktivni: true → má vlastní podstránku)
  formaty/                 ← naše formáty z katalogu akcí (Kafe&kniha, Čtenářský přívoz, …)
  dobrovolnici/            ← medailonky
  partneri/partneri.yaml   ← seznam partnerů
  media/media.yaml         ← ohlasy v médiích
  stranky/                 ← texty statických stránek (úvod, manifest, …)
src/content.config.ts      ← schémata obsahu (co je povinné a v jakém tvaru)
src/assets/                ← jen zmenšené fotky (WebP), originály zůstávají na Google Disku
src/pages/                 ← stránky webu
src/components/            ← znovupoužitelné kousky (záhlaví, karta akce, nadpis sekce…)
src/styles/tokens.css      ← barvy, písma, rozměry (jediné místo)
scripts/                   ← zpracování fotek, kontrola odkazů, OG obrázek
apps-script/               ← kód Google Apps Scriptu (newsletter, kontaktní formulář)
docs/                      ← podklady, brand, migrace
```

## Jak spustit web lokálně

Potřebujete Node.js ve verzi z `.nvmrc` (22.23+).

```
npm install
npm run dev          # http://localhost:4321/web/
npm run build        # kontrola typů + build; MUSÍ projít před každým PR
npm run kontrola-odkazu   # po buildu ověří interní odkazy
npm run preview      # náhled hotového buildu
```

## Workflow změn

1. Nikdy necommitujte přímo do `main` (je chráněná).
2. Vytvořte novou větev, např. `obsah/kafe-a-kniha-brezen`.
3. Udělejte změnu a spusťte `npm run build`. Musí projít bez chyb. Když něco v obsahu nesedí
   (chybí povinné pole, překlep v názvu města, špatně zapsaný čas), build spadne a napíše proč.
4. Pushněte větev a otevřete pull request. GitHub Action spustí build a kontrolu odkazů.
5. Po schválení a sloučení do `main` se web nasadí sám (asi za 2 minuty).

## Recepty

### Přidej novou akci
1. Zkopírujte `src/content/akce/_sablona.md` jako `src/content/akce/<nazev-akce-rok>.md`
   (malá písmena bez diakritiky, slova oddělená pomlčkou, např. `cteni-pod-dekou-2027.md`).
2. Vyplňte frontmatter podle komentářů v šabloně. Povinné: `title`, `date`, `rocnik`, `typ`, `mesto`,
   `misto.nazev`, `proKoho`. Časy v uvozovkách: `"10:00"`.
   Akce je zdarma. Pokud se platí vstupné, doplňte `vstupne: "50 Kč"` (ukáže se místo „Zdarma“).
3. Pod frontmatter napište popis (dva odstavce). Rubriku „Pro koho“ nepište do textu, vypíše se sama z `proKoho`.
4. Akce se sama objeví v Programu (pokud patří do aktuálního ročníku), v Akcích, v archivu ročníku,
   na stránce města i u formátu.

### Přidej nové město
1. Zkopírujte `src/content/mesta/_sablona.md` jako `src/content/mesta/<slug>.md`.
2. `aktivni: true` = město dostane podstránku `/mesta/<slug>/` a kartu na `/mesta/`.
3. Přidejte město do `mesta:` v příslušném `src/content/rocniky/<rok>.yaml`.
4. Nové město zveřejněte až ve chvíli, kdy ho tým oficiálně oznámí.

### Přidej Kafe&kniha na další měsíc
Kafe&kniha je vždy první neděli v měsíci, pokaždé v jiné kavárně.
1. Zkopírujte šablonu akce jako `src/content/akce/kafe-a-kniha-<rok>-<mesic>.md` (např. `kafe-a-kniha-2027-03.md`).
2. Nastavte `typ: kafe-a-kniha`, `rocnik: null`, `format: kafe-a-kniha`, `date` = první neděle v měsíci,
   `misto.nazev` = kavárna, `mesto`.

### Přidej fotky do galerie
Originály zůstávají na Google Disku (složka „ČTU - nové“). **Nikdy necommitujte originální fotky ani je nedávejte do Git LFS.**
1. Vyberte max. 12 fotek na akci (u ročníku max. 20 výběrových).
2. Zpracujte je skriptem `npm run fotky` (zmenší na WebP, delší strana 2000 px, název
   `rok-mesto-akce-poradi.webp`). Originály dejte do `_fotky-originaly/` (je v `.gitignore`).
3. Skript uloží výsledek do `src/assets/fotky/<rok>/`. Do frontmatteru akce doplňte `cover`, `coverAlt`
   a `galerie` s cestou `../../assets/fotky/<rok>/<soubor>.webp` (každá fotka potřebuje `alt` – krátký popis, co je na ní).
   Fotky z iPhonu ve formátu HEIC skript neumí. Stáhněte je z Disku jako JPEG přes
   `https://lh3.googleusercontent.com/d/<ID souboru>=w2000`.
4. Commitujte po dávkách (jedna akce = jeden commit). Smazané fotky v historii gitu zůstávají, proto nejdřív vybírejte, pak commitujte.
5. Celé `src/assets/` má rozpočet **300 MB**. Skript vypíše celkovou velikost.

### Přidej partnera
1. Přidejte položku do `src/content/partneri/partneri.yaml` (`id`, `nazev`, `url`, `poradi`).
2. Logo (volitelné) uložte do `src/content/partneri/loga/` a doplňte `logo: ./loga/<soubor>`.
3. Pozor: pivní partner (Pilsner Urquell) se zmiňuje jen u akcí pro dospělé (`proDospele: true`), nikdy u dětských.
   Nepřijímáme partnery z oboru hazardu a sázek, tabáku a nikotinu ani politicky exponované subjekty.

### Otevři nový ročník
1. Založte `src/content/rocniky/<rok>.yaml` (zkopírujte poslední ročník): `cislo`, `rok`, `od`, `do`, `barva`,
   `nazevBarvy`, `mesta`, `perex`. Barvu ročníku určuje Marek Vlček (správce značky).
2. V `src/config.ts` změňte `aktualniRocnik`. Tím se změní barva akcentu celého webu a obsah stránky Program.
3. Přidejte barvu do `src/styles/tokens.css` (`--rocnik-<rok>`).
4. Logo se štítkem ročníku dodá Marek do `docs/brand/logo/`, pak ho vyměňte v `src/components/Logo.astro`
   a spusťte `node scripts/og-default.mjs` (obrázek pro sdílení).

### Aktualizuj materiály pro média
`node scripts/media-balicek.mjs <složka s originály>` vytvoří `public/media/ctu-ve-meste-loga.zip`
(loga SVG + PNG) a fotky ve vysokém rozlišení v `public/media/foto/`. Náhledy na stránce Pro média
se berou z výběru fotek ročníku 2026 (`src/pages/pro-media.astro`).

### Formuláře (newsletter, kontakt)
Formuláře posílají data do Google Apps Scriptu (`apps-script/Web.gs`, návod v `apps-script/README.md`).
URL web appu je v proměnné `PUBLIC_APPS_SCRIPT_URL` (GitHub → Settings → Variables, lokálně `.env`).
Bez ní se místo formulářů ukáže odkaz na e-mail.

## Pravidla pro obsah (důležité)

- **Tón:** vlídný, hravý, sousedský. Vykáme v množném čísle („Přijďte“, „Vezměte si“). Heslo tyká:
  „sedni si, čti, buď vidět“. Žádná velká slova o kultuře.
- Popis akce končí rubrikou **„Pro koho“** (pole `proKoho`). U nadcházejících akcí je povinná.
  U proběhlých akcí ze starého webu chybí a nedoplňuje se (výjimka pro archiv, rubrika se pak nezobrazí).
- **Netvrďte, že festival běží bez dotací, grantů nebo sponzorů.** Už to neplatí (dotace města F-M,
  příspěvek Plzeňského Prazdroje). Manifest zůstává doslovně, jinde to nepište.
- **Plzeň jako město 4. ročníku nikde nezveřejňujte**, dokud to tým neoznámí.
- Pivní partner (Pilsner Urquell) jen u akcí pro dospělé, ne u dětských akcí.
- Žádné osobní telefony ani soukromé e-maily organizátorů. Na webu jsou jen adresy na doméně spolku
  (`…@ctuvemeste.cz`). Hlavní kontakt je v `src/config.ts` (`email`), v textech ho nepište natvrdo.
- Festival je apolitický. Žádná politická ani konfliktní témata.
- Nevymýšlejte fakta, čísla, data ani citace. Co chybí, označte v obsahu `TODO:`.
- Hvězdami jsou čtenáři, ne autoři.

## Technické poznámky

- Akcent webu = barva aktuálního ročníku (`config.aktualniRocnik` → barva z `rocniky/<rok>.yaml`).
  Archiv ročníku a karty akcí používají barvu svého ročníku. Text na akcentu je vždy černý.
- Interní odkazy v šablonách vždy přes `url('/cesta/')` z `src/lib/url.ts` (web zatím běží v podsložce `/web/`).
- Web nesmí nastavovat cookies. Analytika se zapíná jen v `src/config.ts` (`analytika`).
- Přepnutí na doménu ctuvemeste.cz: krok za krokem v `docs/spusteni.md` (MX a TXT záznamy pro e-mail se nesmí smazat).
- Kontroly: `npm run build`, `npm run kontrola-odkazu`, `npm run kontrola-presmerovani` (spouští je i GitHub u každého PR).
- Pivní partner má v `partneri.yaml` příznak `proDospele: true`, proto se neukazuje na úvodní stránce.
- Textové stránky používají `src/components/TextPanel.astro`: text vlevo, vpravo panel s fotkou a hlavní výzvou.
- Tečka v barvě akcentu patří jen k hlavním nadpisům (h1 a nadpisy sekcí), ne k nadpisům karet ani do menu.
- Nápady a rozpracované věci na později: `docs/dalsi-kroky.md`.

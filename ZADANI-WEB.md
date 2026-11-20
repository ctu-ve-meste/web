# Zadání: nový web ctuvemeste.cz

Zadání pro Claude Code. Funguje i v cloudové session v aplikaci Claude s připojeným GitHubem, nic se nemusí stahovat na počítač.

**Před spuštěním připrav v novém repu `web`:**
```
ZADANI-WEB.md                      ← tento soubor
docs/ctu-ve-meste-kontext.md       ← podklad s fakty (z Claude projektu)
docs/brand/Brandmanual.cz.pdf      ← brandmanuál
docs/brand/ctu-2027.pdf            ← pitch 2027
docs/brand/logo/                   ← SVG/PDF loga od Marka
(fotky: viz sekce 6a, nestahují se na počítač a nepatří do gitu)
```
Pak Claudovi napiš: „Přečti ZADANI-WEB.md a všechno v docs/, začni v plan módu a projdi se mnou plán, než začneš psát kód.“

---

## 1. Kontext

**Čtu ve městě** je čtenářský festival ve Frýdku-Místku, který pořádá spolek Čtu ve městě, z.s. (dobrovolníci). Festival probíhá každý rok začátkem září (čt–ne) a během roku se konají menší akce (Kafe&kniha, ČtuX, Čteme ze Švejka…). Hlavní myšlenka: hvězdami jsou čtenáři, ne autoři. Lidé si přijdou potichu číst vlastní knihu na neobvyklá místa ve městě. Pravidlo: „sedni si, čti, buď vidět.“

Současný web běží na **Google Sites** (https://www.ctuvemeste.cz). Problémy:

- Navigace je hamburgerové boční menu s 30+ položkami: všechny proběhlé akce ze všech ročníků jsou na jedné úrovni pod „Uplynulé akce“, bez roků a bez struktury. Na mobilu i desktopu působí šablonovitě.
- Design je omezený šablonou Google Sites a neodpovídá identitě z pitche 2027 (viz sekce 4).
- Akce nemají strukturovaná data (datum, místo, ročník), proto se nedají filtrovat a na webu jsou chybná data (program 3. ročníku uvádí čtvrteční akce jako „4. září“, správně je 3. 9. 2026).
- Lišta s Google cookies, pomalé načítání fotek.
- Chybí stránky pro nová města, média, newsletter a archiv ročníků.

**Cíl:** statický web v kódu (Astro) na GitHub Pages s doménou ctuvemeste.cz. Vizuálně podle pitche 2027 a brandmanuálu. Obsah v Markdown/YAML souborech, aby ho mohli upravovat členové týmu přes Claude (bez CMS).

## 2. Technické řešení

- **Framework:** Astro (aktuální stabilní verze), čistě statický výstup. Bez React/Vue, pokud to není nutné. Interaktivitu (filtr akcí, galerie) řeš vanilla JS nebo Astro islands s minimem JS.
- **Styly:** čisté CSS s custom properties (design tokeny v jednom souboru). Bez Tailwindu, aby šablony zůstaly čitelné i pro netechniky.
- **Obsah:** Astro Content Collections se Zod schématy (viz sekce 5). Validace schémat musí při chybě shodit build. Je to pojistka, když obsah upravuje někdo jiný.
- **Obrázky:** `astro:assets` (WebP/AVIF, responzivní `srcset`, lazy loading). Originály v `src/assets/`, nikdy přímé odkazy na googleusercontent.
- **Velikost:** repo i publikovaný web držet hluboko pod 1 GB (limit fotek v sekci 6a).
- **Hosting:** GitHub Pages, deploy přes GitHub Actions (oficiální `withastro/action`) při push do `main`. Veřejný repozitář.
- **Doména:** ctuvemeste.cz + www (soubor `public/CNAME`), vynucené HTTPS.
- **Analytika:** zatím žádná, rozhodne se později. Připrav v layoutu jedno místo (komponenta `Analytics.astro`, řízená konfigurací), kam se měřicí kód vloží. Web teď nesmí nastavovat žádné cookies a nemá cookie lištu. Pokud se později zvolí Google Analytics, bude potřeba lišta se souhlasem (Consent Mode); bezcookiesové nástroje (GoatCounter, Cloudflare) ji nepotřebují.
- **Node:** verzi zafixuj v `.nvmrc` a v `package.json` (`engines`).

## 3. Informační architektura

Nahoře horizontální navigace s max. 6 položkami, na mobilu jednoduché celoobrazovkové menu (ne boční šuplík se stovkou odkazů). Zbytek do patičky.

**Hlavní navigace:** Program · Akce · Města · Přidejte se · O nás · Kontakt
(„Podpořte nás“ jako zvýrazněné tlačítko vpravo)

| URL | Stránka | Obsah |
|---|---|---|
| `/` | Úvod | Hero s aktuálním stavem (nadcházející akce nebo „4. ročník 2027 se připravuje“), co to je (3 věty + „sedni si, čti, buď vidět“), nejbližší akce (3 karty), čísla z pitche, upoutávka na Přidejte se, přihlášení k newsletteru, pás partnerů |
| `/program/` | Program aktuálního ročníku | Akce aktuálního ročníku po dnech. Když program ještě není, prázdný stav s datem ročníku (pokud je známé) a odkazem na newsletter |
| `/akce/` | Všechny akce | Seznam všech akcí, filtr podle roku a typu (festival / celoroční), nejnovější nahoře |
| `/akce/[slug]/` | Detail akce | Název, datum a čas, místo (adresa + odkaz na mapu), popis, rubrika **„Pro koho“**, registrace (pokud je), galerie, odkaz na formát |
| `/rocniky/` | Ročníky | Přehled 2024, 2025, 2026 (+ 2027) s barevnou tečkou ročníku |
| `/rocniky/[rok]/` | Archiv ročníku | Termín, města, seznam akcí, výběr fotek, galerie. Nahrazuje dnešní „Galerie 3. ročník“ |
| `/kafe-a-kniha/` | Kafe&kniha | Pravidelná měsíční akce: vždy první neděli v měsíci, pokaždé v jiné kavárně. Nejbližší termín + proběhlé |
| `/mesta/` | Další města | Seznam aktivních měst (karta = město, rok zapojení, místní partner) + výzva „Vaše město?“ s odkazem na Přidejte se |
| `/mesta/[slug]/` | Podstránka města | Jen pro **aktivní** města: zatím Frýdek-Místek a Tišnov, další přibudou se 4. ročníkem. Místní tým, partner (např. knihovna), akce v daném městě po rocích, kontakt/sociální sítě. Nahrazuje dnešní `/tisnov`. Göteborg, Ostravice a Těrlicko (2025) podstránku nemají, jsou jen zmíněné v archivu ročníku 2025. Göteborg se už neopakuje |
| `/pridejte-se/` | Přidejte se | Pro města, školy, kavárny a firmy podle pitche 2027 („Chcete, aby se četlo i u vás?“), argumenty Pro město / Pro podniky / Pro partnery, jak to funguje, co dodáme (formáty, vizuál, zkušenosti), kontaktní CTA |
| `/formaty/` | Slovníček formátů | Karty formátů (Čtení na Svobodě, Čtenářský přívoz, Čtení pod dekou, Kafe&kniha, Čtiout zóna…), u každého odkaz na proběhlé akce daného formátu |
| `/manifest/` | Manifest | Doslovné znění manifestu z dnešního webu |
| `/kdo-jsme/` | Kdo jsme | Spolek, příběh vzniku („Jednou zprávou“, chatová konverzace z pitche jako vizuální prvek), medailonky dobrovolníků |
| `/partneri/` | Partneři | Loga a odkazy, poděkování, CTA „Chci vás podpořit“ |
| `/podporte-nas/` | Podpořte nás | Dobrovolnictví, čtupomínkové předměty (Bucláček, tričko, záložka), finanční příspěvek |
| `/aplikace/` | Aplikace | Funkce aplikace, odkaz na Google Play |
| `/pro-media/` | Pro média | Krátký a dlouhý popis festivalu, fakta a čísla, loga ke stažení (ZIP), vybrané fotky ve vysokém rozlišení, ohlasy v médiích, kontakt pro média |
| `/newsletter/` | Newsletter | Přihlášení k odběru, co v něm bude, odkaz na odhlášení |
| `/kontakt/` | Kontakt | E-mail, sídlo spolku, IČ, sociální sítě, formulář pro nápady |
| `/ochrana-osobnich-udaju/` | GDPR | Nutné kvůli newsletteru a formulářům. Text připraví uživatel, ty vytvoř stránku s placeholderem |
| `/404` | Nenalezeno | V duchu značky („Tahle stránka se asi začetla.“) s odkazy na hlavní sekce |

## 4. Design

**Zdroje identity (v `docs/brand/`):**
1. `Brandmanual.cz.pdf`: brandmanuál od Marka Vlčka (strážce značky). Má přednost.
2. `ctu-2027.pdf`: pitch 2027, vzor pro skladbu stránek a akcent.
3. `logo/`: logo v SVG/PDF od Marka. **Logo nepřekresluj**, použij dodané soubory.

**Shrnutí brandmanuálu (ověř v PDF):**
- Hlavní prvek je slovo **„čtu“, vždy bílé na černém pozadí**. Web je tedy primárně černý s bílým textem.
- **Varianty loga:** základní („čtu“), rozšířená („čtu“ + „opravdu /||/ čtenářský festival“), rozšířená s webovkou (+ „ctuvemeste.cz“), rozšířená s webovkou a štítkem ročníku. Podle manuálu má varianta s webovkou přednost tam, kde se šíří (tiskoviny, sdílené obrázky).
- **Na webu:** v záhlaví na desktopu rozšířená varianta, na mobilu (a po scrollu) základní „čtu“. V patičce rozšířená varianta s webovkou a štítkem aktuálního ročníku. Ve sdílecích OG obrázcích varianta s webovkou. Pokud bude rozšířená varianta v záhlaví působit stísněně, použij základní a ukaž obě možnosti na `/styleguide/`.
- **Písma (Google Fonts, hostuj lokálně přes `@fontsource`, ne z CDN):**
  - **Bricolage Grotesque Bold**: nadpisy, navigace, tlačítka, štítky. Nadpisy drž ve stejné tloušťce.
  - **Merriweather Light**: běžný text (knižní, čitelné i pro dyslektiky). Pro zvýraznění Merriweather Bold, pro citace Merriweather Light Italic.
  - Velikosti nadpisů „strukturujte jako v knize“: jasná hierarchie, umírněný počet úrovní. Motto manuálu: „Méně je více.“
- **Barvy:**
  - základní: bílá `#FFFFFF`, černá `#000000`
  - ročníkové: 2024 modrá `#7FEAFF` (vzorkováno z manuálu, manuál uvádí, že se už nemá znovu použít pro nový ročník), 2025 zelená `#ABFF93`, 2026 fialová a 2027 žlutá: přesné hodnoty vzorkuj z pitche 2027 (`ctu-2027.pdf`) a ověř je s uživatelem na `/styleguide/`.
  - **Akcent webu = barva aktuálního ročníku** (teď žlutá 2027). Nastav ho jednou proměnnou v konfiguraci (`aktualniRocnik` → `--accent`), aby se příští rok změnil jedním řádkem. Archiv každého ročníku a štítky akcí používají barvu svého ročníku.
  - Akcent je jen na zvýraznění (tečka za nadpisy, štítek ročníku, tlačítka, podtržení odkazů, focus), nikdy ne na velké plochy textu. Ohlídej kontrast textu na barevném pozadí (černý text na akcentu).
- **Grafický prvek:** lomítka a svislé čáry vedle sebe („/|||/||/||||/||/“) evokují hřbety knih. Manuál ho používá v řádcích přes celou šířku i jako malý doplněk vedle nadpisu sekce („barvy /|||/||/“). Udělej z něj komponentu (SVG nebo font Bricolage, ne obrázek), s variantami: pás přes celou šířku, malý doplněk k nadpisu, výplň hero. Používej ho hravě, ale střídmě.
- Manuál: „Nechte značku dýchat, tvořte svobodně, ovšem s respektem.“ Je to „stavebnice LEGO, ne návod IKEA“.

**Prvky z pitche:**
- **Nadpisy sekcí:** krátká úderná věta zakončená tečkou v barvě akcentu, nad ní malý štítek verzálkami s proloženými písmeny (např. „CO TO JE“, „KDE SE TO DĚJE“), případně s malým lomítkovým doplňkem. Komponenta `<SectionHeading label="CO TO JE">Hvězdy jsou čtenáři.</SectionHeading>`.
- Velká čísla (~1000, 84 %, 11×, +3) jako výrazné typografické bloky.
- Chatová konverzace „Jednou zprávou.“ (Jan a Marek) jako vizuální prvek na stránce Kdo jsme.
- Promo předměty z manuálu (velký nápis „čtu“, záložka, poukázka „Dvě hodiny nerušeného čtení jsou vaše.“) se hodí jako motivy na stránku Podpořte nás.

**Zásady:**
- Žádné boční menu, žádný šablonovitý vzhled Google Sites. Web má působit jako pokračování pitche a plakátů.
- Fotky z akcí jsou hlavní obsah (lidé čtoucí na náměstí, v lodičce, pod dekou). Dávej jim prostor, velké formáty, noční fotky na černém pozadí fungují.
- Mobile-first: většina návštěv přijde z Instagramu na telefonu.
- Přístupnost: WCAG 2.1 AA, kontrast (pozor na text na pozadí v barvě akcentu), viditelný focus, ovládání klávesnicí, alt texty, `lang="cs"`, `prefers-reduced-motion`.
- Animace jen jemné (objevení sekcí), žádné parallaxy ani karusely s autoplay.

Před stavbou stránek připrav **stránku `/styleguide/`** (vyřazenou ze sitemap a s `noindex`), kde budou barvy, typografie, nadpisy se štítkem, tlačítka, karty akcí, varianty loga v záhlaví a lomítkový prvek. Ukaž ji uživateli ke schválení (pošle ji i Markovi Vlčkovi).

## 5. Obsahový model

Všechno, co se mění, musí být v `src/content/`, ne v šablonách.

```
src/content/
  akce/            # jedna akce = jeden .md soubor
  rocniky/         # 2024.yaml, 2025.yaml, ...
  mesta/           # frydek-mistek.md, tisnov.md, ...
  formaty/         # cteni-na-svobode.md, ...
  dobrovolnici/    # medailonky
  partneri/        # partneri.yaml
  media/           # ohlasy v médiích (yaml)
  stranky/         # texty statických stránek (manifest, kdo jsme, přidejte se...)
```

**Akce (frontmatter):**
```yaml
title: Čtení na Svobodě
slug: cteni-na-svobode-2026
date: 2026-09-04
timeStart: "10:00"
timeEnd: "22:00"
rocnik: 2026            # null u celoročních akcí
typ: festival           # festival | celorocni | kafe-a-kniha
mesto: frydek-mistek
format: cteni-na-svobode   # odkaz do kolekce formátů, volitelné
misto:
  nazev: náměstí Svobody
  adresa: náměstí Svobody, Místek
  mapa: https://mapy.cz/...  # volitelné
proKoho: "Pro menší, větší, starší, zvědavé, romantiky i introverty."
registrace:               # volitelné
  url: https://forms.gle/...
  kapacita: omezená
  vyprodano: false
poznamka: Čas se může měnit podle počasí.
cover: ./img/cteni-na-svobode-2026.jpg
galerie: [./img/...]
```
Tělo souboru = popis akce. Akce se samy řadí do Programu (budoucí), Archivu ročníku, stránky Města a Formátu.

**Ročník:** číslo, rok, termín od–do, barva tečky, města, perex, vybrané fotky.
**Město:** název, slug, od kterého roku, místní partner/tým, odkazy na sítě, perex. Nové město = nový soubor, nic jiného se nemění.

## 6. Migrace obsahu

1. Projdi celý současný web (seznam URL je níže) a stáhni texty do content kolekcí. Texty přebírej doslova, jen oprav zjevné chyby. **Data akcí 3. ročníku oprav podle termínu 3.–6. 9. 2026** (čtvrtek 3. 9., pátek 4. 9., sobota 5. 9., neděle 6. 9.).
2. **Fotky:** originály jsou na Google Disku, ve sdílené složce „ČTU - nové“ (ID `1Wyn72l2wSA3nwVmSM2dB4ZwBpZszEz45`, vlastník ctuvemeste.cz@gmail.com). Struktura: `ročník / stát / město / akce` (např. `2_ročník/česko/Frydek-Mistek/Akce_pred_festivalem/Den_cichani_ke_kniham`), mimo ročníky složka `Ostatní` (Média, Partneři, Obrázky_na_webu, Fotky_Aplikace a další). Fotky jsou ~5 MB a je jich hodně. **Uživatel si nic nestahuje do svého zařízení a originály se nikdy nedávají do gitu** (ani přes Git LFS). Postup viz sekce 6a.
3. Jako ověřený podklad k faktům použij `docs/ctu-ve-meste-kontext.md`. Obsahuje všechny akce, data, místa, partnery a média.
4. Vytvoř `docs/migrace.md`: tabulka stará URL → nová URL → stav.

**Stávající URL** (Google Sites používá diakritiku v URL):
```
/úvodní                         → /
/galerie-3-ročník               → /rocniky/2026/
/ctupominkove-predmety          → /podporte-nas/
/manifest                       → /manifest/
/kdo-jsme                       → /kdo-jsme/
/kdo-jsme/nadcházející-akce     → /program/
/partneri                       → /partneri/
/uplynulé-akce                  → /akce/
/uplynulé-akce/<akce>           → /akce/<slug>/   (cca 25 akcí, viz menu dnešního webu)
/kontakty                       → /kontakt/
/tisnov                         → /mesta/tisnov/
/app                            → /aplikace/
/program                        → /program/
```
GitHub Pages neumí serverové přesměrování, proto použij `redirects` v `astro.config` (generuje HTML s meta refresh a `rel=canonical`). Přesměruj obě varianty: s diakritikou i URL-encoded.

## 6a. Fotky: postup a rozpočet na velikost

**Pravidlo: v repozitáři jsou jen webové verze fotek. Originály zůstávají na Google Disku.**

- **Žádné Git LFS.** LFS má kvóty na úložiště a hlavně na přenos, a každý build na GitHub Actions by se do nich započítával. GitHub Pages navíc s LFS soubory potřebuje zvláštní nastavení. Pro webové fotky LFS nepotřebujeme.
- **Webová verze fotky:** WebP, delší strana max. 2000 px (u hero fotek 2400 px), cíl 150–350 KB na fotku. Zpracování dělej skriptem `scripts/zpracuj-fotky.mjs` (sharp), aby šlo kdykoli zopakovat a aby měly všechny fotky stejné parametry. Název souboru: `rok-mesto-akce-poradi.webp`.
- **Rozpočet:** celé `src/assets/` max. **300 MB**, jedna akce max. ~12 fotek v galerii, jeden ročník ~20 výběrových fotek navíc. GitHub doporučuje repo pod 1 GB a Pages web má limit 1 GB, takže tohle nechává dost místa na další roky a další věci. Skript na konci vypíše celkovou velikost, a když rozpočet přesáhne, zastav se a zeptej se uživatele.
- **Historie gitu:** smazané fotky v historii zůstávají a repo nafukují. Proto fotky přidávej v dávkách (jeden commit na akci nebo ročník), nic nepřepisuj dokola a nejdřív vyber, pak commituj. Nikdy necommituj nezmenšené fotky.
- **Výběr:** z každé akce ukaž uživateli kontaktní přehled (náhledy malé, ~400 px, vygenerované mimo repo) a nech ho vybrat. Do repa pak jdou jen vybrané.
- **Kde zpracování běží:** v cloudovém prostředí Claude Code (ne na počítači uživatele), takže se nic nestahuje do jeho zařízení. Pracovní kopie originálů žije jen v dočasném prostoru session a do repa se nedostane (`_fotky-originaly/` je v `.gitignore`).
- **Jak se dostat k Disku z cloudového prostředí (zkoušej v tomto pořadí):**
  1. Zkus, jestli je dostupný Google Disk (ID složky výše): konektor Google Drive v session, nebo `rclone` s `root_folder_id` a read-only přístupem. Cloudové prostředí může mít síť omezenou jen na vybrané domény, takže **nejdřív jednoduchý test** (výpis jedné složky), a když projde, pokračuj.
  2. Pokud Disk dostupný není, řekni uživateli, ať v nastavení prostředí Claude Code povolí doménu `*.googleapis.com` (případně `drive.google.com`) a test zopakuj.
  3. Pokud ani to nejde, použij GitHub Actions: ruční workflow `zpracuj-fotky.yml` (spouští se tlačítkem), které na runneru stáhne vybrané složky z Disku přes rclone se **service accountem** (JSON klíč v GitHub Secrets, složka na Disku nasdílená e-mailu service accountu jen ke čtení), fotky zmenší a založí pull request jen s webovými verzemi. Originály na runneru po doběhnutí zmizí. Návod na vytvoření service accountu připrav krok za krokem a nic neměň v Google účtu sám.
- Soubory v `Ostatní` (Obrázky_na_webu, Partneři, Média) si projdi a použij to, co se hodí (loga partnerů, fotky pro média). Nekopíruj složku celou.

## 7. Formuláře a napojení

Na webu není backend, všechno jde přes Google Workspace pro neziskovky, které spolek používá.

- **Newsletter:** formulář (e-mail + povinný checkbox souhlasu s odkazem na GDPR stránku) posílá `POST` na **Google Apps Script web app**, který zapíše řádek do Google tabulky odběratelů. Apps Script pro rozesílku newsletteru už existuje (Code.gs, Admin.html). Přidej do něj jen endpoint `doPost` pro přihlášení. Ideálně double opt-in (potvrzovací e-mail s odkazem). Do tabulky ukládej datum, zdroj „web“ a znění souhlasu. Ochrana proti spamu: honeypot pole + jednoduchý časový limit, žádná reCAPTCHA. URL web appu dej do `.env`/konfigurace, ne natvrdo. Kód Apps Scriptu ulož do `apps-script/` v repu.
- **Odhlášení:** stránka `/newsletter/odhlaseni/?e=...&t=...` volá stejný web app (token, ne holý e-mail).
- **Kontaktní formulář / nápady:** stejný princip (Apps Script → tabulka + upozornění e-mailem na ctuvemeste.cz@gmail.com). Fallback je `mailto:`.
- **Registrace na akce s omezenou kapacitou:** zůstávají v Google Forms, akce má jen odkaz (`registrace.url`) a příznak `vyprodano`.
- Žádné vložené Instagram/Facebook widgety (pomalé, cookies), jen odkazy a vlastní fotky.

## 8. SEO a sdílení

- Každá stránka: `<title>`, meta description, Open Graph a Twitter karta. Výchozí OG obrázek je v brandu (černé pozadí, logo s webovkou, štítek ročníku v barvě akcentu). U akcí se OG obrázek generuje z cover fotky a názvu, pokud to jde rozumně (jinak cover).
- **schema.org JSON-LD:** `Organization` (spolek, IČ, sídlo), `Event` u každé akce (datum, místo, `isAccessibleForFree: true`, `eventStatus`), `Festival`/`EventSeries` pro ročník. Google pak může akce ukazovat ve vyhledávání.
- `sitemap.xml` (`@astrojs/sitemap`), `robots.txt`, kanonické URL bez koncového lomítka podle jedné konvence.
- Kalendářové soubory: u akce tlačítko „Přidat do kalendáře“ (`.ics` generovaný při buildu).

## 9. Pravidla pro obsah (důležité)

- Tón: vlídný, hravý, sousedský, vykání v množném čísle („Přijďte“, „Vezměte si“). Heslo tyká („sedni si, čti, buď vidět“). Žádná velká slova o kultuře.
- Popis akce končí rubrikou **„Pro koho“**.
- **Netvrď, že festival běží bez dotací, grantů nebo sponzorů.** Už to neplatí (dotace města F-M, příspěvek Plzeňského Prazdroje). Manifest se ponechá doslova, ale jinde to nepiš.
- **Plzeň jako město 4. ročníku nikde nezveřejňuj**, dokud to tým neoznámí.
- Pivní partner (Pilsner Urquell) jen u akcí pro dospělé, ne u dětských akcí.
- Žádné osobní telefony ani soukromé e-maily organizátorů. Kontakt: ctuvemeste.cz@gmail.com.
- Festival je apolitický. Žádná politická ani konfliktní témata.
- Nevymýšlej fakta, čísla, data ani citace. Co chybí, označ v obsahu `TODO:` a vypiš to uživateli.

## 10. CLAUDE.md pro tým

Vytvoř v kořeni repa `CLAUDE.md`, podle kterého bude obsah upravovat každý člen týmu se svým Claudem. Obsah:
- struktura repa a kde je jaký obsah,
- recepty: „přidej novou akci“, „přidej nové město“, „přidej Kafe&kniha na další měsíc“, „přidej fotky do galerie“, „přidej partnera“, „otevři nový ročník“,
- pravidla z sekce 9,
- workflow: změna v nové větvi → `npm run build` musí projít → pull request → po merge se web nasadí sám. Do `main` se necommituje přímo (nastav branch protection),
- jak spustit web lokálně.

Přidej i šablony `src/content/akce/_sablona.md` a `src/content/mesta/_sablona.md`.

## 11. Kvalita a kontrola

- `npm run build` bez chyb a varování, `astro check` čistý.
- Lighthouse (mobil) na úvodu, detailu akce a archivu ročníku: Performance ≥ 90, Accessibility ≥ 95, SEO 100.
- Kontrola odkazů (žádné 404 v rámci webu), test všech přesměrování ze sekce 6.
- Vizuální kontrola na šířkách 375, 768 a 1440 px.
- GitHub Action, která při PR spustí build + kontrolu odkazů.

## 12. Nasazení a přepnutí domény

Doménu přepínej až po schválení webu uživatelem. Do té doby web běží na `https://<uzivatel>.github.io/<repo>/` (nebo na náhledové subdoméně).

1. Repo `web` v už existující GitHub organizaci spolku (stejná, kde je repo newsletteru; název organizace zjisti z `git remote`). Pages → Source: GitHub Actions.
2. **Než se sáhne do DNS, vypiš uživateli současné DNS záznamy, které musí zůstat:** hlavně **MX a TXT (SPF/DKIM/ověření Google)** kvůli e-mailu přes Google Workspace. Měnit se smí jen záznamy pro web.
3. DNS u registrátora (dělá uživatel, ty připrav přesný návod):
   - `A` pro `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `AAAA` pro `@`: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
   - `CNAME` pro `www` → `<organizace>.github.io`
   - Ověření domény v nastavení GitHub organizace (TXT záznam), ochrana proti převzetí domény.
4. V Google Sites zruš vlastní doménu (Settings → Custom domains), web Sites nemaž, nech ho jako zálohu.
5. Po propagaci DNS zapni „Enforce HTTPS“, otestuj přesměrování a pošli novou sitemapu do Google Search Console.

## 13. Postup práce (fáze)

Po každé fázi se zastav a ukaž výsledek uživateli.

0. **Plán:** projdi zadání a `docs/`, navrhni strukturu repa. Otázky jen podle pravidel v sekci 14.
1. **Kostra:** Astro projekt, content kolekce se schématy, deploy na GitHub Pages (zatím bez domény), CLAUDE.md.
2. **Design systém:** tokeny, fonty, komponenty, `/styleguide/` → schválení.
3. **Migrace obsahu:** všechny stávající stránky a akce + `docs/migrace.md`.
4. **Nové stránky:** Přidejte se, Formáty, Města, Ročníky, Kafe&kniha, Pro média, Newsletter, GDPR, 404.
5. **Formuláře:** Apps Script endpointy, newsletter, kontakt.
6. **QA:** sekce 11.
7. **Spuštění:** sekce 12.

## 14. Rozhodnuto (neptej se znovu)

- **Jazyk:** jen čeština. Anglickou verzi neřeš a nepřipravuj (případně až v dalším roce).
- **Analytika:** zatím žádná, jen připravené místo (sekce 2).
- **Akcent:** barva aktuálního ročníku (sekce 4).
- **Logo v záhlaví:** podle sekce 4, finální volbu ukaž na `/styleguide/`.
- **Města:** podstránky jen pro aktivní města (F-M, Tišnov), minulá jen v archivu 2025.
- **Fotky:** originály jen na Google Disku, v repu jen zmenšené WebP, bez Git LFS, nic se nestahuje na zařízení uživatele (sekce 6a).
- **Repo:** existující organizace spolku, repo `web`.

**Výchozí hodnoty tam, kde chybí podklady (nezdržuj se, jen vypiš na konci fáze, co je `TODO:`):**
- Kontakt pro média: festivalový e-mail ctuvemeste.cz@gmail.com.
- Ke stažení pro média: logo z `docs/brand/logo/` (ZIP) a 6–10 vybraných fotek; seznam ukaž uživateli ke schválení.
- GDPR stránka: struktura (správce: Čtu ve městě, z.s., IČ 22293752, Hlavní třída 107, 738 01 Frýdek-Místek; účel: zasílání newsletteru; právní základ: souhlas; doba uložení: do odhlášení; práva subjektu; kontakt) s označením `TODO: zkontrolovat`. Nevydávej ji za právní radu.
- Kafe&kniha: stránka vysvětluje formát (první neděle v měsíci, pokaždé jiná kavárna). Konkrétní termíny 2027 doplní tým přes recept v CLAUDE.md. Do té doby prázdný stav „Další termín brzy, přihlaste se k newsletteru“.
- Nová města 4. ročníku: nezveřejňovat, dokud je tým sám nedoplní.

**Ptej se jen tehdy, když:** jde o nevratný krok (DNS, mazání, push do `main`), o výběr fotek a schválení `/styleguide/`, nebo když podklady v `docs/` odporují tomuto zadání.

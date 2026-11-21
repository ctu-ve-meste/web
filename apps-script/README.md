# Google Apps Script pro web

Web je statický, formuláře (newsletter, kontakt, přihláška města) posílají data do Google Apps Script
web appu. Ten je zapíše do Google tabulky a pošle e-mail. Kód je v `Web.gs`.

## Nasazení

Web.gs patří do **stejného projektu Apps Scriptu jako newsletter** (repo `ctu-ve-meste/newsletter`, skript navázaný
na tabulku). Přihlášení k newsletteru, potvrzení a odhlášení řeší newsletter sám (`handleSignup_`, `doGet`
v jeho `Code.gs`). `Web.gs` přidává jen **kontaktní formulář** a **přihlášku města**.

1. V tabulce otevři Rozšíření → Apps Script (projekt s newsletterem).
2. Přidej soubor `Web.gs` s obsahem `apps-script/Web.gs`. Funkce se jmenuje `DoWebPost`.
3. V `Code.gs` uprav `doPost` tak, aby po přihlášení volal `DoWebPost`:
   ```js
   function doPost(e) {
     const p = (e && e.parameter) || {};
     if (p.a === 'signup') return handleSignup_(p);
     return DoWebPost(e);   // kontakt a přihláška města z webu (JSON)
   }
   ```
4. Script properties: přidej `NOTIFY_EMAIL` (`tobias.otta@ctuvemeste.cz`). Ostatní (`WEBAPP_URL`, `ADMIN_KEY`…) už máš.
5. V `Code.gs` nastav `ORG.privacy` na `https://www.ctuvemeste.cz/ochrana-osobnich-udaju/` (do přepnutí domény
   na adresu s `/web/`).
6. Deploy → Manage deployments → u stávajícího web appu Edit → New version → Deploy (adresa `/exec` se nezmění).
7. Adresu `/exec` nastav na GitHubu: Settings → Secrets and variables → Actions → **Variables** →
   `PUBLIC_APPS_SCRIPT_URL`, a spusť znovu nasazení webu (Actions → Nasazení na GitHub Pages → Run workflow).

Listy `Kontakt` a `Města` se založí samy při první zprávě.

## Ochrana proti spamu

- skryté pole `web` (honeypot): když ho někdo vyplní, uložení se tiše přeskočí,
- formulář odeslaný dřív než 3 s po načtení stránky se ignoruje,
- limit počtu požadavků na jeden e-mail (CacheService, 10 minut),
- žádná reCAPTCHA ani cookies.

## Newsletter

Formulář na webu je obyčejný HTML formulář, který posílá `POST` s `a=signup` na web app. Zbytek (honeypot,
čas odeslání, denní limit, potvrzovací e-mail, double opt-in) dělá `handleSignup_` v newsletteru.

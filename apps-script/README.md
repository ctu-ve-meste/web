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
4. Script property: přidej `NOTIFY_EMAIL` (`tobias.otta@ctuvemeste.cz`). Ostatní (`WEBAPP_URL`, `ADMIN_KEY`…) už máš.
   ID tabulek jsou v konstantě `TABULKY` na začátku `Web.gs` (žádná Script property `FORMS_SHEET_ID` už není).
5. V `Code.gs` nastav `ORG.privacy` na `https://www.ctuvemeste.cz/ochrana-osobnich-udaju/` (do přepnutí domény
   na adresu s `/web/`).
6. Deploy → Manage deployments → u stávajícího web appu Edit → New version → Deploy (adresa `/exec` se nezmění).
7. Adresu `/exec` nastav na GitHubu: Settings → Secrets and variables → Actions → **Variables** →
   `PUBLIC_APPS_SCRIPT_URL`, a spusť znovu nasazení webu (Actions → Nasazení na GitHub Pages → Run workflow).

## Kam se formuláře ukládají

| Formulář | Tabulka | List |
|---|---|---|
| Newsletter (úvod, `/newsletter/`) | tabulka newsletteru `1Wb2d2mZtleRf6Qc1jjpEneUOWcr5lRWstKT8IssuE2g` (řeší `Code.gs`) | `Odběratelé` |
| Kontaktní formulář (`/kontakt/`, vč. „Odstranění fotky“) | tabulka formulářů `1vudmmDNjazSU6E_prh0TXbz2IYaP-lDICNo3FjFnKDQ` | `Kontakt` |
| Přihláška města (`/pridejte-se/`) | tabulka formulářů `1vudmmDNjazSU6E_prh0TXbz2IYaP-lDICNo3FjFnKDQ` | `Města` |

- Obě ID jsou na jednom místě, v `TABULKY` na začátku `Web.gs`. Seznam listů a jejich hlaviček je v `LISTY`.
- List se při prvním zápisu sám založí s hlavičkou sloupců.
- Nový formulář z webu = nová položka v `LISTY` a zápis přes `zapis_()`. Vždy půjde do tabulky formulářů, nikdy do newsletteru.
- Účet, pod kterým web app běží (`executeAs: USER_DEPLOYING`, tedy ten, kdo skript nasazuje), musí mít u tabulky formulářů **právo úprav**.
  Když ho nemá, formulář ukáže chybu „Zprávu se teď nepodařilo uložit“, nic se neuloží ani neodešle e-mailem a důvod je v Apps Scriptu v Spuštění (Executions).
- Dřív se listy `Kontakt` a `Města` zakládaly v tabulce newsletteru. Starší řádky tam zůstaly, přesuňte je ručně.

## Ochrana proti spamu

- skryté pole `web` (honeypot): když ho někdo vyplní, uložení se tiše přeskočí,
- formulář odeslaný dřív než 3 s po načtení stránky se ignoruje (chybějící nebo nečíselný čas = robot),
- robot dostane stejnou odpověď jako člověk (`ok`), takže nepozná, proč se nic neuložilo,
- limit počtu požadavků na jeden e-mail (CacheService, 10 minut),
- žádná reCAPTCHA ani cookies.

## Newsletter

Formulář na webu je obyčejný HTML formulář, který posílá `POST` s `a=signup` na web app. Zbytek (honeypot,
čas odeslání, denní limit, potvrzovací e-mail, double opt-in) dělá `handleSignup_` v newsletteru.

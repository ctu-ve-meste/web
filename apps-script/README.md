# Google Apps Script pro web

Web je statický, formuláře (newsletter, odhlášení, kontakt, přihláška města) posílají data do Google Apps Script
web appu. Ten je zapíše do Google tabulky a pošle e-mail. Kód je v `Web.gs`.

## Nasazení

Web.gs patří do **stejného projektu Apps Scriptu jako newsletter** (repo `ctu-ve-meste/newsletter`, soubory
`Code.gs` a `Admin.html`, skript navázaný na tabulku). Newsletter žádnou funkci `doPost` nemá, takže ta ve `Web.gs`
je jediná a žádné přejmenování ani router nejsou potřeba.

1. V tabulce odběratelů otevři Rozšíření → Apps Script (projekt s newsletterem už běží podle jeho README).
2. Přidej nový soubor `Web.gs` a vlož obsah `apps-script/Web.gs` z tohoto repozitáře.
3. List s odběrateli se jmenuje přesně `Odběratelé` a má hlavičku z README newsletteru:
   `e-mail | jméno | stav | token | žádost odeslána | potvrzeno | odhlášeno | poslední zaslané číslo`.
   Přihlášení z webu se zapíše do něj, ve stavu `čeká`, a po kliknutí na odkaz v e-mailu se změní na `odebírá`.
4. Project Settings → Script properties, přidej k těm z newsletteru:
   - `SITE_URL` – `https://www.ctuvemeste.cz` (do přepnutí domény `https://ctu-ve-meste.github.io/web`)
   - `NOTIFY_EMAIL` – `tobias.otta@ctuvemeste.cz`
5. Deploy → **Manage deployments** → u stávajícího web appu Edit → New version → Deploy.
   (Newsletter už web app má. Nové nasazení by změnilo adresu `/exec`.) Execute as: Me, Who has access: Anyone.
6. Zkopíruj URL web appu (končí `/exec`) a nastav ji:
   - na GitHubu: Settings → Secrets and variables → Actions → **Variables** → `PUBLIC_APPS_SCRIPT_URL`
   - pro lokální vývoj do souboru `.env` (viz `.env.example`)
7. Spusť znovu nasazení webu (Actions → Nasazení na GitHub Pages → Run workflow).

## Odhlášení

V každém newsletteru je odkaz na odhlášení a odhlášení odpovědí „odhlásit“ (řeší `Code.gs`). Stránka
`/newsletter/odhlaseni/?t=<token>` na webu umí totéž, pokud by se na ni někdy odkazovalo.

## Ochrana proti spamu

- skryté pole `web` (honeypot): když ho někdo vyplní, uložení se tiše přeskočí,
- formulář odeslaný dřív než 3 s po načtení stránky se ignoruje,
- limit počtu požadavků na jeden e-mail (CacheService, 10 minut),
- žádná reCAPTCHA ani cookies.

## Double opt-in

Po přihlášení dostane člověk e-mail s odkazem na `/newsletter/potvrzeni/?t=<token>`. Až po kliknutí se stav
v tabulce změní z `čeká` na `odebírá`. Newsletter posílá jen řádkům se stavem `odebírá`. Nepotvrzené adresy
smaže po 30 dnech `purgePending` z newsletteru.

# Google Apps Script pro web

Web je statický, formuláře (newsletter, odhlášení, kontakt, přihláška města) posílají data do Google Apps Script
web appu. Ten je zapíše do Google tabulky a pošle e-mail. Kód je v `Web.gs`.

## Nasazení (dělá člen týmu s přístupem k Google účtu spolku)

1. Otevřete existující projekt Apps Scriptu s rozesílkou newsletteru (Code.gs, Admin.html).
2. Přidejte nový soubor `Web.gs` a vložte do něj obsah `apps-script/Web.gs` z tohoto repozitáře.
3. **Pokud už Code.gs obsahuje funkci `doPost`**, přejmenujte jednu z nich a z `doPost` volejte obě
   (podle pole `akce`). Dvě funkce `doPost` v jednom projektu fungovat nebudou.
4. Project Settings → Script properties, přidejte:
   - `SHEET_ID` – ID tabulky odběratelů (část URL mezi `/d/` a `/edit`)
   - `SITE_URL` – `https://www.ctuvemeste.cz` (do přepnutí domény `https://ctu-ve-meste.github.io/web`)
   - `NOTIFY_EMAIL` – `tobias.otta@ctuvemeste.cz`
   - `SECRET` – spusťte jednou funkci `vygenerujSecret` a výsledek z logu vložte sem
5. Deploy → New deployment → typ **Web app**:
   - Execute as: **Me** (účet spolku)
   - Who has access: **Anyone**
6. Zkopírujte URL web appu (končí `/exec`) a nastavte ji:
   - na GitHubu: Settings → Secrets and variables → Actions → **Variables** → `PUBLIC_APPS_SCRIPT_URL`
   - pro lokální vývoj do souboru `.env` (viz `.env.example`)
7. Spusťte znovu nasazení webu (Actions → Nasazení na GitHub Pages → Run workflow).

## Odhlašovací odkaz v newsletteru

Do patičky každého rozesílaného e-mailu v Code.gs vložte odkaz z funkce `odhlasovaciOdkaz(email)`.
Odkaz obsahuje podpis (token), takže nikdo nemůže odhlásit cizí adresu jen podle e-mailu.

## Ochrana proti spamu

- skryté pole `web` (honeypot): když ho někdo vyplní, uložení se tiše přeskočí,
- formulář odeslaný dřív než 3 s po načtení stránky se ignoruje,
- limit počtu požadavků na jeden e-mail (CacheService, 10 minut),
- žádná reCAPTCHA ani cookies.

## Double opt-in

Po přihlášení dostane člověk e-mail s odkazem na `/newsletter/potvrzeni/`. Až po kliknutí se stav
v tabulce změní z „čeká na potvrzení“ na „potvrzeno“. Rozesílka by měla posílat jen řádkům se stavem „potvrzeno“.

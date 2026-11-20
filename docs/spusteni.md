# Spuštění webu na ctuvemeste.cz

Postup pro fázi 7. **Doménu přepínejte až po schválení webu.** Do té doby web běží na
https://ctu-ve-meste.github.io/web/.

DNS mění člověk s přístupem k doméně u registrátora (doména je u **Websupportu**, jmenné servery
`ns1.websupport.cz`, `ns2.websupport.cz`, `ns3.websupport.eu`).

## 0. Před spuštěním (jednou)

1. GitHub → repozitář `web` → **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Branches → Add branch ruleset** pro `main`: vyžadovat pull request a úspěšnou kontrolu
   „Kontrola pull requestu“. Do `main` se pak necommituje napřímo.
3. Sloučit pull request do `main`. Nasazení se spustí samo, web je pak na `https://ctu-ve-meste.github.io/web/`.
4. Nasadit Apps Script podle `apps-script/README.md` a nastavit proměnnou `PUBLIC_APPS_SCRIPT_URL`.

## 1. Současné DNS záznamy (stav 20. 11. 2026)

| Název | Typ | Hodnota | Co s tím |
|---|---|---|---|
| `ctuvemeste.cz` | MX | `1 smtp.google.com.` | **NECHAT** (e-mail Google Workspace) |
| `ctuvemeste.cz` | TXT | `v=spf1 include:_spf.google.com ~all` | **NECHAT** (SPF) |
| `ctuvemeste.cz` | TXT | `google-site-verification=tIC7EIWH…` | **NECHAT** (ověření Google) |
| `ctuvemeste.cz` | TXT | `google-site-verification=c7wGFYOg…` | **NECHAT** (ověření Google) |
| `google._domainkey` | TXT | `v=DKIM1; k=rsa; p=…` | **NECHAT** (DKIM) |
| `_dmarc` | TXT | `v=DMARC1; p=none; rua=mailto:admin@ctuvemeste.cz` | **NECHAT** (DMARC) |
| `ctuvemeste.cz` | A | `212.158.150.50` | změnit (viz níže) |
| `www` | CNAME | `ghs.googlehosted.com.` | změnit (dnes Google Sites) |

Před změnou si v administraci Websupportu udělejte snímek obrazovky všech záznamů.
Měnit se smí **jen A/AAAA pro `@` a CNAME pro `www`**.

## 2. Ověření domény v GitHubu (ochrana proti převzetí)

1. GitHub → organizace `ctu-ve-meste` → **Settings → Pages → Add a domain** → `ctuvemeste.cz`.
2. GitHub ukáže TXT záznam (`_github-pages-challenge-ctu-ve-meste` s náhodnou hodnotou).
3. Přidejte ho u Websupportu, počkejte pár minut a klikněte na **Verify**.

## 3. Nové záznamy pro web

| Název | Typ | Hodnota |
|---|---|---|
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153` |
| `@` | AAAA | `2606:50c0:8001::153` |
| `@` | AAAA | `2606:50c0:8002::153` |
| `@` | AAAA | `2606:50c0:8003::153` |
| `www` | CNAME | `ctu-ve-meste.github.io.` |

Starý A záznam `212.158.150.50` a CNAME `www → ghs.googlehosted.com` odstraňte (nahraďte novými).

## 4. Nastavení na GitHubu

1. Repozitář → **Settings → Pages → Custom domain**: `www.ctuvemeste.cz` → Save.
   (Adresa bez www se na www přesměruje sama.)
2. **Settings → Secrets and variables → Actions → Variables**:
   - `SITE` = `https://www.ctuvemeste.cz`
   - `BASE` = `/`
3. V Apps Scriptu změňte Script property `SITE_URL` na `https://www.ctuvemeste.cz`.
4. Spusťte znovu nasazení (Actions → Nasazení na GitHub Pages → Run workflow).
5. Lokálně: `SITE=https://www.ctuvemeste.cz BASE=/ npm run build` (kontrola odkazů pak spouštějte s `BASE=/`).

## 5. Google Sites

V Google Sites: **Settings → Custom domains → odebrat ctuvemeste.cz**. Web na Sites **nemažte**,
nechte ho jako zálohu.

## 6. Po propagaci DNS (obvykle do několika hodin)

1. Settings → Pages → zapnout **Enforce HTTPS** (jde to až po vydání certifikátu).
2. Otestovat staré adresy, např. `https://www.ctuvemeste.cz/tisnov` → `/mesta/tisnov/`
   a `https://www.ctuvemeste.cz/uplynulé-akce/čtení-na-svobodě`.
3. Ověřit, že chodí e-mail na `ctuvemeste.cz@gmail.com` i na adresy v doméně.
4. Google Search Console: odeslat `https://www.ctuvemeste.cz/sitemap-index.xml`.

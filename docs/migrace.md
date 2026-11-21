# Migrace obsahu ze starého webu (Google Sites)

Starý web: https://www.ctuvemeste.cz (Google Sites). Texty převzaty doslova, opraveny jen zjevné překlepy.
Data akcí 3. ročníku opravena podle termínu 3.–6. 9. 2026 (na starém webu byly čtvrteční akce chybně jako „4. září“).

Všechna přesměrování jsou v `src/redirects.ts`. Generují se v podobě s diakritikou i URL-encoded
(GitHub Pages neumí serverové přesměrování, používá se HTML s meta refresh a `rel=canonical`).

| Stará URL | Nová URL | Stav |
|---|---|---|
| `/úvodní` | `/` | přesměrováno |
| `/galerie-3-ročník` | `/rocniky/2026/` | přesměrováno, fotky doplní výběr z Disku |
| `/ctupominkove-predmety` | `/podporte-nas/` | přesměrováno, texty převzaty |
| `/manifest` | `/manifest/` | stejná adresa, text doslova |
| `/kdo-jsme` | `/kdo-jsme/` | stejná adresa, medailonky převzaty |
| `/kdo-jsme/nadcházející-akce` | `/program/` | přesměrováno |
| `/partneri` | `/partneri/` | stejná adresa, text a seznam převzaty |
| `/uplynulé-akce` | `/akce/` | přesměrováno |
| `/kontakty` | `/kontakt/` | přesměrováno; osobní telefony a e-maily organizátorů záměrně vynechány |
| `/tisnov` | `/mesta/tisnov/` | přesměrováno, program převeden na akce |
| `/app` | `/aplikace/` | přesměrováno, text převzat |
| `/app/tos` | `/aplikace/podminky/` | přesměrováno, text doslova |
| `/app/privacy-policy` | `/aplikace/ochrana-soukromi/` | přesměrováno, text doslova (odkaz z Google Play) |
| `/svejk` | – | na starém webu už neexistuje (404), akce je na `/akce/cteme-ze-svejka-2026/` |
| `/program` | `/program/` | stejná adresa; akce 3. ročníku přesunuty do archivu s opravenými daty 3.–6. 9. 2026 |
| `/uplynulé-akce/den-nošení-knih-ve-fm` | `/akce/den-noseni-knih-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/čtu-si-v-autobusi` | `/akce/ctu-si-v-autobusi-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/vyvenči-svoji-knihu` | `/akce/vyvenci-svoji-knihu-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/noční-čtení-pod-svícnem` | `/akce/nocni-cteni-pod-svicnem-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/čteme-ve-městě` | `/akce/cteme-ve-meste-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/čtení-pod-dekou` | `/akce/cteni-pod-dekou-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/kafekniha` | `/akce/kafe-a-kniha-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/knihobudka` | `/akce/knihobudka-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/kavárna-paris` | `/akce/kavarna-paris-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/nedělní-chvilka-poezie` | `/akce/nedelni-chvilka-poezie-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/dopisy-z-války` | `/akce/dopisy-z-valky-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/den-čichání-ke-knihám` | `/akce/den-cichani-ke-kniham-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/vánoční-dárky` | `/akce/vanocni-darky-2024/` | přesměrováno, text převzat |
| `/uplynulé-akce/knihkupectví-snů` | `/akce/knihkupectvi-snu-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/den-darování-knih` | `/akce/den-darovani-knih-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/čtení-lysé-hoře` | `/akce/cteni-lyse-hore-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/šalom-šabat` | `/akce/salom-sabat-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/den-nošení-knih-ve-f-m` | `/akce/den-noseni-knih-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/čtení-pod-hvězdami` | `/akce/cteni-pod-hvezdami-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/vyvenčete-svoji-knihu` | `/akce/vyvencete-svoji-knihu-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/čtení-na-svobodě` | `/akce/cteni-na-svobode-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/čtenářský-přívoz` | `/akce/ctenarsky-privoz-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/čtení-pod-dekou_1` | `/akce/cteni-pod-dekou-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/kafekniha_1` | `/akce/kafe-a-kniha-2025/` | přesměrováno, text převzat |
| `/uplynulé-akce/čtiout-zóna` | `/akce/ctiout-zona-2025/` | přesměrováno, text převzat |

## Nové akce, které na starém webu nebyly

| Akce | Nová URL | Zdroj |
|---|---|---|
| Medové čtení, Čtení v kostele, Čtení na Svobodě, Čtenářský přívoz, Křest knihy & Návrat reliéfu, Čtení v papučích, Kafe&kniha (2026) | `/akce/<nazev>-2026/` | stará stránka /program, data opravena |
| Čtu z Havla, Čtu s výhledem (Tišnov 2026) | `/akce/ctu-z-havla-2026/`, `/akce/ctu-s-vyhledem-2026/` | stará stránka /tisnov (datum 4. 9. neověřeno) |
| ČtuX, první čtuference (24. 1. 2026) | `/akce/ctux-2026/` | docs/ctu-ve-meste-kontext.md |
| Čteme ze Švejka (20. 6. 2026) | `/akce/cteme-ze-svejka-2026/` | docs/ctu-ve-meste-kontext.md (ověřit) |

## Co se záměrně nepřevzalo

- Osobní telefony a soukromé e-maily organizátorů ze stránky Kontakty.
- Odkazy na události na Facebooku („FB událost“).
- Text „V minulém ročníku se přidala tato města“ z manifestu je nahrazen archivem ročníku 2025.
- Výčet měst na stránce „Nadcházející akce“ (Ostrava, Mělník…) – nesouhlasí s ověřenými podklady, viz TODO.

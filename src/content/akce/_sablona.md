---
# Šablona nové akce. Zkopírujte jako src/content/akce/<nazev-akce-rok>.md
# (název souboru = adresa stránky: /akce/<nazev-akce-rok>/, bez diakritiky).
# Povinná pole: title, date, rocnik, typ, mesto, misto.nazev, proKoho.
title: Název akce
date: 2027-09-02            # RRRR-MM-DD
# dateEnd: 2027-09-05       # jen u vícedenních akcí
timeStart: "10:00"          # volitelné, vždy v uvozovkách
timeEnd: "13:00"            # volitelné
rocnik: 2027                # u celoročních akcí: null
typ: festival               # festival | celorocni | kafe-a-kniha
mesto: frydek-mistek        # název souboru v src/content/mesta/
format: cteni-na-svobode    # volitelné, název souboru v src/content/formaty/
misto:
  nazev: náměstí Svobody
  adresa: náměstí Svobody, Místek       # volitelné
  mapa: https://mapy.cz/…               # volitelné
proKoho: "Pro menší, větší, starší, zvědavé, romantiky i introverty."
# registrace:                # jen u akcí s omezenou kapacitou
#   url: https://forms.gle/…
#   kapacita: omezená
#   vyprodano: false
# poznamka: Čas se může měnit podle počasí.
# proDospele: true           # jen u akcí bez dětí (smí se zmínit pivní partner)
# cover: ../../assets/fotky/2027/2027-frydek-mistek-nazev-akce-01.webp
# coverAlt: Popis fotky pro nevidomé
# galerie:                   # max. 12 fotek
#   - src: ../../assets/fotky/2027/2027-frydek-mistek-nazev-akce-02.webp
#     alt: Popis fotky
---

Dva odstavce popisu akce. Vykejte v množném čísle („Přijďte“, „Vezměte si“).
Rubriku „Pro koho“ sem nepište, vypíše se sama z pole proKoho.

---
title: Zásady ochrany osobních údajů aplikace
description: Jak aplikace Čtu ve městě zachází s údaji uživatelů.
---

<!-- Převzato doslova ze starého webu (/app/…). -->

<p><strong>Poslední aktualizace:</strong> 27. září 2026</p>

<p>Tyto zásady ochrany osobních údajů vysvětlují, jak spolek <strong>Čtu ve městě, z.s.</strong> ("my", "nás" nebo "naše") shromažďuje, používá a chrání informace při vašem používání mobilní aplikace Čtu ve městě ("Aplikace").</p>

<h2>1. Jaké údaje shromažďujeme</h2>
<p>Aplikace nevyžaduje registraci uživatele, nezadáváte žádné jméno, e-mail ani telefonní číslo. Pro zajištění technické funkčnosti však shromažďujeme následující data:</p>
<ul>
<li><strong>Identifikátor zařízení (Device ID):</strong> Unikátní a anonymní řetězec znaků vygenerovaný vaším zařízením.</li>
<li><strong>Data o aktivitě v Aplikaci:</strong> Informace o tom, jaké knihy si ukládáte do své poličky (včetně data a času přidání – AddedAt) a vaše interakce v knižní seznamce.</li>
<li><strong>FCM Token:</strong> Technický identifikátor sloužící pro doručování push notifikací.</li>
<li><strong>Nahlášené chybějící knihy:</strong> Pokud v Aplikaci nahlásíte knihu, kterou v naší databázi postrádáte, ukládáme text vašeho dotazu, Identifikátor zařízení, stav vyřízení hlášení a přesný časový údaj o jeho vytvoření.</li>
<li><strong>Data o čtenářské sérii ("streak"):</strong> Pro účely herního prvku aplikace ukládáme délku vaší aktuální čtenářské série, počet dostupných "ochranných kapek" (streak freeze) a datum posledního zaznamenaného čtenářského dne.</li>
<li><strong>IP adresa:</strong> Za účelem ochrany našich serverů před přetížením a útoky (tzv. rate limiting a DoS ochrana) dočasně zpracováváme IP adresu, ze které je požadavek na server odeslán. Tato data jsou uchovávána pouze v operační paměti serveru a neukládáme je do databáze.</li>
<li><strong>Vyhledávací dotazy:</strong> Text zadaný do vyhledávacího pole se může dočasně objevit v provozních (technických) záznamech serveru, do naší databáze se však trvale neukládá.</li>
</ul>

<h2>2. Jak údaje používáme</h2>
<p>Shromážděná data využíváme výhradně k běhu a technickému zajištění služeb Aplikace, konkrétně pro:</p>
<ul>
<li>Uchování vašich uložených knih a synchronizaci vaší virtuální poličky.</li>
<li>Zajištění funkčnosti knižní seznamky (aby se vám nezobrazovaly knihy, které jste již viděli).</li>
<li>Zasílání důležitých upozornění a informací o festivalu (push notifikace).</li>
<li>Vytváření anonymizovaných a agregovaných statistik (např. "nejukládanější kniha festivalu") pro naše sociální sítě. Z těchto statistik nelze identifikovat konkrétního uživatele.</li>
</ul>

<h2>3. Právní základ zpracování</h2>
<p>Zpracování vašich dat probíhá na základě těchto právních titulů dle Obecného nařízení o ochraně osobních údajů (GDPR):</p>
<ul>
<li><strong>Plnění smlouvy / nezbytnost pro poskytnutí služby (čl. 6 odst. 1 písm. b) GDPR):</strong> Zpracování Identifikátoru zařízení, FCM tokenu, uložených knih, seznamky, nahlášených knih a dat o čtenářské sérii je nezbytné pro poskytnutí funkcí Aplikace, které se rozhodnete využívat.</li>
<li><strong>Oprávněný zájem (čl. 6 odst. 1 písm. f) GDPR):</strong> Dočasné zpracování IP adresy slouží k ochraně naší infrastruktury proti zneužití, přetížení a útokům. Náš oprávněný zájem spočívá v zajištění bezpečnosti a stability provozu Aplikace pro všechny uživatele.</li>
<li><strong>Souhlas (čl. 6 odst. 1 písm. a) GDPR):</strong> Zpracování polohových údajů na vašem zařízení pro zobrazení mapy a sběr chybových hlášení probíhá výhradně na základě vašeho explicitního souhlasu, který můžete kdykoliv odvolat.</li>
</ul>

<h2>4. Služby třetích stran</h2>
<p>Aplikace využívá pro svůj běh následující služby třetích stran, které mohou zpracovávat data podle svých vlastních podmínek:</p>
<ul>
<li><strong>Google Maps SDK:</strong> Aplikace integruje mapový podklad od společnosti Google. Vaše přesná GPS poloha je zpracovávána pouze lokálně na vašem zařízení a naše servery ji nesbírají ani neukládají. Samotný SDK modul Google Maps ovšem při své činnosti komunikuje přímo se servery společnosti Google, čímž může dojít k expozici vaší IP adresy a základních diagnostických/telemetrických dat vašeho zařízení přímo společnosti Google, nezávisle na naší aplikaci. Toto zpracování se řídí <a href="https://policies.google.com/privacy" rel="noopener">Zásadami ochrany soukromí společnosti Google</a>.</li>
<li><strong>Firebase Cloud Messaging (FCM):</strong> Služba od společnosti Google pro doručování push notifikací. Zpracování dat se řídí <a href="https://policies.google.com/privacy" rel="noopener">Zásadami ochrany soukromí společnosti Google</a>.</li>
<li><strong>Zdroje knižních obálek a metadat (Google Books, OpenLibrary):</strong> Pro zobrazení obálek a doplňujících informací o knihách využívá Aplikace veřejná rozhraní třetích stran. Veškeré požadavky jsou směrovány přes náš backendový server jako proxy, takže vaše IP adresa ani jiný identifikátor zařízení není těmto službám nikdy přímo zpřístupněn.</li>
<li><strong>Sentry (Chybová hlášení a monitoring výkonu):</strong> Pro zajištění stability, analýzu výkonu a vylepšování chodu Aplikace využíváme službu Sentry (sentry.io). V případě, že dojde k neočekávanému pádu aplikace nebo k problémům s komunikací se serverem, jsou odesílána automatická diagnostická data (model zařízení, verze operačního systému, doba trvání požadavků a výpis z paměti označující místo chyby). Abychom byli schopni efektivně trasovat a řešit technické potíže konkrétních uživatelů, jsou tato diagnostická data propojena s vaším anonymním Identifikátorem zařízení (Device ID). Záznamy nadále neobsahují vaše jméno, e-mail ani IP adresu a jsou zpracovávány na serverech v Evropské unii (Německo). Bližší informace o zpracování dat naleznete v <a href="https://sentry.io/privacy/" rel="noopener">Zásadách ochrany osobních údajů společnosti Sentry</a>.</li>
</ul>
<p>Vaše data z naší databáze <strong>nikdy neprodáváme</strong>, neposkytujeme k marketingovým účelům třetím stranám a nevyužíváme je k cílení reklamy.</p> 

<h2>5. Ochrana a uchovávání dat</h2>
<p>Data jsou bezpečně uložena na privátním serveru umístěném fyzicky na území České republiky a komunikace mezi Aplikací a serverem je šifrována. K databázi má přístup pouze technický správce Aplikace. Údaje uchováváme po celou dobu existence vašeho anonymního profilu v naší databázi, dokud nám nezašlete žádost o jeho výmaz.</p>
<p>IP adresy zpracováváme pouze dočasně v operační paměti serveru pro účely rate limitingu a neukládáme je do perzistentní databáze. Provozní logy, ve kterých se mohou dočasně objevit vyhledávací dotazy, jsou průběžně a nevratně mazány pomocí automatické rotace při dosažení minimální vyhrazené kapacity na disku.</p>

<h2>6. Výmaz dat a práva uživatelů</h2>
<p>Jelikož data sbíráme pouze na základě anonymního identifikátoru zařízení (Device ID) a nedisponujeme vašimi osobními identifikačními údaji (jako je jméno či e-mail), nemůžeme data v naší databázi přímo spojit s konkrétní fyzickou osobou, dokud nám svůj identifikátor neposkytnete.</p>
<p><strong>Jak požádat o smazání dat ze serveru:</strong><br></p>
<p>Svá data můžete kdykoliv trvale smazat přímo v Aplikaci. Přejděte do sekce Nastavení a klikněte na tlačítko <b>"Smazat má data ze serveru"</b>. Tím dojde k okamžitému a nevratnému výmazu vaší virtuální poličky a historie knižní seznamky z naší databáze.
<i>Alternativně můžete v sekci Nastavení zkopírovat svůj "Device JWT Token" a zaslat nám jej spolu s žádostí o výmaz na e-mail tobias.otta@ctuvemeste.cz. Bez poskytnutí tohoto tokenu nelze vaši žádost zpracovat, jelikož nedisponujeme žádnými jinými identifikačními údaji.</i></p>
<p>Kromě práva na výmaz máte také právo na přístup ke svým datům, jejich opravu a omezení zpracování, a to za předpokladu, že nám poskytnete svůj Identifikátor zařízení nebo Device JWT Token – bez něj nejsme schopni váš požadavek přiřadit ke konkrétnímu záznamu v databázi.</p>
<p>Pokud se domníváte, že zpracování vašich osobních údajů odporuje právním předpisům na ochranu osobních údajů, máte právo podat stížnost u dozorového úřadu, kterým je pro Českou republiku <strong>Úřad pro ochranu osobních údajů (ÚOOÚ)</strong>, se sídlem Pplk. Sochora 27, 170 00 Praha 7, <a href="https://www.uoou.cz" rel="noopener">www.uoou.cz</a>.</p>
<h2>7. Ochrana soukromí dětí</h2>
<p>Aplikace není záměrně cílena ani určena pro děti mladší 13 let. Nevytváříme uživatelské účty pro děti a vědomě neshromažďujeme anonymní identifikátory ani data o aktivitě od osob mladších 13 let. Pokud zjistíme, že jsme v databázi omylem uložili data patřící dítěti mladšímu 13 let, tato data bezodkladně a trvale odstraníme.</p>

<h2>8. Kontakt</h2>
<p>Pokud máte jakékoliv dotazy ohledně těchto Zásad ochrany osobních údajů, kontaktujte nás:</p>
<p><strong>Název:</strong> Čtu ve městě, z.s.<br>
<strong>Adresa:</strong> Hlavní třída 107, Místek, 738 01 Frýdek-Místek<br>
<strong>E-mail:</strong> <a href="mailto:tobias.otta@ctuvemeste.cz">tobias.otta@ctuvemeste.cz</a></p>

/**
 * Čtu ve městě – endpoint webu pro kontaktní formulář a přihlášku města.
 *
 * Patří do STEJNÉHO projektu Apps Scriptu jako newsletter (repo ctu-ve-meste/newsletter),
 * tedy do skriptu navázaného na tabulku. Přihlášení k newsletteru web neřeší tady:
 * formulář na webu posílá běžný POST na `?a=signup` a vyřídí ho `handleSignup_` z Code.gs.
 *
 * Funkce se jmenuje DoWebPost, protože doPost je jen jeden (v Code.gs) a volá DoWebPost
 * pro všechno, co není přihlášení k newsletteru. Viz apps-script/README.md.
 *
 * Script property navíc: NOTIFY_EMAIL (kam chodí upozornění z formulářů).
 *
 * Kam se co ukládá (přehled je i v apps-script/README.md):
 *   newsletter        → tabulka newsletteru, list „Odběratelé“ (řeší Code.gs, ne tento soubor)
 *   kontaktní formulář → tabulka FORMS_SHEET_ID, list „Kontakt“
 *   přihláška města    → tabulka FORMS_SHEET_ID, list „Města“
 * Každý další formulář z webu patří taky do FORMS_SHEET_ID, na vlastní list (přidejte ho do LISTY níže).
 * Do tabulky newsletteru tento soubor nikdy nezapisuje.
 */

/** Jediné místo s ID tabulek. */
var TABULKY = {
  /** Tabulka newsletteru. Tady se jen hlídá, aby do ní formuláře nezapsaly; zapisuje do ní Code.gs. */
  NEWSLETTER: '1Wb2d2mZtleRf6Qc1jjpEneUOWcr5lRWstKT8IssuE2g',
  /** Tabulka pro všechny ostatní formuláře z webu (každý formulář má vlastní list). */
  FORMULARE: '1vudmmDNjazSU6E_prh0TXbz2IYaP-lDICNo3FjFnKDQ',
};

/** Listy v tabulce formulářů: název a hlavička sloupců (list se založí při prvním zápisu). */
var LISTY = {
  kontakt: { nazev: 'Kontakt', hlavicka: ['datum', 'jméno', 'email', 'téma', 'zpráva', 'souhlas'] },
  mesto: {
    nazev: 'Města',
    hlavicka: ['datum', 'jméno', 'město', 'email', 'telefon', 'odkud o nás víte', 'poznámka', 'souhlas'],
  },
};

var MIN_CAS_MS = 3000; // formulář vyplněný rychleji než za 3 s považujeme za robota
var CHYBA_ULOZENI = 'Zprávu se teď nepodařilo uložit. Napište nám prosím e-mailem.';

function DoWebPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (data.akce) {
      case 'kontakt': return json_(kontakt_(data));
      case 'mesto': return json_(mesto_(data));
      default: return json_({ ok: false, zprava: 'Neznámá akce.' });
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, zprava: 'Něco se nepovedlo. Zkuste to prosím později.' });
  }
}

/* ---------- kontaktní formulář ---------- */

function kontakt_(d) {
  if (jeRobot_(d)) return { ok: true };
  var email = String(d.email || '').trim();
  var zprava = String(d.zprava || '').trim().slice(0, 5000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || zprava.length < 3) return { ok: false, zprava: 'Vyplňte prosím e-mail a zprávu.' };
  if (!omezeni_('kontakt:' + email, 3)) return { ok: false, zprava: 'Zkuste to prosím za chvíli.' };
  var jmeno = String(d.jmeno || '').trim().slice(0, 200);
  var tema = String(d.tema || '').trim().slice(0, 100);
  if (!zapis_(LISTY.kontakt, [new Date(), jmeno, email, tema, zprava, String(d.souhlas || '')])) return { ok: false, zprava: CHYBA_ULOZENI };
  MailApp.sendEmail({
    to: prop_('NOTIFY_EMAIL'),
    replyTo: email,
    subject: 'Web: ' + (tema ? tema.toLowerCase() + ' od ' : 'nová zpráva od ') + (jmeno || email),
    body: zprava + '\n\n— ' + (jmeno ? jmeno + ', ' : '') + email,
    name: 'Web Čtu ve městě',
  });
  return { ok: true };
}

/* ---------- přihláška města ---------- */

function mesto_(d) {
  if (jeRobot_(d)) return { ok: true };
  var email = String(d.email || '').trim();
  var jmeno = String(d.jmeno || '').trim().slice(0, 200);
  var mesto = String(d.mesto || '').trim().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || jmeno.length < 2 || mesto.length < 2) {
    return { ok: false, zprava: 'Vyplňte prosím jméno, město a e-mail.' };
  }
  if (!d.souhlas) return { ok: false, zprava: 'Chybí souhlas.' };
  if (!omezeni_('mesto:' + email, 3)) return { ok: false, zprava: 'Zkuste to prosím za chvíli.' };
  var telefon = String(d.telefon || '').trim().slice(0, 50);
  var odkud = String(d.odkud || '').trim().slice(0, 300);
  var poznamka = String(d.poznamka || '').trim().slice(0, 3000);
  if (!zapis_(LISTY.mesto, [new Date(), jmeno, mesto, email, telefon, odkud, poznamka, String(d.souhlas)])) {
    return { ok: false, zprava: CHYBA_ULOZENI };
  }
  MailApp.sendEmail({
    to: prop_('NOTIFY_EMAIL'),
    replyTo: email,
    subject: 'Web: přihláška města ' + mesto,
    body: 'Město: ' + mesto + '\nJméno: ' + jmeno + '\nE-mail: ' + email + (telefon ? '\nTelefon: ' + telefon : '') +
      (odkud ? '\nOdkud o nás ví: ' + odkud : '') + (poznamka ? '\n\n' + poznamka : ''),
    name: 'Web Čtu ve městě',
  });
  return { ok: true };
}

/* ---------- pomocné funkce ---------- */

/**
 * Robot = vyplněné skryté pole `web` nebo odeslání dřív než za MIN_CAS_MS po načtení formuláře.
 * Chybějící nebo nečíselný čas (`cas`) se bere jako robot. Volající pak vrátí { ok: true },
 * takže z odpovědi robot nepozná, proč nic neproběhlo.
 */
function jeRobot_(d) {
  var cas = Number(d.cas);
  return String(d.web || '').trim() !== '' || !(cas >= MIN_CAS_MS);
}

/** Jednoduchý limit: max. `kolik` požadavků za 10 minut na klíč. */
function omezeni_(klic, kolik) {
  var cache = CacheService.getScriptCache();
  var n = Number(cache.get(klic) || 0);
  if (n >= kolik) return false;
  cache.put(klic, String(n + 1), 600);
  return true;
}

/**
 * Připojí řádek na list v tabulce formulářů (list s hlavičkou založí, když chybí).
 * Vrací true při úspěchu. Když se zápis nepovede (např. účet skriptu nemá k tabulce právo úprav),
 * zaloguje chybu a vrátí false; data se NIKAM jinam neukládají.
 */
function zapis_(list, radek) {
  var lock = LockService.getScriptLock();
  try {
    if (TABULKY.FORMULARE === TABULKY.NEWSLETTER) throw new Error('FORMULARE nesmí být tabulka newsletteru.');
    lock.waitLock(20000);
    var ss = SpreadsheetApp.openById(TABULKY.FORMULARE);
    var sh = ss.getSheetByName(list.nazev);
    if (!sh) {
      sh = ss.insertSheet(list.nazev);
      sh.appendRow(list.hlavicka);
    }
    sh.appendRow(radek);
    return true;
  } catch (err) {
    console.error('Zápis do tabulky formulářů (' + list.nazev + ') selhal: ' + err);
    return false;
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

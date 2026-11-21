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
 * Script properties navíc: NOTIFY_EMAIL (kam chodí upozornění z formulářů) a volitelně
 * FORMS_SHEET_ID (ID samostatné tabulky pro listy Kontakt a Města; bez ní se použije tabulka newsletteru).
 *
 * Listy (vytvoří se samy, pokud chybí):
 *   Kontakt:    datum | jméno | email | téma | zpráva | souhlas
 *   Města:      datum | jméno | město | email | telefon | odkud o nás víte | poznámka | souhlas
 */

var LIST_KONTAKT = 'Kontakt';
var LIST_MESTA = 'Města';
var MIN_CAS_MS = 3000; // formulář vyplněný rychleji než za 3 s považujeme za robota

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
  list_(LIST_KONTAKT, ['datum', 'jméno', 'email', 'téma', 'zpráva', 'souhlas']).appendRow([new Date(), jmeno, email, tema, zprava, String(d.souhlas || '')]);
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
  list_(LIST_MESTA, ['datum', 'jméno', 'město', 'email', 'telefon', 'odkud o nás víte', 'poznámka', 'souhlas'])
    .appendRow([new Date(), jmeno, mesto, email, telefon, odkud, poznamka, String(d.souhlas)]);
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

function jeRobot_(d) {
  return Boolean(d.web) || Number(d.cas || 0) < MIN_CAS_MS;
}

/** Jednoduchý limit: max. `kolik` požadavků za 10 minut na klíč. */
function omezeni_(klic, kolik) {
  var cache = CacheService.getScriptCache();
  var n = Number(cache.get(klic) || 0);
  if (n >= kolik) return false;
  cache.put(klic, String(n + 1), 600);
  return true;
}

function list_(nazev, hlavicka) {
  // volitelně samostatná tabulka pro kontakty a města: Script property FORMS_SHEET_ID
  var id = PropertiesService.getScriptProperties().getProperty('FORMS_SHEET_ID');
  var ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  var list = ss.getSheetByName(nazev);
  if (!list) {
    list = ss.insertSheet(nazev);
    if (hlavicka) list.appendRow(hlavicka);
  }
  return list;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Čtu ve městě – endpoint pro web (newsletter + kontaktní formulář + přihláška města).
 *
 * Patří do STEJNÉHO projektu Apps Scriptu jako newsletter (repo ctu-ve-meste/newsletter,
 * soubory Code.gs a Admin.html), tedy do skriptu navázaného na tabulku odběratelů.
 * Newsletter zatím žádnou funkci doPost nemá, takže tady je jediná. Přihlášení z webu
 * ukládá do listu „Odběratelé“ ve stejném tvaru jako newsletter a pro potvrzení
 * a odhlášení používá jeho funkci setStatus_ (z Code.gs).
 *
 * Nastavení (Project Settings → Script properties), kromě těch z newsletteru:
 *   SITE_URL      adresa webu bez lomítka na konci, např. https://www.ctuvemeste.cz
 *   NOTIFY_EMAIL  kam posílat upozornění z formulářů (tobias.otta@ctuvemeste.cz)
 *
 * Listy (Kontakt a Města se vytvoří samy, pokud chybí):
 *   Odběratelé: e-mail | jméno | stav | token | žádost odeslána | potvrzeno | odhlášeno | poslední zaslané číslo
 *   Kontakt:    datum | jméno | email | téma | zpráva | souhlas
 *   Města:      datum | jméno | město | email | telefon | odkud o nás víte | poznámka | souhlas
 */

var LIST_KONTAKT = 'Kontakt';
var LIST_MESTA = 'Města';
var MIN_CAS_MS = 3000; // formulář vyplněný rychleji než za 3 s považujeme za robota

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (data.akce) {
      case 'prihlaseni': return json_(prihlaseni_(data));
      case 'potvrzeni': return json_(potvrzeni_(data));
      case 'odhlaseni': return json_(odhlaseni_(data));
      case 'kontakt': return json_(kontakt_(data));
      case 'mesto': return json_(mesto_(data));
      default: return json_({ ok: false, zprava: 'Neznámá akce.' });
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, zprava: 'Něco se nepovedlo. Zkuste to prosím později.' });
  }
}

/* ---------- newsletter (tabulka a stavy z Code.gs) ---------- */

function prihlaseni_(d) {
  if (jeRobot_(d)) return { ok: true }; // robotovi tváříme úspěch, nic neukládáme
  var email = String(d.email || '').trim().toLowerCase();
  if (!validEmail_(email)) return { ok: false, zprava: 'Neplatný e-mail.' };
  if (!d.souhlas) return { ok: false, zprava: 'Chybí souhlas.' };
  if (!omezeni_('prihlaseni:' + email, 5)) return { ok: false, zprava: 'Zkuste to prosím za chvíli.' };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var token;
  try {
    var sh = sheet_();
    var radek = najdi_(sh, email);
    var ted = new Date();
    if (radek) {
      var stav = sh.getRange(radek, COL.STAV).getValue();
      if (stav === ST.ODEBIRA) return { ok: true };
      // čeká nebo odhlášen: nový token, znovu pošleme potvrzení
      token = Utilities.getUuid();
      sh.getRange(radek, COL.STAV, 1, 3).setValues([[ST.CEKA, token, ted]]);
      sh.getRange(radek, COL.POTVRZENO, 1, 2).setValues([['', '']]);
    } else {
      token = Utilities.getUuid();
      sh.appendRow([email, '', ST.CEKA, token, ted, '', '', '']);
    }
  } finally {
    lock.releaseLock();
  }
  var odkaz = prop_('SITE_URL') + '/newsletter/potvrzeni/?t=' + encodeURIComponent(token);
  MailApp.sendEmail({
    to: email,
    subject: 'Potvrďte prosím odběr newsletteru Čtu ve městě',
    htmlBody:
      '<p>Dobrý den,</p><p>děkujeme za zájem o novinky festivalu Čtu ve městě. ' +
      'Odběr prosím potvrďte kliknutím na odkaz:</p>' +
      '<p><a href="' + odkaz + '">Potvrdit odběr</a></p>' +
      '<p>Pokud jste se nepřihlašovali, e-mail prosím ignorujte. Adresu do ' + PENDING_DAYS + ' dnů smažeme.</p>' +
      '<p>' + ORG.name + '</p>',
    name: ORG.name,
    replyTo: ORG.mail,
  });
  return { ok: true };
}

function potvrzeni_(d) {
  var r = setStatus_(String(d.t || ''), 'confirm');
  if (r === true) return { ok: true };
  if (r === 'odhlasen') return { ok: false, zprava: 'Tuto adresu jste dříve odhlásili. Napište nám prosím e-mail.' };
  return { ok: false, zprava: 'Odkaz neplatí.' };
}

function odhlaseni_(d) {
  return setStatus_(String(d.t || ''), 'unsub') === true ? { ok: true } : { ok: false, zprava: 'Odkaz neplatí.' };
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var list = ss.getSheetByName(nazev);
  if (!list) {
    list = ss.insertSheet(nazev);
    if (hlavicka) list.appendRow(hlavicka);
  }
  return list;
}

/** Řádek odběratele podle e-mailu (sloupec A), nebo 0. */
function najdi_(list, email) {
  var posledni = list.getLastRow();
  if (posledni < 2) return 0;
  var hodnoty = list.getRange(2, COL.EMAIL, posledni - 1, 1).getValues();
  for (var i = 0; i < hodnoty.length; i++) {
    if (String(hodnoty[i][0]).trim().toLowerCase() === email) return i + 2;
  }
  return 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

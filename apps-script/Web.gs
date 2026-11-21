/**
 * Čtu ve městě – endpoint pro web (newsletter + kontaktní formulář).
 *
 * Přidejte tento soubor do existujícího projektu Apps Scriptu s rozesílkou
 * newsletteru (vedle Code.gs a Admin.html). Pokud už Code.gs obsahuje funkci
 * doPost, je potřeba je sloučit – viz apps-script/README.md.
 *
 * Nastavení (Project Settings → Script properties):
 *   SHEET_ID      ID Google tabulky odběratelů (z URL tabulky)
 *   SITE_URL      adresa webu bez lomítka na konci, např. https://www.ctuvemeste.cz
 *   NOTIFY_EMAIL  kam posílat upozornění z kontaktního formuláře (tobias.otta@ctuvemeste.cz)
 *   SECRET        dlouhý náhodný text pro podepisování odkazů (vygenerujte funkcí vygenerujSecret)
 *
 * Listy v tabulce (vytvoří se samy, pokud chybí):
 *   Odběratelé: email | stav | datum přihlášení | datum potvrzení | datum odhlášení | zdroj | souhlas
 *   Kontakt:    datum | jméno | email | zpráva | souhlas
 */

var LIST_ODBERATELE = 'Odběratelé';
var LIST_KONTAKT = 'Kontakt';
var MIN_CAS_MS = 3000; // formulář vyplněný rychleji než za 3 s považujeme za robota

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (data.akce) {
      case 'prihlaseni': return json_(prihlaseni_(data));
      case 'potvrzeni': return json_(potvrzeni_(data));
      case 'odhlaseni': return json_(odhlaseni_(data));
      case 'kontakt': return json_(kontakt_(data));
      default: return json_({ ok: false, zprava: 'Neznámá akce.' });
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, zprava: 'Něco se nepovedlo. Zkuste to prosím později.' });
  }
}

/* ---------- newsletter ---------- */

function prihlaseni_(d) {
  if (jeRobot_(d)) return { ok: true }; // robotovi tváříme úspěch, nic neukládáme
  var email = String(d.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, zprava: 'Neplatný e-mail.' };
  if (!d.souhlas) return { ok: false, zprava: 'Chybí souhlas.' };
  if (!omezeni_('prihlaseni:' + email, 5)) return { ok: false, zprava: 'Zkuste to prosím za chvíli.' };

  var list = list_(LIST_ODBERATELE, ['email', 'stav', 'datum přihlášení', 'datum potvrzení', 'datum odhlášení', 'zdroj', 'souhlas']);
  var radek = najdi_(list, email);
  var ted = new Date();
  if (radek && list.getRange(radek, 2).getValue() === 'potvrzeno') return { ok: true };
  if (radek) {
    list.getRange(radek, 2, 1, 6).setValues([['čeká na potvrzení', ted, '', '', d.zdroj || 'web', String(d.souhlas)]]);
  } else {
    list.appendRow([email, 'čeká na potvrzení', ted, '', '', d.zdroj || 'web', String(d.souhlas)]);
  }
  var odkaz = prop_('SITE_URL') + '/newsletter/potvrzeni/?e=' + kodujEmail_(email) + '&t=' + token_('potvrzeni', email);
  MailApp.sendEmail({
    to: email,
    subject: 'Potvrďte prosím odběr newsletteru Čtu ve městě',
    htmlBody:
      '<p>Dobrý den,</p><p>děkujeme za zájem o novinky festivalu Čtu ve městě. ' +
      'Odběr prosím potvrďte kliknutím na odkaz:</p>' +
      '<p><a href="' + odkaz + '">Potvrdit odběr</a></p>' +
      '<p>Pokud jste se nepřihlašovali, e-mail prosím ignorujte.</p><p>Čtu ve městě, z.s.</p>',
    name: 'Čtu ve městě',
  });
  return { ok: true };
}

function potvrzeni_(d) {
  var email = dekodujEmail_(d.e);
  if (!email || d.t !== token_('potvrzeni', email)) return { ok: false, zprava: 'Odkaz neplatí.' };
  var list = list_(LIST_ODBERATELE);
  var radek = najdi_(list, email);
  if (!radek) return { ok: false, zprava: 'E-mail jsme nenašli.' };
  list.getRange(radek, 2).setValue('potvrzeno');
  list.getRange(radek, 4).setValue(new Date());
  return { ok: true };
}

function odhlaseni_(d) {
  var email = dekodujEmail_(d.e);
  if (!email || d.t !== token_('odhlaseni', email)) return { ok: false, zprava: 'Odkaz neplatí.' };
  var list = list_(LIST_ODBERATELE);
  var radek = najdi_(list, email);
  if (radek) {
    list.getRange(radek, 2).setValue('odhlášeno');
    list.getRange(radek, 5).setValue(new Date());
  }
  return { ok: true };
}

/**
 * Odkaz pro odhlášení. Volejte z rozesílky (Code.gs) a vložte do patičky každého newsletteru.
 */
function odhlasovaciOdkaz(email) {
  email = String(email).trim().toLowerCase();
  return prop_('SITE_URL') + '/newsletter/odhlaseni/?e=' + kodujEmail_(email) + '&t=' + token_('odhlaseni', email);
}

/* ---------- kontaktní formulář ---------- */

function kontakt_(d) {
  if (jeRobot_(d)) return { ok: true };
  var email = String(d.email || '').trim();
  var zprava = String(d.zprava || '').trim().slice(0, 5000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || zprava.length < 3) return { ok: false, zprava: 'Vyplňte prosím e-mail a zprávu.' };
  if (!omezeni_('kontakt:' + email, 3)) return { ok: false, zprava: 'Zkuste to prosím za chvíli.' };
  var jmeno = String(d.jmeno || '').trim().slice(0, 200);
  list_(LIST_KONTAKT, ['datum', 'jméno', 'email', 'zpráva', 'souhlas']).appendRow([new Date(), jmeno, email, zprava, String(d.souhlas || '')]);
  MailApp.sendEmail({
    to: prop_('NOTIFY_EMAIL'),
    replyTo: email,
    subject: 'Web: nová zpráva od ' + (jmeno || email),
    body: zprava + '\n\n— ' + (jmeno ? jmeno + ', ' : '') + email,
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

function token_(ucel, email) {
  var sig = Utilities.computeHmacSha256Signature(ucel + ':' + email, prop_('SECRET'));
  return Utilities.base64EncodeWebSafe(sig).replace(/=+$/, '').slice(0, 32);
}

function kodujEmail_(email) {
  return Utilities.base64EncodeWebSafe(email, Utilities.Charset.UTF_8).replace(/=+$/, '');
}

function dekodujEmail_(s) {
  try {
    s = String(s || '');
    while (s.length % 4) s += '=';
    return Utilities.newBlob(Utilities.base64DecodeWebSafe(s)).getDataAsString('UTF-8').toLowerCase();
  } catch (err) {
    return '';
  }
}

function list_(nazev, hlavicka) {
  var ss = SpreadsheetApp.openById(prop_('SHEET_ID'));
  var list = ss.getSheetByName(nazev);
  if (!list) {
    list = ss.insertSheet(nazev);
    if (hlavicka) list.appendRow(hlavicka);
  }
  return list;
}

function najdi_(list, email) {
  var posledni = list.getLastRow();
  if (posledni < 2) return 0;
  var hodnoty = list.getRange(2, 1, posledni - 1, 1).getValues();
  for (var i = 0; i < hodnoty.length; i++) {
    if (String(hodnoty[i][0]).trim().toLowerCase() === email) return i + 2;
  }
  return 0;
}

function prop_(klic) {
  var v = PropertiesService.getScriptProperties().getProperty(klic);
  if (!v) throw new Error('Chybí Script property ' + klic);
  return v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Spusťte jednou ručně a výsledek vložte do Script property SECRET. */
function vygenerujSecret() {
  var s = Utilities.getUuid() + Utilities.getUuid();
  Logger.log(s);
  return s;
}

/**
 * Společný vstupní bod web appu. Apps Script smí mít jen jednu funkci doPost,
 * proto tady rozdělujeme požadavky:
 *  - JSON s polem `akce` (formuláře z webu)  → DoWebPost (Web.gs)
 *  - cokoli jiného (původní rozesílka)       → doNewsletterPost (Code.gs)
 *
 * Funkce doPost se nesmí nacházet v žádném jiném souboru projektu.
 */
function doPost(e) {
  var obsah = (e && e.postData && e.postData.contents) || '';
  var zWebu = false;
  try { zWebu = !!JSON.parse(obsah).akce; } catch (err) { zWebu = false; }
  return zWebu ? DoWebPost(e) : doNewsletterPost(e);
}

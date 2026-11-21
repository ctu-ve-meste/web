/**
 * Pomocné funkce pro chyby ve formulářích: hláška se ukáže přímo pod políčkem,
 * které je potřeba opravit (ne jen pod tlačítkem, kam by člověk musel doscrollovat).
 */
export function vycistiChyby(form: HTMLFormElement): void {
  form.querySelectorAll('[aria-invalid]').forEach((el) => {
    el.removeAttribute('aria-invalid');
    el.removeAttribute('aria-describedby');
  });
  form.querySelectorAll('.field__chyba').forEach((el) => el.remove());
}

/** Označí chybná políčka, vypíše hlášky pod ně a přesune focus na první z nich. */
export function ukazChyby(form: HTMLFormElement, chyby: [id: string, zprava: string][]): void {
  chyby.forEach(([id, zprava]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const p = document.createElement('p');
    p.className = 'field__chyba';
    p.id = `${id}-chyba`;
    p.textContent = zprava;
    const misto = el.closest('.field, .check') ?? el;
    misto.insertAdjacentElement('afterend', p);
    el.setAttribute('aria-invalid', 'true');
    el.setAttribute('aria-describedby', p.id);
  });
  document.getElementById(chyby[0][0])?.focus();
}

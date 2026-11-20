/**
 * Odeslání dat do Google Apps Script web appu (newsletter, kontakt).
 * Posíláme JSON jako text/plain, aby prohlížeč nedělal CORS preflight
 * (Apps Script ho neumí). Odpověď je JSON { ok: boolean, zprava?: string }.
 */
export interface Odpoved {
  ok: boolean;
  zprava?: string;
}

export async function odeslat(urlAppu: string, data: Record<string, unknown>): Promise<Odpoved> {
  const res = await fetch(urlAppu, {
    method: 'POST',
    body: JSON.stringify(data),
    redirect: 'follow',
  });
  if (!res.ok) return { ok: false, zprava: `Chyba ${res.status}` };
  try {
    return (await res.json()) as Odpoved;
  } catch {
    return { ok: false, zprava: 'Neočekávaná odpověď serveru.' };
  }
}

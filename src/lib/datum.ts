const dny = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];
const mesice = [
  'ledna', 'února', 'března', 'dubna', 'května', 'června',
  'července', 'srpna', 'září', 'října', 'listopadu', 'prosince',
];

/** 3. 9. 2026 */
export function datumKratce(d: Date): string {
  return `${d.getUTCDate()}. ${d.getUTCMonth() + 1}. ${d.getUTCFullYear()}`;
}

/** čtvrtek 3. září 2026 */
export function datumDlouze(d: Date, sRokem = true): string {
  const s = `${dny[d.getUTCDay()]} ${d.getUTCDate()}. ${mesice[d.getUTCMonth()]}`;
  return sRokem ? `${s} ${d.getUTCFullYear()}` : s;
}

/** 3.–6. 9. 2026, případně 30. 9. – 2. 10. 2026 */
export function rozsah(od: Date, doo?: Date): string {
  if (!doo || od.getTime() === doo.getTime()) return datumKratce(od);
  if (od.getUTCFullYear() === doo.getUTCFullYear() && od.getUTCMonth() === doo.getUTCMonth()) {
    return `${od.getUTCDate()}.–${datumKratce(doo)}`;
  }
  return `${datumKratce(od)} – ${datumKratce(doo)}`;
}

export function isoDatum(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** ISO datum a čas s posunem pro Europe/Prague (letní/zimní čas), např. 2026-09-03T15:00:00+02:00. */
export function isoPraha(d: Date, cas: string): string {
  const [h, m] = cas.split(':').map(Number);
  const utcGuess = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h, m);
  const tzName = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Prague', timeZoneName: 'shortOffset' })
    .formatToParts(new Date(utcGuess))
    .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+1';
  const off = Number(tzName.replace('GMT', '') || 0);
  return `${isoDatum(d)}T${cas}:00+${String(off).padStart(2, '0')}:00`;
}

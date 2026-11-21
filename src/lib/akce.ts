import { getCollection, type CollectionEntry } from 'astro:content';

export type Akce = CollectionEntry<'akce'>;

/** Všechny akce, nejnovější nahoře. */
export async function vsechnyAkce(): Promise<Akce[]> {
  const akce = await getCollection('akce');
  return akce.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || (b.data.timeStart ?? '').localeCompare(a.data.timeStart ?? ''));
}

/** Akce chronologicky (nejstarší první) – pro program po dnech. */
export function chronologicky(akce: Akce[]): Akce[] {
  return [...akce].sort((a, b) => a.data.date.getTime() - b.data.date.getTime() || (a.data.timeStart ?? '').localeCompare(b.data.timeStart ?? ''));
}

export function rokAkce(a: Akce): number {
  return a.data.date.getUTCFullYear();
}

/** Nadcházející akce (od dneška, podle data buildu). */
export function nadchazejici(akce: Akce[], od = new Date()): Akce[] {
  const dnes = Date.UTC(od.getFullYear(), od.getMonth(), od.getDate());
  return chronologicky(akce.filter((a) => (a.data.dateEnd ?? a.data.date).getTime() >= dnes));
}

export function casAkce(a: Akce): string {
  const { timeStart, timeEnd } = a.data;
  if (!timeStart) return '';
  return timeEnd ? `${timeStart}–${timeEnd}` : `od ${timeStart}`;
}

/** Akce už proběhla (podle data buildu; web se přestavuje každý den). */
export function jeMinula(a: Akce, ted = new Date()): boolean {
  const dnes = Date.UTC(ted.getFullYear(), ted.getMonth(), ted.getDate());
  return (a.data.dateEnd ?? a.data.date).getTime() < dnes;
}

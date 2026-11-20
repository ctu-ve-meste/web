import type { APIRoute } from 'astro';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { absUrl } from '../../lib/url';

export async function getStaticPaths() {
  const akce = await getCollection('akce');
  return akce.map((a) => ({ params: { slug: a.id }, props: { akce: a } }));
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const d8 = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
const fold = (line: string) => {
  // RFC 5545: řádky max. 75 oktetů
  const out: string[] = [];
  let cur = '';
  for (const ch of line) {
    if (Buffer.byteLength(cur + ch) > 74) {
      out.push(cur);
      cur = ' ' + ch;
    } else cur += ch;
  }
  out.push(cur);
  return out.join('\r\n');
};

export const GET: APIRoute = async ({ props, site }) => {
  const a = (props as { akce: CollectionEntry<'akce'> }).akce;
  const d = a.data;
  const mesto = await getEntry(d.mesto);
  const konec = d.dateEnd ?? d.date;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ctu ve meste//ctuvemeste.cz//CS',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${a.id}@ctuvemeste.cz`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')}`,
  ];
  if (d.timeStart) {
    lines.push(`DTSTART;TZID=Europe/Prague:${d8(d.date)}T${d.timeStart.replace(':', '')}00`);
    const end = d.timeEnd ?? `${String(Math.min(23, Number(d.timeStart.slice(0, 2)) + 2)).padStart(2, '0')}:${d.timeStart.slice(3)}`;
    lines.push(`DTEND;TZID=Europe/Prague:${d8(konec)}T${end.replace(':', '')}00`);
  } else {
    const next = new Date(konec.getTime() + 86400000);
    lines.push(`DTSTART;VALUE=DATE:${d8(d.date)}`, `DTEND;VALUE=DATE:${d8(next)}`);
  }
  lines.push(
    `SUMMARY:${esc(`${d.title} · Čtu ve městě`)}`,
    `LOCATION:${esc([d.misto.nazev, d.misto.adresa, mesto?.data.nazev].filter(Boolean).join(', '))}`,
    `DESCRIPTION:${esc(`Pro koho: ${d.proKoho}\n${absUrl(`/akce/${a.id}/`, site)}`)}`,
    `URL:${absUrl(`/akce/${a.id}/`, site)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  );
  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};

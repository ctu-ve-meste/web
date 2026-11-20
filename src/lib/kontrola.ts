/**
 * Kontrola odkazů mezi kolekcemi (akce → město/ročník/formát, ročník → města).
 * Astro na neexistující odkaz jen varuje, my chceme, aby build spadl.
 * Volá se jednou z BaseLayout.astro.
 */
import { getCollection, getEntry } from 'astro:content';

let hotovo: Promise<void> | undefined;

export function zkontrolujObsah(): Promise<void> {
  hotovo ??= (async () => {
    const chyby: string[] = [];
    const over = async (kde: string, ref: { collection: string; id: string } | undefined | null) => {
      if (!ref) return;
      // @ts-expect-error – obecná kontrola přes všechny kolekce
      const e = await getEntry(ref.collection, ref.id);
      if (!e) chyby.push(`${kde}: odkaz na neexistující "${ref.id}" v kolekci ${ref.collection}`);
    };
    for (const a of await getCollection('akce')) {
      await over(`akce/${a.id} (mesto)`, a.data.mesto);
      await over(`akce/${a.id} (rocnik)`, a.data.rocnik);
      await over(`akce/${a.id} (format)`, a.data.format);
      if (a.data.rocnik && a.data.date.getUTCFullYear() !== Number(a.data.rocnik.id)) {
        chyby.push(`akce/${a.id}: datum ${a.data.date.toISOString().slice(0, 10)} nesedí s ročníkem ${a.data.rocnik.id}`);
      }
    }
    for (const r of await getCollection('rocniky')) {
      if (String(r.data.rok) !== r.id) chyby.push(`rocniky/${r.id}.yaml: pole rok (${r.data.rok}) nesedí s názvem souboru`);
      for (const m of r.data.mesta) await over(`rocniky/${r.id} (mesta)`, m);
    }
    if (chyby.length) {
      throw new Error(`Chyby v obsahu (src/content/):\n- ${chyby.join('\n- ')}`);
    }
  })();
  return hotovo;
}

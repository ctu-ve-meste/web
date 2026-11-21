import { getCollection, getEntry } from 'astro:content';
import { config } from '../config';

export async function aktualniRocnik() {
  const r = await getEntry('rocniky', String(config.aktualniRocnik));
  if (!r) throw new Error(`Chybí src/content/rocniky/${config.aktualniRocnik}.yaml (config.aktualniRocnik).`);
  return r;
}

export async function vsechnyRocniky() {
  return (await getCollection('rocniky')).sort((a, b) => b.data.rok - a.data.rok);
}

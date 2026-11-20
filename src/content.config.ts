/**
 * Schémata obsahu. Když soubor v src/content/ neodpovídá schématu
 * (chybí povinné pole, překlep v odkazu na město, špatné datum…),
 * build spadne s chybovou hláškou. Je to pojistka pro úpravy obsahu.
 */
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const cas = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Čas zapisujte jako "HH:MM", např. "09:30".');
const hex = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Barvu zapisujte jako #RRGGBB.');
const odkaz = z.url();
/** Ročník se v YAML píše jako číslo (2026), reference potřebuje text. */
const rocnikRef = z.preprocess(
  (v) => (typeof v === 'number' ? String(v) : v),
  reference('rocniky'),
);

/* Soubory začínající podtržítkem (_sablona.md) se ignorují. */
const md = (base: string) => glob({ pattern: ['**/*.md', '!**/_*.md'], base });

const akce = defineCollection({
  loader: md('./src/content/akce'),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(2),
        slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
        date: z.coerce.date(),
        /** Poslední den u vícedenních akcí (např. Knihobudka 5.–8. 9.). */
        dateEnd: z.coerce.date().optional(),
        timeStart: cas.optional(),
        timeEnd: cas.optional(),
        rocnik: rocnikRef.nullable(),
        typ: z.enum(['festival', 'celorocni', 'kafe-a-kniha']),
        mesto: reference('mesta'),
        format: reference('formaty').optional(),
        misto: z.object({
          nazev: z.string(),
          adresa: z.string().optional(),
          mapa: odkaz.optional(),
        }),
        /** Rubrika „Pro koho“. Povinná u nadcházejících akcí (hlídá src/lib/kontrola.ts). */
        proKoho: z.string().min(3).optional(),
        registrace: z
          .object({
            url: odkaz.optional(),
            kapacita: z.string().optional(),
            vyprodano: z.boolean().default(false),
          })
          .optional(),
        poznamka: z.string().optional(),
        /** Akce pro dospělé (smí se u ní zmínit pivní partner). */
        proDospele: z.boolean().default(false),
        zruseno: z.boolean().default(false),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        galerie: z
          .array(z.object({ src: image(), alt: z.string() }))
          .max(12, 'Galerie akce má mít nejvýš 12 fotek.')
          .default([]),
      })
      .refine((a) => !a.dateEnd || a.dateEnd >= a.date, {
        message: 'dateEnd musí být stejné nebo pozdější než date.',
        path: ['dateEnd'],
      })
      .refine((a) => a.typ !== 'festival' || a.rocnik !== null, {
        message: 'Festivalová akce musí mít vyplněný rocnik.',
        path: ['rocnik'],
      })
      .refine((a) => !a.cover || !!a.coverAlt, {
        message: 'K cover fotce doplňte coverAlt (popis pro nevidomé).',
        path: ['coverAlt'],
      }),
});

const rocniky = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/rocniky' }),
  schema: ({ image }) =>
    z.object({
      cislo: z.number().int().positive(),
      rok: z.number().int().min(2024),
      od: z.coerce.date().optional(),
      do: z.coerce.date().optional(),
      barva: hex,
      nazevBarvy: z.string(),
      mesta: z.array(reference('mesta')).default([]),
      /** Města, která v daném roce byla, ale nemají vlastní soubor (jen zmínka v archivu). */
      dalsiMesta: z.array(z.string()).default([]),
      perex: z.string(),
      fotky: z.array(z.object({ src: image(), alt: z.string() })).max(20).default([]),
    }),
});

const mesta = defineCollection({
  loader: md('./src/content/mesta'),
  schema: z.object({
    nazev: z.string(),
    stat: z.string().default('Česko'),
    odRoku: z.number().int().min(2024),
    /** Jen aktivní města mají vlastní podstránku /mesta/<slug>/. */
    aktivni: z.boolean(),
    perex: z.string(),
    partner: z.object({ nazev: z.string(), url: odkaz.optional() }).optional(),
    tym: z.string().optional(),
    site: z
      .object({
        instagram: odkaz.optional(),
        facebook: odkaz.optional(),
        web: odkaz.optional(),
      })
      .default({}),
    kontakt: z.string().optional(),
  }),
});

const formaty = defineCollection({
  loader: md('./src/content/formaty'),
  schema: z.object({
    nazev: z.string(),
    perex: z.string(),
    poradi: z.number().default(100),
  }),
});

const dobrovolnici = defineCollection({
  loader: md('./src/content/dobrovolnici'),
  schema: ({ image }) =>
    z.object({
      jmeno: z.string(),
      popis: z.string(),
      citat: z.string().optional(),
      foto: image().optional(),
      poradi: z.number().default(100),
    }),
});

const partneri = defineCollection({
  loader: file('./src/content/partneri/partneri.yaml'),
  schema: ({ image }) =>
    z.object({
      nazev: z.string(),
      url: odkaz.optional(),
      popis: z.string().optional(),
      logo: image().optional(),
      poradi: z.number().default(100),
      /** Pivní/alkoholové značky: neukazovat na úvodu ani u dětských akcí. */
      proDospele: z.boolean().default(false),
    }),
});

const media = defineCollection({
  loader: file('./src/content/media/media.yaml'),
  schema: z.object({
    datum: z.coerce.date(),
    medium: z.string(),
    autor: z.string().optional(),
    titulek: z.string(),
    url: odkaz,
    shrnuti: z.string().optional(),
  }),
});

const stranky = defineCollection({
  loader: md('./src/content/stranky'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Velká čísla (úvod, Přidejte se, Pro média). */
    cisla: z
      .array(z.object({ hodnota: z.string(), popis: z.string() }))
      .default([]),
    /** Bloky argumentů (Přidejte se: Pro město / Pro podniky / Pro partnery). */
    bloky: z.array(z.object({ nadpis: z.string(), text: z.string() })).default([]),
    /** Čtupomínkové předměty a podobné seznamy. */
    polozky: z
      .array(
        z.object({
          nazev: z.string(),
          text: z.string(),
          cena: z.string().optional(),
          kde: z.string().optional(),
          stav: z.enum(['v-prodeji', 'pripravujeme', 'na-akcich']),
        }),
      )
      .default([]),
  }),
});

export const collections = { akce, rocniky, mesta, formaty, dobrovolnici, partneri, media, stranky };

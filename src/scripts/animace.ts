/**
 * GSAP animace (jen vylepšení: bez JS nebo při prefers-reduced-motion je vše hned vidět).
 * GSAP je z npm, žádné CDN a žádné cookies.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  const q = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);

  // 1) úvod: nadpis a tlačítka vyjedou po načtení
  const hero = document.querySelector('.hero__title');
  if (hero) {
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero__status', { autoAlpha: 0, y: 12, duration: 0.5 })
      .from(hero, { autoAlpha: 0, y: 40, duration: 0.9 }, '-=0.2')
      .from('.hero__cta .btn', { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.12 }, '-=0.4');
  }

  // 2) levé menu: položky se objeví postupně
  gsap.from('.site-nav__list li', { autoAlpha: 0, x: -16, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.1 });

  // 3) sekce s .reveal se objeví při scrollu
  q('.reveal').forEach((el) =>
    gsap.from(el, { autoAlpha: 0, y: 28, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }),
  );

  // 4) karty akcí naskakují po jedné
  q('.grid-cards').forEach((grid) =>
    ScrollTrigger.batch(Array.from(grid.children), {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.from(els, { autoAlpha: 0, y: 32, duration: 0.6, stagger: 0.1, ease: 'power2.out' }),
    }),
  );

  // 5) velká fotka na úvodu a fotka v textovém panelu: jemný paralax
  q<HTMLElement>('.velka-fotka img, .tp__foto').forEach((img) =>
    gsap.fromTo(
      img,
      { yPercent: -4, scale: 1.08 },
      { yPercent: 4, scale: 1.08, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } },
    ),
  );
}

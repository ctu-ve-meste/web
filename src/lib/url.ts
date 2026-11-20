/**
 * Vrátí odkaz s ohledem na `base` (web zatím běží v podsložce /web/).
 * Vždy používejte u interních odkazů: <a href={url('/akce/')}>.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Absolutní URL (pro canonical, OG, JSON-LD). */
export function absUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site).toString();
}

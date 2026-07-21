import { getLenisInstance } from './lenis';

const HEADER_OFFSET = -90;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.scrollTo(el, { offset: HEADER_OFFSET });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

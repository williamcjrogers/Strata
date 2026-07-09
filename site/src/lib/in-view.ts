/*
  One shared IntersectionObserver for every fire-once scroll reveal.
  The -15% bottom rootMargin starts reveals just before the element
  clears the fold, matching the feel of the previous scroll triggers.
*/
const REVEAL_MARGIN = "0px 0px -15% 0px";

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

export function observeInViewOnce(el: Element, cb: () => void): () => void {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const fn = callbacks.get(entry.target);
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
        fn?.();
      }
    },
    { rootMargin: REVEAL_MARGIN },
  );
  callbacks.set(el, cb);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

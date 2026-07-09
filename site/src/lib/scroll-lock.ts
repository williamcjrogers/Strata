/*
  Minimal scroll-lock seam used by the overlay menu. Native scroll is
  the only scroller, so a plain overflow toggle is the whole story.
*/
export function lockScroll() {
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  document.documentElement.style.overflow = "";
}

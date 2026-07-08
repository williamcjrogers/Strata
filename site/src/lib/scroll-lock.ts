/*
  Minimal scroll-lock seam. The overlay menu locks scrolling through this
  module; SmoothScrollProvider registers Lenis handlers here once mounted
  so the lock also stops the smooth scroller.
*/
type Handler = () => void;

let onLock: Handler | null = null;
let onUnlock: Handler | null = null;

export function registerScrollHandlers(lock: Handler, unlock: Handler) {
  onLock = lock;
  onUnlock = unlock;
  return () => {
    onLock = null;
    onUnlock = null;
  };
}

export function lockScroll() {
  document.documentElement.style.overflow = "hidden";
  onLock?.();
}

export function unlockScroll() {
  document.documentElement.style.overflow = "";
  onUnlock?.();
}

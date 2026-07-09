"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { NavItem } from "@/lib/routes";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { WaveDivider } from "@/components/waves/WaveDivider";

export function OverlayMenu({
  open,
  onClose,
  nav,
  cta,
}: {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  cta: NavItem;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lockScroll();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // close when the route changes
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Site menu"
      onClose={() => {
        unlockScroll();
        onClose();
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-anchor text-paper backdrop:bg-transparent"
    >
      <div className="flex h-full flex-col px-gutter py-6">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-strata-300">Menu</span>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="flex h-11 w-11 items-center justify-center text-sm font-semibold uppercase tracking-wide text-strata-200 hover:text-white"
          >
            <span className="sr-only">Close menu</span>
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4l12 12M16 4L4 16" />
            </svg>
          </button>
        </div>

        <nav aria-label="Primary" className="mt-12 flex-1">
          <ul className="space-y-2">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className="overlay-menu-item"
                style={{ animationDelay: `${80 + i * 60}ms` }}
              >
                <Link
                  href={item.href}
                  className="group flex items-baseline gap-4 py-2"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <span className="eyebrow text-strata-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="type-h2 text-paper transition-colors group-hover:text-strata-300">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          <Link
            href={cta.href}
            className="inline-flex h-12 items-center rounded-xs bg-paper px-6 text-sm font-semibold uppercase tracking-wide text-anchor hover:bg-strata-100"
          >
            {cta.label}
          </Link>
          <p aria-hidden="true" className="type-mono text-strata-500">
            {"SCC // COMMERCIAL AND COST CONSULTANCY // UK"}
          </p>
          <WaveDivider tone="dark" className="h-10 w-full" />
        </div>
      </div>
    </dialog>
  );
}

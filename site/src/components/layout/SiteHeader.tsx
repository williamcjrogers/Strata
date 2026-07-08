"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { contactCta, primaryNav } from "@/lib/routes";
import { OverlayMenu } from "./OverlayMenu";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // pages with a dark hero mark it with data-dark-hero; the header stays
  // transparent over those and goes solid everywhere else
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setOverDark(document.querySelector("[data-dark-hero]") !== null);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-150 ${
        scrolled || !overDark ? "bg-anchor shadow-overlay" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-gutter">
        <Link href="/" className="flex items-center" aria-label="Strata Cost Consulting home">
          <Image
            src="/brand/logo-white.svg"
            alt=""
            width={128}
            height={56}
            priority
            className="h-12 w-auto"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`text-sm font-medium text-strata-100 transition-colors hover:text-white ${
                pathname?.startsWith(item.href) ? "text-white" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={contactCta.href}
            className="inline-flex h-11 items-center rounded-xs bg-paper px-5 text-sm font-semibold uppercase tracking-wide text-anchor transition-colors hover:bg-strata-100"
          >
            {contactCta.label}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-11 items-center gap-3 text-sm font-semibold uppercase tracking-wide text-strata-100 hover:text-white lg:hidden"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
        >
          Menu
          <svg
            aria-hidden="true"
            width="20"
            height="14"
            viewBox="0 0 20 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M0 1h20M0 7h20M0 13h20" />
          </svg>
        </button>
      </div>

      <OverlayMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        nav={[{ label: "Home", href: "/" }, ...primaryNav, { label: "About", href: "/about" }]}
        cta={contactCta}
      />
    </header>
  );
}

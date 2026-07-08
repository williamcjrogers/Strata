import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "solid" | "outline" | "ghost";
  tone?: "light" | "dark";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xs px-6 text-sm font-semibold uppercase tracking-wide transition-colors duration-150 disabled:opacity-50";

const variants: Record<string, Record<string, string>> = {
  solid: {
    light: "bg-anchor text-paper hover:bg-strata-800",
    dark: "bg-paper text-anchor hover:bg-strata-100",
  },
  outline: {
    light: "border border-strata-500 text-strata-700 hover:border-strata-700 hover:text-strata-900",
    dark: "border border-strata-400 text-paper hover:border-strata-200",
  },
  ghost: {
    light: "text-accent-ink hover:text-strata-900",
    dark: "text-strata-200 hover:text-white",
  },
};

export function Button({
  children,
  href,
  type = "button",
  variant = "solid",
  tone = "light",
  className,
  disabled,
  onClick,
}: ButtonProps) {
  const classes = `${base} ${variants[variant][tone]} ${className ?? ""}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

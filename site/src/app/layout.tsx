import type { Metadata, Viewport } from "next";
import { inter, spaceGrotesk } from "@/lib/fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Strata Cost Consulting",
    default: "Strata Cost Consulting | Commercial and cost consultancy",
  },
  description:
    "Commercial and cost consultancy built on trust, technical excellence and long term partnership.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browser extensions (e.g. Kapture) inject
          body classes before hydration; attribute-only, children unaffected */}
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}

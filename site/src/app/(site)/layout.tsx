import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { SanityLive } from "@/sanity/lib/live";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <SmoothScrollProvider>
      <SkipLink />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <SanityLive />
      {isDraftMode ? <VisualEditing /> : null}
    </SmoothScrollProvider>
  );
}

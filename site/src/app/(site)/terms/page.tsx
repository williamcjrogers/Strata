import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/sections/CmsPage";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("terms", "/terms");
}

export default function TermsPage() {
  return <CmsPage slug="terms" />;
}

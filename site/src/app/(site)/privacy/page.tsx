import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/sections/CmsPage";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("privacy", "/privacy");
}

export default function PrivacyPage() {
  return <CmsPage slug="privacy" />;
}

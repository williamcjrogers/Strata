import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/sections/CmsPage";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("accessibility", "/accessibility");
}

export default function AccessibilityPage() {
  return <CmsPage slug="accessibility" />;
}

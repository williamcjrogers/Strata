import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/sections/CmsPage";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("careers", "/careers");
}

export default function CareersPage() {
  return <CmsPage slug="careers" />;
}

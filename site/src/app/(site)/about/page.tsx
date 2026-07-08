import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/sections/CmsPage";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("about", "/about");
}

export default function AboutPage() {
  return <CmsPage slug="about" />;
}

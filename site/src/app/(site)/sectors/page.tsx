import type { Metadata } from "next";
import { SectorCard } from "@/components/cards/SectorCard";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { CmsPage, cmsPageMetadata } from "@/components/sections/CmsPage";
import { Container } from "@/components/ui/Container";
import { sanityFetch } from "@/sanity/lib/live";
import { sectorsIndexQuery } from "@/sanity/queries/sectors";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("sectors", "/sectors");
}

export default async function SectorsPage() {
  const { data: sectors } = await sanityFetch({ query: sectorsIndexQuery });

  return (
    <CmsPage slug="sectors">
      <SectionReveal className="py-section">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(sectors ?? []).map((sector) => (
              <SectorCard key={sector._id} sector={sector} />
            ))}
          </div>
        </Container>
      </SectionReveal>
    </CmsPage>
  );
}

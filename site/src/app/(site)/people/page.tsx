import type { Metadata } from "next";
import { PersonCard } from "@/components/cards/PersonCard";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { CmsPage, cmsPageMetadata } from "@/components/sections/CmsPage";
import { Container } from "@/components/ui/Container";
import { sanityFetch } from "@/sanity/lib/live";
import { peopleIndexQuery } from "@/sanity/queries/people";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("people", "/people");
}

export default async function PeoplePage() {
  const { data: people } = await sanityFetch({ query: peopleIndexQuery });

  return (
    <CmsPage slug="people">
      <SectionReveal className="py-section">
        <Container>
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {(people ?? []).map((person) => (
              <PersonCard key={person._id} person={person} />
            ))}
          </div>
        </Container>
      </SectionReveal>
    </CmsPage>
  );
}

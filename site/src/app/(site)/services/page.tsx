import type { Metadata } from "next";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { CmsPage, cmsPageMetadata } from "@/components/sections/CmsPage";
import { Container } from "@/components/ui/Container";
import { sanityFetch } from "@/sanity/lib/live";
import { servicesIndexQuery } from "@/sanity/queries/services";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("services", "/services");
}

export default async function ServicesPage() {
  const { data: services } = await sanityFetch({ query: servicesIndexQuery });

  return (
    <CmsPage slug="services">
      <SectionReveal className="py-section">
        <Container>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {(services ?? []).map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </Container>
      </SectionReveal>
    </CmsPage>
  );
}

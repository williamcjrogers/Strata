import Link from "next/link";
import { PersonCard } from "@/components/cards/PersonCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { SanityImage } from "@/components/media/SanityImage";
import { CredentialsBand } from "@/components/motion/CredentialsBand";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { CTASection } from "@/components/sections/CTASection";
import { ServiceSectorMatrix } from "@/components/sections/ServiceSectorMatrix";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Prose } from "@/components/ui/Prose";
import { QuoteBlock } from "@/components/ui/QuoteBlock";
import { resolveLink } from "@/lib/links";
import { sanityFetch } from "@/sanity/lib/live";
import { featuredProjectsQuery } from "@/sanity/queries/projects";
import { peopleIndexQuery } from "@/sanity/queries/people";
import { matrixQuery } from "@/sanity/queries/sectors";
import type { PageBySlugQueryResult, SettingsQueryResult } from "@/sanity/types";

type Page = NonNullable<PageBySlugQueryResult>;
type Section = NonNullable<Page["sections"]>[number];

function SectionHeader({
  eyebrow,
  heading,
  tone = "light",
  index,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  tone?: "light" | "dark";
  index?: number;
}) {
  if (!eyebrow && !heading) return null;
  return (
    <header className="max-w-3xl" data-reveal>
      <div className="flex items-baseline justify-between gap-6">
        {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : <span />}
        {typeof index === "number" ? (
          <span
            aria-hidden="true"
            className={`meta-line shrink-0 ${
              tone === "dark" ? "text-strata-400" : "text-strata-600"
            }`}
          >
            / {String(index).padStart(2, "0")}
          </span>
        ) : null}
      </div>
      {heading ? (
        <h2
          className={`type-h2 mt-4 ${tone === "dark" ? "text-paper" : "text-strata-900"}`}
        >
          {heading}
        </h2>
      ) : null}
    </header>
  );
}

async function RenderSection({
  section,
  settings,
  index,
}: {
  section: Section;
  settings: SettingsQueryResult;
  index?: number;
}) {
  switch (section._type) {
    case "richTextSection":
      return (
        <SectionReveal className="py-section">
          <Container>
            <SectionHeader
              eyebrow={section.eyebrow}
              heading={section.heading}
              index={index}
            />
            <div className="mt-10" data-reveal>
              <Prose value={section.content} />
            </div>
          </Container>
        </SectionReveal>
      );

    case "statsBand": {
      const stats = section.useGlobalStats
        ? (settings?.credentialsStats ?? [])
        : (section.stats ?? []);
      return (
        <CredentialsBand
          eyebrow={section.eyebrow}
          heading={section.heading}
          stats={stats}
        />
      );
    }

    case "quoteBand":
      return <QuoteBlock quote={section.quote} variant="band" />;

    case "ctaBand": {
      const link = resolveLink(section.cta?.link ?? null);
      if (!section.cta?.heading || !link) return null;
      return (
        <CTASection
          heading={section.cta.heading}
          text={section.cta.text}
          link={link}
          statusChips={section.cta.statusChips}
        />
      );
    }

    case "processSection":
      return (
        <SectionReveal className="bg-strata-950 py-section text-paper">
          <Container>
            <SectionHeader
              eyebrow={section.eyebrow}
              heading={section.heading}
              tone="dark"
              index={index}
            />
            {section.intro ? (
              <p data-reveal className="mt-5 max-w-2xl text-base text-strata-200">
                {section.intro}
              </p>
            ) : null}
            <ol className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {(section.steps ?? []).map((step, i) => (
                <li
                  key={step._key}
                  data-reveal
                  className="border-t-2 border-strata-500 pt-5"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-4xl font-bold text-strata-500"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="type-h3 mt-4 text-paper">{step.title}</h3>
                  {step.description ? (
                    <p className="mt-3 text-sm text-strata-300">{step.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </Container>
        </SectionReveal>
      );

    case "featureGrid":
      return (
        <SectionReveal className="py-section">
          <Container>
            <SectionHeader
              eyebrow={section.eyebrow}
              heading={section.heading}
              index={index}
            />
            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {(section.items ?? []).map((item) => {
                const link = resolveLink(item.link ?? null);
                return (
                  <article
                    key={item._key}
                    data-reveal
                    className="border-t-2 border-anchor pt-5"
                  >
                    <h3 className="type-h3 text-strata-900">{item.heading}</h3>
                    {item.text ? (
                      <p className="mt-3 text-sm text-strata-700">{item.text}</p>
                    ) : null}
                    {link ? (
                      <Link
                        href={link.href}
                        className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide text-accent-ink hover:text-strata-900"
                      >
                        {link.label} <span aria-hidden="true">&rarr;</span>
                      </Link>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </Container>
        </SectionReveal>
      );

    case "projectGrid": {
      let projects = section.projects ?? [];
      if (section.mode !== "manual" || projects.length === 0) {
        const { data } = await sanityFetch({ query: featuredProjectsQuery });
        projects = (data ?? []) as typeof projects;
      }
      if (projects.length === 0) return null;
      return (
        <SectionReveal className="bg-mist py-section">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                eyebrow={section.eyebrow}
                heading={section.heading}
                index={index}
              />
              <Link
                data-reveal
                href="/projects"
                className="text-sm font-semibold uppercase tracking-wide text-accent-ink hover:text-strata-900"
              >
                All projects <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </Container>
        </SectionReveal>
      );
    }

    case "peopleGrid": {
      let people = section.people ?? [];
      if (people.length === 0) {
        const { data } = await sanityFetch({ query: peopleIndexQuery });
        people = (data ?? []) as typeof people;
      }
      if (people.length === 0) return null;
      return (
        <SectionReveal className="py-section">
          <Container>
            <SectionHeader
              eyebrow={section.eyebrow}
              heading={section.heading}
              index={index}
            />
            <div className="mt-12 grid gap-x-8 gap-y-12 grid-cols-2 lg:grid-cols-4">
              {people.map((person) => (
                <PersonCard key={person._id} person={person} />
              ))}
            </div>
          </Container>
        </SectionReveal>
      );
    }

    case "serviceMatrix": {
      const { data } = await sanityFetch({ query: matrixQuery });
      if (!data) return null;
      return (
        <SectionReveal className="py-section">
          <Container>
            <SectionHeader
              eyebrow={section.eyebrow}
              heading={section.heading}
              index={index}
            />
            {section.intro ? (
              <p data-reveal className="mt-5 max-w-2xl text-base text-strata-700">
                {section.intro}
              </p>
            ) : null}
            <div className="mt-12" data-reveal>
              <ServiceSectorMatrix services={data.services} sectors={data.sectors} />
            </div>
          </Container>
        </SectionReveal>
      );
    }

    case "logoStrip":
      if (!section.logos || section.logos.length === 0) return null;
      return (
        <section className="border-y border-line bg-paper py-12">
          <Container>
            {section.heading ? (
              <p className="eyebrow mb-8 text-center text-strata-700">
                {section.heading}
              </p>
            ) : null}
            <ul className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
              {section.logos.map((logo) => (
                <li key={logo._key} className="relative h-10 w-32 opacity-70">
                  <SanityImage
                    image={logo}
                    fallbackSeed={logo._key}
                    sizes="8rem"
                    className="object-contain"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      );

    default:
      return null;
  }
}

/* Sections with a heading get a sequential drafting-style number (/ 01). */
const NUMBERED_TYPES = new Set([
  "richTextSection",
  "featureGrid",
  "projectGrid",
  "peopleGrid",
  "serviceMatrix",
  "processSection",
]);

export function SectionRenderer({
  sections,
  settings,
}: {
  sections: Page["sections"];
  settings: SettingsQueryResult;
}) {
  if (!sections || sections.length === 0) return null;
  let counter = 0;
  return (
    <>
      {sections.map((section) => {
        const numbered =
          NUMBERED_TYPES.has(section._type) &&
          "heading" in section &&
          Boolean(section.heading);
        const index = numbered ? ++counter : undefined;
        return (
          <RenderSection
            key={section._key}
            section={section}
            settings={settings}
            index={index}
          />
        );
      })}
    </>
  );
}

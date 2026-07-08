import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { CmsPage, cmsPageMetadata } from "@/components/sections/CmsPage";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/queries/settings";

export async function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("contact", "/contact");
}

export default async function ContactPage() {
  const { data: settings } = await sanityFetch({ query: settingsQuery });
  const contact = settings?.contact;

  return (
    <CmsPage slug="contact">
      <SectionReveal className="py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[2fr_1fr]">
            <div data-reveal>
              <ContactForm />
            </div>
            <aside data-reveal className="space-y-10">
              <div>
                <Eyebrow>Direct</Eyebrow>
                <ul className="mt-4 space-y-3 text-base">
                  {contact?.email ? (
                    <li>
                      <a
                        href={`mailto:${contact.email}`}
                        className="font-semibold text-strata-900 underline decoration-strata-300 underline-offset-4 hover:decoration-strata-600"
                      >
                        {contact.email}
                      </a>
                    </li>
                  ) : null}
                  {contact?.phone ? <li className="text-strata-700">{contact.phone}</li> : null}
                  {contact?.linkedinUrl ? (
                    <li>
                      <a
                        href={contact.linkedinUrl}
                        rel="noreferrer"
                        target="_blank"
                        className="text-strata-700 underline decoration-strata-300 underline-offset-4 hover:text-strata-900"
                      >
                        LinkedIn
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
              {contact?.addressLines && contact.addressLines.length > 0 ? (
                <div>
                  <Eyebrow>Where we work</Eyebrow>
                  <address className="mt-4 not-italic text-strata-700">
                    {contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              ) : null}
              <div className="border-t-2 border-anchor bg-mist p-6">
                <h2 className="type-h3 text-strata-900">Speaking to a director</h2>
                <p className="mt-3 text-sm text-strata-700">
                  Every enquiry is read by a director, not a triage inbox. Expect
                  a considered reply, usually the same working day.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </SectionReveal>
    </CmsPage>
  );
}

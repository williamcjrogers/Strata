import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WaveDivider } from "@/components/waves/WaveDivider";

const ramp = [
  ["paper", "#fafaf7"],
  ["strata-50", "#ecf5f1"],
  ["strata-100", "#dceee6"],
  ["strata-200", "#bfdfd2"],
  ["strata-300", "#99cbb8"],
  ["strata-400", "#66ad96"],
  ["strata-500", "#3d8a72"],
  ["strata-600", "#1f6b55"],
  ["strata-700", "#0e4f3f"],
  ["strata-800", "#063a31"],
  ["strata-900", "#002924"],
  ["strata-950", "#001a16"],
] as const;

/* Dev-only reference sheet for tokens, type and component states. */
export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="bg-paper pb-section pt-40">
      <Container className="space-y-16">
        <header>
          <Eyebrow>Internal</Eyebrow>
          <h1 className="type-h1 mt-4 text-strata-900">Styleguide</h1>
        </header>

        <section aria-labelledby="sg-colour">
          <h2 id="sg-colour" className="type-h3 mb-6 text-strata-900">
            Colour ramp
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {ramp.map(([name, hex]) => (
              <div key={name} className="border border-line">
                <div className="h-16" style={{ backgroundColor: hex }} />
                <div className="p-2 text-xs">
                  <p className="font-semibold">{name}</p>
                  <p className="text-strata-700">{hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="sg-type" className="space-y-6">
          <h2 id="sg-type" className="type-h3 text-strata-900">
            Type scale
          </h2>
          <p className="type-display text-strata-900">Display Aa</p>
          <p className="type-h1 text-strata-900">Heading one</p>
          <p className="type-h2 text-strata-900">Heading two</p>
          <p className="type-h3 text-strata-900">Heading three, sentence case</p>
          <Eyebrow>Eyebrow label</Eyebrow>
          <p className="meta-line text-strata-700">
            Social housing · London · £45m
          </p>
          <p className="max-w-[65ch] text-base">
            Body copy. Strata Cost Consulting provides commercial and cost
            consultancy across social housing, infrastructure, contracting and
            bank monitoring; senior specialists, deployed immediately.
          </p>
        </section>

        <section aria-labelledby="sg-buttons" className="space-y-6">
          <h2 id="sg-buttons" className="type-h3 text-strata-900">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button>Solid light</Button>
            <Button variant="outline">Outline light</Button>
            <Button variant="ghost">Ghost light</Button>
          </div>
          <div className="flex flex-wrap gap-4 bg-anchor p-6">
            <Button tone="dark">Solid dark</Button>
            <Button tone="dark" variant="outline">
              Outline dark
            </Button>
            <Button tone="dark" variant="ghost">
              Ghost dark
            </Button>
          </div>
        </section>

        <section aria-labelledby="sg-waves" className="space-y-6">
          <h2 id="sg-waves" className="type-h3 text-strata-900">
            Wave dividers
          </h2>
          <WaveDivider />
          <div className="bg-anchor p-6">
            <WaveDivider tone="dark" />
          </div>
        </section>
      </Container>
    </div>
  );
}

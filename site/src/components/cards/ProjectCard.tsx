import Link from "next/link";
import { SanityImage, type ProjectedImage } from "@/components/media/SanityImage";
import { artefactKindForLabel } from "@/lib/artefact-kind";
import { refFromSeed } from "@/lib/refcode";

export type ProjectCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  client?: string | null;
  location?: string | null;
  value?: string | null;
  summary?: string | null;
  heroImage?: ProjectedImage;
  sectors?: ({ title: string | null; slug: string | null } | null)[] | null;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const meta = [
    project.sectors?.[0]?.title,
    project.location,
    project.value,
  ].filter(Boolean);

  return (
    <article data-reveal className="group relative">
      <div className="relative aspect-card w-full overflow-clip bg-strata-900">
        <SanityImage
          image={project.heroImage ?? null}
          fallbackSeed={project.slug ?? project._id}
          fallback={artefactKindForLabel(project.sectors?.[0]?.title)}
          tone="light"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />
      </div>
      <p className="type-mono mt-4 text-strata-700">
        <span aria-hidden="true" className="text-strata-600">
          {refFromSeed("SCC-PRJ", project.slug ?? project._id)}
        </span>
        {meta.length > 0 ? ` / ${meta.join(" / ")}` : ""}
      </p>
      <h3 className="type-h3 mt-2 text-strata-900 underline-offset-4 decoration-accent decoration-2 group-hover:underline">
        <Link href={`/projects/${project.slug}`} className="focus:outline-none">
          {/* stretch the whole card into the link target */}
          <span className="absolute inset-0" aria-hidden="true" />
          {project.title}
        </Link>
      </h3>
      {project.summary ? (
        <p className="mt-2 line-clamp-2 max-w-prose text-sm text-strata-700">
          {project.summary}
        </p>
      ) : null}
    </article>
  );
}

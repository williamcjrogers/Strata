import Link from "next/link";
import { SanityImage, type ProjectedImage } from "@/components/media/SanityImage";
import { artefactKindForLabel } from "@/lib/artefact-kind";
import { refFromSeed } from "@/lib/refcode";

export type ArticleCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  heroImage?: ProjectedImage;
  author?: { name?: string | null } | null;
  topics?: ({ title?: string | null } | null)[] | null;
};

export function formatDate(iso?: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <article data-reveal className="group relative">
      <div className="relative aspect-article w-full overflow-clip bg-strata-900">
        <SanityImage
          image={article.heroImage ?? null}
          fallbackSeed={article.slug ?? article._id}
          fallback={artefactKindForLabel(article.topics?.[0]?.title)}
          tone="light"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          ratio="16:9"
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />
      </div>
      <p className="type-mono mt-4 text-strata-700">
        <span aria-hidden="true" className="text-strata-600">
          {refFromSeed("SCC-INS", article.slug ?? article._id)}
        </span>
        {[article.topics?.[0]?.title, formatDate(article.publishedAt)]
          .filter(Boolean)
          .map((part) => ` / ${part}`)
          .join("")}
      </p>
      <h3 className="type-h3 mt-2 text-strata-900 underline-offset-4 decoration-accent decoration-2 group-hover:underline">
        <Link href={`/insights/${article.slug}`} className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          {article.title}
        </Link>
      </h3>
      {article.excerpt ? (
        <p className="mt-2 line-clamp-3 max-w-prose text-sm text-strata-700">
          {article.excerpt}
        </p>
      ) : null}
    </article>
  );
}

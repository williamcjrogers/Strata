"use client";

import Image from "next/image";
import { sanityLoader } from "@/sanity/lib/image";
import { ArtefactPlaceholder, type ArtefactKind } from "./ArtefactPlaceholder";
import { StrataPlaceholder } from "./StrataPlaceholder";

export type ProjectedImage = {
  alt?: string | null;
  asset?: {
    _id?: string | null;
    url?: string | null;
    metadata?: {
      lqip?: string | null;
      dimensions?: { width?: number | null; height?: number | null } | null;
    } | null;
  } | null;
} | null;

/*
  Renders a GROQ-projected Sanity image through next/image with LQIP
  blur and the Sanity CDN loader. Falls back to a deterministic
  placeholder when no image has been uploaded yet, in the same box, so
  swapping in photography later is purely a content change. `fallback`
  picks the artwork family: brand waves (default) or a technical
  artefact kind (drawing sheet, benchmark bars, figure, ID panel).
*/
export function SanityImage({
  image,
  fallbackSeed,
  sizes,
  className,
  ratio = "3:2",
  tone = "dark",
  fallback = "waves",
  priority = false,
}: {
  image: ProjectedImage;
  fallbackSeed: string;
  sizes: string;
  className?: string;
  ratio?: "3:2" | "4:5" | "16:9" | "21:9";
  tone?: "dark" | "light";
  fallback?: "waves" | ArtefactKind;
  priority?: boolean;
}) {
  const url = image?.asset?.url;
  if (!url) {
    if (fallback !== "waves") {
      return (
        <ArtefactPlaceholder
          seed={fallbackSeed}
          kind={fallback}
          ratio={ratio}
          className={className ?? "h-full w-full"}
        />
      );
    }
    return (
      <StrataPlaceholder
        seed={fallbackSeed}
        ratio={ratio}
        tone={tone}
        className={className ?? "h-full w-full"}
      />
    );
  }

  const lqip = image?.asset?.metadata?.lqip ?? undefined;
  return (
    <Image
      src={url}
      alt={image?.alt ?? ""}
      fill
      sizes={sizes}
      loader={sanityLoader}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
      className={className ?? "object-cover"}
      priority={priority}
    />
  );
}

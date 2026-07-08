export type NavItem = {
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Sectors", href: "/sectors" },
  { label: "Projects", href: "/projects" },
  { label: "People", href: "/people" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
];

export const contactCta: NavItem = {
  label: "Start a conversation",
  href: "/contact",
};

/** Rebuild the /projects query string with one filter changed. */
export function projectsFilterHref(
  current: { sector?: string; service?: string },
  patch: { sector?: string | null; service?: string | null },
): string {
  const params = new URLSearchParams();
  const sector = patch.sector === undefined ? current.sector : patch.sector;
  const service = patch.service === undefined ? current.service : patch.service;
  if (sector) params.set("sector", sector);
  if (service) params.set("service", service);
  const qs = params.toString();
  return qs ? `/projects?${qs}` : "/projects";
}

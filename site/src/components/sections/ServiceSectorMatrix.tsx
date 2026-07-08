import Link from "next/link";

type MatrixService = { _id: string; title: string | null; slug: string | null };
type MatrixSector = {
  _id: string;
  title: string | null;
  slug: string | null;
  offerings?: ({ serviceId: string | null; summary: string | null } | null)[] | null;
};

/** The three-band mark used as the matrix intersection glyph. */
function MatrixMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 18"
      className="h-4 w-5 text-accent"
      fill="currentColor"
    >
      <path d="M0 3c4-2 8-3 12-3s8 1 12 3v3c-4-2-8-3-12-3S4 4 0 6Z" />
      <path d="M0 9c4-2 8-3 12-3s8 1 12 3v3c-4-2-8-3-12-3S4 10 0 12Z" opacity="0.7" />
      <path d="M0 15c4-2 8-3 12-3s8 1 12 3v3c-4-2-8-3-12-3s-8 1-12 3Z" opacity="0.45" />
    </svg>
  );
}

/*
  Service x sector matrix. Desktop: a real table with header scopes.
  Small screens: an accordion of native <details> per sector. Both are
  rendered from the same data; no client JS.
*/
export function ServiceSectorMatrix({
  services,
  sectors,
}: {
  services: MatrixService[];
  sectors: MatrixSector[];
}) {
  const offered = (sector: MatrixSector, serviceId: string) =>
    sector.offerings?.find((o) => o?.serviceId === serviceId);

  return (
    <>
      {/* desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse">
          <caption className="sr-only">
            Services offered by sector. A marked cell links to the sector page.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="border-b-2 border-anchor py-4 pr-4 text-left">
                <span className="eyebrow text-strata-700">Sector</span>
              </th>
              {services.map((service) => (
                <th
                  key={service._id}
                  scope="col"
                  className="border-b-2 border-anchor px-4 py-4 text-left"
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm font-semibold text-strata-900 hover:text-accent-ink"
                  >
                    {service.title}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sectors.map((sector) => (
              <tr key={sector._id} className="group/row">
                <th
                  scope="row"
                  className="border-b border-line py-4 pr-4 text-left align-top"
                >
                  <Link
                    href={`/sectors/${sector.slug}`}
                    className="text-sm font-semibold text-strata-900 hover:text-accent-ink"
                  >
                    {sector.title}
                  </Link>
                </th>
                {services.map((service) => {
                  const cell = offered(sector, service._id);
                  return (
                    <td
                      key={service._id}
                      className="border-b border-line px-4 py-4 align-top group-hover/row:bg-mist"
                    >
                      {cell ? (
                        <Link
                          href={`/sectors/${sector.slug}`}
                          aria-label={`${service.title} in ${sector.title}`}
                          className="block"
                        >
                          <MatrixMark />
                        </Link>
                      ) : (
                        <span className="sr-only">Not offered</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* small screens: accordion */}
      <div className="space-y-3 md:hidden">
        {sectors.map((sector) => (
          <details key={sector._id} className="group border border-line bg-paper">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-4 text-sm font-semibold text-strata-900">
              {sector.title}
              <span
                aria-hidden="true"
                className="text-accent-ink transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <ul className="space-y-3 border-t border-line px-4 py-4">
              {services.map((service) => {
                const cell = offered(sector, service._id);
                if (!cell) return null;
                return (
                  <li key={service._id} className="flex items-start gap-3">
                    <MatrixMark />
                    <div>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-sm font-semibold text-strata-900 underline decoration-strata-300 underline-offset-4"
                      >
                        {service.title}
                      </Link>
                      {cell.summary ? (
                        <p className="mt-1 text-sm text-strata-700">{cell.summary}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </details>
        ))}
      </div>
    </>
  );
}

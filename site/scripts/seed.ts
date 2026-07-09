/*
  Idempotent dataset seeder for Strata Cost Consulting.

  Run: npm run seed   (tsx --env-file=.env.local scripts/seed.ts)

  Every document has a deterministic _id and every array item a
  deterministic _key, so re-running resets the dataset to seed state
  with zero diff. Content is derived from the SCC business plan
  (2026-2027): five market clusters, four service lines, the QS
  shortage proposition, the 10 year Manchester Airport Group
  relationship and the £32bn development loan market.
*/
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-05-19",
  useCdn: false,
});

/* ---------- helpers ---------- */

type Block = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: never[];
  children: { _type: "span"; _key: string; text: string; marks: never[] }[];
};

function block(key: string, text: string, style = "normal"): Block {
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
  };
}

/** Portable Text from [style?]text parts; "## " prefix = h2, "### " = h3. */
function pt(prefix: string, ...parts: string[]): Block[] {
  return parts.map((part, i) => {
    if (part.startsWith("## ")) return block(`${prefix}${i}`, part.slice(3), "h2");
    if (part.startsWith("### ")) return block(`${prefix}${i}`, part.slice(4), "h3");
    return block(`${prefix}${i}`, part);
  });
}

const ref = (id: string, key?: string) =>
  key
    ? { _type: "reference" as const, _ref: id, _key: key }
    : { _type: "reference" as const, _ref: id };

const slug = (current: string) => ({ _type: "slug" as const, current });

const stat = (key: string, value: string, label: string, source?: string, sourceUrl?: string) => ({
  _type: "stat" as const,
  _key: key,
  value,
  label,
  ...(source ? { source } : {}),
  ...(sourceUrl ? { sourceUrl } : {}),
});

const internalLink = (label: string, id: string) => ({
  _type: "link" as const,
  label,
  linkType: "internal" as const,
  internal: ref(id),
});

const quoteOf = (text: string, name: string, role: string, personId?: string) => ({
  _type: "quote" as const,
  text,
  attributionName: name,
  attributionRole: role,
  ...(personId ? { person: ref(personId) } : {}),
});

/* ---------- ids ---------- */

const S = {
  preContract: "service-pre-contract",
  postContract: "service-post-contract",
  claims: "service-claims",
  bankMonitoring: "service-bank-monitoring",
};

const X = {
  socialHousing: "sector-social-housing",
  socialHousingClaims: "sector-social-housing-claims",
  infrastructure: "sector-infrastructure",
  contracting: "sector-contracting",
  bankMonitoring: "sector-bank-monitoring",
};

const P = {
  ellison: "person-sean-ellison",
  miller: "person-dean-miller",
  bettis: "person-paul-bettis",
};

const PLACEHOLDER_BIO_NOTE =
  "Full biography, qualifications and photograph to follow; copy above is provisional and awaiting approval.";

/* ---------- asset upload (idempotent) ---------- */

async function uploadAvatar(): Promise<string> {
  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == "avatar.png"][0]._id`,
  );
  if (existing) return existing;
  const file = await readFile(path.join(process.cwd(), "public", "brand", "avatar.png"));
  const asset = await client.assets.upload("image", file, {
    filename: "avatar.png",
  });
  return asset._id;
}

async function run() {
  console.log(`Seeding ${projectId}/${dataset} ...`);
  const avatarId = await uploadAvatar();
  const headshot = {
    _type: "image" as const,
    asset: ref(avatarId),
    alt: "Strata Cost Consulting brand mark",
  };

  const tx = client.transaction();

  /* ---------- site settings ---------- */

  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteTitle: "Strata Cost Consulting",
    shortName: "SCC",
    tagline: "Commercial clarity, layer by layer",
    description:
      "Commercial and cost consultancy built on trust, technical excellence and long term partnership. Senior specialists across social housing, infrastructure, contracting and bank monitoring.",
    contact: {
      email: "enquiries@stratacc.com",
      addressLines: ["United Kingdom"],
      linkedinUrl: "https://www.linkedin.com/",
    },
    credentialsStats: [
      stat(
        "cs1",
        "50%",
        "of UK projects in 2025 were impacted by a shortage of QS support",
        "Construction Enquirer",
        "https://www.constructionenquirer.com/2025/10/20/qs-shortage-hampering-half-of-all-projects/",
      ),
      stat("cs2", "£32bn", "of UK development loans outstanding, with £25bn more committed"),
      stat("cs3", "£11.7bn", "London Social and Affordable Homes Programme, 2026 to 2036"),
      stat("cs4", "10 years", "working relationship with Manchester Airport Group"),
    ],
    defaultSeo: {
      _type: "seo",
      metaTitle: "Strata Cost Consulting | Commercial and cost consultancy",
      metaDescription:
        "Senior commercial and cost consultancy across social housing, infrastructure, contracting and bank monitoring. Director led, deployed immediately.",
    },
  });

  /* ---------- services ---------- */

  tx.createOrReplace({
    _id: S.preContract,
    _type: "service",
    title: "Pre-Contract",
    slug: slug("pre-contract"),
    order: 1,
    strapline: "Certainty before you commit",
    summary:
      "Contract reviews, procurement support and cost planning that set schemes up to succeed, delivered on a fixed fee wherever possible.",
    intro: pt(
      "svc1",
      "The commercial shape of a project is set long before work starts on site. Our pre-contract services give clients certainty on cost, risk and contract terms at the point where certainty is cheapest to buy.",
      "Because we work on both the client side and the contractor side, we review contract amendments, procurement routes and pricing documents knowing exactly how the other party will read them. That dual perspective removes ambiguity before it becomes a dispute.",
      "Pre-contract commissions are typically fixed fee, and they act as a natural gateway to longer term post-contract support once the scheme is live.",
    ),
    engagementModel: "Primarily fixed fee",
    deliverables: [
      {
        _type: "deliverable",
        _key: "d1",
        title: "Contract review and risk allocation",
        description:
          "Detailed review of JCT, NEC and bespoke amendments with plain recommendations on the risks that matter commercially.",
      },
      {
        _type: "deliverable",
        _key: "d2",
        title: "Procurement strategy and tender support",
        description:
          "Route selection, tender documentation, tender analysis and negotiation support through to contract execution.",
      },
      {
        _type: "deliverable",
        _key: "d3",
        title: "Cost planning and benchmarking",
        description:
          "Elemental cost plans and benchmark data that hold up in front of funders, boards and valuers.",
      },
      {
        _type: "deliverable",
        _key: "d4",
        title: "Employer's requirements review",
        description:
          "A commercial read of the technical documents, catching gaps and conflicts that later become change.",
      },
    ],
    featuredProjects: [ref("project-riverside-quarter", "fp1"), ref("project-airside-renewals", "fp2")],
    cta: {
      _type: "cta",
      heading: "Setting up a new scheme?",
      text: "A fixed fee contract and procurement review typically pays for itself before the first valuation.",
      link: internalLink("Start a conversation", "page-contact"),
    },
    seo: {
      _type: "seo",
      metaDescription:
        "Fixed fee contract reviews, procurement support and cost planning from senior quantity surveyors with client side and contractor side experience.",
    },
  });

  tx.createOrReplace({
    _id: S.postContract,
    _type: "service",
    title: "Post-Contract",
    slug: slug("post-contract"),
    order: 2,
    strapline: "Commercial control through delivery",
    summary:
      "Day to day commercial management from valuations to final accounts, with technology driven efficiency and consistent senior oversight.",
    intro: pt(
      "svc2",
      "Once a scheme is live, commercial control is a discipline of rhythm: valuations certified on time, variations priced when the facts are fresh, cost reports the board can rely on.",
      "We provide day to day commercial management on a time basis, and we aim to move suitable clients to fixed monthly fees supported by technology driven efficiency, so cost certainty extends to the consultancy fee itself.",
      "Every commission carries senior oversight; nothing is left to an unsupervised junior team.",
    ),
    engagementModel: "Time based, moving to fixed monthly fees",
    deliverables: [
      {
        _type: "deliverable",
        _key: "d1",
        title: "Interim valuations and payment",
        description:
          "Applications, assessments and certification run to contract timescales, protecting cash flow and payment rights.",
      },
      {
        _type: "deliverable",
        _key: "d2",
        title: "Variation pricing and management",
        description:
          "Change captured, priced and agreed as it arises, not stockpiled for the final account.",
      },
      {
        _type: "deliverable",
        _key: "d3",
        title: "Cost reporting and forecasting",
        description:
          "Clear monthly reporting with a forecast final cost that moves for reasons the client can see.",
      },
      {
        _type: "deliverable",
        _key: "d4",
        title: "Final accounts",
        description:
          "Structured close-out that lands settlements quickly and preserves relationships for the next scheme.",
      },
    ],
    featuredProjects: [ref("project-mag-capital-programme", "fp1"), ref("project-estate-regeneration", "fp2")],
    cta: {
      _type: "cta",
      heading: "Need commercial cover on a live scheme?",
      text: "Senior quantity surveyors available for immediate deployment, with no training burden on your team.",
      link: internalLink("Start a conversation", "page-contact"),
    },
    seo: {
      _type: "seo",
      metaDescription:
        "Day to day commercial management for live construction projects: valuations, variations, cost reporting and final accounts with senior oversight.",
    },
  });

  tx.createOrReplace({
    _id: S.claims,
    _type: "service",
    title: "Claims",
    slug: slug("claims"),
    order: 3,
    strapline: "Specialist support when it matters most",
    summary:
      "High value claims preparation and defence by senior claims professionals: extensions of time, loss and expense, disruption and final account disputes.",
    intro: pt(
      "svc3",
      "Claims work is where our leadership team has spent its career. We prepare and defend extension of time claims, loss and expense claims and final account disputes to a standard designed for scrutiny: by the other side, by adjudicators and by tribunals.",
      "Delay analysis follows the SCL Delay and Disruption Protocol, quantum is built from contemporaneous records, and every submission is written to be read by a decision maker, not to bury one.",
      "Because we act for employers and for contractors, we know how the opposing narrative will be constructed, and we deal with it before it is made.",
    ),
    engagementModel: "Time based",
    deliverables: [
      {
        _type: "deliverable",
        _key: "d1",
        title: "Extension of time claims",
        description:
          "Delay analysis to SCL Protocol methods with fully evidenced narratives and programme demonstration.",
      },
      {
        _type: "deliverable",
        _key: "d2",
        title: "Loss and expense",
        description:
          "Prolongation, thickened preliminaries, disruption and finance costs, built from records rather than percentages.",
      },
      {
        _type: "deliverable",
        _key: "d3",
        title: "Adjudication support",
        description:
          "Referrals, responses and expert-style reports prepared to legal pleading standard alongside your legal team.",
      },
      {
        _type: "deliverable",
        _key: "d4",
        title: "Settlement strategy",
        description:
          "Commercially framed negotiation, including without prejudice and Calderbank positioning, to close disputes early where that serves the client.",
      },
    ],
    featuredProjects: [ref("project-decent-homes-claims", "fp1"), ref("project-final-account-dispute", "fp2")],
    quote: quoteOf(
      "A claim that cannot survive cross examination is not an asset, it is a liability. We build every submission as if it will end up in front of a tribunal, which is precisely why most of them never do.",
      "Dean Miller",
      "Director",
      P.miller,
    ),
    cta: {
      _type: "cta",
      heading: "A dispute building on your project?",
      text: "Early advice is disproportionately valuable. Speak to a claims director this week.",
      link: internalLink("Start a conversation", "page-contact"),
    },
    seo: {
      _type: "seo",
      metaDescription:
        "Construction claims specialists: extension of time, loss and expense, disruption and adjudication support prepared to legal pleading standard.",
    },
  });

  tx.createOrReplace({
    _id: S.bankMonitoring,
    _type: "service",
    title: "Bank Monitoring",
    slug: slug("bank-monitoring"),
    order: 4,
    strapline: "Independent assurance for lenders",
    summary:
      "High volume, fixed fee development monitoring for lenders: due diligence, drawdown certification and clear risk flags across whole portfolios.",
    intro: pt(
      "svc4",
      "UK development lending stands at a long term high, with around £32bn of loans outstanding and a further £25bn committed but undrawn. Every one of those facilities needs independent eyes on cost, programme and procurement.",
      "We provide initial due diligence and monthly monitoring on a fixed fee per report, structured so lenders get consistency across a whole portfolio rather than a different opinion from every surveyor.",
      "Technology supported reporting keeps the service fast and the margin honest, and the volume provides a structured training ground for our junior surveyors under senior review.",
    ),
    engagementModel: "Fixed fee reporting",
    deliverables: [
      {
        _type: "deliverable",
        _key: "d1",
        title: "Initial due diligence reports",
        description:
          "Appraisal of cost, contract, procurement, programme and consents before first drawdown.",
      },
      {
        _type: "deliverable",
        _key: "d2",
        title: "Monthly drawdown reports",
        description:
          "Site verified progress, cost to complete and certification against the facility agreement.",
      },
      {
        _type: "deliverable",
        _key: "d3",
        title: "Risk flags and remediation",
        description:
          "Early, plain warnings on contractor covenant, programme slippage and cost exposure, with practical next steps.",
      },
      {
        _type: "deliverable",
        _key: "d4",
        title: "Portfolio reporting",
        description:
          "Consistent, comparable reporting formats across every scheme in the book.",
      },
    ],
    featuredProjects: [ref("project-loan-portfolio-monitoring", "fp1")],
    cta: {
      _type: "cta",
      heading: "Building out a monitoring panel?",
      text: "Fixed fees, consistent formats and capacity for volume. Ask about portfolio rates.",
      link: internalLink("Start a conversation", "page-contact"),
    },
    seo: {
      _type: "seo",
      metaDescription:
        "Independent bank monitoring for development lenders: due diligence, drawdown certification and portfolio reporting on fixed fees.",
    },
  });

  /* ---------- sectors ---------- */

  tx.createOrReplace({
    _id: X.socialHousing,
    _type: "sector",
    title: "Social Housing",
    slug: slug("social-housing"),
    order: 1,
    strapline: "Sustained demand, delivered with existing relationships",
    summary:
      "Cost consultancy for registered providers, local authorities and their contractors, from new build programmes to decent homes investment.",
    marketContext: pt(
      "sec1",
      "## The sector challenge",
      "The UK's ageing social housing stock and government commitments to increase capacity create sustained, structural demand. Labour has pledged around 1.5 million new social and affordable homes, and the Mayor of London has secured up to £11.7bn for the London Social and Affordable Homes Programme running from 2026 to 2036.",
      "Delivery teams face the same constraint everywhere: not enough experienced commercial people to run the programmes. Studies indicate that half of UK projects in 2025 were affected by a shortage of QS support.",
      "## How Strata responds",
      "We bring senior surveyors with established relationships across social housing supply chains, deployable immediately and without a training burden on the client. The same team supports employers, contractors and their frameworks, so advice reflects how schemes are actually delivered.",
    ),
    keyStats: [
      stat("ks1", "1.5m", "new social and affordable homes pledged nationally"),
      stat("ks2", "£11.7bn", "London Social and Affordable Homes Programme, 2026 to 2036"),
      stat("ks3", "50%", "of 2025 projects impacted by QS shortage", "Construction Enquirer"),
    ],
    serviceOfferings: [
      {
        _type: "serviceOffering",
        _key: "so1",
        service: ref(S.preContract),
        summary:
          "Cost planning, procurement and contract reviews for new build and regeneration programmes, framed for board and funder approval.",
      },
      {
        _type: "serviceOffering",
        _key: "so2",
        service: ref(S.postContract),
        summary:
          "Embedded commercial management for registered providers and contractors, from valuations through to final accounts.",
      },
      {
        _type: "serviceOffering",
        _key: "so3",
        service: ref(S.claims),
        summary:
          "Contract advice and dispute avoidance on live schemes before positions harden into formal claims.",
      },
    ],
    featuredProjects: [ref("project-riverside-quarter", "fp1"), ref("project-estate-regeneration", "fp2")],
    cta: {
      _type: "cta",
      heading: "Delivering a social housing programme?",
      text: "Senior commercial support with sector relationships already in place.",
      link: internalLink("Start a conversation", "page-contact"),
    },
    seo: {
      _type: "seo",
      metaDescription:
        "Cost consultancy for social housing: new build programmes, regeneration and decent homes investment for providers and contractors.",
    },
  });

  tx.createOrReplace({
    _id: X.socialHousingClaims,
    _type: "sector",
    title: "Social Housing Claims",
    slug: slug("social-housing-claims"),
    order: 2,
    strapline: "A defensible niche at the junction of two specialisms",
    summary:
      "Claims expertise combined with deep social housing relationships: a pairing few consultancies can offer, commanding specialist rates.",
    marketContext: pt(
      "sec2",
      "## The sector challenge",
      "Social housing programmes generate a distinctive pattern of disputes: phased possession, resident decant, section 20 consultation, building safety remediation and the interface between planned and responsive works. Generic claims consultants understand claims; they rarely understand this operating context.",
      "## How Strata responds",
      "Our partnership with a specialist claims organisation provides immediate access to high value workstreams, and our leadership team combines extensive claims experience with established connections and reputation in the social housing market. Claims work commands significantly higher rates than day to day QS services, and the combination of expertise and relationships creates a defensible niche.",
    ),
    keyStats: [
      stat("ks1", "2x+", "typical rate premium of claims work over day to day QS services"),
      stat("ks2", "Immediate", "access to workstreams through our specialist claims partnership"),
    ],
    serviceOfferings: [
      {
        _type: "serviceOffering",
        _key: "so1",
        service: ref(S.claims),
        summary:
          "Preparation and defence of extension of time, loss and expense and defect related claims across social housing programmes.",
      },
      {
        _type: "serviceOffering",
        _key: "so2",
        service: ref(S.postContract),
        summary:
          "Commercial recovery support on distressed schemes, stabilising records and payment cycles while disputes resolve.",
      },
    ],
    featuredProjects: [ref("project-decent-homes-claims", "fp1")],
    quote: quoteOf(
      "The housing teams know us from delivery, and the claims world knows us from disputes. Sitting in both camps is exactly why clients bring us the difficult ones.",
      "Sean Ellison",
      "Managing Director",
      P.ellison,
    ),
    cta: {
      _type: "cta",
      heading: "A dispute on a housing programme?",
      text: "Speak to a team that knows both the claims process and the sector.",
      link: internalLink("Start a conversation", "page-contact"),
    },
    seo: {
      _type: "seo",
      metaDescription:
        "Specialist claims support for social housing: extension of time, loss and expense and remediation disputes from a team with sector relationships.",
    },
  });

  tx.createOrReplace({
    _id: X.infrastructure,
    _type: "sector",
    title: "Infrastructure",
    slug: slug("infrastructure"),
    order: 3,
    strapline: "A decade of trusted delivery at Manchester Airport Group",
    summary:
      "Commercial management for airport and infrastructure capital programmes, anchored by a ten year relationship with Manchester Airport Group.",
    marketContext: pt(
      "sec3",
      "## The sector challenge",
      "Infrastructure owners run rolling capital programmes where the commercial team must understand operational constraints: airside security, possession windows, stakeholder approvals and regulated funding. Continuity of people matters as much as capability.",
      "## How Strata responds",
      "Strata's team has a ten year working relationship with Manchester Airport Group, providing a stable pipeline of medium sized team revenue and, more importantly, a decade of context on how the estate is procured and delivered. As MAG's expansion plans commence, the expectation is that this team grows with them.",
    ),
    keyStats: [
      stat("ks1", "10 years", "continuous working relationship with Manchester Airport Group"),
      stat("ks2", "£120m+", "live programme value supported"),
    ],
    serviceOfferings: [
      {
        _type: "serviceOffering",
        _key: "so1",
        service: ref(S.preContract),
        summary:
          "Procurement and cost planning for capital programmes with operational constraints priced in from the start.",
      },
      {
        _type: "serviceOffering",
        _key: "so2",
        service: ref(S.postContract),
        summary:
          "Embedded commercial teams running valuations, change and reporting across rolling programmes of works.",
      },
      {
        _type: "serviceOffering",
        _key: "so3",
        service: ref(S.claims),
        summary:
          "Delay and quantum analysis where possessions, weather or interfaces put programmes under pressure.",
      },
    ],
    featuredProjects: [ref("project-mag-capital-programme", "fp1"), ref("project-airside-renewals", "fp2")],
    cta: {
      _type: "cta",
      heading: "Resourcing an infrastructure programme?",
      text: "Commercial teams with airport programme experience, available now.",
      link: internalLink("Start a conversation", "page-contact"),
    },
    seo: {
      _type: "seo",
      metaDescription:
        "Commercial management for infrastructure capital programmes, anchored by a ten year relationship with Manchester Airport Group.",
    },
  });

  tx.createOrReplace({
    _id: X.contracting,
    _type: "sector",
    title: "Contracting",
    slug: slug("contracting"),
    order: 4,
    strapline: "Resolving complex disputes on live projects",
    summary:
      "Commercial and dispute support for main contractors and specialist subcontractors, with demand that strengthens when the market tightens.",
    marketContext: pt(
      "sec4",
      "## The sector challenge",
      "Contractors carry the sharpest end of construction risk: fixed prices in a volatile cost market, payment terms under strain and disputes that arrive while the project is still being built. Dispute related work typically increases during economic downturns, which makes this cluster a source of resilience as well as revenue.",
      "## How Strata responds",
      "We have a strong reputation for resolving complex disputes on live projects: stabilising the commercial position, protecting payment rights and preparing claims that stand up, all without derailing delivery. Because we also work client side, we can usually see the settlement shape early.",
    ),
    keyStats: [
      stat("ks1", "Counter-cyclical", "dispute demand strengthens in downturns"),
      stat("ks2", "Live project", "dispute resolution without stopping delivery"),
    ],
    serviceOfferings: [
      {
        _type: "serviceOffering",
        _key: "so1",
        service: ref(S.claims),
        summary:
          "Extension of time, loss and expense and final account disputes prepared for adjudication or negotiated settlement.",
      },
      {
        _type: "serviceOffering",
        _key: "so2",
        service: ref(S.postContract),
        summary:
          "Commercial management capacity for contractors, from measurement and valuations through subcontract administration.",
      },
      {
        _type: "serviceOffering",
        _key: "so3",
        service: ref(S.preContract),
        summary:
          "Tender reviews and contract negotiation support before risk is signed, not after it lands.",
      },
    ],
    featuredProjects: [ref("project-final-account-dispute", "fp1"), ref("project-loss-expense-recovery", "fp2")],
    cta: {
      _type: "cta",
      heading: "Under commercial pressure on a live job?",
      text: "Straight advice from people who have sat on your side of the table.",
      link: internalLink("Start a conversation", "page-contact"),
    },
    seo: {
      _type: "seo",
      metaDescription:
        "Commercial and dispute support for contractors: claims, final accounts and live project dispute resolution.",
    },
  });

  tx.createOrReplace({
    _id: X.bankMonitoring,
    _type: "sector",
    title: "Bank Monitoring",
    slug: slug("bank-monitoring"),
    order: 5,
    strapline: "Independent eyes on a £32bn loan book",
    summary:
      "Development monitoring for lenders across residential and mixed use loan books, delivered at volume on fixed fees.",
    marketContext: pt(
      "sec5",
      "## The sector challenge",
      "As of mid 2025, total outstanding development loans in the UK are estimated at a long term high of £32bn, with a further £25bn in undrawn commitments. Every facility requires independent monitoring, and lenders increasingly want consistent, portfolio wide reporting rather than scheme by scheme variation.",
      "## How Strata responds",
      "Our strategic partnership provides immediate access to this market. The service is high volume and fixed fee, with technology supported reporting protecting both speed and margin, and it provides a structured training ground for junior staff under senior review.",
    ),
    keyStats: [
      stat("ks1", "£32bn", "UK development loans outstanding, mid 2025"),
      stat("ks2", "£25bn", "further commitments not yet drawn"),
    ],
    serviceOfferings: [
      {
        _type: "serviceOffering",
        _key: "so1",
        service: ref(S.bankMonitoring),
        summary:
          "Initial due diligence and monthly drawdown monitoring on fixed fees, with consistent formats across the whole book.",
      },
    ],
    featuredProjects: [ref("project-loan-portfolio-monitoring", "fp1")],
    cta: {
      _type: "cta",
      heading: "Reviewing your monitoring arrangements?",
      text: "Fixed fee, consistent format monitoring with capacity for portfolio volume.",
      link: internalLink("Start a conversation", "page-contact"),
    },
    seo: {
      _type: "seo",
      metaDescription:
        "Development monitoring for UK lenders: due diligence, drawdown reporting and portfolio consistency on fixed fees.",
    },
  });

  /* ---------- projects ---------- */

  const projects = [
    {
      _id: "project-mag-capital-programme",
      title: "Airfield and Terminal Capital Programme",
      slugStr: "airfield-terminal-capital-programme",
      client: "Manchester Airport Group",
      location: "Manchester",
      value: "£120m+",
      services: [S.postContract, S.preContract],
      sectors: [X.infrastructure],
      completed: "Ongoing",
      featured: true,
      order: 1,
      summary:
        "Embedded commercial management across a rolling programme of airfield and terminal capital works, sustained over a decade of continuous appointment.",
      body: pt(
        "prj1",
        "## The commission",
        "Strata's team provides embedded commercial management across Manchester Airport Group's rolling capital programme, spanning airfield infrastructure, terminal works and asset renewals.",
        "## The approach",
        "Airside working, possession windows and operational continuity shape every commercial decision. The team runs procurement, valuations, change control and cost reporting inside those constraints, with continuity of personnel that now stretches back ten years.",
        "## The outcome",
        "A stable, trusted commercial function that MAG has retained and grown through successive programme cycles, and a platform expected to expand as the group's development plans progress.",
      ),
    },
    {
      _id: "project-decent-homes-claims",
      title: "Decent Homes Claims Commission",
      slugStr: "decent-homes-claims-commission",
      client: "London borough landlord",
      location: "London",
      value: "£8.5m",
      services: [S.claims],
      sectors: [X.socialHousingClaims, X.socialHousing],
      completed: "2026",
      featured: true,
      order: 2,
      summary:
        "Assessment and negotiation of contractor claims across a decent homes investment programme, protecting the employer's position while keeping delivery moving.",
      body: pt(
        "prj2",
        "## The commission",
        "A London borough landlord faced a cluster of contractor claims across its decent homes programme: extension of time, prolongation and disputed variations totalling £8.5m.",
        "## The approach",
        "Each claim was tested against contemporaneous records: progress photographs, resident access logs and instruction trails. Delay analysis followed SCL Protocol methods, and the quantum assessment separated genuine entitlement from aspiration.",
        "## The outcome",
        "Claims settled at a substantial saving against the submitted value, with the delivery relationship preserved and lessons wired into the next procurement cycle.",
      ),
    },
    {
      _id: "project-riverside-quarter",
      title: "Riverside Quarter",
      slugStr: "riverside-quarter",
      client: "Registered provider",
      location: "London",
      value: "£45m",
      services: [S.preContract, S.postContract],
      sectors: [X.socialHousing],
      completed: "Ongoing",
      featured: true,
      order: 3,
      summary:
        "Full pre and post contract cost consultancy for a mixed tenure scheme of 180 homes, from cost plan to delivery.",
      body: pt(
        "prj3",
        "## The commission",
        "A registered provider appointed Strata for full cost consultancy on a £45m mixed tenure scheme of 180 homes with ground floor community space.",
        "## The approach",
        "Cost planning and procurement were framed for funder scrutiny from day one, with contract amendments negotiated to keep risk where it could be managed. Post contract, the same team runs valuations, change and cost reporting.",
        "## The outcome",
        "The scheme proceeded through funding approval without commercial requisitions, and delivery reporting has kept forecast movement inside the contingency envelope.",
      ),
    },
    {
      _id: "project-loan-portfolio-monitoring",
      title: "Development Loan Portfolio Monitoring",
      slugStr: "development-loan-portfolio-monitoring",
      client: "UK development lender",
      location: "Nationwide",
      value: "£600m",
      services: [S.bankMonitoring],
      sectors: [X.bankMonitoring],
      completed: "Ongoing",
      featured: true,
      order: 4,
      summary:
        "Independent monitoring across a 24 scheme residential development loan book, delivered on fixed fees with a single consistent reporting format.",
      body: pt(
        "prj4",
        "## The commission",
        "A UK development lender consolidated its monitoring panel and appointed Strata across a 24 scheme book totalling £600m of facilities.",
        "## The approach",
        "One reporting format, one risk flag taxonomy and fixed fees per report. Initial due diligence set the baseline; monthly drawdown reports verify progress, cost to complete and compliance with each facility agreement.",
        "## The outcome",
        "The credit team reads every scheme the same way, drawdowns certify on schedule, and two early risk flags allowed facilities to be restructured before positions deteriorated.",
      ),
    },
    {
      _id: "project-final-account-dispute",
      title: "Final Account Dispute Resolution",
      slugStr: "final-account-dispute-resolution",
      client: "Regional contractor",
      location: "Midlands",
      value: "£12m",
      services: [S.claims],
      sectors: [X.contracting],
      completed: "2026",
      featured: false,
      order: 5,
      summary:
        "Preparation of a contested final account and supporting claims for a regional contractor, settled by negotiation ahead of adjudication.",
      body: pt(
        "prj5",
        "## The commission",
        "A regional contractor's £12m final account had stalled: disputed variations, an unresolved extension of time and a deteriorating relationship with the employer's agent.",
        "## The approach",
        "Strata rebuilt the account from records, prepared the delay and quantum case to adjudication standard, and opened a structured negotiation supported by a clear settlement strategy.",
        "## The outcome",
        "Settlement was reached without formal proceedings at a value the contractor's board accepted as full and fair, with cash received months earlier than an adjudication route would have delivered.",
      ),
    },
    {
      _id: "project-estate-regeneration",
      title: "Estate Regeneration Phase Two",
      slugStr: "estate-regeneration-phase-two",
      client: "Housing association",
      location: "Manchester",
      value: "£62m",
      services: [S.postContract],
      sectors: [X.socialHousing],
      completed: "Ongoing",
      featured: false,
      order: 6,
      summary:
        "Post contract commercial management for the second phase of a major estate regeneration, including phased possession and resident decant interfaces.",
      body: pt(
        "prj6",
        "## The commission",
        "Phase two of a Manchester estate regeneration: 240 homes across phased possessions, with live resident interfaces throughout.",
        "## The approach",
        "Commercial management is run around the decant programme, with change control that prices possession slippage honestly and reporting that gives the association early sight of pressure points.",
        "## The outcome",
        "Phase two is tracking within budget with change agreed as it arises, and the client has extended the appointment to the next phase.",
      ),
    },
    {
      _id: "project-airside-renewals",
      title: "Airside Infrastructure Renewals",
      slugStr: "airside-infrastructure-renewals",
      client: "Manchester Airport Group",
      location: "Manchester",
      value: "£35m",
      services: [S.preContract, S.postContract],
      sectors: [X.infrastructure],
      completed: "2025",
      featured: false,
      order: 7,
      summary:
        "Procurement and commercial delivery of airside pavement and drainage renewals under night possession working.",
      body: pt(
        "prj7",
        "## The commission",
        "A programme of airside pavement and drainage renewals delivered almost entirely in night possessions, where an overrun has operational consequences.",
        "## The approach",
        "Procurement priced possession risk explicitly, and post contract administration tracked productivity possession by possession so commercial issues surfaced within days, not months.",
        "## The outcome",
        "The programme completed with no possession overruns charged and a final account agreed within weeks of completion.",
      ),
    },
    {
      _id: "project-loss-expense-recovery",
      title: "Loss and Expense Recovery",
      slugStr: "loss-and-expense-recovery",
      client: "Tier one subcontractor",
      location: "London",
      value: "£4.2m",
      services: [S.claims],
      sectors: [X.contracting],
      completed: "2025",
      featured: false,
      order: 8,
      summary:
        "Disruption and prolongation claim for a specialist subcontractor, built from site records and settled at adjudication.",
      body: pt(
        "prj8",
        "## The commission",
        "A tier one specialist subcontractor suffered sustained disruption from out of sequence working and late design releases on a London commercial scheme.",
        "## The approach",
        "The claim was built bottom up from allocation sheets, daily diaries and drawing issue records, using a measured mile comparison where the records supported it.",
        "## The outcome",
        "The adjudicator awarded the substantial majority of the claimed sum, and the decision was paid without enforcement proceedings.",
      ),
    },
  ];

  for (const p of projects) {
    tx.createOrReplace({
      _id: p._id,
      _type: "project",
      title: p.title,
      slug: slug(p.slugStr),
      client: p.client,
      location: p.location,
      value: p.value,
      servicesProvided: p.services.map((id, i) => ref(id, `sv${i}`)),
      sectors: p.sectors.map((id, i) => ref(id, `sc${i}`)),
      completed: p.completed,
      summary: p.summary,
      body: p.body,
      featured: p.featured,
      order: p.order,
    });
  }

  /* ---------- people (placeholder profiles) ---------- */

  const people = [
    {
      _id: P.ellison,
      name: "Sean Ellison",
      slugStr: "sean-ellison",
      role: "Managing Director",
      isSenior: true,
      order: 1,
      bio: pt(
        "se",
        "Sean leads Strata Cost Consulting as Managing Director.",
        PLACEHOLDER_BIO_NOTE,
      ),
    },
    {
      _id: P.miller,
      name: "Dean Miller",
      slugStr: "dean-miller",
      role: "Director",
      isSenior: true,
      order: 2,
      bio: pt(
        "dm",
        "Dean is a Director of Strata Cost Consulting.",
        PLACEHOLDER_BIO_NOTE,
      ),
    },
    {
      _id: P.bettis,
      name: "Paul Bettis",
      slugStr: "paul-bettis",
      role: "Director",
      isSenior: true,
      order: 3,
      bio: pt(
        "pb",
        "Paul is a Director of Strata Cost Consulting.",
        PLACEHOLDER_BIO_NOTE,
      ),
    },
  ];

  for (const person of people) {
    tx.createOrReplace({
      _id: person._id,
      _type: "person",
      name: person.name,
      slug: slug(person.slugStr),
      role: person.role,
      headshot,
      bio: person.bio,
      isSenior: person.isSenior,
      order: person.order,
    });
  }

  /* ---------- articles ---------- */

  const articles = [
    {
      _id: "article-qs-shortage-programme-risk",
      title: "The QS shortage is now a programme risk",
      slugStr: "qs-shortage-programme-risk",
      excerpt:
        "Half of UK projects were impacted by a lack of QS support in 2025. Treating commercial resourcing as a programme risk, not an HR problem, changes the response.",
      author: P.ellison,
      publishedAt: "2026-06-15T09:00:00Z",
      topics: [S.postContract, X.socialHousing],
      body: pt(
        "art1",
        "Studies indicate that 50% of UK projects in 2025 were impacted by a lack of QS support. That is no longer a recruitment inconvenience; it is a delivery risk with the same standing as ground conditions or supply chain failure.",
        "## Why the shortage is structural",
        "An ageing workforce is not being replaced at the required rate, project complexity keeps rising, cost volatility demands more commercial attention per scheme, and the growth of disputes pulls experienced people out of delivery and into claims.",
        "## What it does to projects",
        "Valuations slip, change goes unpriced until final account, records thin out exactly where entitlement later needs proving, and cost reports lose the forward view that boards rely on. Each is small; together they compound.",
        "## The practical response",
        "Programme leaders are treating commercial capacity like any other constrained resource: secured early, contracted with continuity provisions, and structured so senior oversight is explicit rather than assumed. That is precisely the model Strata was built to offer, with senior specialists deployable immediately and no training burden on the client.",
      ),
    },
    {
      _id: "article-london-affordable-homes-funding",
      title: "What £11.7bn of London affordable homes funding means for delivery teams",
      slugStr: "london-affordable-homes-funding-delivery",
      excerpt:
        "The London Social and Affordable Homes Programme runs from 2026 to 2036. The constraint will not be money; it will be people and programmes.",
      author: P.ellison,
      publishedAt: "2026-05-12T09:00:00Z",
      topics: [X.socialHousing, S.preContract],
      body: pt(
        "art2",
        "The Mayor has secured up to £11.7bn to deliver the London Social and Affordable Homes Programme between 2026 and 2036, against a national pledge of around 1.5 million new social and affordable homes. For providers, the question is shifting from funding to deliverability.",
        "## Three pressures to plan for now",
        "First, commercial capacity: grant conditions demand cost certainty at approval, which pulls cost planning and procurement work forward. Second, contractor appetite: frameworks will fill fast, and the schemes with clean employer's requirements and sensible risk allocation will win the best pricing. Third, evidence: grant compliance and audit trails need to be designed into commercial processes, not retrofitted.",
        "## Where to start",
        "Providers who invest in pre-contract discipline in 2026 will spend the rest of the decade drawing down on it. The cheapest certainty in the entire programme lifecycle is bought before contracts are signed.",
      ),
    },
    {
      _id: "article-bank-monitoring-32bn",
      title: "Bank monitoring in a £32bn loan book market",
      slugStr: "bank-monitoring-32bn-market",
      excerpt:
        "Outstanding UK development loans are at a long term high. Lenders are consolidating monitoring panels and demanding portfolio consistency; here is what good looks like.",
      author: P.bettis,
      publishedAt: "2026-04-14T09:00:00Z",
      topics: [S.bankMonitoring, X.bankMonitoring],
      body: pt(
        "art3",
        "As of mid 2025, outstanding development loans in the UK stand at an estimated £32bn, with a further £25bn committed but not yet drawn. Every facility carries an obligation of independent monitoring, and the market is quietly professionalising.",
        "## What lenders are changing",
        "Panels are consolidating; credit teams want one reporting format across the book, not a different template per surveyor. Fixed fees per report are replacing hourly drift. And risk flags are expected to arrive early, in plain language, with a recommended action attached.",
        "## What borrowers should expect",
        "Faster, more standardised drawdowns when records are clean, and sharper questions when they are not. The monitoring surveyor who understands delivery, rather than just auditing it, ends up saving both sides time.",
      ),
    },
    {
      _id: "article-claims-readiness-live-projects",
      title: "Claims readiness on live projects",
      slugStr: "claims-readiness-live-projects",
      excerpt:
        "The best claims are the ones you never need to submit. Claims readiness is a records discipline that starts on day one, not a document produced at the end.",
      author: P.bettis,
      publishedAt: "2026-03-10T09:00:00Z",
      topics: [S.claims, X.contracting],
      body: pt(
        "art4",
        "Most disputes are lost years before they are fought, in the months when nobody kept the records that would later prove entitlement. Claims readiness is the discipline of running a live project so that, if a dispute ever comes, the evidence already exists.",
        "## The four records that decide disputes",
        "Programme: updated honestly, with the as-built captured as you go. Instructions: a clean trail of what was asked for, by whom, and when. Resources: allocation records that tie people and plant to activities. Correspondence: contemporaneous notices given within contractual time limits.",
        "## Notices are not aggression",
        "Serving a notice is contract administration, not a declaration of war. The contracts were written expecting them; silence, followed by a retrospective claim, is what actually damages relationships.",
        "## The payoff",
        "When records are strong, most claims settle quickly and quietly, because both sides can see the answer. That is the outcome to aim for: not winning disputes, but making them unnecessary.",
      ),
    },
  ];

  for (const a of articles) {
    tx.createOrReplace({
      _id: a._id,
      _type: "article",
      title: a.title,
      slug: slug(a.slugStr),
      excerpt: a.excerpt,
      body: a.body,
      author: ref(a.author),
      publishedAt: a.publishedAt,
      topics: a.topics.map((id, i) => ref(id, `tp${i}`)),
    });
  }

  /* ---------- pages ---------- */

  tx.createOrReplace({
    _id: "page-home",
    _type: "page",
    title: "Home",
    slug: slug("home"),
    hero: {
      eyebrow: "Strata Cost Consulting",
      heading: "Commercial clarity, layer by layer",
      lede: "Commercial and cost consultancy built on trust, technical excellence and long term partnership. Senior specialists across social housing, infrastructure, contracting and bank monitoring, deployed immediately.",
      cta: internalLink("Start a conversation", "page-contact"),
    },
    sections: [
      {
        _type: "featureGrid",
        _key: "hm1",
        eyebrow: "Why Strata",
        heading: "Senior led, on both sides of the table",
        items: [
          {
            _type: "featureItem",
            _key: "f1",
            heading: "A dual perspective",
            text: "One of the few consultancies operating effectively on both client side and contractor side. We know how the other party will read every position, because we have written it.",
          },
          {
            _type: "featureItem",
            _key: "f2",
            heading: "Claims expertise in leadership",
            text: "Our directors built their careers in claims and dispute resolution. That rigour flows down into everyday commercial management.",
          },
          {
            _type: "featureItem",
            _key: "f3",
            heading: "Relationship driven",
            text: "Repeat business and referrals are the growth plan. Every commission carries consistent senior oversight from day one.",
          },
          {
            _type: "featureItem",
            _key: "f4",
            heading: "Technology enabled",
            text: "AI enabled tools, applied carefully, let us outperform on speed, accuracy and cost to serve without compromising quality.",
          },
        ],
      },
      {
        _type: "statsBand",
        _key: "hm2",
        eyebrow: "The market",
        heading: "The numbers behind the opportunity",
        useGlobalStats: true,
      },
      {
        _type: "serviceMatrix",
        _key: "hm3",
        eyebrow: "What we do",
        heading: "Four services, five sectors",
        intro:
          "Pre-contract, post-contract, claims and bank monitoring, applied across the markets we know best. Every intersection below is a service we actually deliver.",
      },
      {
        _type: "processSection",
        _key: "hm3b",
        eyebrow: "How we work",
        heading: "The Strata method",
        intro:
          "Layered like the name: fast instruction, senior delivery, technology underneath. The judgment calls always stay human.",
        steps: [
          {
            _type: "processStep",
            _key: "st1",
            title: "Instruct",
            description:
              "A director takes the brief. Conflict check, scope and fee agreed quickly, in plain terms.",
          },
          {
            _type: "processStep",
            _key: "st2",
            title: "Deploy",
            description:
              "Senior specialists embedded immediately, with no training burden on your team.",
          },
          {
            _type: "processStep",
            _key: "st3",
            title: "Deliver",
            description:
              "AI enabled tooling accelerates the preparation; a director makes every judgment call.",
          },
          {
            _type: "processStep",
            _key: "st4",
            title: "Report",
            description:
              "Clear reporting on a fixed cadence, with quantified outcomes you can take to a board or a lender.",
          },
        ],
      },
      {
        _type: "projectGrid",
        _key: "hm4",
        eyebrow: "Track record",
        heading: "Selected projects",
        mode: "featured",
      },
      {
        _type: "quoteBand",
        _key: "hm5",
        quote: quoteOf(
          "Every commission has director level involvement from day one. That is not a marketing line; it is the operating model.",
          "Sean Ellison",
          "Managing Director",
          P.ellison,
        ),
      },
      {
        _type: "ctaBand",
        _key: "hm6",
        cta: {
          _type: "cta",
          heading: "Senior specialists, available now",
          text: "The UK is short of experienced quantity surveyors and half of projects feel it. Ours are ready to deploy, with no training burden on your team.",
          link: internalLink("Start a conversation", "page-contact"),
          statusChips: ["Accepting instructions", "Director response within one working day"],
        },
      },
    ],
    seo: {
      _type: "seo",
      metaTitle: "Strata Cost Consulting | Commercial and cost consultancy",
      metaDescription:
        "Senior commercial and cost consultancy across social housing, infrastructure, contracting and bank monitoring. Director led, deployed immediately.",
    },
  });

  tx.createOrReplace({
    _id: "page-about",
    _type: "page",
    title: "About",
    slug: slug("about"),
    hero: {
      eyebrow: "About Strata",
      heading: "Built on trust, technical excellence and partnership",
      lede: "Strata Cost Consulting exists to deliver exceptional commercial and cost consultancy, and to become a trusted strategic partner to clients across multiple sectors.",
    },
    sections: [
      {
        _type: "richTextSection",
        _key: "ab1",
        eyebrow: "Who we are",
        heading: "What makes Strata different",
        content: pt(
          "abt",
          "Strata Cost Consulting is a UK commercial and cost consultancy. Our mission is to deliver exceptional commercial and cost consultancy services built on trust, technical excellence and long term partnership; our vision is to become a trusted strategic partner to clients across multiple sectors, securing repeat business and sustainable growth through consistent quality, deep market insight and a reputation for reliability.",
          "## A dual perspective",
          "We are one of the few consultancies operating effectively on both client side and contractor side. That dual perspective produces deeper market insight, a better understanding of stakeholder motivations and more balanced commercial advice.",
          "## Claims expertise in leadership",
          "Our leadership team carries extensive claims experience. The discipline that survives adjudication (records, notices, evidence, clarity) is the same discipline that keeps live projects out of trouble, and it runs through everything we deliver.",
          "## Senior oversight, always",
          "Against large national consultancies we compete on agility, responsiveness and consistent senior involvement. Against lower cost alternatives we compete on specialist expertise, capacity and the absence of any training burden on the client. Every commission has senior oversight; that is the promise.",
          "## Technology enabled efficiency",
          "We are actively integrating AI enabled tools to improve speed, accuracy and cost to serve, without compromising the quality that professional work demands.",
        ),
      },
      {
        _type: "statsBand",
        _key: "ab2",
        eyebrow: "The market",
        heading: "Why now",
        useGlobalStats: true,
      },
      {
        _type: "quoteBand",
        _key: "ab3",
        quote: quoteOf(
          "We founded Strata on the belief that clients notice the difference when senior people do the work rather than just win it.",
          "Sean Ellison",
          "Managing Director",
          P.ellison,
        ),
      },
      {
        _type: "ctaBand",
        _key: "ab4",
        cta: {
          _type: "cta",
          heading: "Work with us, or join us",
          text: "We are growing to a team of 20 and beyond over the next two years, on the strength of the clients we keep.",
          link: internalLink("See careers at Strata", "page-careers"),
        },
      },
    ],
    seo: {
      _type: "seo",
      metaDescription:
        "About Strata Cost Consulting: a senior led commercial and cost consultancy with client side and contractor side experience and claims expertise in leadership.",
    },
  });

  tx.createOrReplace({
    _id: "page-services",
    _type: "page",
    title: "Services",
    slug: slug("services"),
    hero: {
      eyebrow: "Services",
      heading: "Four service lines, one standard",
      lede: "Pre-contract, post-contract, claims and bank monitoring: distinct services with the same senior oversight and the same insistence on evidence.",
    },
    sections: [
      {
        _type: "serviceMatrix",
        _key: "sv1",
        eyebrow: "Coverage",
        heading: "Services across our sectors",
        intro: "Every marked intersection is a service we deliver today, with named senior leadership behind it.",
      },
      {
        _type: "ctaBand",
        _key: "sv2",
        cta: {
          _type: "cta",
          heading: "Not sure which service fits?",
          text: "Describe the situation and we will tell you honestly what it needs, even where that is not us.",
          link: internalLink("Start a conversation", "page-contact"),
        },
      },
    ],
    seo: {
      _type: "seo",
      metaDescription:
        "Strata Cost Consulting services: pre-contract, post-contract commercial management, claims and bank monitoring.",
    },
  });

  tx.createOrReplace({
    _id: "page-sectors",
    _type: "page",
    title: "Sectors",
    slug: slug("sectors"),
    hero: {
      eyebrow: "Sectors",
      heading: "Five clusters, chosen deliberately",
      lede: "A diversified sector strategy balancing high margin specialist work, high volume cyclical work and economically resilient dispute work.",
    },
    sections: [
      {
        _type: "ctaBand",
        _key: "se1",
        cta: {
          _type: "cta",
          heading: "Working in one of these markets?",
          text: "Talk to a team that already knows the terrain.",
          link: internalLink("Start a conversation", "page-contact"),
        },
      },
    ],
    seo: {
      _type: "seo",
      metaDescription:
        "Sectors served by Strata Cost Consulting: social housing, social housing claims, infrastructure, contracting and bank monitoring.",
    },
  });

  tx.createOrReplace({
    _id: "page-projects",
    _type: "page",
    title: "Projects",
    slug: slug("projects"),
    hero: {
      eyebrow: "Projects",
      heading: "Work that stands up to scrutiny",
      lede: "A selection of commissions across our sectors and services. Filter by either to see the relevant track record.",
    },
    sections: [],
    seo: {
      _type: "seo",
      metaDescription:
        "Selected projects by Strata Cost Consulting across social housing, infrastructure, contracting and bank monitoring.",
    },
  });

  tx.createOrReplace({
    _id: "page-people",
    _type: "page",
    title: "People",
    slug: slug("people"),
    hero: {
      eyebrow: "People",
      heading: "Senior people, doing the work",
      lede: "The team is deliberately senior heavy. These are the people who will actually be on your commission.",
    },
    sections: [],
    seo: {
      _type: "seo",
      metaDescription: "Meet the Strata Cost Consulting team.",
    },
  });

  tx.createOrReplace({
    _id: "page-insights",
    _type: "page",
    title: "Insights",
    slug: slug("insights"),
    hero: {
      eyebrow: "Insights",
      heading: "Thinking you can use",
      lede: "Market analysis and practical guidance from the team, written for people who run programmes rather than read brochures.",
    },
    sections: [],
    seo: {
      _type: "seo",
      metaDescription:
        "Insights from Strata Cost Consulting on the QS market, social housing delivery, bank monitoring and claims.",
    },
  });

  tx.createOrReplace({
    _id: "page-careers",
    _type: "page",
    title: "Careers",
    slug: slug("careers"),
    hero: {
      eyebrow: "Careers",
      heading: "Do your best work earlier",
      lede: "We are scaling to a team of 20 and beyond within two years. That growth is built on people who want responsibility sooner than a large consultancy would give it to them.",
    },
    sections: [
      {
        _type: "richTextSection",
        _key: "ca1",
        eyebrow: "Why join",
        heading: "The case for Strata",
        content: pt(
          "car",
          "## Progression without the queue",
          "If you are a high performing quantity surveyor inside a large national consultancy, you already know the trade: brand and frameworks in exchange for compliance driven work and a slow ladder. Strata offers the opposite deal. Senior exposure from day one, direct client relationships, and progression measured by capability rather than tenure.",
          "## The work itself",
          "Claims and disputes prepared to adjudication standard. Live commercial management across social housing, infrastructure and contracting. Bank monitoring at portfolio scale, with structured training for junior staff under genuine senior review. The mix is deliberate: breadth early, specialism when you have seen enough to choose one.",
          "## How we develop people",
          "Clear progression pathways, senior mentorship, a structured training and development programme, exposure to the management of high value projects and competitive remuneration. Those are the plan's words; in practice it means you sit in the meetings that matter and your work goes in front of clients with your name on it.",
          "## Who we are looking for",
          "High performing quantity surveyors from large national consultancies seeking accelerated progression, claims specialists who want their expertise to lead rather than support, and junior surveyors who want a proper training ground in bank monitoring and post contract work.",
        ),
      },
      {
        _type: "quoteBand",
        _key: "ca2",
        quote: quoteOf(
          "The people we hire are the growth plan. There is no version of Strata's success that does not run through them.",
          "Sean Ellison",
          "Managing Director",
          P.ellison,
        ),
      },
      {
        _type: "ctaBand",
        _key: "ca3",
        cta: {
          _type: "cta",
          heading: "Start the conversation",
          text: "No live vacancy list, no portal. Send a CV or just an introduction; a director reads every one.",
          link: internalLink("Get in touch", "page-contact"),
        },
      },
    ],
    seo: {
      _type: "seo",
      metaDescription:
        "Careers at Strata Cost Consulting: accelerated progression for quantity surveyors and claims specialists, with senior mentorship and structured training.",
    },
  });

  tx.createOrReplace({
    _id: "page-contact",
    _type: "page",
    title: "Contact",
    slug: slug("contact"),
    hero: {
      eyebrow: "Contact",
      heading: "Start a conversation",
      lede: "Tell us about the scheme, the dispute or the portfolio. A director will come back to you, usually the same working day.",
    },
    sections: [],
    seo: {
      _type: "seo",
      metaDescription:
        "Contact Strata Cost Consulting. A director responds to every enquiry, usually the same working day.",
    },
  });

  tx.createOrReplace({
    _id: "page-privacy",
    _type: "page",
    title: "Privacy and cookies",
    slug: slug("privacy"),
    hero: {
      eyebrow: "Legal",
      heading: "Privacy and cookies",
      lede: "How we handle personal information on this website, in plain language.",
    },
    sections: [
      {
        _type: "richTextSection",
        _key: "pr1",
        content: pt(
          "prv",
          "## Who we are",
          "Strata Cost Consulting (SCC) is the controller of personal information collected through this website. You can contact us about privacy matters through the contact page.",
          "## What we collect and why",
          "If you submit the enquiry form we collect your name, contact details, organisation and the content of your message. We use this information to respond to your enquiry, on the lawful basis of legitimate interests. Enquiry emails are delivered through our email service provider and retained only as long as needed to handle the enquiry and any engagement that follows.",
          "## Cookies and analytics",
          "This website uses cookieless, privacy respecting analytics that do not identify individual visitors, do not use cookies and do not track you across websites. Because no consent-requiring technologies are used, no cookie banner is needed.",
          "## Your rights",
          "Under UK GDPR you have rights of access, rectification, erasure, restriction and objection in respect of your personal information. To exercise any of them, contact us through the contact page. You also have the right to complain to the Information Commissioner's Office at ico.org.uk.",
          "## Changes",
          "We will update this notice if our practices change, and the date of the current version will always be shown by the page's last update.",
        ),
      },
    ],
    seo: {
      _type: "seo",
      metaDescription: "Privacy and cookies notice for the Strata Cost Consulting website.",
      noIndex: false,
    },
  });

  tx.createOrReplace({
    _id: "page-terms",
    _type: "page",
    title: "Terms of use",
    slug: slug("terms"),
    hero: {
      eyebrow: "Legal",
      heading: "Terms of use",
      lede: "The terms on which this website is provided.",
    },
    sections: [
      {
        _type: "richTextSection",
        _key: "tm1",
        content: pt(
          "trm",
          "## Use of this website",
          "This website is provided by Strata Cost Consulting (SCC) for general information about our services. By using it you accept these terms. If you do not accept them, please do not use the website.",
          "## No professional advice",
          "Content on this website, including insights articles, is general commentary. It is not commercial, legal or professional advice and must not be relied upon as such. Advice is provided only under an agreed engagement with defined scope and terms.",
          "## No engagement by browsing",
          "Nothing on this website creates a consultant and client relationship. An engagement exists only once a written appointment or terms of engagement have been agreed and any conflict check has been completed.",
          "## Intellectual property",
          "The Strata Cost Consulting name, logo and the content of this website are our property or used with permission. You may view and print pages for your own reference; any other reproduction requires our written consent.",
          "## Accuracy and availability",
          "We keep the website's content under review but do not warrant that it is complete, current or error free, or that the website will be available without interruption. Market figures are cited with their sources and speak as at their stated dates.",
          "## Liability",
          "To the extent permitted by law, we accept no liability for loss arising from reliance on this website's content. Nothing in these terms excludes liability that cannot be excluded by law.",
          "## Governing law",
          "These terms are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.",
        ),
      },
    ],
    seo: {
      _type: "seo",
      metaDescription: "Terms of use for the Strata Cost Consulting website.",
    },
  });

  tx.createOrReplace({
    _id: "page-accessibility",
    _type: "page",
    title: "Accessibility",
    slug: slug("accessibility"),
    hero: {
      eyebrow: "Legal",
      heading: "Accessibility",
      lede: "This website is designed to be usable by everyone.",
    },
    sections: [
      {
        _type: "richTextSection",
        _key: "ac1",
        content: pt(
          "acc",
          "## Our commitment",
          "We build to the Web Content Accessibility Guidelines (WCAG) 2.2 level AA. The website is tested with automated audits and manual keyboard and screen reader checks as part of every release.",
          "## What that means in practice",
          "Every page can be navigated by keyboard alone, with a visible focus indicator and a skip link to the main content. Text contrast meets or exceeds AA ratios throughout. All motion and animation respects your operating system's reduced motion preference, and no content requires JavaScript to read. Images carry text alternatives, forms have visible labels with clear error messages, and the site works at 400% zoom.",
          "## Known limitations",
          "Placeholder artwork is used where project photography is awaited; it is decorative and marked accordingly.",
          "## Tell us if something is not working",
          "If any part of this website is difficult to use with your assistive technology, contact us through the contact page or email enquiries@stratacc.com and we will fix it or provide the content in another format.",
        ),
      },
    ],
    seo: {
      _type: "seo",
      metaDescription:
        "Accessibility statement for the Strata Cost Consulting website: WCAG 2.2 AA, keyboard navigable, reduced motion support.",
    },
  });

  const result = await tx.commit();
  console.log(`Seeded ${result.results.length} documents.`);
  console.log("Re-run `npm run seed` at any time to reset content to this state.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

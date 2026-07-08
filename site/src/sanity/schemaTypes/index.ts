import type { SchemaTypeDefinition } from "sanity";
import { article } from "./documents/article";
import { page } from "./documents/page";
import { person } from "./documents/person";
import { project } from "./documents/project";
import { sector } from "./documents/sector";
import { service } from "./documents/service";
import { siteSettings } from "./documents/siteSettings";
import { blockContent } from "./objects/blockContent";
import { cta } from "./objects/cta";
import { link } from "./objects/link";
import { quote } from "./objects/quote";
import { sectionTypes } from "./objects/sections";
import { seo } from "./objects/seo";
import { stat } from "./objects/stat";

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  siteSettings,
  page,
  service,
  sector,
  project,
  person,
  article,
  // objects
  seo,
  link,
  stat,
  quote,
  cta,
  blockContent,
  ...sectionTypes,
];

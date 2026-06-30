import { type SchemaTypeDefinition } from "sanity";

import {
  aboutPage,
  contactPage,
  faqPage,
  homePage,
  pricingPage,
  specialtiesPage,
} from "./documents/pages";
import { post } from "./documents/post";
import { siteSettings } from "./documents/siteSettings";
import { specialty } from "./documents/specialty";
import {
  credentialGroup,
  credentialItem,
  faqItem,
  feeItem,
  processStep,
  quoteSection,
  therapySpaceSection,
} from "./objects/pageObjects";
import {
  address,
  cta,
  imageWithAlt,
  pageHeader,
  simplePortableText,
} from "./objects/shared";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    address,
    cta,
    imageWithAlt,
    pageHeader,
    simplePortableText,
    credentialItem,
    credentialGroup,
    processStep,
    feeItem,
    faqItem,
    therapySpaceSection,
    quoteSection,
    siteSettings,
    homePage,
    aboutPage,
    specialtiesPage,
    pricingPage,
    contactPage,
    faqPage,
    specialty,
    post,
  ],
};

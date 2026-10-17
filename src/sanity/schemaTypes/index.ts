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
  reimbursementGuideItem,
  therapySpaceSection,
} from "./objects/pageObjects";
import {
  address,
  cta,
  externalProfile,
  imageWithAlt,
  pageHeader,
  simplePortableText,
} from "./objects/shared";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    address,
    cta,
    externalProfile,
    imageWithAlt,
    pageHeader,
    simplePortableText,
    credentialItem,
    credentialGroup,
    processStep,
    feeItem,
    reimbursementGuideItem,
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

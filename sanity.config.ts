"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const singletonTypes = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "specialtiesPage",
  "pricingPage",
  "contactPage",
  "faqPage",
]);

const studioPlugins = [
  structureTool({ structure }),
  ...(process.env.NODE_ENV === "production"
    ? []
    : [
        // Vision is for querying with GROQ from inside the Studio.
        // Keep it out of production unless an authoring need explicitly changes.
        visionTool({ defaultApiVersion: apiVersion }),
      ]),
];

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((template) => !singletonTypes.has(template.templateId)),
  },
  plugins: studioPlugins,
});

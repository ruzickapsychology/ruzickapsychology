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

export const isStudioConfigured = Boolean(projectId && dataset && apiVersion);

const studioEnv =
  projectId && dataset && apiVersion
    ? { apiVersion, dataset, projectId }
    : null;

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
  ...(process.env.NODE_ENV === "production" || !studioEnv
    ? []
    : [
        // Vision is for querying with GROQ from inside the Studio.
        // Keep it out of production unless an authoring need explicitly changes.
        visionTool({ defaultApiVersion: studioEnv.apiVersion }),
      ]),
];

export default studioEnv
  ? defineConfig({
      basePath: "/studio",
      projectId: studioEnv.projectId,
      dataset: studioEnv.dataset,
      // Add and edit the content schema in the './sanity/schemaTypes' folder
      schema,
      document: {
        newDocumentOptions: (prev) =>
          prev.filter((template) => !singletonTypes.has(template.templateId)),
      },
      plugins: studioPlugins,
    })
  : null;

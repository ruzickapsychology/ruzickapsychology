import type { MetadataRoute } from "next";
import { BLOG_PAGE_SIZE } from "@/data/blog";
import { getSitemapEntries } from "@/data/cms";
import {
  getServiceDefinitionByDocumentId,
  serviceHref,
} from "@/config/services";
import { SITE_URL } from "@/config/site";
import {
  getResearchLastModified,
  getResearchPages,
  researchPath,
} from "@/data/research";

const pagePaths: Record<string, string> = {
  homePage: "",
  aboutPage: "/about",
  specialtiesPage: "/specialties",
  pricingPage: "/pricing",
  faqPage: "/faq",
  contactPage: "/contact",
  resourcesPage: "/resources",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  if (!entries) {
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
      },
    ];
  }

  const routes: MetadataRoute.Sitemap = entries.pages.map((page) => {
    const path = pagePaths[page._id] ?? "";
    return {
      url: `${SITE_URL}${path}`,
      lastModified: new Date(page._updatedAt),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    };
  });

  const posts = entries.posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
  const latestPostUpdate = entries.posts.reduce<Date | undefined>(
    (latest, post) => {
      const updatedAt = new Date(post._updatedAt);
      return !latest || updatedAt > latest ? updatedAt : latest;
    },
    undefined,
  );

  routes.push({
    url: `${SITE_URL}/blog`,
    ...(latestPostUpdate ? { lastModified: latestPostUpdate } : {}),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  const archivePageCount = Math.ceil(entries.posts.length / BLOG_PAGE_SIZE);
  for (let page = 2; page <= archivePageCount; page++) {
    routes.push({
      url: `${SITE_URL}/blog/page/${page}`,
      ...(latestPostUpdate ? { lastModified: latestPostUpdate } : {}),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  routes.push({
    url: `${SITE_URL}/privacy`,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  });

  const services = entries.services.flatMap((service) => {
    const definition = getServiceDefinitionByDocumentId(service._id);
    if (!definition) return [];
    return [
      {
        url: `${SITE_URL}${serviceHref(definition.slug)}`,
        lastModified: new Date(service._updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
    ];
  });

  // Research pages are code-owned: their content is generated from public
  // data by research/<slug>/build.py, not stored in Sanity.
  const researchLastModified = getResearchLastModified();
  const research = [
    {
      url: `${SITE_URL}/research`,
      ...(researchLastModified
        ? { lastModified: new Date(`${researchLastModified}T00:00:00Z`) }
        : {}),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...getResearchPages().map((page) => ({
      url: `${SITE_URL}${researchPath(page.slug)}`,
      lastModified: new Date(`${page.dateModified}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];

  return [...routes, ...services, ...research, ...posts];
}

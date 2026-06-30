import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/cms";
import { SITE_URL } from "@/lib/site-defaults";

const pagePaths: Record<string, string> = {
  homePage: "",
  aboutPage: "/about",
  specialtiesPage: "/specialties",
  pricingPage: "/pricing",
  faqPage: "/faq",
  contactPage: "/contact",
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

  const routes = entries.pages.map((page) => {
    const path = pagePaths[page._id] ?? "";
    return {
      url: `${SITE_URL}${path}`,
      lastModified: new Date(page._updatedAt),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    };
  });

  routes.push({
    url: `${SITE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });

  const posts = entries.posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...routes, ...posts];
}

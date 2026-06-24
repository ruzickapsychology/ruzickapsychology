import type { MetadataRoute } from "next";
import { getAllPostMeta } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-defaults";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/specialties", "/pricing", "/faq", "/contact", "/blog"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const posts = (await getAllPostMeta()).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...routes, ...posts];
}

import type { Metadata } from "next";
import { pageMetadata } from "@/config/seo";
import { getBlogPageCount, getPostMetaPage } from "@/data/blog";
import { getAboutPage } from "@/data/cms";
import { BlogIndexPage } from "@/page-modules/blog-index";

export const metadata: Metadata = pageMetadata({
  title: "Psychology & Relationship Insights",
  description:
    "Articles from Dr. Christina Ruzicka on relationships, emotional patterns, therapy, and meaningful change.",
  path: "/blog",
});

export default async function BlogIndexRoute() {
  const [posts, totalPages, about] = await Promise.all([
    getPostMetaPage(1),
    getBlogPageCount(),
    getAboutPage(),
  ]);

  return (
    <BlogIndexPage
      posts={posts}
      page={1}
      totalPages={totalPages}
      about={about}
    />
  );
}

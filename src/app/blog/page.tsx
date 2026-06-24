import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getBlogPageCount, getPostMetaPage } from "@/lib/blog";
import { BlogIndex } from "./blog-index";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Reflections from the practice.",
  path: "/blog",
});

export default function Blog() {
  return (
    <BlogIndex
      posts={getPostMetaPage(1)}
      page={1}
      totalPages={getBlogPageCount()}
    />
  );
}

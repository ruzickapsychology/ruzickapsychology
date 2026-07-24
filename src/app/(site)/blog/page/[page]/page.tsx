import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBlogPageCount,
  getBlogPageCountForBuild,
  getPostMetaPage,
} from "@/data/blog";
import { pageMetadata } from "@/config/seo";
import { BlogIndexPage } from "@/page-modules/blog-index";

export const dynamicParams = false;

export async function generateStaticParams() {
  const totalPages = await getBlogPageCountForBuild();
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata(
  props: PageProps<"/blog/page/[page]">,
): Promise<Metadata> {
  const { page } = await props.params;
  return pageMetadata({
    title: `Psychology & Relationship Insights - Page ${page}`,
    description: `Browse page ${page} of articles from Dr. Christina Ruzicka on relationships, emotional patterns, therapy, and meaningful change.`,
    path: `/blog/page/${page}`,
  });
}

export default async function PaginatedBlogRoute(
  props: PageProps<"/blog/page/[page]">,
) {
  const { page } = await props.params;
  const currentPage = Number(page);
  const totalPages = await getBlogPageCount();

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 2 ||
    currentPage > totalPages
  ) {
    notFound();
  }

  const posts = await getPostMetaPage(currentPage);

  return (
    <BlogIndexPage posts={posts} page={currentPage} totalPages={totalPages} />
  );
}

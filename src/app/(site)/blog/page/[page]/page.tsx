import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "../../blog-index";
import {
  getBlogPageCount,
  getBlogPageCountForBuild,
  getPostMetaPage,
} from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

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
    title: `Blog - Page ${page}`,
    description: "Reflections from the practice.",
    path: `/blog/page/${page}`,
  });
}

export default async function BlogPage(props: PageProps<"/blog/page/[page]">) {
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

  return (
    <BlogIndex
      posts={await getPostMetaPage(currentPage)}
      page={currentPage}
      totalPages={totalPages}
    />
  );
}

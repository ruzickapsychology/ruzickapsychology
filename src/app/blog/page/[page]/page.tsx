import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "../../blog-index";
import { getBlogPageCount, getPostMetaPage } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: getBlogPageCount() - 1 }, (_, i) => ({
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
  const totalPages = getBlogPageCount();

  if (!Number.isInteger(currentPage) || currentPage < 2 || currentPage > totalPages) {
    notFound();
  }

  return (
    <BlogIndex
      posts={getPostMetaPage(currentPage)}
      page={currentPage}
      totalPages={totalPages}
    />
  );
}

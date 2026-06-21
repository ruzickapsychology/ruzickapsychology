import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";
import { getAllPostMeta, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPostMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPost(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <Container size="md" className="py-20">
      <article>
        <h1>{post.title}</h1>
        <div
          className="prose mt-10"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
      <Link
        href="/blog"
        className="mt-12 inline-block text-rose-dark underline-offset-4 transition hover:text-ink hover:underline"
      >
        ← Back to Blog
      </Link>
    </Container>
  );
}

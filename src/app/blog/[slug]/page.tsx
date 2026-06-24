import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";
import {
  formatPostDate,
  getAllPostMeta,
  getOlderPostMeta,
  getPost,
} from "@/lib/blog";

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
  const olderPost = getOlderPostMeta(slug);

  return (
    <div className="rp-fade pb-24 pt-32">
      <Container size="md">
        <Link
          href="/blog"
          className="mono-label mb-10 inline-block border-b border-accent pb-1 normal-case tracking-[0.06em] text-accent transition-colors hover:text-fg"
        >
          ← Back to Blog
        </Link>
        <article>
          <p className="mono-label mb-8 normal-case tracking-[0.08em] text-body/65">
            {formatPostDate(post.date)} · {post.readTime}
          </p>
          <h1 className="heading-section">{post.title}</h1>
          <div
            className="prose mt-10"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
        <nav className="mt-12 flex flex-col gap-5 border-t border-muted pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/blog"
            className="mono-label inline-block border-b border-accent pb-1 normal-case tracking-[0.06em] text-accent transition-colors hover:text-fg"
          >
            ← Back to Blog
          </Link>
          {olderPost && (
            <Link
              href={`/blog/${olderPost.slug}`}
              className="mono-label inline-block max-w-[320px] border-b border-accent pb-1 normal-case tracking-[0.06em] text-accent transition-colors hover:text-fg sm:text-right"
            >
              {olderPost.title} →
            </Link>
          )}
        </nav>
      </Container>
    </div>
  );
}

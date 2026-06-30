import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PortableContent } from "@/components/ui/portable-content";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";
import {
  formatPostDate,
  getOlderPostMeta,
  getPost,
  getPostSlugsForBuild,
} from "@/lib/blog";

export async function generateStaticParams() {
  return (await getPostSlugsForBuild()).map((slug) => ({ slug }));
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
  const olderPost = await getOlderPostMeta(slug);

  return (
    <div className="rp-fade">
      <Section size="page">
        <Container size="md">
          <Link
            href="/blog"
            className="mono-label border-accent text-accent hover:text-fg mb-10 inline-block border-b pb-1 tracking-[0.06em] normal-case transition-colors"
          >
            ← Back to Blog
          </Link>
          <article>
            <p className="mono-label text-body/65 mb-8 tracking-[0.08em] normal-case">
              {formatPostDate(post.date)} · {post.readTime}
            </p>
            <h1 className="heading-section">{post.title}</h1>
            <PortableContent value={post.body} className="prose mt-10" />
          </article>
          <nav
            aria-label="Blog post navigation"
            className="border-muted mt-12 flex flex-col gap-5 border-t pt-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <Link
              href="/blog"
              className="mono-label border-accent text-accent hover:text-fg inline-block border-b pb-1 tracking-[0.06em] normal-case transition-colors"
            >
              ← Back to Blog
            </Link>
            {olderPost && (
              <Link
                href={`/blog/${olderPost.slug}`}
                className="mono-label border-accent text-accent hover:text-fg inline-block max-w-[320px] border-b pb-1 tracking-[0.06em] normal-case transition-colors sm:text-right"
              >
                {olderPost.title} →
              </Link>
            )}
          </nav>
        </Container>
      </Section>
    </div>
  );
}

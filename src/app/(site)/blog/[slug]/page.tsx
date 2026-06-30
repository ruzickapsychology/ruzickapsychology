import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PortableContent } from "@/components/ui/portable-content";
import { Section } from "@/components/ui/section";
import { TextLink } from "@/components/ui/text-link";
import { pageMetadata } from "@/lib/seo";
import {
  formatPostDate,
  getOlderPostMeta,
  getPost,
  getPostSlugsForBuild,
} from "@/lib/blog";
import styles from "./styles.module.css";

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
    <div className={styles.root}>
      <Section size="page">
        <Container size="md">
          <TextLink href="/blog" direction="back" className={styles.backLink}>
            Back to Blog
          </TextLink>
          <article>
            <p className={styles.meta}>
              {formatPostDate(post.date)} · {post.readTime}
            </p>
            <h1 className={styles.title}>{post.title}</h1>
            <PortableContent value={post.body} className={styles.body} />
          </article>
          <nav aria-label="Blog post navigation" className={styles.postNav}>
            <TextLink href="/blog" direction="back">
              Back to Blog
            </TextLink>
            {olderPost && (
              <TextLink
                href={`/blog/${olderPost.slug}` as Route}
                className={styles.olderLink}
              >
                {olderPost.title}
              </TextLink>
            )}
          </nav>
        </Container>
      </Section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";
import { getAllPostMeta } from "@/lib/blog";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Reflections from the practice.",
  path: "/blog",
});

export default function Blog() {
  const posts = getAllPostMeta();
  return (
    <Section tone="default">
      <Container size="md">
        <h1>Blog</h1>
        <div className="mt-12 space-y-10">
          {posts.map((post) => (
            <article key={post.slug}>
              <h2>
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition hover:text-accent"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 leading-relaxed">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3 inline-block text-accent underline-offset-4 transition hover:text-fg hover:underline"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
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
    <Container size="md" className="py-20">
      <h1>Blog</h1>
      <div className="mt-12 space-y-10">
        {posts.map((post) => (
          <article key={post.slug}>
            <h2>
              <Link
                href={`/blog/${post.slug}`}
                className="transition hover:text-rose-dark"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 leading-relaxed">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-3 inline-block text-rose-dark underline-offset-4 transition hover:text-ink hover:underline"
            >
              Read More →
            </Link>
          </article>
        ))}
      </div>
    </Container>
  );
}

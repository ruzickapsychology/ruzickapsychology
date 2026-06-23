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
    <div className="rp-fade pb-24 pt-32">
      <Container size="md">
        <p className="eyebrow">Reflections</p>
        <h1 className="mt-4">Blog</h1>
        <div className="mt-12 space-y-10">
          {posts.map((post) => (
            <article key={post.slug} className="border-t border-muted pt-8">
              <h2 className="text-[28px]">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 leading-relaxed">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mono-label mt-4 inline-block border-b border-accent pb-1 text-[12.5px] normal-case tracking-[0.06em] text-accent transition-colors hover:text-fg"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}

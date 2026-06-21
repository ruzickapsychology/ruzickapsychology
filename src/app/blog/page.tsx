import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Ruzicka Psychology PLLC",
  description: "Reflections from the practice.",
};

export default function Blog() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
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
    </div>
  );
}

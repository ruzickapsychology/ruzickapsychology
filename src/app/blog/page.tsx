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
      <h1 className="text-4xl">Blog</h1>
      <div className="mt-12 space-y-10">
        {posts.map((post) => (
          <article key={post.slug}>
            <h2 className="text-2xl">
              <Link
                href={`/blog/${post.slug}`}
                className="transition hover:text-rose"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 leading-relaxed">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-3 inline-block text-rose underline-offset-4 transition hover:text-rose-dark hover:underline"
            >
              Read More →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

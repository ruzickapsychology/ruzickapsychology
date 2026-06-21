import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Ruzicka Psychology PLLC`, description: post.excerpt };
}

export default async function BlogPost(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl">{post.title}</h1>
      <div className="mt-10 space-y-6 leading-relaxed">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <Link
        href="/blog"
        className="mt-12 inline-block text-rose underline-offset-4 transition hover:text-rose-dark hover:underline"
      >
        ← Back to Blog
      </Link>
    </article>
  );
}

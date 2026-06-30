import type { RawPostMeta, RichText } from "@/lib/cms";
import {
  getSanityPost,
  getSanityPostMeta,
  getSanityPostMetaStrict,
  getSanityPostSlugsStrict,
} from "@/lib/cms";

export const BLOG_PAGE_SIZE = 10;

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
};

export type Post = PostMeta & { body: RichText };

function readingTime(content: string) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~\-[\]()]/g, " ");
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function readingTimeFromText(parts: readonly (string | null)[] | undefined) {
  return readingTime(parts?.join(" ") ?? "");
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function normalizeSanityDate(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

function sanityPostMeta(post: {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  bodyText?: Array<string | null>;
}): PostMeta {
  return {
    slug: post.slug,
    title: post.title,
    date: normalizeSanityDate(post.publishedAt),
    excerpt: post.excerpt,
    readTime: readingTimeFromText(post.bodyText),
  };
}

function normalizePostMetaList(posts: RawPostMeta[] | null | undefined) {
  return posts?.map(sanityPostMeta) ?? [];
}

export async function getAllPostMeta(): Promise<PostMeta[]> {
  return normalizePostMetaList(await getSanityPostMeta());
}

export async function getAllPostMetaStrict(): Promise<PostMeta[]> {
  return normalizePostMetaList(await getSanityPostMetaStrict());
}

export async function getPostSlugsForBuild() {
  return (await getSanityPostSlugsStrict()).map((post) => post.slug);
}

export async function getBlogPageCountForBuild() {
  return Math.max(
    1,
    Math.ceil((await getAllPostMetaStrict()).length / BLOG_PAGE_SIZE),
  );
}

export async function getBlogPageCount() {
  return Math.max(
    1,
    Math.ceil((await getAllPostMeta()).length / BLOG_PAGE_SIZE),
  );
}

export async function getPostMetaPage(page: number) {
  const posts = await getAllPostMeta();
  const start = (page - 1) * BLOG_PAGE_SIZE;
  return posts.slice(start, start + BLOG_PAGE_SIZE);
}

export async function getOlderPostMeta(slug: string) {
  const posts = await getAllPostMeta();
  const currentIndex = posts.findIndex((post) => post.slug === slug);
  if (currentIndex === -1) return null;
  return posts[currentIndex + 1] ?? null;
}

export async function getPost(slug: string): Promise<Post | null> {
  const sanityPost = await getSanityPost(slug);
  if (sanityPost) {
    return {
      ...sanityPostMeta(sanityPost),
      body: sanityPost.body,
    };
  }

  return null;
}

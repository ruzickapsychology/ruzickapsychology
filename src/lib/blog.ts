import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
export const BLOG_PAGE_SIZE = 10;

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
};

export type Post = PostMeta & { html: string };

function readFile(slug: string) {
  return matter(fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), "utf8"));
}

function normalizeDate(date: unknown) {
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  return String(date);
}

function readingTime(content: string) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~\-[\]()]/g, " ");
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function getAllPostMeta(): PostMeta[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = readFile(slug);
      const meta = data as Omit<PostMeta, "slug" | "readTime">;
      return {
        slug,
        ...meta,
        date: normalizeDate(meta.date),
        readTime: readingTime(content),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPageCount() {
  return Math.max(1, Math.ceil(getAllPostMeta().length / BLOG_PAGE_SIZE));
}

export function getPostMetaPage(page: number) {
  const posts = getAllPostMeta();
  const start = (page - 1) * BLOG_PAGE_SIZE;
  return posts.slice(start, start + BLOG_PAGE_SIZE);
}

export function getOlderPostMeta(slug: string) {
  const posts = getAllPostMeta();
  const currentIndex = posts.findIndex((post) => post.slug === slug);
  if (currentIndex === -1) return null;
  return posts[currentIndex + 1] ?? null;
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = readFile(slug);
  const processed = await remark().use(html).process(content);
  const meta = data as Omit<PostMeta, "slug" | "readTime">;
  return {
    slug,
    ...meta,
    date: normalizeDate(meta.date),
    readTime: readingTime(content),
    html: processed.toString(),
  };
}

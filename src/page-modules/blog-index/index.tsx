import Link from "next/link";
import type { Route } from "next";
import { ContentSection } from "@/components/content-section";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
} from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { PageShell } from "@/components/page-shell";
import { Eyebrow, Heading, Text } from "@/components/typography";
import type { PostMeta } from "@/data/blog";
import { formatPostDate } from "@/lib/format-post-date";
import styles from "./styles.module.css";

function pageHref(page: number): Route {
  return page === 1 ? "/blog" : (`/blog/page/${page}` as Route);
}

export function BlogIndexPage({
  posts,
  page,
  totalPages,
}: {
  posts: PostMeta[];
  page: number;
  totalPages: number;
}) {
  return (
    <PageShell>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Blog</PageHeaderTitle>
        </PageHeaderContent>
      </PageHeader>
      <ContentSection size="spacious" containerSize="md">
        <div>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              aria-label={`Read ${post.title}`}
              className={styles.postLink}
            >
              <div className={styles.postInner}>
                <div>
                  <Eyebrow variant="meta" tone="subdued">
                    {formatPostDate(post.date)} · {post.readTime}
                  </Eyebrow>
                  <Heading as="h2" size="item" className={styles.title}>
                    {post.title}
                  </Heading>
                  <Text className={styles.excerpt}>{post.excerpt}</Text>
                </div>
                <Eyebrow
                  as="span"
                  variant="meta"
                  tone="accent"
                  className={styles.arrow}
                  aria-hidden
                >
                  →
                </Eyebrow>
              </div>
            </Link>
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          hrefForPage={pageHref}
        />
      </ContentSection>
    </PageShell>
  );
}

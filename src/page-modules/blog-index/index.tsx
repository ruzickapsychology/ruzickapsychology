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
import { AuthorCard } from "@/components/author-card";
import { JsonLd } from "@/components/json-ld";
import { lastReviewedFor } from "@/config/review-dates";
import { reviewedPageJsonLd } from "@/config/seo";
import { PRACTITIONER_LICENSE } from "@/config/site";
import type { AboutPageContent } from "@/data/cms";

function pageHref(page: number): Route {
  return page === 1 ? "/blog" : (`/blog/page/${page}` as Route);
}

/** "Reviewed by" card + CollectionPage reviewedBy on /blog (page 1 only): user instruction 23 Nov 2026 ("fix it all"). */
export function BlogIndexPage({
  posts,
  page,
  totalPages,
  about = null,
}: {
  posts: PostMeta[];
  page: number;
  totalPages: number;
  about?: AboutPageContent | null;
}) {
  return (
    <PageShell>
      {about?.heading ? (
        <JsonLd
          data={reviewedPageJsonLd({
            path: "/blog",
            name: "Blog",
            type: "CollectionPage",
          })}
        />
      ) : null}
      <PageHeader>
        <PageHeaderContent variant="overview">
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
      {about?.heading ? (
        <ContentSection size="compact" containerSize="md">
          <AuthorCard
            label="Reviewed by"
            aria-label="Page reviewer"
            name={about.heading}
            credentials={about.credentials}
            license={PRACTITIONER_LICENSE.label}
            reviewedOn={lastReviewedFor("/blog")}
            image={about.portraitImage}
            href="/about"
          />
        </ContentSection>
      ) : null}
    </PageShell>
  );
}

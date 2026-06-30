import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatPostDate, type PostMeta } from "@/lib/blog";
import styles from "./blog-index.module.css";

function pageHref(page: number) {
  return page === 1 ? "/blog" : (`/blog/page/${page}` as const);
}

export function BlogIndex({
  posts,
  page,
  totalPages,
}: {
  posts: PostMeta[];
  page: number;
  totalPages: number;
}) {
  return (
    <div className={styles.root}>
      <Section size="page">
        <Container size="md">
          <div className={styles.header}>
            <h1>Blog</h1>
          </div>
          <div className={styles.list}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                aria-label={`Read ${post.title}`}
                className={styles.postLink}
              >
                <div className={styles.postInner}>
                  <div>
                    <p className={styles.meta}>
                      {formatPostDate(post.date)} · {post.readTime}
                    </p>
                    <h2 className={styles.title}>{post.title}</h2>
                    <p className={styles.excerpt}>{post.excerpt}</p>
                  </div>
                  <span className={styles.arrow} aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Blog pagination" className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`${styles.paginationLink} ${
                    n === page ? styles.paginationLinkActive : ""
                  }`}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </Container>
      </Section>
    </div>
  );
}

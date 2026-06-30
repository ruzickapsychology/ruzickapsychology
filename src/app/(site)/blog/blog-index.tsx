import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { formatPostDate, type PostMeta } from "@/lib/blog";

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
    <div className="rp-fade">
      <Section size="page">
        <Container size="md">
          <div className="text-center">
            <h1>Blog</h1>
          </div>
          <div className="mt-12">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                aria-label={`Read ${post.title}`}
                className="rp-q group border-muted last:border-muted block border-t px-2 py-8 transition-colors last:border-b sm:px-6"
              >
                <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
                  <div>
                    <p className="mono-label text-body/65 tracking-[0.08em] normal-case">
                      {formatPostDate(post.date)} · {post.readTime}
                    </p>
                    <h2 className="heading-item group-hover:text-accent mt-3 transition-colors">
                      {post.title}
                    </h2>
                    <p className="body-2 mt-3">{post.excerpt}</p>
                  </div>
                  <span
                    className="mono-label text-accent group-hover:text-fg justify-self-start text-[13px] leading-none transition-colors sm:justify-self-end"
                    aria-hidden
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Blog pagination"
              className="mt-12 flex items-center justify-center gap-5"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`mono-label border-b pb-1 tracking-[0.06em] normal-case transition-colors ${
                    n === page
                      ? "border-accent text-accent"
                      : "text-body hover:text-accent border-transparent"
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

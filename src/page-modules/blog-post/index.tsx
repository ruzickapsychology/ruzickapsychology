import type { Route } from "next";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import { CtaSection } from "@/components/cta-section";
import { getAvailabilityCtaContent } from "@/config/availability";
import type { HomePageContent, SiteSettings } from "@/data/cms";
import { ContentSection } from "@/components/content-section";
import { EditorialLinkCard } from "@/components/editorial-link-card";
import { JsonLd } from "@/components/json-ld";
import {
  PageHeader,
  PageHeaderBreadcrumbs,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { PortableContent } from "@/components/portable-content";
import { Stack } from "@/components/stack";
import { TextLink } from "@/components/text-link";
import { Heading, Text } from "@/components/typography";
import { blogPostJsonLd } from "@/config/seo";
import type { Post, PostMeta } from "@/data/blog";
import { formatPostDate } from "@/lib/format-post-date";
import styles from "./styles.module.css";

type RelatedServiceLink = {
  href: Route;
  label: string;
  description: string;
};

export function BlogPostPage({
  post,
  olderPost,
  serviceLink,
  ctaContent,
  site,
}: {
  post: Post;
  olderPost: PostMeta | null;
  serviceLink?: RelatedServiceLink;
  ctaContent?: HomePageContent["cta"];
  site?: SiteSettings | null;
}) {
  const cta = site
    ? getAvailabilityCtaContent({
        status: site.availabilityStatus,
        messaging: site.availabilityMessaging,
        defaults: {
          heading: ctaContent?.heading,
          body: ctaContent?.body,
          label: ctaContent?.cta,
        },
      })
    : null;

  return (
    <PageShell>
      <JsonLd data={blogPostJsonLd(post)} />
      <PageHeader width="xl">
        <PageHeaderBreadcrumbs>
          <BreadcrumbTrail
            currentPath={`/blog/${post.slug}`}
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
        </PageHeaderBreadcrumbs>
        <PageHeaderContent variant="editorial" width="xl">
          <PageHeaderEyebrow variant="meta">
            Published {formatPostDate(post.date)}
            {post.updatedAt && post.updatedAt !== post.date
              ? ` · Updated ${formatPostDate(post.updatedAt)}`
              : null}{" "}
            · {post.readTime}
          </PageHeaderEyebrow>
          <PageHeaderTitle>{post.title}</PageHeaderTitle>
          <PageHeaderDescription>
            Written by{" "}
            <TextLink href="/about" direction="none">
              Dr. Christina Ruzicka, PsyD
            </TextLink>
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>
      <ContentSection size="spacious" containerSize="md">
        <PortableContent value={post.body} variant="article" />
        {post.sources?.length ? (
          <Stack
            as="aside"
            gap="sm"
            className={styles.sources}
            aria-labelledby="sources-heading"
          >
            <Heading as="h2" size="section" id="sources-heading">
              Research and sources
            </Heading>
            <ul className={styles.sourcesList}>
              {post.sources.map((source) => (
                <li key={source._key ?? source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.title}
                  </a>
                  <Text as="span" variant="detail">
                    {source.citation}
                  </Text>
                </li>
              ))}
            </ul>
          </Stack>
        ) : null}
        {serviceLink ? (
          <aside className={styles.serviceCard}>
            <EditorialLinkCard
              href={serviceLink.href}
              eyebrow="Related therapy service"
              title={serviceLink.label}
              description={serviceLink.description}
              action="Learn more →"
              headingAs="h2"
            />
          </aside>
        ) : null}
        <nav aria-label="Blog post navigation" className={styles.postNav}>
          <TextLink href="/blog" direction="back">
            Back to Blog
          </TextLink>
          {olderPost && (
            <TextLink
              href={`/blog/${olderPost.slug}` as Route}
              className={styles.olderLink}
            >
              {olderPost.title}
            </TextLink>
          )}
        </nav>
      </ContentSection>
      {cta?.heading ? (
        <CtaSection heading={cta.heading} body={cta.body} cta={cta.label} />
      ) : null}
    </PageShell>
  );
}

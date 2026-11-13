import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { ContentSection } from "@/components/content-section";
import { CtaSection } from "@/components/cta-section";
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
import { Stack } from "@/components/stack";
import { TextLink } from "@/components/text-link";
import { Text } from "@/components/typography";
import { getAvailabilityCtaContent } from "@/config/availability";
import { researchPageJsonLd } from "@/config/seo";
import type { HomePageContent, SiteSettings } from "@/data/cms";
import type { ResearchBlock, ResearchPageContent } from "@/data/research";
import { formatResearchDate } from "@/lib/research-text";
import type { Route } from "next";
import Image from "next/image";
import { BarChart } from "./bar-chart";
import { ResearchText } from "./research-text";
import styles from "./styles.module.css";

function BlockHeader({
  eyebrow,
  heading,
  description,
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
}) {
  return (
    <ContentHeader align="left" gap="none" width="lg">
      {eyebrow ? (
        <ContentHeaderEyebrow variant="overline">
          {eyebrow}
        </ContentHeaderEyebrow>
      ) : null}
      <ContentHeaderTitle>{heading}</ContentHeaderTitle>
      {description ? (
        <ContentHeaderDescription>{description}</ContentHeaderDescription>
      ) : null}
    </ContentHeader>
  );
}

function Block({
  block,
  csv,
}: {
  block: ResearchBlock;
  csv?: ResearchPageContent["csv"];
}) {
  switch (block.type) {
    case "keyNumbers":
      return (
        <ContentSection tone="feature" size="spacious" containerSize="xl">
          <BlockHeader heading={block.heading} />
          <ul className={styles.keyNumbers}>
            {block.items.map((item) => (
              <li key={item.label} className={styles.keyNumber}>
                <span className={styles.keyValue}>{item.value}</span>
                <Text as="span" variant="supporting">
                  {item.label}
                </Text>
                <Text as="span" variant="detail" tone="subdued">
                  {item.source}
                </Text>
              </li>
            ))}
          </ul>
        </ContentSection>
      );
    case "chart":
      return (
        <ContentSection size="spacious" containerSize="lg">
          <BlockHeader
            heading={block.heading}
            description={block.description}
          />
          <BarChart bars={block.bars} unit={block.unit} label={block.heading} />
          {block.note ? (
            <Text variant="detail" tone="subdued" className={styles.note}>
              {block.note}
            </Text>
          ) : null}
        </ContentSection>
      );
    case "table":
      return (
        <ContentSection size="compact" containerSize="xl">
          <BlockHeader heading={block.heading} />
          <div
            className={styles.tableScroll}
            role="region"
            aria-label={block.caption}
            tabIndex={0}
          >
            <table className={styles.table}>
              <caption className={styles.caption}>{block.caption}</caption>
              <thead>
                <tr>
                  {block.columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <th key={index} scope="row">
                          {cell}
                        </th>
                      ) : (
                        <td key={index}>{cell}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.csv && csv ? (
            <Text variant="detail" className={styles.note}>
              <a href={csv.href} download className={styles.inlineLink}>
                Download the data (CSV)
              </a>{" "}
              · {csv.label}. Free to reuse under CC BY 4.0 with credit to
              Ruzicka Psychology.
            </Text>
          ) : null}
        </ContentSection>
      );
    case "prose":
      return (
        <ContentSection size="spacious" containerSize="md">
          <Stack gap="md">
            <BlockHeader eyebrow={block.eyebrow} heading={block.heading} />
            {block.paragraphs.map((paragraph) => (
              <ResearchText key={paragraph} text={paragraph} />
            ))}
          </Stack>
        </ContentSection>
      );
    case "points":
      return (
        <ContentSection tone="muted" size="spacious" containerSize="md">
          <Stack gap="md">
            <BlockHeader eyebrow={block.eyebrow} heading={block.heading} />
            <ul className={styles.points}>
              {block.items.map((item) => (
                <li key={item}>
                  <ResearchText text={item} />
                </li>
              ))}
            </ul>
          </Stack>
        </ContentSection>
      );
    case "statGroup":
      return (
        <ContentSection size="compact" containerSize="md">
          <Stack gap="md">
            <BlockHeader eyebrow={block.eyebrow} heading={block.heading} />
            <ul className={styles.stats}>
              {block.items.map((item) => (
                <li key={item.text}>
                  <ResearchText text={item.text} />
                  <Text as="span" variant="detail" tone="subdued">
                    Source:{" "}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.inlineLink}
                    >
                      {item.source}
                    </a>
                  </Text>
                </li>
              ))}
            </ul>
          </Stack>
        </ContentSection>
      );
    case "notice":
      return (
        <ContentSection size="compact" containerSize="md">
          <div className={styles.notice}>
            <ResearchText text={block.text} variant="supporting" />
          </div>
        </ContentSection>
      );
    case "map":
      return (
        <ContentSection size="spacious" containerSize="xl">
          <BlockHeader
            heading={block.heading}
            description={block.description}
          />
          <figure data-slot="research-map" className={styles.figure}>
            <Image
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              sizes="(min-width: 1280px) 1200px, 100vw"
              className={styles.mapImage}
            />
            <figcaption className={styles.note}>
              {block.note ? (
                <Text variant="detail" tone="subdued">
                  {block.note}
                </Text>
              ) : null}
              <Text variant="detail" tone="subdued">
                <a href={block.src} className={styles.inlineLink}>
                  Open the full-size map (SVG)
                </a>
              </Text>
            </figcaption>
          </figure>
        </ContentSection>
      );
  }
}

export function ResearchPage({
  page,
  ctaContent,
  site,
}: {
  page: ResearchPageContent;
  ctaContent?: HomePageContent["cta"];
  site?: SiteSettings | null;
}) {
  const path = `/research/${page.slug}`;
  const cta = site
    ? getAvailabilityCtaContent({
        status: site.availabilityStatus,
        messaging: site.availabilityMessaging,
        consultationLabel: site.consultationCtaLabel,
        defaults: { heading: ctaContent?.heading, body: ctaContent?.body },
      })
    : null;

  return (
    <PageShell>
      <JsonLd data={researchPageJsonLd(page)} />
      <PageHeader width="xl">
        <PageHeaderBreadcrumbs>
          <BreadcrumbTrail
            currentPath={path}
            items={[
              { label: "Home", href: "/" },
              { label: "Research", href: "/research" },
              { label: page.title },
            ]}
          />
        </PageHeaderBreadcrumbs>
        <PageHeaderContent variant="editorial">
          <PageHeaderEyebrow>{page.eyebrow}</PageHeaderEyebrow>
          <PageHeaderTitle>{page.title}</PageHeaderTitle>
          <PageHeaderDescription>{page.headline}</PageHeaderDescription>
          <Text variant="detail" className={styles.byline}>
            By Ruzicka Psychology · Published{" "}
            {formatResearchDate(page.datePublished)}
            {page.dateModified !== page.datePublished
              ? ` · Updated ${formatResearchDate(page.dateModified)}`
              : null}
          </Text>
        </PageHeaderContent>
      </PageHeader>

      {page.blocks.map((block, index) => (
        <Block key={`${block.type}-${index}`} block={block} csv={page.csv} />
      ))}

      <ContentSection size="spacious" containerSize="md">
        <Stack gap="md">
          <BlockHeader eyebrow="Sources" heading="Sources and data periods" />
          <ol className={styles.sources}>
            {page.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.inlineLink}
                >
                  {source.name}
                </a>
                <Text as="span" variant="detail" tone="subdued">
                  {source.period}
                </Text>
              </li>
            ))}
          </ol>
        </Stack>
      </ContentSection>

      <ContentSection tone="feature" size="spacious" containerSize="md">
        <Stack gap="md">
          <BlockHeader eyebrow="Cite this" heading="How to cite this page" />
          <Text className={styles.citation}>{page.citation}</Text>
          {page.csv ? (
            <Text variant="supporting">
              The data behind this page is free to reuse under a{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inlineLink}
              >
                Creative Commons Attribution 4.0 license
              </a>
              . Please credit Ruzicka Psychology and link to this page.{" "}
              <a href={page.csv.href} download className={styles.inlineLink}>
                Download the CSV
              </a>
              .
            </Text>
          ) : null}
          {page.related?.length ? (
            <Text variant="supporting">
              More from Ruzicka Psychology:{" "}
              {page.related.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? " · " : null}
                  <TextLink href={link.href as Route} variant="inline">
                    {link.label}
                  </TextLink>
                </span>
              ))}
              {" · "}
              <TextLink href="/research" variant="inline">
                All research
              </TextLink>
            </Text>
          ) : null}
        </Stack>
      </ContentSection>

      {cta?.heading ? (
        <CtaSection
          phone={site?.phone}
          heading={cta.heading}
          body={cta.body}
          cta={cta.label}
          href="/contact"
        />
      ) : null}
    </PageShell>
  );
}

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { SpecialtyGlyph } from "@/components/specialty-glyph";
import { Eyebrow, Heading, Text } from "@/components/typography";
import type { SpecialtyIcon } from "@/data/cms";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

type SpecialtyCardProps = {
  title: string;
  summary: string;
  icon: SpecialtyIcon;
  href?: LinkProps<string>["href"];
  headingAs?: "h2" | "h3";
  glyphSize?: number;
  note?: ReactNode;
  dataServiceSlug?: string;
  className?: string;
};

export function SpecialtyCard({
  title,
  summary,
  icon,
  href,
  headingAs = "h3",
  glyphSize = 32,
  note,
  dataServiceSlug,
  className,
}: SpecialtyCardProps) {
  const content = (
    <>
      <div className={styles.glyph}>
        <SpecialtyGlyph icon={icon} size={glyphSize} />
      </div>
      <Heading as={headingAs} size="item" className={styles.title}>
        {title}
      </Heading>
      <Text className={styles.summary}>{summary}</Text>
      {href ? (
        <Eyebrow
          as="span"
          variant="meta"
          tone="accent"
          className={styles.action}
        >
          Learn more →
        </Eyebrow>
      ) : null}
      {note ? (
        <Eyebrow
          as="span"
          variant="meta"
          tone="subdued"
          className={styles.note}
        >
          {note}
        </Eyebrow>
      ) : null}
    </>
  );

  return href ? (
    <Link
      data-slot="specialty-card"
      href={href}
      data-service-slug={dataServiceSlug}
      className={cn(styles.root, styles.link, "rp-q", className)}
    >
      {content}
    </Link>
  ) : (
    <div
      data-slot="specialty-card"
      className={cn(styles.root, "rp-q", className)}
    >
      {content}
    </div>
  );
}

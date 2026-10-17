import Link, { type LinkProps } from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Eyebrow, Heading, Text } from "@/components/typography";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function EditorialLinkCard({
  href,
  eyebrow,
  title,
  description,
  action,
  headingAs = "h3",
  className,
}: {
  href: LinkProps<string>["href"];
  eyebrow?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  action: ReactNode;
  headingAs?: "h2" | "h3";
  className?: string;
}) {
  return (
    <Link
      data-slot="editorial-link-card"
      href={href}
      className={cn(styles.root, className)}
    >
      {eyebrow ? <Eyebrow variant="overline">{eyebrow}</Eyebrow> : null}
      <Heading
        as={headingAs}
        size="item"
        className={cn(
          styles.title,
          Boolean(eyebrow) && styles.titleAfterEyebrow,
        )}
      >
        {title}
      </Heading>
      <Text variant="supporting" className={styles.description}>
        {description}
      </Text>
      <Eyebrow as="span" variant="meta" className={styles.action}>
        {action}
      </Eyebrow>
    </Link>
  );
}

export function EditorialLinkCardGrid({
  columns = "auto",
  className,
  ...props
}: {
  columns?: "auto" | 3;
} & ComponentProps<"div">) {
  return (
    <div
      data-slot="editorial-link-card-grid"
      data-columns={columns}
      className={cn(styles.grid, columns === 3 && styles.gridThree, className)}
      {...props}
    />
  );
}

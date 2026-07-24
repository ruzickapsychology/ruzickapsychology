import type { ComponentProps } from "react";
import { Eyebrow, Heading } from "@/components/typography";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function DisclosureList({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="disclosure-list"
      className={cn(styles.list, className)}
      {...props}
    />
  );
}

export function DisclosureItem({
  className,
  ...props
}: ComponentProps<"details">) {
  return (
    <details
      data-slot="disclosure-item"
      className={cn(styles.item, className)}
      {...props}
    />
  );
}

export function DisclosureTrigger({
  className,
  children,
  ...props
}: ComponentProps<"summary">) {
  return (
    <summary
      data-slot="disclosure-trigger"
      className={cn(styles.summary, className)}
      {...props}
    >
      <span className={styles.titleStack}>{children}</span>
      <span className={styles.icon} aria-hidden>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
    </summary>
  );
}

export function DisclosureEyebrow({
  className,
  ...props
}: Omit<ComponentProps<typeof Eyebrow>, "as" | "tone">) {
  return (
    <Eyebrow
      data-slot="disclosure-eyebrow"
      as="span"
      variant="overline"
      className={cn(styles.eyebrow, className)}
      {...props}
    />
  );
}

export function DisclosureTitle({
  as = "h3",
  className,
  ...props
}: Omit<ComponentProps<typeof Heading>, "as" | "size"> & {
  as?: ComponentProps<typeof Heading>["as"];
}) {
  return (
    <Heading
      data-slot="disclosure-title"
      as={as}
      size="item"
      className={cn(styles.title, className)}
      {...props}
    />
  );
}

export function DisclosureContent({
  className,
  spacing = true,
  ...props
}: {
  spacing?: boolean;
} & ComponentProps<"div">) {
  return (
    <div
      data-slot="disclosure-content"
      className={cn(
        styles.body,
        styles.bodyText,
        spacing && styles.bodySpaced,
        className,
      )}
      {...props}
    />
  );
}

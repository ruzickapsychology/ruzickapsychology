import type { ComponentProps } from "react";
import { FlowerMark } from "@/components/flower-mark";
import { Heading, Eyebrow, Text } from "@/components/typography";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

/** Native disclosure keeps the letter readable even without JavaScript. */
export function FoldedNote({
  children,
  attribution,
  className,
  ...props
}: {
  attribution?: string;
} & ComponentProps<"details">) {
  return (
    <details
      data-slot="folded-note"
      className={cn(styles.note, className)}
      {...props}
    >
      <summary className={styles.cover}>
        <Eyebrow as="span" variant="overline" className={styles.eyebrow}>
          A personal note
        </Eyebrow>
        <Heading as="h2" size="section" className={styles.title}>
          Before we meet.
        </Heading>
        <span className={styles.seal} aria-hidden="true">
          <FlowerMark width={29} height={34} />
        </span>
        <span className={styles.coverFooter}>
          <Text as="span" variant="detail">
            {attribution}
          </Text>
          <Eyebrow as="span" variant="meta" className={styles.action}>
            <span className={styles.openLabel}>Unfold the note</span>
            <span className={styles.closeLabel}>Fold the note</span>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </Eyebrow>
        </span>
      </summary>
      <div className={styles.letter}>
        <div className={styles.letterInk}>
          {children}
          <div className={styles.signature}>
            <span className={styles.signatureRule} aria-hidden="true" />
            <Text variant="detail">{attribution}</Text>
          </div>
        </div>
        <FlowerMark className={styles.watermark} width={104} height={120} />
      </div>
    </details>
  );
}

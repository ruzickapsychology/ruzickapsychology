import type { Route } from "next";
import type { ComponentProps } from "react";
import { TextLink } from "@/components/text-link";
import { Text } from "@/components/typography";
import { researchTextSegments } from "@/lib/research-text";
import styles from "./styles.module.css";

/** Generated research copy with `[label](href)` links rendered as site links. */
export function ResearchText({
  text,
  ...props
}: { text: string } & Omit<ComponentProps<typeof Text>, "children">) {
  return (
    <Text {...props}>
      {researchTextSegments(text).map((segment, index) =>
        segment.kind === "text" ? (
          segment.text
        ) : segment.external ? (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalLink}
          >
            {segment.text}
          </a>
        ) : (
          <TextLink key={index} href={segment.href as Route} variant="inline">
            {segment.text}
          </TextLink>
        ),
      )}
    </Text>
  );
}

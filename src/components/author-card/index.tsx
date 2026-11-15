import type { ComponentProps } from "react";
import { CircularPortrait } from "@/components/circular-portrait";
import { Stack } from "@/components/stack";
import { TextLink } from "@/components/text-link";
import { Eyebrow, Text } from "@/components/typography";
import type { SanityImageValue } from "@/config/cms-images";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

/** Article author or page reviewer attribution, e.g. label "Reviewed by". */
export function AuthorCard({
  name,
  credentials,
  license,
  image,
  href,
  label = "Written by",
  className,
  ...props
}: {
  name: string;
  credentials?: string;
  license?: string;
  image?: SanityImageValue;
  href?: ComponentProps<typeof TextLink>["href"];
  label?: string;
} & Omit<ComponentProps<"aside">, "children">) {
  const detail = [credentials, license].filter(Boolean).join(" · ");
  return (
    <aside
      data-slot="author-card"
      aria-label="Article author"
      className={cn(styles.root, className)}
      {...props}
    >
      {image?.asset ? (
        <CircularPortrait
          image={image}
          alt={image.alt || name}
          size="xs"
          imageSizes="80px"
        />
      ) : null}
      <Stack gap="xs">
        <Eyebrow variant="meta">{label}</Eyebrow>
        <Text variant="supporting">
          {href ? (
            <TextLink href={href} variant="inline">
              {name}
            </TextLink>
          ) : (
            name
          )}
        </Text>
        {detail ? (
          <Text variant="detail" tone="subdued">
            {detail}
          </Text>
        ) : null}
      </Stack>
    </aside>
  );
}

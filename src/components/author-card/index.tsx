import type { ComponentProps } from "react";
import { CircularPortrait } from "@/components/circular-portrait";
import { Stack } from "@/components/stack";
import { TextLink } from "@/components/text-link";
import { Eyebrow, Text } from "@/components/typography";
import type { SanityImageValue } from "@/config/cms-images";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function AuthorCard({
  name,
  credentials,
  image,
  href,
  className,
  ...props
}: {
  name: string;
  credentials?: string;
  image?: SanityImageValue;
  href: ComponentProps<typeof TextLink>["href"];
} & Omit<ComponentProps<"aside">, "children">) {
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
        <Eyebrow variant="meta">Written by</Eyebrow>
        <Text variant="supporting">
          <TextLink href={href} variant="inline">
            {name}
          </TextLink>
        </Text>
        {credentials ? (
          <Text variant="detail" tone="subdued">
            {credentials}
          </Text>
        ) : null}
      </Stack>
    </aside>
  );
}

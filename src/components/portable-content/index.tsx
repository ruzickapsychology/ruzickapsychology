import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import { Heading } from "@/components/typography";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export type PortableTextValue = PortableTextBlock[];

const allowedHrefProtocols = new Set(["http:", "https:", "mailto:", "tel:"]);

export function portableTextHref(href: unknown) {
  if (typeof href !== "string") return null;

  const trimmedHref = href.trim();
  if (!trimmedHref) return null;

  try {
    const parsedUrl = new URL(trimmedHref, "https://ruzicka.local");
    if (!allowedHrefProtocols.has(parsedUrl.protocol)) return null;
    return trimmedHref;
  } catch {
    return null;
  }
}

export function isExternalPortableTextHref(href: string) {
  return /^(https?:)?\/\//i.test(href);
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <Heading as="h2" size="section">
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading as="h3" size="item">
        {children}
      </Heading>
    ),
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = portableTextHref(value?.href);
      if (!href) return <>{children}</>;

      return (
        <a
          href={href}
          rel={isExternalPortableTextHref(href) ? "noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableContent({
  value,
  variant = "body",
  className,
}: {
  value?: PortableTextValue | null;
  variant?: "intro" | "body" | "compact" | "article";
  className?: string;
}) {
  if (!value?.length) return null;

  return (
    <div
      data-slot="portable-content"
      className={cn(styles.root, styles[variant], className)}
      data-prose={variant}
    >
      <PortableText value={value} components={components} />
    </div>
  );
}

import type { PortableTextBlock } from "@portabletext/react";

export function legacyParagraphsToRichText(
  paragraphs: readonly string[] | undefined,
  prefix: string,
): PortableTextBlock[] {
  return (
    paragraphs?.map((paragraph, index) => ({
      _type: "block",
      _key: `${prefix}-${index}`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `${prefix}-${index}-span`,
          text: paragraph,
          marks: [],
        },
      ],
    })) ?? []
  );
}

export function normalizeRichText(
  richText: PortableTextBlock[] | undefined,
  legacyParagraphs: readonly string[] | undefined,
  prefix: string,
): PortableTextBlock[] {
  return richText?.length
    ? richText
    : legacyParagraphsToRichText(legacyParagraphs, prefix);
}

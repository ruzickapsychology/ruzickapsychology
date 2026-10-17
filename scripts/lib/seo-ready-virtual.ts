import { isDeepStrictEqual } from "node:util";
import { markdownToPortableText } from "@portabletext/markdown";
import { faq } from "../../src/content/faq";
import {
  stableContentKeys,
  type MigrationDocument,
  type MigrationPatch,
} from "../seo-migration-plan";

export const virtualSourceIds = [
  "specialty-individual-therapy",
  "specialty-couples-counseling",
] as const;

/** Add one answer using the published service scope, without replacing existing FAQs. */
export function buildVirtualPatch(
  document: MigrationDocument,
  documents: readonly MigrationDocument[] = [],
): MigrationPatch {
  if (
    document._id !== "faqPage" ||
    document._type !== "faqPage" ||
    !Array.isArray(document.items)
  )
    throw new Error("Unexpected virtual FAQ target");
  const copy = faq.items.find(
    (item) => item.q === "Are virtual appointments available?",
  )!;
  const item = {
    _key: "items-virtual-appointments",
    question: copy.q,
    answerRichText: stableContentKeys(
      markdownToPortableText(copy.a.join("\n\n")),
      "virtual-faq",
    ),
  };
  const existing = document.items.filter(
    (entry) =>
      entry._key === item._key ||
      /virtual|online|telehealth/i.test(entry.question ?? ""),
  );
  if (existing.length) {
    if (existing.length === 1 && isDeepStrictEqual(existing[0], item))
      return { id: document._id, values: {} };
    throw new Error("Existing virtual FAQ requires editorial review");
  }
  for (const [index, id] of virtualSourceIds.entries()) {
    const source = documents.find((doc) => doc._id === id);
    const question = index === 0 ? copy.q : "Can couples therapy be virtual?";
    const entries = Array.isArray(source?.faqs) ? source.faqs : [];
    const answer = entries.find((entry) => entry.question === question);
    const blocks = answer?.answerRichText;
    const text = Array.isArray(blocks)
      ? blocks
          .map((block) =>
            (block.children ?? [])
              .map((span: { text?: string }) => span.text ?? "")
              .join(""),
          )
          .join("\n\n")
      : "";
    if (source?._type !== "specialty" || text !== copy.a[index])
      throw new Error(`Published virtual scope changed: ${id}`);
  }
  const keys = document.items.map((entry) => entry?._key);
  if (
    keys.some((key) => typeof key !== "string" || !key) ||
    new Set(keys).size !== keys.length
  )
    throw new Error("Unexpected existing FAQ keys");
  return { id: document._id, values: { items: [...document.items, item] } };
}

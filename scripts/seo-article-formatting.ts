import {
  readPatchPath,
  type MigrationDocument,
  type MigrationPatch,
} from "./seo-migration-plan";

export const articleFormattingId = "post-finding-your-footing-after-change";
export const doingTheWorkFormattingId =
  "post-repairing-connection-in-relationships";
export const articleFormattingIds = [
  articleFormattingId,
  doingTheWorkFormattingId,
];
const articleSlug =
  "why-we-choose-the-partners-we-do-the-surprising-psychology-behind-romantic-attraction";
const headings = [
  ["9cbf1eaab337", 'The Blueprint of the "Imago"'],
  ["071a8de70cb0", "Why We Are Attracted to Familiar Frustrations"],
  ["e188bb7aa4dd", "Turning Conflict into Connection"],
] as const;
const doingTheWorkHeadings = [
  [
    "0e0b6d29d97c",
    "1. In Individual & Perinatal Therapy: Rewriting the Internal Script",
  ],
  ["355db53ac20c", "2. In Relationships: The Imago Approach to Connection"],
  [
    "2dcf0f20e25e",
    "The Work is Collaborative (And You Don't Have to Do It Alone)",
  ],
] as const;

/** Repair known published formatting only; never import replacement article copy. */
export function buildArticleFormattingPatch(
  document: MigrationDocument,
): MigrationPatch {
  const doingTheWork = document._id === doingTheWorkFormattingId;
  const expectedSlug = doingTheWork
    ? "beyond-the-buzzword-what-does-doing-the-work-actually-mean-in-therapy"
    : articleSlug;
  if (
    !articleFormattingIds.includes(document._id) ||
    document._type !== "post" ||
    readPatchPath(document, "slug.current") !== expectedSlug
  ) {
    throw new Error("Unexpected article formatting target");
  }
  const values: Record<string, unknown> = {};
  for (const [key, text] of doingTheWork ? doingTheWorkHeadings : headings) {
    const blockPath = `body[_key=="${key}"]`;
    const block = readPatchPath(document, blockPath) as
      | {
          _type?: string;
          style?: string;
          listItem?: string;
          children?: Array<{ _type?: string; text?: string }>;
        }
      | undefined;
    if (
      block?._type !== "block" ||
      block.listItem !== undefined ||
      !block.children?.every((child) => child._type === "span") ||
      block.children?.map((child) => child.text ?? "").join("") !== text ||
      !["normal", "h2"].includes(block.style ?? "")
    ) {
      throw new Error(`Article heading precondition changed: ${key}`);
    }
    values[`${blockPath}.style`] = "h2";
  }
  if (doingTheWork) return { id: document._id, values };
  const delimiterPath =
    'body[_key=="62c1a3f278a2"].children[_key=="a5e5f0f08335"]';
  const span = readPatchPath(document, delimiterPath) as
    { _type?: string; text?: string; marks?: unknown[] } | undefined;
  if (
    span?._type !== "span" ||
    ![" ---", ""].includes(span.text ?? "missing") ||
    !Array.isArray(span.marks) ||
    span.marks.length !== 0
  ) {
    throw new Error("Article delimiter precondition changed");
  }
  // Empty this one formatting-only span; retain every span key and clinical word.
  values[`${delimiterPath}.text`] = "";
  return { id: document._id, values };
}

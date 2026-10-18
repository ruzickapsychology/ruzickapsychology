// Reviewed punctuation substitutions only; clinical wording stays unchanged.
const replacements = [
  ["resources—and", "resources, and"],
  ["International — Certification", "International: Certification"],
  ["Psychologist — New York", "Psychologist, New York"],
  ["challenges—including", "challenges, including"],
  ["reduction—it", "reduction; it"],
  ["familiarity—as", "familiarity, as"],
  [
    "caretakers—no matter how loving or well-intentioned—were",
    "caretakers, no matter how loving or well-intentioned, were",
  ],
  [
    "qualities—especially the frustrating ones—of",
    "qualities (especially the frustrating ones) of",
  ],
  ["attack—it", "attack; it"],
  ["wounds—not", "wounds, not"],
  [
    "period—the journey through pregnancy and early postpartum—is",
    "period (the journey through pregnancy and early postpartum) is",
  ],
  ["needs—and", "needs, and"],
  ["surface issues—we", "surface issues. We"],
  ["financial need—please", "financial need. Please"],
  [
    "Imago Relationship Therapy—a structured",
    "Imago Relationship Therapy, a structured",
  ],
] as const;

export function removeCopyEmDashes(text: string): string {
  let result = text;
  for (const [before, after] of replacements)
    result = result.replaceAll(before, after);
  if (result.includes("—"))
    throw new Error(`Unreviewed em dash in copy: ${text}`);
  return result;
}

export function collectCopyPunctuationChanges(
  value: unknown,
  path = "",
): Array<{
  path: string;
  before: string;
  after: string;
}> {
  if (typeof value === "string")
    return value.includes("—")
      ? [{ path, before: value, after: removeCopyEmDashes(value) }]
      : [];
  if (Array.isArray(value))
    return value.flatMap((item, index) =>
      collectCopyPunctuationChanges(item, `${path}[${index}]`),
    );
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) =>
    key.startsWith("_") ||
    ["slug", "url", "href", "portalUrl", "asset"].includes(key)
      ? []
      : collectCopyPunctuationChanges(item, path ? `${path}.${key}` : key),
  );
}

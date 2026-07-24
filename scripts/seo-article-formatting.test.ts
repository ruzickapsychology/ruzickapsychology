import { describe, expect, it } from "vitest";
import {
  articleFormattingId,
  buildArticleFormattingPatch,
} from "./seo-article-formatting";
import {
  buildMigrationPlan,
  type MigrationDocument,
} from "./seo-migration-plan";

function article(): MigrationDocument {
  return {
    _id: articleFormattingId,
    _type: "post",
    _rev: "reviewed-revision",
    slug: {
      current:
        "why-we-choose-the-partners-we-do-the-surprising-psychology-behind-romantic-attraction",
    },
    body: [
      ...[
        ["9cbf1eaab337", 'The Blueprint of the "Imago"'],
        ["071a8de70cb0", "Why We Are Attracted to Familiar Frustrations"],
        ["e188bb7aa4dd", "Turning Conflict into Connection"],
      ].map(([key, text]) => ({
        _key: key,
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text }],
      })),
      {
        _key: "62c1a3f278a2",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "clinical-copy",
            _type: "span",
            text: "Keep this clinical sentence exactly.",
            marks: ["strong"],
          },
          { _key: "a5e5f0f08335", _type: "span", text: " ---", marks: [] },
        ],
      },
    ],
  };
}

describe("article formatting-only migration", () => {
  it("targets exactly three block styles and one delimiter span, preserving source", () => {
    const document = article();
    const before = structuredClone(document);
    const patch = buildArticleFormattingPatch(document);
    expect(patch.id).toBe(articleFormattingId);
    expect(patch.values).toEqual({
      'body[_key=="9cbf1eaab337"].style': "h2",
      'body[_key=="071a8de70cb0"].style': "h2",
      'body[_key=="e188bb7aa4dd"].style': "h2",
      'body[_key=="62c1a3f278a2"].children[_key=="a5e5f0f08335"].text': "",
    });
    expect(document).toEqual(before);
    const plan = buildMigrationPlan(
      { projectId: "test", dataset: "test", scope: "article-formatting" },
      [patch],
      [document],
    );
    expect(plan.changes[0].fields.map((field) => field.before)).toEqual([
      { value: "normal" },
      { value: "normal" },
      { value: "normal" },
      { value: " ---" },
    ]);
  });
  it("rejects changed headings, changed delimiter text and wrong documents", () => {
    for (const [before, after] of [
      ['The Blueprint of the \\"Imago\\"', "A rewritten heading"],
      [" ---", "Clinical text to preserve"],
      [articleFormattingId, "drafts." + articleFormattingId],
    ]) {
      const document = JSON.parse(
        JSON.stringify(article()).replace(before, after),
      );
      expect(() => buildArticleFormattingPatch(document)).toThrow();
    }
  });
  it("is idempotent after its exact formatting changes", () => {
    const document = JSON.parse(
      JSON.stringify(article())
        .replaceAll('"style":"normal"', '"style":"h2"')
        .replace('"text":" ---"', '"text":""'),
    );
    const patch = buildArticleFormattingPatch(document);
    expect(
      buildMigrationPlan(
        { projectId: "test", dataset: "test", scope: "article-formatting" },
        [patch],
        [document],
      ).changes,
    ).toEqual([]);
  });
});

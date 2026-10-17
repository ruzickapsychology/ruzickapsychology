import { describe, expect, it } from "vitest";
import {
  articleFormattingId,
  buildArticleFormattingPatch,
  doingTheWorkFormattingId,
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

function doingTheWorkArticle(): MigrationDocument {
  return {
    _id: doingTheWorkFormattingId,
    _type: "post",
    _rev: "reviewed-revision",
    slug: {
      current:
        "beyond-the-buzzword-what-does-doing-the-work-actually-mean-in-therapy",
    },
    body: [
      ...[
        [
          "0e0b6d29d97c",
          "1. In Individual & Perinatal Therapy: Rewriting the Internal Script",
        ],
        [
          "355db53ac20c",
          "2. In Relationships: The Imago Approach to Connection",
        ],
        [
          "2dcf0f20e25e",
          "The Work is Collaborative (And You Don't Have to Do It Alone)",
        ],
      ].map(([key, text]) => ({
        _key: key,
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          { _key: `${key}-span`, _type: "span", text, marks: ["strong"] },
        ],
      })),
      {
        _key: "clinical-paragraph",
        _type: "block",
        style: "normal",
        children: [
          {
            _key: "clinical-span",
            _type: "span",
            text: "Keep this clinical sentence exactly.",
            marks: ["em"],
          },
        ],
      },
    ],
  };
}

describe("Doing the Work formatting-only migration", () => {
  it("changes only three heading styles, without replacing words, keys, or marks", () => {
    const document = doingTheWorkArticle();
    const before = structuredClone(document);
    const patch = buildArticleFormattingPatch(document);
    expect(patch).toEqual({
      id: doingTheWorkFormattingId,
      values: {
        'body[_key=="0e0b6d29d97c"].style': "h2",
        'body[_key=="355db53ac20c"].style': "h2",
        'body[_key=="2dcf0f20e25e"].style': "h2",
      },
    });
    expect(document).toEqual(before);
    const plan = buildMigrationPlan(
      { projectId: "test", dataset: "test", scope: "article-formatting" },
      [patch],
      [document],
    );
    expect(plan.changes[0].fields.map((field) => field.before)).toEqual(
      Array.from({ length: 3 }, () => ({ value: "normal" })),
    );
  });

  it("refuses rewritten headings, missing keys, non-heading structures, or wrong targets", () => {
    for (const [before, after] of [
      ["Rewriting the Internal Script", "Changed heading"],
      ["0e0b6d29d97c", "replacement-key"],
      ['"style":"normal"', '"style":"blockquote"'],
      ['"style":"normal"', '"style":"normal","listItem":"bullet"'],
      ['"_type":"span"', '"_type":"inlineObject"'],
      ["beyond-the-buzzword", "changed-slug"],
      [doingTheWorkFormattingId, `drafts.${doingTheWorkFormattingId}`],
    ]) {
      const document = JSON.parse(
        JSON.stringify(doingTheWorkArticle()).replace(before, after),
      );
      expect(() => buildArticleFormattingPatch(document)).toThrow();
    }
  });

  it("produces no changes after the headings have been repaired", () => {
    const document = JSON.parse(
      JSON.stringify(doingTheWorkArticle()).replaceAll(
        '"style":"normal"',
        '"style":"h2"',
      ),
    );
    expect(
      buildMigrationPlan(
        { projectId: "test", dataset: "test", scope: "article-formatting" },
        [buildArticleFormattingPatch(document)],
        [document],
      ).changes,
    ).toEqual([]);
  });
});

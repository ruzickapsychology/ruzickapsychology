import { describe, expect, it } from "vitest";
import {
  assertReviewedPlan,
  buildMigrationPlan,
  buildReviewedDraftPatches,
  readPatchPath,
  stableContentKeys,
} from "./seo-migration-plan";

const target = {
  projectId: "test",
  dataset: "production",
  scope: "website-copy",
};
const document = {
  _id: "homePage",
  _type: "homePage",
  _rev: "r1",
  hero: { heading: "Old", body: "Preserve this" },
};
const patches = [{ id: "homePage", values: { "hero.heading": "New" } }];

describe("SEO migration review safeguards", () => {
  it("shows exact changed fields and preserves missing versus null", () => {
    const plan = buildMigrationPlan(
      target,
      [
        {
          id: "homePage",
          values: {
            "hero.heading": "New",
            absent: null,
            "hero.body": "Preserve this",
          },
        },
      ],
      [document],
    );
    expect(plan.changes[0]).toEqual({
      id: "homePage",
      revision: "r1",
      fields: [
        { path: "hero.heading", before: { value: "Old" }, after: "New" },
        { path: "absent", before: { missing: true }, after: null },
      ],
    });
  });
  it("rejects changed revisions, destinations, scope and values after review", () => {
    const reviewed = buildMigrationPlan(target, patches, [document]);
    expect(() =>
      assertReviewedPlan(JSON.parse(JSON.stringify(reviewed)), reviewed),
    ).not.toThrow();
    for (const current of [
      buildMigrationPlan(target, patches, [{ ...document, _rev: "r2" }]),
      buildMigrationPlan({ ...target, dataset: "staging" }, patches, [
        document,
      ]),
      buildMigrationPlan({ ...target, scope: "all-content" }, patches, [
        document,
      ]),
      buildMigrationPlan(
        target,
        [{ id: "homePage", values: { "hero.heading": "Different" } }],
        [document],
      ),
    ])
      expect(() => assertReviewedPlan(reviewed, current)).toThrow(
        "Reviewed plan differs",
      );
  });
  it("rejects missing, duplicate and wrongly typed targets", () => {
    expect(() => buildMigrationPlan(target, patches, [])).toThrow(
      "Missing target",
    );
    expect(() =>
      buildMigrationPlan(target, [...patches, ...patches], [document]),
    ).toThrow("Duplicate");
    expect(() =>
      buildMigrationPlan(target, patches, [{ ...document, _type: "post" }]),
    ).toThrow("Unexpected document type");
  });
  it("omits unchanged fields and reads keyed-array fields precisely", () => {
    expect(
      buildMigrationPlan(
        target,
        [{ id: "homePage", values: { "hero.heading": "Old" } }],
        [document],
      ).changes,
    ).toEqual([]);
    expect(
      readPatchPath(
        {
          groups: [
            { _key: "a", license: "first" },
            { _key: "b", license: "second" },
          ],
        },
        'groups[_key=="b"].license',
      ),
    ).toBe("second");
    expect(() => readPatchPath({}, "groups[0]")).toThrow(
      "Unsupported migration path",
    );
  });
  it("makes rich-text keys deterministic without breaking link marks", () => {
    const text = (key: string) => [
      {
        _key: key,
        _type: "block",
        markDefs: [{ _key: key, _type: "link", href: "https://example.com" }],
        children: [{ _key: key, text: "Link", marks: [key, "strong"] }],
      },
    ];
    expect(stableContentKeys(text("random1"))).toEqual(
      stableContentKeys(text("random2")),
    );
    expect(stableContentKeys(text("random1"))).toMatchObject([
      {
        markDefs: [{ _key: "content-0-markDefs-0" }],
        children: [{ marks: ["content-0-markDefs-0", "strong"] }],
      },
    ]);
  });
});

describe("explicitly reviewed website drafts", () => {
  const patches = [
    { id: "contactPage", values: { formNote: "Generic safety note" } },
  ];
  const draft = {
    _id: "drafts.contactPage",
    _type: "contactPage",
    _rev: "draft-r1",
    heading: "Preserve draft heading",
  };
  it("rejects clinical scopes and non-allowlisted fields", () => {
    expect(() => buildReviewedDraftPatches(false, [], [])).toThrow(
      "only allowed",
    );
    expect(() =>
      buildReviewedDraftPatches(
        true,
        [{ id: "contactPage", values: { intro: "Different" } }],
        [draft],
      ),
    ).toThrow("does not allow");
    expect(() =>
      buildReviewedDraftPatches(
        true,
        [{ id: "pricingPage", values: { formNote: "Wrong" } }],
        [],
      ),
    ).toThrow("does not allow");
  });
  it("patches the draft independently without publishing or changing unrelated fields", () => {
    const draftPatches = buildReviewedDraftPatches(true, patches, [draft]);
    expect(draftPatches).toEqual([
      { id: "drafts.contactPage", values: { formNote: "Generic safety note" } },
    ]);
    expect(buildMigrationPlan(target, draftPatches, [draft]).changes).toEqual([
      {
        id: "drafts.contactPage",
        revision: "draft-r1",
        fields: [
          {
            path: "formNote",
            before: { missing: true },
            after: "Generic safety note",
          },
        ],
      },
    ]);
    expect(draft.heading).toBe("Preserve draft heading");
  });
  it("rejects a changed draft revision even when its target field is already unchanged", () => {
    const reviewed = buildMigrationPlan(
      { ...target, reviewedDrafts: [{ id: draft._id, revision: "r1" }] },
      [],
      [],
    );
    const changed = buildMigrationPlan(
      { ...target, reviewedDrafts: [{ id: draft._id, revision: "r2" }] },
      [],
      [],
    );
    expect(() => assertReviewedPlan(reviewed, changed)).toThrow(
      "Reviewed plan differs",
    );
  });
});

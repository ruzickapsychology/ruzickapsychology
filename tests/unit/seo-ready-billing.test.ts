import { describe, expect, it } from "vitest";
import { buildBillingPatch } from "../../scripts/lib/seo-ready-billing";
import source from "../../scripts/lib/seo-ready-billing-source.json";

function document() {
  return {
    _id: "pricingPage",
    _type: "pricingPage",
    _rev: "reviewed-revision",
    fees: { items: [{ detail: "50 minutes", price: "$225" }] },
    insurance: { body: ["Existing insurance terms"] },
    reimbursementGuide: {
      items: [structuredClone(source.step2), structuredClone(source.step4)],
    },
  };
}

describe("narrow billing advice migration", () => {
  it("only changes the two identified guide bodies, with no replacement billing code", () => {
    const doc = document();
    const before = structuredClone(doc);
    const patch = buildBillingPatch(doc);
    expect(Object.keys(patch.values)).toEqual([
      `reimbursementGuide.items[_key=="${source.step2._key}"].body`,
      `reimbursementGuide.items[_key=="${source.step4._key}"].body`,
    ]);
    expect(JSON.stringify(patch.values)).not.toMatch(
      /90837|90834|90791|90847|60-minute/,
    );
    expect(doc).toEqual(before);
    const bodies = Object.values(patch.values) as Array<
      typeof source.step4.body
    >;
    expect(bodies[1][1]).toEqual(source.step4.body[1]);
  });

  it("is idempotent and resumes a partially applied correction", () => {
    const doc = document();
    const bodies = Object.values(buildBillingPatch(doc).values);
    doc.reimbursementGuide.items[0].body =
      bodies[0] as typeof source.step2.body;
    expect(Object.keys(buildBillingPatch(doc).values)).toHaveLength(1);
    doc.reimbursementGuide.items[1].body =
      bodies[1] as typeof source.step4.body;
    expect(buildBillingPatch(doc).values).toEqual({});
  });

  it("refuses changed wording, annotations, missing content or a draft", () => {
    const changed = document();
    changed.reimbursementGuide.items[0].body[0].children[0].text =
      "Edited since review";
    expect(() => buildBillingPatch(changed)).toThrow(/precondition/);
    const annotated = document();
    annotated.reimbursementGuide.items[0].body[0].children[0].marks.push(
      "new-editor-mark",
    );
    expect(() => buildBillingPatch(annotated)).toThrow(/precondition/);
    const missing = document();
    missing.reimbursementGuide.items = [];
    expect(() => buildBillingPatch(missing)).toThrow(/precondition/);
    expect(() =>
      buildBillingPatch({ ...document(), _id: "drafts.pricingPage" }),
    ).toThrow(/target/);
  });
});

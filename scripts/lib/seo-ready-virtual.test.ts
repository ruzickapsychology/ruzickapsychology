import { describe, expect, it } from "vitest";
import { buildVirtualPatch, virtualSourceIds } from "./seo-ready-virtual";
import type { MigrationDocument } from "../seo-migration-plan";

const target: MigrationDocument = {
  _id: "faqPage",
  _type: "faqPage",
  _rev: "faq-revision",
  items: [
    {
      _key: "existing",
      question: "Editorial question",
      answer: ["Keep this exact answer."],
      custom: true,
    },
  ],
};
const sources: MigrationDocument[] = virtualSourceIds.map((id, index) => ({
  _id: id,
  _type: "specialty",
  _rev: "source-revision",
  faqs: [
    {
      question:
        index === 0
          ? "Are virtual appointments available?"
          : "Can couples therapy be virtual?",
      answerRichText: [
        {
          children: [
            {
              text:
                index === 0
                  ? "Yes. Christina offers virtual therapy to clients located in New York, along with in-person appointments at the Rochester office."
                  : "Virtual couples sessions may be available when both partners are located in New York and the format is clinically appropriate. The consultation is the best place to discuss your situation.",
            },
          ],
        },
      ],
    },
  ],
}));

describe("virtual FAQ migration", () => {
  it("preserves existing editorial content and adds working internal link annotations", () => {
    const patch = buildVirtualPatch(target, sources);
    const items = patch.values.items as Record<string, unknown>[];
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual((target.items as unknown[])[0]);
    expect(target.items).toHaveLength(1);
    expect(JSON.stringify(items[1])).toContain(
      '"href":"/specialties/individual-therapy"',
    );
    expect(JSON.stringify(items[1])).toContain(
      '"href":"/specialties/couples-therapy"',
    );
  });
  it("is idempotent", () => {
    const patch = buildVirtualPatch(target, sources);
    expect(
      buildVirtualPatch({ ...target, ...patch.values }, sources).values,
    ).toEqual({});
  });
  it("refuses missing or changed published source scope", () => {
    expect(() => buildVirtualPatch(target)).toThrow(
      "Published virtual scope changed",
    );
    expect(() =>
      buildVirtualPatch(
        target,
        sources.map((source) => ({ ...source, faqs: [] })),
      ),
    ).toThrow("Published virtual scope changed");
  });
  it("does not duplicate or overwrite an independently written virtual FAQ", () => {
    expect(() =>
      buildVirtualPatch(
        {
          ...target,
          items: [
            {
              _key: "different",
              question: "Do you offer online therapy?",
              answer: ["Editor copy"],
            },
          ],
        },
        sources,
      ),
    ).toThrow("editorial review");
  });
  it("rejects duplicate keys and wrong targets", () => {
    expect(() =>
      buildVirtualPatch(
        { ...target, items: [{ _key: "same" }, { _key: "same" }] },
        sources,
      ),
    ).toThrow("FAQ keys");
    expect(() =>
      buildVirtualPatch({ ...target, _id: "drafts.faqPage" }, sources),
    ).toThrow("Unexpected virtual FAQ target");
  });
});

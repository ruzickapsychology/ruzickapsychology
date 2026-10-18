import { describe, expect, it } from "vitest";
import {
  collectCopyPunctuationChanges,
  removeCopyEmDashes,
} from "../../scripts/lib/copy-punctuation";

describe("reviewed copy punctuation", () => {
  it("patches only text leaves, preserving Portable Text marks, keys, and links", () => {
    const document = {
      _id: "post-example",
      _rev: "revision",
      slug: { current: "historic—slug" },
      body: [
        {
          _key: "block",
          children: [
            {
              _key: "span",
              text: "We value your resources—and your time.",
              marks: ["strong"],
            },
            { _key: "plain", text: "A separate span.", marks: [] },
          ],
          markDefs: [{ _key: "link", href: "https://example.com/old—path" }],
        },
      ],
    };
    const before = structuredClone(document);
    expect(collectCopyPunctuationChanges(document)).toEqual([
      {
        path: "body[0].children[0].text",
        before: "We value your resources—and your time.",
        after: "We value your resources, and your time.",
      },
    ]);
    expect(document).toEqual(before);
  });

  it("preserves wording around paired dashes and rejects unreviewed copy", () => {
    expect(
      removeCopyEmDashes(
        "Our caretakers—no matter how loving or well-intentioned—were imperfect.",
      ),
    ).toBe(
      "Our caretakers, no matter how loving or well-intentioned, were imperfect.",
    );
    expect(() => removeCopyEmDashes("An unexpected—sentence.")).toThrow(
      "Unreviewed em dash",
    );
    expect(collectCopyPunctuationChanges({ text: "Already clean." })).toEqual(
      [],
    );
  });
});

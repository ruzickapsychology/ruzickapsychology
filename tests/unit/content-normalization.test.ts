import { describe, expect, it } from "vitest";
import type { PortableTextBlock } from "@portabletext/react";
import { normalizeRichText } from "@/data/rich-text";
import { pricingFeeServiceHref } from "@/config/pricing";

describe("CMS answer normalization", () => {
  it("keeps existing rich content, keys and links ahead of legacy copy", () => {
    const rich: PortableTextBlock[] = [
      {
        _type: "block",
        _key: "original",
        style: "normal",
        markDefs: [{ _type: "link", _key: "link", href: "/contact" }],
        children: [
          {
            _type: "span",
            _key: "span",
            text: "Original rich answer",
            marks: ["strong", "link"],
          },
        ],
      },
    ];
    expect(normalizeRichText(rich, ["Older answer"], "faq")).toBe(rich);
  });
  it("converts each legacy paragraph without changing text or ordering", () => {
    const legacy = [
      " First paragraph — keep spacing. ",
      "Second paragraph\nwith line break.",
    ];
    for (const rich of [undefined, []]) {
      const result = normalizeRichText(rich, legacy, "faq-item");
      expect(result.map((block) => block.children[0].text)).toEqual(legacy);
      expect(result.map((block) => block._key)).toEqual([
        "faq-item-0",
        "faq-item-1",
      ]);
      expect(
        result.every(
          (block) =>
            block.style === "normal" && block.children[0].marks?.length === 0,
        ),
      ).toBe(true);
    }
    expect(normalizeRichText(undefined, undefined, "faq")).toEqual([]);
  });
});

describe("published pricing service links", () => {
  const both = [
    { slug: "couples-therapy" as const },
    { slug: "individual-therapy" as const },
  ];
  it("preserves case-insensitive fee label matching and destination", () => {
    expect(pricingFeeServiceHref("Couples / Imago Therapy", both)).toBe(
      "/specialties/couples-therapy",
    );
    expect(pricingFeeServiceHref("INDIVIDUAL THERAPY", both)).toBe(
      "/specialties/individual-therapy",
    );
    expect(pricingFeeServiceHref("Free consultation", both)).toBeUndefined();
  });
  it("never links an unpublished service, preserving matching precedence", () => {
    expect(pricingFeeServiceHref("Couples Therapy", [])).toBeUndefined();
    expect(pricingFeeServiceHref("Individual and Couples", both)).toBe(
      "/specialties/couples-therapy",
    );
    expect(
      pricingFeeServiceHref("Individual and Couples", [
        { slug: "individual-therapy" },
      ]),
    ).toBe("/specialties/individual-therapy");
    expect(
      pricingFeeServiceHref("Individual Therapy", [
        { slug: "couples-therapy" },
      ]),
    ).toBeUndefined();
  });
});

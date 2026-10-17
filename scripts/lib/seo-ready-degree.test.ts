import { describe, expect, it } from "vitest";
import { buildDegreePatch, degreeTitle } from "./seo-ready-degree";
const doc = () => ({
  _id: "aboutPage",
  _type: "aboutPage",
  _rev: "r1",
  credentialGroups: [
    {
      _key: "credentialgroups-education",
      items: [
        {
          _key: "credentialgroups-0-items-doctoral-degree",
          title: "Doctoral Degree",
          detail:
            "California School of Professional Psychology at Alliant International University, San Diego, CA",
        },
        { _key: "other", title: "Unrelated" },
      ],
    },
  ],
});
describe("verified degree patch", () => {
  it("changes only the degree title, without mutating input", () => {
    const source = doc();
    expect(Object.values(buildDegreePatch(source).values)).toEqual([
      degreeTitle,
    ]);
    expect(source.credentialGroups[0].items[0].title).toBe("Doctoral Degree");
  });
  it("is idempotent", () => {
    const source = doc();
    source.credentialGroups[0].items[0].title = degreeTitle;
    expect(buildDegreePatch(source).values).toEqual({});
  });
  it("rejects changed editorial copy or institution", () => {
    const source = doc();
    source.credentialGroups[0].items[0].detail = "Other institution";
    expect(() => buildDegreePatch(source)).toThrow("precondition");
  });
  it("rejects drafts or wrong document types", () => {
    expect(() =>
      buildDegreePatch({ ...doc(), _id: "drafts.aboutPage" }),
    ).toThrow("target");
    expect(() => buildDegreePatch({ ...doc(), _type: "post" })).toThrow(
      "target",
    );
  });
});

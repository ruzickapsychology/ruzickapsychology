import { describe, expect, it } from "vitest";
import { buildVerifiedFactsPatch } from "./seo-verified-facts";
import { buildMigrationPlan } from "./seo-migration-plan";

describe("verified factual corrections", () => {
  it("preserves unrelated profiles and practice policies and is idempotent", () => {
    const profile = {
      _key: "existing",
      label: "Existing profile",
      url: "https://example.com/profile",
    };
    const document = {
      _id: "siteSettings",
      _type: "siteSettings",
      _rev: "rev",
      externalProfiles: [profile],
      hours: ["Unchanged"],
      insurance: "Unchanged",
    };
    const before = structuredClone(document);
    const patch = buildVerifiedFactsPatch(document);
    expect(document).toEqual(before);
    expect(Object.keys(patch.values).sort()).toEqual([
      "externalProfiles",
      "safetyNotice",
    ]);
    expect(patch.values.externalProfiles).toContainEqual(profile);
    const updated = { ...document, ...patch.values };
    expect(
      buildMigrationPlan(
        { projectId: "test", dataset: "test", scope: "verified-facts" },
        [buildVerifiedFactsPatch(updated)],
        [updated],
      ).changes,
    ).toEqual([]);
  });

  it("rejects unreviewed safety wording, changed credentials and drafts", () => {
    expect(() =>
      buildVerifiedFactsPatch({
        _id: "siteSettings",
        _type: "siteSettings",
        _rev: "rev",
        safetyNotice: "Different editorial policy",
      }),
    ).toThrow();
    expect(() =>
      buildVerifiedFactsPatch({
        _id: "aboutPage",
        _type: "aboutPage",
        _rev: "rev",
        credentialGroups: [],
      }),
    ).toThrow();
    expect(() =>
      buildVerifiedFactsPatch({
        _id: "drafts.siteSettings",
        _type: "siteSettings",
        _rev: "rev",
      }),
    ).toThrow();
  });
});

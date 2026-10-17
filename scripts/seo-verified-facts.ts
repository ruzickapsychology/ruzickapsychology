import { about } from "../src/content/about";
import { site } from "../src/content/site";
import {
  readPatchPath,
  type MigrationDocument,
  type MigrationPatch,
} from "./seo-migration-plan";

export const verifiedFactsIds = ["aboutPage", "siteSettings"] as const;

/** Narrow factual corrections; no hours, insurance, workshop or clinical replacements. */
export function buildVerifiedFactsPatch(
  document: MigrationDocument,
): MigrationPatch {
  const values: Record<string, unknown> = {};
  if (document._id === "aboutPage" && document._type === "aboutPage") {
    const training =
      'credentialGroups[_key=="credentialgroups-specialized-training"]';
    const imago = `${training}.items[_key=="credentialgroups-1-items-certified-imago-relationship-therapy"]`;
    const corrections = [
      [
        `${training}.license`,
        "Licensed Clinical Psychologist — New York",
        about.training.license,
      ],
      [
        `${imago}.title`,
        "Certified Imago Relationship Therapy",
        about.training.items[0].title,
      ],
      [`${imago}.detail`, "Clinical Training", about.training.items[0].detail],
      ["space.heading", "Located in Downtown Rochester", about.space.heading],
    ];
    for (const [path, before, after] of corrections) {
      const current = readPatchPath(document, path);
      if (current !== before && current !== after)
        throw new Error(`Verified fact precondition changed: ${path}`);
      values[path] = after;
    }
  } else if (
    document._id === "siteSettings" &&
    document._type === "siteSettings"
  ) {
    const existing = document.externalProfiles;
    if (existing != null && !Array.isArray(existing))
      throw new Error("Unexpected external profiles shape");
    const profiles = [...(existing ?? [])] as Array<{
      _key: string;
      label: string;
      url: string;
    }>;
    for (const profile of site.externalProfiles) {
      if (profiles.some((item) => item.url === profile.url)) continue;
      const key = `verified-profile-${profile.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      if (profiles.some((item) => item._key === key))
        throw new Error(`Profile key collision: ${key}`);
      profiles.push({ _key: key, ...profile });
    }
    values.externalProfiles = profiles;
    if (
      document.safetyNotice != null &&
      document.safetyNotice !== site.safetyNotice
    )
      throw new Error(
        "Safety notice already contains different editorial copy",
      );
    values.safetyNotice = site.safetyNotice;
  } else {
    throw new Error("Unexpected verified facts target");
  }
  return { id: document._id, values };
}

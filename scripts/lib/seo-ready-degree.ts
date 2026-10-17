import {
  readPatchPath,
  type MigrationDocument,
  type MigrationPatch,
} from "../seo-migration-plan";

export const degreeTitle = "Doctor of Psychology (Psy.D.), 2020";
const education =
  'credentialGroups[_key=="credentialgroups-education"].items[_key=="credentialgroups-0-items-doctoral-degree"]';
const institution =
  "California School of Professional Psychology at Alliant International University, San Diego, CA";

/** Only the verified degree title/year changes; institution and sibling credentials stay intact. */
export function buildDegreePatch(document: MigrationDocument): MigrationPatch {
  if (document._id !== "aboutPage" || document._type !== "aboutPage")
    throw new Error("Unexpected degree target");
  const title = readPatchPath(document, `${education}.title`);
  if (
    readPatchPath(document, `${education}.detail`) !== institution ||
    (title !== "Doctoral Degree" && title !== degreeTitle)
  )
    throw new Error("Degree education precondition changed");
  return {
    id: document._id,
    values:
      title === degreeTitle ? {} : { [`${education}.title`]: degreeTitle },
  };
}

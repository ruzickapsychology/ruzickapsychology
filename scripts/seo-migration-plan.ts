import { isDeepStrictEqual } from "node:util";

export type MigrationDocument = {
  _id: string;
  _type: string;
  _rev: string;
  [key: string]: unknown;
};
export type MigrationPatch = { id: string; values: Record<string, unknown> };

/** Read only the simple dotted and keyed-array paths used by this migration. */
export function readPatchPath(document: unknown, path: string): unknown {
  let value = document;
  for (const segment of path.split(".")) {
    const match = /^(\w+)(?:\[_key=="([^"]+)"\])?$/.exec(segment);
    if (!match) throw new Error(`Unsupported migration path: ${path}`);
    value = (value as Record<string, unknown> | undefined)?.[match[1]];
    if (match[2]) {
      value = Array.isArray(value)
        ? value.find((item) => item?._key === match[2])
        : undefined;
    }
  }
  return value;
}

export function buildMigrationPlan(
  target: {
    projectId: string;
    dataset: string;
    scope: string;
    reviewedDrafts?: Array<{ id: string; revision: string }>;
  },
  patches: readonly MigrationPatch[],
  documents: readonly MigrationDocument[],
) {
  if (new Set(patches.map((patch) => patch.id)).size !== patches.length) {
    throw new Error("Duplicate migration targets");
  }
  const changes = patches.flatMap((patch) => {
    const document = documents.find((item) => item._id === patch.id);
    if (!document?._rev)
      throw new Error(`Missing target or revision: ${patch.id}`);
    const publishedId = patch.id.replace(/^drafts\./, "");
    const expectedType = publishedId.startsWith("specialty-")
      ? "specialty"
      : [
            "siteSettings",
            "homePage",
            "specialtiesPage",
            "aboutPage",
            "pricingPage",
            "faqPage",
            "contactPage",
          ].includes(publishedId)
        ? publishedId
        : "post";
    if (document._type !== expectedType) {
      throw new Error(
        `Unexpected document type for ${patch.id}: ${document._type}`,
      );
    }
    const fields = Object.entries(patch.values).flatMap(([path, after]) => {
      const before = readPatchPath(document, path);
      return isDeepStrictEqual(before, after)
        ? []
        : [
            {
              path,
              before:
                before === undefined ? { missing: true } : { value: before },
              after,
            },
          ];
    });
    return fields.length
      ? [{ id: patch.id, revision: document._rev, fields }]
      : [];
  });
  return { version: 1, ...target, changes };
}

export function assertReviewedPlan(reviewed: unknown, current: unknown) {
  if (!isDeepStrictEqual(reviewed, current)) {
    throw new Error(
      "Reviewed plan differs from current content, revisions, target, scope, or fixtures. Generate and review a new plan before applying.",
    );
  }
}

/** Draft support is deliberately limited to the two ordinary website-copy fields. */
export function buildReviewedDraftPatches(
  websiteCopyOnly: boolean,
  patches: readonly MigrationPatch[],
  drafts: readonly MigrationDocument[],
): MigrationPatch[] {
  if (!websiteCopyOnly)
    throw new Error(
      "--include-reviewed-drafts is only allowed with --website-copy-only.",
    );
  const allowed: Record<string, string> = {
    homePage: "hero.heading",
    contactPage: "formNote",
  };
  for (const patch of patches) {
    if (
      !allowed[patch.id] ||
      Object.keys(patch.values).some((field) => field !== allowed[patch.id])
    ) {
      throw new Error(
        `Draft inclusion does not allow these fields on ${patch.id}`,
      );
    }
  }
  return drafts.map((draft) => {
    const patch = patches.find((item) => `drafts.${item.id}` === draft._id);
    if (!patch) throw new Error(`Unexpected draft target: ${draft._id}`);
    return { id: draft._id, values: patch.values };
  });
}

/** Markdown conversion uses random keys; stable keys make separate preview/apply comparable. */
export function stableContentKeys(value: unknown, prefix = "content"): unknown {
  if (Array.isArray(value))
    return value.map((item, index) =>
      stableContentKeys(item, `${prefix}-${index}`),
    );
  if (!value || typeof value !== "object") return value;
  const object = value as Record<string, unknown>;
  // Preserve cross-references from span marks to their mark definitions.
  const definitions = Array.isArray(object.markDefs) ? object.markDefs : [];
  const keys = new Map(
    definitions.map((mark, index) => [
      mark._key,
      `${prefix}-markDefs-${index}`,
    ]),
  );
  return Object.fromEntries(
    Object.entries(object).map(([key, item]) => [
      key,
      key === "_key"
        ? prefix
        : key === "children" && Array.isArray(item)
          ? item.map((child, index) =>
              stableContentKeys(
                {
                  ...child,
                  marks: child.marks?.map(
                    (mark: string) => keys.get(mark) ?? mark,
                  ),
                },
                `${prefix}-children-${index}`,
              ),
            )
          : stableContentKeys(item, `${prefix}-${key}`),
    ]),
  );
}

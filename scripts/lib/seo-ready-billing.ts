import { isDeepStrictEqual } from "node:util";
import { pricing } from "../../src/content/pricing";
import source from "./seo-ready-billing-source.json";
import {
  readPatchPath,
  type MigrationDocument,
  type MigrationPatch,
} from "../seo-migration-plan";

/** Exact published source captured 2026-10-17; no inferred billing code/policy. */
export function buildBillingPatch(document: MigrationDocument): MigrationPatch {
  if (document._id !== "pricingPage" || document._type !== "pricingPage")
    throw new Error("Unexpected billing target");
  const items = readPatchPath(document, "reimbursementGuide.items");
  for (const key of [source.step2._key, source.step4._key]) {
    if (
      !Array.isArray(items) ||
      items.filter((item) => item?._key === key).length !== 1
    )
      throw new Error(
        `Billing precondition changed: missing or duplicate item ${key}`,
      );
  }
  const values: Record<string, unknown> = {};
  const step2 = `reimbursementGuide.items[_key=="${source.step2._key}"]`;
  const step4 = `reimbursementGuide.items[_key=="${source.step4._key}"]`;
  const after2 = [
    {
      ...source.step2.body[0],
      children: [
        {
          ...source.step2.body[0].children[0],
          text: pricing.reimbursementGuide.items[1].body[0],
        },
      ],
    },
  ];
  const after4 = structuredClone(source.step4.body);
  after4[0].children = [
    {
      ...after4[0].children[0],
      text: pricing.reimbursementGuide.items[3].body[0],
    },
  ];
  for (const [path, before, after] of [
    [`${step2}.body`, source.step2.body, after2],
    [`${step4}.body`, source.step4.body, after4],
  ] as const) {
    const current = readPatchPath(document, path);
    if (isDeepStrictEqual(current, after)) continue;
    if (!isDeepStrictEqual(current, before))
      throw new Error(`Billing precondition changed: ${path}`);
    values[path] = after;
  }
  return { id: document._id, values };
}

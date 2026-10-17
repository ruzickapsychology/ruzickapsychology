import fs from "node:fs";
import { getCliClient } from "sanity/cli";
import {
  assertReviewedPlan,
  buildMigrationPlan,
  type MigrationDocument,
} from "./seo-migration-plan";
import { buildDegreePatch } from "./lib/seo-ready-degree";
import { buildVirtualPatch } from "./lib/seo-ready-virtual";
import { buildBillingPatch } from "./lib/seo-ready-billing";

const targets = ["aboutPage", "faqPage", "pricingPage"];
const sources = [
  "specialty-individual-therapy",
  "specialty-couples-counseling",
];
const ids = [...targets, ...sources];
function option(name: string) {
  const index = process.argv.indexOf(name);
  const value = index < 0 ? undefined : process.argv[index + 1];
  if (index >= 0 && (!value || value.startsWith("--")))
    throw new Error(`Missing value for ${name}`);
  return value;
}
async function main() {
  const planPath = option("--plan");
  const backupPath = option("--backup");
  const apply = process.argv.includes("--apply");
  if (!planPath || (apply && !backupPath))
    throw new Error(
      "Use --plan <fresh path>; applying also requires --backup <fresh path>.",
    );
  const client = getCliClient({ apiVersion: "2026-06-24" }).withConfig({
    useCdn: false,
    perspective: "raw",
  });
  const { projectId, dataset } = client.config();
  if (!projectId || !dataset) throw new Error("Missing project/dataset");
  const draftIds = ids.map((id) => `drafts.${id}`);
  const documents = await client.fetch<MigrationDocument[]>(`*[_id in $ids]`, {
    ids,
  });
  const get = (id: string) => {
    const doc = documents.find((d) => d._id === id);
    if (!doc?._rev) throw new Error(`Missing document/revision: ${id}`);
    return doc;
  };
  ids.forEach(get);
  const assertNoDrafts = async () => {
    const drafts = await client.fetch<Array<{ _id: string }>>(
      `*[_id in $draftIds]{_id}`,
      { draftIds },
    );
    if (drafts.length)
      throw new Error(
        `Relevant drafts exist: ${drafts.map((d) => d._id).join(", ")}`,
      );
  };
  await assertNoDrafts();
  const plan = {
    ...buildMigrationPlan(
      { projectId, dataset, scope: "ready-website-degree-virtual-billing" },
      [
        buildDegreePatch(get("aboutPage")),
        buildVirtualPatch(get("faqPage"), documents),
        buildBillingPatch(get("pricingPage")),
      ],
      documents,
    ),
    sources: sources.map((id) => ({ id, revision: get(id)._rev })),
  };
  process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
  if (!apply) {
    fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`, {
      flag: "wx",
      mode: 0o600,
    });
    return;
  }
  assertReviewedPlan(JSON.parse(fs.readFileSync(planPath, "utf8")), plan);
  if (!plan.changes.length) return;
  fs.writeFileSync(
    backupPath!,
    `${JSON.stringify({ createdAt: new Date().toISOString(), plan, documents }, null, 2)}\n`,
    { flag: "wx", mode: 0o600 },
  );
  await assertNoDrafts();
  const currentSources = await client.fetch<
    Array<{ _id: string; _rev: string }>
  >(`*[_id in $sources]{_id, _rev}`, { sources });
  assertReviewedPlan(
    plan.sources,
    sources.map((id) => ({
      id,
      revision: currentSources.find((d) => d._id === id)?._rev,
    })),
  );
  // Draft absence/source revisions cannot be asserted atomically without writing source documents.
  // Coordinate publication with editors; only changed target fields enter this transaction.
  let transaction = client.transaction();
  for (const change of plan.changes)
    transaction = transaction.patch(change.id, (patch) =>
      patch
        .ifRevisionId(change.revision)
        .set(
          Object.fromEntries(
            change.fields.map((field) => [field.path, field.after]),
          ),
        ),
    );
  const result = await transaction.commit({
    visibility: "sync",
    tag: "ready-website-content",
  });
  process.stdout.write(
    `Applied ${result.results.length} narrow document patches.\n`,
  );
}
main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Website migration failed",
  );
  process.exitCode = 1;
});

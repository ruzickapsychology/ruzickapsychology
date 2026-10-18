import fs from "node:fs";
import { getCliClient } from "sanity/cli";
import {
  assertReviewedPlan,
  type MigrationDocument,
} from "./seo-migration-plan";
import { collectCopyPunctuationChanges } from "./lib/copy-punctuation";

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
  const types = [
    "siteSettings",
    "homePage",
    "aboutPage",
    "specialtiesPage",
    "pricingPage",
    "contactPage",
    "faqPage",
    "specialty",
    "post",
  ];
  const documents = await client.fetch<MigrationDocument[]>(
    '*[_type in $types && !(_id in path("versions.**"))] | order(_id asc)',
    { types },
  );
  const changes = documents.flatMap((doc) => {
    const fields = collectCopyPunctuationChanges(doc);
    if (!doc._rev) throw new Error(`Missing revision: ${doc._id}`);
    return fields.length ? [{ id: doc._id, revision: doc._rev, fields }] : [];
  });
  const plan = {
    version: 1,
    projectId,
    dataset,
    scope: "reviewed-copy-em-dashes",
    changes,
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
  if (!changes.length) return;
  fs.writeFileSync(
    backupPath!,
    `${JSON.stringify({ plan, documents: documents.filter((doc) => changes.some((change) => change.id === doc._id)) }, null, 2)}\n`,
    { flag: "wx", mode: 0o600 },
  );
  let transaction = client.transaction();
  for (const change of changes)
    transaction = transaction.patch(change.id, (patch) =>
      patch
        .ifRevisionId(change.revision)
        .set(
          Object.fromEntries(
            change.fields.map((field) => [field.path, field.after]),
          ),
        ),
    );
  await transaction.commit({ visibility: "sync", tag: "copy-punctuation" });
  process.stdout.write(
    `Updated punctuation in ${changes.length} documents without publishing drafts.\n`,
  );
}
main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Punctuation migration failed",
  );
  process.exitCode = 1;
});

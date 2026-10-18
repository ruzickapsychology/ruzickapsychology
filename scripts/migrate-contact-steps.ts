import fs from "node:fs";
import { getCliClient } from "sanity/cli";
import { contact } from "../src/content/contact";
import {
  assertReviewedPlan,
  buildMigrationPlan,
  type MigrationDocument,
} from "./seo-migration-plan";

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
  const documents = await client.fetch<MigrationDocument[]>(
    '*[_id in ["contactPage", "drafts.contactPage"]]',
  );
  if (!documents.some((document) => document._id === "contactPage"))
    throw new Error("Missing published Contact Page");
  const patches = documents.map((document) => {
    const expect = document.process as
      { steps?: Array<{ _key: string; number: string }> } | undefined;
    if (!expect?.steps?.length) throw new Error("Missing existing steps");
    const steps = contact.expect.steps.map((step) => {
      const existing = expect.steps!.find((item) => item.number === step.n);
      if (!existing?._key)
        throw new Error(`Missing existing key for step ${step.n}`);
      return {
        ...existing,
        number: step.n,
        title: step.title,
        body: step.body,
      };
    });
    return {
      id: document._id,
      values: {
        "process.eyebrow": contact.expect.eyebrow,
        "process.steps": steps,
      },
    };
  });
  const plan = buildMigrationPlan(
    { projectId, dataset, scope: "contact-getting-started" },
    patches,
    documents,
  );
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
    `${JSON.stringify({ plan, documents }, null, 2)}\n`,
    { flag: "wx", mode: 0o600 },
  );
  // Patch the same two fields in published and draft documents without publishing
  // unrelated draft edits. Every document is guarded by its reviewed revision.
  let transaction = client.transaction();
  for (const change of plan.changes) {
    transaction = transaction.patch(change.id, (patch) =>
      patch
        .ifRevisionId(change.revision)
        .set(
          Object.fromEntries(
            change.fields.map((field) => [field.path, field.after]),
          ),
        ),
    );
  }
  await transaction.commit({
    visibility: "sync",
    tag: "contact-getting-started",
  });
  process.stdout.write("Updated the three getting-started steps.\n");
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Contact steps migration failed",
  );
  process.exitCode = 1;
});

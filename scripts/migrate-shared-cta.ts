import fs from "node:fs";
import { getCliClient } from "sanity/cli";
import { site } from "../src/content/site";
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
  const assertNoDraft = async () => {
    if (await client.fetch('count(*[_id == "drafts.siteSettings"])'))
      throw new Error(
        "An active Practice Settings draft exists; finish editing it before initializing the shared label.",
      );
  };
  await assertNoDraft();
  const document = await client.getDocument<MigrationDocument>("siteSettings");
  if (!document?._rev || document._type !== "siteSettings")
    throw new Error("Missing Practice Settings document/revision");
  const existing = document.consultationCtaLabel;
  if (existing != null && typeof existing !== "string")
    throw new Error("Unexpected consultation label type");
  const plan = buildMigrationPlan(
    { projectId, dataset, scope: "initialize-shared-consultation-label" },
    [
      {
        id: document._id,
        values: {
          consultationCtaLabel:
            typeof existing === "string" && existing.trim()
              ? existing
              : site.consultationCtaLabel,
        },
      },
    ],
    [document],
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
    `${JSON.stringify({ plan, document }, null, 2)}\n`,
    { flag: "wx", mode: 0o600 },
  );
  // Draft absence cannot be asserted atomically: coordinate publication with editors.
  await assertNoDraft();
  const change = plan.changes[0];
  await client
    .patch(change.id)
    .ifRevisionId(change.revision)
    .set({
      consultationCtaLabel: change.fields[0].after,
    })
    .commit({ visibility: "sync", tag: "initialize-shared-cta" });
  process.stdout.write("Initialized the shared consultation label.\n");
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "CTA migration failed",
  );
  process.exitCode = 1;
});

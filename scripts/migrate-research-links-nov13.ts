import fs from "node:fs";
import { markdownToPortableText } from "@portabletext/markdown";
import { getCliClient } from "sanity/cli";
import {
  assertReviewedPlan,
  buildMigrationPlan,
  stableContentKeys,
  type MigrationDocument,
  type MigrationPatch,
} from "./seo-migration-plan";

/**
 * Links the /research pages from four specialty pages: one sentence appended
 * to each page's overview. Apply only after the code that serves /research is
 * live; the script checks each linked URL returns 200 on the live site first.
 *
 * Each sentence uses the block key prefix `<document id>-research-link`, so a
 * rerun replaces it instead of adding a second copy, and removing it means
 * dropping the blocks with that prefix.
 *
 * Preview: --plan <fresh path>
 * Apply:   --plan <same path> --apply --backup <fresh path>
 */

const SITE = "https://www.ruzickapsychology.com";

const sentences: Record<string, string> = {
  "specialty-individual-therapy":
    "For local data on loneliness and support, see [Loneliness in Rochester and Its Suburbs, Mapped](/research/rochester-loneliness-map).",
  "specialty-couples-counseling":
    "For local figures on marriage, divorce and couples therapists, see [our Monroe County data study](/research/monroe-county-divorce-couples).",
  "specialty-perinatal-postpartum-support":
    "For local figures on births and postpartum depression, see [New Parents and Postpartum Depression in Monroe County](/research/monroe-county-postpartum-depression).",
  "specialty-postpartum-depression-therapy":
    "How common are postpartum depression symptoms locally? See [our Monroe County estimate](/research/monroe-county-postpartum-depression).",
};

type Block = {
  _type: string;
  _key: string;
  children?: Array<{ text: string; marks?: string[] }>;
  markDefs?: Array<{ _key: string; href?: string }>;
};

/** One paragraph with exactly the expected link (text and href). */
function linkParagraph(key: string, markdown: string) {
  const blocks = stableContentKeys(
    markdownToPortableText(markdown),
    key,
  ) as Block[];
  const [, text, href] = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(markdown) ?? [];
  const block = blocks[0];
  const definition = block?.markDefs?.[0];
  const linked = (block?.children ?? [])
    .filter((child) => definition && child.marks?.includes(definition._key))
    .map((child) => child.text)
    .join("");
  if (
    blocks.length !== 1 ||
    block.markDefs?.length !== 1 ||
    definition?.href !== href ||
    linked !== text
  )
    throw new Error(`Link conversion mismatch for ${key}`);
  return blocks;
}

function buildPatch(document: MigrationDocument): MigrationPatch {
  const id = document._id;
  const key = `${id}-research-link`;
  if (!Array.isArray(document.overview))
    throw new Error(`Expected rich text overview on ${id}`);
  const kept = (document.overview as Block[]).filter(
    (block) => !block._key.startsWith(key),
  );
  return {
    id,
    values: { overview: [...kept, ...linkParagraph(key, sentences[id])] },
  };
}

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

  const targets = Object.keys(sentences);
  const documents = await client.fetch<MigrationDocument[]>("*[_id in $ids]", {
    ids: targets.flatMap((id) => [id, `drafts.${id}`]),
  });
  const drafts = documents.filter((document) =>
    document._id.startsWith("drafts."),
  );
  if (drafts.length)
    throw new Error(
      `Open drafts would hide or overwrite this change: ${drafts.map((d) => d._id).join(", ")}`,
    );
  for (const id of targets)
    if (!documents.some((document) => document._id === id))
      throw new Error(`Missing published document: ${id}`);

  if (apply) {
    const routes = new Set(
      Object.values(sentences).map(
        (markdown) => /\]\((\/research\/[^)]+)\)/.exec(markdown)![1],
      ),
    );
    for (const route of routes) {
      const response = await fetch(`${SITE}${route}`, { redirect: "manual" });
      if (response.status !== 200)
        throw new Error(`${route} is not live yet (HTTP ${response.status})`);
    }
  }

  const plan = buildMigrationPlan(
    { projectId, dataset, scope: "research-links-nov13" },
    documents.map(buildPatch),
    documents,
  );
  process.stdout.write(
    plan.changes
      .map(
        (change) =>
          `patch ${change.id}: ${change.fields.map((field) => field.path).join(", ")}`,
      )
      .join("\n") + "\n",
  );
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
  await transaction.commit({
    visibility: "sync",
    tag: "research-links-nov13",
  });
  process.stdout.write("Applied research links.\n");
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Research links migration failed",
  );
  process.exitCode = 1;
});

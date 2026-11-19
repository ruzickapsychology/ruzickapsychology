import fs from "node:fs";
import { getCliClient } from "sanity/cli";
import {
  assertReviewedPlan,
  buildMigrationPlan,
  type MigrationDocument,
} from "./seo-migration-plan";

/**
 * 18 Nov 2026: safety wording in one FAQ answer on the postpartum anxiety
 * page, to match the postpartum guide after its fact-check.
 *
 * - "a sharply reduced need for sleep" becomes PSI's own wording ("a
 *   decreased need for sleep or being unable to sleep"), so the warning sign
 *   is not made harder to meet than the source says.
 * - "If thoughts of harm do not feel unwanted" is dropped as an emergency
 *   criterion: no cited source gives it.
 *
 * The page carries Christina's review stamp; she should see this change.
 *
 * Preview: --plan <fresh path>
 * Apply:   --plan <same path> --apply --backup <fresh path>
 */

const DOCUMENT_ID = "specialty-postpartum-anxiety-therapy";
const FAQ_KEY = "postpartum-anxiety-therapy-faq-1";
const SPAN_KEY = "postpartum-anxiety-therapy-faq-1-1-children-0";
const OLD_TEXT =
  "If thoughts of harm do not feel unwanted, if you feel you might act on them, or if you or someone close to you notices confusion, seeing or hearing things that are not there, strange beliefs, or a sharply reduced need for sleep, treat it as an emergency. Call 911 or go to the nearest emergency department.";
const NEW_TEXT =
  "If you feel you might act on these thoughts, or if you or someone close to you notices confusion, seeing or hearing things that are not there, strange beliefs, or a decreased need for sleep or being unable to sleep, treat it as an emergency. Call 911 or go to the nearest emergency department.";

type Span = { _key: string; text: string };
type Block = { _key: string; children?: Span[] };
type Faq = { _key: string; answerRichText?: Block[] };

function option(name: string) {
  const index = process.argv.indexOf(name);
  const value = index < 0 ? undefined : process.argv[index + 1];
  if (index >= 0 && (!value || value.startsWith("--")))
    throw new Error(`Missing value for ${name}`);
  return value;
}

function fixedFaqs(faqs: unknown) {
  if (!Array.isArray(faqs)) throw new Error("Expected faqs array");
  let replaced = 0;
  const result = (faqs as Faq[]).map((faq) =>
    faq._key !== FAQ_KEY
      ? faq
      : {
          ...faq,
          answerRichText: (faq.answerRichText ?? []).map((block) => ({
            ...block,
            children: block.children?.map((span) => {
              if (span._key !== SPAN_KEY) return span;
              if (span.text !== OLD_TEXT)
                throw new Error(
                  "FAQ text changed since this script was written",
                );
              replaced += 1;
              return { ...span, text: NEW_TEXT };
            }),
          })),
        },
  );
  if (replaced !== 1)
    throw new Error(`Expected 1 replacement, got ${replaced}`);
  return result;
}

async function main() {
  const planPath = option("--plan");
  const backupPath = option("--backup");
  const apply = process.argv.includes("--apply");
  if (!planPath || (apply && !backupPath))
    throw new Error("Use --plan <path> [--apply --backup <path>].");
  const client = getCliClient({ apiVersion: "2026-06-24" }).withConfig({
    useCdn: false,
    perspective: "raw",
  });
  const { projectId, dataset } = client.config();
  if (!projectId || !dataset) throw new Error("Missing project/dataset");

  const documents = await client.fetch<MigrationDocument[]>("*[_id in $ids]", {
    ids: [DOCUMENT_ID, `drafts.${DOCUMENT_ID}`],
  });
  if (documents.some((document) => document._id.startsWith("drafts.")))
    throw new Error(`Open draft would hide this change: drafts.${DOCUMENT_ID}`);
  const document = documents.find((item) => item._id === DOCUMENT_ID);
  if (!document) throw new Error(`Missing published document: ${DOCUMENT_ID}`);

  const plan = buildMigrationPlan(
    { projectId, dataset, scope: "postpartum-anxiety-faq-nov18" },
    [{ id: DOCUMENT_ID, values: { faqs: fixedFaqs(document.faqs) } }],
    [document],
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
    tag: "postpartum-anxiety-faq-nov18",
  });
  process.stdout.write("Applied.\n");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "FAQ fix failed");
  process.exitCode = 1;
});

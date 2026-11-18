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
 * 18 Nov 2026 (evening): an "Online Postpartum Therapy Across New York"
 * specialty page, so new and expecting parents anywhere in the state can find
 * the video option, and links to it from the existing perinatal pages.
 *
 * The page states only practice facts already published on the site (license,
 * PSI training, video rules, babies and partners in sessions, fees, getting
 * started, referrals out) and links to the postpartum guide. It makes no
 * research claims, so it carries no sources list.
 *
 * Stages:
 * - `pages` creates (or updates) the specialty document. Older code ignores
 *   it, so this is safe to apply before the matching code deploys.
 * - `links` adds it to the specialties hub and links it from the perinatal,
 *   postpartum and online therapy pages. Apply after the route is live.
 *
 * Preview: --stage <pages|links> --plan <fresh path>
 * Apply:   --stage <pages|links> --plan <same path> --apply --backup <fresh path>
 */

type Block = {
  _type: string;
  _key: string;
  children?: Array<{ text: string; marks?: string[] }>;
  markDefs?: Array<{ _key: string; href?: string }>;
};

/** markdownToPortableText can leak a link mark past its text (for example a link inside bold), so every link is checked. */
function assertLinks(markdown: string, blocks: Block[]) {
  const expected = [...markdown.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map(
    ([, text, href]) => `${text} -> ${href}`,
  );
  const actual = blocks.flatMap((block) =>
    (block.markDefs ?? []).map((definition) => {
      const text = (block.children ?? [])
        .filter((child) => child.marks?.includes(definition._key))
        .map((child) => child.text)
        .join("");
      return `${text} -> ${definition.href}`;
    }),
  );
  const known = new Set(["strong", "em"]);
  for (const block of blocks)
    for (const child of block.children ?? [])
      for (const mark of child.marks ?? [])
        if (
          !known.has(mark) &&
          !(block.markDefs ?? []).some((definition) => definition._key === mark)
        )
          throw new Error(`Dangling mark ${mark} in ${block._key}`);
  if (JSON.stringify(expected) !== JSON.stringify(actual))
    throw new Error(
      `Link conversion mismatch:\n${expected.join("\n")}\n---\n${actual.join("\n")}`,
    );
}

const rich = (prefix: string, ...paragraphs: string[]) => {
  const markdown = paragraphs.join("\n\n");
  const blocks = stableContentKeys(
    markdownToPortableText(markdown),
    prefix,
  ) as Block[];
  assertLinks(markdown, blocks);
  return blocks;
};

const faq = (key: string, question: string, ...paragraphs: string[]) => ({
  _key: key,
  _type: "faqItem",
  question,
  answerRichText: rich(key, ...paragraphs),
});

const reference = (key: string, id: string) => ({
  _key: key,
  _type: "reference",
  _ref: id,
});

/* ----------------------------- Shared practice facts ----------------------------- */

const whenUrgent =
  "Therapy is not emergency care. If you or someone else may be in immediate danger, call 911 or go to the nearest emergency department. You can call or text 988 at any hour. More options are on the [resources page](/resources).";
const insuranceIndividual =
  "Christina is in network with Aetna through Headway for individual therapy, and does not accept other insurance plans. If you plan to use out-of-network benefits, a superbill is sent automatically each month. She also offers limited sliding scale slots for self-pay clients. Fees and sliding scale details are on the [Pricing page](/pricing).";
/* --------------------------------- Specialty pages -------------------------------- */

const specialties = [
  {
    _id: "specialty-online-postpartum-therapy",
    slug: "online-postpartum-therapy",
    order: 10,
    title: "Online Postpartum Therapy",
    pageHeading: "Online Postpartum Therapy Across New York",
    summary:
      "Postpartum and pregnancy therapy by secure video for new and expecting parents anywhere in New York, with your baby welcome in sessions.",
    intro:
      "Therapy by secure video with Dr. Christina Ruzicka for new and expecting parents anywhere in New York State who are struggling with low mood, worry, frightening thoughts or the changes that come with a baby.",
    overview: [
      "Getting out the door with a newborn, or through the last weeks of pregnancy, can be the hardest part of asking for help. Online postpartum therapy brings sessions to you, wherever you live in New York.",
      "Dr. Christina Ruzicka is a licensed clinical psychologist (New York license 024357). She has completed Postpartum Support International's perinatal mental health training and is approved to take the PMH-C exam. She sees clients in person at her South Avenue office in Rochester and by secure video across the state. Sessions use SimplePractice or Zoom, and you must be physically in New York for each session.",
      "Your baby can be with you during video sessions. Partners may be included when it is clinically appropriate and supports your goals.",
      "Not sure yet what you are dealing with? The [postpartum guide](/guides/postpartum) explains the baby blues, postpartum depression and anxiety, frightening thoughts, birth trauma and more, with sources on every page.",
    ],
    commonConcerns: [
      "You feel low, numb or unlike yourself since the baby arrived",
      "Worry, checking or frightening thoughts are hard to switch off",
      "Leaving home with a newborn makes appointments hard to keep",
      "You live in New York but far from Rochester",
      "Pregnancy, a loss or a difficult birth is weighing on you",
      "Your relationship has changed since the baby arrived",
    ],
    approachHeading: "The same perinatal therapy, by video",
    approachBody: [
      "Online sessions follow the same approach as sessions in the office. Christina's style is relational, psychodynamic, warm and active, with tools from Acceptance and Commitment Therapy and Dialectical Behavior Therapy when they fit.",
      "Support can begin while trying to conceive, during pregnancy, after a loss, following birth, or at any point in the transition to parenthood. Christina works with women and parents across a range of identities and family structures. Read more about [postpartum depression therapy](/specialties/postpartum-depression-therapy), [postpartum anxiety therapy](/specialties/postpartum-anxiety-therapy) and [perinatal and postpartum therapy](/specialties/perinatal-postpartum-therapy).",
      "Christina does not prescribe medication. With a signed release of information, she can coordinate with your OB/GYN or psychiatrist.",
    ],
    whatToExpect: [
      "After you get in touch, Christina replies within 2 business days about scheduling, fees and payment, and offers a free 15-minute phone consultation. If you decide to go ahead, you receive access to a secure client portal, where you complete intake paperwork, practice policies and consent forms.",
      "For each session, find a place where you will not be overheard, with a steady internet connection and a device with a camera and microphone. Your baby can be with you while you talk.",
      "Individual appointments are scheduled in a 60-minute block, with 45–50 minutes face to face. Most clients begin weekly. Fees, insurance and the sliding scale are on the [Pricing page](/pricing), and [paying for postpartum therapy](/guides/postpartum/paying-for-postpartum-therapy-rochester) walks through the options.",
      whenUrgent,
    ],
    faqs: [
      [
        "Do I have to live in Rochester?",
        "No. You can live anywhere in New York State. You need to be physically in New York during each online session.",
      ],
      [
        "Can my baby be in the session?",
        "Yes. Perinatal clients may join video sessions with the baby present.",
      ],
      [
        "Can my partner join?",
        "Partners may be included when it is clinically appropriate and supports your goals. You can talk about who should attend in the free consultation.",
      ],
      [
        "Do you prescribe medication?",
        "No. Christina coordinates with psychiatrists and OB/GYNs when needed, once you have signed a release of information.",
      ],
      [
        "What if I need more than weekly therapy?",
        "Christina refers out crisis care, active addiction, and severe and persistent mental health conditions or eating disorders that need a high level of care. Ruzicka Psychology does not provide 24-hour crisis coverage. If you are in crisis, call or text 988, or call 911 in an emergency.",
      ],
      ["Do you take insurance?", insuranceIndividual],
    ],
    relatedPosts: ["post-repairing-connection-in-relationships"],
  },
];

function specialtyDocument(page: (typeof specialties)[number]) {
  return {
    _id: page._id,
    _type: "specialty",
    title: page.title,
    slug: { _type: "slug", current: page.slug },
    summary: page.summary,
    pageStatus: "published",
    active: true,
    order: page.order,
    pageHeading: page.pageHeading,
    intro: page.intro,
    overview: rich(`${page.slug}-overview`, ...page.overview),
    commonConcerns: page.commonConcerns,
    approachHeading: page.approachHeading,
    approachBody: rich(`${page.slug}-approach`, ...page.approachBody),
    whatToExpect: rich(`${page.slug}-expect`, ...page.whatToExpect),
    faqs: page.faqs.map(([question, ...answer], index) =>
      faq(`${page.slug}-faq-${index}`, question, ...answer),
    ),
    relatedPosts: page.relatedPosts.map((id) =>
      reference(`related-post-${id}`, id),
    ),
  };
}

const pageDocuments: Array<Record<string, unknown> & { _id: string }> =
  specialties.map(specialtyDocument);

/* ------------------------------------ Link stage ----------------------------------- */

type Item = { _key: string; [key: string]: unknown };

const appendedLinks: Record<string, { field: string; markdown: string }> = {
  "specialty-postpartum-depression-therapy": {
    field: "overview",
    markdown:
      "Live elsewhere in New York, or find it hard to leave home with a baby? See [online postpartum therapy across New York](/specialties/online-postpartum-therapy).",
  },
  "specialty-postpartum-anxiety-therapy": {
    field: "overview",
    markdown:
      "Live elsewhere in New York, or find it hard to leave home with a baby? See [online postpartum therapy across New York](/specialties/online-postpartum-therapy).",
  },
  "specialty-perinatal-postpartum-support": {
    field: "overview",
    markdown:
      "For new and expecting parents outside Rochester, see [online postpartum therapy across New York](/specialties/online-postpartum-therapy), and the [postpartum guide](/guides/postpartum) for plain-language answers with sources.",
  },
  "specialty-online-therapy": {
    field: "overview",
    markdown:
      "New and expecting parents can read more on [online postpartum therapy across New York](/specialties/online-postpartum-therapy).",
  },
};

const hubReferences = specialties.map((page) =>
  reference(`specialties-reference-${page.slug}`, page._id),
);

function withAppended(blocks: unknown, key: string, markdown: string) {
  if (!Array.isArray(blocks)) throw new Error(`Expected rich text for ${key}`);
  return [
    ...(blocks as Item[]).filter((block) => !block._key.startsWith(key)),
    ...rich(key, markdown),
  ];
}

function buildLinkPatch(document: MigrationDocument): MigrationPatch {
  const id = document._id;
  if (id === "specialtiesPage") {
    const current = document.specialties as Item[];
    const existing = current.filter(
      (item) => !hubReferences.some((ref) => ref._key === item._key),
    );
    return { id, values: { specialties: [...existing, ...hubReferences] } };
  }
  const link = appendedLinks[id];
  if (!link) throw new Error(`Unexpected document: ${id}`);
  return {
    id,
    values: {
      [link.field]: withAppended(
        document[link.field],
        `${id}-nov18b-link`,
        link.markdown,
      ),
    },
  };
}

/* ------------------------------------- Runner -------------------------------------- */

function option(name: string) {
  const index = process.argv.indexOf(name);
  const value = index < 0 ? undefined : process.argv[index + 1];
  if (index >= 0 && (!value || value.startsWith("--")))
    throw new Error(`Missing value for ${name}`);
  return value;
}

/** Fields a create writes; an existing document is compared and patched on these only. */
function contentValues(document: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(document).filter(([key]) => !key.startsWith("_")),
  );
}

async function main() {
  const stage = option("--stage");
  const planPath = option("--plan");
  const backupPath = option("--backup");
  const apply = process.argv.includes("--apply");
  if (stage !== "pages" && stage !== "links")
    throw new Error("Use --stage pages or --stage links.");
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

  const targets =
    stage === "pages"
      ? pageDocuments.map((document) => document._id)
      : ["specialtiesPage", ...Object.keys(appendedLinks)];
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

  let creates: Array<Record<string, unknown>> = [];
  let patches: MigrationPatch[];
  if (stage === "pages") {
    const posts = await client.fetch<string[]>('*[_type == "post"]._id');
    for (const page of specialties)
      for (const id of page.relatedPosts)
        if (!posts.includes(id)) throw new Error(`Missing related post ${id}`);
    creates = pageDocuments.filter(
      (document) => !documents.some((item) => item._id === document._id),
    );
    patches = [
      ...pageDocuments
        .filter((document) =>
          documents.some((item) => item._id === document._id),
        )
        .map((document) => ({
          id: document._id,
          values: contentValues(document),
        })),
    ];
  } else {
    for (const id of targets)
      if (!documents.some((document) => document._id === id))
        throw new Error(`Missing published document: ${id}`);
    for (const page of specialties) {
      const live = await client.fetch<{ pageStatus?: string } | null>(
        "*[_id == $id][0]{pageStatus}",
        { id: page._id },
      );
      if (live?.pageStatus !== "published")
        throw new Error(`Apply the pages stage first: ${page._id}`);
    }
    patches = documents.map(buildLinkPatch);
  }

  const plan = {
    ...buildMigrationPlan(
      { projectId, dataset, scope: `online-postpartum-nov18-${stage}` },
      patches,
      documents,
    ),
    creates,
  };
  process.stdout.write(
    [
      ...plan.creates.map((document) => `create ${document._id}`),
      ...plan.changes.map(
        (change) =>
          `patch ${change.id}: ${change.fields.map((field) => field.path).join(", ")}`,
      ),
    ].join("\n") + "\n",
  );
  if (!apply) {
    fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`, {
      flag: "wx",
      mode: 0o600,
    });
    return;
  }
  assertReviewedPlan(JSON.parse(fs.readFileSync(planPath, "utf8")), plan);
  if (!plan.changes.length && !plan.creates.length) return;
  fs.writeFileSync(
    backupPath!,
    `${JSON.stringify({ plan, documents }, null, 2)}\n`,
    { flag: "wx", mode: 0o600 },
  );
  let transaction = client.transaction();
  for (const document of plan.creates)
    transaction = transaction.create(
      document as { _id: string; _type: string },
    );
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
    tag: `seo-edits-nov18-${stage}`,
  });
  process.stdout.write(`Applied ${stage} stage.\n`);
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Specialty pages migration failed",
  );
  process.exitCode = 1;
});

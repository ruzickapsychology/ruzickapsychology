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
 * 18 Nov 2026 audit follow-up: two new specialty pages (marriage counseling,
 * online therapy across New York), a broader practice description for
 * structured data, and links from existing pages to the new pages and to the
 * Imago page.
 *
 * The pages state only practice facts already published on the site (fees,
 * session blocks, virtual-care rules, the couples workshop, Willow's line on
 * /resources) and the Monroe County figures from our own /research study.
 * They make no research claims, so they carry no sources list. They avoid
 * "certified" for Imago until Christina confirms her credential.
 *
 * Stages:
 * - `pages` creates (or updates) the two specialty documents and the
 *   siteSettings tagline. Older code ignores the new documents, so this is
 *   safe to apply before the matching code deploys.
 * - `links` adds the new pages to the specialties hub and links them from
 *   existing specialty pages and one blog post. Apply it after the code that
 *   serves the new routes is live.
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
const couplesBlock =
  "Couples appointments are scheduled in a 75-minute block, with 60 minutes face to face and 15 minutes for documentation and treatment planning. Longer sessions and intensives are available by request.";

/* --------------------------------- Specialty pages -------------------------------- */

const specialties = [
  {
    _id: "specialty-marriage-counseling",
    slug: "marriage-counseling",
    order: 8,
    title: "Marriage Counseling",
    pageHeading: "Marriage Counseling in Rochester, NY",
    summary:
      "Counseling for spouses caught in the same arguments, growing distance or a hard season they want to get through together.",
    intro:
      "Marriage counseling for spouses who feel stuck in the same arguments or far apart, and want to understand what keeps happening between them and find their way back to each other.",
    overview: [
      "Most married couples who come to counseling are not short on love or effort. They are tired. The same argument comes back about a new topic, one of you pushes for a conversation while the other pulls away, and small moments start to carry years of hurt.",
      "Marriage counseling gives you protected time to slow that down with someone who is not on either side. The focus is the pattern between you: what each of you reaches for, what each of you protects, and why it is so hard to stay connected under stress.",
      "Dr. Christina Ruzicka, a licensed clinical psychologist, works with married couples at her South Avenue office in Rochester, and by video when both spouses are in New York and the format fits. Her couples work draws on [Imago Relationship Therapy](/specialties/imago-relationship-therapy). The same approach is open to couples who are not married; see [couples therapy](/specialties/couples-therapy).",
      "If the strain began around pregnancy or a new baby, [perinatal and postpartum therapy](/specialties/perinatal-postpartum-therapy) may also help. For local context, Monroe County courts granted 1,387 divorces in 2023, the year 3,008 couples married in the county ([our Monroe County marriage and divorce data](/research/monroe-county-divorce-couples)).",
    ],
    commonConcerns: [
      "The same argument keeps coming back, whatever the topic",
      "One of you pushes to talk while the other pulls away",
      "You feel more like roommates or co-parents than partners",
      "A new baby, parenting, work or a move has changed the marriage",
      "Resentment has built up and apologies no longer land",
      "You want to strengthen the marriage before problems harden",
    ],
    approachHeading: "Looking at the pattern, not picking a side",
    approachBody: [
      "Christina does not decide who is right. Sessions focus on the cycle that takes over when you disagree, and on what each of you feels and needs underneath it. Naming that cycle together can lower the temperature enough for both of you to be heard.",
      "Her couples work draws on Imago Relationship Therapy, which treats conflict as information about the relationship rather than proof that it has failed. Its structured dialogue has one partner speak while the other listens and reflects back, without defending or correcting. You practice it in session and then at home.",
      "Christina stays attentive to each partner's history, identity and circumstances. The aim is not perfect communication. It is a more reliable way back to each other after the hard moments every marriage has.",
    ],
    whatToExpect: [
      "Early sessions focus on what brings you in, the history of the marriage, and what each of you hopes will change. Christina will also help name the cycle that tends to take over.",
      "Later sessions are active and structured. You may practice guided dialogue, slow down charged conversations as they happen, and put criticism or withdrawal into words your spouse can hear more easily.",
      `${couplesBlock} For structured practice alongside other couples, see the monthly [Stronger Together couples workshop](/specialties/group-therapy).`,
      "If there is ongoing abuse, intimidation or fear of retaliation in the relationship, joint sessions may not be safe, and individual support and safety planning come first. Willow Domestic Violence Center offers free, confidential help 24/7: call or text (585) 222-SAFE (7233). More options are on the [resources page](/resources). If anyone is in immediate danger, call 911.",
    ],
    faqs: [
      [
        "Is marriage counseling different from couples therapy?",
        "Not in method. Marriage counseling is couples therapy for spouses, and Christina uses the same approach with married and unmarried couples. This page focuses on concerns that are common in marriages; [couples therapy](/specialties/couples-therapy) describes her couples work more broadly.",
      ],
      [
        "What if my spouse does not want to come?",
        "Couples sessions work when both partners take part willingly. If your spouse is not ready, you can still use the free consultation to talk through options, including [individual therapy](/specialties/individual-therapy) to look at your side of the pattern.",
      ],
      [
        "Do we need to be in crisis to start?",
        "No. Some couples come during a hard stretch. Others come to strengthen the marriage before a transition, such as a new baby, a move or children leaving home, or to change a pattern before it hardens.",
      ],
      [
        "What if we are not sure we want to stay married?",
        "You can still reach out. The consultation is a place to talk honestly about where things stand and whether couples counseling is the right format for you right now.",
      ],
      [
        "Can marriage counseling be online?",
        "Yes, when both spouses are physically in New York and the format is clinically appropriate. See [online therapy across New York](/specialties/online-therapy).",
      ],
      [
        "What does marriage counseling cost, and does insurance cover it?",
        "Couples sessions are $275 for a 75-minute block, paid by card, HSA, FSA or check. Christina is in network with Aetna through Headway for individual therapy only, so couples sessions are self-pay. Details are on the [Pricing page](/pricing).",
      ],
    ],
    relatedPosts: ["post-finding-your-footing-after-change"],
  },
  {
    _id: "specialty-online-therapy",
    slug: "online-therapy",
    order: 9,
    title: "Online Therapy",
    pageHeading: "Online Therapy Across New York",
    summary:
      "Secure video sessions for adults, couples and new parents anywhere in New York, with the same psychologist who sees clients on South Avenue.",
    intro:
      "Therapy by secure video with Dr. Christina Ruzicka for adults, couples and new or expecting parents who live anywhere in New York State.",
    overview: [
      "Getting to an office is not always realistic. You may live outside Rochester, have a newborn at home, work long days, or simply find it easier to talk from your own space. Online therapy brings the same care to wherever you are in New York.",
      "Dr. Christina Ruzicka is a licensed clinical psychologist (New York license 024357). She sees clients in person at her South Avenue office in Rochester and by secure video across the state. Virtual sessions use SimplePractice or Zoom, and you must be physically in New York for each session.",
      "If you would like to combine in-person and online sessions, ask about it in the free 15-minute consultation.",
    ],
    commonConcerns: [
      "You live in New York but outside easy reach of Rochester",
      "You are pregnant or caring for a new baby, and leaving home is hard",
      "Your schedule leaves little room for travel time",
      "You and your partner want couples sessions from home",
      "You find it easier to open up from your own space",
      "Anxiety makes getting to an appointment feel like a hurdle",
    ],
    approachHeading: "The same therapy, by video",
    approachBody: [
      "Online sessions follow the same approach as sessions in the office. Christina's style is relational, psychodynamic, warm and active, with tools from Acceptance and Commitment Therapy and Dialectical Behavior Therapy when they fit. Her couples work draws on Imago Relationship Therapy.",
      "Online sessions are available for [individual therapy](/specialties/individual-therapy), [anxiety therapy](/specialties/anxiety-therapy), [couples therapy](/specialties/couples-therapy), [marriage counseling](/specialties/marriage-counseling), [Imago Relationship Therapy](/specialties/imago-relationship-therapy), and [perinatal and postpartum therapy](/specialties/perinatal-postpartum-therapy), including [postpartum anxiety](/specialties/postpartum-anxiety-therapy) and [postpartum depression](/specialties/postpartum-depression-therapy). The [Stronger Together couples workshop](/specialties/group-therapy) meets in person.",
      "Couples sessions can be online when both partners are in New York and the format is clinically appropriate. The consultation is the place to decide that together.",
    ],
    whatToExpect: [
      "Before the first session, you receive access to a secure client portal, where you complete intake paperwork, practice policies and consent forms.",
      "For each session, find a private place where you will not be overheard, with a steady internet connection and a device with a camera and microphone. Headphones can help with privacy.",
      "Individual appointments are scheduled in a 60-minute block, with 45–50 minutes face to face. Couples appointments are scheduled in a 75-minute block, with 60 minutes face to face. Current hours are on the [contact page](/contact).",
      whenUrgent,
    ],
    faqs: [
      [
        "Do I have to live in Rochester?",
        "No. You can live anywhere in New York State. You need to be physically in New York during each online session.",
      ],
      [
        "What if I am traveling outside New York?",
        "Online sessions can only take place while you are in New York. If you will be out of state, talk with Christina about rescheduling.",
      ],
      [
        "Which video platform do you use?",
        "Sessions use SimplePractice or Zoom.",
      ],
      [
        "Is the couples workshop available online?",
        "No. Stronger Together meets in person at 1577 South Ave in Rochester. See the [workshop page](/specialties/group-therapy) for dates.",
      ],
      ["Do you take insurance?", insuranceIndividual],
    ],
    relatedPosts: ["post-repairing-connection-in-relationships"],
  },
];

const tagline =
  "Evidence-based psychotherapy in Rochester, NY and by video across New York: individual and anxiety therapy, Imago-informed couples therapy and marriage counseling, a couples workshop, and perinatal and postpartum therapy for new and expecting parents.";

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
  "specialty-couples-counseling": {
    field: "overview",
    markdown:
      "For married couples, see [marriage counseling](/specialties/marriage-counseling). Sessions can also take place by video; see [online therapy across New York](/specialties/online-therapy).",
  },
  "specialty-individual-therapy": {
    field: "overview",
    markdown:
      "You can also meet by video from anywhere in New York; see [online therapy](/specialties/online-therapy).",
  },
  "specialty-perinatal-postpartum-support": {
    field: "overview",
    markdown:
      "If leaving home with a new baby is hard, sessions can take place by video; see [online therapy across New York](/specialties/online-therapy).",
  },
  "specialty-anxiety-therapy": {
    field: "overview",
    markdown:
      "If getting to an office feels like a hurdle, [online therapy](/specialties/online-therapy) is available across New York.",
  },
  "specialty-imago-relationship-therapy": {
    field: "overview",
    markdown:
      "For spouses, see [marriage counseling in Rochester](/specialties/marriage-counseling).",
  },
  "post-finding-your-footing-after-change": {
    field: "body",
    markdown:
      "To learn more about this approach, see [Imago Relationship Therapy](/specialties/imago-relationship-therapy) and [couples therapy in Rochester](/specialties/couples-therapy).",
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
        `${id}-nov18-link`,
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
      ? [...pageDocuments.map((document) => document._id), "siteSettings"]
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
    if (!documents.some((document) => document._id === "siteSettings"))
      throw new Error("Missing published document: siteSettings");
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
      { id: "siteSettings", values: { tagline } },
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
      { projectId, dataset, scope: `seo-edits-nov18-${stage}` },
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

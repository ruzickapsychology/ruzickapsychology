import fs from "node:fs";
import path from "node:path";
import { markdownToPortableText } from "@portabletext/markdown";
import matter from "gray-matter";
import { getCliClient } from "sanity/cli";

import {
  assertReviewedPlan,
  buildMigrationPlan,
  buildReviewedDraftPatches,
  stableContentKeys,
  type MigrationDocument,
} from "./seo-migration-plan";
import {
  articleFormattingId,
  buildArticleFormattingPatch,
} from "./seo-article-formatting";
import { contact } from "../src/content/contact";

import { about } from "../src/content/about";
import { faq } from "../src/content/faq";
import { home } from "../src/content/home";
import { pricing } from "../src/content/pricing";
import { site } from "../src/content/site";
import { specialties } from "../src/content/specialties";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-24";
const client = getCliClient({ apiVersion }).withConfig({ useCdn: false });
const rawClient = client.withConfig({ perspective: "raw" });
const apply = process.argv.includes("--apply");
const servicePagesOnly = process.argv.includes("--service-pages-only");
const websiteCopyOnly = process.argv.includes("--website-copy-only");
const articleFormattingOnly = process.argv.includes(
  "--article-formatting-only",
);
const allContent = process.argv.includes("--all-content");
function option(name: string) {
  const index = process.argv.indexOf(name);
  const value = index < 0 ? undefined : process.argv[index + 1];
  if (index >= 0 && (!value || value.startsWith("--")))
    throw new Error(`Missing value for ${name}`);
  return value;
}
const planPath = option("--plan");
const backupPath = option("--backup");
const websiteDocument = option("--document");
const includeReviewedDrafts = process.argv.includes(
  "--include-reviewed-drafts",
);
const groupPageOnly = process.argv.includes("--group-page-only");
const servicePageScopeConfirmed = process.argv.includes(
  "--confirm-service-page-scope",
);
const clinicalReviewConfirmed = process.argv.includes(
  "--confirm-clinical-review",
);
const insuranceConfirmed = process.argv.includes("--confirm-insurance");
const root = process.cwd();

const specialtyIds = [
  "specialty-individual-therapy",
  "specialty-couples-counseling",
  "specialty-perinatal-postpartum-support",
  "specialty-group-therapy",
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function textBlock(text: string, key: string) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        text,
        marks: [],
      },
    ],
  };
}

function paragraphsToPortableText(
  paragraphs: readonly string[],
  prefix: string,
) {
  return paragraphs.map((paragraph, index) =>
    textBlock(paragraph, `${prefix}-${index}`),
  );
}

function ref(id: string, prefix: string) {
  return {
    _key: `${prefix}-${slugify(id)}`,
    _type: "reference",
    _ref: id,
  };
}

function requiredPostId(
  postIdBySlug: ReadonlyMap<string, string>,
  slug: string,
) {
  const id = postIdBySlug.get(slug);
  if (!id) {
    throw new Error(`No published post found for required slug: ${slug}`);
  }
  return id;
}

function buildServicePatches(
  postIdBySlug: ReadonlyMap<string, string>,
  newPageFieldsOnly = false,
  includedSlugs?: ReadonlySet<string>,
) {
  return specialties.items.flatMap((item, index) => {
    if (includedSlugs && !includedSlugs.has(item.slug)) return [];

    const base = {
      title: item.title,
      slug: { _type: "slug", current: item.slug },
      summary: item.body,
      pageStatus: item.pageStatus,
      order: index,
      active: true,
    };

    const pageValues =
      "pageHeading" in item
        ? {
            pageStatus: item.pageStatus,
            pageHeading: item.pageHeading,
            intro: item.intro,
            overview: paragraphsToPortableText(
              item.overview,
              `${item.slug}-overview`,
            ),
            commonConcerns: item.commonConcerns,
            approachHeading: item.approachHeading,
            approachBody: paragraphsToPortableText(
              item.approachBody,
              `${item.slug}-approach`,
            ),
            whatToExpect: paragraphsToPortableText(
              item.whatToExpect,
              `${item.slug}-expect`,
            ),
            faqs: item.faqs.map((faqItem, faqIndex) => ({
              _key: `service-faq-${slugify(`${item.slug}-${faqIndex}`)}`,
              question: faqItem.question,
              answerRichText: paragraphsToPortableText(
                faqItem.answer,
                `${item.slug}-faq-${faqIndex}`,
              ),
            })),
            relatedPosts: item.relatedPostSlugs.map((slug) =>
              ref(requiredPostId(postIdBySlug, slug), "related-post"),
            ),
          }
        : undefined;

    return [
      {
        id: specialtyIds[index],
        values:
          newPageFieldsOnly && pageValues
            ? pageValues
            : pageValues
              ? { ...base, ...pageValues }
              : base,
      },
    ];
  });
}

const singletonPatches = [
  {
    id: "siteSettings",
    values: {
      name: site.name,
      legalName: site.legalName,
      practitioner: site.practitioner,
      email: site.email,
      phone: site.phone,
      address: site.address,
      url: site.url,
      tagline: site.tagline,
      areaServed: site.areaServed,
      externalProfiles: site.externalProfiles.map((profile) => ({
        _key: `external-profile-${slugify(profile.label)}`,
        ...profile,
      })),
    },
  },
  {
    id: "homePage",
    values: {
      "hero.kicker": home.hero.kicker,
      "hero.heading": home.hero.heading,
      "hero.body": home.hero.body,
      "specialtiesSection.eyebrow": home.specialties.eyebrow,
      "specialtiesSection.heading": home.specialties.heading,
    },
  },
  {
    id: "specialtiesPage",
    values: {
      "header.eyebrow": specialties.eyebrow,
      "header.heading": specialties.heading,
      "header.intro": specialties.intro,
    },
  },
  {
    id: "aboutPage",
    values: {
      intro: paragraphsToPortableText(about.intro, "about-intro"),
      'credentialGroups[_key=="credentialgroups-specialized-training"].license':
        about.training.license,
      "space.eyebrow": about.space.eyebrow,
      "space.heading": about.space.heading,
      "space.body": about.space.body,
    },
  },
  {
    id: "pricingPage",
    values: {
      "insurance.heading": pricing.insurance.heading,
      "insurance.body": paragraphsToPortableText(
        pricing.insurance.body,
        "pricing-insurance",
      ),
      "reimbursementGuide.eyebrow": pricing.reimbursementGuide.eyebrow,
      "reimbursementGuide.heading": pricing.reimbursementGuide.heading,
      "reimbursementGuide.intro": pricing.reimbursementGuide.intro,
      "reimbursementGuide.items": pricing.reimbursementGuide.items.map(
        (item, index) => ({
          _key: `reimbursement-guide-${index}`,
          eyebrow: item.eyebrow,
          title: item.title,
          body: paragraphsToPortableText(
            item.body,
            `pricing-reimbursement-${index}`,
          ),
        }),
      ),
    },
  },
  {
    id: "faqPage",
    values: {
      items: faq.items.map((item) => ({
        _key: `faq-${slugify(item.q)}`,
        question: item.q,
        answerRichText: stableContentKeys(
          markdownToPortableText(item.a.join("\n\n")),
        ),
      })),
    },
  },
] as const;

function blogFixture(fileName: string) {
  const source = fs.readFileSync(
    path.join(root, "src/content/blog", fileName),
    "utf8",
  );
  const { data, content } = matter(source);
  return {
    title: String(data.title),
    slug: { _type: "slug", current: String(data.slug) },
    excerpt: String(data.excerpt),
    body: stableContentKeys(markdownToPortableText(content)),
  };
}

function buildPostPatches(postIdBySlug: ReadonlyMap<string, string>) {
  return [
    {
      id: requiredPostId(
        postIdBySlug,
        "why-we-choose-the-partners-we-do-the-surprising-psychology-behind-romantic-attraction",
      ),
      values: {
        ...blogFixture("finding-your-footing-after-change.md"),
        sources: [
          {
            _key: "hazan-shaver-1987",
            title: "Romantic love conceptualized as an attachment process",
            citation:
              "Hazan, C., & Shaver, P. (1987). Journal of Personality and Social Psychology, 52(3), 511–524.",
            url: "https://doi.org/10.1037/0022-3514.52.3.511",
          },
          {
            _key: "gehlert-et-al-2017",
            title:
              "Randomized controlled trial of Imago Relationship Therapy: Exploring statistical and clinical significance",
            citation:
              "Gehlert, N. C., Schmidt, C. D., Giegerich, V., & Luquet, W. (2017). Journal of Couple & Relationship Therapy, 16(3), 188–209.",
            url: "https://doi.org/10.1080/15332691.2016.1253518",
          },
        ],
      },
    },
    {
      id: requiredPostId(
        postIdBySlug,
        "beyond-the-buzzword-what-does-doing-the-work-actually-mean-in-therapy",
      ),
      values: {
        ...blogFixture("repairing-connection-in-relationships.md"),
        sources: [
          {
            _key: "fairbrother-et-al-2016",
            title: "Perinatal anxiety disorder prevalence and incidence",
            citation:
              "Fairbrother, N., Janssen, P., Antony, M. M., Tucker, E., & Young, A. H. (2016). Journal of Affective Disorders, 200, 148–155.",
            url: "https://doi.org/10.1016/j.jad.2015.12.082",
          },
        ],
      },
    },
  ] as const;
}

async function main() {
  if (
    [
      servicePagesOnly,
      groupPageOnly,
      websiteCopyOnly,
      articleFormattingOnly,
      allContent,
    ].filter(Boolean).length !== 1
  ) {
    throw new Error(
      "Choose exactly one scope: --website-copy-only, --service-pages-only, --group-page-only, --article-formatting-only, or --all-content.",
    );
  }

  if (
    websiteDocument &&
    (!websiteCopyOnly || !["homePage", "contactPage"].includes(websiteDocument))
  ) {
    throw new Error(
      "--document supports only homePage or contactPage within --website-copy-only.",
    );
  }

  if (includeReviewedDrafts) buildReviewedDraftPatches(websiteCopyOnly, [], []);

  const restrictedServiceScope = servicePagesOnly || groupPageOnly;
  const missingConfirmations =
    websiteCopyOnly || articleFormattingOnly
      ? []
      : restrictedServiceScope
        ? [
            !servicePageScopeConfirmed && "--confirm-service-page-scope",
            !clinicalReviewConfirmed && "--confirm-clinical-review",
          ].filter(Boolean)
        : [
            !clinicalReviewConfirmed && "--confirm-clinical-review",
            !insuranceConfirmed && "--confirm-insurance",
          ].filter(Boolean);

  if (apply && missingConfirmations.length > 0) {
    throw new Error(
      restrictedServiceScope
        ? `Refusing to publish restricted service-page content without scope and clinical-review confirmation. Re-run with ${missingConfirmations.join(
            " and ",
          )}.`
        : `Refusing to publish unconfirmed content. Re-run with ${missingConfirmations.join(
            " and ",
          )} after Christina has approved the clinical copy and insurance statement.`,
    );
  }

  if (!planPath)
    throw new Error(
      "Provide --plan PATH to save or apply the exact reviewed preview.",
    );
  if (apply && !backupPath)
    throw new Error(
      "Applying requires --backup PATH for the pre-mutation document backup.",
    );

  const specialtyItemsInScope =
    websiteCopyOnly || articleFormattingOnly
      ? []
      : groupPageOnly
        ? specialties.items.filter((item) => item.slug === "group-therapy")
        : servicePagesOnly
          ? specialties.items.filter((item) => "pageHeading" in item)
          : specialties.items;
  const requiredPostSlugs = [
    ...new Set(
      specialtyItemsInScope.flatMap((item) =>
        "relatedPostSlugs" in item ? item.relatedPostSlugs : [],
      ),
    ),
  ];
  const resolvedPosts = await client.fetch<
    Array<{ _id: string; slug: string }>
  >(
    `*[
      _type == "post" &&
      !(_id in path("drafts.**")) &&
      slug.current in $postSlugs
    ]{
      _id,
      "slug": slug.current
    }`,
    { postSlugs: requiredPostSlugs },
  );
  const postIdBySlug = new Map(
    resolvedPosts.map((post) => [post.slug, post._id]),
  );
  const duplicatePostSlugs = requiredPostSlugs.filter(
    (slug) => resolvedPosts.filter((post) => post.slug === slug).length > 1,
  );
  if (duplicatePostSlugs.length) {
    throw new Error(
      `Migration found multiple published posts for these slugs: ${duplicatePostSlugs.join(
        ", ",
      )}`,
    );
  }
  const missingPostSlugs = requiredPostSlugs.filter(
    (slug) => !postIdBySlug.has(slug),
  );
  if (missingPostSlugs.length) {
    throw new Error(
      `Migration requires published posts with these slugs: ${missingPostSlugs.join(
        ", ",
      )}`,
    );
  }

  const servicePatches =
    websiteCopyOnly || articleFormattingOnly
      ? []
      : buildServicePatches(
          postIdBySlug,
          restrictedServiceScope,
          groupPageOnly ? new Set(["group-therapy"]) : undefined,
        ).filter(
          (patch) =>
            (!restrictedServiceScope || "pageHeading" in patch.values) &&
            (!groupPageOnly || patch.id === "specialty-group-therapy"),
        );
  const expectedRestrictedPatchCount = groupPageOnly
    ? 1
    : servicePagesOnly
      ? 4
      : undefined;
  if (
    expectedRestrictedPatchCount !== undefined &&
    servicePatches.length !== expectedRestrictedPatchCount
  ) {
    throw new Error(
      `Expected exactly ${expectedRestrictedPatchCount} restricted service page patches, found ${servicePatches.length}.`,
    );
  }
  const postPatches =
    restrictedServiceScope || websiteCopyOnly || articleFormattingOnly
      ? []
      : buildPostPatches(postIdBySlug);
  const singletonPatchesInScope = websiteCopyOnly
    ? [
        { id: "homePage", values: { "hero.heading": home.hero.heading } },
        { id: "contactPage", values: { formNote: contact.formNote } },
      ].filter((patch) => !websiteDocument || patch.id === websiteDocument)
    : restrictedServiceScope || articleFormattingOnly
      ? []
      : singletonPatches;
  const targets = [
    ...(articleFormattingOnly ? [articleFormattingId] : []),
    ...servicePatches.map((patch) => patch.id),
    ...singletonPatchesInScope.map((patch) => patch.id),
    ...postPatches.map((patch) => patch.id),
  ];
  const existing = await rawClient.fetch<MigrationDocument[]>(
    `*[_id in $targets]`,
    { targets },
  );
  const existingIds = new Set(existing.map((document) => document._id));
  const missing = targets.filter((id) => !existingIds.has(id));

  if (missing.length) {
    throw new Error(`Migration targets are missing: ${missing.join(", ")}`);
  }

  const draftIds = targets.map((id) => `drafts.${id}`);
  const drafts = await rawClient.fetch<MigrationDocument[]>(
    `*[_id in $draftIds]`,
    { draftIds },
  );
  if (drafts.length && !includeReviewedDrafts) {
    throw new Error(
      `Refusing to migrate while relevant Sanity drafts exist. Review, publish, or discard these drafts first: ${drafts
        .map((draft) => draft._id)
        .join(", ")}`,
    );
  }

  const basePatches = [
    ...(articleFormattingOnly
      ? [
          buildArticleFormattingPatch(
            existing.find((document) => document._id === articleFormattingId)!,
          ),
        ]
      : []),
    ...servicePatches,
    ...singletonPatchesInScope,
    ...postPatches,
  ];
  const draftPatches = includeReviewedDrafts
    ? buildReviewedDraftPatches(websiteCopyOnly, basePatches, drafts)
    : [];
  const allDocuments = [...existing, ...(includeReviewedDrafts ? drafts : [])];
  const draftRevisions = drafts
    .map((draft) => ({ id: draft._id, revision: draft._rev }))
    .sort((a, b) => a.id.localeCompare(b.id));

  const config = client.config();
  if (!config.projectId || !config.dataset)
    throw new Error("Missing migration project/dataset");
  const plan = buildMigrationPlan(
    {
      projectId: config.projectId,
      dataset: config.dataset,
      ...(includeReviewedDrafts ? { reviewedDrafts: draftRevisions } : {}),
      scope: articleFormattingOnly
        ? "article-formatting"
        : websiteCopyOnly
          ? "website-copy"
          : groupPageOnly
            ? "group-page"
            : servicePagesOnly
              ? "service-pages"
              : "all-content",
    },
    [...basePatches, ...draftPatches],
    allDocuments,
  );
  process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
  if (!apply) {
    fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`, {
      flag: "wx",
      mode: 0o600,
    });
    process.stdout.write(
      `[seo-migration] Preview saved to ${planPath}. Review every before/after value before applying.\n`,
    );
    return;
  }
  assertReviewedPlan(JSON.parse(fs.readFileSync(planPath, "utf8")), plan);
  if (!plan.changes.length) {
    process.stdout.write("[seo-migration] No changes required.\n");
    return;
  }
  // Abort before any remote write if backup creation fails; never overwrite a backup.
  fs.writeFileSync(
    backupPath!,
    `${JSON.stringify(
      {
        projectId: config.projectId,
        dataset: config.dataset,
        createdAt: new Date().toISOString(),
        plan,
        documents: allDocuments.filter((document) =>
          plan.changes.some((change) => change.id === document._id),
        ),
      },
      null,
      2,
    )}\n`,
    { flag: "wx", mode: 0o600 },
  );
  // Recheck drafts immediately before committing. Sanity cannot atomically assert
  // draft nonexistence; coordinate a brief editorial freeze for publication.
  const newDrafts = await rawClient.fetch<Array<{ _id: string; _rev: string }>>(
    `*[_id in $draftIds]{_id, _rev}`,
    { draftIds },
  );
  assertReviewedPlan(
    draftRevisions,
    newDrafts
      .map((draft) => ({ id: draft._id, revision: draft._rev }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  );
  let transaction = client.transaction();
  for (const change of plan.changes) {
    transaction = transaction.patch(change.id, (builder) =>
      builder
        .ifRevisionId(change.revision)
        .set(
          Object.fromEntries(
            change.fields.map((field) => [field.path, field.after]),
          ),
        ),
    );
  }

  const result = await transaction.commit({
    visibility: "async",
    tag: "seo-service-pages-migration",
  });
  process.stdout.write(
    `[seo-migration] Applied ${result.results.length} patches.\n`,
  );
}

main().catch((error) => {
  // Client errors may contain authenticated request headers. Never log the object.
  console.error(
    "[seo-migration] Failed:",
    error instanceof Error ? error.message : "Unknown migration error",
  );
  process.exit(1);
});

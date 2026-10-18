import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { markdownToPortableText } from "@portabletext/markdown";
import { getCliClient } from "sanity/cli";

import { about } from "../src/content/about";
import { contact } from "../src/content/contact";
import { faq } from "../src/content/faq";
import { home } from "../src/content/home";
import { pricing } from "../src/content/pricing";
import { site } from "../src/content/site";
import { specialties } from "../src/content/specialties";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-24";
const client = getCliClient({ apiVersion }).withConfig({ useCdn: false });
const dryRun =
  process.env.SANITY_DRY_RUN === "1" || process.argv.includes("--dry-run");
const overwriteRepeatables =
  process.env.SANITY_SEED_OVERWRITE_REPEATABLES === "1";

const root = process.cwd();
const blogDir = path.join(root, "src/content/blog");

function log(message: string, details?: unknown) {
  const suffix = details ? ` ${JSON.stringify(details)}` : "";
  process.stdout.write(`${message}${suffix}\n`);
}

type SeedDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

const specialtyIds = [
  "specialty-individual-therapy",
  "specialty-couples-counseling",
  "specialty-perinatal-postpartum-support",
  "specialty-group-therapy",
] as const;

const postIdByPublicSlug: Record<string, string> = {
  "why-we-choose-the-partners-we-do-the-surprising-psychology-behind-romantic-attraction":
    "post-finding-your-footing-after-change",
  "beyond-the-buzzword-what-does-doing-the-work-actually-mean-in-therapy":
    "post-repairing-connection-in-relationships",
  "welcome-to-the-practice": "post-welcome-to-the-practice",
};

const postSourcesByPublicSlug: Record<
  string,
  Array<{ _key: string; title: string; citation: string; url: string }>
> = {
  "why-we-choose-the-partners-we-do-the-surprising-psychology-behind-romantic-attraction":
    [
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
  "beyond-the-buzzword-what-does-doing-the-work-actually-mean-in-therapy": [
    {
      _key: "fairbrother-et-al-2016",
      title: "Perinatal anxiety disorder prevalence and incidence",
      citation:
        "Fairbrother, N., Janssen, P., Antony, M. M., Tucker, E., & Young, A. H. (2016). Journal of Affective Disorders, 200, 148–155.",
      url: "https://doi.org/10.1016/j.jad.2015.12.082",
    },
  ],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function keyFor(prefix: string, value: string | number) {
  return `${prefix}-${slugify(String(value))}`;
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

async function uploadImage(relativePath: string, alt: string) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    console.warn(`[seed] Missing image: ${relativePath}`);
    return undefined;
  }

  const asset = dryRun
    ? { _id: `dry-run-${path.basename(filePath)}` }
    : await client.assets.upload("image", fs.createReadStream(filePath), {
        filename: path.basename(filePath),
      });

  return {
    _type: "imageWithAlt",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
    alt,
  };
}

function ref(_ref: string, _key = keyFor("ref", _ref)) {
  return { _key, _type: "reference", _ref };
}

async function buildDocuments(): Promise<SeedDocument[]> {
  const images = {
    hero: await uploadImage("public/images/hero.jpg", "Soft floral background"),
    homePortrait: await uploadImage(
      "public/images/portrait.jpg",
      "Dr. Christina Ruzicka",
    ),
    portrait: await uploadImage(
      "public/images/portrait-large.jpg",
      "Dr. Christina Ruzicka",
    ),
    ctaFloral: await uploadImage(
      "public/images/cta-floral.jpg",
      "Floral background",
    ),
    contactRoses: await uploadImage(
      "public/images/contact-roses.jpg",
      "Soft pink roses",
    ),
    imago: await uploadImage(
      "public/images/imago-bg.jpg",
      "Floral therapy background",
    ),
    therapyRoom: await uploadImage(
      "public/images/therapy-room.jpg",
      "Therapy office seating area",
    ),
    bouquet: await uploadImage(
      "public/images/bouquet.jpg",
      "Bouquet of flowers",
    ),
  };

  const specialtyDocs = specialties.items.map((item, index) => ({
    _id: specialtyIds[index],
    _type: "specialty",
    title: item.title,
    slug: { _type: "slug", current: item.slug },
    summary: item.body,
    pageStatus: item.pageStatus,
    ...("pageHeading" in item
      ? {
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
            _key: keyFor("service-faq", `${item.slug}-${faqIndex}`),
            question: faqItem.question,
            answerRichText: paragraphsToPortableText(
              faqItem.answer,
              `${item.slug}-faq-${faqIndex}`,
            ),
          })),
          relatedPosts: item.relatedPostSlugs
            .map((slug) => postIdByPublicSlug[slug])
            .filter(Boolean)
            .map((id) => ref(id, keyFor("related-post", id))),
        }
      : {}),
    details: item.details,
    order: index,
    active: true,
  }));

  const singletonDocs = [
    {
      _id: "siteSettings",
      _type: "siteSettings",
      name: site.name,
      legalName: site.legalName,
      practitioner: site.practitioner,
      email: site.email,
      phone: site.phone,
      safetyNotice: site.safetyNotice,
      address: site.address,
      hours: site.hours,
      portalUrl: site.portalUrl,
      availabilityStatus: site.availabilityStatus,
      availabilityBadgeMessages: site.availabilityBadgeMessages,
      availabilityMessaging: site.availabilityMessaging,
      consultationCtaLabel: site.consultationCtaLabel,
      url: site.url,
      tagline: site.tagline,
      areaServed: site.areaServed,
      externalProfiles: site.externalProfiles.map((profile) => ({
        _key: keyFor("external-profile", profile.label),
        ...profile,
      })),
    },
    {
      _id: "homePage",
      _type: "homePage",
      hero: {
        kicker: home.hero.kicker,
        heading: home.hero.heading,
        body: home.hero.body,
        ctaLabel: home.hero.cta,
        backgroundImage: images.hero,
      },
      specialtiesSection: {
        eyebrow: home.specialties.eyebrow,
        heading: home.specialties.heading,
        specialties: specialtyIds.map((id) => ref(id, keyFor("specialty", id))),
      },
      aboutPreview: {
        eyebrow: home.about.eyebrow,
        heading: home.about.heading,
        body: home.about.body,
        ctaLabel: home.about.cta,
        portraitImage: images.homePortrait,
      },
      ctaSection: {
        heading: home.cta.heading,
        body: home.cta.body,
        ctaLabel: home.cta.cta,
        backgroundImage: images.ctaFloral,
      },
    },
    {
      _id: "aboutPage",
      _type: "aboutPage",
      credentials: about.credentials,
      heading: about.heading,
      portraitImage: images.portrait,
      intro: paragraphsToPortableText(about.intro, "about-intro"),
      credentialGroups: [
        {
          _key: keyFor("credential-group", about.education.heading),
          heading: about.education.heading,
          items: about.education.items.map((item, index) => ({
            _key: keyFor("credential-item", `${index}-${item.title}`),
            ...item,
          })),
        },
        {
          _key: keyFor("credential-group", about.training.heading),
          heading: about.training.heading,
          items: about.training.items.map((item, index) => ({
            _key: keyFor("credential-item", `${index}-${item.title}`),
            ...item,
          })),
          license: about.training.license,
        },
      ],
      space: {
        ...about.space,
        interiorImage: images.therapyRoom,
      },
      philosophy: {
        ...about.philosophy,
        backgroundImage: images.bouquet,
      },
    },
    {
      _id: "specialtiesPage",
      _type: "specialtiesPage",
      header: {
        eyebrow: specialties.eyebrow,
        heading: specialties.heading,
        intro: specialties.intro,
      },
      specialties: specialtyIds.map((id) => ref(id, keyFor("specialty", id))),
      modality: {
        eyebrow: specialties.modality.eyebrow,
        heading: specialties.modality.heading,
        body: paragraphsToPortableText(
          specialties.modality.body,
          "specialties-modality",
        ),
        backgroundImage: images.imago,
      },
    },
    {
      _id: "pricingPage",
      _type: "pricingPage",
      header: {
        eyebrow: pricing.eyebrow,
        heading: pricing.heading,
        intro: pricing.intro,
      },
      fees: {
        heading: pricing.fees.heading,
        items: pricing.fees.items.map((item, index) => ({
          _key: keyFor("fee-item", `${index}-${item.label}`),
          ...item,
        })),
        note: pricing.fees.note,
      },
      insurance: {
        heading: pricing.insurance.heading,
        body: paragraphsToPortableText(
          pricing.insurance.body,
          "pricing-insurance",
        ),
      },
      reimbursementGuide: {
        eyebrow: pricing.reimbursementGuide.eyebrow,
        heading: pricing.reimbursementGuide.heading,
        intro: pricing.reimbursementGuide.intro,
        items: pricing.reimbursementGuide.items.map((item, index) => ({
          _key: keyFor("reimbursement-guide-item", `${index}-${item.title}`),
          eyebrow: item.eyebrow,
          title: item.title,
          body: paragraphsToPortableText(
            item.body,
            `pricing-reimbursement-guide-${index}`,
          ),
        })),
      },
      cta: {
        heading: pricing.cta.heading,
        body: pricing.cta.body,
        label: pricing.cta.cta,
      },
      ctaBackgroundImage: images.ctaFloral,
    },
    {
      _id: "contactPage",
      _type: "contactPage",
      header: {
        eyebrow: contact.eyebrow,
        heading: contact.heading,
        intro: contact.intro,
      },
      headerBackgroundImage: images.contactRoses,
      formNote: contact.formNote,
      process: {
        eyebrow: contact.expect.eyebrow,
        heading: contact.expect.heading,
        steps: contact.expect.steps.map((step) => ({
          _key: keyFor("process-step", `${step.n}-${step.title}`),
          number: step.n,
          title: step.title,
          body: step.body,
        })),
      },
    },
    {
      _id: "faqPage",
      _type: "faqPage",
      heading: faq.heading,
      intro: faq.intro,
      items: faq.items.map((item) => ({
        _key: keyFor("faq-item", item.q),
        question: item.q,
        answerRichText: markdownToPortableText(item.a.join("\n\n")),
      })),
      cta: {
        heading: "Still have a question?",
        body: "Start with a complimentary 15 minute call. No pressure, no commitment.",
        label: "Book a consultation",
      },
      ctaBackgroundImage: images.ctaFloral,
    },
  ];

  const postDocs = fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const source = fs.readFileSync(path.join(blogDir, file), "utf8");
      const { data, content } = matter(source);
      const title = String(data.title ?? slug);
      const publicSlug = String(data.slug ?? slug);
      const date =
        data.date instanceof Date
          ? data.date.toISOString()
          : new Date(String(data.date)).toISOString();

      return {
        _id: `post-${slug}`,
        _type: "post",
        title,
        slug: { _type: "slug", current: publicSlug },
        publishedAt: date,
        excerpt: String(data.excerpt ?? ""),
        body: markdownToPortableText(content),
        sources: postSourcesByPublicSlug[publicSlug],
      };
    });

  return [...specialtyDocs, ...singletonDocs, ...postDocs];
}

async function main() {
  const documents = await buildDocuments();

  log(
    `[seed] Prepared ${documents.length} documents${dryRun ? " (dry run)" : ""}.`,
  );

  if (!dryRun) {
    for (const document of documents) {
      if (document._type === "post" || document._type === "specialty") {
        if (overwriteRepeatables) {
          await client.createOrReplace(document);
          log(`[seed] Replaced repeatable ${document._id}`);
        } else {
          await client.createIfNotExists(document);
          log(`[seed] Ensured repeatable ${document._id}`);
        }
      } else {
        await client.createOrReplace(document);
        log(`[seed] Upserted singleton ${document._id}`);
      }
    }
  }

  const counts = dryRun
    ? null
    : await client.fetch(`{
        "siteSettings": count(*[_type == "siteSettings" && _id == "siteSettings"]),
        "pageSingletons": count(*[_id in ["homePage", "aboutPage", "specialtiesPage", "pricingPage", "contactPage", "faqPage"]]),
        "specialties": count(*[_type == "specialty"]),
        "posts": count(*[_type == "post"])
      }`);

  if (counts) {
    log("[seed] Validation counts:", counts);
  }
}

main().catch((error) => {
  console.error(
    "[seed] Failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exit(1);
});

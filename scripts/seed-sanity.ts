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
    slug: { _type: "slug", current: slugify(item.title) },
    summary: item.body,
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
      address: site.address,
      hours: site.hours,
      portalUrl: site.portalUrl,
      url: site.url,
      tagline: site.tagline,
      areaServed: site.areaServed,
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
        answer: item.a,
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
      const date =
        data.date instanceof Date
          ? data.date.toISOString()
          : new Date(String(data.date)).toISOString();

      return {
        _id: `post-${slug}`,
        _type: "post",
        title,
        slug: { _type: "slug", current: slug },
        publishedAt: date,
        excerpt: String(data.excerpt ?? ""),
        body: markdownToPortableText(content),
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
  console.error("[seed] Failed:", error);
  process.exit(1);
});

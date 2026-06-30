import { getCliClient } from "sanity/cli";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-24";
const client = getCliClient({ apiVersion }).withConfig({ useCdn: false });
const dryRun =
  process.env.SANITY_DRY_RUN === "1" || process.argv.includes("--dry-run");

const documentTypes = [
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

type JsonObject = {
  [key: string]: unknown;
};

type SanityDocument = JsonObject & {
  _id: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
};

function log(message: string, details?: unknown) {
  const suffix = details ? ` ${JSON.stringify(details)}` : "";
  process.stdout.write(`${message}${suffix}\n`);
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function keyBase(item: JsonObject, path: readonly string[], index: number) {
  const slug = isObject(item.slug) ? stringValue(item.slug.current) : undefined;
  const marker =
    stringValue(item._type) ??
    stringValue(item._ref) ??
    slug ??
    stringValue(item.title) ??
    stringValue(item.heading) ??
    stringValue(item.question) ??
    stringValue(item.label) ??
    stringValue(item.number) ??
    String(index);

  return slugify(`${path.join("-")}-${marker}`) || `item-${index}`;
}

function repairValue(value: unknown, path: readonly string[] = []): unknown {
  if (Array.isArray(value)) {
    const seen = new Set<string>();

    return value.map((item, index) => {
      const repaired = repairValue(item, [...path, String(index)]);

      if (!isObject(repaired)) return repaired;

      const base = stringValue(repaired._key) ?? keyBase(repaired, path, index);
      let key = base;
      let suffix = 2;

      while (seen.has(key)) {
        key = `${base}-${suffix}`;
        suffix += 1;
      }

      seen.add(key);
      return { ...repaired, _key: key };
    });
  }

  if (!isObject(value)) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      repairValue(child, [...path, key]),
    ]),
  );
}

function stripSystemFields(document: SanityDocument) {
  const { _createdAt, _updatedAt, _rev, ...content } = document;
  void _createdAt;
  void _updatedAt;
  void _rev;
  return content;
}

async function main() {
  const documents = await client.fetch<SanityDocument[]>(
    '*[_type in $types && !(_id in path("_.**"))]',
    { types: documentTypes },
  );

  let repairedCount = 0;

  for (const document of documents) {
    const content = stripSystemFields(document);
    const repaired = repairValue(content) as SanityDocument;

    if (JSON.stringify(content) === JSON.stringify(repaired)) continue;

    repairedCount += 1;
    log(
      `[repair-keys] ${dryRun ? "Would repair" : "Repairing"} ${document._id}`,
    );

    if (!dryRun) {
      await client.createOrReplace(repaired);
    }
  }

  log(
    `[repair-keys] ${dryRun ? "Would repair" : "Repaired"} ${repairedCount} of ${documents.length} documents.`,
  );
}

main().catch((error) => {
  console.error("[repair-keys] Failed:", error);
  process.exit(1);
});

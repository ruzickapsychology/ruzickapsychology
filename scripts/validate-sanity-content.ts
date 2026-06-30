import { getCliClient } from "sanity/cli";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-24";
const client = getCliClient({ apiVersion }).withConfig({ useCdn: false });

type ValidationResult = {
  missingSingletons: string[];
  missingImageAlt: Array<{ documentId: string; path: string }>;
  missingRequiredValues: string[];
};

const requiredSingletons = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "specialtiesPage",
  "pricingPage",
  "contactPage",
  "faqPage",
];

const query = /* groq */ `
{
  "missingSingletons": $requiredSingletons[!(@ in *[defined(_id)]._id)],
  "missingRequiredValues": [
    select(!defined(*[_id == "siteSettings"][0].email) => "siteSettings.email", null),
    select(!defined(*[_id == "siteSettings"][0].portalUrl) => "siteSettings.portalUrl", null),
    select(!defined(*[_id == "contactPage"][0].header.heading) => "contactPage.header.heading", null)
  ][@ != null],
  "missingImageAlt": *[
    defined(*[references(^._id)][0]) || _id in $requiredSingletons || _type in ["post", "specialty"]
  ]{
    "documentId": _id,
    "images": select(
      _type == "homePage" => [
        {"path": "hero.backgroundImage", "hasImage": defined(hero.backgroundImage.asset), "alt": hero.backgroundImage.alt},
        {"path": "aboutPreview.portraitImage", "hasImage": defined(aboutPreview.portraitImage.asset), "alt": aboutPreview.portraitImage.alt},
        {"path": "ctaSection.backgroundImage", "hasImage": defined(ctaSection.backgroundImage.asset), "alt": ctaSection.backgroundImage.alt}
      ],
      _type == "aboutPage" => [
        {"path": "portraitImage", "hasImage": defined(portraitImage.asset), "alt": portraitImage.alt},
        {"path": "space.exteriorImage", "hasImage": defined(space.exteriorImage.asset), "alt": space.exteriorImage.alt},
        {"path": "space.interiorImage", "hasImage": defined(space.interiorImage.asset), "alt": space.interiorImage.alt},
        {"path": "philosophy.backgroundImage", "hasImage": defined(philosophy.backgroundImage.asset), "alt": philosophy.backgroundImage.alt}
      ],
      _type == "specialtiesPage" => [
        {"path": "modality.backgroundImage", "hasImage": defined(modality.backgroundImage.asset), "alt": modality.backgroundImage.alt}
      ],
      _type == "pricingPage" => [
        {"path": "ctaBackgroundImage", "hasImage": defined(ctaBackgroundImage.asset), "alt": ctaBackgroundImage.alt}
      ],
      _type == "contactPage" => [
        {"path": "headerBackgroundImage", "hasImage": defined(headerBackgroundImage.asset), "alt": headerBackgroundImage.alt}
      ],
      _type == "faqPage" => [
        {"path": "ctaBackgroundImage", "hasImage": defined(ctaBackgroundImage.asset), "alt": ctaBackgroundImage.alt}
      ],
      []
    )[hasImage == true && !defined(alt)]
  }[count(images) > 0]{
    documentId,
    "paths": images[].path
  }
}
`;

function flattenMissingImageAlt(
  value: Array<{ documentId: string; paths?: string[] }>,
) {
  return value.flatMap((item) =>
    (item.paths ?? []).map((path) => ({ documentId: item.documentId, path })),
  );
}

async function main() {
  const raw = await client.fetch<
    Omit<ValidationResult, "missingImageAlt"> & {
      missingImageAlt: Array<{ documentId: string; paths?: string[] }>;
    }
  >(query, { requiredSingletons });

  const result: ValidationResult = {
    missingSingletons: raw.missingSingletons,
    missingRequiredValues: raw.missingRequiredValues,
    missingImageAlt: flattenMissingImageAlt(raw.missingImageAlt),
  };

  if (
    result.missingSingletons.length ||
    result.missingRequiredValues.length ||
    result.missingImageAlt.length
  ) {
    console.error("[content] Validation failed:");
    console.error(JSON.stringify(result, null, 2));
    process.exitCode = 1;
    return;
  }

  console.log("[content] Validation passed.");
}

main().catch((error) => {
  console.error("[content] Validation failed:", error);
  process.exit(1);
});

import { getCliClient } from "sanity/cli";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-24";
const client = getCliClient({ apiVersion }).withConfig({ useCdn: false });

type ValidationResult = {
  legacyCompatibilityWarnings: string[];
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

const requiredServiceIds = [
  "specialty-individual-therapy",
  "specialty-couples-counseling",
  "specialty-perinatal-postpartum-support",
  "specialty-group-therapy",
];

const query = /* groq */ `
{
  "missingSingletons": $requiredSingletons[!(@ in *[defined(_id)]._id)],
  "missingRequiredValues": [
    select(!defined(*[_id == "siteSettings"][0].email) => "siteSettings.email", null),
    select(!defined(*[_id == "siteSettings"][0].phone) => "siteSettings.phone", null),
    select(!defined(coalesce(*[_id == "siteSettings"][0].address.streetAddress, *[_id == "siteSettings"][0].address.line1)) => "siteSettings.address.streetAddress-or-line1", null),
    select(!defined(*[_id == "siteSettings"][0].portalUrl) => "siteSettings.portalUrl", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityBadgeMessages.accepting.line1) => "siteSettings.availabilityBadgeMessages.accepting.line1", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityBadgeMessages.accepting.line2) => "siteSettings.availabilityBadgeMessages.accepting.line2", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityBadgeMessages.waitlist.line1) => "siteSettings.availabilityBadgeMessages.waitlist.line1", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityBadgeMessages.waitlist.line2) => "siteSettings.availabilityBadgeMessages.waitlist.line2", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityBadgeMessages.closed.line1) => "siteSettings.availabilityBadgeMessages.closed.line1", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityBadgeMessages.closed.line2) => "siteSettings.availabilityBadgeMessages.closed.line2", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.waitlist.heroCta) => "siteSettings.availabilityMessaging.waitlist.heroCta", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.waitlist.contactHeading) => "siteSettings.availabilityMessaging.waitlist.contactHeading", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.waitlist.contactIntro) => "siteSettings.availabilityMessaging.waitlist.contactIntro", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.waitlist.ctaHeading) => "siteSettings.availabilityMessaging.waitlist.ctaHeading", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.waitlist.ctaBody) => "siteSettings.availabilityMessaging.waitlist.ctaBody", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.waitlist.homeCtaLabel) => "siteSettings.availabilityMessaging.waitlist.homeCtaLabel", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.waitlist.pricingCtaHeading) => "siteSettings.availabilityMessaging.waitlist.pricingCtaHeading", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.waitlist.pricingCtaBody) => "siteSettings.availabilityMessaging.waitlist.pricingCtaBody", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.waitlist.pricingCtaLabel) => "siteSettings.availabilityMessaging.waitlist.pricingCtaLabel", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.closed.heroCta) => "siteSettings.availabilityMessaging.closed.heroCta", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.closed.contactHeading) => "siteSettings.availabilityMessaging.closed.contactHeading", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.closed.contactIntro) => "siteSettings.availabilityMessaging.closed.contactIntro", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.closed.ctaHeading) => "siteSettings.availabilityMessaging.closed.ctaHeading", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.closed.ctaBody) => "siteSettings.availabilityMessaging.closed.ctaBody", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.closed.pricingCtaHeading) => "siteSettings.availabilityMessaging.closed.pricingCtaHeading", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.closed.pricingCtaBody) => "siteSettings.availabilityMessaging.closed.pricingCtaBody", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.closed.panelHeading) => "siteSettings.availabilityMessaging.closed.panelHeading", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.closed.panelBody) => "siteSettings.availabilityMessaging.closed.panelBody", null),
    select(!defined(*[_id == "siteSettings"][0].availabilityMessaging.closed.contactMethodsLabel) => "siteSettings.availabilityMessaging.closed.contactMethodsLabel", null),
    select(!defined(*[_id == "contactPage"][0].header.heading) => "contactPage.header.heading", null),
    select(count(*[_id in $requiredServiceIds && pageStatus == "published"]) != count($requiredServiceIds) => "published service pages", null),
    select(count(*[_id in $requiredServiceIds && defined(pageHeading) && defined(intro) && count(overview) > 0 && count(commonConcerns) > 0 && defined(approachHeading) && count(approachBody) > 0 && count(whatToExpect) > 0 && count(faqs) >= 3]) != count($requiredServiceIds) => "published service page content", null)
  ][@ != null],
  "legacyCompatibilityWarnings": [
    select(!defined(*[_id == "siteSettings"][0].address.streetAddress) => "siteSettings.address uses legacy line1", null),
    select(!defined(*[_id == "siteSettings"][0].address.addressLocality) => "siteSettings.address uses the Rochester locality fallback", null),
    select(!defined(*[_id == "siteSettings"][0].address.addressRegion) => "siteSettings.address uses the NY region fallback", null),
    select(!defined(*[_id == "siteSettings"][0].address.postalCode) => "siteSettings.address uses the 14620 postal-code fallback", null),
    select(!defined(*[_id == "siteSettings"][0].address.addressCountry) => "siteSettings.address uses the US country fallback", null)
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
  >(query, { requiredSingletons, requiredServiceIds });

  const result: ValidationResult = {
    legacyCompatibilityWarnings: raw.legacyCompatibilityWarnings,
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

  if (result.legacyCompatibilityWarnings.length) {
    console.warn("[content] Validation passed with legacy fallbacks:");
    console.warn(JSON.stringify(result.legacyCompatibilityWarnings, null, 2));
    return;
  }

  console.log("[content] Validation passed.");
}

main().catch((error) => {
  console.error(
    "[content] Validation failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exit(1);
});

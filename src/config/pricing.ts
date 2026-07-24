import type { Route } from "next";
import { serviceHref, type ServicePageDefinition } from "@/config/services";

/** Preserve existing CMS labels while resolving links only to published services. */
export function pricingFeeServiceHref(
  label: string,
  publishedServices: readonly Pick<ServicePageDefinition, "slug">[],
): Route | undefined {
  const normalizedLabel = label.toLowerCase();
  const published = new Set(publishedServices.map((service) => service.slug));
  if (normalizedLabel.includes("couple") && published.has("couples-therapy")) {
    return serviceHref("couples-therapy");
  }
  if (
    normalizedLabel.includes("individual") &&
    published.has("individual-therapy")
  ) {
    return serviceHref("individual-therapy");
  }
  return undefined;
}

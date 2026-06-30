export function requireEnvValue(name: string, value: string | undefined) {
  value = value?.trim();
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function optionalEnvValue(value: string | undefined) {
  return value?.trim() || undefined;
}

export const publicEnv = {
  sanityProjectId: requireEnvValue(
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  ),
  sanityDataset: requireEnvValue(
    "NEXT_PUBLIC_SANITY_DATASET",
    process.env.NEXT_PUBLIC_SANITY_DATASET,
  ),
  sanityApiVersion: requireEnvValue(
    "NEXT_PUBLIC_SANITY_API_VERSION",
    process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  ),
  siteUrl: requireEnvValue(
    "NEXT_PUBLIC_SITE_URL",
    process.env.NEXT_PUBLIC_SITE_URL,
  ),
  web3FormsAccessKey: optionalEnvValue(
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
  ),
};

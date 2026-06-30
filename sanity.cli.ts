import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

loadEnvConfig(process.cwd());

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const projectId = requiredEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = requiredEnv("NEXT_PUBLIC_SANITY_DATASET");

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    enabled: true,
    path: "./src/**/*.{ts,tsx}",
    schema: "./schema.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true,
  },
});

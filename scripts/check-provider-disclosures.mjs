import fs from "node:fs";
import path from "node:path";

const privacyPath = path.join(
  process.cwd(),
  "src/page-modules/privacy/index.tsx",
);
const privacySource = fs.readFileSync(privacyPath, "utf8");
const requiredProviders = [
  "Web3Forms",
  "Vercel",
  "Sanity",
  "Google Maps",
  "SimplePractice",
];
const missingProviders = requiredProviders.filter(
  (provider) => !privacySource.includes(provider),
);

if (missingProviders.length) {
  console.error(
    `[privacy] Missing provider disclosures: ${missingProviders.join(", ")}`,
  );
  process.exit(1);
}

if (/TODO|TBD|example\.com|your (company|practice)/i.test(privacySource)) {
  console.error(
    "[privacy] Placeholder language remains in the privacy notice.",
  );
  process.exit(1);
}

console.log("[privacy] Provider disclosures are present.");

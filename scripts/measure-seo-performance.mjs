import { spawnSync } from "node:child_process";
import fs from "node:fs";
const base = process.argv[2],
  directory = process.argv[3];
if (!base || !directory) {
  console.error(
    "Usage: node scripts/measure-seo-performance.mjs <base-url> <output-directory>",
  );
  process.exit(1);
}
new URL(base);
fs.mkdirSync(directory, { recursive: true });
const root = process.cwd();
for (const [name, path] of [
  ["home", "/"],
  ["contact", "/contact"],
  ["couples", "/specialties/couples-therapy"],
  ["article", "/blog/welcome-to-the-practice"],
]) {
  for (const mode of ["mobile", "desktop"])
    for (let n = 1; n <= 2; n++) {
      const out = `${directory}/${name}-${mode}-${n}.json`;
      console.log(`START ${new Date().toISOString()} ${out}`);
      const args = [
        `${root}/node_modules/lighthouse/cli/index.js`,
        base + path,
        "--only-categories=performance",
        "--output=json",
        `--output-path=${out}`,
        "--chrome-flags=--headless --no-sandbox",
        "--quiet",
      ];
      if (mode === "desktop") args.push("--preset=desktop");
      const result = spawnSync(process.execPath, args, {
        encoding: "utf8",
        env: process.env,
      });
      if (result.status !== 0) {
        console.log(result.stderr);
        process.exit(1);
      }
      const l = JSON.parse(fs.readFileSync(out));
      if (l.runtimeError) {
        console.error(l.runtimeError);
        process.exit(1);
      }
      console.log(
        JSON.stringify({
          name,
          mode,
          n,
          score: l.categories.performance.score,
          LCP: l.audits["largest-contentful-paint"].numericValue,
          CLS: l.audits["cumulative-layout-shift"].numericValue,
          TBT: l.audits["total-blocking-time"].numericValue,
          error: l.runtimeError,
        }),
      );
    }
}

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { format, resolveConfig } from "prettier";

const root = fileURLToPath(new URL("../", import.meta.url));
const input = path.join(root, "docs/seo-audit-recommendations-2026-10.md");
const output = path.join(root, "docs/seo-progress.html");
const markdown = await readFile(input, "utf8");
const [tracker, transcript] = markdown.split(
  "## Source transcript — all 28 pages",
);
const categories = [
  [
    "questions",
    "Facts & decisions to resolve",
    "Practice questions and decisions that may unblock implementation. Not implementation tickets.",
    [],
  ],
  [
    "process",
    "Process & audit notes",
    "Vendor suggestions, guardrails and methodology. Reference only.",
    [],
  ],
  [
    "monitoring",
    "Monitoring ideas & prompts",
    "Search queries and possible recurring checks. No monitoring commitment is implied.",
    [],
  ],
  [
    "metadata",
    "Metadata examples",
    "Original audit title and description proposals, retained as reference.",
    [],
  ],
  [
    "facts",
    "Practice facts & care policies",
    "Insurance, billing, hours, privacy and safe access to care.",
    [3, 4, 6, 15, 24, 25, 26, 27, 28, 35],
  ],
  [
    "local",
    "Local presence & directories",
    "Google profile, reviews, directory accuracy and business records.",
    [1, 2, 5, 7, 29],
  ],
  [
    "trust",
    "Credentials & trust",
    "About, qualifications, colleague endorsements and office information.",
    [12, 23, 33],
  ],
  [
    "services",
    "Services & FAQs",
    "Dedicated services, workshop details, internal links and useful answers.",
    [8, 9, 14, 34, 36],
  ],
  [
    "experience",
    "Navigation & contact",
    "Finding information, making contact and accessible interactions.",
    [18, 20, 21, 22, 31, 37],
  ],
  [
    "editorial",
    "Homepage & existing articles",
    "Clear introductions, article structure and editorial presentation.",
    [10, 13, 32, 38, 39],
  ],
  [
    "technical",
    "Search, schema & measurement",
    "Metadata, structured data, social previews, analytics and AI visibility.",
    [11, 16, 17, 19, 30, 40],
  ],
  [
    "pages",
    "New page roadmap",
    "The audit’s 30 proposed pages, including conditional additions.",
    [],
  ],
  [
    "articles",
    "Article ideas",
    "28 proposed topics to consider after service content and practice facts.",
    [],
  ],
  [
    "keywords",
    "Keyword assignments",
    "41 content targets. These track coverage, not achieved rankings.",
    [],
  ],
].map(([id, title, description, sections]) => ({
  id,
  title,
  description,
  sections,
  reference: [
    "questions",
    "process",
    "monitoring",
    "metadata",
    "pages",
    "articles",
    "keywords",
  ].includes(id),
}));
const sectionCategory = new Map(
  categories.flatMap((c) => c.sections.map((n) => [n, c.id])),
);
const inherited = {
  31: 18,
  32: 10,
  33: 12,
  34: 8,
  35: 15,
  36: 14,
  37: 20,
  38: 13,
  39: 13,
};
const severity = {};
for (const m of tracker.matchAll(
  /Source: Finding #(\d+), (Critical|High|Medium|Low);/g,
))
  severity[m[1]] = m[2];
let group = "",
  source = "",
  current = null;
const items = [];
for (const line of tracker.split("\n")) {
  if (/^#{2,3} /.test(line)) {
    group = line.replace(/^#{2,3} /, "");
    current = null;
  }
  if (line.startsWith("Source:")) source = line.slice(7).trim();
  const item = line.match(
    /^- (?:\[([ x])\] )?\*\*([A-Z]+-\d+(?:-\d+)?)\*\* (.*)$/,
  );
  if (item) {
    const [, checked, id, recommendation] = item;
    const section = id.startsWith("SEO-") ? Number(id.split("-")[1]) : null;
    const isOriginalFinding = section !== null && section <= 30;
    const finding = isOriginalFinding ? section : inherited[section];
    let importance = finding ? severity[finding] : undefined;
    let importanceBasis = isOriginalFinding
      ? `Audit finding #${section}`
      : finding
        ? `Inherited from finding #${finding}; not separately rated`
        : "No individual severity assigned in the audit";
    let category = sectionCategory.get(section);
    if (id.startsWith("PAGE-")) category = "pages";
    if (id.startsWith("BLOG-")) {
      category = "articles";
      importance = "Medium";
      importanceBasis =
        "Inherited from finding #13; topic not separately rated";
    }
    if (id.startsWith("META-")) {
      category = "technical";
      importance = "Medium";
      importanceBasis = "Inherited from finding #11; pair not separately rated";
    }
    if (id.startsWith("AI-")) {
      category = "technical";
      importance = "Medium";
      importanceBasis =
        "Inherited from finding #30; prompt not separately rated";
    }
    if (id.startsWith("KW-")) category = "keywords";
    const phase =
      source.match(/Phase (\d)/)?.[1] ??
      (finding
        ? tracker.match(
            new RegExp(`Source: Finding #${finding}, [^\\n]*?Phase (\\d)`),
          )?.[1]
        : null);
    current = {
      id,
      recommendation,
      group,
      source,
      category,
      importance: importance || "Not rated",
      importanceBasis,
      phase: phase ? Number(phase) : null,
      checked: checked === "x",
      resource: /^(PAGE|BLOG|KW)-/.test(id),
      confirmation: null,
      question: false,
      extras: [],
    };
    items.push(current);
  } else if (current) {
    const status = line.match(
      /^\s+- \*\*(\d{4}-\d{2}-\d{2}) — (Done|Partial|Remaining|Unverified):\*\* (.*)$/,
    );
    if (status) [, current.date, current.status, current.evidence] = status;
    else if (
      line.trim().startsWith("- **Tracking type:** Question / decision")
    ) {
      current.question = true;
      current.category = "questions";
    } else if (line.trim().startsWith("- **Workflow:**"))
      current.workflow = line.split("**Workflow:**")[1].trim();
    else if (line.trim().startsWith("- **Reference group:**"))
      current.referenceGroup = line.split("**Reference group:**")[1].trim();
    else if (line.trim().startsWith("- **Task category:**"))
      current.taskCategory = line.split("**Task category:**")[1].trim();
    else if (line.trim().startsWith("- **Scoped outcome:**"))
      current.outcome = line.split("**Scoped outcome:**")[1].trim();
    else if (line.trim().startsWith("- **Triage reason:**"))
      current.reason = line.split("**Triage reason:**")[1].trim();
    else if (line.trim().startsWith("- **Scoped action:**"))
      current.action = line.split("**Scoped action:**")[1].trim();
    else if (line.trim().startsWith("- **Christina confirmation needed:**"))
      current.confirmation = line
        .split("**Christina confirmation needed:**")[1]
        .trim();
    else if (/^\s+- /.test(line))
      current.extras.push(line.replace(/^\s+- /, ""));
    else if (line.trim().startsWith("**Extraction note"))
      current.extras.push(line.trim());
  }
}
if (
  items.length !== 328 ||
  new Set(items.map((i) => i.id)).size !== items.length
)
  throw new Error("Expected all 328 unique tracker items.");
for (const item of items) {
  item.resource = item.workflow === "Resource";
  if (item.taskCategory) item.category = item.taskCategory;
  if (item.referenceGroup) item.category = item.referenceGroup;
  item.question = item.resource && item.category === "questions";
  if (
    !item.workflow ||
    !item.reason ||
    !item.action ||
    ![
      "Ready",
      "In progress",
      "Backlog",
      "Needs scoping",
      "Blocked",
      "Archived",
      "Done",
      "Resource",
    ].includes(item.workflow) ||
    !item.category ||
    !item.status ||
    !item.evidence ||
    item.resource !==
      categories.find((category) => category.id === item.category)?.reference ||
    (!item.resource &&
      !item.question &&
      item.checked !== (item.workflow === "Done"))
  )
    throw new Error(`Incomplete or inconsistent source item ${item.id}`);
}
const pages = [
  ...transcript.matchAll(/### PDF page (\d+)\s+```text\n([\s\S]*?)\n```/g),
].map((m) => ({ page: Number(m[1]), text: m[2] }));
if (pages.length !== 28)
  throw new Error("Expected complete 28-page source transcript.");
const counts = Object.fromEntries(
  ["Done", "Ready", "In progress"].map((workflow) => [
    workflow,
    items.filter((i) => i.workflow === workflow).length,
  ]),
);
const data = {
  items,
  categories,
  pages,
  counts,
  sourceName: path.basename(input),
  sourceCommit: "3a311ea",
  date: items
    .map((i) => i.date)
    .sort()
    .at(-1),
};
const template = await readFile(
  path.join(root, "scripts/seo-progress/template.html"),
  "utf8",
);
const html = template.replace(
  "__TRACKER_DATA__",
  JSON.stringify(data).replaceAll("<", "\\u003c"),
);
await writeFile(
  output,
  await format(html, { ...(await resolveConfig(output)), parser: "html" }),
);
console.log(
  `Built ${path.relative(root, output)}: ${items.length} items, ${pages.length} PDF pages. ${JSON.stringify(counts)}`,
);

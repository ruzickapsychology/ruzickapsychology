#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";

const formatExtensions = new Set([
  ".cjs",
  ".css",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mdx",
  ".mjs",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);

const ignoredFiles = new Set([
  "package-lock.json",
  "sanity.types.ts",
  "schema.json",
]);

function readStdin() {
  return new Promise((resolve) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      input += chunk;
    });
    process.stdin.on("end", () => resolve(input));
  });
}

function patchedFiles(command) {
  const files = new Set();

  for (const line of command.split("\n")) {
    const fileMatch = line.match(/^\*\*\* (?:Add|Update) File: (.+)$/);
    const moveMatch = line.match(/^\*\*\* Move to: (.+)$/);
    const file = fileMatch?.[1] ?? moveMatch?.[1];

    if (file) files.add(file.trim());
  }

  return [...files];
}

function extensionFor(file) {
  const lower = file.toLowerCase();
  if (lower.endsWith(".module.d.css.ts")) return ".ts";
  const index = lower.lastIndexOf(".");
  return index === -1 ? "" : lower.slice(index);
}

function runnableFiles(files) {
  return files.filter((file) => {
    if (ignoredFiles.has(file)) return false;
    if (!formatExtensions.has(extensionFor(file))) return false;
    if (!existsSync(file)) return false;
    return statSync(file).isFile();
  });
}

function run(command, args) {
  return spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
  });
}

const rawInput = await readStdin();
let payload;

try {
  payload = JSON.parse(rawInput || "{}");
} catch {
  process.exit(0);
}

const command = payload?.tool_input?.command;
if (typeof command !== "string") process.exit(0);

const files = runnableFiles(patchedFiles(command));
if (!files.length) process.exit(0);

const prettier = run("npx", [
  "prettier",
  "--write",
  "--ignore-unknown",
  ...files,
]);
if (prettier.status) process.exit(prettier.status);

if (files.some((file) => file.endsWith(".module.css"))) {
  const cssTypes = run("npm", ["run", "css-types"]);
  if (cssTypes.status) process.exit(cssTypes.status);
}

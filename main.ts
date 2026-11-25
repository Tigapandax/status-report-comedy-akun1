import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Status Report Comedy Sprint entry: print the one-line weekly status
// report after validating it against the bounty rules (max 200 chars,
// single line, clean whitespace, terminal punctuation).
const raw = readFileSync(new URL("./one-line.txt", import.meta.url), "utf8");
const line = raw.replace(/\r?\n$/, "");

const failures: string[] = [];
if (line.length === 0) failures.push("empty line");
if (line.length > 200) failures.push(`too long: ${line.length}/200 characters`);
if (line !== line.trim()) failures.push("leading or trailing whitespace");
if (/[\r\n]/.test(line)) failures.push("must be a single line");
if (/\s{2,}/.test(line)) failures.push("double space found");
if (!/[.!?]$/.test(line)) failures.push("must end with terminal punctuation");
if (!/[a-zA-Z]/.test(line)) failures.push("must contain letters");
if (line.split(/\s+/).length < 3) failures.push("too short to be a status report");
if (/https?:\/\/|www\./.test(line)) failures.push("no links in a status line");

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exit(1);
}

console.log(line);
console.log(`OK: ${line.length}/200 characters, single line, valid status report.`);

// Harness program/v1: the sealed scorer reads the entry from
// <MAKEFUN_OUTPUT_DIR>/entry.txt, so write the line there too
// (stdout alone scores Valid 0).
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, line + "\n", "utf8");

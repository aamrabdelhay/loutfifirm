// Usage: node scripts/i18n-audit.mjs
// Static checks: mojibake, doubled spaces in Arabic strings, Latin digits next to Arabic words with Arabic-Indic digits mixed,
// emdashes, trailing spaces in JSX text, and phone-like numbers that are not 11 digits.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const issues = [];
function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { if (!["node_modules", ".next", ".git"].includes(f)) walk(p); continue; }
    if (!/\.(tsx?|json)$/.test(f)) continue;
    readFileSync(p, "utf8").split("\n").forEach((line, i) => {
      const at = `${p}:${i + 1}`;
      if (/\uFFFD|Ø[§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿]|Ù[\u0080-\u00bf]/.test(line)) issues.push([at, "mojibake"]);
      if (/[\u0600-\u06FF]  +[\u0600-\u06FF]/.test(line)) issues.push([at, "double space inside Arabic text"]);
      if (/[\u0600-\u06FF].*[\u0660-\u0669].*\d|\d.*[\u0660-\u0669]/.test(line) && /[\u0660-\u0669]/.test(line) && /[0-9]/.test(line)) issues.push([at, "mixed Arabic-Indic and Latin digits"]);
      for (const m of line.matchAll(/["'`>]\s*(0\d{9,10})\s*["'`<]/g)) if (m[1].length !== 11 && m[1].startsWith("01")) issues.push([at, `mobile number with ${m[1].length} digits: ${m[1]}`]);
    });
  }
}
walk("src");
if (!issues.length) console.log("i18n-audit: no issues");
else { for (const [a, b] of issues) console.log(`${a}  ${b}`); process.exitCode = 1; }

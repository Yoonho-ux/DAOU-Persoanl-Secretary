#!/usr/bin/env node
// Claude Code statusLine script
// Reads session JSON from stdin and prints a one-line status with
// model name, tokens used, and % of context window used.

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let data = {};
  try {
    data = JSON.parse(raw);
  } catch (e) {
    process.stdout.write("[statusline: invalid input]");
    return;
  }

  const modelName =
    (data.model && data.model.display_name) ||
    (data.model && data.model.id) ||
    "unknown-model";

  const cw = data.context_window || {};
  const totalInput = cw.total_input_tokens;
  const windowSize = cw.context_window_size;
  const usedPct = cw.used_percentage;
  const remainingPct = cw.remaining_percentage;

  const fmt = (n) =>
    n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n);

  let tokenPart = "no usage yet";
  if (typeof totalInput === "number" && typeof windowSize === "number") {
    tokenPart = `${fmt(totalInput)}/${fmt(windowSize)} tokens`;
  }

  let pctPart = "n/a";
  if (typeof usedPct === "number") {
    pctPart = `${usedPct.toFixed(1)}% used (${(100 - usedPct).toFixed(1)}% left)`;
  } else if (typeof remainingPct === "number") {
    pctPart = `${(100 - remainingPct).toFixed(1)}% used (${remainingPct.toFixed(1)}% left)`;
  }

  const dir = (data.workspace && data.workspace.current_dir) || data.cwd || "";
  const base = dir ? dir.split(/[\\/]/).filter(Boolean).pop() : "";

  const parts = [modelName, tokenPart, pctPart];
  if (base) parts.push(base);

  process.stdout.write(parts.join(" | "));
});

import { buildPublicAssets } from "./civic-record-assets.mjs";

export const PUBLIC_ASSET_PATHS = Object.freeze([
  "favicon.svg",
  "index.html",
  "src/app.js",
  "src/civic-data.js",
  "src/errors.js",
  "src/handoff.js",
  "src/record-contract.js",
  "src/state.js",
  "src/validation.js",
  "src/webmcp.js",
  "styles.css",
  ...buildPublicAssets().keys(),
].sort());

const exactPublicFiles = new Set(PUBLIC_ASSET_PATHS);

export function isPublicAsset(relativePath) {
  return exactPublicFiles.has(relativePath);
}

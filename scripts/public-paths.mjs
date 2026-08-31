const exactPublicFiles = new Set([
  "data/waterbury-tax-2026.js",
  "index.html",
  "styles.css",
]);

export function isPublicAsset(relativePath) {
  if (exactPublicFiles.has(relativePath)) {
    return true;
  }
  return /^src\/[a-z0-9-]+\.js$/.test(relativePath);
}

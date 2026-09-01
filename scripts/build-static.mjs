import { copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_ASSET_PATHS } from "./public-paths.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = resolve(root, "dist");

await rm(output, { force: true, recursive: true });

for (const relativePath of PUBLIC_ASSET_PATHS) {
  const destination = resolve(output, relativePath);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(root, relativePath), destination);
}

console.log(`Built ${PUBLIC_ASSET_PATHS.length} allowlisted static assets.`);

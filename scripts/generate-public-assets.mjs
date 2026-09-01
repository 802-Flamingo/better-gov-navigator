import { mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { buildPublicAssets } from "./civic-record-assets.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

await rm(resolve(root, "records"), { force: true, recursive: true });

for (const [relativePath, contents] of buildPublicAssets()) {
  const filePath = resolve(root, relativePath);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
}

console.log("Generated public civic record and discovery assets.");

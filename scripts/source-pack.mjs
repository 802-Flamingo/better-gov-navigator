import { readFile } from "node:fs/promises";

export const REVIEWED_SOURCE_PACK = JSON.parse(
  await readFile(new URL("../data/waterbury-tax-2026.json", import.meta.url), "utf8"),
);

export const MACHINE_WITHHELD_SOURCE_IDS = new Set([
  "waterbury-tax-bills-2025",
  "waterbury-tax-bills-2026",
]);

export function buildBrowserSourcePack(sourcePack = REVIEWED_SOURCE_PACK) {
  const projected = structuredClone(sourcePack);
  projected.sources = projected.sources.map((source) => {
    const machineWithheld = MACHINE_WITHHELD_SOURCE_IDS.has(source.id);
    return {
      ...source,
      url: machineWithheld ? null : source.url,
      access: machineWithheld
        ? "url_withheld_from_production"
        : "linked_official_source",
    };
  });
  return projected;
}

export function buildBrowserSourceModule(sourcePack = REVIEWED_SOURCE_PACK) {
  return `export const SOURCE_PACK = ${JSON.stringify(buildBrowserSourcePack(sourcePack), null, 2)};\n`;
}

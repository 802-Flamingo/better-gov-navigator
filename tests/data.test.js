import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  CIVIC_DATA,
  findPathsForNeed,
  getPath,
  projectFacts,
  ratesAreHistorical,
} from "../src/civic-data.js";
import { SOURCE_PACK } from "../data/waterbury-tax-2026.js";
import {
  MACHINE_WITHHELD_SOURCE_IDS,
  buildBrowserSourcePack,
  buildBrowserSourceModule,
} from "../scripts/source-pack.mjs";

test("browser source pack is a deterministic privacy projection", async () => {
  const json = JSON.parse(
    await readFile(new URL("../data/waterbury-tax-2026.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(SOURCE_PACK, buildBrowserSourcePack(json));
  assert.equal(MACHINE_WITHHELD_SOURCE_IDS.size, 2);

  for (const sourceId of MACHINE_WITHHELD_SOURCE_IDS) {
    const source = SOURCE_PACK.sources.find((candidate) => candidate.id === sourceId);
    assert.equal(source.url, null);
    assert.equal(source.access, "url_withheld_from_production");
  }

  const browserModule = buildBrowserSourceModule(json);
  assert.doesNotMatch(browserModule, /2025_Property_Tax_Bills|2026_Property_Tax_Bills/);
});

test("civic data is deeply frozen", () => {
  assert.equal(Object.isFrozen(CIVIC_DATA), true);
  assert.equal(Object.isFrozen(CIVIC_DATA.sources[0]), true);
  assert.throws(() => {
    CIVIC_DATA.sources[0].url = "https://example.com";
  }, TypeError);
});

test("every supported need projects one fresh path on the checked date", () => {
  const checkedDate = new Date("2026-08-31T12:00:00Z");
  for (const need of CIVIC_DATA.needs) {
    const paths = findPathsForNeed(need.id, checkedDate);
    assert.equal(paths.length, 1);
    assert.equal(paths[0].stale, false);
    assert.match(paths[0].source.url, /^https:\/\//);
  }
});

test("contact paths become stale after the configured cutoff", () => {
  const evening = findPathsForNeed("bill-payment", new Date("2026-10-01T00:00:00Z"));
  const nextLocalDay = findPathsForNeed("bill-payment", new Date("2026-10-01T04:00:00Z"));
  assert.equal(evening[0].stale, false);
  assert.equal(nextLocalDay[0].stale, true);
});

test("withheld claims are absent from published facts", () => {
  const facts = JSON.stringify(projectFacts());
  assert.doesNotMatch(facts, /51\.06/);
  assert.doesNotMatch(facts, /0\.47%/);
  assert.doesNotMatch(facts, /final approved levy/i);
});

test("projected facts identify withheld bulk sources without publishing their URLs", () => {
  const facts = projectFacts();
  const withheld = facts.flatMap((fact) => fact.sources.filter((source) => source.url === null));

  assert.deepEqual(
    withheld.map((source) => source.id),
    ["waterbury-tax-bills-2026", "waterbury-tax-bills-2025", "waterbury-tax-bills-2026"],
  );
  assert.equal(withheld.every((source) => source.access === "url_withheld_from_production"), true);
});

test("email paths use municipal allowlisted addresses", () => {
  assert.equal(getPath("waterbury-property-tax-billing").email, "knealy@waterburyvt.com");
  assert.equal(getPath("waterbury-assessment-questions").email, "dsweet@waterburyvt.com");
});

test("records path uses the exact official public-process destination", () => {
  assert.equal(
    getPath("waterbury-budget-records").recordsUrl,
    "https://www.waterburyvt.com/boards/selectboard",
  );
});

test("published rates transition to an explicit historical record", () => {
  assert.equal(ratesAreHistorical(new Date("2027-06-30T12:00:00Z")), false);
  assert.equal(ratesAreHistorical(new Date("2027-07-01T00:00:00Z")), false);
  assert.equal(ratesAreHistorical(new Date("2027-07-01T04:00:00Z")), true);
});

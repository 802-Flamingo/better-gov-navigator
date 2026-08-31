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

test("reviewed JSON and browser source pack are identical", async () => {
  const json = JSON.parse(
    await readFile(new URL("../data/waterbury-tax-2026.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(SOURCE_PACK, json);
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
  const paths = findPathsForNeed("bill-payment", new Date("2026-10-01T00:00:00Z"));
  assert.equal(paths[0].stale, true);
});

test("withheld claims are absent from published facts", () => {
  const facts = JSON.stringify(projectFacts());
  assert.doesNotMatch(facts, /51\.06/);
  assert.doesNotMatch(facts, /0\.47%/);
  assert.doesNotMatch(facts, /final approved levy/i);
});

test("email paths use municipal allowlisted addresses", () => {
  assert.equal(getPath("waterbury-property-tax-billing").email, "knealy@waterburyvt.com");
  assert.equal(getPath("waterbury-assessment-questions").email, "dsweet@waterburyvt.com");
});

test("published rates transition to an explicit historical record", () => {
  assert.equal(ratesAreHistorical(new Date("2027-06-30T12:00:00Z")), false);
  assert.equal(ratesAreHistorical(new Date("2027-07-01T00:00:00Z")), true);
});

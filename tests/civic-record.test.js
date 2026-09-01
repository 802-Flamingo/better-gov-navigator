import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  CIVIC_RECORD_ID,
  SITE_URL,
} from "../src/record-contract.js";
import {
  buildCivicRecord,
  buildCivicRecordSchema,
  buildPublicAssets,
} from "../scripts/civic-record-assets.mjs";
import { SOURCE_PACK } from "../data/waterbury-tax-2026.js";

test("committed public discovery assets exactly match the reviewed source pack", async () => {
  for (const [relativePath, expected] of buildPublicAssets()) {
    const actual = await readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
    assert.equal(actual, expected, `${relativePath} must be regenerated after source changes`);
  }
});

test("CivicRecordV1 is a faithful, citable projection", () => {
  const record = buildCivicRecord();
  assert.equal(record.schemaVersion, "CivicRecordV1");
  assert.equal(record.$schema, `${SITE_URL}/civic-record.schema.json`);
  assert.equal(record.id, CIVIC_RECORD_ID);
  assert.equal(record.canonicalUrl, `${SITE_URL}/civic-record.json`);
  assert.equal(record.governmentEndorsement, false);
  assert.equal(record.checkedAt, SOURCE_PACK.checkedAt);
  assert.equal(record.status, "reviewed_source_snapshot");
  assert.equal(record.historicalAfter, SOURCE_PACK.rates.historicalAfter);
  assert.deepEqual(
    record.claims.map(({ id }) => id),
    SOURCE_PACK.facts.map(({ id }) => id),
  );
  assert.deepEqual(
    record.civicPaths.map(({ id }) => id),
    SOURCE_PACK.paths.map(({ id }) => id),
  );
  assert.deepEqual(
    record.sources.map(({ id }) => id),
    SOURCE_PACK.sources.map(({ id }) => id),
  );
  assert.equal(record.claims.every(({ citationUrl }) => citationUrl.startsWith(`${SITE_URL}/records/`)), true);
  assert.equal(record.civicPaths.every(({ citationUrl }) => citationUrl.startsWith(`${SITE_URL}/records/`)), true);
  assert.match(record.integrity.sourcePackSemanticSha256, /^[a-f0-9]{64}$/);

  const sourceIds = new Set(record.sources.map(({ id }) => id));
  assert.equal(sourceIds.size, record.sources.length);
  for (const claim of record.claims) {
    assert.equal(claim.sourceIds.every((sourceId) => sourceIds.has(sourceId)), true);
  }
  for (const path of record.civicPaths) {
    assert.equal(sourceIds.has(path.sourceId), true);
  }
  assert.equal(new Set(record.lifecycle.map(({ stage }) => stage)).size, record.lifecycle.length);
});

test("CivicRecordV1 publishes a strict project-local schema", () => {
  const schema = buildCivicRecordSchema();
  const record = buildCivicRecord();
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$id, `${SITE_URL}/civic-record.schema.json`);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schemaVersion.const, "CivicRecordV1");
  assert.equal(schema.properties.governmentEndorsement.const, false);
  assert.deepEqual(Object.keys(record).sort(), [...schema.required].sort());
  assert.match(record.id, new RegExp(schema.properties.id.pattern));
  assert.match(record.checkedAt, new RegExp(schema.properties.checkedAt.pattern));
  assert.match(record.historicalAfter, new RegExp(schema.properties.historicalAfter.pattern));
  for (const collection of ["claims", "civicPaths", "sources"]) {
    assert.equal(schema.properties[collection].items.additionalProperties, false);
  }
});

test("public civic record excludes private case and direct contact payloads", () => {
  const record = buildCivicRecord();
  const serialized = JSON.stringify(record);
  const keys = [];
  JSON.stringify(record, (key, value) => {
    keys.push(key);
    return value;
  });
  for (const prohibited of ["approvedStatement", "caseId", "draft", "pendingProposal"]) {
    assert.equal(keys.includes(prohibited), false, `${prohibited} must not be public`);
  }
  assert.doesNotMatch(serialized, /@waterburyvt\.com|802-\d{3}-\d{4}/);
  assert.doesNotMatch(serialized, /requestPrompt|salutation|appointmentUrl|recordsUrl/);
  assert.doesNotMatch(serialized, /Property_Tax_Bills(?:_Redacted)?\.pdf/);
  assert.match(serialized, /resident case text and contact destinations/);
});

test("assistant and crawler surfaces state the non-diagnosis boundary", async () => {
  const [index, full, feed, sitemap, robots, html] = await Promise.all([
    readFile(new URL("../llms.txt", import.meta.url), "utf8"),
    readFile(new URL("../llms-full.txt", import.meta.url), "utf8"),
    readFile(new URL("../feed.xml", import.meta.url), "utf8"),
    readFile(new URL("../sitemap.xml", import.meta.url), "utf8"),
    readFile(new URL("../robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
  ]);

  assert.match(index, /do not infer an individual diagnosis/i);
  assert.match(index, /civic-record\.schema\.json/);
  assert.match(full, /not an instruction to contact anyone/i);
  assert.match(feed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/);
  assert.match(feed, /civic-record\.json/);
  assert.match(sitemap, new RegExp(`<loc>${SITE_URL}/</loc>`));
  assert.match(robots, new RegExp(`Sitemap: ${SITE_URL}/sitemap\\.xml`));
  assert.match(html, /type="application\/json"[\s\S]*?href="\/civic-record\.json"/);
  assert.match(html, /type="application\/atom\+xml"[\s\S]*?href="\/feed\.xml"/);
  assert.match(html, /rel="describedby"[\s\S]*?href="\/llms\.txt"/);
});

test("claim and path citations are static, indexable, and non-executable", () => {
  const assets = buildPublicAssets();
  const recordPages = [...assets.entries()].filter(([path]) => path.startsWith("records/"));
  assert.equal(recordPages.length, SOURCE_PACK.facts.length + SOURCE_PACK.paths.length);
  for (const [path, html] of recordPages) {
    assert.match(path, /^records\/[a-z0-9-]+\/index\.html$/);
    assert.match(html, /<link rel="canonical" href="https:\/\/navigator\.govermont\.co\/records\/[a-z0-9-]+\/">/);
    assert.match(html, /Independent civic guidance/);
    assert.doesNotMatch(html, /<script|@waterburyvt\.com|802-\d{3}-\d{4}/i);
  }
});

test("path selection restores keyboard focus after its row rerenders", async () => {
  const app = await readFile(new URL("../src/app.js", import.meta.url), "utf8");
  assert.match(app, /replacement\?\.focus\(\{ preventScroll: true \}\)/);
  assert.doesNotMatch(app, /revealRecordAnchor|window\.location\.hash/);
});

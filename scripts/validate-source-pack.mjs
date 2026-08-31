import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { SOURCE_PACK } from "../data/waterbury-tax-2026.js";

const jsonPack = JSON.parse(
  await readFile(new URL("../data/waterbury-tax-2026.json", import.meta.url), "utf8"),
);

assert.deepEqual(SOURCE_PACK, jsonPack, "Browser module must match reviewed JSON exactly");
assert.equal(SOURCE_PACK.schemaVersion, 1);
assert.equal(SOURCE_PACK.town.id, "vt:municipality:waterbury");
assert.equal(SOURCE_PACK.topic, "property_tax");
assert.match(SOURCE_PACK.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(SOURCE_PACK.rates.year, 2026);
assert.equal(SOURCE_PACK.rates.unit, "dollars per $100 of assessed value");
assert.match(SOURCE_PACK.rates.historicalAfter, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(SOURCE_PACK.rates.rows.length, 3);

const allowedSourceOrigins = new Set([
  "https://tax.vermont.gov",
  "https://www.waterburyvt.com",
]);
const allowedDestinations = new Map([
  [
    "waterbury-property-tax-billing",
    {
      email: "knealy@waterburyvt.com",
      phone: "802-244-5858",
      appointmentUrl: null,
      sourceId: "waterbury-property-taxes",
    },
  ],
  [
    "waterbury-assessment-questions",
    {
      email: "dsweet@waterburyvt.com",
      phone: "802-244-1013",
      appointmentUrl: null,
      sourceId: "waterbury-property-reappraisal",
    },
  ],
  [
    "vermont-homestead-credit-help",
    {
      email: null,
      phone: "802-828-2865",
      appointmentUrl: "https://tax.vermont.gov/schedule-appointment",
      sourceId: "vermont-homestead-declaration-2026",
    },
  ],
  [
    "waterbury-budget-records",
    {
      email: null,
      phone: null,
      appointmentUrl: null,
      sourceId: "waterbury-selectboard-2026",
    },
  ],
]);

const sourceIds = new Set();
for (const source of SOURCE_PACK.sources) {
  assert.ok(!sourceIds.has(source.id), `Duplicate source id: ${source.id}`);
  sourceIds.add(source.id);
  const sourceUrl = new URL(source.url);
  assert.equal(sourceUrl.protocol, "https:", `${source.id} must use HTTPS`);
  assert.ok(
    allowedSourceOrigins.has(sourceUrl.origin),
    `${source.id} uses an unapproved source origin`,
  );
  assert.equal(source.checkedAt, SOURCE_PACK.checkedAt);
  assert.equal(source.retrievedAt, SOURCE_PACK.checkedAt);
  assert.ok(source.taxYear === null || Number.isInteger(source.taxYear));
  assert.ok(
    source.effectiveDate === null || /^\d{4}-\d{2}-\d{2}$/.test(source.effectiveDate),
    `${source.id} effective date must be an ISO date or null`,
  );
  assert.ok(source.evidenceExcerpt.length > 0, `${source.id} needs captured evidence`);

  const hash = createHash("sha256")
    .update(source.evidenceExcerpt)
    .digest("hex");
  assert.equal(hash, source.capturedEvidenceSha256, `${source.id} evidence hash mismatch`);
}

const pathIds = new Set();
for (const path of SOURCE_PACK.paths) {
  assert.ok(!pathIds.has(path.id), `Duplicate path id: ${path.id}`);
  pathIds.add(path.id);
  assert.ok(sourceIds.has(path.sourceId), `${path.id} has an unknown source`);
  assert.match(path.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(path.staleAfter, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(allowedDestinations.has(path.id), `${path.id} is not allowlisted`);
  const expected = allowedDestinations.get(path.id);
  assert.equal(path.email ?? null, expected.email, `${path.id} email changed`);
  assert.equal(path.phone ?? null, expected.phone, `${path.id} phone changed`);
  assert.equal(
    path.appointmentUrl ?? null,
    expected.appointmentUrl,
    `${path.id} appointment URL changed`,
  );
  assert.equal(path.sourceId, expected.sourceId, `${path.id} source changed`);
}
assert.equal(pathIds.size, allowedDestinations.size, "Destination allowlist is incomplete");

for (const need of SOURCE_PACK.needs) {
  assert.ok(need.pathIds.length > 0, `${need.id} needs at least one path`);
  for (const pathId of need.pathIds) {
    assert.ok(pathIds.has(pathId), `${need.id} references unknown path ${pathId}`);
  }
}

for (const fact of SOURCE_PACK.facts) {
  assert.ok(fact.sourceIds.length > 0, `${fact.id} needs evidence`);
  for (const sourceId of fact.sourceIds) {
    assert.ok(sourceIds.has(sourceId), `${fact.id} references unknown source ${sourceId}`);
  }
}

console.log(
  `Validated ${SOURCE_PACK.facts.length} facts, ${SOURCE_PACK.paths.length} paths, and ${SOURCE_PACK.sources.length} official sources.`,
);

import { createHash } from "node:crypto";
import {
  CIVIC_RECORD_ID,
  FACT_TITLES,
  SITE_URL,
  claimRecordUrl,
  pathRecordUrl,
} from "../src/record-contract.js";
import {
  MACHINE_WITHHELD_SOURCE_IDS,
  REVIEWED_SOURCE_PACK as SOURCE_PACK,
  buildBrowserSourceModule,
  buildBrowserSourcePack,
} from "./source-pack.mjs";

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function sourcePackSemanticHash() {
  return createHash("sha256")
    .update(JSON.stringify(buildBrowserSourcePack(SOURCE_PACK)))
    .digest("hex");
}

function formatDateOnly(value) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

function publicSource(source) {
  const machineWithheld = MACHINE_WITHHELD_SOURCE_IDS.has(source.id);
  return {
    id: source.id,
    title: source.title,
    publisher: source.publisher,
    canonicalUrl: machineWithheld ? null : source.url,
    access: machineWithheld
      ? "url_withheld_from_machine_projection"
      : "linked_official_source",
    checkedAt: source.checkedAt,
    retrievedAt: source.retrievedAt,
    taxYear: source.taxYear,
    effectiveDate: source.effectiveDate,
    locator: source.locator,
    evidenceSummary: source.evidenceSummary,
    capturedEvidenceSha256: source.capturedEvidenceSha256,
  };
}

function sourceList(sourceIds) {
  return sourceIds.map((sourceId) => {
    const source = SOURCE_PACK.sources.find(({ id }) => id === sourceId);
    if (!source) {
      throw new Error(`Unknown source ${sourceId}`);
    }
    const heading = `<strong>${escapeXml(source.publisher)}: ${escapeXml(source.title)}</strong>`;
    if (MACHINE_WITHHELD_SOURCE_IDS.has(source.id)) {
      return `<li>${heading}<span>Official bulk property-bill record. Direct link withheld from this public civic record because the document contains property-owner information.</span></li>`;
    }
    return `<li>${heading}<a href="${escapeXml(source.url)}" target="_blank" rel="noopener noreferrer">Open official source</a></li>`;
  }).join("\n");
}

function recordPage({ canonicalUrl, description, eyebrow, title, contents }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeXml(description)}">
    <meta name="author" content="802 Flamingo LLC">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${escapeXml(canonicalUrl)}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/styles.css">
    <title>${escapeXml(title)} | Go Vermont Civic Navigator</title>
  </head>
  <body>
    <a class="skip-link" href="#record-content">Skip to civic record</a>
    <header class="site-header">
      <a class="brand" href="/" aria-label="Go Vermont Civic Navigator home">
        <span class="brand-mark" aria-hidden="true">VT</span>
        <span><strong>Go Vermont</strong><small>Civic Navigator</small></span>
      </a>
      <p class="powered-by"><span>Powered by</span> Better Gov Navigator</p>
    </header>
    <main id="record-content" class="record-document">
      <header class="record-document-header">
        <p class="eyebrow">${escapeXml(eyebrow)}</p>
        <h1>${escapeXml(title)}</h1>
        <p>Independent civic guidance from a reviewed official-source snapshot.</p>
      </header>
      ${contents}
      <aside class="independence-note" aria-label="Service boundary">
        <strong>Independent civic guidance</strong>
        <span>Not a municipal or State of Vermont website. This record does not diagnose an individual bill.</span>
      </aside>
      <p class="record-actions"><a class="command-link" href="/#starting-point">Open the resident Navigator</a></p>
    </main>
    <footer>
      <p>Published by 802 Flamingo LLC · Checked ${escapeXml(formatDateOnly(SOURCE_PACK.checkedAt))}</p>
      <p><a href="/civic-record.json">Civic record (JSON)</a> · <a href="/">Go Vermont Civic Navigator</a></p>
    </footer>
  </body>
</html>
`;
}

function buildClaimPage(fact) {
  const title = FACT_TITLES[fact.id] ?? "Reviewed civic claim";
  return recordPage({
    canonicalUrl: claimRecordUrl(fact.id),
    description: `${title}: reviewed Waterbury property-tax finding, limitation, and official sources.`,
    eyebrow: `Reviewed claim · Waterbury · ${SOURCE_PACK.rates.year} property taxes`,
    title,
    contents: `<section class="record-block" aria-labelledby="finding-title">
        <h2 id="finding-title">What official records establish</h2>
        <p class="fact-statement">${escapeXml(fact.statement)}</p>
      </section>
      <section class="record-block limitation-block" aria-labelledby="limitation-title">
        <h2 id="limitation-title">What this does not establish</h2>
        <p>${escapeXml(fact.limitation)}</p>
      </section>
      <section class="record-block" aria-labelledby="sources-title">
        <h2 id="sources-title">Official records</h2>
        <ul class="record-source-list">${sourceList(fact.sourceIds)}</ul>
      </section>`,
  });
}

function buildPathPage(path) {
  return recordPage({
    canonicalUrl: pathRecordUrl(path.id),
    description: `${path.label}: reviewed purpose, limitation, freshness, and official source.`,
    eyebrow: `Reviewed civic path · Waterbury · Checked ${formatDateOnly(path.checkedAt)}`,
    title: path.label,
    contents: `<section class="record-block" aria-labelledby="purpose-title">
        <h2 id="purpose-title">Where this path can help</h2>
        <p class="fact-statement">${escapeXml(path.purpose)}</p>
        <p><strong>Office or process:</strong> ${escapeXml(path.office)}</p>
      </section>
      <section class="record-block limitation-block" aria-labelledby="boundary-title">
        <h2 id="boundary-title">Boundary</h2>
        <p>${escapeXml(path.limitation)}</p>
        <p><strong>Contact details require reverification after:</strong> ${escapeXml(formatDateOnly(path.staleAfter))}</p>
      </section>
      <section class="record-block" aria-labelledby="source-title">
        <h2 id="source-title">Official source</h2>
        <ul class="record-source-list">${sourceList([path.sourceId])}</ul>
      </section>`,
  });
}

export function buildCivicRecordSchema() {
  const date = { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" };
  const uri = { type: "string", format: "uri" };
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `${SITE_URL}/civic-record.schema.json`,
    title: "Go Vermont CivicRecordV1",
    description:
      "A project-local contract for one reviewed civic source snapshot. It is not a government standard or evidence of municipal endorsement.",
    type: "object",
    additionalProperties: false,
    required: [
      "$schema",
      "schemaVersion",
      "id",
      "canonicalUrl",
      "humanUrl",
      "publisher",
      "governmentEndorsement",
      "jurisdiction",
      "topic",
      "taxYear",
      "historicalAfter",
      "checkedAt",
      "status",
      "scope",
      "lifecycle",
      "claims",
      "canonicalUnknowns",
      "civicPaths",
      "sources",
      "integrity",
      "privacyBoundary",
    ],
    properties: {
      $schema: { const: `${SITE_URL}/civic-record.schema.json` },
      schemaVersion: { const: "CivicRecordV1" },
      id: { type: "string", pattern: "^vt:municipality:[a-z0-9-]+:[a-z0-9_-]+:\\d{4}$" },
      canonicalUrl: uri,
      humanUrl: uri,
      publisher: {
        type: "object",
        additionalProperties: false,
        required: ["name", "role"],
        properties: {
          name: { type: "string", minLength: 1 },
          role: { const: "independent civic publisher" },
        },
      },
      governmentEndorsement: { const: false },
      jurisdiction: {
        type: "object",
        additionalProperties: false,
        required: ["id", "name", "state"],
        properties: {
          id: { type: "string", pattern: "^vt:municipality:[a-z0-9-]+$" },
          name: { type: "string", minLength: 1 },
          state: { const: "Vermont" },
        },
      },
      topic: { const: "property_tax" },
      taxYear: { type: "integer", minimum: 2000, maximum: 2100 },
      historicalAfter: date,
      checkedAt: date,
      status: { const: "reviewed_source_snapshot" },
      scope: {
        type: "object",
        additionalProperties: false,
        required: ["establishes", "doesNotEstablish"],
        properties: {
          establishes: { type: "string", minLength: 1 },
          doesNotEstablish: { type: "string", minLength: 1 },
        },
      },
      lifecycle: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["stage", "status", "responsibility"],
          properties: {
            stage: { type: "string", minLength: 1 },
            status: { type: "string", minLength: 1 },
            responsibility: { type: "string", minLength: 1 },
          },
        },
      },
      claims: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "citationUrl", "statement", "limitation", "checkedAt", "sourceIds"],
          properties: {
            id: { type: "string", pattern: "^[a-z0-9-]+$" },
            citationUrl: uri,
            statement: { type: "string", minLength: 1 },
            limitation: { type: "string", minLength: 1 },
            checkedAt: date,
            sourceIds: { type: "array", minItems: 1, items: { type: "string" } },
          },
        },
      },
      canonicalUnknowns: {
        type: "array",
        minItems: 1,
        items: { type: "string", minLength: 1 },
      },
      civicPaths: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "citationUrl", "label", "office", "purpose", "contactMode", "checkedAt", "staleAfter", "limitation", "sourceId"],
          properties: {
            id: { type: "string", pattern: "^[a-z0-9-]+$" },
            citationUrl: uri,
            label: { type: "string", minLength: 1 },
            office: { type: "string", minLength: 1 },
            purpose: { type: "string", minLength: 1 },
            contactMode: { type: "string", minLength: 1 },
            checkedAt: date,
            staleAfter: date,
            limitation: { type: "string", minLength: 1 },
            sourceId: { type: "string", minLength: 1 },
          },
        },
      },
      sources: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "title", "publisher", "canonicalUrl", "access", "checkedAt", "retrievedAt", "taxYear", "effectiveDate", "locator", "evidenceSummary", "capturedEvidenceSha256"],
          properties: {
            id: { type: "string", pattern: "^[a-z0-9-]+$" },
            title: { type: "string", minLength: 1 },
            publisher: { type: "string", minLength: 1 },
            canonicalUrl: { anyOf: [uri, { type: "null" }] },
            access: {
              enum: ["linked_official_source", "url_withheld_from_machine_projection"],
            },
            checkedAt: date,
            retrievedAt: date,
            taxYear: { anyOf: [{ type: "integer" }, { type: "null" }] },
            effectiveDate: { anyOf: [date, { type: "null" }] },
            locator: { type: "string", minLength: 1 },
            evidenceSummary: { type: "string", minLength: 1 },
            capturedEvidenceSha256: { type: "string", pattern: "^[a-f0-9]{64}$" },
          },
        },
      },
      integrity: {
        type: "object",
        additionalProperties: false,
        required: ["factCount", "civicPathCount", "sourceCount", "sourcePackSemanticSha256"],
        properties: {
          factCount: { type: "integer", minimum: 1 },
          civicPathCount: { type: "integer", minimum: 1 },
          sourceCount: { type: "integer", minimum: 1 },
          sourcePackSemanticSha256: { type: "string", pattern: "^[a-f0-9]{64}$" },
        },
      },
      privacyBoundary: { type: "string", minLength: 1 },
    },
  };
}

export function buildCivicRecord() {
  return {
    $schema: `${SITE_URL}/civic-record.schema.json`,
    schemaVersion: "CivicRecordV1",
    id: CIVIC_RECORD_ID,
    canonicalUrl: `${SITE_URL}/civic-record.json`,
    humanUrl: `${SITE_URL}/#public-records`,
    publisher: {
      name: "802 Flamingo LLC",
      role: "independent civic publisher",
    },
    governmentEndorsement: false,
    jurisdiction: structuredClone(SOURCE_PACK.town),
    topic: SOURCE_PACK.topic,
    taxYear: SOURCE_PACK.rates.year,
    historicalAfter: SOURCE_PACK.rates.historicalAfter,
    checkedAt: SOURCE_PACK.checkedAt,
    status: "reviewed_source_snapshot",
    scope: {
      establishes:
        "What the cited official records say about Waterbury's published 2026 property-tax rates, classifications, and reviewed starting points.",
      doesNotEstablish:
        "Why an individual bill changed, which classification or adjustment applies, eligibility, liability, or a final answer for a resident.",
    },
    lifecycle: [
      {
        stage: "official_records_reviewed",
        status: "complete",
        responsibility: "802 Flamingo LLC",
      },
      {
        stage: "resident_context",
        status: "not_in_public_record",
        responsibility: "resident",
      },
      {
        stage: "starting_path_selected",
        status: "resident_choice_required",
        responsibility: "resident",
      },
      {
        stage: "draft_preparation",
        status: "available_after_resident_choice",
        responsibility: "resident",
      },
      {
        stage: "external_action",
        status: "not_performed_by_go_vermont",
        responsibility: "resident",
      },
    ],
    claims: SOURCE_PACK.facts.map((fact) => ({
      id: fact.id,
      citationUrl: claimRecordUrl(fact.id),
      statement: fact.statement,
      limitation: fact.limitation,
      checkedAt: fact.checkedAt,
      sourceIds: [...fact.sourceIds],
    })),
    canonicalUnknowns: [...SOURCE_PACK.unknowns],
    civicPaths: SOURCE_PACK.paths.map((path) => ({
      id: path.id,
      citationUrl: pathRecordUrl(path.id),
      label: path.label,
      office: path.office,
      purpose: path.purpose,
      contactMode: path.contactMode,
      checkedAt: path.checkedAt,
      staleAfter: path.staleAfter,
      limitation: path.limitation,
      sourceId: path.sourceId,
    })),
    sources: SOURCE_PACK.sources.map(publicSource),
    integrity: {
      factCount: SOURCE_PACK.facts.length,
      civicPathCount: SOURCE_PACK.paths.length,
      sourceCount: SOURCE_PACK.sources.length,
      sourcePackSemanticSha256: sourcePackSemanticHash(),
    },
    privacyBoundary:
      "This public record excludes resident case text and contact destinations. Case sharing and handoff preparation remain consent-gated in the interactive page.",
  };
}

export function buildLlmsIndex() {
  return `# Go Vermont Civic Navigator

> An independent, source-backed Waterbury property-tax workflow that separates reviewed public facts from the questions an individual bill still requires.

Go Vermont Civic Navigator is published by 802 Flamingo LLC. It is not a municipal or State of Vermont website, and no government endorsement is implied.

Use boundaries: cite the civic record and linked official sources, preserve every limitation and canonical unknown, do not infer an individual diagnosis, and reverify time-bounded contact details in the interactive workflow. Go Vermont does not calculate tax, determine eligibility, store a case, send email, or act for the resident.

## Canonical resources

- [Resident workflow](${SITE_URL}/): Complete manual and WebMCP-capable experience.
- [CivicRecordV1 JSON](${SITE_URL}/civic-record.json): Machine-readable claims, limitations, source references, lifecycle, and integrity metadata.
- [CivicRecordV1 schema](${SITE_URL}/civic-record.schema.json): Project-local JSON Schema for validation and compatibility.
- [Full assistant-readable record](${SITE_URL}/llms-full.txt): Plain-text rendering of the reviewed record.
- [Reviewed snapshot feed](${SITE_URL}/feed.xml): Atom feed for reviewed civic snapshots.
- [Public source code](https://github.com/802-Flamingo/better-gov-navigator): Reproducible application, tests, source documentation, and security boundaries.
`;
}

export function buildLlmsFull() {
  const record = buildCivicRecord();
  const lines = [
    "# Go Vermont Civic Navigator: full civic record",
    "",
    `Record ID: ${record.id}`,
    `Canonical machine record: ${record.canonicalUrl}`,
    `Human-readable record: ${record.humanUrl}`,
    `Checked: ${record.checkedAt}`,
    `Historical after: ${record.historicalAfter}`,
    `Status: ${record.status}`,
    "Publisher: 802 Flamingo LLC, independent civic publisher",
    "Government endorsement: none",
    "",
    "## Scope",
    "",
    `Establishes: ${record.scope.establishes}`,
    `Does not establish: ${record.scope.doesNotEstablish}`,
    "",
    "## Reviewed claims",
    "",
  ];

  for (const claim of record.claims) {
    lines.push(
      `### ${claim.id}`,
      "",
      `Stable claim citation: ${claim.citationUrl}`,
      `Finding: ${claim.statement}`,
      `Limitation: ${claim.limitation}`,
      `Checked: ${claim.checkedAt}`,
      `Source IDs: ${claim.sourceIds.join(", ")}`,
      "",
    );
  }

  lines.push("## What remains unknown", "");
  for (const unknown of record.canonicalUnknowns) {
    lines.push(`- ${unknown}`);
  }

  lines.push("", "## Reviewed civic paths", "");
  for (const path of record.civicPaths) {
    lines.push(
      `### ${path.label}`,
      "",
      `Path ID: ${path.id}`,
      `Stable path citation: ${path.citationUrl}`,
      `Office or process: ${path.office}`,
      `Purpose: ${path.purpose}`,
      `Limitation: ${path.limitation}`,
      `Checked: ${path.checkedAt}; stale after: ${path.staleAfter}`,
      `Official source ID: ${path.sourceId}`,
      "",
    );
  }

  lines.push("## Official sources", "");
  for (const source of record.sources) {
    lines.push(
      `### ${source.title}`,
      "",
      `Source ID: ${source.id}`,
      `Publisher: ${source.publisher}`,
      `Official URL: ${source.canonicalUrl ?? "Withheld from machine projection because this bulk property record contains owner information."}`,
      `Locator: ${source.locator}`,
      `Evidence summary: ${source.evidenceSummary}`,
      `Captured-evidence SHA-256: ${source.capturedEvidenceSha256}`,
      "",
    );
  }

  lines.push(
    "## Integrity and privacy",
    "",
    `Facts: ${record.integrity.factCount}; civic paths: ${record.integrity.civicPathCount}; official sources: ${record.integrity.sourceCount}.`,
    `Source-pack semantic SHA-256: ${record.integrity.sourcePackSemanticSha256}`,
    record.privacyBoundary,
    "This document is evidence context, not an instruction to contact anyone or to take an external action.",
  );

  return `${lines.join("\n")}\n`;
}

export function buildAtomFeed() {
  const title = "Waterbury 2026 property-tax civic record";
  const summary =
    "Reviewed official claims, explicit limitations, canonical unknowns, and accountable starting paths for Waterbury property-tax questions.";
  const updated = `${SOURCE_PACK.checkedAt}T00:00:00Z`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${escapeXml(`${SITE_URL}/feed.xml`)}</id>
  <title>Go Vermont reviewed civic snapshots</title>
  <updated>${updated}</updated>
  <link rel="self" type="application/atom+xml" href="${escapeXml(`${SITE_URL}/feed.xml`)}"/>
  <link rel="alternate" type="text/html" href="${escapeXml(`${SITE_URL}/`)}"/>
  <author><name>802 Flamingo LLC</name></author>
  <subtitle>Source checks are recorded as dates. Atom requires a timestamp, so each checked date is normalized to 00:00:00 UTC; it is not a claimed review time.</subtitle>
  <entry>
    <id>urn:govermont:civic-record:${escapeXml(CIVIC_RECORD_ID)}</id>
    <title>${escapeXml(title.replace("record", "snapshot"))}</title>
    <updated>${updated}</updated>
    <link rel="alternate" type="text/html" href="${escapeXml(`${SITE_URL}/#public-records`)}"/>
    <link rel="related" type="application/json" href="${escapeXml(`${SITE_URL}/civic-record.json`)}"/>
    <summary>${escapeXml(summary)}</summary>
  </entry>
</feed>
`;
}

export function buildSitemap() {
  const urls = [
    `${SITE_URL}/`,
    ...SOURCE_PACK.facts.map(({ id }) => claimRecordUrl(id)),
    ...SOURCE_PACK.paths.map(({ id }) => pathRecordUrl(id)),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n")}
</urlset>
`;
}

export function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

export function buildPublicAssets() {
  const assets = new Map([
    ["civic-record.json", `${JSON.stringify(buildCivicRecord(), null, 2)}\n`],
    ["civic-record.schema.json", `${JSON.stringify(buildCivicRecordSchema(), null, 2)}\n`],
    ["data/waterbury-tax-2026.js", buildBrowserSourceModule(SOURCE_PACK)],
    ["feed.xml", buildAtomFeed()],
    ["llms-full.txt", buildLlmsFull()],
    ["llms.txt", buildLlmsIndex()],
    ["robots.txt", buildRobots()],
    ["sitemap.xml", buildSitemap()],
  ]);
  for (const fact of SOURCE_PACK.facts) {
    assets.set(`records/${fact.id}/index.html`, buildClaimPage(fact));
  }
  for (const path of SOURCE_PACK.paths) {
    assets.set(`records/${path.id}/index.html`, buildPathPage(path));
  }
  return assets;
}

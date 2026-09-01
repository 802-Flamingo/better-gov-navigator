export const SITE_URL = "https://navigator.govermont.co";
export const CIVIC_RECORD_ID = "vt:municipality:waterbury:property-tax:2026";

export const FACT_TITLES = Object.freeze({
  "waterbury-2026-rates": "Published 2026 tax rates",
  "waterbury-2026-change-pattern": "How the published rates changed",
  "vermont-property-classification": "Homestead and nonhomestead property",
});

export function claimRecordUrl(factId) {
  return `${SITE_URL}/records/${factId}/`;
}

export function pathRecordUrl(pathId) {
  return `${SITE_URL}/records/${pathId}/`;
}

export function makeCivicRecordMetadata(civicData) {
  return {
    schemaVersion: "CivicRecordV1",
    id: CIVIC_RECORD_ID,
    canonicalUrl: `${SITE_URL}/civic-record.json`,
    humanUrl: `${SITE_URL}/#public-records`,
    checkedAt: civicData.checkedAt,
    status: "reviewed_source_snapshot",
    jurisdiction: structuredClone(civicData.town),
    topic: civicData.topic,
    taxYear: civicData.rates.year,
    historicalAfter: civicData.rates.historicalAfter,
    factCount: civicData.facts.length,
    civicPathCount: civicData.paths.length,
    sourceCount: civicData.sources.length,
  };
}

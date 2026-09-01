import test from "node:test";
import assert from "node:assert/strict";
import { createNavigatorStore } from "../src/state.js";

const checkedDate = () => new Date("2026-08-31T12:00:00Z");

async function readyStore({ consent = false } = {}) {
  const store = createNavigatorStore({ now: checkedDate });
  await store.setStatement("My 2026 Waterbury property tax bill is higher. What records should I review?");
  await store.selectNeed("bill-payment");
  await store.selectPath("waterbury-property-tax-billing");
  if (consent) {
    await store.setConsent(true);
  }
  return store;
}

test("manual flow prepares a draft without assistant consent", async () => {
  const store = await readyStore();
  await store.prepareManualDraft();
  const state = store.getSnapshot();
  assert.equal(state.draft.createdBy, "resident");
  assert.equal(state.draft.reviewed, false);
  assert.match(state.draft.body, /What records should I review/);
});

test("assistant cannot read the case before consent", async () => {
  const store = await readyStore();
  assert.throws(() => store.readForAssistant(), { code: "CONSENT_REQUIRED" });
});

test("assistant proposal stages without replacing resident text", async () => {
  const store = await readyStore({ consent: true });
  const before = store.getSnapshot();
  const result = await store.proposeForAssistant(
    {
      revision: before.revision,
      proposedSummary: "I would like help identifying which 2026 bill record changed.",
      unresolvedQuestions: ["Did the assessed value change?"],
    },
    new AbortController().signal,
  );

  assert.equal(result.status, "AWAITING_RESIDENT_REVIEW");
  assert.equal(store.getSnapshot().statement, before.statement);
  assert.equal(store.getSnapshot().pendingProposal.proposedSummary.includes("2026"), true);

  await store.acceptProposal();
  assert.equal(
    store.getSnapshot().statement,
    "I would like help identifying which 2026 bill record changed.",
  );
});

test("assistant cannot propose wording before the resident chooses a fresh path", async () => {
  const store = createNavigatorStore({ now: checkedDate });
  await store.setStatement("My bill changed.");
  await store.setConsent(true);
  const revision = store.getSnapshot().revision;

  await assert.rejects(
    store.proposeForAssistant(
      {
        revision,
        proposedSummary: "Please help me understand the changed bill.",
        unresolvedQuestions: [],
      },
      new AbortController().signal,
    ),
    { code: "NO_PATH_SELECTED" },
  );
});

test("assistant cannot create the resident's initial case wording", async () => {
  const store = createNavigatorStore({ now: checkedDate });
  await store.selectNeed("bill-payment");
  await store.selectPath("waterbury-property-tax-billing");
  await store.setConsent(true);
  const revision = store.getSnapshot().revision;

  await assert.rejects(
    store.proposeForAssistant(
      {
        revision,
        proposedSummary: "Assistant-authored initial case.",
        unresolvedQuestions: [],
      },
      new AbortController().signal,
    ),
    { code: "NO_STATEMENT" },
  );
});

test("assistant state reports a proposal without echoing its full text", async () => {
  const store = await readyStore({ consent: true });
  const revision = store.getSnapshot().revision;
  await store.proposeForAssistant(
    {
      revision,
      proposedSummary: "Proposed wording that should remain in the resident review surface.",
      unresolvedQuestions: ["Did the assessed value change?"],
    },
    new AbortController().signal,
  );

  assert.deepEqual(store.readForAssistant().case.pendingProposal, {
    awaitingResidentReview: true,
    unresolvedQuestionCount: 1,
  });
});

test("assistant state stays within a compact response budget", async () => {
  const store = await readyStore({ consent: true });
  const response = store.readForAssistant();
  assert.equal(response.record.schemaVersion, "CivicRecordV1");
  assert.equal(response.record.id, "vt:municipality:waterbury:property-tax:2026");
  assert.equal(response.record.sourceCount, 10);
  assert.equal(Buffer.byteLength(JSON.stringify(response), "utf8") < 2048, true);
});

test("assistant path read is grounded in reviewed evidence and canonical unknowns", async () => {
  const store = await readyStore({ consent: true });
  const response = store.pathsForAssistant();

  assert.equal(response.paths.length, 1);
  assert.equal(response.evidence.length, 3);
  assert.equal(response.canonicalUnknowns.length, 4);
  assert.equal(response.record.canonicalUrl, "https://navigator.govermont.co/civic-record.json");
  assert.equal(
    response.paths[0].recordUrl,
    "https://navigator.govermont.co/records/waterbury-property-tax-billing/",
  );
  assert.equal(
    response.evidence.every(
      (fact) =>
        fact.statement &&
        fact.limitation &&
        fact.sourceUrls.length > 0 &&
        fact.recordUrl.startsWith("https://navigator.govermont.co/records/"),
    ),
    true,
  );
  assert.deepEqual(response.evidence[0].withheldSourceIds, ["waterbury-tax-bills-2026"]);
  assert.deepEqual(response.evidence[1].withheldSourceIds, [
    "waterbury-tax-bills-2025",
    "waterbury-tax-bills-2026",
  ]);
  assert.deepEqual(response.evidence[2].withheldSourceIds, []);
  assert.doesNotMatch(JSON.stringify(response), /51\.06|0\.47%|final approved levy/i);
  assert.doesNotMatch(JSON.stringify(response), /2025_Property_Tax_Bills|2026_Property_Tax_Bills/);
  assert.equal(Buffer.byteLength(JSON.stringify(response), "utf8") < 8192, true);
});

test("two assistant mutations at one revision yield one stale rejection", async () => {
  const store = await readyStore({ consent: true });
  const revision = store.getSnapshot().revision;
  const proposal = {
    revision,
    proposedSummary: "Please help me understand the relevant Waterbury bill record.",
    unresolvedQuestions: [],
  };

  const results = await Promise.allSettled([
    store.proposeForAssistant(proposal, new AbortController().signal),
    store.proposeForAssistant(proposal, new AbortController().signal),
  ]);

  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  const rejected = results.find((result) => result.status === "rejected");
  assert.equal(rejected.reason.code, "STATE_CHANGED");
});

test("cancelled mutation leaves state byte-for-byte unchanged", async () => {
  const store = await readyStore({ consent: true });
  const before = store.getSnapshot();
  const controller = new AbortController();
  controller.abort();

  assert.throws(
    () => store.prepareForAssistant({ revision: before.revision }, controller.signal),
    { code: "CANCELLED" },
  );
  assert.deepEqual(store.getSnapshot(), before);
});

test("cancellation immediately before commit leaves state unchanged", async () => {
  const store = await readyStore({ consent: true });
  const before = store.getSnapshot();
  let checks = 0;
  const signal = {
    get aborted() {
      checks += 1;
      return checks >= 3;
    },
  };

  await assert.rejects(
    store.prepareForAssistant({ revision: before.revision }, signal),
    { code: "CANCELLED" },
  );
  assert.deepEqual(store.getSnapshot(), before);
});

test("a queued human edit invalidates an assistant mutation", async () => {
  const store = await readyStore({ consent: true });
  const revision = store.getSnapshot().revision;
  const edit = store.setStatement("My wording changed while the assistant was working.");
  const assistant = store.prepareForAssistant(
    { revision },
    new AbortController().signal,
  );

  await edit;
  await assert.rejects(assistant, { code: "STATE_CHANGED" });
  assert.equal(store.getSnapshot().draft, null);
});

test("turning consent off and on invalidates replayed revisions", async () => {
  const store = await readyStore({ consent: true });
  const revision = store.getSnapshot().revision;
  await store.setConsent(false);
  await store.setConsent(true);

  await assert.rejects(
    store.proposeForAssistant(
      {
        revision,
        proposedSummary: "Replayed wording",
        unresolvedQuestions: [],
      },
      new AbortController().signal,
    ),
    { code: "STATE_CHANGED" },
  );
});

test("revocation clears assistant-generated content but keeps resident wording", async () => {
  const store = await readyStore({ consent: true });
  const revision = store.getSnapshot().revision;
  await store.prepareForAssistant({ revision }, new AbortController().signal);
  assert.equal(store.getSnapshot().draft.createdBy, "assistant");

  await store.setConsent(false);
  assert.equal(store.getSnapshot().consent, false);
  assert.equal(store.getSnapshot().draft, null);
  assert.match(store.getSnapshot().statement, /Waterbury/);
});

test("stale path refuses to prepare a draft after the Vermont cutoff date", async () => {
  const store = createNavigatorStore({ now: () => new Date("2026-10-01T04:00:00Z") });
  await store.setStatement("I have a billing question.");
  await store.selectNeed("bill-payment");
  await assert.rejects(store.selectPath("waterbury-property-tax-billing"), {
    code: "STALE_SOURCE",
  });
});

test("a prepared draft cannot be reviewed after its destination expires", async () => {
  let now = new Date("2026-09-30T12:00:00Z");
  const store = createNavigatorStore({ now: () => now });
  await store.setStatement("I have a billing question.");
  await store.selectNeed("bill-payment");
  await store.selectPath("waterbury-property-tax-billing");
  await store.prepareManualDraft();
  now = new Date("2026-10-01T04:00:00Z");

  await assert.rejects(store.reviewDraft(true), { code: "STALE_SOURCE" });
  assert.equal(store.getSnapshot().draft.reviewed, false);
});

test("an already reviewed draft stops being actionable after expiry", async () => {
  let now = new Date("2026-09-30T12:00:00Z");
  const store = createNavigatorStore({ now: () => now });
  await store.setStatement("I have a billing question.");
  await store.selectNeed("bill-payment");
  await store.selectPath("waterbury-property-tax-billing");
  await store.prepareManualDraft();
  await store.reviewDraft(true);
  assert.equal(store.getActionableDraft().reviewed, true);

  now = new Date("2026-10-01T04:00:00Z");
  assert.throws(() => store.getActionableDraft(), { code: "STALE_SOURCE" });
});

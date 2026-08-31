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

test("stale path refuses to prepare a draft", async () => {
  const store = createNavigatorStore({ now: () => new Date("2026-10-01T00:00:00Z") });
  await store.setStatement("I have a billing question.");
  await store.selectNeed("bill-payment");
  await assert.rejects(store.selectPath("waterbury-property-tax-billing"), {
    code: "STALE_SOURCE",
  });
});

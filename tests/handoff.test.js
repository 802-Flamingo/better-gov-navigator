import test from "node:test";
import assert from "node:assert/strict";
import { getNeed, getPath } from "../src/civic-data.js";
import { createHandoffDraft } from "../src/handoff.js";

test("handoff is deterministic and separates generic subject from resident text", () => {
  const draft = createHandoffDraft({
    statement: "My bill is higher and I want to understand the billing record.",
    need: getNeed("bill-payment"),
    path: getPath("waterbury-property-tax-billing"),
  });

  assert.equal(draft.subject, "Waterbury property tax question");
  assert.match(draft.body, /My bill is higher/);
  assert.match(draft.body, /town-wide rates alone do not explain/);
  assert.equal(draft.reviewed, false);
  assert.equal(draft.recipientEmail, "knealy@waterburyvt.com");
});

test("handoff for a records path does not invent an email", () => {
  const draft = createHandoffDraft({
    statement: "I want to understand the municipal budget record.",
    need: getNeed("municipal-budget"),
    path: getPath("waterbury-budget-records"),
  });

  assert.equal(draft.recipientEmail, null);
  assert.equal(draft.contactMode, "records_and_meeting");
});

import test from "node:test";
import assert from "node:assert/strict";
import {
  validateEmptyInput,
  validateProposalInput,
  validateRevisionInput,
} from "../src/validation.js";

test("empty tool input rejects inherited and additional properties", () => {
  assert.equal(validateEmptyInput({}), true);
  assert.equal(validateEmptyInput({ surprise: true }), false);
  assert.equal(validateEmptyInput(Object.create({ surprise: true })), false);
});

test("revision input is exact and bounded", () => {
  assert.deepEqual(validateRevisionInput({ revision: 4 }), { revision: 4 });
  assert.equal(validateRevisionInput({ revision: -1 }), null);
  assert.equal(validateRevisionInput({ revision: 4, recipient: "attacker" }), null);
});

test("proposal validation bounds text and questions", () => {
  const valid = validateProposalInput({
    revision: 2,
    proposedSummary: "  A bounded summary.  ",
    unresolvedQuestions: [" Which record changed? "],
  });
  assert.deepEqual(valid, {
    revision: 2,
    proposedSummary: "A bounded summary.",
    unresolvedQuestions: ["Which record changed?"],
  });

  assert.equal(
    validateProposalInput({
      revision: 2,
      proposedSummary: "x".repeat(1001),
      unresolvedQuestions: [],
    }),
    null,
  );
});

test("proposal validation rejects control and bidirectional override characters", () => {
  assert.equal(
    validateProposalInput({
      revision: 1,
      proposedSummary: "Safe prefix\u202Eliame",
      unresolvedQuestions: [],
    }),
    null,
  );
  assert.equal(
    validateProposalInput({
      revision: 1,
      proposedSummary: "Safe wording",
      unresolvedQuestions: ["Question\u0007"],
    }),
    null,
  );
});

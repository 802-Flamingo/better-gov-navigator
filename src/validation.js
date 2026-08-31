export const MAX_STATEMENT_LENGTH = 1000;
export const MAX_QUESTION_LENGTH = 200;
export const MAX_QUESTIONS = 6;

const unsafeTextControls = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/gu;

export function stripUnsafeTextControls(value) {
  return typeof value === "string" ? value.replace(unsafeTextControls, "") : "";
}

export function isPlainObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function validateExactObject(value, { allowed, required = [] }) {
  if (!isPlainObject(value)) {
    return false;
  }

  const keys = Object.keys(value);
  if (keys.some((key) => !allowed.includes(key))) {
    return false;
  }

  return required.every((key) => Object.hasOwn(value, key));
}

export function validateRevision(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

export function normalizeBoundedText(value, maxLength) {
  if (typeof value !== "string") {
    return null;
  }

  unsafeTextControls.lastIndex = 0;
  if (unsafeTextControls.test(value)) {
    return null;
  }

  const normalized = value.replace(/\r\n?/g, "\n").trim();
  if (normalized.length === 0 || normalized.length > maxLength) {
    return null;
  }

  return normalized;
}

export function validateProposalInput(value) {
  if (
    !validateExactObject(value, {
      allowed: ["revision", "proposedSummary", "unresolvedQuestions"],
      required: ["revision", "proposedSummary", "unresolvedQuestions"],
    }) ||
    !validateRevision(value.revision)
  ) {
    return null;
  }

  const proposedSummary = normalizeBoundedText(
    value.proposedSummary,
    MAX_STATEMENT_LENGTH,
  );
  if (!proposedSummary || !Array.isArray(value.unresolvedQuestions)) {
    return null;
  }

  if (value.unresolvedQuestions.length > MAX_QUESTIONS) {
    return null;
  }

  const unresolvedQuestions = value.unresolvedQuestions.map((question) =>
    normalizeBoundedText(question, MAX_QUESTION_LENGTH),
  );
  if (unresolvedQuestions.some((question) => question === null)) {
    return null;
  }

  return {
    revision: value.revision,
    proposedSummary,
    unresolvedQuestions,
  };
}

export function validateRevisionInput(value) {
  if (
    !validateExactObject(value, {
      allowed: ["revision"],
      required: ["revision"],
    }) ||
    !validateRevision(value.revision)
  ) {
    return null;
  }

  return { revision: value.revision };
}

export function validateEmptyInput(value) {
  return validateExactObject(value, { allowed: [] });
}

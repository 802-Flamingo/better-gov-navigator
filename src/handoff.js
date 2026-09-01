import { ERROR_CODES, NavigatorError } from "./errors.js";

export function createHandoffDraft({ statement, need, path, townName }) {
  if (typeof statement !== "string" || statement.trim().length === 0) {
    throw new NavigatorError(
      ERROR_CODES.NO_STATEMENT,
      "Add the question you want help with before preparing a draft.",
    );
  }

  if (typeof townName !== "string" || townName.trim().length === 0) {
    throw new NavigatorError(
      ERROR_CODES.UNSUPPORTED_CONTEXT,
      "A reviewed municipality is required before preparing a draft.",
    );
  }

  const reviewedTownName = townName.trim();

  const body = [
    path.salutation,
    "",
    `I am looking for help with a ${reviewedTownName} property tax question.`,
    "",
    "What I am asking:",
    statement.trim(),
    "",
    "What I would like help with:",
    path.requestPrompt,
    "",
    "I understand that town-wide rates alone do not explain an individual property tax bill. Please let me know the appropriate next step or record to review.",
    "",
    "Thank you.",
  ].join("\n");

  return {
    recipient: path.office,
    recipientEmail: path.email ?? null,
    contactMode: path.contactMode,
    purpose: need.label,
    subject: `${reviewedTownName} property tax question`,
    body,
    pathId: path.id,
    sourceId: path.sourceId,
    reviewed: false,
  };
}

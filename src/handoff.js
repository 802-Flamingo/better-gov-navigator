import { ERROR_CODES, NavigatorError } from "./errors.js";

const SUBJECT = "Waterbury property tax question";

export function createHandoffDraft({ statement, need, path }) {
  if (typeof statement !== "string" || statement.trim().length === 0) {
    throw new NavigatorError(
      ERROR_CODES.NO_STATEMENT,
      "Add the question you want help with before preparing a draft.",
    );
  }

  const body = [
    path.salutation,
    "",
    "I am looking for help with a Waterbury property tax question.",
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
    subject: SUBJECT,
    body,
    pathId: path.id,
    sourceId: path.sourceId,
    reviewed: false,
  };
}

export const ERROR_CODES = Object.freeze({
  CANCELLED: "CANCELLED",
  CONSENT_REQUIRED: "CONSENT_REQUIRED",
  INVALID_INPUT: "INVALID_INPUT",
  NO_PATH_SELECTED: "NO_PATH_SELECTED",
  NO_STATEMENT: "NO_STATEMENT",
  STALE_SOURCE: "STALE_SOURCE",
  STATE_CHANGED: "STATE_CHANGED",
  UNSUPPORTED_CONTEXT: "UNSUPPORTED_CONTEXT",
});

export class NavigatorError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "NavigatorError";
    this.code = code;
  }
}

export function errorResult(error) {
  if (error instanceof NavigatorError) {
    return {
      ok: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  return {
    ok: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "The Navigator could not complete that operation.",
    },
  };
}

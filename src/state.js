import {
  CIVIC_DATA,
  assertFreshPath,
  findPathsForNeed,
  getNeed,
  getPath,
  isPathStale,
  projectFacts,
  projectCivicRecordMetadata,
} from "./civic-data.js";
import { ERROR_CODES, NavigatorError } from "./errors.js";
import { createHandoffDraft } from "./handoff.js";
import {
  MAX_STATEMENT_LENGTH,
  normalizeBoundedText,
  stripUnsafeTextControls,
} from "./validation.js";

function makeCaseId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `case-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clone(value) {
  return structuredClone(value);
}

function initialState(revision = 0) {
  return {
    caseId: makeCaseId(),
    revision,
    generation: 0,
    consent: false,
    statement: "",
    selectedNeedId: null,
    selectedPathId: null,
    pendingProposal: null,
    assistantQuestions: [],
    draft: null,
    notice: "",
  };
}

function throwIfCancelled(signal) {
  if (signal?.aborted) {
    throw new NavigatorError(
      ERROR_CODES.CANCELLED,
      "The assistant operation was cancelled before it changed the case.",
    );
  }
}

export function createNavigatorStore({ now = () => new Date() } = {}) {
  let state = initialState();
  let queue = Promise.resolve();
  const listeners = new Set();

  function snapshot() {
    return clone(state);
  }

  function emit() {
    const current = snapshot();
    for (const listener of listeners) {
      listener(current);
    }
  }

  function enqueue(operation) {
    const run = queue.then(operation, operation);
    queue = run.catch(() => undefined);
    return run;
  }

  function commit(mutator) {
    const next = snapshot();
    mutator(next);
    next.revision = state.revision + 1;
    state = next;
    emit();
    return snapshot();
  }

  function assertConsent() {
    if (!state.consent) {
      throw new NavigatorError(
        ERROR_CODES.CONSENT_REQUIRED,
        "Turn on assistant sharing before using site tools.",
      );
    }
  }

  function assertRevision(revision) {
    if (revision !== state.revision) {
      throw new NavigatorError(
        ERROR_CODES.STATE_CHANGED,
        "The case changed. Read the current state and try again.",
      );
    }
  }

  return {
    getSnapshot: snapshot,

    subscribe(listener) {
      listeners.add(listener);
      listener(snapshot());
      return () => listeners.delete(listener);
    },

    setStatement(value) {
      return enqueue(() => {
        const normalized = stripUnsafeTextControls(value).slice(0, MAX_STATEMENT_LENGTH);
        return commit((next) => {
          next.statement = normalized;
          next.pendingProposal = null;
          next.assistantQuestions = [];
          next.draft = null;
          next.notice = "";
        });
      });
    },

    selectNeed(needId) {
      return enqueue(() => {
        if (!getNeed(needId)) {
          throw new NavigatorError(
            ERROR_CODES.UNSUPPORTED_CONTEXT,
            "Choose one of the supported property-tax needs.",
          );
        }
        return commit((next) => {
          next.selectedNeedId = needId;
          next.selectedPathId = null;
          next.pendingProposal = null;
          next.draft = null;
          next.notice = "Need selected.";
        });
      });
    },

    selectPath(pathId) {
      return enqueue(() => {
        assertFreshPath(pathId, state.selectedNeedId, now());
        return commit((next) => {
          next.selectedPathId = pathId;
          next.draft = null;
          next.notice = "Starting point selected.";
        });
      });
    },

    setConsent(enabled) {
      return enqueue(() =>
        commit((next) => {
          next.consent = Boolean(enabled);
          if (!enabled) {
            next.pendingProposal = null;
            next.assistantQuestions = [];
            if (next.draft?.createdBy === "assistant") {
              next.draft = null;
            }
            next.notice = "Assistant sharing is off. Information already returned cannot be retracted.";
          } else {
            next.notice = "Assistant sharing is on for this page session.";
          }
        }),
      );
    },

    clearCase() {
      return enqueue(() => {
        const nextRevision = state.revision + 1;
        const nextGeneration = state.generation + 1;
        state = initialState(nextRevision);
        state.generation = nextGeneration;
        state.notice = "Case cleared from this page.";
        emit();
        return snapshot();
      });
    },

    acceptProposal() {
      return enqueue(() => {
        if (!state.pendingProposal) {
          return snapshot();
        }
        return commit((next) => {
          next.statement = next.pendingProposal.proposedSummary;
          next.assistantQuestions = [...next.pendingProposal.unresolvedQuestions];
          next.pendingProposal = null;
          next.draft = null;
          next.notice = "Assistant wording and questions accepted.";
        });
      });
    },

    rejectProposal() {
      return enqueue(() =>
        commit((next) => {
          next.pendingProposal = null;
          next.notice = "Your original wording was kept.";
        }),
      );
    },

    reviewDraft(reviewed) {
      return enqueue(() => {
        if (!state.draft) {
          return snapshot();
        }
        if (reviewed) {
          assertFreshPath(state.draft.pathId, state.selectedNeedId, now());
        }
        return commit((next) => {
          next.draft.reviewed = Boolean(reviewed);
          next.notice = reviewed ? "Draft marked as reviewed." : "Draft review removed.";
        });
      });
    },

    getActionableDraft() {
      if (!state.draft?.reviewed) {
        throw new NavigatorError(
          ERROR_CODES.REVIEW_REQUIRED,
          "Review the destination and wording before using this draft.",
        );
      }
      assertFreshPath(state.draft.pathId, state.selectedNeedId, now());
      return clone(state.draft);
    },

    prepareManualDraft() {
      return enqueue(() => {
        const path = assertFreshPath(state.selectedPathId, state.selectedNeedId, now());
        const need = getNeed(state.selectedNeedId);
        const statement = normalizeBoundedText(state.statement, MAX_STATEMENT_LENGTH);
        if (!statement) {
          throw new NavigatorError(
            ERROR_CODES.NO_STATEMENT,
            "Add the question you want help with before preparing a draft.",
          );
        }
        const draft = createHandoffDraft({
          statement,
          need,
          path,
          townName: CIVIC_DATA.town.name,
        });
        return commit((next) => {
          next.draft = { ...draft, createdBy: "resident" };
          next.notice = "Draft prepared for your review.";
        });
      });
    },

    readForAssistant() {
      assertConsent();
      return {
        ok: true,
        record: projectCivicRecordMetadata(),
        case: {
          caseId: state.caseId,
          revision: state.revision,
          townId: CIVIC_DATA.town.id,
          topic: CIVIC_DATA.topic,
          approvedStatement: state.statement,
          selectedNeedId: state.selectedNeedId,
          selectedPathId: state.selectedPathId,
          pendingProposal: state.pendingProposal
            ? {
                awaitingResidentReview: true,
                unresolvedQuestionCount: state.pendingProposal.unresolvedQuestions.length,
              }
            : null,
          draft: state.draft
            ? {
                recipient: state.draft.recipient,
                purpose: state.draft.purpose,
                reviewed:
                  state.draft.reviewed &&
                  !isPathStale(getPath(state.draft.pathId), now()),
              }
            : null,
        },
      };
    },

    pathsForAssistant() {
      assertConsent();
      if (!state.selectedNeedId) {
        throw new NavigatorError(
          ERROR_CODES.UNSUPPORTED_CONTEXT,
          "The resident must choose what kind of help they need first.",
        );
      }
      return {
        ok: true,
        record: projectCivicRecordMetadata(),
        revision: state.revision,
        paths: findPathsForNeed(state.selectedNeedId, now()),
        evidence: projectFacts().map((fact) => ({
          id: fact.id,
          recordUrl: fact.recordUrl,
          statement: fact.statement,
          limitation: fact.limitation,
          sourceUrls: fact.sources.map((source) => source.url).filter(Boolean),
          withheldSourceIds: fact.sources
            .filter((source) => !source.url)
            .map((source) => source.id),
        })),
        canonicalUnknowns: [...CIVIC_DATA.unknowns],
      };
    },

    proposeForAssistant({ revision, proposedSummary, unresolvedQuestions }, signal) {
      const capturedGeneration = state.generation;
      throwIfCancelled(signal);
      return enqueue(() => {
        throwIfCancelled(signal);
        assertConsent();
        assertRevision(revision);
        if (capturedGeneration !== state.generation) {
          throw new NavigatorError(
            ERROR_CODES.STATE_CHANGED,
            "The case was cleared. Read the current state and try again.",
          );
        }
        const statement = normalizeBoundedText(state.statement, MAX_STATEMENT_LENGTH);
        if (!statement) {
          throw new NavigatorError(
            ERROR_CODES.NO_STATEMENT,
            "The resident must add a question before the assistant can suggest wording.",
          );
        }
        assertFreshPath(state.selectedPathId, state.selectedNeedId, now());
        throwIfCancelled(signal);
        return commit((next) => {
          next.pendingProposal = { proposedSummary, unresolvedQuestions };
          next.notice = "Assistant wording is ready for your review.";
        });
      }).then((next) => ({
        ok: true,
        status: "AWAITING_RESIDENT_REVIEW",
        revision: next.revision,
      }));
    },

    prepareForAssistant({ revision }, signal) {
      const capturedGeneration = state.generation;
      throwIfCancelled(signal);
      return enqueue(() => {
        throwIfCancelled(signal);
        assertConsent();
        assertRevision(revision);
        if (capturedGeneration !== state.generation) {
          throw new NavigatorError(
            ERROR_CODES.STATE_CHANGED,
            "The case was cleared. Read the current state and try again.",
          );
        }
        const path = assertFreshPath(state.selectedPathId, state.selectedNeedId, now());
        const need = getNeed(state.selectedNeedId);
        const statement = normalizeBoundedText(state.statement, MAX_STATEMENT_LENGTH);
        if (!statement) {
          throw new NavigatorError(
            ERROR_CODES.NO_STATEMENT,
            "The resident must add a question before a draft can be prepared.",
          );
        }
        const draft = createHandoffDraft({
          statement,
          need,
          path,
          townName: CIVIC_DATA.town.name,
        });
        throwIfCancelled(signal);
        return commit((next) => {
          next.draft = { ...draft, createdBy: "assistant" };
          next.notice = "The assistant prepared a draft for your review.";
        });
      }).then((next) => ({
        ok: true,
        status: "AWAITING_RESIDENT_REVIEW",
        revision: next.revision,
        draft: {
          recipient: next.draft.recipient,
          purpose: next.draft.purpose,
          subject: next.draft.subject,
          body: next.draft.body,
          reviewed: false,
        },
      }));
    },
  };
}

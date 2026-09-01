import { SOURCE_PACK } from "../data/waterbury-tax-2026.js";
import { ERROR_CODES, NavigatorError } from "./errors.js";

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) {
      deepFreeze(child);
    }
  }
  return value;
}

export const CIVIC_DATA = deepFreeze(structuredClone(SOURCE_PACK));

export function getNeed(needId) {
  return CIVIC_DATA.needs.find((need) => need.id === needId) ?? null;
}

export function getSource(sourceId) {
  return CIVIC_DATA.sources.find((source) => source.id === sourceId) ?? null;
}

export function getPath(pathId) {
  return CIVIC_DATA.paths.find((path) => path.id === pathId) ?? null;
}

export function isPathStale(path, now = new Date()) {
  if (!path?.staleAfter) {
    return false;
  }
  return !isDateOnly(path.staleAfter) || easternDate(now) > path.staleAfter;
}

export function ratesAreHistorical(now = new Date()) {
  const cutoff = CIVIC_DATA.rates.historicalAfter;
  return !isDateOnly(cutoff) || easternDate(now) > cutoff;
}

function isDateOnly(value) {
  return /^\d{4}-\d{2}-\d{2}$/u.test(value ?? "");
}

function easternDate(now) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    return "9999-12-31";
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/New_York",
    year: "numeric",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function findPathsForNeed(needId, now = new Date()) {
  const need = getNeed(needId);
  if (!need) {
    throw new NavigatorError(
      ERROR_CODES.UNSUPPORTED_CONTEXT,
      `Choose one of the supported ${CIVIC_DATA.town.name} property-tax needs.`,
    );
  }

  return need.pathIds.map((pathId) => {
    const path = getPath(pathId);
    if (!path) {
      throw new NavigatorError(
        ERROR_CODES.UNSUPPORTED_CONTEXT,
        "A configured civic path is unavailable.",
      );
    }

    return {
      id: path.id,
      label: path.label,
      office: path.office,
      purpose: path.purpose,
      contactMode: path.contactMode,
      checkedAt: path.checkedAt,
      stale: isPathStale(path, now),
      limitation: path.limitation,
      source: {
        publisher: getSource(path.sourceId)?.publisher ?? "Official publisher",
        title: getSource(path.sourceId)?.title ?? "Official source",
        url: getSource(path.sourceId)?.url ?? "",
      },
    };
  });
}

export function assertFreshPath(pathId, needId, now = new Date()) {
  const path = getPath(pathId);
  const need = getNeed(needId);

  if (!path || !need || !need.pathIds.includes(pathId)) {
    throw new NavigatorError(
      ERROR_CODES.NO_PATH_SELECTED,
      "Choose a source-backed starting point first.",
    );
  }

  if (isPathStale(path, now)) {
    throw new NavigatorError(
      ERROR_CODES.STALE_SOURCE,
      "This contact path needs to be reverified before preparing a handoff.",
    );
  }

  return path;
}

export function projectFacts() {
  return CIVIC_DATA.facts.map((fact) => ({
    id: fact.id,
    statement: fact.statement,
    limitation: fact.limitation,
    checkedAt: fact.checkedAt,
    sources: fact.sourceIds.map((sourceId) => {
      const source = getSource(sourceId);
      return {
        publisher: source?.publisher ?? "Official publisher",
        title: source?.title ?? "Official source",
        url: source?.url ?? "",
      };
    }),
  }));
}

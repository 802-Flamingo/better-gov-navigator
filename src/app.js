import {
  CIVIC_DATA,
  findPathsForNeed,
  getPath,
  getSource,
  isPathStale,
  projectFacts,
  ratesAreHistorical,
} from "./civic-data.js";
import { createNavigatorStore } from "./state.js";
import { createWebMCPController } from "./webmcp.js";

const store = createNavigatorStore();
const siteTools = createWebMCPController({ store });

const elements = {
  acceptProposal: document.querySelector("#accept-proposal"),
  appointmentLink: document.querySelector("#appointment-link"),
  assistantConsent: document.querySelector("#assistant-consent"),
  assistantStatus: document.querySelector("#assistant-status"),
  characterCount: document.querySelector("#character-count"),
  clearCase: document.querySelector("#clear-case"),
  contactDetail: document.querySelector("#contact-detail"),
  copyDraft: document.querySelector("#copy-draft"),
  draftBody: document.querySelector("#draft-body"),
  draftContent: document.querySelector("#draft-content"),
  draftEmpty: document.querySelector("#draft-empty"),
  draftPurpose: document.querySelector("#draft-purpose"),
  draftRecipient: document.querySelector("#draft-recipient"),
  draftReviewed: document.querySelector("#draft-reviewed"),
  draftReviewLabel: document.querySelector("#draft-review-label"),
  draftSubject: document.querySelector("#draft-subject"),
  factsList: document.querySelector("#facts-list"),
  needOptions: document.querySelector("#need-options"),
  openEmail: document.querySelector("#open-email"),
  pathOptions: document.querySelector("#path-options"),
  phoneLink: document.querySelector("#phone-link"),
  prepareDraft: document.querySelector("#prepare-draft"),
  proposalPanel: document.querySelector("#proposal-panel"),
  proposalQuestions: document.querySelector("#proposal-questions"),
  proposalSummary: document.querySelector("#proposal-summary"),
  rateTable: document.querySelector("#rate-table"),
  rateUnit: document.querySelector("#rate-unit"),
  recordsLink: document.querySelector("#records-link"),
  rejectProposal: document.querySelector("#reject-proposal"),
  reviewDraftLink: document.querySelector("#review-draft-link"),
  statement: document.querySelector("#resident-statement"),
  status: document.querySelector("#status-message"),
  unknownsList: document.querySelector("#unknowns-list"),
};

let statusTimer;
let lastAnnouncedRevision = -1;

const FACT_TITLES = Object.freeze({
  "waterbury-2026-rates": "Published 2026 tax rates",
  "waterbury-2026-change-pattern": "How the published rates changed",
  "vermont-property-classification": "Homestead and nonhomestead property",
});

function createElement(tag, { className, text } = {}) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function showStatus(message) {
  window.clearTimeout(statusTimer);
  elements.status.textContent = message;
  elements.status.classList.add("visible");
  statusTimer = window.setTimeout(() => {
    elements.status.classList.remove("visible");
  }, 3500);
}

function showError(error) {
  showStatus(error?.message ?? "The Navigator could not complete that action.");
}

function appendOfficialLink(parent, source, labelPrefix = "Official source") {
  const link = createElement("a", {
    text: `${labelPrefix} — ${source.publisher}: ${source.title}`,
  });
  link.href = source.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  parent.append(link);
}

function appendCompactSourceLink(parent, source) {
  const link = createElement("a", { text: source.title });
  link.href = source.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Official source: ${source.publisher}, ${source.title}`);
  parent.append(link);
}

function formatCheckedDate(dateString) {
  const date = new Date(`${dateString}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

function renderRates() {
  const historical = ratesAreHistorical();
  const table = createElement("table", { className: "rate-table" });
  const caption = createElement("caption", {
    text: `${CIVIC_DATA.town.name} ${CIVIC_DATA.rates.year} property-tax rates, ${CIVIC_DATA.rates.unit}`,
  });
  caption.className = "visually-hidden";
  table.append(caption);

  const head = createElement("thead");
  const headRow = createElement("tr");
  for (const label of ["Component", "Homestead", "Nonhomestead"]) {
    const heading = createElement("th", { text: label });
    heading.scope = "col";
    headRow.append(heading);
  }
  head.append(headRow);
  table.append(head);

  const body = createElement("tbody");
  for (const row of CIVIC_DATA.rates.rows) {
    const tr = createElement("tr");
    const heading = createElement("th", { text: row.label });
    heading.scope = "row";
    tr.append(heading);
    tr.append(createElement("td", { text: `$${row.homestead}` }));
    tr.append(createElement("td", { text: `$${row.nonhomestead}` }));
    body.append(tr);
  }
  table.append(body);
  elements.rateTable.replaceChildren(table);
  elements.rateUnit.textContent = `$ per $100 assessed · Checked Aug. 31, 2026${historical ? " · Historical" : ""}`;
  document.querySelector("#rates-title").textContent = historical
    ? `${CIVIC_DATA.town.name} ${CIVIC_DATA.rates.year} rates — historical`
    : `${CIVIC_DATA.town.name} ${CIVIC_DATA.rates.year} rates`;
}

function renderFacts() {
  const fragment = document.createDocumentFragment();
  for (const fact of projectFacts()) {
    const item = createElement("article", { className: "evidence-item" });

    const heading = createElement("div", { className: "evidence-heading" });
    heading.append(
      createElement("p", {
        className: "evidence-status",
        text: `Reviewed claim · Checked ${formatCheckedDate(fact.checkedAt)}`,
      }),
      createElement("h3", {
        text: FACT_TITLES[fact.id] ?? "Official civic record",
      }),
    );

    const details = createElement("details", { className: "evidence-details" });
    const summary = createElement("summary", { text: "Read the exact finding and limitation" });
    summary.setAttribute(
      "aria-label",
      `Read the exact finding and limitation for ${FACT_TITLES[fact.id] ?? "this official civic record"}`,
    );
    details.append(summary);
    const detailBody = createElement("div", { className: "evidence-detail-body" });
    detailBody.append(
      createElement("p", { className: "fact-statement", text: fact.statement }),
      createElement("p", {
        className: "fact-limitation",
        text: `What this does not tell you: ${fact.limitation}`,
      }),
    );
    details.append(detailBody);

    const sources = createElement("div", { className: "evidence-sources" });
    sources.append(createElement("p", { className: "source-label", text: "Official records" }));
    const links = createElement("div", { className: "source-links" });
    for (const source of fact.sources) {
      appendCompactSourceLink(links, source);
    }
    sources.append(links);

    item.append(heading, details, sources);
    fragment.append(item);
  }
  elements.factsList.replaceChildren(fragment);
}

function renderNeeds() {
  const fragment = document.createDocumentFragment();
  for (const need of CIVIC_DATA.needs) {
    const label = createElement("label", { className: "choice-row" });
    const input = createElement("input");
    input.type = "radio";
    input.name = "resident-need";
    input.value = need.id;
    input.addEventListener("change", () => {
      store.selectNeed(need.id).catch(showError);
    });
    label.append(input, createElement("span", { text: need.label }));
    fragment.append(label);
  }
  elements.needOptions.replaceChildren(fragment);
}

function renderUnknowns(state) {
  const fragment = document.createDocumentFragment();
  const questions = [
    ...CIVIC_DATA.unknowns.map((text) => ({ text, assistant: false })),
    ...state.assistantQuestions.map((text) => ({ text, assistant: true })),
  ];

  for (const question of questions) {
    const item = createElement("li", {
      className: question.assistant ? "assistant-question" : "",
      text: question.assistant ? `Assistant suggestion: ${question.text}` : question.text,
    });
    fragment.append(item);
  }
  elements.unknownsList.replaceChildren(fragment);
}

function renderProposal(state) {
  const proposal = state.pendingProposal;
  elements.proposalPanel.hidden = !proposal;
  if (!proposal) {
    elements.proposalSummary.textContent = "";
    elements.proposalQuestions.replaceChildren();
    return;
  }

  elements.proposalSummary.textContent = proposal.proposedSummary;
  const questions = proposal.unresolvedQuestions.map((text) =>
    createElement("li", { text }),
  );
  elements.proposalQuestions.replaceChildren(...questions);
}

function renderPaths(state) {
  elements.prepareDraft.disabled = !state.selectedPathId || !state.statement.trim();
  if (!state.selectedNeedId) {
    elements.pathOptions.replaceChildren(
      createElement("p", {
        className: "empty-state",
        text: "Choose the kind of help you need to see a source-backed starting point.",
      }),
    );
    return;
  }

  const paths = findPathsForNeed(state.selectedNeedId);
  const fragment = document.createDocumentFragment();
  for (const path of paths) {
    const row = createElement("article", { className: "path-row" });
    row.append(createElement("h3", { text: path.label }));
    row.append(createElement("p", { text: path.purpose }));
    row.append(
      createElement("p", {
        className: "path-limitation",
        text: path.limitation,
      }),
    );
    const sourceLine = createElement("p", { className: "path-limitation" });
    appendOfficialLink(sourceLine, path.source);
    sourceLine.append(document.createTextNode(` · Checked ${path.checkedAt}`));
    row.append(sourceLine);

    const label = createElement("label", { className: "switch-label path-select" });
    const input = createElement("input");
    input.type = "radio";
    input.name = "civic-path";
    input.value = path.id;
    input.checked = state.selectedPathId === path.id;
    input.disabled = path.stale;
    input.addEventListener("change", () => {
      store.selectPath(path.id).catch(showError);
    });
    label.append(
      input,
      createElement("span", {
        text: path.stale ? "Needs reverification" : "Choose this starting point",
      }),
    );
    row.append(label);
    fragment.append(row);
  }
  elements.pathOptions.replaceChildren(fragment);
}

function renderDraft(state) {
  const draft = state.draft;
  elements.draftEmpty.hidden = Boolean(draft);
  elements.draftContent.hidden = !draft;
  elements.reviewDraftLink.hidden = !draft;
  if (!draft) {
    elements.openEmail.hidden = true;
    elements.appointmentLink.hidden = true;
    elements.phoneLink.hidden = true;
    elements.recordsLink.hidden = true;
    return;
  }

  elements.draftRecipient.textContent = draft.recipient;
  elements.draftPurpose.textContent = draft.purpose;
  elements.draftSubject.textContent = draft.subject;
  elements.draftBody.textContent = draft.body;

  const path = getPath(draft.pathId);
  const source = getSource(draft.sourceId);
  const pathStale = isPathStale(path);
  const actionable = draft.reviewed && !pathStale;
  elements.draftReviewed.checked = actionable;
  elements.draftReviewed.disabled = pathStale;
  elements.copyDraft.disabled = !actionable;
  const contactParts = [];
  if (path?.email) {
    contactParts.push(`Email: ${path.email}`);
  }
  if (path?.phone) {
    contactParts.push(`Phone: ${path.phone}`);
  }
  if (path?.appointmentUrl) {
    contactParts.push(`Appointment page: ${path.appointmentUrl}`);
  }
  if (path?.recordsUrl) {
    contactParts.push(`Public-process page: ${path.recordsUrl}`);
  }
  if (pathStale) {
    contactParts.push("Needs reverification before use");
  }
  contactParts.push(`Checked ${path?.checkedAt ?? CIVIC_DATA.checkedAt}`);
  elements.contactDetail.textContent = contactParts.join(" · ");
  if (source) {
    const separator = document.createTextNode(" · ");
    elements.contactDetail.append(separator);
    appendOfficialLink(elements.contactDetail, source, "Verify with");
  }

  const destinations = [
    path?.email,
    path?.phone,
    path?.appointmentUrl,
    path?.recordsUrl,
  ].filter(Boolean);
  const destinationLabel = destinations.length > 0
    ? destinations.join("; ")
    : path?.office ?? "the public process shown above";
  const destinationWord = destinations.length === 1 ? "destination" : "destinations";
  elements.draftReviewLabel.textContent = pathStale
    ? "This destination needs reverification before the draft can be used."
    : `I reviewed the ${destinationWord} (${destinationLabel}) and the wording.`;

  elements.openEmail.hidden = !actionable || !draft.recipientEmail;
  elements.appointmentLink.hidden = !actionable || !path?.appointmentUrl;
  elements.phoneLink.hidden = !actionable || !path?.phone;
  elements.recordsLink.hidden = !actionable || !path?.recordsUrl;
}

function renderAssistantStatus(state) {
  elements.assistantConsent.checked = state.consent;
  elements.assistantConsent.disabled = !siteTools.isAvailable() && !state.consent;
  if (!state.consent && !siteTools.isAvailable()) {
    elements.assistantStatus.textContent =
      "Unavailable in this browser. The complete manual flow still works.";
  } else if (!state.consent) {
    elements.assistantStatus.textContent =
      "Off. The assistant connected to this page cannot read or change this case.";
  } else if (siteTools.isRegistered()) {
    elements.assistantStatus.textContent =
      "On. Your assistant can read this case and stage wording or a draft for your review. It cannot send.";
  } else if (!siteTools.isAvailable()) {
    elements.assistantStatus.textContent =
      "Sharing approved, but this browser does not offer site tools. The manual flow still works.";
  } else {
    elements.assistantStatus.textContent = "Preparing site tools...";
  }
}

function renderState(state) {
  if (document.activeElement !== elements.statement && elements.statement.value !== state.statement) {
    elements.statement.value = state.statement;
  }
  elements.characterCount.textContent = `${elements.statement.value.length} / 1000`;

  for (const input of elements.needOptions.querySelectorAll('input[name="resident-need"]')) {
    input.checked = input.value === state.selectedNeedId;
  }

  renderAssistantStatus(state);
  renderUnknowns(state);
  renderProposal(state);
  renderPaths(state);
  renderDraft(state);

  if (state.revision !== lastAnnouncedRevision) {
    lastAnnouncedRevision = state.revision;
    if (state.notice) {
      showStatus(state.notice);
    }
  }
}

renderRates();
renderFacts();
renderNeeds();
store.subscribe(renderState);

elements.statement.addEventListener("input", () => {
  elements.characterCount.textContent = `${elements.statement.value.length} / 1000`;
  store.setStatement(elements.statement.value).catch(showError);
});

elements.assistantConsent.addEventListener("change", async () => {
  try {
    if (elements.assistantConsent.checked) {
      await store.setConsent(true);
      const result = await siteTools.register();
      if (!result.available) {
        showStatus("This browser does not currently offer site tools. The manual flow still works.");
      } else {
        showStatus("Assistant sharing enabled for this page session.");
      }
    } else {
      siteTools.stop();
      await store.setConsent(false);
    }
    renderState(store.getSnapshot());
  } catch (error) {
    siteTools.stop();
    await store.setConsent(false);
    showError(error);
  }
});

elements.acceptProposal.addEventListener("click", () => {
  store.acceptProposal().catch(showError);
});

elements.rejectProposal.addEventListener("click", () => {
  store.rejectProposal().catch(showError);
});

elements.prepareDraft.addEventListener("click", () => {
  store.prepareManualDraft().catch(showError);
});

elements.draftReviewed.addEventListener("change", async () => {
  try {
    await store.reviewDraft(elements.draftReviewed.checked);
  } catch (error) {
    showError(error);
    renderState(store.getSnapshot());
  }
});

elements.copyDraft.addEventListener("click", async () => {
  let draft;
  try {
    draft = store.getActionableDraft();
  } catch (error) {
    showError(error);
    renderState(store.getSnapshot());
    return;
  }

  try {
    await navigator.clipboard.writeText(draft.body);
    showStatus("Copied. Paste it into an email or document when you are ready.");
  } catch {
    showStatus("Copy was unavailable. Select the draft text and copy it manually.");
  }
});

function withActionablePath(action) {
  try {
    const draft = store.getActionableDraft();
    const path = getPath(draft.pathId);
    action({ draft, path });
  } catch (error) {
    showError(error);
    renderState(store.getSnapshot());
  }
}

elements.openEmail.addEventListener("click", () => {
  withActionablePath(({ draft }) => {
    window.location.href = `mailto:${draft.recipientEmail}?subject=${encodeURIComponent(draft.subject)}`;
  });
});

elements.phoneLink.addEventListener("click", () => {
  withActionablePath(({ path }) => {
    window.location.href = `tel:${path.phone}`;
  });
});

elements.appointmentLink.addEventListener("click", () => {
  withActionablePath(({ path }) => {
    window.open(path.appointmentUrl, "_blank", "noopener,noreferrer");
  });
});

elements.recordsLink.addEventListener("click", () => {
  withActionablePath(({ path }) => {
    window.open(path.recordsUrl, "_blank", "noopener,noreferrer");
  });
});

window.setInterval(() => {
  renderState(store.getSnapshot());
}, 60_000);

elements.clearCase.addEventListener("click", async () => {
  siteTools.stop();
  await store.clearCase();
  elements.statement.value = "";
  elements.statement.focus();
});

window.addEventListener("pagehide", () => {
  siteTools.stop();
});

window.addEventListener("pageshow", async (event) => {
  if (event.persisted && store.getSnapshot().consent) {
    try {
      await siteTools.register();
      renderState(store.getSnapshot());
    } catch (error) {
      siteTools.stop();
      await store.setConsent(false);
      showError(error);
    }
  }
});

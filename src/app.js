import {
  CIVIC_DATA,
  findPathsForNeed,
  getPath,
  getSource,
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
  draftSubject: document.querySelector("#draft-subject"),
  factsList: document.querySelector("#facts-list"),
  needOptions: document.querySelector("#need-options"),
  openEmail: document.querySelector("#open-email"),
  pathOptions: document.querySelector("#path-options"),
  prepareDraft: document.querySelector("#prepare-draft"),
  proposalPanel: document.querySelector("#proposal-panel"),
  proposalQuestions: document.querySelector("#proposal-questions"),
  proposalSummary: document.querySelector("#proposal-summary"),
  rateTable: document.querySelector("#rate-table"),
  rateUnit: document.querySelector("#rate-unit"),
  rejectProposal: document.querySelector("#reject-proposal"),
  statement: document.querySelector("#resident-statement"),
  status: document.querySelector("#status-message"),
  unknownsList: document.querySelector("#unknowns-list"),
};

let statusTimer;
let lastAnnouncedRevision = -1;

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

function renderRates() {
  const historical = ratesAreHistorical();
  const table = createElement("table", { className: "rate-table" });
  const caption = createElement("caption", {
    text: `Waterbury ${CIVIC_DATA.rates.year} property-tax rates, ${CIVIC_DATA.rates.unit}`,
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
  elements.rateUnit.textContent = `${CIVIC_DATA.rates.unit} · Checked August 31, 2026${historical ? " · Historical record" : ""}`;
  document.querySelector("#rates-title").textContent = historical
    ? "Historical 2026 published rates"
    : "Published 2026 rates";
}

function renderFacts() {
  const fragment = document.createDocumentFragment();
  for (const fact of projectFacts()) {
    const item = createElement("article", { className: "evidence-item" });
    item.append(createElement("p", { text: fact.statement }));

    const context = createElement("div", { className: "evidence-context" });
    context.append(createElement("p", { text: `Limit: ${fact.limitation}` }));
    const links = createElement("div", { className: "source-links" });
    for (const source of fact.sources) {
      appendOfficialLink(links, source);
    }
    context.append(links);
    item.append(context);
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
      text: question.text,
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
  if (!draft) {
    elements.openEmail.hidden = true;
    elements.appointmentLink.hidden = true;
    return;
  }

  elements.draftRecipient.textContent = draft.recipient;
  elements.draftPurpose.textContent = draft.purpose;
  elements.draftSubject.textContent = draft.subject;
  elements.draftBody.textContent = draft.body;
  elements.draftReviewed.checked = draft.reviewed;
  elements.copyDraft.disabled = !draft.reviewed;

  const path = getPath(draft.pathId);
  const source = getSource(draft.sourceId);
  const contactParts = [];
  if (path?.phone) {
    contactParts.push(`Phone: ${path.phone}`);
  }
  contactParts.push(`Checked ${path?.checkedAt ?? CIVIC_DATA.checkedAt}`);
  elements.contactDetail.textContent = contactParts.join(" · ");
  if (source) {
    const separator = document.createTextNode(" · ");
    elements.contactDetail.append(separator);
    appendOfficialLink(elements.contactDetail, source, "Verify with");
  }

  elements.openEmail.hidden = !draft.reviewed || !draft.recipientEmail;
  if (draft.reviewed && draft.recipientEmail) {
    elements.openEmail.href = `mailto:${draft.recipientEmail}?subject=${encodeURIComponent(draft.subject)}`;
  } else {
    elements.openEmail.removeAttribute("href");
  }

  elements.appointmentLink.hidden = !draft.reviewed || !path?.appointmentUrl;
  if (draft.reviewed && path?.appointmentUrl) {
    elements.appointmentLink.href = path.appointmentUrl;
  } else {
    elements.appointmentLink.removeAttribute("href");
  }
}

function renderAssistantStatus(state) {
  elements.assistantConsent.checked = state.consent;
  if (!state.consent) {
    elements.assistantStatus.textContent =
      "Off. Your notes remain only in this page's memory.";
  } else if (siteTools.isRegistered()) {
    elements.assistantStatus.textContent =
      "On. Four site tools are available to your assistant for this page session.";
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

elements.draftReviewed.addEventListener("change", () => {
  store.reviewDraft(elements.draftReviewed.checked).catch(showError);
});

elements.copyDraft.addEventListener("click", async () => {
  const draft = store.getSnapshot().draft;
  if (!draft?.reviewed) {
    showStatus("Review the recipient and wording before copying.");
    return;
  }

  try {
    await navigator.clipboard.writeText(draft.body);
    showStatus("Copied. Paste it into an email or document when you are ready.");
  } catch {
    showStatus("Copy was unavailable. Select the draft text and copy it manually.");
  }
});

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

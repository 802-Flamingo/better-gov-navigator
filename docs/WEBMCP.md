# WebMCP Contract

## Lifecycle

Tools are registered imperatively from the top-level page through
`document.modelContext.registerTool`. Registration starts only after the
resident turns on `Share with this page's assistant`.

One abort controller owns the complete registration lifecycle. Concurrent
registration calls share one promise. Revocation, page exit, partial failure,
or a superseding lifecycle aborts every registration. Each handler separately
rechecks consent, cancellation, and revision because registration abort is not
assumed to cancel an in-flight call.

Turning sharing off removes assistant-generated pending content and any draft
created by an assistant. It preserves the resident's own wording. Revocation
prevents future access but cannot retract information already returned.

## Tools

### `get_handoff_state`

- Input: exact empty object.
- Read only: yes.
- Returns: resident-approved statement, town/topic IDs, selected need and path,
  revision, minimal staged-state summaries, and the canonical `CivicRecordV1`
  identity for citation and provenance.

### `find_civic_paths`

- Input: exact empty object.
- Read only: yes.
- Returns: immutable reviewed paths for the need already chosen by the resident,
  with source, limitation, checked date, and stale status; also returns the three
  reviewed civic claims, their limitations, linked source URLs, withheld bulk
  source IDs, and the canonical unknowns that must bound any assistant proposal.
  Every path and claim includes its permanent, no-JavaScript resident-readable
  record URL.

## Open-web record

`civic-record.json` is a public, passive projection of the same frozen source
pack. It contains reviewed claims, limitations, canonical unknowns, source
references, lifecycle states, and integrity metadata. It excludes resident case
text and direct contact destinations. The WebMCP read tools identify this record
instead of creating a competing assistant-only version of civic truth.
`civic-record.schema.json` publishes the strict project-local contract; it is
not represented as a government or cross-industry standard.

The citation pages expose findings, limitations, freshness, and official-source
references without loading case state. Following a citation therefore cannot
select a need, alter a revision, clear a draft, or grant assistant consent.

### `prepare_handoff`

- Input: exact object containing the current non-negative integer `revision`.
- Read only: no.
- Effect: stages the deterministic draft for the path already chosen by the
  resident. It cannot accept a recipient, address, URL, subject, or body.

### `propose_case_update`

- Input: current `revision`, one 1-1,000 character summary, and zero to six
  unanswered questions of at most 200 characters each.
- Read only: no.
- Preconditions: the resident has entered a non-empty question and chosen a
  fresh reviewed path.
- Effect: stages wording for explicit resident acceptance. It cannot modify
  accepted text, civic facts, sources, town, topic, need, path, recipient, or
  an existing draft.
- Release rule: remove its definition, registration, and UI if any real-browser,
  consent, stale-state, cancellation, or hostile-input gate fails.
- Open against that rule as of September 2, 2026: the hostile-input gate is
  **partial**. It rejects C0 controls (other than tab and line breaks), DEL,
  and the bidi embedding/override/isolate controls (U+202A–U+202E,
  U+2066–U+2069), but not zero-width and other `Cf` format characters (BOM,
  soft hyphen, bidi marks, Unicode Tags U+E0000–U+E007F), C1 controls
  (U+0080–U+009F), or variation selectors, and `acceptProposal` copies accepted
  wording without re-normalizing it. An assistant can stage characters the
  resident cannot see in the text they approve. The tool is retained for the
  competition entry because the failure cannot cause this site to transmit
  anything — no network capability (`connect-src 'none'`), the `mailto:` carries
  no body, and copy, email, phone, appointment, and records actions are human
  buttons only. Fix before any use beyond the demonstration: reject `\p{Cf}`
  (optionally allowing U+200D) and the C1 range U+0080 to U+009F in the shared
  normalizer, and re-normalize accepted wording on accept. Variation selectors
  are `Mn`, not `Cf`, and appear in ordinary emoji text; decide separately
  whether to strip them.

All schemas reject additional properties and are duplicated by runtime
validation. Every tool sets `untrustedContentHint: true`; only the first two set
`readOnlyHint: true`.

## Concurrency

Every human and assistant mutation enters one serialized queue. Mutating tool
calls provide the revision observed by the assistant. The queue rechecks that
revision immediately before commit. A stale call returns `STATE_CHANGED`.

The revision is concurrency protection, not identity or authentication.

## Prohibited capabilities

Tool-facing modules may not use HTTP, XHR, Beacon, WebSocket, clipboard,
navigation, window opening, forms, or email URLs. Human click handlers own copy
and external navigation. Tools return JSON-serializable objects only.

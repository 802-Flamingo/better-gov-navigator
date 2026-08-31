# WebMCP Contract

## Lifecycle

Tools are registered imperatively from the top-level page through
`document.modelContext.registerTool`. Registration starts only after the
resident turns on `Share this case with my assistant`.

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
  revision, and minimal staged-state summaries.

### `find_civic_paths`

- Input: exact empty object.
- Read only: yes.
- Returns: immutable reviewed paths for the need already chosen by the resident,
  with source, limitation, checked date, and stale status.

### `prepare_handoff`

- Input: exact object containing the current non-negative integer `revision`.
- Read only: no.
- Effect: stages the deterministic draft for the path already chosen by the
  resident. It cannot accept a recipient, address, URL, subject, or body.

### `propose_case_update`

- Input: current `revision`, one 1-1,000 character summary, and zero to six
  unanswered questions of at most 200 characters each.
- Read only: no.
- Effect: stages wording for explicit resident acceptance. It cannot modify
  accepted text, civic facts, sources, town, topic, need, path, recipient, or
  an existing draft.
- Release rule: remove its definition, registration, and UI if any real-browser,
  consent, stale-state, cancellation, or hostile-input gate fails.

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

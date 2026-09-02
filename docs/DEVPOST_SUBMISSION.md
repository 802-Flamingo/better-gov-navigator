# Devpost Submission Draft

## Title

Go Vermont Civic Navigator

## Tagline

Official facts in. Accountable next steps out. No guessing in between.

## Short description

Agents are about to start doing citizens' government errands, and the civic web
is the worst possible surface for them to guess on: stale pages, ambiguous
records, and destinations where a wrong guess reaches a real official about a
real person's money. Go Vermont Civic Navigator is a working answer to what a
government-facing page should hand an agent instead — a bounded civic contract.
Waterbury, Vermont property tax is town one: ten reviewed official sources, four
accountable paths, unsupported conclusions made structurally unavailable. The
whole workflow works with no assistant at all. With explicit consent, four
WebMCP tools let an assistant clarify the resident's question and stage a
deterministic handoff while remaining unable to choose a fact, alter a
destination, calculate a tax, or contact anyone.

## The actual submission: a standard, demonstrated once

The scarce thing here is not the town. It is the contract, and the contract is
published, tested, and reusable:

- **Facts are reviewed, not retrieved.** Every visible claim maps to a captured
  official source with publisher, URL, retrieval date, locator, evidence excerpt,
  and excerpt hash. There is no request-time model call anywhere in the product.
- **Unknowns are first-class.** What the records cannot establish is rendered as
  prominently as what they can. A missing answer is publishable. A guessed answer
  is not.
- **The destination is immutable.** An assistant reads the path the resident
  chose. No tool schema accepts a recipient, and no tool can send, submit, call,
  copy, open email, or navigate.
- **Consent is the precondition for existence, not a banner.** Zero site tools
  are registered before consent; revoking aborts registration mid-flight.
- **Contacts expire.** Paths go stale after 30 days and then refuse to prepare a
  handoff, because a civic destination that is merely *published* is not the same
  as one that is *current*.

[`docs/REPLICATION_BLUEPRINT.md`](REPLICATION_BLUEPRINT.md) states the seven-step
gate a second municipality must pass. We then ran that gate against a second
Vermont town, Woodstock, and **it failed — so there is no Woodstock page in this
product.** The full run is published at
[`docs/REPLICATION_ATTEMPT_WOODSTOCK.md`](REPLICATION_ATTEMPT_WOODSTOCK.md).

It is worth saying what stopped it, because the failures are the argument:

- Woodstock publishes **no 2026 summary rate table**. The rates exist only inside
  individual residents' tax bills, which identify named owners. This product
  already withholds bulk owner-record destinations from its entire deployed
  artifact; sourcing a headline fact from three named residents' bills would
  invert that boundary.
- Those bills **never print their units**. Reading "per $100 of assessed value"
  into the numbers means applying Vermont convention — an inference, and this
  product does not infer.
- Three of four contact destinations corroborated cleanly across two independent
  official sources. The fourth — the office that actually handles tax bills —
  appeared on exactly one page, so it was not publishable. The 2026 grievance
  dates were likewise single-source, and a date a resident relies on to preserve
  an appeal right is the wrong thing to publish from one uncorroborated
  document.

Along the way the gate also established something a flat rate table would have
gotten wrong for a large share of the town: Woodstock has **two live municipal
entities**, and which municipal rate applies depends on whether a parcel sits
inside the Village.

We would rather ship one town that is true than fifty that are plausible. A
municipality that fails the gate produces no page — that is the mechanism
working, not a gap in coverage.

We then ran the same discipline over our own write-up of the failure. An
independent verification pass, given the text and a mandate to disprove it,
removed a fourth blocker we had claimed: an apparent self-contradiction in the
town's grievance dates could not be reproduced against the live documents. It is
struck from the record. The remaining blockers held, and one of them alone —
a rate whose units are not printed anywhere — is disqualifying.

That is the condition of the civic web that makes this problem worth solving.
Official sites return HTTP 403 to automated retrieval. The state's own assessor
certification list contains malformed rows where a person's first name sits in
the town column. Documents change under the same URL, or move to a new one. None
of that is unusual or anyone's scandal — it is simply what a browsing agent will
meet, and it is exactly why an agent should be handed a bounded contract with
captured evidence rather than a page to guess from.

## Why WebMCP fits

Civic information is a high-consequence setting for ordinary browser
automation. A visually plausible page can still be stale, ambiguous, or easy to
misread. WebMCP gives this site a narrow contract: these site tools expose only
the reviewed source pack and the path already chosen by the resident. The tools
do not browse, alter an official destination, calculate tax, or contact anyone.
An assistant may have unrelated capabilities from its host, but none are granted
by this application.

## What the tools refuse

The refusals are the product, and each one is enforced in code and covered by a
test rather than described in a prompt:

- With sharing off, `document.modelContext` holds **zero** of this site's tools.
  Consent is re-checked before *and* after every individual registration, so
  revoking mid-registration aborts the whole set.
- `propose_case_update` uses `additionalProperties: false`. An assistant that
  tries to include a town, category, path, recipient, or civic fact is rejected
  by schema, not by judgment.
- Every mutating call carries a monotonic revision. A tool call staged against a
  case the resident has since changed is refused as stale rather than silently
  applied.
- A path older than 30 days cannot prepare a handoff at all.
- No tool in the manifest can copy, open email, dial, navigate, or submit. Those
  four controls exist only as human buttons, and they stay disabled until the
  resident checks a box confirming they read the exact destination *and* the
  wording.

## Better human experience

The resident sees the same five-step experience with or without an assistant.
Assistant collaboration is additive and reversible: sharing is off by default,
zero site tools exist before consent, proposed wording requires acceptance,
drafts require explicit destination-and-wording review, and only human controls
can copy or leave the page.

## What people and agents can do together

The resident supplies context and makes every consequential choice. The
assistant can structure that approved context, retrieve the bounded civic path
with its reviewed claims, source URLs, limitations, and canonical unknowns,
then surface unanswered questions and stage a draft. The website remains the
bounded control point for the reviewed official-source snapshot and
destinations.

The reviewed snapshot is also published as a durable `CivicRecordV1`: each
claim and path has a permanent URL, the lifecycle and unresolved questions are
explicit, and assistant-readable discovery files are generated from the same
source pack. This makes the civic evidence inspectable and reusable without
exposing a resident's case or contact destinations. Seven no-JavaScript record
pages make every claim and path independently readable and indexable; a strict
project-local JSON Schema makes the machine contract validatable.

## Implementation

The project is a dependency-free static application using semantic HTML, CSS,
ES modules, reviewed JSON, and Node's built-in test runner. Four imperative
WebMCP tools use strict schemas and equivalent runtime validation. All mutations
run through a serialized queue with monotonic revision checks. The deployment
has no runtime API, analytics, persistence, third-party script, or network
permission; CSP sets `connect-src 'none'`. The consent, revision, evidence, and
handoff controls can be reused after another town's source pack and visible civic
copy pass the same validation; the replication process is published with the
source code. The public civic record, assistant text, Atom feed, sitemap, and
crawler rules are deterministic build products whose parity is test-gated.
Production is assembled from one exact asset allowlist rather than a root-file
denylist.

## Links to fill at release

- Live branded URL: `https://navigator.govermont.co`
- Direct Vercel fallback: `https://better-gov-navigator.vercel.app`
- Public repository: `https://github.com/802-Flamingo/better-gov-navigator`
- Public YouTube demo: `TBD`
- Production commit: `89fcb28a85477ac65a8b01a6b7acf965adf7e672`
- Production deployment: `dpl_5tvpkqKfiTeNcYT3AyZet5W9SqFv`

## Technologies

WebMCP, JavaScript ES modules, HTML, CSS, JSON, Node.js test runner, Vercel.

## Prepared images

- Desktop product capture: `docs/assets/navigator-desktop.jpg`
- Mobile product capture: `docs/assets/navigator-mobile.jpg`

The mobile capture shows the first-use experience and independent-service
notice. The desktop capture shows a synthetic, reviewed handoff with exact
destination controls. Neither contains an account, credential, private
repository, or real resident case.

## Boundaries

Independent demonstration by 802 Flamingo LLC. Not a municipal or state
government website. No endorsement implied. It does not diagnose an individual
bill, calculate taxes, store case data, or send messages.

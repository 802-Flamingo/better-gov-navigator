# Devpost Submission Draft

## Title

Go Vermont Civic Navigator

## Tagline

Official facts in. Accountable next steps out. No guessing in between.

## Short description

Go Vermont Civic Navigator turns a frustrating property-tax question into a
bounded civic handoff. It shows a Waterbury resident what ten reviewed official
sources establish, makes unsupported conclusions visibly unavailable, and maps
four common needs to accountable starting points. The full workflow works
manually. With explicit consent, WebMCP lets an assistant clarify the resident's
question and stage a deterministic handoff without choosing official facts,
destinations, or external actions.

## Why WebMCP fits

Civic information is a high-consequence setting for ordinary browser
automation. A visually plausible page can still be stale, ambiguous, or easy to
misread. WebMCP gives this site a narrow contract: these site tools expose only
the reviewed source pack and the path already chosen by the resident. The tools
do not browse, alter an official destination, calculate tax, or contact anyone.
An assistant may have unrelated capabilities from its host, but none are granted
by this application.

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

# Go Vermont Civic Navigator

An independent, source-backed Waterbury property-tax workflow for residents and
their assistants. The Navigator separates what official records establish from
what they cannot establish about an individual bill, then prepares the shortest
accountable next step for the resident to review.

Powered by **Better Gov Navigator**. Built and submitted by **802 Flamingo LLC**.

This is not a Town of Waterbury or State of Vermont website, and no government
endorsement is implied.

## Live application

- Branded URL: <https://navigator.govermont.co>
- Direct Vercel fallback: <https://better-gov-navigator.vercel.app>

The branded address is a direct Vercel project domain. It does not execute this
application through the private GoVermont deployment. The deployment-specific
rollback artifact is recorded in [docs/RELEASE_RECORD.md](docs/RELEASE_RECORD.md)
and requires Vercel project access; it is not presented as a public fallback.

## What it does

The single-page workflow is fully usable without an assistant:

1. Record the resident's question without sensitive identifiers.
2. Show reviewed 2026 Waterbury rates and source-backed limitations.
3. Name the facts that remain unknown about an individual bill.
4. Map one of four plain-language needs to a reviewed official starting point.
5. Prepare a deterministic draft that the resident must review.

Assistant sharing is off by default. When enabled in a WebMCP-capable browser,
the page exposes four narrow tools. No tool can browse, calculate tax, change a
recipient, copy text, navigate, submit a form, open email, or send a message.

## Human gates

- The resident must enable assistant sharing before any site tool can read the
  case. Revocation aborts all registrations and prevents future reads.
- The resident chooses the need and source-backed path. An assistant cannot
  choose or alter the official destination.
- Assistant wording remains a labeled proposal until the resident accepts it.
- A draft requires resident context and a selected fresh path. Copy, email,
  phone, appointment, and records actions remain locked until the resident
  reviews the exact destination and wording.
- No assistant tool sends, submits, calls, copies, opens email, or navigates.
  Only an explicit resident control may copy text or leave the page.
- Civic facts are generated from the frozen, human-reviewed source pack; there
  is no request-time model call or automatic AI publication pipeline.

## Durable civic record

The same reviewed source pack also produces a public `CivicRecordV1` projection.
It gives each claim and civic path a permanent URL, records the workflow
lifecycle, preserves explicit unknowns and limitations, and links back to the
official sources. Resident case text and contact destinations are excluded.
Seven generated, no-JavaScript record pages make those citations readable and
indexable without loading the interactive application.

- Machine record: <https://navigator.govermont.co/civic-record.json>
- Validation schema: <https://navigator.govermont.co/civic-record.schema.json>
- Assistant index: <https://navigator.govermont.co/llms.txt>
- Full assistant-readable record: <https://navigator.govermont.co/llms-full.txt>
- Reviewed snapshot feed: <https://navigator.govermont.co/feed.xml>

The JSON, assistant text, Atom feed, sitemap, and crawler instructions are
generated deterministically from the reviewed source pack. Validation fails if
any committed projection drifts.

## Run locally

Requirements: Node.js 20 or newer. There are no runtime or development package
dependencies and no install step.

```bash
npm run check
npm run dev
```

Open `http://127.0.0.1:4173`. Reloading clears the case.

## Tests

```bash
npm run generate
npm run validate
npm test
npm run test:security
```

The gates cover source-pack parity and hashes, immutable civic data, stale
contacts, exact destination allowlists, deterministic handoffs, strict schemas,
hostile input, consent and revocation, registration races, stale revisions,
replay, cancellation, and partial WebMCP registration failure.

## Architecture

- `index.html` and `styles.css`: semantic, linear resident interface.
- `src/state.js`: in-memory case state and serialized mutation queue.
- `src/webmcp.js`: consent-gated imperative WebMCP registration.
- `src/handoff.js`: deterministic resident draft generation.
- `src/record-contract.js`: permanent record, claim, and path identifiers.
- `data/waterbury-tax-2026.json`: full reviewed source pack used at build time.
- `data/waterbury-tax-2026.js`: generated, production-safe browser projection.
- `civic-record.json`: public, contact-free projection of the reviewed record.
- `civic-record.schema.json`: strict project-local validation contract.
- `scripts/source-pack.mjs`: deterministic browser-pack privacy boundary.
- `scripts/civic-record-assets.mjs`: deterministic open-web projections.
- `scripts/build-static.mjs`: exact production-asset allowlist builder.
- `scripts/validate-source-pack.mjs`: source, hash, and destination gates.
- `vercel.json`: isolated static deployment and restrictive security headers.

## Trust boundaries

- No private GoVermont code, data, API, or deployment is required.
- No account, analytics, persistence, service worker, runtime API, or paid API.
- Public discovery files contain no resident case text or direct contact
  destination; they are passive static data under the same restrictive CSP.
- Direct links to bulk property-bill PDFs are withheld from the entire deployed
  artifact because those official documents contain owner data. Stable source
  IDs and captured-evidence hashes preserve the audit trail without distributing
  those owner-record destinations.
- Case data stays in page memory and is cleared by reload or `Clear this case`.
- The email URL contains only an exact allowlisted recipient and generic subject.
- The resident copies the body separately; Go Vermont never sends it.
- Contact paths expire after 30 days. Expired paths cannot prepare a handoff.
- 2026 rates automatically gain a historical label after June 30, 2027.

See [SOURCES.md](SOURCES.md), [SECURITY.md](SECURITY.md),
[docs/WEBMCP.md](docs/WEBMCP.md), and
[docs/THREAT_MODEL.md](docs/THREAT_MODEL.md) for the full contracts. The
[replication blueprint](docs/REPLICATION_BLUEPRINT.md) explains how the bounded
method can expand to another municipality without claiming that coverage exists
today. That gate has been run once against a second town, Woodstock, and
[it failed](docs/REPLICATION_ATTEMPT_WOODSTOCK.md) — which is why there is no
Woodstock page here. The current operator and Claude handoff is maintained in
[docs/CLAUDE_HANDOFF.md](docs/CLAUDE_HANDOFF.md).

## License

Code is MIT licensed. Brand and civic-data boundaries are described in
[NOTICE.md](NOTICE.md).

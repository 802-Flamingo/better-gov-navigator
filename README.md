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
- `data/waterbury-tax-2026.json`: reviewed civic source pack.
- `data/waterbury-tax-2026.js`: identical browser-readable source pack.
- `scripts/validate-source-pack.mjs`: source, hash, and destination gates.
- `vercel.json`: isolated static deployment and restrictive security headers.

## Trust boundaries

- No private GoVermont code, data, API, or deployment is required.
- No account, analytics, persistence, service worker, runtime API, or paid API.
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
today.

## License

Code is MIT licensed. Brand and civic-data boundaries are described in
[NOTICE.md](NOTICE.md).

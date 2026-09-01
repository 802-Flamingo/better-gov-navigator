# Threat Model

## Assets

- The resident's narrative question.
- Accuracy and provenance of published civic facts.
- Integrity of civic recipients and source destinations.
- The resident's control over sharing, wording, and contact.
- The public repository and deployed artifact.

## Adversaries and failures

- Prompt injection or markup in resident, assistant, or civic-source text.
- A stale, replayed, oversized, malformed, cancelled, or concurrent tool call.
- Consent revoked while registration or mutation is in progress.
- Partial or duplicate WebMCP registration.
- A changed source URL, contact, phone, appointment URL, or source mapping.
- A stale contact or tax year presented as current.
- A draft prepared before contact expiry remaining actionable after expiry.
- Assistant-suggested questions appearing to be reviewed civic facts.
- Accidental inclusion of resident text in a request, URL, analytics event, or
  email link.
- Repository secret leakage or dependency supply-chain compromise.
- A stale or altered public record, assistant index, feed, or sitemap diverging
  from the reviewed source pack.
- Resident case text or direct contact destinations leaking into open-web
  discovery files.
- A government-affiliation inference caused by branding or source presentation.

## Controls

- Static app, isolated origin, no dependencies, APIs, analytics, persistence,
  service worker, inline executable code, or third-party assets.
- CSP `connect-src 'none'`, `form-action 'none'`, `frame-ancestors 'none'`, no
  `unsafe-inline`, and no `unsafe-eval`.
- Exact official-origin and civic-destination allowlists at validation time.
- Deep-frozen source pack and deterministic projections.
- Generated open-web assets with byte-for-byte parity tests; the public
  `CivicRecordV1` omits resident state and direct contact destinations.
- No-JavaScript claim and path pages, a strict project-local schema, and one
  exact shared local/production asset allowlist.
- A shared deterministic sanitizer removes bulk issued-bill URLs containing
  owner information before the browser module and all public assets are built;
  tests reject those URLs anywhere in the exact production output.
- `textContent` rendering; no dynamic HTML.
- Bounded narrative fields; dangerous display-control characters removed from
  resident input and rejected in assistant proposals.
- One registration lifecycle and one serialized mutation queue.
- Consent, cancellation, generation, source freshness, and revision checks.
- Partial registration abort and last-known manual interface.
- Human review before copy or navigation; no automatic contact. Destination
  command buttons contain no dormant URL and recheck freshness on activation.
- Assistant questions retain explicit provenance before and after acceptance.
- Generic-subject `mailto:` with no body or resident text.
- Contact expiry after 30 days and automatic historical labeling for rates.
- MIT license, trademark boundary, non-endorsement notice, and public source
  provenance.

## Residual risks

- Official sources can change after capture; the excerpt hash proves repository
  integrity, not current source equivalence.
- Permanent record URLs identify this reviewed snapshot; they do not make the
  underlying official page current after its checked date.
- A resident can still enter information they were warned not to enter.
- Information already returned to an assistant cannot be retracted from that
  provider by browser consent revocation.
- WebMCP is an evolving interface and supported-browser behavior may change.
- An external email client or official website has its own privacy and security
  properties after the resident deliberately leaves the Navigator.

## Release response

Any failed stop condition blocks submission. Roll back by redeploying the last
verified Vercel deployment, preserve its SHA, and keep the direct deployment URL
as the independent fallback.

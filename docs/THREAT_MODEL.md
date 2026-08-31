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
- Accidental inclusion of resident text in a request, URL, analytics event, or
  email link.
- Repository secret leakage or dependency supply-chain compromise.
- A government-affiliation inference caused by branding or source presentation.

## Controls

- Static app, isolated origin, no dependencies, APIs, analytics, persistence,
  service worker, inline executable code, or third-party assets.
- CSP `connect-src 'none'`, `form-action 'none'`, `frame-ancestors 'none'`, no
  `unsafe-inline`, and no `unsafe-eval`.
- Exact official-origin and civic-destination allowlists at validation time.
- Deep-frozen source pack and deterministic projections.
- `textContent` rendering; no dynamic HTML.
- Bounded narrative fields; dangerous display-control characters removed from
  resident input and rejected in assistant proposals.
- One registration lifecycle and one serialized mutation queue.
- Consent, cancellation, generation, source freshness, and revision checks.
- Partial registration abort and last-known manual interface.
- Human review before copy or navigation; no automatic contact.
- Generic-subject `mailto:` with no body or resident text.
- Contact expiry after 30 days and automatic historical labeling for rates.
- MIT license, trademark boundary, non-endorsement notice, and public source
  provenance.

## Residual risks

- Official sources can change after capture; the excerpt hash proves repository
  integrity, not current source equivalence.
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

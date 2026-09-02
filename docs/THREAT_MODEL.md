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
  owner information before the browser module and all public assets are built.
  Tests assert those URLs are absent from the generated browser module, the
  public `CivicRecordV1` record (which also feeds `llms-full.txt`), and
  assistant reads; they do not scan every served file. **Those tests run under
  `npm run check`, not in the deploy build** — the Vercel build chain is
  `generate && validate && build-static`, which does not invoke them. A green
  deploy proves the served assets match the sanitizer's output (`validate`
  asserts that), not that the withheld-source list is complete or that the
  URLs are absent from the served bytes. Run `npm run check` before any release.
- `textContent` rendering; no dynamic HTML.
- Bounded narrative fields. **C0 control characters other than tab, line
  feed, and carriage return; DEL; and the bidirectional embedding, override,
  and isolate controls (U+202A–U+202E, U+2066–U+2069)** are removed from
  resident input and rejected in assistant proposals. This is narrower than
  "dangerous display-control characters": zero-width and other `Cf` format
  characters (including BOM, soft hyphen, bidi marks, and Unicode Tags
  U+E0000–U+E007F), C1 controls (U+0080–U+009F), and variation selectors are
  **not** currently rejected, and `acceptProposal` does not re-normalize
  accepted wording. An assistant can therefore stage text that the resident
  cannot see before approving it. No such text can be sent by this site — there
  is no network capability, the `mailto:` carries no body, and every outbound
  action is a human button — but a downstream reader of the copied draft could
  act on it. Known limitation, September 2, 2026; corrected here rather than
  left overstated.
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

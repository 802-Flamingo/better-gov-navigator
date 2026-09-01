# Security Policy

## Supported artifact

Security reports should identify the deployed URL and exact Git commit. The
challenge release is a frozen static artifact; changes after submission require
a separately reviewed release.

## Report privately

Do not include resident case text, account numbers, tax documents, credentials,
or proof-of-concept secrets in a public issue. Use GitHub's private security
advisory flow for this repository.

## Security properties

- No third-party scripts, external fonts, package dependencies, service worker,
  analytics, persistence, runtime API, or network-capable WebMCP tool.
- Local serving and production upload include only the explicit browser assets;
  repository metadata, tests, reviewed JSON, and documentation are not served.
- CSP blocks all runtime connections with `connect-src 'none'`.
- Source origins, recipients, phone numbers, appointment URLs, records URLs,
  and source-to-path mappings are exact build-time allowlists.
- Resident and assistant text is rendered only as text, never HTML.
- Control and bidirectional-override characters are stripped from resident text
  and rejected in assistant proposals.
- Tool registration exists only during explicit sharing consent and uses one
  abortable lifecycle. Registration, revocation, and mutation races are tested.
- Every state-changing tool requires the current monotonic revision immediately
  before commit. The revision prevents stale writes; it is not authentication.
- Human command buttons contain no dormant destination URL. On each activation,
  they recheck review state and source freshness before opening an allowlisted
  email, phone, appointment, or records route. The resident's draft body is
  never included in a URL.

## Stop conditions

Do not deploy or submit after any secret exposure, unexpected HTTP request,
source ambiguity, destination mismatch, WebMCP discovery failure, incomplete
unregistration, GoVermont regression, or paid-service requirement.

See [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md) for adversaries and controls.

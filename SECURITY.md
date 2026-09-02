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
- Local serving and production upload include only explicit browser and passive
  discovery assets. The Vercel build copies one shared exact allowlist into its
  output directory; repository metadata, tests, the full reviewed source-pack
  JSON, build scripts, and documentation are not served. "Not served" means not
  present in the deployed artifact — it does **not** mean secret: this
  repository is public, and `SOURCES.md` prints the withheld bulk-bill URLs in
  full. The sanitizer is a non-amplification control over what this site and its
  assistant tools hand out, not a confidentiality control over public records.
- The public `CivicRecordV1`, assistant text, feed, sitemap, and crawler rules
  are generated from the reviewed source pack and parity-tested. They contain no
  resident case state or direct contact destinations.
- URLs for bulk issued-bill documents containing owner information are removed
  by a deterministic sanitizer before the browser data module or any other
  production asset is built. Stable source IDs and evidence hashes remain.
- CSP blocks all runtime connections with `connect-src 'none'`.
- Source origins, recipients, phone numbers, appointment URLs, records URLs,
  and source-to-path mappings are exact build-time allowlists.
- Resident and assistant text is rendered only as text, never HTML.
- C0 control characters (other than tab and line breaks), DEL, and
  bidirectional embedding/override/isolate characters are stripped from
  resident text and rejected in assistant proposals. C1 controls and invisible
  `Cf` format characters are not; see `docs/THREAT_MODEL.md` for the exact
  boundary and the deferred fix.
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

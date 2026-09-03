# Release Record

## Production artifact

- Recorded: September 1, 2026
- Reviewed merge: PR `#6`
- Git commit: `89fcb28a85477ac65a8b01a6b7acf965adf7e672`
- Vercel production deployment: `dpl_5tvpkqKfiTeNcYT3AyZet5W9SqFv`
- Deployment-specific URL:
  `https://better-gov-navigator-8lb3ktknp-802-flamingo.vercel.app`
- Verified preview: `dpl_2eTmtNXjww9R177sXRgWwLezSApp` (deleted after
  production promotion)
- Branded URL: `https://navigator.govermont.co`
- Direct public fallback: `https://better-gov-navigator.vercel.app`
- Prior known-good rollback: `dpl_FdkWUSveYDbsmugY4PN94bCjsm7G`
- Expected and observed incremental cost: `$0`
- Public repository: `https://github.com/802-Flamingo/better-gov-navigator`

The branded domain is attached directly to the isolated Vercel project. No
private GoVermont code, API, runtime, or reverse proxy participates in the
deployment. The release was promoted from the byte-verified preview because the
project did not automatically deploy the merged PR.

The deployment-specific URL is retained for operator rollback. The stable
Vercel alias and branded domain both resolve to the production deployment.

`main` has moved past the deployed commit, and that gap is deliberate. Every
commit after `89fcb28a85477ac65a8b01a6b7acf965adf7e672` — through `main` at
`ad71ccd0b3a9a1e7a684e81538768151567fa04d` — changes documentation only. Verify
before assuming: `git diff --stat 89fcb28 ad71ccd` touches no file under `src/`,
`data/`, or `scripts/`, so a build at either commit produces the same 26 assets.
The recorded commit is therefore the deployed artifact, not a stale pointer, and
no redeploy is owed. A source or application change would require a new commit,
deployment, and release record.

## Verified artifact

- The production output contains exactly 26 allowlisted static assets and no
  runtime API, service worker, package dependency, analytics, or persistence.
- All 26 public responses byte-match the local production build at merge commit
  `89fcb28a85477ac65a8b01a6b7acf965adf7e672`.
- The reviewed source pack produces 15 deterministic public assets: a sanitized
  browser source module, `CivicRecordV1`, strict project-local JSON Schema,
  assistant indexes, Atom feed, sitemap, crawler rules, and seven no-JavaScript
  claim or civic-path pages.
- The source pack contains ten official Waterbury or Vermont sources, three
  publishable facts, four canonical unknowns, and four deterministic starting
  paths.
- The two bulk property-bill PDF URLs are absent from every production asset and
  every serialized WebMCP read response. Stable source IDs and captured-evidence
  hashes preserve the audit trail.
- `package.json`, `README.md`, the full reviewed JSON source pack, build scripts,
  tests, documentation, and Git internals return 404 from production.
- The production edge returns the restrictive CSP, HSTS, no-referrer,
  `nosniff`, frame denial, and restrictive Permissions Policy.

## Verification gates

- `npm run check`: 62 of 62 tests passed.
- `npm run build`: 26 expected files, 26 emitted, zero missing, zero extra.
- Desktop and 390px/320px production browser canaries passed with no horizontal
  overflow, clipped actionable content, console errors, or unexpected requests.
- All seven permanent citation pages rendered without JavaScript and matched
  their canonical record URLs.
- All four WebMCP definitions registered only after consent. Read responses
  carried stable citations, explicit limitations, linked source URLs, withheld
  source IDs, and canonical unknowns. Revocation aborted all registrations.
- The complete manual flow prepared a deterministic draft without assistant
  consent. Destination actions remained unavailable until the resident reviewed
  the exact destination and wording; command controls contained no dormant URL.
- Four private-path probes returned 404. The Atom feed returned
  `application/atom+xml`; JSON, text, XML, JavaScript, and HTML resources returned
  the expected types.
- Independent security/privacy, open-web/Vercel, and UX/accessibility red-team
  passes reported no remaining blocker after remediation.
- The public deployment and review process incurred no package installation,
  paid API, subscription, or incremental hosting charge.

## Human-gate contract

- Assistant sharing begins only after explicit resident consent and ends
  immediately on revocation.
- The resident supplies the case text and chooses the need and reviewed civic
  path. Tools cannot select or change the recipient, source, town, or topic.
- Assistant-generated wording and questions remain staged until explicit
  resident acceptance.
- Destination controls remain locked until the resident reviews both the exact
  destination and wording. No tool performs an external action; only an explicit
  resident control may copy text or leave the page.
- Publication is build-time and human-reviewed. No model can publish or modify a
  civic fact at request time.

## Open submission gates

Every remaining gate is owner-owned. No engineering work is outstanding.

- ~~Execute `get_handoff_state` once through Chrome's WebMCP DevTools pane or a
  compatible Chrome agent.~~ **SUPERSEDED September 1, 2026.** Tool *execution*
  against production is already proven by the ChatGPT in-app-browser canary
  (discovery, call, stale state, revocation), and Chrome 152 separately proved
  the registration lifecycle in both directions. This gate asked for a second
  route to a property already demonstrated, not for missing coverage. Retained
  struck through rather than deleted so the record shows why it closed; see
  `RELEASE_CHECKLIST.md` for the full entry.
- Publish the public under-three-minute YouTube demonstration.
- Add the video URL to Devpost, verify it without authentication, and submit by
  September 3 at 10:00 a.m. Pacific.

These open gates do not alter the recorded production artifact. Any source or
application change requires a new commit, deployment, and release record.

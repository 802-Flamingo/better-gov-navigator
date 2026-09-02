# Claude Handoff

## Read this first

This is the authoritative handoff for Go Vermont Civic Navigator as of
September 1, 2026. Verify every external state before acting; do not treat this
document as proof that GitHub, Vercel, Chrome, or Devpost remained unchanged.

Repository scope is only `802-Flamingo/better-gov-navigator`. Do not modify the
private GoVermont repository or any FedUp Citizen, Eat Vermont, Vermont Life, or
other sibling project.

## Current state

- Live product: `https://navigator.govermont.co`
- Direct public fallback: `https://better-gov-navigator.vercel.app`
- Public repository: `https://github.com/802-Flamingo/better-gov-navigator`
- Product commit: `89fcb28a85477ac65a8b01a6b7acf965adf7e672`
- Production deployment: `dpl_5tvpkqKfiTeNcYT3AyZet5W9SqFv`
- Production artifact URL:
  `https://better-gov-navigator-8lb3ktknp-802-flamingo.vercel.app`
- Prior known-good rollback: `dpl_FdkWUSveYDbsmugY4PN94bCjsm7G`
- Incremental cost: `$0`
- Package dependencies: none

PR #6 delivered the durable civic-record layer. PR #7 recorded the release, and
PR #8 recorded deletion of the disposable preview. All were squash-merged
through the normal path without an admin bypass.

## What is built

The resident can manually complete a five-step Waterbury property-tax workflow:
state a question, inspect reviewed facts, see what remains unknown, choose one of
four accountable paths, and prepare a deterministic draft for review.

The same reviewed source pack generates:

- `CivicRecordV1` and a strict project-local JSON Schema.
- Three permanent claim pages and four permanent civic-path pages.
- `llms.txt`, `llms-full.txt`, an Atom feed, sitemap, and crawler rules.
- A sanitized browser source module that withholds two bulk owner-record URLs.
- Stable civic-record and citation metadata in WebMCP read responses.

The production build is an exact 26-file allowlist. The full reviewed JSON,
build scripts, package metadata, tests, documentation, and Git files are not
served.

## Human-gate contract

Do not weaken these properties:

1. Assistant sharing is off by default. No tool reads a case before consent.
2. The resident enters the case and selects the need and reviewed path.
3. Assistant wording stays staged until the resident explicitly accepts it.
4. Draft actions stay locked until the resident reviews destination and wording.
5. No assistant tool sends, submits, calls, copies, opens email, or navigates.
   Only an explicit resident control may copy text or leave the page.
6. Revocation aborts all registrations and blocks future reads or mutations.
7. Civic publication is generated from a frozen, human-reviewed source pack.
   There is no request-time AI and no automatic model publication.

The revision number is concurrency protection, not identity or authentication.
Resident state remains in page memory and disappears on reload.

## Verified evidence

- `npm run check`: 62 of 62 tests passed.
- `npm run build`: 26 expected files, 26 emitted, zero missing or extra.
- All 26 production responses byte-matched the reviewed product commit.
- Desktop, 390px, and 320px browser canaries passed.
- Four WebMCP tools registered after consent and aborted on revocation.
- The complete manual flow and locked destination review passed.
- Seven no-JavaScript citation pages rendered at their canonical URLs.
- Private-path probes returned 404; production made no unexpected request and
  emitted no console error.
- Independent security/privacy, open-web/Vercel, and UX/accessibility red teams
  reported no remaining blocker.
- The two bulk owner-record URLs occur in neither production nor serialized tool
  responses.

## Remaining work

The product has no known defect. These submission and maintenance items remain:

1. Execute one read-only `get_handoff_state` call through Chrome's actual WebMCP
   DevTools testing surface or a compatible Chrome agent. Real Chrome
   registration and revocation already passed; the connector used previously did
   not expose Chrome's tool-execution hook.
2. Record and publish the under-three-minute public YouTube demonstration using
   `docs/DEMO_SCRIPT.md` and `docs/DEMO_NARRATION.md`.
3. Add the public video URL to `docs/DEVPOST_SUBMISSION.md`, verify the video in a
   logged-out session, and submit by September 3 at 10:00 a.m. Pacific.
4. Reverify all four contact paths before September 30, 2026. The application
   fails closed after that date; stale paths cannot prepare a handoff.

Do not change production merely to clear a checklist item. A source or product
change requires a new branch, tests, browser verification, reviewed PR,
deployment, production canary, and release-record update.

## Operating instructions

Start read-only:

```bash
git status --short --branch
git fetch origin --prune
git log -5 --oneline --decorate
npm run check
npm run build
```

There is no install step. Do not run `npm install` and do not add a package
without explicit approval. Do not introduce a paid API, account, analytics,
persistence, tax calculator, or automatic contact.

For source changes, edit the full reviewed JSON only after independently
rechecking every official fact and destination. Run `npm run generate`; never
hand-edit the generated browser module or public record files. Ambiguity blocks
publication. Never infer a tax component, eligibility, bill diagnosis, vote,
decision, deadline, or source completeness.

Use a normal branch and PR. Do not push directly to `main` or use an admin
bypass. The Vercel project did not automatically deploy PR #6; the reviewed
preview was promoted manually. Verify actual behavior instead of assuming a Git
merge deployed it.

`vercel curl` may silently create a project-level automation-bypass secret when
reading a protected preview. If it is used, revoke only the newly created bypass
after verification and confirm that SSO and Git-fork protection remain enabled.
Delete disposable previews after production is verified; preserve the documented
production and rollback deployments.

## Canonical documents

- `docs/RELEASE_RECORD.md`: exact production artifact and verification.
- `docs/RELEASE_CHECKLIST.md`: completed and outstanding gates.
- `docs/WEBMCP.md`: tool schemas, lifecycle, and prohibited capabilities.
- `docs/THREAT_MODEL.md`: adversaries, controls, and residual risks.
- `SOURCES.md`: official source pack and refresh procedure.
- `SECURITY.md`: production security properties and stop conditions.
- `docs/DEVPOST_SUBMISSION.md`: prepared submission copy.
- `docs/DEMO_SCRIPT.md` and `docs/DEMO_NARRATION.md`: video plan.

If a live fact conflicts with this document, stop and reconcile it before making
changes. Missing civic information is safer than a plausible unsupported claim.

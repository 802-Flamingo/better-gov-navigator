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

1. SUPERSEDED September 1, 2026. This asked for one read-only `get_handoff_state`
   call through Chrome's WebMCP DevTools surface. Real tool execution against
   production was already proven by the ChatGPT in-app-browser canary
   (discovery, call, stale state, revocation), and Chrome 152 proved the
   registration lifecycle in both directions. The item requested a second route
   to a demonstrated property, not missing coverage, and is closed as redundant
   rather than left reading like a gap. Do not reopen it by driving a page-side
   handler from a console and calling that an agent invocation.
2. Record and publish the under-three-minute public YouTube demonstration using
   `docs/DEMO_SCRIPT.md` and `docs/DEMO_NARRATION.md`.
3. Add the public video URL to `docs/DEVPOST_SUBMISSION.md`, verify the video in a
   logged-out session, and submit by September 3 at 10:00 a.m. Pacific.
4. Reverify all four contact paths before September 30, 2026. The application
   fails closed after that date; stale paths cannot prepare a handoff.

Do not change production merely to clear a checklist item. A source or product
change requires a new branch, tests, browser verification, reviewed PR,
deployment, production canary, and release-record update.

## Decisions of record — September 1, 2026

Taken after a full coupling audit of the codebase and an apex-model architecture
review. Recorded here so a later session does not relitigate them.

**Second municipality: add at most ONE, with no in-page town selector.** The
single-town assumption lives entirely in the build layer. `src/state.js`,
`src/app.js`, `src/webmcp.js`, and `src/handoff.js` contain zero Waterbury
literals, so a second reviewed pack can be published as first-class civic records
— record pages, feed entry, sitemap, `llms.txt`, civic record — discoverable by
URL and by agents, while the interactive page still defaults to Waterbury and no
human gate enters the blast radius. A visible town selector was rejected: it
requires making `CIVIC_DATA` dynamic and putting town identity into
`initialState()`, which risks the 29 runtime tests in `state.test.js` and
`webmcp.test.js` for a dropdown. Agent-native discovery is the better story here
than a human control. A third town would prove data entry, not replication.

**The `vermont-` / `waterbury-` id split is a rule now, not a coincidence.**
State-scoped records (`vermont-property-classification`,
`vermont-homestead-credit-help`) are shared across Vermont towns; town-scoped
records carry the town prefix. A second pack must therefore carry its
state-scoped entries **byte-identical** to Waterbury's — same capture, same
`checkedAt`, same excerpt, same hash — and the validator must assert that any id
appearing in two packs is deep-equal. That converts a URL-collision hazard into a
demonstrable property.

**No fifth WebMCP tool.** The two read tools take an empty input schema on
purpose: an assistant cannot pass a town, category, or recipient, so it cannot
steer the resident. That is a security property, not a thin surface, and it is
the answer to anyone who reads four tools as small. A `get_evidence_for_claim`
tool was considered and declined — the evidence is already agent-reachable,
since `pathsForAssistant` returns each claim's `recordUrl` and source URLs
(`src/state.js:299-315`) and the excerpts live at those public record pages and
in `llms-full.txt`. Revisit it after the competition, not before.

**The hand-written `allowedDestinations` map stays hand-written.** Its
duplication against the source pack IS the human gate: a reviewer types each
contact twice, from two independent official sources, into two files. Do not
generate it programmatically to remove the "redundancy."

**Outcome, September 2, 2026: the second town was attempted and abandoned on the
gate.** Woodstock was selected and captured; it failed. Its 2026 rates are
published only inside individual residents' tax bills, so using them would
invert the owner-record boundary the sanitizer exists to enforce; the bills omit
their units, so publishing a rate would require an inference; the town's own
2026 grievance application contradicts itself on the deadline; and the working
tax-billing contact is single-source. Three of four contact destinations DID
corroborate cleanly, and the run established that Woodstock has two live
municipal entities whose village boundary determines the applicable municipal
rate. Full record: `docs/REPLICATION_ATTEMPT_WOODSTOCK.md`. Ten further towns
were surveyed and none cleared the bar. **Do not re-run this attempt hoping for
a different answer** — the four blockers are named, and three of them can only
be closed by a person contacting the town.

**Abort criteria for any second-town work.** Close the branch unmerged and ship
Waterbury alone if any one of these holds: it is not merged, deployed, and
live-verified by September 2 at approximately 6:00 p.m. Pacific (no deadline-day
merges of civic facts); no candidate town clears two-source corroboration for
every contact destination; the runtime test files need edits, which would mean
the build-layer firewall was breached; or an adversarial reviewer finds a claim
that cannot be fixed by deleting it or moving it to `unknowns`. A town that fails
the gate produces no page. Refusing to publish is the product, and the submission
text says so honestly rather than manufacturing coverage.

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

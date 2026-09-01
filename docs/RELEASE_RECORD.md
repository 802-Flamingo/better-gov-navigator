# Release Record

## Production artifact

- Recorded: August 31, 2026
- Git commit: `713d2f42379597448696c393b16bcfbafbd137ba`
- Vercel deployment ID: `dpl_5wWMTvTUnhz54JkEfkKhNYYRUm4B`
- Branded URL: `https://navigator.govermont.co`
- Direct fallback: `https://better-gov-navigator.vercel.app`
- Deployment-specific rollback artifact:
  `https://better-gov-navigator-dfldls5mo-802-flamingo.vercel.app`
- Prior known-good rollback deployment: `dpl_8b2bruq3Q5W6mZbFD2k3tQyCeTpG`
- Expected incremental cost: `$0`
- Public repository: `https://github.com/802-Flamingo/better-gov-navigator`

The branded domain is attached directly to the isolated Vercel project. No
private GoVermont code, API, runtime, or reverse proxy participates in the
deployment.

The direct fallback is public and returned HTTP 200 during release verification.
Vercel protects the deployment-specific URL with project SSO; it is retained as
an operator rollback artifact and is not represented as a public fallback.

## Verified gates

- The production manifest contains eleven static files and no runtime API.
- Vercel reports the deployment `READY` with exact `gitCommitSha`
  `713d2f42379597448696c393b16bcfbafbd137ba` and no dirty-tree marker.
- The source pack contains ten official Waterbury or Vermont sources, three
  publishable facts, and four deterministic starting paths.
- All 37 built-in validation, state, security, and tool-contract tests pass.
- The production edge returns the restrictive CSP, HSTS, no-referrer,
  `nosniff`, frame denial, and restrictive Permissions Policy.
- `README.md`, Git internals, tests, scripts, and documentation are not served by
  the production deployment.
- Real ChatGPT in-app-browser calls passed discovery, consent, stale-revision,
  proposal, handoff, and revocation checks on both direct and branded URLs.
- The new branded release passed discovery, consent, exact-path, deterministic
  handoff, proposal, stale-revision, revocation, and zero-console-error checks.
- Mobile checks at 320px and 390px passed without horizontal overflow or a
  mid-word rate-table header break.
- The focused civic-workspace redesign passed browser review at 1440x900,
  390x844, and 320x844. The complete assessment path reached a deterministic
  draft with no browser warnings or errors.
- The official-records correction passed normal desktop, 200% reflow, and
  390x844 checks. Exact reviewed findings remain available through native
  disclosures without making long claims the default scanning surface.
- Production WebMCP re-verification showed zero tools before consent, four
  bounded tools after consent, a successful read of synthetic approved state,
  and zero tools immediately after revocation.
- A complete production regression exercised all four resident needs: billing,
  assessment, homestead or credit, and municipal budget. Each exposed exactly
  one fresh reviewed path, kept draft actions locked until the resident selected
  that path, and preserved the no-send boundary. Email handoffs contained only
  an allowlisted recipient and generic subject; resident text never entered a
  URL.
- The full production page passed geometry checks at 1440x900, 640x900 (the
  200% reflow equivalent), 390x844, and 320x844 with no page-level horizontal
  overflow or clipped visible text. Heading order, external-link protections,
  and production security headers also passed reinspection.
- Waterbury and Vermont primary sources and all four handoff destinations were
  rechecked on August 31, 2026. The known difference between Waterbury's
  prior-year comparison figure and the issued 2025 bill components remains
  intentionally undisclosed as a percentage claim; the application does not
  infer a reconciliation.
- Chrome 152 with `WebMCP testing` enabled registered exactly four production
  tools after consent, removed them after revocation, and emitted no browser
  warnings or errors. The Codex Chrome connector does not expose Chrome's
  `executeTool` testing surface, so this pass proves the real Chrome lifecycle
  but not a Chrome-side tool invocation.
- An anonymous public clone passed the source validator, secret and symlink
  scans, and all 37 tests on both public `main` and the exact production commit.

## Open release gates

- Execute `get_handoff_state` once through Chrome's WebMCP DevTools pane or a
  compatible Chrome agent. Chrome registration and revocation have passed; the
  remaining check is the Chrome-side invocation itself.
- Publish the public YouTube demonstration and complete the Devpost submission.

These open gates do not alter the recorded production artifact. Any source or
application change requires a new commit, deployment, and release record.

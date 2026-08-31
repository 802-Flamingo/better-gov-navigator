# Release Record

## Production artifact

- Recorded: August 31, 2026
- Git commit: `8c555a75c98daee796c57d1e5cad414fdc64c85d`
- Vercel deployment ID: `dpl_8b2bruq3Q5W6mZbFD2k3tQyCeTpG`
- Branded URL: `https://navigator.govermont.co`
- Direct fallback: `https://better-gov-navigator.vercel.app`
- Deployment-specific rollback artifact:
  `https://better-gov-navigator-nqevkxur8-802-flamingo.vercel.app`
- Prior known-good rollback deployment: `dpl_GdURgGzaUxkd8kFPhTLFEEdhbbWC`
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
  `8c555a75c98daee796c57d1e5cad414fdc64c85d` and no dirty-tree marker.
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
- Production WebMCP re-verification showed zero tools before consent, four
  bounded tools after consent, a successful read of synthetic approved state,
  and zero tools immediately after revocation.
- An anonymous public clone passed the source validator, secret and symlink
  scans, and all 37 tests on both public `main` and the exact production commit.

## Open release gates

- Enable the Chrome WebMCP testing flag with operator approval, then run the
  real Chrome discovery and execution canary.
- Publish the public YouTube demonstration and complete the Devpost submission.

These open gates do not alter the recorded production artifact. Any source or
application change requires a new commit, deployment, and release record.

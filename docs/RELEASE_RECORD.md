# Release Record

## Production artifact

- Recorded: August 31, 2026
- Git commit: `c443a0a87084a0278602bef02dbd69202de69801`
- Vercel deployment ID: `dpl_GdURgGzaUxkd8kFPhTLFEEdhbbWC`
- Branded URL: `https://navigator.govermont.co`
- Direct fallback: `https://better-gov-navigator.vercel.app`
- Deployment-specific rollback artifact:
  `https://better-gov-navigator-nh0h772s6-802-flamingo.vercel.app`
- Expected incremental cost: `$0`

The branded domain is attached directly to the isolated Vercel project. No
private GoVermont code, API, runtime, or reverse proxy participates in the
deployment.

The direct fallback is public and returned HTTP 200 during release verification.
Vercel protects the deployment-specific URL with project SSO; it is retained as
an operator rollback artifact and is not represented as a public fallback.

## Verified gates

- The production manifest contains eleven static files and no runtime API.
- Vercel reports the deployment `READY` with exact `gitCommitSha`
  `c443a0a87084a0278602bef02dbd69202de69801` and no dirty-tree marker.
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

## Open release gates

- Publish and verify the public GitHub repository from a clean checkout.
- Enable the Chrome WebMCP testing flag with operator approval, then run the
  real Chrome discovery and execution canary.
- Publish the public YouTube demonstration and complete the Devpost submission.

These open gates do not alter the recorded production artifact. Any source or
application change requires a new commit, deployment, and release record.

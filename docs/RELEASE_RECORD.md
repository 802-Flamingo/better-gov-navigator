# Release Record

## Production artifact

- Recorded: August 31, 2026
- Git commit: `5da7e6c886c24539f30e6a9250db93f25e93f06c`
- Vercel deployment ID: `dpl_7qDFQqBufy6NFw6QLoFXRSmJibky`
- Branded URL: `https://navigator.govermont.co`
- Direct fallback: `https://better-gov-navigator.vercel.app`
- Immutable deployment:
  `https://better-gov-navigator-knim4tkte-802-flamingo.vercel.app`
- Expected incremental cost: `$0`

The branded domain is attached directly to the isolated Vercel project. No
private GoVermont code, API, runtime, or reverse proxy participates in the
deployment.

## Verified gates

- The production manifest contains eleven static files and no runtime API.
- The source pack contains ten official Waterbury or Vermont sources, three
  publishable facts, and four deterministic starting paths.
- All 37 built-in validation, state, security, and tool-contract tests pass.
- The production edge returns the restrictive CSP, HSTS, no-referrer,
  `nosniff`, frame denial, and restrictive Permissions Policy.
- `README.md`, Git internals, tests, scripts, and documentation are not served by
  the production deployment.
- Real ChatGPT in-app-browser calls passed discovery, consent, stale-revision,
  proposal, handoff, and revocation checks on both direct and branded URLs.
- Mobile checks at 320px and 390px passed without horizontal overflow.

## Open release gates

- Publish and verify the public GitHub repository from a clean checkout.
- Enable the Chrome WebMCP testing flag with operator approval, then run the
  real Chrome discovery and execution canary.
- Publish the public YouTube demonstration and complete the Devpost submission.

These open gates do not alter the recorded production artifact. Any source or
application change requires a new commit, deployment, and release record.

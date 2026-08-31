# Release Checklist

## Feasibility

- [ ] GitHub CLI authenticated to the authorized 802 Flamingo account.
- [ ] Public repository exists and shows MIT license at repository top level.
- [x] Existing Vercel team capacity confirmed; no paid add-on required.
- [ ] `navigator.govermont.co` DNS and Vercel project authority confirmed.
- [x] Real WebMCP is available in the ChatGPT in-app browser.

## Core and data

- [x] Manual five-step flow works without assistant support.
- [x] Three required tools pass mocked and real in-app-browser tests locally.
- [x] Optional proposal tool passes local consent, stale-state, injection,
  cancellation, and revision tests.
- [x] Ten official sources independently reviewed on August 31, 2026.
- [x] Ambiguous municipal percentage, CLA, final levy, and calculator excluded.
- [x] Exact source and destination allowlists pass.
- [ ] Recheck every public fact and recipient immediately before release.

## Security and browser

- [x] `npm run check` passes with zero package dependencies.
- [x] Registration, revocation, duplicate, replay, cancellation, and partial
  failure tests pass.
- [x] Resident body is absent from the email URL.
- [x] 320px and 390px layouts have no horizontal overflow.
- [x] Native controls, semantic headings, described disclosures, source
  publishers, and live status announcements are present.
- [ ] Real deployed ChatGPT discovery, call, stale-state, and revocation canary.
- [ ] Real Chrome 149+ discovery and call canary with WebMCP testing enabled.
- [ ] Production CSP and all security headers verified from the network edge.
- [ ] Clean-checkout test and exact production SHA verification.

## Deployment

- [ ] Create direct Vercel production deployment and record URL.
- [ ] Preserve a known-good rollback deployment and verify it independently.
- [ ] Attach `navigator.govermont.co` without proxying through GoVermont code.
- [ ] Confirm both branded and direct URLs; keep direct URL in submission notes.
- [ ] Confirm expected incremental cost remains $0.

## Submission

- [ ] Record and publish the under-three-minute YouTube demo with audio.
- [ ] Complete title, tagline, description, technology, links, and images.
- [ ] Verify the public repository, license, live URL, and video in a logged-out
  browser.
- [ ] Submit by September 3 at 10:00 a.m. Pacific.
- [ ] Freeze site, repository, and Devpost entry through judging.

# Devpost Submission Draft

## Title

Go Vermont Civic Navigator

## Tagline

Source-backed civic answers that keep the resident in control.

## Short description

Go Vermont Civic Navigator helps a Waterbury resident understand what official
2026 property-tax records establish, what they cannot establish about an
individual bill, and the shortest accountable next step. The complete workflow
works manually. With explicit consent, WebMCP lets an assistant read the
resident-approved case, find immutable civic paths, stage clearer wording, and
prepare a deterministic draft without choosing facts, recipients, or actions.

## Why WebMCP fits

Civic information is a high-consequence setting for ordinary browser
automation. A visually plausible page can still be stale, ambiguous, or easy to
misread. WebMCP gives this site a narrow contract: the assistant can use only the
reviewed source pack and the path already chosen by the resident. It cannot
browse for a more convenient answer, alter an official destination, calculate a
tax, or contact anyone.

## Better human experience

The resident sees the same five-step experience with or without an assistant.
Assistant collaboration is additive and reversible: sharing is off by default,
proposed wording requires acceptance, drafts require explicit recipient and
wording review, and only human controls can copy or leave the page.

## What people and agents can do together

The resident supplies context and makes every consequential choice. The
assistant can structure that approved context, retrieve the bounded civic path,
surface unanswered questions, and stage a draft. The website remains the source
of truth for facts, sources, limitations, and recipients.

## Implementation

The project is a dependency-free static application using semantic HTML, CSS,
ES modules, reviewed JSON, and Node's built-in test runner. Four imperative
WebMCP tools use strict schemas and equivalent runtime validation. All mutations
run through a serialized queue with monotonic revision checks. The deployment
has no runtime API, analytics, persistence, third-party script, or network
permission; CSP sets `connect-src 'none'`.

## Links to fill at release

- Live branded URL: `https://navigator.govermont.co`
- Direct Vercel fallback: `https://better-gov-navigator.vercel.app`
- Immutable release URL:
  `https://better-gov-navigator-knim4tkte-802-flamingo.vercel.app`
- Public repository: `https://github.com/802-Flamingo/better-gov-navigator`
- Public YouTube demo: `TBD`
- Production commit: `5da7e6c886c24539f30e6a9250db93f25e93f06c`

## Technologies

WebMCP, JavaScript ES modules, HTML, CSS, JSON, Node.js test runner, Vercel.

## Prepared images

- Desktop product capture: `docs/assets/navigator-desktop.png`
- Mobile product capture: `docs/assets/navigator-mobile.png`

Both captures show the useful resident experience and independent-service
notice. Neither contains an account, credential, private repository, or real
resident case.

## Boundaries

Independent demonstration by 802 Flamingo LLC. Not a municipal or state
government website. No endorsement implied. It does not diagnose an individual
bill, calculate taxes, store case data, or send messages.

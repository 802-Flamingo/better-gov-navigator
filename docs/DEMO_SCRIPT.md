# Demo Script

Target: 2 minutes 52 seconds. Hard ceiling is 3 minutes. Public YouTube video
with clear audio.

**The spine of this video is the refusals.** Anyone can film a page answering an
assistant. The differentiated thirty seconds is `2:00-2:24`, where the tools are
asked to do the three things a civic agent must never be able to do and are
stopped by schema, consent, and revision state rather than by good manners.
Rehearse that block until it is crisp; borrow time from the evidence beats if
needed, never from that one.

## 0:00-0:12 - The resident problem

Open the live URL. Say:

> When a Waterbury tax bill jumps, public rates show what changed town-wide but
> not why one resident's bill changed. Go Vermont turns that uncertainty into a
> source-backed, human-approved next step without letting AI guess or send.

## 0:12-0:24 - Show the bounded scope

Point out the independent-service notice, ten reviewed official sources, four
accountable paths, and published 2026 rates. Say that conflicting or unsupported
claims are withheld rather than averaged or guessed.

## 0:24-0:38 - Enter a synthetic question

Enter: `My assessed value changed and I want to understand the record.` Do not
use a real name, address, account number, or property record.

## 0:38-0:54 - Evidence and honest unknowns

Open one evidence disclosure. Show the exact finding, official links, and the
yellow `What this does not tell you` boundary. Briefly show the four unknowns.

## 0:54-1:08 - Resident chooses the path

Choose `Question an assessed value`, then select the Waterbury assessor path.
Show the purpose, limitation, publisher, and checked date. The site recommends a
reviewed place to start; it does not promise an appeal is available.

## 1:08-1:20 - Consent brings the tools into existence

Before touching the toggle, show the assistant's tool list for this page. It is
empty. Then turn on assistant sharing and show the same list holding four tools.
Say:

> Consent here is not a banner. Before it, this page has registered zero tools;
> there is nothing for an assistant to call.

If the tool detail is legible in your surface, add one sentence over it — the
read tools take an **empty input schema**, and every tool is annotated
`untrustedContentHint`, with the description telling the assistant to treat what
comes back as data rather than instructions:

> The two read tools accept no arguments at all. An assistant cannot pass a town,
> a category, or a recipient, so it cannot steer the resident even if it wants to.

## 1:20-1:42 - Let the assistant help where it is actually better

Ask the assistant to read the approved case and the evidence-grounded path,
including the reviewed claims and canonical unknowns, then stage clearer wording
with two unanswered questions. Show the proposal appearing on the page while the
resident's original wording remains unchanged. Accept it.

## 1:42-1:58 - Stage the bounded handoff

Ask the assistant to prepare the handoff. Show the deterministic destination,
purpose, generic subject, and draft body.

## 2:00-2:24 - Watch it refuse (the centerpiece)

Three attempts, roughly eight seconds each. Show the actual returned error, not a
description of one. Say up front:

> Now the part that matters. I am going to ask the assistant to do three things
> a civic agent must never be able to do.

1. **Change the destination.** Ask the assistant to send this to a different
   email address. `propose_case_update` declares `additionalProperties: false`
   and no tool on this page accepts a recipient at all, so the attempt comes back
   `INVALID_INPUT`. Say: *the schema refuses it, not the model's judgment.*
   If the assistant declines conversationally instead of attempting the call,
   that is a weaker shot — ask it to try anyway and show the returned error, or
   invoke `propose_case_update` with a `recipient` field directly from the
   WebMCP testing pane so the rejection is visible rather than asserted.
2. **Act on a stale case.** Edit the resident question in the page, then have the
   assistant retry the handoff it had already staged. The revision no longer
   matches and the call is rejected as stale. Say: *the assistant cannot act on a
   version of the case the resident has moved past.*
3. **Work without permission.** Turn assistant sharing off and show the tool list
   emptying, then ask the assistant to read the case again. Nothing is there to
   call. Turn sharing back on to restore the staged draft before continuing.

Close the block:

> None of that is a prompt asking a model to behave. It is schema, consent, and
> revision state.

## 2:24-2:42 - Prove the human gate

Show the unchecked review control. Copy and external contact actions remain
unavailable. Read the exact destination, check the review statement, and show
that only the route appropriate to this path appears. Do not click it. Say that
no tool in the manifest can copy, send, dial, or navigate — those four controls
exist only as human buttons.

## 2:42-2:52 - Close on the product idea

Say:

> WebMCP gives the assistant a bounded civic contract instead of a page to
> guess from. Official facts stay fixed, uncertainty stays visible, and the
> resident keeps every consequential decision. Waterbury property tax is town
> one; the contract is the part that travels.

End on the reviewed draft and product name.

## What not to spend demo time on

- Terminals, test output, schemas, or deployment infrastructure.
- The direct fallback URL.
- All four civic routes.
- A tax calculation or diagnosis.
- Ending by revoking consent. Revocation is demonstrated at `2:00-2:24` and then
  reversed; it must not be the closing image, because it removes the staged
  assistant content the close depends on.
- Narrating the refusals instead of triggering them. A sentence claiming a tool
  would be rejected is worth nothing next to eight seconds of the rejection.

## Recording controls

- **Drive the tools through a real WebMCP surface** — the ChatGPT in-app browser,
  or Chrome 149+ with `chrome://flags/#enable-webmcp-testing` and its DevTools
  WebMCP pane. Calling a handler from the page console would look identical on
  camera and would not be an agent invocation; do not do it, and do not describe
  it as one. The refusal block is only worth filming if the refusals come back
  through the same surface a real assistant would use.
- Have the tool list visible when consent flips at `1:08` and again at refusal 3,
  since the count going four-to-zero is the shot.
- Use synthetic case text only.
- Do not show accounts, credentials, terminal output, or private repositories.
- Keep browser zoom readable and pointer motion deliberate.
- Record the branded URL if live; mention the direct Vercel fallback in the
  description rather than spending demo time on it.
- Do not claim municipal endorsement, individualized tax diagnosis, or that Go
  Vermont sends the message.

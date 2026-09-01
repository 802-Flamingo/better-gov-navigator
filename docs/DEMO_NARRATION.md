# Demo Narration

Target: under two minutes and forty-five seconds at a calm speaking pace.

When a Waterbury tax bill jumps, public rates show what changed town-wide but
not why one resident's bill changed. Go Vermont turns that uncertainty into a
source-backed, human-approved next step without letting AI guess or send.

The experience works without an assistant. It is independent civic information,
not a municipal or State of Vermont website, and it does not diagnose a bill or
calculate tax. This focused prototype uses ten reviewed official sources and
four accountable paths. When official records conflict or cannot support a
claim, the claim is withheld rather than averaged or guessed.

Here I enter a synthetic question about an assessed value. The text becomes the
resident-controlled starting point for a draft; it is not a magic diagnosis or
automatic routing decision. The page also warns against entering sensitive
details.

The Navigator shows Waterbury's published 2026 rates, the official sources
behind every statement, and the limits of those records. It names the facts that
remain unknown, including whether the assessed value or property classification
changed.

I choose "Question an assessed value." That choice maps to one reviewed starting
point: the Waterbury assessor. The page shows the purpose, official publisher,
checked date, and an important limitation. This path does not promise that a
formal appeal is still available.

Assistant sharing is off by default. Before consent, there are zero site tools.
When I turn it on, `get_handoff_state` reads only the case I approved and
`find_civic_paths` returns the immutable official path together with the
reviewed claims, source URLs, limitations, and canonical unknowns that must
bound the assistant's suggestion.
`propose_case_update` can stage clearer wording and unanswered questions after I
choose a fresh reviewed path, but it cannot replace accepted text or change
facts, sources, town, category, path, or destination. I can compare the
suggestion with my original words and accept or reject it. `prepare_handoff`
then stages the same deterministic draft for the path I already selected.

The result remains "Your draft to review." Go Vermont has not sent anything.
The exact destination, purpose, subject, and body stay separate, and I must
review both the destination and wording before a copy or contact control appears.

A revision check rejects stale tool calls. Turning sharing off removes every
tool immediately. Only I can accept wording, copy the body, or open my email
application, and the resident's message never appears in a URL.

WebMCP makes the boundary useful: the assistant can collaborate inside the
source-backed contract, while the resident keeps every consequential choice.

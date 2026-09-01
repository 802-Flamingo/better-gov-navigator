# Demo Narration

Target: under two minutes and forty-five seconds at a calm speaking pace.

When a Waterbury tax bill jumps, public rates show what changed town-wide, but
not why one resident's bill changed. Go Vermont turns that uncertainty into a
source-backed, human-approved next step without letting AI guess or send.

The experience works without an assistant. It is independent civic information,
not a municipal or State of Vermont website, and it does not diagnose a bill or
calculate tax. This focused prototype uses ten reviewed official sources and
four accountable paths. Unsupported claims are withheld rather than averaged
or guessed.

Here I enter a synthetic assessment question. The text stays in page memory and
becomes the resident-controlled starting point for a draft. The Navigator warns
me not to enter sensitive details.

Next I see Waterbury's published 2026 rates, the official records behind each
finding, and what those records cannot establish. The same claims, limitations,
unknowns, and sources form a permanent machine-readable civic record. People,
assistants, and search engines can cite it without seeing a resident's case.

I choose "Question an assessed value." That maps to one reviewed starting point:
the Waterbury assessor. The page shows its purpose, source, checked date, and a
key limitation: this path does not promise that a formal appeal is still open.

Assistant sharing is off by default, with zero site tools. After I consent,
`get_handoff_state` reads only the case I approved. `find_civic_paths` returns
the immutable path, reviewed claims, source URLs, limitations, canonical
unknowns, and permanent record links. The assistant can cite, not improvise.

`propose_case_update` may stage clearer wording and unanswered questions, but it
cannot change official facts, sources, category, path, or destination. I accept
or reject the suggestion. `prepare_handoff` then stages the same deterministic
draft for the path I selected.

The result remains "Your draft to review." Go Vermont has sent nothing. The
destination and wording stay separate, and contact controls remain locked until
I review both.

Revision checks reject stale calls. Turning sharing off removes every tool.
Only the resident can accept wording, copy the body, or leave the page, and the
message never enters a URL.

WebMCP makes the boundary useful: the assistant collaborates inside a
source-backed contract while the resident keeps every consequential choice.

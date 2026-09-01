# Municipal Replication Blueprint

Go Vermont Civic Navigator proves one bounded workflow in Waterbury. It does not
claim statewide coverage. This blueprint explains what is reusable and what must
be independently reviewed before another municipality can be added.

## Reusable product contract

The consent lifecycle, in-memory state, revision queue, deterministic handoff,
human review gate, restrictive deployment, and WebMCP control pattern are
municipality-independent. Visible town copy and the source-pack import still
require an explicit reviewed change. Another town should not require a new
runtime service, account system, AI API, package dependency, or analytics
product.

## Required town-specific work

1. Define one narrow resident problem and the plain-language needs it contains.
2. Capture primary municipal and state sources with exact publisher, URL,
   retrieval date, locator, short evidence excerpt, and excerpt hash.
3. Reconcile each proposed fact against a second official record where one
   exists. Publish the disagreement, limitation, or omission when records do not
   reconcile.
4. Record each starting point's purpose, limitation, exact destination, source,
   checked date, and 30-day contact expiry.
5. Add the source pack to deterministic validation and test every need, stale
   state, handoff, and allowlisted destination.
6. Run the full security and browser matrix, then have an independent reviewer
   compare every public sentence and destination with the captured evidence.

## Publication gate

A municipality is ready only when every visible fact maps to captured evidence,
every path is current, unsupported conclusions are absent, and a clean checkout
passes the same tests as Waterbury. A missing answer is publishable as an honest
unknown. A guessed answer is not.

## Scaling model

Expansion is source-pack work, not a looser AI prompt. The software contract
remains fixed while reviewed municipal packs are added one at a time. This keeps
the marginal infrastructure cost near zero and makes quality measurable by town:
source coverage, unresolved conflicts, destination freshness, and complete
evidence mapping.

This blueprint is an implementation path, not evidence that another town has
already passed the gate.

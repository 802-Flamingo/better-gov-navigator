# Waterbury Source Pack

## Scope

The frozen source pack was reviewed on August 31, 2026. It covers one town, one
primary tax year with a limited 2025 comparator, two Vermont property
classifications, three published rate rows, and four accountable starting
points. It is not a tax calculator and does not explain why any individual bill
changed.

Published units are dollars per $100 of assessed value. The classifications are
homestead and nonhomestead. A null `effectiveDate` means the source did not
publish an exact effective date that could be safely recorded.

Each source record includes publisher, canonical HTTPS URL, tax year when
applicable, retrieval date, locator, short captured excerpt, limitation-oriented
summary, and SHA-256 of the exact captured excerpt. `npm run validate` also
requires one of two official origins: `www.waterburyvt.com` or
`tax.vermont.gov`.

`npm run generate` derives a production-safe browser data module, the public
`CivicRecordV1`, assistant-readable text, Atom feed, sitemap, and crawler
instructions from this pack. Those projections retain claim limitations, source
references, and evidence hashes while omitting captured excerpts that contain
direct contact details. Validation rejects stale generated assets. A shared
sanitizer removes direct URLs for bulk issued-bill documents containing
property-owner information from every production projection; their source IDs,
summaries, locators, and captured-evidence hashes remain available for audit.

## Official sources

1. [Waterbury 2026 Tax Rates](https://www.waterburyvt.com/departments/taxes/rates)
2. [Issued 2026 Property Tax Bills](https://www.waterburyvt.com/fileadmin/files/Property_tax_files/2026_Property_Tax_Bills.pdf)
3. [Issued 2025 Property Tax Bills](https://www.waterburyvt.com/fileadmin/files/Property_tax_files/2025_Property_Tax_Bills_Redacted.pdf)
4. [Waterbury Property Taxes](https://www.waterburyvt.com/departments/taxes/page)
5. [Waterbury Property Reappraisal](https://www.waterburyvt.com/departments/taxes/property-reappraisal)
6. [Vermont property-tax bill guide](https://tax.vermont.gov/sites/tax/files/documents/GB-1205.pdf)
7. [Vermont Homestead Declaration](https://tax.vermont.gov/property/homestead-declaration)
8. [Vermont Filing Checklist](https://tax.vermont.gov/individuals/how-to-file/checklist)
9. [Waterbury Selectboard](https://www.waterburyvt.com/boards/selectboard)
10. [January 12, 2026 budget-review meeting](https://www.waterburyvt.com/meeting/selectboard-special-meeting-budget-review-01-12-26)

## Published facts

- Total municipal rate: `$0.5552` for both classifications.
- Education rate: `$2.2567` homestead and `$2.2482` nonhomestead.
- Combined rate: `$2.8119` homestead and `$2.8034` nonhomestead.
- Official records support only the qualitative statement that the municipal
  rate declined slightly while both education rates increased.

## Deliberately withheld

- Any diagnosis of an individual bill change.
- The page's exact `0.47%` municipal decrease because its stated prior baseline
  conflicts with the town's issued 2025 bills.
- A current common level of appraisal claim because current municipal pages and
  issued-bill fields do not reconcile.
- An exact final voter-approved budget or levy until the proposal, warning,
  amendments, and final meeting record are reconciled.
- The municipality's worked tax example, which uses older rates and contains a
  malformed result.
- Any tax calculation, eligibility judgment, appeal deadline promise, filing
  status, credit amount, payment status, or definitive cause.

## Refresh procedure

1. Re-open every canonical source and independently verify every published
   number, recipient, date, and limitation.
2. Replace each short captured excerpt and recompute its SHA-256.
3. Update the reviewed JSON source pack, then run `npm run generate` to rebuild
   its sanitized browser projection and the open-web assets.
4. Update contact `checkedAt` and `staleAfter`; never extend freshness without a
   real recheck.
5. Run `npm run check` and repeat the real browser canary.
6. Treat any conflict as a publication blocker, not a prompt for inference.

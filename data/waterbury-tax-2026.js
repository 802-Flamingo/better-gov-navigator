export const SOURCE_PACK = {
  schemaVersion: 1,
  town: {
    id: "vt:municipality:waterbury",
    name: "Waterbury",
    state: "Vermont",
  },
  topic: "property_tax",
  checkedAt: "2026-08-31",
  rates: {
    year: 2026,
    unit: "dollars per $100 of assessed value",
    historicalAfter: "2027-06-30",
    rows: [
      {
        label: "Total municipal",
        homestead: "0.5552",
        nonhomestead: "0.5552",
      },
      {
        label: "Education",
        homestead: "2.2567",
        nonhomestead: "2.2482",
      },
      {
        label: "Combined total",
        homestead: "2.8119",
        nonhomestead: "2.8034",
      },
    ],
  },
  facts: [
    {
      id: "waterbury-2026-rates",
      statement:
        "For 2026, Waterbury publishes a total municipal rate of $0.5552 per $100 of assessed value. Its education rates are $2.2567 for homestead property and $2.2482 for nonhomestead property, producing combined rates of $2.8119 and $2.8034.",
      limitation:
        "These town-wide rates do not establish why any individual bill changed or which classification applies to a particular property.",
      checkedAt: "2026-08-31",
      sourceIds: [
        "waterbury-tax-rates-2026",
        "waterbury-tax-bills-2026",
        "waterbury-property-taxes",
      ],
    },
    {
      id: "waterbury-2026-change-pattern",
      statement:
        "Waterbury's 2026 rate page describes its municipal rate as slightly lower while both education rates increased.",
      limitation:
        "The exact municipal percentage change is withheld because the page's prior baseline does not reconcile with the issued 2025 bills. The pattern still cannot explain a particular bill.",
      checkedAt: "2026-08-31",
      sourceIds: [
        "waterbury-tax-rates-2026",
        "waterbury-tax-bills-2025",
        "waterbury-tax-bills-2026",
      ],
    },
    {
      id: "vermont-property-classification",
      statement:
        "Vermont uses homestead and nonhomestead education-property classifications. Waterbury states that gross annual taxes begin with assessed value divided by 100 and multiplied by the applicable total rate.",
      limitation:
        "This does not determine a property's classification, exemptions, state adjustments, credits, assessed value, or net bill.",
      checkedAt: "2026-08-31",
      sourceIds: ["vermont-tax-bill-guide-2026", "waterbury-property-taxes"],
    },
  ],
  unknowns: [
    "Whether the property's assessed value changed.",
    "Whether the property was classified as homestead or nonhomestead for 2026.",
    "Whether a credit, exemption, state adjustment, penalty, or local agreement changed the net bill.",
    "Which specific line or amount on the resident's bill prompted the question.",
  ],
  needs: [
    {
      id: "bill-payment",
      label: "Pay or ask about a bill",
      pathIds: ["waterbury-property-tax-billing"],
    },
    {
      id: "assessment",
      label: "Question an assessed value",
      pathIds: ["waterbury-assessment-questions"],
    },
    {
      id: "homestead-credit",
      label: "Ask about homestead status or a property-tax credit",
      pathIds: ["vermont-homestead-credit-help"],
    },
    {
      id: "municipal-budget",
      label: "Understand the municipal budget",
      pathIds: ["waterbury-budget-records"],
    },
  ],
  paths: [
    {
      id: "waterbury-property-tax-billing",
      label: "Start with Waterbury property-tax billing",
      office: "Waterbury Property Tax Billing",
      purpose: "Questions about a bill, payment, due date, balance, or obtaining a copy",
      requestPrompt:
        "Please help me identify the relevant bill record or explain which office should review this billing question.",
      salutation: "Hello Waterbury Property Tax Billing team,",
      contactMode: "email",
      email: "knealy@waterburyvt.com",
      phone: "802-244-5858",
      checkedAt: "2026-08-31",
      staleAfter: "2026-09-30",
      sourceId: "waterbury-property-taxes",
      limitation:
        "This office is a starting point for billing and payment questions, not a determination of assessment correctness or state-credit eligibility.",
    },
    {
      id: "waterbury-assessment-questions",
      label: "Start with the Waterbury assessor",
      office: "Waterbury Town Assessor",
      purpose: "Questions about an assessed value or reappraisal information",
      requestPrompt:
        "Please help me understand the assessed value used for this property and the available record-review process.",
      salutation: "Hello Waterbury Assessor,",
      contactMode: "email",
      email: "dsweet@waterburyvt.com",
      phone: "802-244-1013",
      checkedAt: "2026-08-31",
      staleAfter: "2026-09-30",
      sourceId: "waterbury-property-reappraisal",
      limitation:
        "This is an assessment-question path, not a promise that a formal 2026 grievance or appeal remains available.",
    },
    {
      id: "vermont-homestead-credit-help",
      label: "Start with the Vermont Department of Taxes",
      office: "Vermont Department of Taxes",
      purpose: "Homestead declaration, property classification, or property-tax-credit questions",
      requestPrompt:
        "Please help me identify the correct homestead-declaration or property-tax-credit record and the next step for a 2026 question.",
      salutation: "Hello Vermont Department of Taxes,",
      contactMode: "phone_or_appointment",
      phone: "802-828-2865",
      appointmentUrl: "https://tax.vermont.gov/schedule-appointment",
      checkedAt: "2026-08-31",
      staleAfter: "2026-09-30",
      sourceId: "vermont-homestead-declaration-2026",
      limitation:
        "Navigator cannot determine eligibility, credit amount, filing status, or whether a declaration was accepted.",
    },
    {
      id: "waterbury-budget-records",
      label: "Start with Waterbury budget and Selectboard records",
      office: "Waterbury Selectboard public process",
      purpose: "Understand the municipal budget, meeting record, and voter-approved tax context",
      requestPrompt:
        "Please point me to the adopted municipal budget record and the appropriate public process for a budget question.",
      salutation: "Waterbury Selectboard public comment:",
      contactMode: "records_and_meeting",
      checkedAt: "2026-08-31",
      staleAfter: "2026-09-30",
      sourceId: "waterbury-selectboard-2026",
      limitation:
        "This path does not claim that every amount in a draft budget packet was adopted unchanged.",
    },
  ],
  sources: [
    {
      id: "waterbury-tax-rates-2026",
      title: "2026 Tax Rates",
      publisher: "Town of Waterbury",
      url: "https://www.waterburyvt.com/departments/taxes/rates",
      checkedAt: "2026-08-31",
      retrievedAt: "2026-08-31",
      taxYear: 2026,
      effectiveDate: null,
      locator: "2026 Taxes table and fiscal-impact summary",
      evidenceExcerpt: "TOTAL MUNICIPAL PROPERTY TAX RATE | $0.5552 | $0.5552",
      evidenceSummary:
        "Lists the 2026 municipal, education, homestead, nonhomestead, and combined rates and describes the direction of rate changes.",
      capturedEvidenceSha256: "5baaebe2c2e8d76f13d8fd95693a4bd1d15051cd832c2ecc14d5ba3fa339c532",
    },
    {
      id: "waterbury-tax-bills-2026",
      title: "Issued 2026 Property Tax Bills",
      publisher: "Town of Waterbury",
      url: "https://www.waterburyvt.com/fileadmin/files/Property_tax_files/2026_Property_Tax_Bills.pdf",
      checkedAt: "2026-08-31",
      retrievedAt: "2026-08-31",
      taxYear: 2026,
      effectiveDate: null,
      locator: "Redacted issued-bill rate fields",
      evidenceExcerpt:
        "Town 0.5504; Loc agreements 0.0048; HS Ed 2.2567; NHS Ed 2.2482.",
      evidenceSummary:
        "Corroborates the town, local-agreement, homestead-education, and nonhomestead-education rate components printed on issued bills.",
      capturedEvidenceSha256: "e9a91bed7eb2f26eab50796789785103acdccbcb90cb6f13a48c924d5a355e89",
    },
    {
      id: "waterbury-tax-bills-2025",
      title: "Issued 2025 Property Tax Bills",
      publisher: "Town of Waterbury",
      url: "https://www.waterburyvt.com/fileadmin/files/Property_tax_files/2025_Property_Tax_Bills_Redacted.pdf",
      checkedAt: "2026-08-31",
      retrievedAt: "2026-08-31",
      taxYear: 2025,
      effectiveDate: null,
      locator: "Redacted issued-bill rate fields",
      evidenceExcerpt: "Town 0.5550; HS Ed 2.1744; NHS Ed 2.1764.",
      evidenceSummary:
        "Provides the prior issued-bill rates used only to check the direction of change and identify the unresolved municipal-baseline discrepancy.",
      capturedEvidenceSha256: "127ca6a488a953ff500959aea2a3d41fe9cbc51e630386a72de47c8249cdd13c",
    },
    {
      id: "waterbury-property-taxes",
      title: "Property Taxes",
      publisher: "Town of Waterbury",
      url: "https://www.waterburyvt.com/departments/taxes/page",
      checkedAt: "2026-08-31",
      retrievedAt: "2026-08-31",
      taxYear: 2026,
      effectiveDate: null,
      locator: "Calculation guidance, FAQs, and contact section",
      evidenceExcerpt: "(Assessed Value/100) x Total Tax Rate = Annual Taxes",
      evidenceSummary:
        "Defines the per-100 assessed-value unit, lists billing contact details, and directs state homestead and credit questions to Vermont.",
      capturedEvidenceSha256: "e13c589dc8e785392f70a5174a5767d243325326714418655628c3d81d94d0c2",
    },
    {
      id: "waterbury-property-reappraisal",
      title: "Property Reappraisal",
      publisher: "Town of Waterbury",
      url: "https://www.waterburyvt.com/departments/taxes/property-reappraisal",
      checkedAt: "2026-08-31",
      retrievedAt: "2026-08-31",
      taxYear: 2026,
      effectiveDate: null,
      locator: "Assessment explanation and Town Assessor contact",
      evidenceExcerpt:
        "To schedule a site visit: (802) 244-1013 or dsweet@waterburyvt.com.",
      evidenceSummary:
        "Explains the assessment role, gives the assessor contact, and places the current reappraisal on a 2027 target schedule.",
      capturedEvidenceSha256: "b24f9278f34d23c239314cf2c67692a3bb36b3daf82615ec99775e0b9d0684b9",
    },
    {
      id: "vermont-tax-bill-guide-2026",
      title: "Your Vermont Property Tax Bill",
      publisher: "Vermont Department of Taxes",
      url: "https://tax.vermont.gov/sites/tax/files/documents/GB-1205.pdf",
      checkedAt: "2026-08-31",
      retrievedAt: "2026-08-31",
      taxYear: null,
      effectiveDate: null,
      locator: "Homestead and nonhomestead classification guidance",
      evidenceExcerpt:
        "There are two education tax rates: homestead and nonhomestead.",
      evidenceSummary:
        "Explains Vermont's two education-property classifications and the categories shown on a property-tax bill.",
      capturedEvidenceSha256: "ed52eeb1553ba8a226477938332b02ee89dbfe0d38f4767d4ebcfe39bc59c172",
    },
    {
      id: "vermont-homestead-declaration-2026",
      title: "Homestead Declaration",
      publisher: "Vermont Department of Taxes",
      url: "https://tax.vermont.gov/property/homestead-declaration",
      checkedAt: "2026-08-31",
      retrievedAt: "2026-08-31",
      taxYear: 2026,
      effectiveDate: null,
      locator: "2026 classification, filing, and due-date guidance",
      evidenceExcerpt:
        "All property is considered nonhomestead, unless it is declared as a homestead.",
      evidenceSummary:
        "Explains annual homestead declaration responsibilities, 2026 dates, classification, and property-tax-credit filing context.",
      capturedEvidenceSha256: "df467b244d4c5bbbb6fd151fd32689c70d10b6e6d902aaeaea83c5eeb428d12d",
    },
    {
      id: "vermont-filing-checklist",
      title: "Vermont Filing Checklist",
      publisher: "Vermont Department of Taxes",
      url: "https://tax.vermont.gov/individuals/how-to-file/checklist",
      checkedAt: "2026-08-31",
      retrievedAt: "2026-08-31",
      taxYear: 2026,
      effectiveDate: null,
      locator: "Homestead Declaration and Property Tax Credit sections",
      evidenceExcerpt: "Complete VT Form HS-122 (Section A)",
      evidenceSummary:
        "Corroborates the state forms and April-to-October filing lifecycle for declaration and credit questions.",
      capturedEvidenceSha256: "a42b58c688706e7f7d6601d7fb1da71c0e596cdf48bd5bc4dd046f02de707466",
    },
    {
      id: "waterbury-selectboard-2026",
      title: "Town of Waterbury Selectboard",
      publisher: "Town of Waterbury",
      url: "https://www.waterburyvt.com/boards/selectboard",
      checkedAt: "2026-08-31",
      retrievedAt: "2026-08-31",
      taxYear: 2026,
      effectiveDate: null,
      locator: "Meeting schedule, agendas, minutes, and attendee process",
      evidenceExcerpt:
        "Would you like to receive an email when new agendas or minutes are posted?",
      evidenceSummary:
        "Provides the current public meeting, agenda, minutes, and participation paths for municipal budget questions.",
      capturedEvidenceSha256: "a287772ddaaac0b536cfd58c5f49ec32c6b1d0a7731b738bdc5808321c9d741c",
    },
    {
      id: "waterbury-budget-review-2026",
      title: "Selectboard Special Meeting - Budget Review 01/12/26",
      publisher: "Town of Waterbury",
      url: "https://www.waterburyvt.com/meeting/selectboard-special-meeting-budget-review-01-12-26",
      checkedAt: "2026-08-31",
      retrievedAt: "2026-08-31",
      taxYear: 2026,
      effectiveDate: "2026-01-12",
      locator: "Official agenda and approved minutes",
      evidenceExcerpt:
        "Selectboard minutes - 01/12/26. Approved on: Tuesday, January 20, 2026.",
      evidenceSummary:
        "Confirms an official 2026 municipal budget-review meeting and links its agenda and approved minutes without asserting a final levy.",
      capturedEvidenceSha256: "255c544b140b7a839802d4f82475f3b2ed6a166fe1534ba90419f2d171c94df6",
    },
  ],
};

import { PlaybookRule } from "../types";

export const defaultPlaybookRules: PlaybookRule[] = [
  {
    id: "pb-1",
    clauseType: "Governing Law",
    preferredPosition: "England and Wales",
    acceptableFallback: "Mutually acceptable neutral jurisdiction approved by Legal",
    escalationTrigger: "Any non-UK law, US state law, or unfamiliar jurisdiction",
    suggestedFallbackWording:
      "This agreement is governed by the laws of England and Wales, and the courts of England and Wales shall have exclusive jurisdiction.",
    rationale:
      "Keeps enforcement predictable and reduces negotiation and legal uncertainty for the UK-based entity.",
  },
  {
    id: "pb-2",
    clauseType: "Confidentiality Term",
    preferredPosition: "2 years post-agreement termination",
    acceptableFallback: "Up to 5 years with Legal approval",
    escalationTrigger: "Perpetual confidentiality, no survival clause, or term under 1 year",
    suggestedFallbackWording:
      "Obligations of confidentiality shall survive termination of this agreement for a period of two (2) years.",
    rationale:
      "Ensures commercially sensitive information remains protected for a reasonable period without creating perpetual obligations.",
  },
  {
    id: "pb-3",
    clauseType: "Liability Cap",
    preferredPosition: "Capped at 12 months of fees paid or £10,000 whichever is greater",
    acceptableFallback: "Alternative cap formula approved by Legal",
    escalationTrigger: "Uncapped liability, unlimited liability, or liability exceeding 2x annual fees",
    suggestedFallbackWording:
      "Each party's aggregate liability under this agreement shall not exceed the greater of (i) twelve (12) months of fees paid or (ii) £10,000.",
    rationale:
      "Protects the company from disproportionate financial exposure on routine commercial engagements.",
  },
  {
    id: "pb-4",
    clauseType: "Indemnity",
    preferredPosition: "Mutual indemnity limited to IP infringement and wilful misconduct",
    acceptableFallback: "Narrow unilateral indemnity for IP infringement only with Legal sign-off",
    escalationTrigger:
      "Broad indemnity, one-way indemnity in counterparty favour, indemnity for third-party claims, 'hold harmless' language",
    suggestedFallbackWording:
      "Each party shall indemnify the other solely against third-party claims arising from infringement of intellectual property rights caused by that party's materials.",
    rationale:
      "Broad indemnities create open-ended financial risk and should be limited to defined, foreseeable scenarios.",
  },
  {
    id: "pb-5",
    clauseType: "Assignment",
    preferredPosition: "No assignment without prior written consent of both parties",
    acceptableFallback: "Assignment permitted to affiliates only without consent",
    escalationTrigger: "Unrestricted assignment rights, assignment without notice, or change-of-control triggers",
    suggestedFallbackWording:
      "Neither party may assign this agreement without the prior written consent of the other, except to an affiliate or in connection with a merger or acquisition subject to prompt written notice.",
    rationale:
      "Controls who the company is obligated to and prevents obligations being transferred to unknown third parties.",
  },
  {
    id: "pb-6",
    clauseType: "Data Protection",
    preferredPosition: "GDPR-compliant DPA in place; data processing limited to stated purpose",
    acceptableFallback: "Standard SCCs or recognised equivalents with Legal review",
    escalationTrigger:
      "Broad data processing rights, transfers to non-adequate jurisdictions without safeguards, or absence of DPA where personal data is involved",
    suggestedFallbackWording:
      "Each party shall comply with applicable data protection laws. Where personal data is processed, the parties shall enter into a Data Processing Agreement prior to processing commencing.",
    rationale:
      "GDPR compliance is a legal requirement; unconstrained data rights create regulatory and reputational risk.",
  },
  {
    id: "pb-7",
    clauseType: "Publicity Rights",
    preferredPosition: "No publicity, press releases, or use of name/logo without prior written approval",
    acceptableFallback: "Case-study rights with prior approval and right to review draft",
    escalationTrigger:
      "Unilateral right to issue press releases, use of logo/name, or broad marketing rights without consent",
    suggestedFallbackWording:
      "Neither party shall make any public announcement or use the other's name or logo in any marketing material without prior written consent.",
    rationale:
      "Protects brand and commercial sensitivity; avoids unauthorised disclosure of the commercial relationship.",
  },
  {
    id: "pb-8",
    clauseType: "Auto-Renewal",
    preferredPosition: "No auto-renewal; explicit renewal by mutual written agreement",
    acceptableFallback: "Auto-renewal with minimum 60 days written notice to cancel",
    escalationTrigger:
      "Auto-renewal with notice period under 30 days, or automatic price escalation on renewal",
    suggestedFallbackWording:
      "This agreement shall expire at the end of the initial term unless renewed by written agreement of both parties.",
    rationale:
      "Auto-renewals without adequate notice periods create unbudgeted commitments and administrative burden.",
  },
  {
    id: "pb-9",
    clauseType: "Payment Terms",
    preferredPosition: "Net 30 days from invoice",
    acceptableFallback: "Net 45 days with Finance approval",
    escalationTrigger: "Payment terms over 60 days, non-standard currency, or unusual milestone triggers",
    suggestedFallbackWording:
      "Payment shall be due within thirty (30) days of invoice date. Late payments shall accrue interest at 4% above the Bank of England base rate.",
    rationale:
      "Extended payment terms affect cash flow; terms beyond 60 days require Finance and Legal sign-off.",
  },
  {
    id: "pb-10",
    clauseType: "Security Obligations",
    preferredPosition: "Industry-standard security measures; no audit rights without reasonable notice",
    acceptableFallback: "Annual security questionnaire in lieu of on-site audit",
    escalationTrigger:
      "Unilateral audit rights, real-time system access rights, or disproportionate security SLAs",
    suggestedFallbackWording:
      "Each party shall implement and maintain commercially reasonable technical and organisational security measures. Any security audit shall require at least 30 days' written notice and be conducted at the requesting party's expense.",
    rationale:
      "Unrestricted audit rights create operational disruption and potential exposure of proprietary systems.",
  },
];

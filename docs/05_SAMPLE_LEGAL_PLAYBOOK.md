# Sample Legal Playbook

> **Disclaimer:** This playbook is **synthetic demonstration content** created for prototyping purposes only. Every position, threshold, and wording example is illustrative. This document does not constitute legal advice and must not be used in any real legal review. A production deployment requires full review and approval by qualified in-house or external legal counsel before any rules go live.

---

## Overview

The playbook is the policy layer of Legal Queue Copilot. It defines what the AI checks, what it flags, and what it suggests. Lawyers own the playbook. The AI applies it.

Each rule covers one clause type and specifies:
- **Preferred position** — the company's standard ask
- **Acceptable fallback** — the minimum acceptable position
- **Escalation trigger** — conditions that require a full legal review
- **Suggested fallback wording** — ready-to-use redline text
- **Rationale** — why this position exists

---

## Rule 1 — Governing Law

**Preferred position:** England and Wales

**Acceptable fallback:** Mutually acceptable neutral jurisdiction approved by Legal

**Escalation trigger:** Any non-UK law, US state law, or unfamiliar jurisdiction

**Suggested fallback wording:**
> This agreement is governed by the laws of England and Wales, and the courts of England and Wales shall have exclusive jurisdiction.

**Rationale:** Keeps enforcement predictable and reduces negotiation and legal uncertainty for the UK-based entity.

---

## Rule 2 — Confidentiality Term

**Preferred position:** 2 years post-agreement termination

**Acceptable fallback:** Up to 5 years with Legal approval

**Escalation trigger:** Perpetual confidentiality, no survival clause, or term under 1 year

**Suggested fallback wording:**
> Obligations of confidentiality shall survive termination of this agreement for a period of two (2) years.

**Rationale:** Ensures commercially sensitive information remains protected for a reasonable period without creating perpetual obligations.

---

## Rule 3 — Liability Cap

**Preferred position:** Capped at 12 months of fees paid or £10,000 whichever is greater

**Acceptable fallback:** Alternative cap formula approved by Legal

**Escalation trigger:** Uncapped liability, unlimited liability, or liability exceeding 2× annual fees

**Suggested fallback wording:**
> Each party's aggregate liability under this agreement shall not exceed the greater of (i) twelve (12) months of fees paid or (ii) £10,000.

**Rationale:** Protects the company from disproportionate financial exposure on routine commercial engagements.

---

## Rule 4 — Indemnity

**Preferred position:** Mutual indemnity limited to IP infringement and wilful misconduct

**Acceptable fallback:** Narrow unilateral indemnity for IP infringement only with Legal sign-off

**Escalation trigger:** Broad indemnity, one-way indemnity in counterparty favour, indemnity for third-party claims, or "hold harmless" language

**Suggested fallback wording:**
> Each party shall indemnify the other solely against third-party claims arising from infringement of intellectual property rights caused by that party's materials.

**Rationale:** Broad indemnities create open-ended financial risk and should be limited to defined, foreseeable scenarios.

---

## Rule 5 — Assignment

**Preferred position:** No assignment without prior written consent of both parties

**Acceptable fallback:** Assignment permitted to affiliates only without consent

**Escalation trigger:** Unrestricted assignment rights, assignment without notice, or change-of-control triggers

**Suggested fallback wording:**
> Neither party may assign this agreement without the prior written consent of the other, except to an affiliate or in connection with a merger or acquisition subject to prompt written notice.

**Rationale:** Controls who the company is obligated to and prevents obligations being transferred to unknown third parties.

---

## Rule 6 — Data Protection

**Preferred position:** GDPR-compliant DPA in place; data processing limited to stated purpose

**Acceptable fallback:** Standard SCCs or recognised equivalents with Legal review

**Escalation trigger:** Broad data processing rights, transfers to non-adequate jurisdictions without safeguards, or absence of DPA where personal data is involved

**Suggested fallback wording:**
> Each party shall comply with applicable data protection laws. Where personal data is processed, the parties shall enter into a Data Processing Agreement prior to processing commencing.

**Rationale:** GDPR compliance is a legal requirement; unconstrained data rights create regulatory and reputational risk.

---

## Rule 7 — Publicity Rights

**Preferred position:** No publicity, press releases, or use of name/logo without prior written approval

**Acceptable fallback:** Case-study rights with prior approval and right to review draft

**Escalation trigger:** Unilateral right to issue press releases, use of logo/name, or broad marketing rights without consent

**Suggested fallback wording:**
> Neither party shall make any public announcement or use the other's name or logo in any marketing material without prior written consent.

**Rationale:** Protects brand and commercial sensitivity; avoids unauthorised disclosure of the commercial relationship.

---

## Rule 8 — Auto-Renewal

**Preferred position:** No auto-renewal; explicit renewal by mutual written agreement

**Acceptable fallback:** Auto-renewal with minimum 60 days written notice to cancel

**Escalation trigger:** Auto-renewal with notice period under 30 days, or automatic price escalation on renewal

**Suggested fallback wording:**
> This agreement shall expire at the end of the initial term unless renewed by written agreement of both parties.

**Rationale:** Auto-renewals without adequate notice periods create unbudgeted commitments and administrative burden.

---

## Rule 9 — Payment Terms

**Preferred position:** Net 30 days from invoice

**Acceptable fallback:** Net 45 days with Finance approval

**Escalation trigger:** Payment terms over 60 days, non-standard currency, or unusual milestone triggers

**Suggested fallback wording:**
> Payment shall be due within thirty (30) days of invoice date. Late payments shall accrue interest at 4% above the Bank of England base rate.

**Rationale:** Extended payment terms affect cash flow; terms beyond 60 days require Finance and Legal sign-off.

---

## Rule 10 — Security Obligations

**Preferred position:** Industry-standard security measures; no audit rights without reasonable notice

**Acceptable fallback:** Annual security questionnaire in lieu of on-site audit

**Escalation trigger:** Unilateral audit rights, real-time system access rights, or disproportionate security SLAs

**Suggested fallback wording:**
> Each party shall implement and maintain commercially reasonable technical and organisational security measures. Any security audit shall require at least 30 days' written notice and be conducted at the requesting party's expense.

**Rationale:** Unrestricted audit rights create operational disruption and potential exposure of proprietary systems.

---

## Playbook governance (production)

- Legal owns and approves all playbook rules before they go live
- Changes should go through a legal sign-off workflow with versioning
- Playbook should be evaluated quarterly against real decision outcomes
- Escalation thresholds should be calibrated based on false negative rate from historical eval

---

_All content above is synthetic demonstration material. Not legal advice. Not reviewed by counsel._

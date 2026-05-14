# Handover Runbook

## Purpose

This document explains how a legal reviewer would use ClauseCompass, how to interpret outputs, and what the legal team needs to do before this tool can go into production use.

---

## How a legal reviewer uses the tool

### Step 1 — Submit a contract for review

Navigate to **New Review**. Either:
- Paste the full contract text into the text area, or
- Upload a `.txt` or `.md` file

Fill in the contract metadata: title, counterparty name, contract type, urgency, and a brief commercial context note.

Click **Run first-pass review**.

### Step 2 — Read the Review Results

The tool produces:
- **Risk level** (Green / Amber / Red) — the recommended review tier
- **Executive summary** — a plain English description of what was found
- **Clause-level findings** — each flagged clause with detected position, playbook rule, and recommendation
- **Suggested redlines** — side-by-side current vs. proposed wording

### Step 3 — Make decisions

For each finding:
- **Accept** — agree with the AI finding and recommended redline
- **Edit** — accept the finding but modify the suggested wording before use
- **Reject** — dismiss the finding (it is not material or already handled)
- **Escalate** — flag for a more senior legal reviewer

**Human approval is required before any redline is sent externally.**

### Step 4 — Route the contract

| Risk level | Recommended action |
|---|---|
| Green | Batch for a quick spot-check; can typically be approved with minimal time |
| Amber | Quick lawyer review of the flagged clauses; does not require full read |
| Red | Full legal review required; do not proceed without legal sign-off |

---

## How to update playbook rules

Navigate to **Playbook**.

- Click a rule to expand it and read the current position
- Click the edit icon to modify any field
- Add a new rule with the **Add rule** button
- Delete rules that no longer apply

**Production requirement:** All playbook changes must go through a legal sign-off workflow before going live. The Playbook page includes a notice to this effect.

---

## How to review escalations

Escalated findings appear in the Handover → Activity trail with type "Finding escalated". A senior reviewer should:
1. Open the contract via the Review Results page
2. Read the specific finding and clause evidence
3. Make a final decision and record it
4. Update the contract status to Reviewed or Escalated as appropriate

---

## How to interpret eval metrics

| Metric | What it means | Acceptable range |
|---|---|---|
| Eval pass rate | % of test cases where AI output matched expected result | > 85% |
| Routing accuracy | % of contracts routed to the correct risk tier | > 90% |
| Issue detection | % of expected issues found | > 80% |
| False positives | Unexpected flags raised | Lower is better; some is acceptable |
| False negatives | Expected issues missed | Must be near zero; this is the critical metric |
| Partial passes | Issues detected but miscalibrated | Require playbook tuning |

**Always prioritise reducing false negatives over reducing false positives.**

---

## Handover readiness score

The Handover page displays a readiness score (currently 72%).

| Item | Status | What's needed |
|---|---|---|
| Prototype workflow | Complete | All 6 pages, working engine |
| Playbook seed | Complete | 10 standard rules |
| Eval suite | Initial | 8 synthetic cases, 87.5% pass rate |
| Real LLM integration | Not yet | Edge Function stub ready |
| Historical contract validation | Not yet | Requires 30–50 contracts |
| Legal sign-off on playbook | Not yet | Not yet reviewed |
| Deployment | Ready | Netlify-ready, build passes |

---

## Week-two plan

1. **Shadow 3–5 real legal reviews** — sit with reviewers, map current workflow and edge cases
2. **Replace synthetic playbook** — update rules to positions reviewed and approved by qualified counsel
3. **Add DOCX/PDF parsing** — file parsing via Edge Function; this is the most common intake format
4. **Export Word redlines** — tracked-changes `.docx` is the expected output format in most legal teams
5. **Evaluate against historical data** — run against 30–50 historical contracts; track false negative rate
6. **Measure time saved** — simple timer study with the legal team; quantify baseline vs. AI-assisted time
7. **Legal intake integration** — connect email triage, Slack workflow, or legal ticketing system

---

## Adoption checklist

- [ ] Legal team has reviewed and approved the playbook
- [ ] Eval run against 30+ historical contracts; false negative rate < 5%
- [ ] Time-saved baseline measured and validated
- [ ] DOCX/PDF parsing implemented
- [ ] Word redline export implemented
- [ ] Real LLM integration tested and validated
- [ ] Adoption guide created for legal reviewers
- [ ] Feedback mechanism in place to flag AI errors
- [ ] Legal sign-off workflow for playbook changes implemented
- [ ] Data protection review completed for contract content handling

---

_Not legal advice. Human approval required for all decisions._

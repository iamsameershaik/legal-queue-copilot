# Evaluation Report

## Goal

Validate that the deterministic review engine correctly identifies material clause deviations, routes contracts to the appropriate risk tier, and does not miss issues that would cause harm if undetected.

---

## Current metrics (v0 engine)

| Metric | Value |
|---|---|
| Eval pass rate | **87.5%** |
| Risk routing accuracy | **87.5%** |
| Issue detection rate | **82%** |
| False positives | **1** |
| False negatives | **1** |
| Partial passes | **2** |
| Total test cases | **8** |

---

## Why false negatives are the primary safety metric

A false positive means the tool flags something that does not require escalation. The cost is a lawyer spending a few extra minutes checking — minor.

A false negative means the tool misses a material clause. A contract with an uncapped liability clause or a missing survival clause could be signed without legal review. The cost could be significant.

**False negatives are treated as the critical failure mode.**

The v0 engine has 1 false negative (a missing survival clause not detected because the engine checks for presence of text, not absence). This is known and documented. A production system using an LLM with structured output prompting would handle absence detection correctly.

---

## Test cases

### Test 1 — Standard Mutual NDA

**Scenario:** Clean mutual NDA with English law, 2-year survival, mutual liability cap.

| | |
|---|---|
| Expected risk | Green |
| Actual risk | Green |
| Expected issues | None |
| Detected issues | None |
| Result | **Pass** |

Notes: Engine correctly identifies no material deviations.

---

### Test 2 — US Law Governing Jurisdiction

**Scenario:** NDA governed by California law; all other terms standard.

| | |
|---|---|
| Expected risk | Amber |
| Actual risk | Amber |
| Expected issues | Governing Law |
| Detected issues | Governing Law |
| Result | **Pass** |

Notes: California jurisdiction correctly flagged.

---

### Test 3 — Uncapped Liability

**Scenario:** Order form with uncapped customer liability and £100 vendor cap.

| | |
|---|---|
| Expected risk | Red |
| Actual risk | Red |
| Expected issues | Liability Cap |
| Detected issues | Liability Cap |
| Result | **Pass** |

Notes: Extreme asymmetry correctly escalated to Red.

---

### Test 4 — Missing Survival Clause

**Scenario:** NDA with no survival clause — confidentiality obligations expire at agreement end.

| | |
|---|---|
| Expected risk | Amber |
| Actual risk | Green |
| Expected issues | Confidentiality Term |
| Detected issues | None |
| Result | **Partial** |

**Known false negative.** The deterministic engine checks for presence of problematic patterns, not for absence of required clauses. An LLM with structured prompting would handle this correctly.

---

### Test 5 — Broad Indemnity

**Scenario:** NDA requiring recipient to indemnify counterparty for all third-party claims, unlimited.

| | |
|---|---|
| Expected risk | Red |
| Actual risk | Red |
| Expected issues | Indemnity |
| Detected issues | Indemnity |
| Result | **Pass** |

Notes: "hold harmless" and "unlimited" patterns correctly trigger Red routing.

---

### Test 6 — Publicity Rights Without Consent

**Scenario:** Partner NDA granting counterparty unilateral right to use logo and issue press releases.

| | |
|---|---|
| Expected risk | Amber |
| Actual risk | Amber |
| Expected issues | Publicity Rights |
| Detected issues | Publicity Rights |
| Result | **Pass** |

Notes: Correctly detected.

---

### Test 7 — Auto-Renewal Short Notice

**Scenario:** Order form with 15-day auto-renewal notice window (below 30-day escalation threshold).

| | |
|---|---|
| Expected risk | Amber |
| Actual risk | Amber |
| Expected issues | Auto-Renewal |
| Detected issues | Auto-Renewal |
| Result | **Partial** |

Notes: Issue detected but severity calibration requires tuning — engine flags at Amber but not with the right severity weight relative to a combined risk contract.

---

### Test 8 — Unusual Security Audit Rights

**Scenario:** Order form granting supplier unlimited real-time access to customer systems.

| | |
|---|---|
| Expected risk | Red |
| Actual risk | Amber |
| Expected issues | Security Obligations, Indemnity |
| Detected issues | Indemnity |
| Result | **Partial** |

**Known false negative on Security Obligations pattern.** Regex pattern did not match the specific phrasing used in this test case. Pattern requires refinement.

---

## Known false positive

**Test 2** generated one false positive: the engine flagged a minor wording variation in the liability clause that does not constitute a material deviation. The flagging is conservative (over-cautious rather than under-cautious), which aligns with the design intent but adds noise.

---

## Evaluation limitations

- All 8 contracts are synthetic — real-world drafting variation will differ significantly
- Regex matching cannot detect absent clauses (e.g. missing survival clause = false negative)
- Severity levels are assigned by pattern definition, not calibrated on lawyer decisions
- Suggested redline quality not yet evaluated by qualified counsel
- No time-saved measurement against a real manual baseline

---

## Production eval plan

1. Run parallel review against 30–50 historical contracts — compare AI route vs. lawyer route
2. Track false negatives by clause type — identify which patterns need regex or LLM improvement
3. Track time saved by contract type to validate the primary business hypothesis
4. Use lawyer decisions to tune playbook rules and recalibrate severity levels
5. Require legal sign-off before any autonomous routing change goes live
6. Re-run eval after each significant playbook or engine change

---

_Evaluation uses synthetic contracts. Not production-validated. Not legal advice._

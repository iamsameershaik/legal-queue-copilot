# Prompt 1 — Initial Product Build

**Goal:** Scaffold ClauseCompass from scratch as a working production-quality prototype.

---

## Prompt (condensed)

Build a production-quality Vite + React + TypeScript single-page application called **ClauseCompass** — a first-pass AI triage system for routine commercial contracts.

### App structure

Six pages:
1. **Dashboard / Command Centre** — contract queue, triage distribution, key metrics
2. **New Contract Review** — intake form with contract text input and sample selector
3. **Review Results** — clause-level findings, redlines, human decision controls
4. **Playbook Rules** — configurable clause rule management
5. **Evaluation** — eval metrics dashboard with test cases
6. **Handover / Activity Log** — launch readiness, activity trail, week-two plan

### Data model (TypeScript interfaces)

- `Contract` — id, title, counterparty, contractType, contractText, urgency, commercialContext, status, createdAt
- `Review` — id, contractId, summary, riskLevel (Green/Amber/Red), confidenceScore, recommendedRoute, findings, suggestedRedlines, estimatedTimeSavedMinutes
- `Finding` — id, clauseType, severity (Low/Medium/High), finding, contractEvidence, playbookRule, recommendation, confidenceScore
- `SuggestedRedline` — id, clauseType, currentText, suggestedText, rationale, severity
- `PlaybookRule` — id, clauseType, preferredPosition, acceptableFallback, escalationTrigger, suggestedFallbackWording, rationale
- `HumanDecision` — id, reviewId, findingId, decision (Accepted/Rejected/Escalated/Edited), editedText, notes, createdAt
- `EvalTest` — id, title, contractType, scenario, expectedRiskLevel, actualRiskLevel, expectedIssues, detectedIssues, passFail, notes

### Mock review engine

Deterministic regex-based engine. No API keys required. Simulates LLM output for demo stability.

Risk signal patterns for: Governing Law, Liability Cap, Indemnity, Publicity Rights, Auto-Renewal, Confidentiality Term, Assignment, Data Protection, Payment Terms, Security Obligations.

Risk routing logic:
- Any High severity finding → Red
- Any findings → Amber
- No findings → Green

### Playbook

10 seeded rules: Governing Law, Confidentiality Term, Liability Cap, Indemnity, Assignment, Data Protection, Publicity Rights, Auto-Renewal, Payment Terms, Security Obligations.

### Eval suite

8 synthetic test cases with realistic (not 100%) metrics:
- 87.5% pass rate
- 1 false negative (missing clause not detected — known engine limitation)
- 1 false positive
- 2 partial passes

### Sample contracts

3 initial samples: standard mutual NDA (Green), risky NDA (Red), customer order form (Amber).

### Persistence

`src/lib/store.ts` — localStorage as prototype persistence. Supabase client wired, gracefully no-ops when env vars absent.

Apply Supabase migration: contracts, reviews, playbook_rules, human_decisions, eval_tests — all with RLS enabled.

### Safety constraints

- Not legal advice
- Human approval required before any external redline
- Red routes must not proceed without legal sign-off
- Display these warnings prominently

### Tech stack

Vite, React 18, TypeScript, Tailwind CSS, Supabase, lucide-react.

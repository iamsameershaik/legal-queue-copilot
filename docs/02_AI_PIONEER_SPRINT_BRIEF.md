# AI Pioneer Sprint Brief — Legal Queue Copilot

## Overview

A two-week sprint to design, build, and evaluate a first-pass AI triage tool for routine commercial contracts.

---

## Problem

Small in-house legal teams spend a significant portion of their time on repetitive first-pass review of routine commercial contracts. Most mutual NDAs, order forms, and vendor agreements follow predictable patterns. Deviations from standard positions are common but identifiable. The bottleneck is human time, not legal complexity.

---

## Users

**Primary:** Legal reviewers triaging incoming contracts (junior lawyers, legal ops, paralegals).

**Secondary:** Commercial teams who submit contracts for review and need faster turnaround.

**Tertiary:** Legal leadership who own playbook policy and need visibility into triage decisions.

---

## Current workflow pain

1. Contract arrives via email, Slack, or ticketing system
2. Reviewer reads the full contract (25–45 minutes for a routine NDA)
3. Reviewer manually checks key clauses against internal standards from memory or a shared doc
4. Reviewer marks up issues, drafts redlines in Word, and sends back
5. No systematic logging of decisions; institutional knowledge is hard to transfer
6. Volume spikes create backlogs; commercial deals are delayed

---

## AI opportunity

A rule-based + LLM hybrid system can:
- Detect standard clause deviations in under 10 seconds
- Route contracts to the right review tier (batch / quick review / full legal)
- Surface specific clause issues with evidence from the contract text
- Suggest fallback wording aligned with the legal playbook
- Log every decision for audit and playbook improvement

The goal is not to replace lawyers. It is to make the first 15–20 minutes of review faster and more consistent.

---

## MVP scope (this prototype)

- Contract text intake (paste or .txt/.md upload)
- Deterministic playbook-based review engine (10 rules)
- Green / Amber / Red risk routing
- Clause-level findings with evidence, playbook rule, and recommendation
- Suggested fallback wording / redlines per finding
- Human decision capture (Accept / Edit / Reject / Escalate)
- Evaluation dashboard with realistic metrics
- Handover plan and readiness score
- 5 synthetic sample contracts
- Supabase-ready schema

---

## Out of scope (this sprint)

- Real LLM integration (stubbed; Edge Function ready)
- DOCX/PDF parsing
- Word tracked-changes export
- Multi-user auth and workflow
- Email/Slack intake integration
- Legal sign-off on playbook
- Production deployment with real contracts

---

## Success metrics

| Metric | Target |
|---|---|
| First-pass review time | < 10 minutes (vs. 25–45 manual) |
| False negative rate | < 5% on historical contract eval |
| Routing accuracy | > 90% on labelled eval set |
| Lawyer acceptance of AI suggestions | > 70% accepted or lightly edited |
| Time from submission to routed decision | < 2 minutes |

---

## Adoption path

**Week 1:** Shadow 3–5 real reviews. Map current workflow. Identify highest-frequency clause types.

**Week 2:** Replace synthetic playbook with Legal-approved positions. Run parallel eval against historical contracts. Measure time saved.

**Month 2:** Soft launch with one legal reviewer. Gather feedback. Tune playbook.

**Month 3:** Wider rollout. Integrate with intake channel. Add DOCX/PDF support.

---

## What I would ask Legal in discovery

1. What contract types do you review most frequently? What percentage is truly routine?
2. What are the 5 clauses you check every time without exception?
3. What does a "material deviation" look like for your highest-volume contract type?
4. What does your current redline workflow look like — Word, email, DocuSign?
5. How are you currently tracking which contracts have been reviewed and by whom?
6. What would make you trust an AI-suggested finding enough to accept it without re-reading the clause?
7. What is your biggest fear about AI in the review process?
8. Who owns the playbook today? How often does it change?
9. What is the cost of a false negative — a missed clause that causes a problem later?
10. What would "success" look like to you personally after 3 months?

---

## Key principle

Embed with the domain experts before building. The legal team owns the policy; the tool is the mechanism. A playbook that Legal does not recognise or trust is worthless, regardless of the technical implementation.

---

_Prototype artefact. Not legal advice._

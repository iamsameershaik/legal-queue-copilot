# Start Here — Reviewer Guide

## What is this?

**Legal Queue Copilot** is a working prototype for first-pass AI triage of routine commercial contracts. It was built as a take-home artefact for the PortSwigger AI Pioneer role.

---

## Links

| | |
|---|---|
| **Live demo** | _[add Netlify link]_ |
| **GitHub repo** | _[add repo URL]_ |
| **Video walkthrough** | _[add Loom/video link — approx. 2.5 minutes]_ |

---

## Recommended review path

**1. Watch the walkthrough (2.5 min)**
The video covers the problem, the live product, and the eval/handover approach.

**2. Open the live demo**
- Click "Load demo queue" on the Command Centre to populate 5 sample contracts
- Navigate to New Review → select "Enterprise SaaS" or "Risky NDA" sample → click Run first-pass review
- Review the findings, accept or escalate a clause, navigate to Review Results
- Visit Playbook to see the configurable rules
- Visit Evaluation to see realistic metrics
- Visit Handover to see the launch readiness score and week-two plan

**3. Try the sample contracts**
Five contracts are preloaded. Each exercises a different risk profile:
- Standard Mutual NDA → Green
- Risky Supplier NDA → Red (US law, uncapped liability, broad indemnity)
- Customer Order Form → Amber (net 90 payment, auto-renewal)
- Enterprise SaaS Agreement → Red (uncapped liability, perpetual data licence)
- Partner NDA → Amber (unilateral publicity rights, no survival clause)

**4. Read the eval report**
`06_EVAL_REPORT.md` — explains the 8 synthetic test cases, realistic metrics, and why false negatives are the primary safety signal.

**5. Read the handover plan**
`07_HANDOVER_RUNBOOK.md` — explains how a legal team would actually adopt this tool and what comes next.

---

## What this demonstrates for the AI Pioneer role

| Capability | Where to see it |
|---|---|
| Problem understanding | Sprint brief (`02_`) and README |
| Hands-on AI product building | The working app — review engine, playbook, findings, redlines |
| Legal workflow thinking | Command Centre queue, playbook rules, human decision controls |
| Human-in-the-loop safety | Safety boundaries, Red routing, "human approval required" on every redline |
| Playbook-based AI review | 10 configurable clause rules; Legal-owned policy layer |
| Honest evaluation | Realistic 87.5% pass rate, false negative tracking, known limitations |
| Handover readiness | 72% readiness score, week-two plan, activity trail |
| Ability to ship and document | Working Vite build, Netlify deploy, 10-doc artefact pack |

---

_Not legal advice. Human approval required before any external redline is sent._

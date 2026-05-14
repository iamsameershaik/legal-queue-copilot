# Live Demo and Video Links

## Links

| | |
|---|---|
| **Live demo** | _[add Netlify URL here]_ |
| **GitHub repo** | https://github.com/iamsameershaik/legal-queue-copilot |
| **Video walkthrough** | _[add Loom URL here — approx. 2.5 minutes]_ |

---

## Netlify deploy notes

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: `public/_redirects` → `/* /index.html 200`
- No environment variables required for the demo (Supabase client gracefully falls back to localStorage when keys are absent)
- If deploying with Supabase: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Netlify environment variables

---

## Suggested demo script (2.5 minutes)

### 0:00–0:20 — Problem

> "In-house legal teams spend hours on repetitive contract review. Most of the time, they're checking the same 10 clauses for the same 5 issues. This demo shows what a first-pass AI triage tool looks like in practice."

### 0:20–0:45 — Product thesis

> "Legal Queue Copilot applies a configurable playbook to incoming contracts, routes them to the right review tier, and hands the lawyer a pre-triaged finding list with suggested redlines. The lawyer still approves everything — but they start from a structured brief, not a blank page."

Navigate to **Command Centre**. Show the queue table. Load demo queue if needed.

### 0:45–1:25 — Live review

Navigate to **New Review**.

- Select "Enterprise SaaS" sample
- Click **Run first-pass review**
- Navigate to **Review Results**

Walk through:
- Executive summary and Red routing
- First finding: uncapped liability — show detected vs. playbook position
- Accept or escalate the finding
- Show a suggested redline — side-by-side wording

### 1:25–1:55 — Eval and safety

Navigate to **Evaluation**.

> "The eval dashboard tracks realistic metrics. 87.5% pass rate. One false negative — a contract where the engine missed a missing survival clause. That's the primary safety metric: false negatives are more dangerous than over-escalating."

Navigate to **Playbook**. Show a rule. Mention Legal ownership.

### 1:55–2:20 — Handover

Navigate to **Handover**.

> "72% launch readiness. The prototype is deployable but not production-ready — synthetic playbook, no LLM, no DOCX parsing. The week-two plan covers what I'd do to close those gaps with the legal team."

### 2:20–2:30 — Close

> "Every redline in this tool requires human approval before it goes externally. The system doesn't approve contracts — it makes lawyers faster. That's the design intent."

---

_Fill in the Netlify and Loom links before submission._

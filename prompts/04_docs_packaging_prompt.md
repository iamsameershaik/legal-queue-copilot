# Prompt 4 — Docs and Repo Packaging

**Goal:** Create a polished reviewer-facing submission pack for GitHub and Netlify deployment.

---

## Prompt (condensed)

We are in final submission-packaging mode. Create a polished documentation pack and prepare the repo for GitHub + Netlify deployment.

**Constraint:** Do not change the application UI, product logic, review engine, routing, or styling. Documentation and repo polish only.

### Context

- Project: ClauseCompass (Legal Queue Copilot)
- Assignment: PortSwigger AI Pioneer take-home
- The app demonstrates: problem understanding, hands-on AI product building, legal workflow thinking, human-in-the-loop safety, honest evaluation, handover readiness, ability to ship and document clearly

### Root README.md

Rewrite `README.md` to be recruiter/reviewer-facing. Required sections:

- Short description + link placeholders (demo, video, repo)
- Why this exists (business problem)
- What I built
- Core workflow (numbered)
- Key features
- Safety boundaries (explicit: not legal advice, human approval required, false negatives as primary metric)
- Evaluation approach with realistic metrics table
- Architecture table
- Why the mock engine exists
- Run locally / Build / Deployment
- Week two plan
- Known limitations
- Submission artefacts (link to docs folder)

Tone: confident, concise, product-minded, honest. No hype. No claims of production deployment.

### docs/ folder — 10 numbered files

01 — README_START_HERE: reviewer onboarding, review path, "what this demonstrates"
02 — AI_PIONEER_SPRINT_BRIEF: two-week sprint framing, users, pain, opportunity, success metrics, discovery questions
03 — LIVE_DEMO_AND_VIDEO_LINKS: link placeholders, Netlify notes, 2.5-minute demo script
04 — ARCHITECTURE_AND_DATA_FLOW: layers, Mermaid diagram, file structure, why API keys not in frontend
05 — SAMPLE_LEGAL_PLAYBOOK: all 10 rules with preferred position, fallback, escalation trigger, wording, rationale + disclaimer
06 — EVAL_REPORT: 8 test cases documented individually, realistic metrics, known false negative explanation, production eval plan
07 — HANDOVER_RUNBOOK: how a reviewer uses the tool, triage guide, playbook update process, adoption checklist
08 — ASSUMPTIONS_LIMITATIONS_AND_NEXT_STEPS: technical and legal limitations, safety boundaries, DPIA note, production hardening steps
09 — PROMPTS_USED: cleaned-up versions of build prompts for artefact trail
10 — SUBMISSION_CHECKLIST: complete pre-submission verification checklist

### sample-contracts/ folder

5 .txt files using exact contract text from the app. Add disclaimer header to each. Files:
01_standard_mutual_nda.txt
02_risky_supplier_nda.txt
03_customer_order_form.txt
04_enterprise_order_form_uncapped_liability.txt
05_partner_nda_publicity_clause.txt

### prompts/ folder

4 .md files with cleaned-up versions of the 4 build prompts.

### Deployment

- Create `public/_redirects` with `/* /index.html 200` for Netlify SPA routing
- Verify `.gitignore` covers `.env`, `dist/`, `node_modules/`
- Verify `.env.example` exists

### Build

Run `npm run build`. Fix any errors.

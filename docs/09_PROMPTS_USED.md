# Prompts Used

These prompts were used to build Legal Queue Copilot with Claude. They are included as part of the artefact trail — to demonstrate product thinking, system design intent, UI taste, and iterative reasoning approach.

Prompts are paraphrased and condensed for readability. They are not raw chat dumps.

---

## Prompt 1 — Initial product build

**Purpose:** Scaffold the complete application from scratch.

**Summary of prompt:**

> Build a production-quality Vite + React + TypeScript application called "Legal Queue Copilot" — a first-pass AI triage system for routine commercial contracts.
>
> The app should have 6 pages: Dashboard (Command Centre), New Contract Review, Review Results, Playbook Rules, Evaluation, Handover/Activity Log.
>
> Include:
> - Full TypeScript data model: Contract, Review, Finding, SuggestedRedline, PlaybookRule, HumanDecision, EvalTest
> - Deterministic mock AI review engine using regex patterns across 12 clause types
> - Risk routing: Green / Amber / Red based on finding severity
> - 10 seeded playbook rules (governing law, liability, indemnity, data protection, etc.)
> - 8 synthetic eval test cases with expected vs. actual results
> - 3 sample contracts: standard NDA, risky NDA, customer order form
> - Supabase client and schema with RLS, plus localStorage fallback
> - .env.example with Supabase vars
> - docs/ folder with 7 markdown documents
>
> Safety constraints: this is not legal advice, human approval required before any redline goes externally, Red routes must not proceed without legal sign-off.
>
> Tech: Vite, React 18, TypeScript, Tailwind CSS, Supabase, lucide-react icons.

**What this demonstrates:** Problem framing, product requirements, safety boundary thinking, full-stack architecture specification.

---

## Prompt 2 — Premium UI refactor

**Purpose:** Upgrade the design from functional to portfolio-grade.

**Summary of prompt:**

> Upgrade the app into a premium, portfolio-grade, futuristic legal-AI workflow product.
>
> Visual references provided (screenshots of Linear, Vercel dashboard, OpenAI Platform):
> - Deep near-black background (#020617 → refined to #080D10)
> - Emerald accent (#16C784) used sparingly
> - Solid matte surfaces, not glassmorphism
> - Sidebar with subtle left-marker active state (not glowing pill)
> - Linear-style queue table with 8 columns
> - Restrained typography hierarchy: 28px page title, 16px section title, 14px body
> - No backdrop-blur, no heavy gradients, no glowing cards
> - 120–180ms transitions only
>
> Also:
> - Rename Dashboard to "Command Centre"
> - Add 2 more sample contracts (Enterprise SaaS — Red, Partner NDA — Amber)
> - Update eval metrics to realistic (87.5% pass rate, not 100%)
> - Add demo mode load button
> - Add playbook coverage matrix
>
> Fix: UI was showing 100% metrics — update eval test cases to have partial passes and a false negative.

**What this demonstrates:** Design system thinking, anti-pattern awareness (avoid AI-generated aesthetic), specific visual taste, honest product metrics.

---

## Prompt 3 — Responsiveness fix

**Purpose:** Fix horizontal overflow across all pages and screen sizes.

**Summary of prompt:**

> The application causes horizontal overflow on multiple pages. Fix this across the entire app for all screen sizes. Do not redesign the app. Only fix layout responsiveness and overflow.
>
> Fixes required:
> 1. html/body/#root: add overflow-x: hidden, max-width: 100%
> 2. Sidebar: hide on mobile, add hamburger menu + drawer
> 3. All page wrappers: replace px-8 with px-4 sm:px-6 lg:px-8, replace fixed max-width with w-full
> 4. All two-column grids: replace fixed grid-cols-[1fr_Xpx] with grid-cols-1 xl:grid-cols-[1fr_Xpx]
> 5. Dashboard queue table: wrap in overflow-x-auto container
> 6. Evaluation test table: wrap in overflow-x-auto container
> 7. FindingCard inner grids: add sm: breakpoints
> 8. Metric grids: grid-cols-2 sm:grid-cols-4 instead of fixed 4-col
> 9. Long text and code blocks: add overflow-wrap: break-word
> 10. Form fields: stack on mobile, buttons flex-wrap
>
> After all changes: run npm run build and verify it passes.

**What this demonstrates:** CSS layout discipline, responsive design knowledge, systematic audit methodology, no-redesign constraint discipline.

---

## Prompt 4 — Docs and repo packaging

**Purpose:** Prepare the complete submission pack for GitHub and Netlify deployment.

**Summary of prompt:**

> We are in final submission-packaging mode. Create a polished reviewer-facing documentation pack.
>
> Create/update:
> - Root README.md: recruiter/reviewer-facing, honest, concise
> - docs/ folder: 10 numbered markdown files (README, sprint brief, links, architecture, playbook, eval report, handover runbook, assumptions, prompts, checklist)
> - sample-contracts/: 5 .txt files with synthetic contract content from the app
> - prompts/: 4 .md files with cleaned-up build prompts
> - public/_redirects: Netlify SPA redirect
> - .gitignore: verify .env ignored, dist ignored, node_modules ignored
> - .env.example: verify present
>
> Tone: confident, concise, product-minded, honest. No hype words. Do not claim production deployment or legal correctness.
>
> Run npm run build. Report what was created and any steps remaining.

**What this demonstrates:** Packaging discipline, documentation craft, deployment readiness, ability to hand work over cleanly.

---

## Why prompts are included

Showing the prompts demonstrates:

1. **Iterative thinking** — each prompt builds on the previous; problems are defined before solutions are specified
2. **Product intent** — prompts are not "write code for X" but "solve the problem of Y with these constraints"
3. **Safety-first framing** — safety boundaries appear in Prompt 1, not as an afterthought
4. **Honest evaluation** — Prompt 2 explicitly fixes the unrealistic 100% metrics to honest numbers
5. **Discipline** — Prompt 3 adds no features; it only fixes a specific problem within defined constraints

The artefact trail matters as much as the output.

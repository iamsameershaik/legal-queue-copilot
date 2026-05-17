# Submission Checklist

Complete this checklist before final submission.

---

## Build and functionality

- [ ] `npm run build` passes with no errors
- [ ] No horizontal scroll at 1440px, 1024px, 768px, 430px
- [ ] All 5 sample contracts load and produce reviews
- [ ] Green / Amber / Red routing works as expected
- [ ] Findings and redlines display correctly
- [ ] Human decision controls work (Accept / Edit / Reject / Escalate)
- [ ] Eval metrics show realistic values (87.5% pass rate, not 100%)
- [ ] Playbook page shows all 10 rules and allows editing
- [ ] Handover page shows 72% readiness score and activity trail
- [ ] Mobile nav (hamburger menu) works below 768px

---

## Documentation

- [ ] Root `README.md` complete with all sections
- [ ] `docs/01_README_START_HERE.md` complete
- [ ] `docs/02_AI_PIONEER_SPRINT_BRIEF.md` complete
- [ ] `docs/03_LIVE_DEMO_AND_VIDEO_LINKS.md` — **links filled in**
- [ ] `docs/04_ARCHITECTURE_AND_DATA_FLOW.md` complete
- [ ] `docs/05_SAMPLE_LEGAL_PLAYBOOK.md` complete
- [ ] `docs/06_EVAL_REPORT.md` complete
- [ ] `docs/07_HANDOVER_RUNBOOK.md` complete
- [ ] `docs/08_ASSUMPTIONS_LIMITATIONS_AND_NEXT_STEPS.md` complete
- [ ] `docs/09_PROMPTS_USED.md` complete
- [ ] `docs/10_SUBMISSION_CHECKLIST.md` complete (this file)

---

## Repo readiness

- [ ] `.env` is in `.gitignore` and not committed
- [ ] `.env.example` is present and committed
- [ ] `dist/` is in `.gitignore`
- [ ] `node_modules/` is in `.gitignore`
- [ ] `README.md` is at repo root
- [ ] `docs/` folder committed
- [ ] `sample-contracts/` folder committed
- [ ] `prompts/` folder committed
- [ ] `public/_redirects` present for Netlify SPA routing

---

## Links — fill in before submission

- [x] **README.md live demo link** updated → https://clausecompass.netlify.app/
- [x] **README.md GitHub repo link** updated → https://github.com/iamsameershaik/legal-queue-copilot
- [x] **README.md video link** updated → https://drive.google.com/file/d/1glA6a2GmQRi32N1jdMaqJXCDnUl7dNwb/view
- [x] **docs/01_README_START_HERE.md** links updated
- [x] **docs/03_LIVE_DEMO_AND_VIDEO_LINKS.md** links updated

---

## Deployment

- [ ] GitHub repository created and pushed
- [ ] Netlify site created, connected to repo
- [ ] Netlify build succeeds (`npm run build` · publish `dist`)
- [ ] Live demo URL works on mobile and desktop
- [ ] SPA routing works (direct URL to any page does not 404)

---

## Video

- [ ] 2.5-minute walkthrough recorded (see demo script in `docs/03_`)
- [ ] Video covers: problem, live review, eval metrics, handover, close
- [ ] Loom (or equivalent) link ready to share

---

## Final delivery

- [ ] All links added to README and docs
- [ ] Final `git push` to main
- [ ] Submission uploaded / sent to PortSwigger

---

_Complete all items above before sending the submission._

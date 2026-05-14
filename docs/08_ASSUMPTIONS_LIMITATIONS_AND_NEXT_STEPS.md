# Assumptions, Limitations, and Next Steps

---

## Assumptions

1. **Target user:** A UK-based in-house legal team handling routine commercial contracts (NDAs, order forms, vendor agreements).

2. **Volume:** Sufficient contract volume to justify the investment — at least 5–10 routine contracts per week where first-pass review consumes significant lawyer time.

3. **Playbook exists:** The legal team has (or can develop) documented positions on key clause types. This tool applies policy; it does not create it.

4. **Contract text is accessible:** Contracts can be pasted or uploaded as text. DOCX/PDF parsing is a near-term addition, not a blocker for evaluation.

5. **Human approval is non-negotiable:** The tool is adopted with the understanding that no output goes externally without lawyer sign-off. This is a design constraint, not a product limitation.

6. **Prototype context:** This is a take-home artefact demonstrating capability. It is not a production system.

---

## Current limitations

### Technical

- **Mock review engine:** The deterministic regex engine cannot detect absent clauses (false negatives for missing provisions), cannot handle paraphrased language, and is not calibrated on real decision data.
- **No LLM integration:** Real AI reasoning is stubbed. The system is fully functional as a prototype but would need LLM integration for production-grade detection.
- **No DOCX/PDF parsing:** Only plain text input is supported. Most real contracts are in Word or PDF.
- **No Word export:** Redlines are displayed in-app but cannot be exported as Word tracked-changes documents.
- **Single-user demo:** No authentication, no multi-reviewer workflow, no role-based access.
- **localStorage persistence:** Data is browser-local. No real database in demo mode (Supabase schema is applied and client is wired but requires env vars).

### Legal/process

- **Synthetic playbook:** The 10 rules are illustrative. They have not been reviewed by qualified legal counsel. They must not be used in real contract review.
- **Synthetic sample contracts:** The 5 demo contracts are fabricated. They do not represent the drafting style, complexity, or edge cases of real counterparty contracts.
- **No legal validation:** No lawyer has reviewed the tool, its outputs, or its suggested redlines.
- **No eval against real data:** The 8 eval test cases are synthetic. A production validation requires 30–50 labelled historical contracts.

---

## AI safety boundaries

- The system **does not approve or reject contracts**
- Every redline requires human approval before external use
- Red-routed contracts must not proceed without full legal review
- False negatives (missed material issues) are the primary risk metric
- The tool surfaces findings; it does not make legal judgments

---

## Data and privacy considerations

- Contract text entered into the demo is stored in browser localStorage — it does not leave the device
- A production deployment handling real contracts must have a Data Protection Impact Assessment (DPIA)
- Contract content must not be sent to third-party LLM APIs without appropriate DPA, data minimisation, and legal review
- Access to the Supabase database should be restricted to authenticated users with appropriate RLS policies (already implemented in schema)

---

## Production hardening steps

1. Replace mock engine with LLM-based review via server-side Edge Function
2. Validate LLM output against strict JSON schema before surfacing to user
3. Add input/output logging for audit trail
4. Replace synthetic playbook with Legal-approved rules
5. Add DOCX/PDF parsing
6. Add Word redline export with tracked changes
7. Implement authentication and role-based access (reviewer / admin / legal lead)
8. Run DPIA for contract data handling
9. Complete eval against 30–50 historical contracts before any production rollout
10. Require legal sign-off workflow for all playbook changes

---

## Integration roadmap

| Priority | Integration | Notes |
|---|---|---|
| High | DOCX/PDF parsing | Most contracts arrive as Word/PDF |
| High | Word redline export | Expected output format for legal teams |
| High | Legal email/Slack intake | Automate contract ingestion |
| Medium | LLM review engine | Replace regex with structured LLM output |
| Medium | Legal ticketing integration | Connect to Jira, Linear, or similar |
| Low | DocuSign/e-sign integration | Track contract lifecycle post-approval |
| Low | Matter management system | Feed review data into DMS |

---

## What would block production use

1. No Legal sign-off on the playbook
2. No eval against real historical data
3. No DOCX/PDF parsing (most contracts are not plain text)
4. No DPIA for contract content handling
5. No Word redline export
6. Single-user — no multi-reviewer workflow

None of these are insurmountable. They are the week-two and week-three tasks.

---

_Prototype artefact. Not legal advice. Not production software._

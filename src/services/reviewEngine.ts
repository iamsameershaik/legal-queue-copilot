/**
 * Legal Queue Copilot — Review Engine
 *
 * Currently runs a deterministic mock review. To integrate a real LLM:
 * 1. Set VITE_USE_LLM=true in .env (do NOT expose API keys here — proxy via Edge Function)
 * 2. Implement runLLMContractReview() that calls your Supabase Edge Function
 * 3. Edge Function calls Anthropic Claude / OpenAI GPT-4 / AWS Bedrock with the playbook + contract text
 * 4. Parse structured JSON response into Review shape
 * 5. Swap the call in runContractReview() below
 */

import {
  Contract, Review, Finding, SuggestedRedline, PlaybookRule,
  ReviewCitation, FindingProvenance, AuthorityStatus, LegalReferenceStatus,
} from "../types";
import { defaultPlaybookRules } from "../data/playbookRules";

let _idCounter = 1;
function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${_idCounter++}`;
}

// ─── Risk signal matchers ──────────────────────────────────────────────────

interface Signal {
  pattern: RegExp;
  clauseType: string;
  severity: "Low" | "Medium" | "High";
  finding: string;
  rationale: string;
  recommendation: string;
  riskContribution: "Red" | "Amber";
  /*
   * detectionType: how the signal fires.
   *   "presence"  — matched wording was found in the contract
   *   "pattern"   — a structural or cross-clause pattern triggered
   *   "threshold" — a numerical/term value exceeded a playbook threshold
   *   "absence"   — the clause was missing (checked separately below)
   */
  detectionType: "presence" | "absence" | "pattern" | "threshold";
  /*
   * requiresLegalReference: whether a qualified external source would normally
   * be cited for this clause type. Used to set legalReferenceStatus.
   */
  requiresLegalReference: boolean;
}

const RISK_SIGNALS: Signal[] = [
  {
    pattern:
      /california|delaware|new york|state of california|state of new york|us law|united states law|laws of the united states/i,
    clauseType: "Governing Law",
    severity: "Medium",
    finding: "Non-UK governing law detected",
    rationale:
      "Non-UK jurisdiction increases enforcement complexity and legal costs for UK-based entities.",
    recommendation: "Negotiate England and Wales governing law, or seek Legal approval for any alternative.",
    riskContribution: "Amber",
    detectionType: "pattern",
    requiresLegalReference: true,
  },
  {
    pattern: /unlimited liability|uncapped liability|liability is unlimited|liability shall be unlimited/i,
    clauseType: "Liability Cap",
    severity: "High",
    finding: "Unlimited or uncapped liability clause present",
    rationale: "Unlimited liability creates unquantifiable financial exposure and is not commercially acceptable.",
    recommendation: "Replace with capped liability at 12 months of fees paid or agreed fixed cap.",
    riskContribution: "Red",
    detectionType: "presence",
    requiresLegalReference: true,
  },
  {
    pattern: /no cap on liability|no limitation on liability|without limit/i,
    clauseType: "Liability Cap",
    severity: "High",
    finding: "Liability cap explicitly excluded",
    rationale: "Explicit removal of a liability cap signals intentional drafting of unlimited exposure.",
    recommendation: "Insist on a mutual liability cap; escalate if counterparty refuses.",
    riskContribution: "Red",
    detectionType: "presence",
    requiresLegalReference: true,
  },
  {
    pattern: /indemnif(?:y|ication).{0,120}(unlimited|any and all|without limit|all losses|all claims)/i,
    clauseType: "Indemnity",
    severity: "High",
    finding: "Broad or unlimited indemnity obligation",
    rationale: "Open-ended indemnity creates significant financial and legal risk.",
    recommendation: "Narrow indemnity to IP infringement and wilful misconduct only.",
    riskContribution: "Red",
    detectionType: "pattern",
    requiresLegalReference: true,
  },
  {
    pattern: /indemnif(?:y|ication)|hold harmless/i,
    clauseType: "Indemnity",
    severity: "Medium",
    finding: "Indemnity or hold harmless clause present",
    rationale: "Indemnity clauses require scrutiny to ensure scope is narrow and mutual.",
    recommendation: "Review indemnity scope; ensure it is mutual and limited to defined scenarios.",
    riskContribution: "Amber",
    detectionType: "presence",
    requiresLegalReference: true,
  },
  {
    pattern:
      /use.{0,40}(name|logo|trade ?mark).{0,60}(marketing|press|investor|website)|press release.{0,60}(right|permission|grant)|identify.{0,60}(partner|customer).{0,60}(marketing|material)/i,
    clauseType: "Publicity Rights",
    severity: "Medium",
    finding: "Counterparty granted publicity or marketing rights without explicit consent requirement",
    rationale: "Unilateral marketing rights expose the company to unsanctioned brand use.",
    recommendation: "Replace with mutual prior written consent requirement for any public reference.",
    riskContribution: "Amber",
    detectionType: "pattern",
    requiresLegalReference: false,
  },
  {
    pattern: /automatically renew|auto.?renew|renews unless cancel|automatic renewal/i,
    clauseType: "Auto-Renewal",
    severity: "Medium",
    finding: "Auto-renewal clause present",
    rationale: "Auto-renewal without adequate notice creates unbudgeted financial commitments.",
    recommendation: "Extend notice period to minimum 60 days, or replace with mutual written renewal.",
    riskContribution: "Amber",
    detectionType: "presence",
    requiresLegalReference: false,
  },
  {
    pattern:
      /obligations of confidentiality shall (not )?survive|no survival|confidentiality (does|shall) not survive/i,
    clauseType: "Confidentiality Term",
    severity: "Medium",
    finding: "Confidentiality obligations do not survive contract termination",
    rationale: "Without a survival clause, confidential information loses protection at contract end.",
    recommendation: "Add survival clause: obligations survive for at least 2 years post-termination.",
    riskContribution: "Amber",
    detectionType: "absence",
    requiresLegalReference: false,
  },
  {
    pattern: /assign.{0,80}without (consent|notice|approval)|freely assign|assign to any (third party|party)/i,
    clauseType: "Assignment",
    severity: "Medium",
    finding: "Assignment permitted without consent or prior notice",
    rationale: "Unrestricted assignment could transfer obligations to unknown or unsuitable parties.",
    recommendation: "Require prior written consent for any assignment outside affiliate/group transfers.",
    riskContribution: "Amber",
    detectionType: "presence",
    requiresLegalReference: false,
  },
  {
    pattern:
      /collect.{0,60}(process|analys|store|use).{0,80}(product improvement|benchmarking|third part|anonymised|aggregate)/i,
    clauseType: "Data Protection",
    severity: "Medium",
    finding: "Broad data processing rights granted to counterparty",
    rationale: "Broad data rights may conflict with GDPR obligations and customer data commitments.",
    recommendation: "Restrict data processing to stated purpose; ensure DPA is in place.",
    riskContribution: "Amber",
    detectionType: "pattern",
    requiresLegalReference: true,
  },
  {
    pattern: /net (6[1-9]|[7-9]\d|\d{3,}) days|payment.{0,30}(6[1-9]|[7-9]\d|\d{3,}) days/i,
    clauseType: "Payment Terms",
    severity: "Medium",
    finding: "Payment terms exceed 60 days",
    rationale: "Extended payment terms negatively affect cash flow and may require Finance approval.",
    recommendation: "Negotiate net 30 or net 45 terms; escalate if counterparty insists on longer terms.",
    riskContribution: "Amber",
    detectionType: "threshold",
    requiresLegalReference: false,
  },
  {
    pattern:
      /security audit.{0,60}(any time|without notice|24 hours?|48 hours?)|real.?time.{0,30}(access|monitor)|audit.{0,40}(any time|immediately)/i,
    clauseType: "Security Obligations",
    severity: "Medium",
    finding: "Unusual or unrestricted security audit rights",
    rationale: "Real-time access or short-notice audit rights create operational disruption risk.",
    recommendation: "Limit audit rights to annual, with minimum 30 days notice and at auditing party's cost.",
    riskContribution: "Amber",
    detectionType: "pattern",
    requiresLegalReference: false,
  },
];

// ─── Clause types that require a legal-reference note ─────────────────────

const LEGAL_REF_REQUIRED_CLAUSES = new Set([
  "Governing Law", "Liability Cap", "Indemnity", "Data Protection",
]);

// ─── Playbook rule lookup ──────────────────────────────────────────────────

function findPlaybookRule(clauseType: string, rules: PlaybookRule[]): PlaybookRule | undefined {
  return rules.find((r) => r.clauseType.toLowerCase() === clauseType.toLowerCase());
}

// ─── Citation builders ─────────────────────────────────────────────────────

let _citCounter = 1;
function cid() { return `cit-${Date.now()}-${_citCounter++}`; }

function buildContractCitation(
  evidence: string,
  clauseType: string,
  isAbsence: boolean,
  matchStart?: number,
  matchEnd?: number,
): ReviewCitation {
  if (isAbsence) {
    return {
      id: cid(),
      sourceType: "contract",
      label: "Submitted contract",
      title: "Missing clause evidence",
      excerpt: `No matching clause detected for: ${clauseType}`,
      location: "Full document scan",
      evidenceStrength: "missing",
      metadata: { detectionType: "absence" },
    };
  }

  const truncated = evidence.length > 300 ? evidence.slice(0, 300) + "…" : evidence;
  return {
    id: cid(),
    sourceType: "contract",
    label: "Submitted contract",
    title: "Detected clause evidence",
    excerpt: truncated || `[Wording relating to ${clauseType}]`,
    location: matchStart !== undefined ? `Characters ${matchStart}–${matchEnd}` : "Detected excerpt",
    evidenceStrength: evidence ? "direct" : "ambiguous",
    textRange: matchStart !== undefined ? { start: matchStart, end: matchEnd ?? matchStart } : undefined,
    metadata: { detectionType: "presence" },
  };
}

function buildPlaybookCitation(rule: PlaybookRule, isRedline = false): ReviewCitation {
  const excerpt = isRedline
    ? rule.suggestedFallbackWording
    : `Preferred: ${rule.preferredPosition}. Fallback: ${rule.acceptableFallback}. Escalation trigger: ${rule.escalationTrigger}.`;

  return {
    id: cid(),
    sourceType: "playbook",
    label: "Internal playbook",
    title: isRedline ? "Fallback wording basis" : rule.clauseType,
    excerpt,
    location: rule.id,
    evidenceStrength: "direct",
    confidence: 100,
  };
}

function buildSystemCitation(): ReviewCitation {
  return {
    id: cid(),
    sourceType: "system",
    label: "Human review control",
    title: "Human approval required",
    excerpt: "Suggested redlines require human review and legal sign-off before external use. This output is first-pass triage, not legal advice.",
    evidenceStrength: "direct",
  };
}

// ─── Authority status helpers ──────────────────────────────────────────────

function deriveAuthorityStatus(
  requiresLegalRef: boolean,
): AuthorityStatus {
  if (!requiresLegalRef) return "playbook-grounded";
  return "external-authority-not-added";
}

function deriveLegalReferenceStatus(
  requiresLegalRef: boolean,
): LegalReferenceStatus {
  if (!requiresLegalRef) return "not-applicable";
  return "not-added";
}

// ─── Provenance builder ───────────────────────────────────────────────────

function buildProvenance(
  signal: Signal,
  rule: PlaybookRule | undefined,
  evidence: string,
  matchStart?: number,
  matchEnd?: number,
): FindingProvenance {
  const matchedSignals: string[] = [];
  if (evidence) matchedSignals.push(`Matched: "${evidence.slice(0, 80)}${evidence.length > 80 ? "…" : ""}"`);
  if (rule) matchedSignals.push(`Playbook rule: ${rule.id} (${rule.clauseType})`);

  /* Confidentiality Term detection is actually pattern-based on the absence of survival */
  const effectiveDetectionType: FindingProvenance["detectionType"] =
    signal.detectionType === ("absence" as string) ? "pattern" : signal.detectionType;

  return {
    detector: "deterministic-rule-engine",
    ruleId: rule?.id ?? `signal-${signal.clauseType.toLowerCase().replace(/\s+/g, "-")}`,
    ruleName: signal.clauseType,
    matchedSignals,
    detectionType: effectiveDetectionType,
    textRange: matchStart !== undefined ? { start: matchStart, end: matchEnd ?? matchStart } : undefined,
  };
}

// ─── Redline builder ──────────────────────────────────────────────────────

function buildRedline(
  signal: Signal,
  contractText: string,
  rules: PlaybookRule[],
): SuggestedRedline | null {
  const rule = findPlaybookRule(signal.clauseType, rules);
  if (!rule) return null;

  const matchResult = signal.pattern.exec(contractText);
  const currentText = matchResult ? matchResult[0].trim() : `[Clause relating to ${signal.clauseType}]`;
  const matchStart = matchResult?.index;
  const matchEnd = matchStart !== undefined ? matchStart + matchResult![0].length : undefined;

  const contractCit = buildContractCitation(currentText, signal.clauseType, false, matchStart, matchEnd);
  const playbookCit = buildPlaybookCitation(rule, true);
  const systemCit   = buildSystemCitation();

  return {
    id: uid("redline"),
    clauseType: signal.clauseType,
    currentText,
    suggestedText: rule.suggestedFallbackWording,
    rationale: rule.rationale,
    severity: signal.severity,
    citations: [contractCit, playbookCit, systemCit],
  };
}

// ─── Mock review function ──────────────────────────────────────────────────

export function runMockContractReview(contract: Contract, rules: PlaybookRule[] = defaultPlaybookRules): Review {
  const text = contract.contractText;
  const findings: Finding[] = [];
  const suggestedRedlines: SuggestedRedline[] = [];
  const triggeredClauseTypes = new Set<string>();

  for (const signal of RISK_SIGNALS) {
    if (!signal.pattern.test(text)) continue;
    if (triggeredClauseTypes.has(signal.clauseType)) continue;
    triggeredClauseTypes.add(signal.clauseType);

    const matchResult = signal.pattern.exec(text);
    const evidence = matchResult ? matchResult[0].trim() : "";
    const matchStart = matchResult?.index;
    const matchEnd = matchStart !== undefined ? matchStart + (matchResult![0]?.length ?? 0) : undefined;
    const rule = findPlaybookRule(signal.clauseType, rules);

    /* Confidentiality Term pattern fires on absence-language patterns, so the
       evidence is "direct" on the negative wording itself. */
    const isAbsenceDetection = false;

    // Contract citation
    const contractCit = buildContractCitation(
      evidence, signal.clauseType, isAbsenceDetection, matchStart, matchEnd,
    );

    // Playbook citation — only if a rule exists
    const playbookCit = rule ? buildPlaybookCitation(rule, false) : null;

    // Authority & legal reference status
    const requiresLegal = signal.requiresLegalReference || LEGAL_REF_REQUIRED_CLAUSES.has(signal.clauseType);
    const authorityStatus = deriveAuthorityStatus(requiresLegal);
    const legalReferenceStatus = deriveLegalReferenceStatus(requiresLegal);

    // Provenance
    const provenance = buildProvenance(signal, rule, evidence, matchStart, matchEnd);

    const citations: ReviewCitation[] = [contractCit];
    if (playbookCit) citations.push(playbookCit);

    findings.push({
      id: uid("finding"),
      clauseType: signal.clauseType,
      severity: signal.severity,
      finding: signal.finding,
      contractEvidence: evidence,
      playbookRule: rule
        ? `Preferred: ${rule.preferredPosition}. Fallback: ${rule.acceptableFallback}.`
        : `See playbook for ${signal.clauseType}.`,
      rationale: signal.rationale,
      recommendation: signal.recommendation,
      confidenceScore: signal.severity === "High" ? 90 : 78,
      citations,
      provenance,
      requiresLegalReference: requiresLegal,
      legalReferenceStatus,
      authorityStatus,
    });

    const redline = buildRedline(signal, text, rules);
    if (redline) suggestedRedlines.push(redline);
  }

  // Determine risk level
  const hasRed = findings.some(
    (f) => RISK_SIGNALS.find((s) => s.clauseType === f.clauseType)?.riskContribution === "Red"
  );
  const hasAmber = findings.length > 0;

  const riskLevel = hasRed ? "Red" : hasAmber ? "Amber" : "Green";

  // Routing
  const routeMap = {
    Green: "Batch for spot-check or quick legal review.",
    Amber: "Lawyer quick review required.",
    Red: "Full legal review required. Do not proceed without legal sign-off.",
  };

  // Confidence
  const avgConfidence =
    findings.length > 0
      ? Math.round(findings.reduce((acc, f) => acc + f.confidenceScore, 0) / findings.length)
      : 95;

  // Time estimates
  const baseReviewMins = contract.contractType === "Mutual NDA" ? 20 : 35;
  const findingsMins = findings.length * 5;
  const estimatedReviewTimeMinutes = baseReviewMins + findingsMins;
  const estimatedTimeSavedMinutes = Math.round(estimatedReviewTimeMinutes * 0.6);

  // Summary
  const summaryParts: string[] = [];
  if (riskLevel === "Green") {
    summaryParts.push(
      `This ${contract.contractType} appears routine and broadly consistent with the standard legal playbook. No material deviations detected.`
    );
  } else if (riskLevel === "Amber") {
    summaryParts.push(
      `This ${contract.contractType} contains ${findings.length} negotiation point${findings.length > 1 ? "s" : ""} requiring lawyer review.`
    );
    const types = findings.map((f) => f.clauseType).join(", ");
    summaryParts.push(`Issues identified: ${types}.`);
  } else {
    const highFindings = findings.filter((f) => f.severity === "High");
    summaryParts.push(
      `This ${contract.contractType} contains ${highFindings.length} high-severity clause${highFindings.length !== 1 ? "s" : ""} that deviate materially from the playbook and require full legal review.`
    );
    const types = highFindings.map((f) => f.clauseType).join(", ");
    summaryParts.push(`Critical issues: ${types}.`);
  }
  summaryParts.push(`${suggestedRedlines.length} redline suggestion${suggestedRedlines.length !== 1 ? "s" : ""} generated.`);

  const escalationReason =
    riskLevel === "Red"
      ? `High-severity clause(s) detected: ${findings
          .filter((f) => f.severity === "High")
          .map((f) => f.clauseType)
          .join(", ")}. These require full legal review before any external communication.`
      : avgConfidence < 70
      ? "Low confidence score — output should be verified by a qualified lawyer."
      : undefined;

  return {
    id: uid("review"),
    contractId: contract.id,
    summary: summaryParts.join(" "),
    riskLevel,
    confidenceScore: avgConfidence,
    recommendedRoute: routeMap[riskLevel],
    estimatedReviewTimeMinutes,
    estimatedTimeSavedMinutes,
    escalationReason,
    findings,
    suggestedRedlines,
    createdAt: new Date().toISOString(),
  };
}

/**
 * runContractReview — public entry point.
 * Currently delegates to mock engine.
 *
 * To add a real LLM:
 * 1. Check if VITE_USE_LLM env var is set.
 * 2. Call your Edge Function: POST /functions/v1/review-contract
 *    Body: { contractText, contractType, playbook }
 * 3. Edge Function calls Anthropic/OpenAI and returns structured Review JSON.
 * 4. Return the parsed result here.
 */
export async function runContractReview(
  contract: Contract,
  rules: PlaybookRule[] = defaultPlaybookRules
): Promise<Review> {
  // Simulate async processing delay for realism
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return runMockContractReview(contract, rules);
}

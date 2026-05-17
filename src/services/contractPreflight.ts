export type PreflightStatus = "accept" | "warn" | "reject";

export interface ContractPreflightResult {
  status: PreflightStatus;
  confidence: number;
  title: string;
  message: string;
  reasons: string[];
  detectedSignals: string[];
  missingSignals: string[];
  recommendedAction: string;
}

// ─── Signal definitions ────────────────────────────────────────────────────

interface PositiveSignal {
  label: string;
  pattern: RegExp;
  weight: number; // contribution to contract score (0–10)
}

interface NegativeSignal {
  label: string;
  pattern: RegExp;
  weight: number; // contribution to non-contract score
}

const POSITIVE_SIGNALS: PositiveSignal[] = [
  // Core agreement vocabulary
  { label: "Agreement/contract keyword",       pattern: /\b(agreement|contract|deed)\b/i,                                        weight: 6 },
  { label: "Parties introduction",             pattern: /\b(between|by and between|entered into between)\b/i,                    weight: 5 },
  { label: "Effective date",                   pattern: /\beffective date\b/i,                                                   weight: 5 },
  { label: "Party designations",               pattern: /\b(the company|the supplier|the customer|the vendor|the licensor|the licensee|the buyer|the seller|the client)\b/i, weight: 4 },
  { label: "Party defined term",               pattern: /"(Company|Supplier|Customer|Vendor|Licensee|Licensor|Buyer|Seller|Client|Recipient|Disclosing Party|Receiving Party)"/i, weight: 4 },

  // Document type signals
  { label: "NDA / non-disclosure",             pattern: /\b(non-?disclosure|nda|mutual nda)\b/i,                                 weight: 7 },
  { label: "Order form / MSA",                 pattern: /\b(order form|master services agreement|statement of work|sow|msa)\b/i, weight: 7 },
  { label: "SaaS / subscription agreement",   pattern: /\b(subscription agreement|saas agreement|licence agreement|license agreement)\b/i, weight: 6 },

  // Core legal clauses
  { label: "Confidentiality clause",           pattern: /\bconfidential(?:ity|ial information)\b/i,                              weight: 5 },
  { label: "Liability clause",                 pattern: /\bliabilit(y|ies)\b/i,                                                  weight: 5 },
  { label: "Indemnity clause",                 pattern: /\bindemnif(y|ication|ied)\b/i,                                          weight: 5 },
  { label: "Governing law",                    pattern: /\bgoverning law\b/i,                                                    weight: 6 },
  { label: "Jurisdiction",                     pattern: /\bjurisdiction\b/i,                                                     weight: 4 },
  { label: "Termination clause",               pattern: /\btermination\b/i,                                                      weight: 4 },
  { label: "Term / duration",                  pattern: /\b(term of|initial term|contract term|duration of this)\b/i,            weight: 3 },
  { label: "Data protection / processing",     pattern: /\b(data protection|data processing|gdpr|personal data)\b/i,             weight: 4 },
  { label: "Payment terms",                    pattern: /\b(payment terms|invoice|net \d+ days|due and payable)\b/i,             weight: 4 },
  { label: "Auto-renewal",                     pattern: /\b(auto-?renew|automatically renew)\b/i,                                weight: 3 },
  { label: "Assignment clause",                pattern: /\bassign(ment|able|ed)\b/i,                                             weight: 3 },
  { label: "Warranties",                       pattern: /\bwarranties|warrant(s|ies)\b/i,                                        weight: 3 },
  { label: "Intellectual property",            pattern: /\b(intellectual property|ip rights|copyright|trade ?marks?)\b/i,        weight: 3 },
  { label: "Services / obligations",           pattern: /\b(services|deliverables|obligations)\b/i,                              weight: 3 },

  // Structural signals
  { label: "Numbered clause structure",        pattern: /^\s*\d+\.\s+[A-Z]/m,                                                   weight: 4 },
  { label: "Section headings",                 pattern: /^\s*[A-Z][A-Z\s]{3,}$/m,                                               weight: 2 },
  { label: "Signature block",                  pattern: /\b(signed|signature|authorised representative|duly authorised|executed as a deed)\b/i, weight: 5 },
  { label: "Defined terms pattern",            pattern: /\(["\u201c](the\s)?\w+["\u201d]\)/i,                                   weight: 3 },
  { label: "Shall / covenant language",        pattern: /\b(shall|hereby agrees|undertakes to|covenants to)\b/i,                 weight: 4 },
  { label: "Entire agreement clause",          pattern: /\bentire agreement\b/i,                                                 weight: 5 },
  { label: "Counterparty reference",           pattern: /\bcounterparty\b/i,                                                     weight: 3 },
];

const NEGATIVE_SIGNALS: NegativeSignal[] = [
  { label: "CV / resume",                      pattern: /\b(curriculum vitae|cv\b|resume\b|work experience|education:|references available)/i, weight: 9 },
  { label: "Job description",                  pattern: /\b(job description|responsibilities include|we are hiring|key responsibilities|about the role|qualifications required)\b/i, weight: 9 },
  { label: "Cover letter",                     pattern: /\b(dear hiring manager|i am writing to apply|i would like to be considered|my application for)\b/i, weight: 9 },
  { label: "Recipe",                           pattern: /\b(ingredients:|method:|prep time|cooking time|serves \d|tablespoon|teaspoon)\b/i, weight: 9 },
  { label: "Blog / article",                   pattern: /\b(in this article|read more|subscribe to|follow us on|posted by|published on|comments?\s*\(\d+\))\b/i, weight: 9 },
  { label: "Meeting notes",                    pattern: /\b(meeting notes|action items|attendees|minutes of|agenda|follow-up items|next steps:)\b/i, weight: 9 },
  { label: "Email thread",                     pattern: /(^|\n)\s*(from:|to:|subject:|sent:)|(>?\s*\w+@\w+\.)/im,             weight: 9 },
  { label: "Code / log output",                pattern: /(\bfunction\s+\w+\s*\(|const\s+\w+\s*=|import\s+\{|class\s+\w+\s*\{|console\.log|stack trace:|error at line|\bpublic\s+class\b)/i, weight: 9 },
  { label: "Poem / creative writing",          pattern: /\b(stanza|verse|haiku|sonnet|rhyme scheme|once upon a time)\b/i,        weight: 8 },
  { label: "Essay / academic",                 pattern: /\b(in conclusion|furthermore|however it should be noted|this essay|the purpose of this paper)\b/i, weight: 6 },
  { label: "Invoice only (no obligations)",    pattern: /\b(invoice number|bill to:|payment due:|total amount due|purchase order #)\b/i, weight: 5 },
  { label: "News / press release",             pattern: /\b(press release|for immediate release|media contact|about [A-Z]\w+ \(company\))\b/i, weight: 7 },
  { label: "Transcript",                       pattern: /\b(transcript|[A-Z]{2,}:\s|interviewer:|interviewee:|speaker \d:)\b/i,  weight: 7 },
];

// ─── Scoring thresholds ────────────────────────────────────────────────────

const ACCEPT_CONTRACT_THRESHOLD = 20; // contract score ≥ this → accept (unless strong negative)
const WARN_CONTRACT_THRESHOLD   = 8;  // contract score ≥ this → warn
const REJECT_NEGATIVE_THRESHOLD = 8;  // negative score ≥ this always means reject
const MIN_TEXT_LENGTH            = 80; // chars — below this always reject

// ─── Key signals that are "must-have" for accept ───────────────────────────
// Accept requires at least two of these to be present unless score is very high.
const CORE_SIGNAL_PATTERNS = [
  /\b(agreement|contract|deed)\b/i,
  /\b(between|by and between)\b/i,
  /\bconfidential(?:ity)?\b/i,
  /\bliabilit(y|ies)\b/i,
  /\bgoverning law\b/i,
  /\btermination\b/i,
  /\b(shall|covenants?|undertakes?)\b/i,
  /\b(non-?disclosure|nda)\b/i,
  /\b(order form|master services|statement of work)\b/i,
  /\bsignature\b/i,
];

// ─── Main classifier ───────────────────────────────────────────────────────

export function classifyContractInput(
  text: string,
  metadata?: { title?: string; contractType?: string; counterparty?: string }
): ContractPreflightResult {
  const trimmed = text.trim();

  // ── Hard reject on empty / very short ─────────────────────────────────
  if (trimmed.length < MIN_TEXT_LENGTH) {
    return {
      status: "reject",
      confidence: 5,
      title: "Document is too short to review",
      message:
        "ClauseCompass needs enough contract text to run a reliable first-pass triage. Paste the full contract, NDA, order form, or vendor agreement.",
      reasons: [
        `Text is ${trimmed.length} characters — minimum is ${MIN_TEXT_LENGTH} for even a preliminary classification.`,
      ],
      detectedSignals: [],
      missingSignals: ["Agreement language", "Party obligations", "Legal clauses"],
      recommendedAction:
        "Paste the full contract text, including parties, obligations, and governing law clauses.",
    };
  }

  // ── Score positive signals ─────────────────────────────────────────────
  const detected: string[] = [];
  let contractScore = 0;

  for (const sig of POSITIVE_SIGNALS) {
    if (sig.pattern.test(trimmed)) {
      detected.push(sig.label);
      contractScore += sig.weight;
    }
  }

  // ── Metadata bonus ─────────────────────────────────────────────────────
  if (metadata?.contractType && metadata.contractType !== "Other") {
    contractScore += 2;
  }

  // ── Score negative signals ─────────────────────────────────────────────
  const negativeHits: string[] = [];
  let negativeScore = 0;

  for (const sig of NEGATIVE_SIGNALS) {
    if (sig.pattern.test(trimmed)) {
      negativeHits.push(sig.label);
      negativeScore += sig.weight;
    }
  }

  // ── Core signal check ──────────────────────────────────────────────────
  const coreMatches = CORE_SIGNAL_PATTERNS.filter((p) => p.test(trimmed)).length;

  // ── Determine status ───────────────────────────────────────────────────
  let status: PreflightStatus;
  const reasons: string[] = [];

  // Strong negative signals dominate — raise contractScore cut-off so meeting notes
  // with incidental legal words still get rejected
  if (negativeScore >= REJECT_NEGATIVE_THRESHOLD && contractScore < 22) {
    status = "reject";
    reasons.push(...negativeHits.map((h) => `Non-contract signal detected: ${h}`));
    if (contractScore < WARN_CONTRACT_THRESHOLD) {
      reasons.push("No sufficient agreement structure detected.");
    }
  } else if (
    contractScore >= ACCEPT_CONTRACT_THRESHOLD &&
    coreMatches >= 2 &&
    /* Documents under 350 chars are always ambiguous — cap at warn even if dense with signals */
    trimmed.length >= 350
  ) {
    status = "accept";
    reasons.push(`${detected.length} contract-like signals detected.`);
    if (coreMatches >= 4) reasons.push("Document contains multiple core legal clause types.");
  } else if (contractScore >= WARN_CONTRACT_THRESHOLD || coreMatches >= 1) {
    status = "warn";
    if (contractScore < ACCEPT_CONTRACT_THRESHOLD) {
      reasons.push("Contract structure is limited or document appears incomplete.");
    }
    if (coreMatches < 2) {
      reasons.push("Fewer than two core legal signal types detected.");
    }
    if (trimmed.length < 500) {
      reasons.push("Document is short — results may be less comprehensive.");
    }
    if (negativeScore > 0) {
      reasons.push(`Some non-contract signals detected: ${negativeHits.join(", ")}.`);
    }
  } else {
    status = "reject";
    reasons.push("No sufficient agreement structure, party obligations, or legal clauses found.");
    if (negativeScore > 0) {
      reasons.push(`Non-contract signals found: ${negativeHits.join(", ")}.`);
    }
    reasons.push("Document does not resemble an NDA, order form, or commercial agreement.");
  }

  // ── Missing signals ────────────────────────────────────────────────────
  const missingSignals: string[] = [];
  if (!detected.some((d) => d.includes("Agreement"))) missingSignals.push("Agreement/contract keyword");
  if (!detected.some((d) => d.includes("Parties")))   missingSignals.push("Party introduction (\"between\")");
  if (!detected.some((d) => d.includes("Governing"))) missingSignals.push("Governing law");
  if (!detected.some((d) => d.includes("obligation") || d.includes("Shall"))) missingSignals.push("Obligation language (\"shall\")");
  if (!detected.some((d) => d.includes("Termination"))) missingSignals.push("Termination clause");

  // ── Confidence ─────────────────────────────────────────────────────────
  let confidence: number;
  if (status === "accept") {
    confidence = Math.min(97, 55 + contractScore * 1.5 - negativeScore * 2);
  } else if (status === "warn") {
    confidence = Math.min(75, 35 + contractScore * 2 - negativeScore);
  } else {
    confidence = Math.max(5, Math.min(45, 40 - contractScore + negativeScore * 2));
  }
  confidence = Math.round(confidence);

  // ── Copy ───────────────────────────────────────────────────────────────
  const copyMap: Record<
    PreflightStatus,
    { title: string; message: string; recommendedAction: string }
  > = {
    accept: {
      title: "Contract-like document detected",
      message:
        "ClauseCompass found enough legal and commercial structure to run a first-pass triage.",
      recommendedAction: "Proceed with the first-pass review.",
    },
    warn: {
      title: "Document may be incomplete",
      message:
        "Some contract signals were detected, but key legal structure appears limited. You can continue, but results may be less reliable.",
      recommendedAction:
        "If this is a full contract, paste the complete text including parties, obligations, and governing law. If it is a short excerpt, results may not cover all risk areas.",
    },
    reject: {
      title: "This does not look like a contract",
      message:
        "ClauseCompass could not find enough agreement structure, party obligations, legal clauses, or commercial terms to run a reliable legal triage.",
      recommendedAction:
        "Paste a contract, NDA, order form, vendor agreement, SaaS agreement, or commercial legal document. If you are pasting a short excerpt, add more context including party names, obligations, and governing law.",
    },
  };

  const copy = copyMap[status];

  return {
    status,
    confidence,
    title: copy.title,
    message: copy.message,
    reasons,
    detectedSignals: detected,
    missingSignals: status === "accept" ? [] : missingSignals.slice(0, 4),
    recommendedAction: copy.recommendedAction,
  };
}

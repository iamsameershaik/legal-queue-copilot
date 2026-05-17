export type PreflightStatus = "accept" | "warn" | "reject";

export type DocumentTypeGuess =
  | "commercial-contract"
  | "contract-excerpt"
  | "repository-documentation"
  | "non-contract-text"
  | "ambiguous-legal-text";

export interface ContractPreflightResult {
  status: PreflightStatus;
  confidence: number;
  title: string;
  message: string;
  reasons: string[];
  detectedSignals: string[];
  missingSignals: string[];
  recommendedAction: string;
  documentTypeGuess: DocumentTypeGuess;
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
  { label: "Transcript",                       pattern: /\b(transcript|interviewer:|interviewee:)\b|^speaker\s+\d+:/im,             weight: 7 },
];

/*
 * Documentation / repository signals — scored separately so we can apply a
 * nuanced rule: high doc score + weak party-obligation structure = reject,
 * but high doc score + strong contract structure = warn (still suspicious).
 *
 * These signals indicate the text is about software, tooling, or project
 * documentation rather than a binding legal document.
 */
interface DocSignal { label: string; pattern: RegExp; weight: number; }

const DOC_SIGNALS: DocSignal[] = [
  // Build / run tooling
  { label: "npm install / run command",     pattern: /\bnpm (install|run|start|build|test)\b/i,                        weight: 8 },
  { label: "package.json reference",        pattern: /\bpackage\.json\b/i,                                              weight: 7 },
  { label: "Run locally / dev server",      pattern: /\b(run locally|running locally|start the dev server|vite|localhost:\d+)\b/i, weight: 7 },
  // Deployment / hosting
  { label: "Deployment platform",           pattern: /\b(netlify|vercel|heroku|railway|render\.com|github pages)\b/i,  weight: 7 },
  { label: "Supabase setup language",       pattern: /\b(supabase-?ready|supabase project|supabase url|anon key)\b/i, weight: 7 },
  // Repository structure
  { label: "Repository / GitHub signals",   pattern: /\b(readme|github\.com|git clone|repository|repo\b|\.gitignore|open source)\b/i, weight: 7 },
  { label: "Source directory paths",        pattern: /\b(src\/|\/components\/|\/services\/|\/pages\/|\/lib\/|\/utils\/)\b/i, weight: 6 },
  { label: "Docs folder reference",         pattern: /\b(\/docs|docs\/|docs folder|\/prompts|sample-contracts)\b/i,   weight: 6 },
  { label: "File listing / artefacts",      pattern: /\b(submission artefacts?|artefacts|handover runbook|live demo|video walkthrough|tech stack)\b/i, weight: 7 },
  // Product description language (about a tool, not a legal document)
  { label: "Product description language",  pattern: /\b(is a (tool|app|platform|copilot|dashboard|prototype|product)|built (with|on|using)|powered by)\b/i, weight: 5 },
  { label: "Architecture / design docs",    pattern: /\b(architecture|data flow|system design|known limitations|next steps|tech stack|component)\b/i, weight: 5 },
  { label: "Markdown file list",            pattern: /^\s*[-*]\s+\d{2}_[A-Z_]+\.md\b/m,                               weight: 8 },
  // Evaluation / testing language that is product-specific
  { label: "Eval / test output language",   pattern: /\b(eval (report|dashboard|results)|pass rate|fixture|test case|test suite)\b/i, weight: 5 },
];

/* Minimum doc score before the documentation rejection path fires */
const DOC_REJECT_THRESHOLD = 10;
/*
 * If doc score exceeds this AND party-obligation structure is strong,
 * cap at warn rather than reject (it might be a README that embeds a real contract).
 */
const DOC_FORCE_WARN_THRESHOLD = 18;

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
      documentTypeGuess: "non-contract-text",
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

  // ── Score documentation / repository signals ──────────────────────────
  const docHits: string[] = [];
  let docScore = 0;

  for (const sig of DOC_SIGNALS) {
    if (sig.pattern.test(trimmed)) {
      docHits.push(sig.label);
      docScore += sig.weight;
    }
  }

  // ── Core signal check ──────────────────────────────────────────────────
  const coreMatches = CORE_SIGNAL_PATTERNS.filter((p) => p.test(trimmed)).length;

  /*
   * Party-obligation strength: a real contract needs parties + at least one
   * obligation-carrying clause (shall / governing law / liability / signature).
   * Documentation about contracts may score well on keywords but lacks this.
   */
  const hasParties = /\b(between|by and between|entered into between)\b/i.test(trimmed) ||
                     /"(Company|Supplier|Customer|Vendor|Recipient|Licensor|Licensee)"/i.test(trimmed);
  const hasObligation = /\b(shall|covenants? to|undertakes? to|hereby agrees)\b/i.test(trimmed);
  const hasGoverningLaw = /\bgoverning law\b/i.test(trimmed);
  const hasSignature = /\b(signed|signature|authorised representative|duly authorised)\b/i.test(trimmed);
  const partyObligationScore =
    (hasParties ? 3 : 0) +
    (hasObligation ? 3 : 0) +
    (hasGoverningLaw ? 2 : 0) +
    (hasSignature ? 2 : 0);

  // ── Determine status ───────────────────────────────────────────────────
  let status: PreflightStatus;
  const reasons: string[] = [];

  /*
   * Documentation rejection path.
   * Fires when documentation signals are strong. If party-obligation structure
   * is also strong (≥ 7/10), cap at warn — it may be a README that embeds a
   * real contract. Otherwise reject outright.
   */
  if (docScore >= DOC_REJECT_THRESHOLD && partyObligationScore < 7) {
    if (docScore >= DOC_FORCE_WARN_THRESHOLD) {
      // Extremely strong doc signals — reject regardless
      status = "reject";
    } else {
      status = "reject";
    }
    reasons.push(`Repository or product documentation signals detected: ${docHits.slice(0, 3).join(", ")}.`);
    reasons.push("No binding party obligations or legal clause structure found.");
  } else if (docScore >= DOC_REJECT_THRESHOLD && partyObligationScore >= 7) {
    // Has both doc signals and real contract structure — suspicious, warn
    status = "warn";
    reasons.push("Document mixes product/repository language with contract-like clauses.");
    reasons.push("Review carefully — may be documentation about a contract rather than the contract itself.");
  // Strong negative signals dominate — raise contractScore cut-off so meeting notes
  // with incidental legal words still get rejected
  } else if (negativeScore >= REJECT_NEGATIVE_THRESHOLD && contractScore < 22) {
    status = "reject";
    reasons.push(...negativeHits.map((h) => `Non-contract signal detected: ${h}`));
    if (contractScore < WARN_CONTRACT_THRESHOLD) {
      reasons.push("No sufficient agreement structure detected.");
    }
  } else if (
    contractScore >= ACCEPT_CONTRACT_THRESHOLD &&
    /* Require 3 core signals and 400+ chars to avoid short excerpts getting accepted */
    coreMatches >= 3 &&
    trimmed.length >= 400
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
    if (docScore > 0 && docScore < DOC_REJECT_THRESHOLD) {
      reasons.push(`Some documentation signals present: ${docHits.slice(0, 2).join(", ")}.`);
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

  // ── Document type guess ───────────────────────────────────────────────
  let documentTypeGuess: DocumentTypeGuess;
  if (docScore >= DOC_REJECT_THRESHOLD) {
    documentTypeGuess = "repository-documentation";
  } else if (status === "reject") {
    documentTypeGuess = "non-contract-text";
  } else if (status === "accept") {
    documentTypeGuess = trimmed.length >= 1000 ? "commercial-contract" : "contract-excerpt";
  } else {
    documentTypeGuess = "ambiguous-legal-text";
  }

  return {
    status,
    confidence,
    title: copy.title,
    message: copy.message,
    reasons,
    detectedSignals: detected,
    missingSignals: status === "accept" ? [] : missingSignals.slice(0, 4),
    recommendedAction: copy.recommendedAction,
    documentTypeGuess,
  };
}

import { Review, Contract } from "../types";
import { runMockContractReview } from "./reviewEngine";
import {
  sampleStandardNDA,
  sampleRiskyNDA,
  sampleOrderForm,
  sampleEnterpriseOrderForm,
  samplePartnerNDA,
} from "../data/sampleContracts";

const EVAL_CONTRACTS: Contract[] = [
  {
    id: "eval-1", title: "Standard NDA", counterparty: "Eval Corp", contractType: "Mutual NDA",
    commercialContext: "Eval", urgency: "Low", contractText: sampleStandardNDA,
    status: "Draft", createdAt: new Date().toISOString(),
  },
  {
    id: "eval-2", title: "Risky NDA", counterparty: "Risky Co", contractType: "Mutual NDA",
    commercialContext: "Eval", urgency: "High", contractText: sampleRiskyNDA,
    status: "Draft", createdAt: new Date().toISOString(),
  },
  {
    id: "eval-3", title: "Order Form", counterparty: "Customer Ltd", contractType: "Customer Order Form",
    commercialContext: "Eval", urgency: "Medium", contractText: sampleOrderForm,
    status: "Draft", createdAt: new Date().toISOString(),
  },
  {
    id: "eval-4", title: "Enterprise Order Form", counterparty: "Big Co", contractType: "Customer Order Form",
    commercialContext: "Eval", urgency: "High", contractText: sampleEnterpriseOrderForm,
    status: "Draft", createdAt: new Date().toISOString(),
  },
  {
    id: "eval-5", title: "Partner NDA", counterparty: "Partner Inc", contractType: "Mutual NDA",
    commercialContext: "Eval", urgency: "Low", contractText: samplePartnerNDA,
    status: "Draft", createdAt: new Date().toISOString(),
  },
];

export interface CitationEvalCheck {
  checkId: string;
  description: string;
  passed: boolean;
  detail?: string;
}

export interface CitationEvalFindingResult {
  findingId: string;
  clauseType: string;
  checks: CitationEvalCheck[];
  allPassed: boolean;
}

export interface CitationEvalRedlineResult {
  redlineId: string;
  clauseType: string;
  hasCitations: boolean;
  noFabricatedUrls: boolean;
  allPassed: boolean;
}

export interface CitationEvalSummary {
  reviewsEvaluated: number;
  findingResults: CitationEvalFindingResult[];
  redlineResults: CitationEvalRedlineResult[];
  totalFindingChecks: number;
  passedFindingChecks: number;
  totalRedlineChecks: number;
  passedRedlineChecks: number;
  passRate: number;
  fabricatedUrlsFound: string[];
}

function hasFabricatedUrl(url?: string): boolean {
  if (!url) return false;
  // Any URL attached to a legal-reference citation is fabricated unless explicitly curated
  return url.startsWith("http");
}

function checkFinding(finding: import("../types").Finding): CitationEvalFindingResult {
  const checks: CitationEvalCheck[] = [];

  // 1. Has at least one citation
  const hasCitations = (finding.citations?.length ?? 0) > 0;
  checks.push({
    checkId: "has-citations",
    description: "Finding has at least one citation",
    passed: hasCitations,
  });

  // 2. Has a contract citation
  const contractCit = finding.citations?.find((c) => c.sourceType === "contract");
  checks.push({
    checkId: "has-contract-citation",
    description: "Finding has a contract citation",
    passed: !!contractCit,
  });

  // 3. Absence findings use "missing" evidence strength
  const isAbsence = finding.provenance?.detectionType === "absence";
  if (isAbsence) {
    const missingStrength = contractCit?.evidenceStrength === "missing";
    checks.push({
      checkId: "absence-uses-missing-strength",
      description: "Absence finding has evidenceStrength=missing on contract citation",
      passed: missingStrength,
      detail: contractCit?.evidenceStrength,
    });
  }

  // 4. Has legalReferenceStatus set
  checks.push({
    checkId: "has-legal-reference-status",
    description: "Finding has legalReferenceStatus set",
    passed: finding.legalReferenceStatus != null,
    detail: finding.legalReferenceStatus,
  });

  // 5. Has authorityStatus set
  checks.push({
    checkId: "has-authority-status",
    description: "Finding has authorityStatus set",
    passed: finding.authorityStatus != null,
    detail: finding.authorityStatus,
  });

  // 6. Has provenance
  checks.push({
    checkId: "has-provenance",
    description: "Finding has provenance metadata",
    passed: finding.provenance != null,
  });

  // 7. No fabricated legal-reference URLs
  const fabricatedUrls = finding.citations
    ?.filter((c) => c.sourceType === "legal-reference" && hasFabricatedUrl(c.url))
    .map((c) => c.url as string) ?? [];
  checks.push({
    checkId: "no-fabricated-legal-urls",
    description: "No fabricated external legal reference URLs",
    passed: fabricatedUrls.length === 0,
    detail: fabricatedUrls.length > 0 ? fabricatedUrls.join(", ") : undefined,
  });

  return {
    findingId: finding.id,
    clauseType: finding.clauseType,
    checks,
    allPassed: checks.every((c) => c.passed),
  };
}

function checkRedline(redline: import("../types").SuggestedRedline): CitationEvalRedlineResult {
  const hasCitations = (redline.citations?.length ?? 0) > 0;

  const fabricatedUrls = redline.citations
    ?.filter((c) => c.sourceType === "legal-reference" && hasFabricatedUrl(c.url))
    .map((c) => c.url as string) ?? [];

  return {
    redlineId: redline.id,
    clauseType: redline.clauseType,
    hasCitations,
    noFabricatedUrls: fabricatedUrls.length === 0,
    allPassed: hasCitations && fabricatedUrls.length === 0,
  };
}

export function runCitationEval(reviews?: Review[]): CitationEvalSummary {
  let targetReviews = reviews;

  if (!targetReviews || targetReviews.length === 0) {
    targetReviews = EVAL_CONTRACTS
      .map((c) => {
        try {
          return runMockContractReview(c);
        } catch {
          return null;
        }
      })
      .filter((r): r is Review => r != null);
  }

  const findingResults: CitationEvalFindingResult[] = [];
  const redlineResults: CitationEvalRedlineResult[] = [];
  const fabricatedUrlsFound: string[] = [];

  for (const review of targetReviews) {
    for (const finding of review.findings) {
      const result = checkFinding(finding);
      findingResults.push(result);

      const fabricated = result.checks
        .filter((c) => c.checkId === "no-fabricated-legal-urls" && !c.passed)
        .flatMap((c) => (c.detail ? c.detail.split(", ") : []));
      fabricatedUrlsFound.push(...fabricated);
    }

    for (const redline of review.suggestedRedlines) {
      const result = checkRedline(redline);
      redlineResults.push(result);

      if (!result.noFabricatedUrls) {
        fabricatedUrlsFound.push(`redline:${redline.id}`);
      }
    }
  }

  const totalFindingChecks = findingResults.reduce((s, r) => s + r.checks.length, 0);
  const passedFindingChecks = findingResults.reduce(
    (s, r) => s + r.checks.filter((c) => c.passed).length,
    0
  );
  const totalRedlineChecks = redlineResults.length * 2; // hasCitations + noFabricatedUrls
  const passedRedlineChecks = redlineResults.reduce(
    (s, r) => s + (r.hasCitations ? 1 : 0) + (r.noFabricatedUrls ? 1 : 0),
    0
  );

  const totalChecks = totalFindingChecks + totalRedlineChecks;
  const passedChecks = passedFindingChecks + passedRedlineChecks;

  return {
    reviewsEvaluated: targetReviews.length,
    findingResults,
    redlineResults,
    totalFindingChecks,
    passedFindingChecks,
    totalRedlineChecks,
    passedRedlineChecks,
    passRate: totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0,
    fabricatedUrlsFound,
  };
}

export type ContractType = "Mutual NDA" | "Customer Order Form" | "Other";
export type Urgency = "Low" | "Medium" | "High";
export type ContractStatus = "Draft" | "Reviewed" | "Escalated" | "Approved";
export type RiskLevel = "Green" | "Amber" | "Red";
export type Severity = "Low" | "Medium" | "High";
export type DecisionType = "Accepted" | "Edited" | "Rejected" | "Escalated";
export type PassFail = "Pass" | "Fail" | "Partial";

export interface Contract {
  id: string;
  title: string;
  counterparty: string;
  contractType: ContractType;
  commercialContext: string;
  urgency: Urgency;
  contractText: string;
  fileName?: string;
  status: ContractStatus;
  createdAt: string;
}

export interface Finding {
  id: string;
  clauseType: string;
  severity: Severity;
  finding: string;
  contractEvidence: string;
  playbookRule: string;
  rationale: string;
  recommendation: string;
  confidenceScore: number;
}

export interface SuggestedRedline {
  id: string;
  clauseType: string;
  currentText: string;
  suggestedText: string;
  rationale: string;
  severity: Severity;
}

export interface Review {
  id: string;
  contractId: string;
  summary: string;
  riskLevel: RiskLevel;
  confidenceScore: number;
  recommendedRoute: string;
  estimatedReviewTimeMinutes: number;
  estimatedTimeSavedMinutes: number;
  escalationReason?: string;
  findings: Finding[];
  suggestedRedlines: SuggestedRedline[];
  createdAt: string;
}

export interface PlaybookRule {
  id: string;
  clauseType: string;
  preferredPosition: string;
  acceptableFallback: string;
  escalationTrigger: string;
  suggestedFallbackWording: string;
  rationale: string;
}

export interface HumanDecision {
  id: string;
  reviewId: string;
  findingId?: string;
  decision: DecisionType;
  editedText?: string;
  notes?: string;
  createdAt: string;
}

export interface EvalTest {
  id: string;
  title: string;
  contractType: ContractType;
  scenario: string;
  expectedRiskLevel: RiskLevel;
  expectedIssues: string[];
  actualRiskLevel: RiskLevel;
  detectedIssues: string[];
  passFail: PassFail;
  notes: string;
}

export interface AppState {
  contracts: Contract[];
  reviews: Review[];
  playbookRules: PlaybookRule[];
  humanDecisions: HumanDecision[];
  evalTests: EvalTest[];
}

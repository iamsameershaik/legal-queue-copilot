import { classifyContractInput, PreflightStatus } from "./contractPreflight";
import { preflightTestCases } from "../data/preflightTestCases";

export interface PreflightEvalResult {
  id: string;
  name: string;
  category: string;
  expectedStatus: PreflightStatus;
  actualStatus: PreflightStatus;
  passed: boolean;
  confidence: number;
  reasons: string[];
  detectedSignals: string[];
}

export interface PreflightEvalSummary {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  results: PreflightEvalResult[];
}

export function runContractPreflightEval(): PreflightEvalSummary {
  const results: PreflightEvalResult[] = preflightTestCases.map((tc) => {
    const result = classifyContractInput(tc.inputText);
    const passed = result.status === tc.expectedStatus;
    return {
      id: tc.id,
      name: tc.name,
      category: tc.category,
      expectedStatus: tc.expectedStatus,
      actualStatus: result.status,
      passed,
      confidence: result.confidence,
      reasons: result.reasons,
      detectedSignals: result.detectedSignals,
    };
  });

  const passed = results.filter((r) => r.passed).length;
  const total = results.length;

  return {
    total,
    passed,
    failed: total - passed,
    passRate: Math.round((passed / total) * 100),
    results,
  };
}

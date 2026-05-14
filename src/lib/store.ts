/**
 * In-memory application store.
 * Backed by localStorage for persistence across refreshes.
 * Supabase integration: replace read/write methods with Supabase queries.
 */

import { Contract, Review, PlaybookRule, HumanDecision, EvalTest } from "../types";
import { defaultPlaybookRules } from "../data/playbookRules";
import { defaultEvalTests } from "../data/evalTests";

const STORAGE_KEY = "lqc_store";

export interface Store {
  contracts: Contract[];
  reviews: Review[];
  playbookRules: PlaybookRule[];
  humanDecisions: HumanDecision[];
  evalTests: EvalTest[];
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      return {
        contracts: parsed.contracts ?? [],
        reviews: parsed.reviews ?? [],
        playbookRules: parsed.playbookRules ?? defaultPlaybookRules,
        humanDecisions: parsed.humanDecisions ?? [],
        evalTests: parsed.evalTests ?? defaultEvalTests,
      };
    }
  } catch {
    // ignore
  }
  return {
    contracts: [],
    reviews: [],
    playbookRules: defaultPlaybookRules,
    humanDecisions: [],
    evalTests: defaultEvalTests,
  };
}

export function saveStore(store: Store): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors in demo
  }
}

export const initialStore = loadStore();

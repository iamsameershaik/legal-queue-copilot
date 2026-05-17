import { useState, useCallback } from "react";
import Layout, { Page } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NewReview from "./pages/NewReview";
import ReviewResults from "./pages/ReviewResults";
import Playbook from "./pages/Playbook";
import Evaluation from "./pages/Evaluation";
import ActivityLog from "./pages/ActivityLog";
import { Contract, Review, PlaybookRule, HumanDecision } from "./types";
import { runContractReview } from "./services/reviewEngine";
import { initialStore, saveStore, Store } from "./lib/store";
import {
  sampleStandardNDA,
  sampleRiskyNDA,
  sampleOrderForm,
} from "./data/sampleContracts";

let _decisionId = 1;
function newDecisionId() {
  return `decision-${Date.now()}-${_decisionId++}`;
}

let _ruleId = 100;
function newRuleId() {
  return `rule-custom-${Date.now()}-${_ruleId++}`;
}

let _contractId = 50;
function newContractId() {
  return `contract-demo-${Date.now()}-${_contractId++}`;
}

const DEMO_CONTRACTS: Omit<Contract, "id" | "createdAt">[] = [
  {
    title: "Mutual NDA — Supplier Co Ltd",
    counterparty: "Supplier Co Ltd",
    contractType: "Mutual NDA",
    urgency: "Low",
    commercialContext: "Exploring potential technology partnership.",
    contractText: sampleStandardNDA,
    status: "Draft",
  },
  {
    title: "NDA — TechCorp Inc",
    counterparty: "TechCorp Inc",
    contractType: "Mutual NDA",
    urgency: "Medium",
    commercialContext: "Software integration partnership proposed by US vendor.",
    contractText: sampleRiskyNDA,
    status: "Draft",
  },
  {
    title: "SaaS Order Form — DataSoft Solutions",
    counterparty: "DataSoft Solutions Ltd",
    contractType: "Customer Order Form",
    urgency: "High",
    commercialContext: "Annual analytics platform subscription.",
    contractText: sampleOrderForm,
    status: "Draft",
  },
];

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [store, setStore] = useState<Store>(initialStore);
  const [activeContractId, setActiveContractId] = useState<string | null>(null);
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function updateStore(updater: (prev: Store) => Store) {
    setStore((prev) => {
      const next = updater(prev);
      saveStore(next);
      return next;
    });
  }

  const handleNewReview = useCallback(
    async (contract: Contract) => {
      setIsProcessing(true);
      try {
        updateStore((s) => ({
          ...s,
          contracts: [...s.contracts, contract],
        }));

        const review = await runContractReview(contract, store.playbookRules);

        updateStore((s) => ({
          ...s,
          contracts: s.contracts.map((c) =>
            c.id === contract.id ? { ...c, status: "Reviewed" as const } : c
          ),
          reviews: [...s.reviews, review],
        }));

        setActiveContractId(contract.id);
        setActiveReviewId(review.id);
        setPage("review-results");
      } finally {
        setIsProcessing(false);
      }
    },
    [store.playbookRules]
  );

  const handleLoadDemo = useCallback(async () => {
    setIsProcessing(true);
    try {
      const newContracts: Contract[] = DEMO_CONTRACTS.map((c) => ({
        ...c,
        id: newContractId(),
        createdAt: new Date().toISOString(),
      }));

      const newReviews: Review[] = [];
      for (const contract of newContracts) {
        const review = await runContractReview(contract, store.playbookRules);
        newReviews.push(review);
      }

      updateStore((s) => ({
        ...s,
        contracts: [...s.contracts, ...newContracts],
        reviews: [...s.reviews, ...newReviews],
      }));

      if (newContracts.length > 0 && newReviews.length > 0) {
        setActiveContractId(newContracts[newContracts.length - 1].id);
        setActiveReviewId(newReviews[newReviews.length - 1].id);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [store.playbookRules]);

  const handleDecision = useCallback(
    (decisionData: Omit<HumanDecision, "id" | "createdAt">) => {
      const decision: HumanDecision = {
        ...decisionData,
        id: newDecisionId(),
        createdAt: new Date().toISOString(),
      };
      updateStore((s) => {
        const newDecisions = [...s.humanDecisions, decision];
        let newContracts = s.contracts;
        if (decision.decision === "Escalated") {
          const review = s.reviews.find((r) => r.id === decision.reviewId);
          if (review) {
            newContracts = s.contracts.map((c) =>
              c.id === review.contractId ? { ...c, status: "Escalated" as const } : c
            );
          }
        }
        return { ...s, humanDecisions: newDecisions, contracts: newContracts };
      });
    },
    []
  );

  const handleAddRule = useCallback((rule: Omit<PlaybookRule, "id">) => {
    updateStore((s) => ({
      ...s,
      playbookRules: [...s.playbookRules, { ...rule, id: newRuleId() }],
    }));
  }, []);

  const handleUpdateRule = useCallback((rule: PlaybookRule) => {
    updateStore((s) => ({
      ...s,
      playbookRules: s.playbookRules.map((r) => (r.id === rule.id ? rule : r)),
    }));
  }, []);

  const handleDeleteRule = useCallback((id: string) => {
    updateStore((s) => ({
      ...s,
      playbookRules: s.playbookRules.filter((r) => r.id !== id),
    }));
  }, []);

  const activeContract = store.contracts.find((c) => c.id === activeContractId) ?? null;
  const activeReview = store.reviews.find((r) => r.id === activeReviewId) ?? null;

  function renderPage() {
    switch (page) {
      case "dashboard":
        return (
          <Dashboard
            contracts={store.contracts}
            reviews={store.reviews}
            humanDecisions={store.humanDecisions}
            onNavigate={setPage}
            onLoadDemo={handleLoadDemo}
          />
        );
      case "new-review":
        return <NewReview onSubmit={handleNewReview} isProcessing={isProcessing} />;
      case "review-results":
        return (
          <ReviewResults
            contract={activeContract}
            review={activeReview}
            onDecision={handleDecision}
            decisions={store.humanDecisions}
          />
        );
      case "playbook":
        return (
          <Playbook
            rules={store.playbookRules}
            onAdd={handleAddRule}
            onUpdate={handleUpdateRule}
            onDelete={handleDeleteRule}
          />
        );
      case "evaluation":
        return <Evaluation evalTests={store.evalTests} />;
      case "activity-log":
        return (
          <ActivityLog
            contracts={store.contracts}
            reviews={store.reviews}
            humanDecisions={store.humanDecisions}
            playbookRules={store.playbookRules}
          />
        );
    }
  }

  return (
    <Layout
      currentPage={page}
      onNavigate={setPage}
      reviewResultsAvailable={activeReview !== null}
    >
      {renderPage()}
    </Layout>
  );
}

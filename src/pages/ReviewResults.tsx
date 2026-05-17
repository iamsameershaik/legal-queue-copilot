import { useState } from "react";
import {
  CheckCircle, XCircle, AlertTriangle, ArrowUpRight,
  Copy, Check, ChevronDown, ChevronUp, LayoutDashboard, FilePlus,
} from "lucide-react";
import { Contract, Review, Finding, SuggestedRedline, HumanDecision, DecisionType } from "../types";
import { RiskBadge, SeverityBadge } from "../components/RiskBadge";
import BrandMark from "../components/BrandMark";
import { Page } from "../components/Layout";
import { CitationPanel } from "../components/CitationPanel";

interface ReviewResultsProps {
  contract: Contract | null;
  review: Review | null;
  onDecision: (d: Omit<HumanDecision, "id" | "createdAt">) => void;
  decisions: HumanDecision[];
  onNavigate: (page: Page) => void;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="btn-ghost text-[11px] px-2 py-1"
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function FindingCard({ finding, reviewId, onDecision, existingDecision }: {
  finding: Finding;
  reviewId: string;
  onDecision: (d: Omit<HumanDecision, "id" | "createdAt">) => void;
  existingDecision?: HumanDecision;
}) {
  const [expanded, setExpanded] = useState(true);
  const [notes, setNotes] = useState("");
  const [editedText, setEditedText] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  function decide(decision: DecisionType) {
    onDecision({ reviewId, findingId: finding.id, decision, editedText: decision === "Edited" ? editedText : undefined, notes: notes || undefined });
  }

  const decided = !!existingDecision;

  const decisionPillStyle: Record<string, string> = {
    Accepted:  "pill pill-green",
    Rejected:  "pill pill-neutral",
    Escalated: "pill pill-red",
    Edited:    "pill pill-blue",
  };

  return (
    <div
      className="surface-card overflow-hidden mb-3"
      style={{ opacity: decided ? 0.75 : 1 }}
    >
      {/* Header */}
      <div
        className="accordion-header rounded-none"
        style={{ borderRadius: 0 }}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <SeverityBadge severity={finding.severity} size="sm" />
          <div className="min-w-0">
            <p className="card-title">{finding.clauseType}</p>
            <p className="text-[12px] text-[#8FA3AE] mt-0.5">{finding.finding}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          {decided && existingDecision && (
            <span className={decisionPillStyle[existingDecision.decision] ?? "pill pill-neutral"}>
              {existingDecision.decision}
            </span>
          )}
          <span className="text-[#566B76]">{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4" style={{ borderTop: "1px solid #131F25" }}>
          {/* Playbook comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mb-4">
            {[
              { label: "Detected position", content: finding.contractEvidence || "See contract text", mono: true },
              { label: "Playbook rule",      content: finding.playbookRule,   mono: false },
              { label: "Recommendation",     content: finding.recommendation, mono: false },
            ].map(({ label, content, mono }) => (
              <div key={label} className="surface-inset p-3">
                <p className="meta-label mb-1.5">{label}</p>
                <p className={`text-[12px] text-[#B8CDD6] leading-relaxed ${mono ? "font-mono break-words" : ""}`}>{content}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="surface-inset p-3">
              <p className="meta-label mb-1.5">Rationale</p>
              <p className="text-[12px] text-[#8FA3AE] leading-relaxed">{finding.rationale}</p>
            </div>
            <div className="surface-inset p-3">
              <p className="meta-label mb-1.5">Business impact</p>
              <p className="text-[12px] text-[#8FA3AE] leading-relaxed">
                {finding.severity === "High"
                  ? "Material financial or legal risk. Do not proceed without full legal review."
                  : finding.severity === "Medium"
                  ? "Negotiation point. Lawyer should decide whether to push back."
                  : "Minor deviation. Note for record; likely acceptable with legal sign-off."}
              </p>
            </div>
          </div>

          <CitationPanel
            citations={finding.citations}
            requiresLegalReference={finding.requiresLegalReference}
            legalReferenceStatus={finding.legalReferenceStatus}
            authorityStatus={finding.authorityStatus}
            provenance={finding.provenance}
          />

          {/* Decision row */}
          {!decided ? (
            <div className="flex flex-wrap items-center justify-between gap-2" style={{ borderTop: "1px solid #131F25", paddingTop: "12px" }}>
              <span className="text-[11px] text-[#566B76]">Confidence: {finding.confidenceScore}%</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button onClick={() => setShowEdit(s => !s)} className="btn-ghost text-[12px] px-3 py-1.5">Edit</button>
                <button onClick={() => decide("Rejected")} className="btn-ghost text-[12px] px-3 py-1.5 flex items-center gap-1"><XCircle size={11} /> Reject</button>
                <button onClick={() => decide("Escalated")} className="btn-ghost text-[12px] px-3 py-1.5 flex items-center gap-1" style={{ color: "#F5A623", borderColor: "rgba(245,158,11,0.25)" }}><ArrowUpRight size={11} /> Escalate</button>
                <button onClick={() => decide("Accepted")} className="btn-primary text-[12px] px-3 py-1.5 flex items-center gap-1 rounded-lg"><CheckCircle size={11} /> Accept</button>
              </div>
            </div>
          ) : (
            <div className="pt-3" style={{ borderTop: "1px solid #131F25" }}>
              <span className="text-[11px] text-[#566B76]">Confidence: {finding.confidenceScore}% · Decision recorded</span>
            </div>
          )}

          {showEdit && !decided && (
            <div className="space-y-2 mt-3 pt-3" style={{ borderTop: "1px solid #131F25" }}>
              <input value={editedText} onChange={e => setEditedText(e.target.value)} placeholder="Your edited recommendation…" className="input-field text-[13px]" />
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes…" className="input-field text-[13px]" />
              <button onClick={() => decide("Edited")} disabled={!editedText.trim()} className="btn-primary text-[12px] px-4 py-1.5 rounded-lg disabled:opacity-40">Save edit</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RedlineCard({ redline }: { redline: SuggestedRedline }) {
  return (
    <div className="surface-card overflow-hidden mb-3">
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #131F25" }}>
        <div className="flex items-center gap-2">
          <p className="card-title">{redline.clauseType}</p>
          <SeverityBadge severity={redline.severity} size="sm" />
        </div>
        <CopyBtn text={redline.suggestedText} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="p-4" style={{ borderBottom: "1px solid #131F25" }}>
          <p className="meta-label mb-2" style={{ color: "#F56565" }}>Current wording</p>
          <div className="code-block overflow-x-auto" style={{ background: "rgba(239,68,68,0.04)", borderColor: "rgba(239,68,68,0.15)" }}>
            {redline.currentText}
          </div>
        </div>
        <div className="p-4" style={{ borderBottom: "1px solid #131F25" }}>
          <p className="meta-label mb-2" style={{ color: "#16C784" }}>Suggested wording</p>
          <div className="code-block overflow-x-auto" style={{ background: "rgba(22,199,132,0.04)", borderColor: "rgba(22,199,132,0.15)" }}>
            {redline.suggestedText}
          </div>
        </div>
      </div>
      <div className="px-4 pb-3">
        <p className="text-[11px] text-[#566B76] leading-relaxed">{redline.rationale}</p>
        <p className="text-[11px] text-[#F5A623] mt-1.5 font-medium">Human review required before sending externally.</p>
        {redline.citations && redline.citations.length > 0 && (
          <CitationPanel citations={redline.citations} />
        )}
      </div>
    </div>
  );
}

function RightSidebar({ review, contract }: { review: Review; contract: Contract }) {
  const trigHigh = review.findings.filter(f => f.severity === "High").map(f => f.clauseType);
  const trigMed  = review.findings.filter(f => f.severity === "Medium").map(f => f.clauseType);

  const routeExplanation: Record<string, string> = {
    Green: "No material deviations from playbook detected. Safe to batch for a quick legal spot-check.",
    Amber: `Negotiation points identified: ${trigMed.length > 0 ? trigMed.join(", ") : "non-standard clauses"}. Requires quick lawyer review before proceeding.`,
    Red: `High-severity clauses: ${trigHigh.length > 0 ? trigHigh.join(", ") : "material risk detected"}. Do not proceed without full legal review and sign-off.`,
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="surface-card p-5">
        <p className="meta-label mb-4">Review summary</p>
        <div className="space-y-3">
          <div>
            <p className="meta-label mb-1">Counterparty</p>
            <p className="text-[13px] text-[#C8D8DF]">{contract.counterparty}</p>
          </div>
          <div>
            <p className="meta-label mb-1">Contract type</p>
            <p className="text-[13px] text-[#C8D8DF]">{contract.contractType}</p>
          </div>
          <div>
            <p className="meta-label mb-1">Risk level</p>
            <RiskBadge level={review.riskLevel} size="md" />
          </div>
          <div className="divider" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="meta-label mb-1">Confidence</p>
              <p className="text-[15px] font-bold text-[#E8EFF2]">{review.confidenceScore}%</p>
            </div>
            <div>
              <p className="meta-label mb-1">Time saved</p>
              <p className="text-[15px] font-bold text-[#16C784]">~{review.estimatedTimeSavedMinutes}m</p>
            </div>
            <div>
              <p className="meta-label mb-1">Est. review</p>
              <p className="text-[15px] font-bold text-[#E8EFF2]">{review.estimatedReviewTimeMinutes}m</p>
            </div>
            <div>
              <p className="meta-label mb-1">Findings</p>
              <p className="text-[15px] font-bold text-[#E8EFF2]">{review.findings.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why this route */}
      <div className="surface-card p-5">
        <p className="meta-label mb-3">Why this route?</p>
        <p className="text-[12px] text-[#8FA3AE] leading-relaxed mb-4">{routeExplanation[review.riskLevel]}</p>
        <div className="space-y-2.5">
          <div className="surface-inset p-3">
            <p className="meta-label mb-1">Check first</p>
            <p className="text-[12px] text-[#C8D8DF]">{review.findings[0]?.clauseType ?? "No immediate flags"}</p>
          </div>
          <div className="surface-inset p-3">
            <p className="meta-label mb-1">Safe to batch?</p>
            <p className="text-[12px]" style={{ color: review.riskLevel === "Green" ? "#16C784" : "#F5A623" }}>
              {review.riskLevel === "Green" ? "Yes — routine contract" : "No — lawyer review required"}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended route */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: review.riskLevel === "Red"
            ? "rgba(239,68,68,0.06)"
            : review.riskLevel === "Amber"
            ? "rgba(245,158,11,0.05)"
            : "rgba(22,199,132,0.05)",
          border: `1px solid ${review.riskLevel === "Red" ? "rgba(239,68,68,0.2)" : review.riskLevel === "Amber" ? "rgba(245,158,11,0.15)" : "rgba(22,199,132,0.15)"}`,
        }}
      >
        <p className="meta-label mb-1.5">Recommended route</p>
        <p className="text-[13px] font-semibold text-[#C8D8DF]">{review.recommendedRoute}</p>
        {review.escalationReason && (
          <div className="flex items-start gap-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(239,68,68,0.15)" }}>
            <AlertTriangle size={12} className="text-[#F56565] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#F87171] leading-relaxed">{review.escalationReason}</p>
          </div>
        )}
      </div>

      <div
        className="rounded-2xl p-4 space-y-2.5"
        style={{ background: "#0F1A1F", border: "1px solid #1E2D35" }}
      >
        <p className="text-[11px] font-semibold text-[#566B76] uppercase tracking-wider">Evidence layer — prototype</p>
        <p className="text-[11px] text-[#364F5A] leading-relaxed">
          Citations are sourced deterministically from contract text and the legal playbook. External legal references are structurally supported but not yet curated — shown as <span className="text-amber-600/80">authority not added</span>.
        </p>
        <p className="text-[11px] text-[#364F5A] leading-relaxed">
          Every recommendation should be verified against the full contract and playbook. This prototype is not legal advice.
        </p>
      </div>
    </div>
  );
}

export default function ReviewResults({ contract, review, onDecision, decisions, onNavigate }: ReviewResultsProps) {
  if (!contract || !review) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[60vh]">
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center"
          style={{
            background: "var(--cc-surface)",
            border: "1px solid var(--cc-border)",
            boxShadow: "0 4px 32px rgba(3,19,20,0.4)",
          }}
        >
          {/* Brand mark */}
          <div className="flex justify-center mb-5">
            <div style={{ filter: "drop-shadow(0 0 12px rgba(22,199,132,0.20))", opacity: 0.7 }}>
              <BrandMark size={48} />
            </div>
          </div>

          <h2 className="text-[17px] font-semibold mb-2" style={{ color: "var(--cc-text)" }}>
            No review selected
          </h2>
          <p className="text-[13px] leading-relaxed mb-6" style={{ color: "var(--cc-text-soft)" }}>
            Select a reviewed contract from Command Centre or run a new first-pass review.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="btn-secondary"
              onClick={() => onNavigate("dashboard")}
            >
              <LayoutDashboard size={13} /> Command Centre
            </button>
            <button
              className="btn-primary"
              onClick={() => onNavigate("new-review")}
            >
              <FilePlus size={13} /> Start New Review
            </button>
          </div>

          <p
            className="text-[10.5px] mt-6 leading-relaxed"
            style={{ color: "var(--cc-text-soft)", opacity: 0.55 }}
          >
            First-pass triage only. Human approval required before any external redline is sent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="page-title mb-1 break-words">{contract.title}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="body-text">{contract.counterparty} · {contract.contractType}</p>
          <RiskBadge level={review.riskLevel} size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* Main: executive summary + findings + redlines */}
        <div className="min-w-0">
          {/* Executive summary */}
          <div className="surface-card p-5 mb-5">
            <p className="meta-label mb-2">Executive summary</p>
            <p className="text-[14px] text-[#C8D8DF] leading-relaxed">{review.summary}</p>
          </div>

          {/* Findings */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Findings <span className="text-[#566B76] font-normal">({review.findings.length})</span></h2>
            </div>

            {review.findings.length === 0 ? (
              <div
                className="rounded-2xl px-5 py-6 text-center"
                style={{ background: "rgba(22,199,132,0.05)", border: "1px solid rgba(22,199,132,0.15)" }}
              >
                <p className="text-[13px] text-[#16C784]">No material deviations from playbook detected.</p>
              </div>
            ) : (
              review.findings.map(f => (
                <FindingCard
                  key={f.id}
                  finding={f}
                  reviewId={review.id}
                  onDecision={onDecision}
                  existingDecision={decisions.find(d => d.reviewId === review.id && d.findingId === f.id)}
                />
              ))
            )}
          </div>

          {/* Redlines */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Suggested Redlines <span className="text-[#566B76] font-normal">({review.suggestedRedlines.length})</span></h2>
            </div>
            {review.suggestedRedlines.length === 0 ? (
              <p className="text-[13px] text-[#566B76]">No redlines suggested.</p>
            ) : (
              review.suggestedRedlines.map(r => <RedlineCard key={r.id} redline={r} />)
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <RightSidebar review={review} contract={contract} />
      </div>
    </div>
  );
}

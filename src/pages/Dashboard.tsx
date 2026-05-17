import { FilePlus, ChevronRight, FileCheck } from "lucide-react";
import { Contract, Review, HumanDecision } from "../types";
import { RiskBadge } from "../components/RiskBadge";
import { Page } from "../components/Layout";

interface DashboardProps {
  contracts: Contract[];
  reviews: Review[];
  humanDecisions: HumanDecision[];
  onNavigate: (page: Page) => void;
  onLoadDemo: () => void;
}

const QUEUE_DATA = [
  { id: "q1", title: "Mutual NDA — Supplier Co Ltd",         counterparty: "Supplier Co Ltd",     type: "Mutual NDA",         risk: "Green" as const, route: "Batch spot-check",          issue: "None — routine",                       saved: "12 min", age: "2h ago",   status: "Reviewed"  },
  { id: "q2", title: "NDA — TechCorp Inc",                   counterparty: "TechCorp Inc",         type: "Mutual NDA",         risk: "Amber" as const, route: "Lawyer quick review",       issue: "Governing Law: California",            saved: "15 min", age: "4h ago",   status: "Reviewed"  },
  { id: "q3", title: "SaaS Order Form — DataSoft Solutions", counterparty: "DataSoft Solutions",   type: "Customer Order Form",risk: "Amber" as const, route: "Commercial/legal review",   issue: "Auto-renewal, net 90 payment",         saved: "18 min", age: "Yesterday",status: "Reviewed"  },
  { id: "q4", title: "Enterprise SaaS — CloudBase Corp",     counterparty: "CloudBase Corp",       type: "Customer Order Form",risk: "Red"   as const, route: "Full legal review",         issue: "Uncapped liability, broad indemnity",  saved: "22 min", age: "Yesterday",status: "Escalated" },
  { id: "q5", title: "Partner NDA — MediaGroup plc",         counterparty: "MediaGroup plc",       type: "Mutual NDA",         risk: "Amber" as const, route: "Lawyer quick review",       issue: "Publicity rights, no survival clause", saved: "14 min", age: "2d ago",   status: "Reviewed"  },
];

const STATUS_STYLE: Record<string, string> = {
  Reviewed:  "pill pill-green",
  Escalated: "pill pill-red",
  Draft:     "pill pill-neutral",
};

function MetricCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className={`stat-card ${accent ? "stat-card-accent" : ""}`}>
      <p className="meta-label mb-2.5">{label}</p>
      <p
        className="text-[26px] font-bold tracking-tight leading-none mb-1"
        style={{ color: accent ? "var(--cc-green)" : "var(--cc-text)" }}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "var(--cc-text-soft)" }}>{sub}</p>}
    </div>
  );
}

export default function Dashboard({ contracts, reviews, humanDecisions: _humanDecisions, onNavigate, onLoadDemo }: DashboardProps) {
  const totalReviewed = reviews.length;
  const timeSavedMin = reviews.reduce((a, r) => a + r.estimatedTimeSavedMinutes, 0);
  const timeSaved = timeSavedMin >= 60 ? `${(timeSavedMin / 60).toFixed(1)}h` : timeSavedMin > 0 ? `${timeSavedMin}m` : "—";
  const avgConf = reviews.length > 0
    ? Math.round(reviews.reduce((a, r) => a + r.confidenceScore, 0) / reviews.length) + "%"
    : "—";
  const green = reviews.filter(r => r.riskLevel === "Green").length;
  const amber = reviews.filter(r => r.riskLevel === "Amber").length;
  const red   = reviews.filter(r => r.riskLevel === "Red").length;
  const escalations = contracts.filter(c => c.status === "Escalated").length;

  const liveQueue = reviews.slice(-5).reverse().map(r => {
    const c = contracts.find(x => x.id === r.contractId);
    return {
      id: r.id,
      title: c?.title ?? "Unknown",
      counterparty: c?.counterparty ?? "—",
      type: c?.contractType ?? "—",
      risk: r.riskLevel,
      route: r.recommendedRoute,
      issue: r.findings[0]?.clauseType ?? "None",
      saved: `${r.estimatedTimeSavedMinutes}m`,
      age: new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      status: c?.status ?? "Reviewed",
    };
  });

  const displayQueue = liveQueue.length > 0 ? liveQueue : QUEUE_DATA;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Status strip */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title mb-1">Command Centre</h1>
          <p className="body-text">First-pass legal triage for routine commercial contracts.</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="pill pill-neutral">Demo mode</span>
            <span className="pill pill-neutral">Mock engine</span>
            <span className="pill pill-amber">Human approval required</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 sm:pt-1 flex-wrap">
          <button className="btn-secondary" onClick={onLoadDemo}>
            <FileCheck size={13} /> Load demo queue
          </button>
          <button className="btn-primary" onClick={() => onNavigate("new-review")}>
            <FilePlus size={13} /> New review
          </button>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Contracts reviewed" value={totalReviewed || "—"} sub={totalReviewed > 0 ? `${green} green · ${amber} amber · ${red} red` : "Run a review to start"} />
        <MetricCard label="Estimated time saved" value={timeSaved} sub="vs. manual first-pass" accent />
        <MetricCard label="Avg. confidence" value={avgConf} sub="across all reviews" />
        <MetricCard label="Eval pass rate" value="87.5%" sub="8 synthetic test cases" accent />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        {/* Contract queue — main column */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Contract Queue</h2>
            <button className="btn-ghost text-xs" onClick={() => onNavigate("new-review")}>
              <FilePlus size={12} /> New contract
            </button>
          </div>

          <div className="surface-card overflow-hidden">
            {/* Table — scrollable on small screens */}
            <div className="overflow-x-auto">
              <div style={{ minWidth: "700px" }}>
                {/* Table header */}
                <div
                  className="grid px-4 py-2.5"
                  style={{
                    gridTemplateColumns: "1fr 90px 70px 130px 150px 60px 80px 36px",
                    borderBottom: "1px solid var(--cc-border)",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    color: "var(--cc-text-soft)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  <span>Contract</span>
                  <span>Type</span>
                  <span>Risk</span>
                  <span>Route</span>
                  <span>Top issue</span>
                  <span>Saved</span>
                  <span>Status</span>
                  <span />
                </div>

                {displayQueue.map((row) => (
                  <div
                    key={row.id}
                    className="grid items-center px-4 py-3 cursor-pointer"
                    style={{
                      gridTemplateColumns: "1fr 90px 70px 130px 150px 60px 80px 36px",
                      borderBottom: "1px solid rgba(11,43,38,0.8)",
                      transition: "background 120ms",
                    }}
                    onClick={() => onNavigate("new-review")}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(11,43,38,0.55)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "")}
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-[13px] font-medium truncate" style={{ color: "var(--cc-text-muted)" }}>{row.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--cc-text-soft)" }}>{row.counterparty}</p>
                    </div>
                    <span className="text-[11px] truncate" style={{ color: "var(--cc-text-soft)" }}>{row.type.replace("Customer Order Form", "Order Form").replace("Mutual NDA", "NDA")}</span>
                    <span><RiskBadge level={row.risk} size="sm" /></span>
                    <span className="text-[11px] truncate pr-2" style={{ color: "var(--cc-text-soft)" }}>{row.route.replace("Batch for spot-check or quick legal review", "Batch spot-check").replace("Lawyer quick review required.", "Quick review").replace("Full legal review required. Do not proceed without legal sign-off.", "Full review")}</span>
                    <span className="text-[11px] truncate pr-2" style={{ color: "var(--cc-text-soft)" }}>{row.issue}</span>
                    <span className="text-[11px] font-semibold" style={{ color: "var(--cc-green)" }}>{row.saved}</span>
                    <span><span className={STATUS_STYLE[row.status] ?? "pill pill-neutral"}>{row.status}</span></span>
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                      style={{ background: "var(--cc-surface-raised)", color: "var(--cc-text-soft)", border: "1px solid var(--cc-border)" }}
                      onClick={e => { e.stopPropagation(); onNavigate("review-results"); }}
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                ))}

                {displayQueue.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <p className="text-[13px] text-[#566B76]">No contracts in queue. Load the demo queue or run a new review.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence panel — right column */}
        <div className="space-y-4">
          {/* Triage distribution */}
          <div className="surface-card p-5">
            <h3 className="card-title mb-4">Triage distribution</h3>
            {[
              { label: "Green",  count: totalReviewed > 0 ? green : 2,  total: totalReviewed > 0 ? totalReviewed : 5, color: "#16C784" },
              { label: "Amber",  count: totalReviewed > 0 ? amber : 2,  total: totalReviewed > 0 ? totalReviewed : 5, color: "#F5A623" },
              { label: "Red",    count: totalReviewed > 0 ? red   : 1,  total: totalReviewed > 0 ? totalReviewed : 5, color: "#F56565" },
            ].map(({ label, count, total, color }) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={label} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-[#8FA3AE]">{label}</span>
                    <span className="text-[12px] font-semibold" style={{ color }}>{count} · {pct}%</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: "var(--cc-border)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: "width 400ms ease" }} />
                  </div>
                </div>
              );
            })}
            {totalReviewed === 0 && (
              <p className="text-[11px] text-[#364F5A] mt-2">Estimated · run reviews to update</p>
            )}
          </div>

          {/* Key signals */}
          <div className="surface-card p-5">
            <h3 className="card-title mb-4">Key signals</h3>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-medium" style={{ color: "var(--cc-text-muted)" }}>Pending escalations</p>
                </div>
                <span className={escalations > 0 ? "pill pill-red" : "pill pill-neutral"}>
                  {escalations}
                </span>
              </div>
              <div className="divider" />
              <div>
                <p className="text-[12px] font-medium mb-1" style={{ color: "var(--cc-text-muted)" }}>Primary risk metric</p>
                <p className="text-[12px]" style={{ color: "var(--cc-red)" }}>False negatives</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--cc-text-soft)" }}>Missing a material issue is the critical failure mode.</p>
              </div>
              <div className="divider" />
              <div>
                <p className="text-[12px] font-medium mb-1" style={{ color: "var(--cc-text-muted)" }}>Last eval run</p>
                <p className="text-[12px]" style={{ color: "var(--cc-text)" }}>87.5% pass rate</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--cc-text-soft)" }}>8 synthetic test cases · 1 false negative</p>
              </div>
            </div>
          </div>

          {/* Impact hypothesis */}
          <div className="surface-card p-5">
            <h3 className="card-title mb-4">Time hypothesis</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: "var(--cc-text-muted)" }}>First-pass review</span>
                <span className="text-[12px] font-semibold" style={{ color: "var(--cc-text)" }}>25 → 8 min</span>
              </div>
              {[
                { label: "Green", sub: "Batch spot-check",    color: "var(--cc-green)" },
                { label: "Amber", sub: "Quick lawyer review", color: "var(--cc-amber)" },
                { label: "Red",   sub: "Full legal review",   color: "var(--cc-red)"   },
              ].map(({ label, sub, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: "var(--cc-text-soft)" }}>{sub}</span>
                  <span className="text-[11px] font-semibold" style={{ color }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}

import { FilePlus, ChevronRight, FileCheck, Play } from "lucide-react";
import { Contract, Review, HumanDecision } from "../types";
import { RiskBadge } from "../components/RiskBadge";
import { Page } from "../components/Layout";

interface DashboardProps {
  contracts: Contract[];
  reviews: Review[];
  humanDecisions: HumanDecision[];
  onNavigate: (page: Page) => void;
  onLoadDemo: () => void;
  onOpenReview: (reviewId: string) => void;
  onOpenDraft: (contractId: string) => void;
}

interface QueueRow {
  id: string;
  contractId: string | undefined;
  title: string;
  counterparty: string;
  type: string;
  risk: "Green" | "Amber" | "Red";
  route: string;
  issue: string;
  saved: string;
  age: string;
  status: string;
}

const QUEUE_DATA: QueueRow[] = [
  { id: "q1", contractId: undefined, title: "Mutual NDA — Supplier Co Ltd",         counterparty: "Supplier Co Ltd",     type: "Mutual NDA",         risk: "Green" as const, route: "Batch spot-check",          issue: "None — routine",                       saved: "12 min", age: "2h ago",   status: "Reviewed"  },
  { id: "q2", contractId: undefined, title: "NDA — TechCorp Inc",                   counterparty: "TechCorp Inc",         type: "Mutual NDA",         risk: "Amber" as const, route: "Lawyer quick review",       issue: "Governing Law: California",            saved: "15 min", age: "4h ago",   status: "Reviewed"  },
  { id: "q3", contractId: undefined, title: "SaaS Order Form — DataSoft Solutions", counterparty: "DataSoft Solutions",   type: "Customer Order Form",risk: "Amber" as const, route: "Commercial/legal review",   issue: "Auto-renewal, net 90 payment",         saved: "18 min", age: "Yesterday",status: "Reviewed"  },
  { id: "q4", contractId: undefined, title: "Enterprise SaaS — CloudBase Corp",     counterparty: "CloudBase Corp",       type: "Customer Order Form",risk: "Red"   as const, route: "Full legal review",         issue: "Uncapped liability, broad indemnity",  saved: "22 min", age: "Yesterday",status: "Escalated" },
  { id: "q5", contractId: undefined, title: "Partner NDA — MediaGroup plc",         counterparty: "MediaGroup plc",       type: "Mutual NDA",         risk: "Amber" as const, route: "Lawyer quick review",       issue: "Publicity rights, no survival clause", saved: "14 min", age: "2d ago",   status: "Reviewed"  },
];

const STATUS_STYLE: Record<string, string> = {
  Reviewed:  "pill pill-green",
  Escalated: "pill pill-red",
  Draft:     "pill pill-neutral",
};

/* ── Decorative inline SVG visualisations ─────────────────────────────── */

function SparklineSVG() {
  const pts = "8,22 16,18 24,20 32,14 40,16 48,10 56,13 64,8";
  return (
    <svg
      aria-hidden="true"
      width="72" height="30"
      viewBox="0 0 72 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", bottom: 12, right: 12, opacity: 0.22, pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="sl-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#20F29C" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#20F29C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} stroke="#20F29C" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <polygon points={`8,22 ${pts} 64,30 8,30`} fill="url(#sl-grad)" />
    </svg>
  );
}

function BarStripSVG() {
  const heights = [8, 14, 10, 18, 12, 20, 16, 24];
  return (
    <svg
      aria-hidden="true"
      width="72" height="30"
      viewBox="0 0 72 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", bottom: 12, right: 12, opacity: 0.2, pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16C784" />
          <stop offset="100%" stopColor="#16C784" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 9}
          y={30 - h}
          width="6"
          height={h}
          rx="2"
          fill="url(#bar-grad)"
        />
      ))}
    </svg>
  );
}

function RingProgressSVG({ pct }: { pct: number }) {
  const r = 13;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg
      aria-hidden="true"
      width="40" height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", bottom: 8, right: 8, opacity: 0.28, pointerEvents: "none" }}
    >
      <circle cx="20" cy="20" r={r} stroke="rgba(22,199,132,0.15)" strokeWidth="3" />
      <circle
        cx="20" cy="20" r={r}
        stroke="url(#ring-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 20 20)"
      />
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#20F29C" />
          <stop offset="100%" stopColor="#16C784" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AreaChartSVG() {
  const pts = "0,26 10,20 20,22 30,14 40,17 50,10 60,12 72,7";
  return (
    <svg
      aria-hidden="true"
      width="72" height="30"
      viewBox="0 0 72 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", bottom: 12, right: 12, opacity: 0.25, pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9FE2BF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#9FE2BF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} stroke="#9FE2BF" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <polygon points={`0,30 ${pts} 72,30`} fill="url(#area-grad)" />
    </svg>
  );
}

/* ── StatCard ─────────────────────────────────────────────────────────── */

type CardVariant = "line" | "bars" | "ring" | "area";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  variant?: CardVariant;
  ringPct?: number;
}

function StatCard({ label, value, sub, accent = false, variant = "line", ringPct = 75 }: StatCardProps) {
  return (
    <div
      className={`stat-card ${accent ? "stat-card-accent" : ""}`}
      style={{ overflow: "hidden" }}
    >
      <p className="meta-label mb-2.5 relative z-10">{label}</p>
      <p
        className="text-[26px] font-bold tracking-tight leading-none mb-1 relative z-10"
        style={{ color: accent ? "var(--cc-green)" : "var(--cc-text)" }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="text-[11px] mt-1.5 leading-relaxed relative z-10"
          style={{ color: "var(--cc-text-soft)" }}
        >
          {sub}
        </p>
      )}
      {/* Decorative background visualisation */}
      {variant === "line"  && <SparklineSVG />}
      {variant === "bars"  && <BarStripSVG />}
      {variant === "ring"  && <RingProgressSVG pct={ringPct} />}
      {variant === "area"  && <AreaChartSVG />}
    </div>
  );
}

/* ── Dashboard ────────────────────────────────────────────────────────── */

export default function Dashboard({ contracts, reviews, humanDecisions: _humanDecisions, onNavigate, onLoadDemo, onOpenReview, onOpenDraft }: DashboardProps) {
  const totalReviewed = reviews.length;
  const timeSavedMin = reviews.reduce((a, r) => a + r.estimatedTimeSavedMinutes, 0);
  const timeSaved = timeSavedMin >= 60 ? `${(timeSavedMin / 60).toFixed(1)}h` : timeSavedMin > 0 ? `${timeSavedMin}m` : "—";
  const avgConf = reviews.length > 0
    ? Math.round(reviews.reduce((a, r) => a + r.confidenceScore, 0) / reviews.length)
    : null;
  const green = reviews.filter(r => r.riskLevel === "Green").length;
  const amber = reviews.filter(r => r.riskLevel === "Amber").length;
  const red   = reviews.filter(r => r.riskLevel === "Red").length;
  const escalations = contracts.filter(c => c.status === "Escalated").length;

  const liveQueue = reviews.slice(-5).reverse().map(r => {
    const c = contracts.find(x => x.id === r.contractId);
    return {
      id: r.id,           // review ID — used to open Review Results
      contractId: c?.id,  // contract ID — used to open Draft
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

  /* Static demo rows carry no real review IDs; clicking them goes to New Review */
  const displayQueue = liveQueue.length > 0 ? liveQueue : QUEUE_DATA;

  function handleRowClick(row: typeof displayQueue[number]) {
    const isReviewed = row.status === "Reviewed" || row.status === "Escalated";
    if (isReviewed && row.id && !row.id.startsWith("q")) {
      // real review ID from liveQueue
      onOpenReview(row.id);
    } else if (row.contractId) {
      onOpenDraft(row.contractId);
    } else {
      onNavigate("new-review");
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
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
          <a
            href="https://drive.google.com/file/d/1glA6a2GmQRi32N1jdMaqJXCDnUl7dNwb/view"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ textDecoration: "none" }}
            title="Original v1 walkthrough"
          >
            <Play size={13} /> Watch walkthrough
          </a>
          <button className="btn-secondary" onClick={onLoadDemo}>
            <FileCheck size={13} /> Load demo queue
          </button>
          <button className="btn-primary" onClick={() => onNavigate("new-review")}>
            <FilePlus size={13} /> New review
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Contracts reviewed"
          value={totalReviewed || "—"}
          sub={totalReviewed > 0 ? `${green} green · ${amber} amber · ${red} red` : "Run a review to start"}
          variant="bars"
        />
        <StatCard
          label="Estimated time saved"
          value={timeSaved}
          sub="vs. manual first-pass"
          accent
          variant="line"
        />
        <StatCard
          label="Avg. confidence"
          value={avgConf !== null ? `${avgConf}%` : "—"}
          sub="across all reviews"
          variant="ring"
          ringPct={avgConf ?? 78}
        />
        <StatCard
          label="Eval pass rate"
          value="87.5%"
          sub="8 synthetic test cases"
          accent
          variant="area"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        {/* Contract queue */}
        <div className="min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Contract Queue</h2>
            <button className="btn-ghost text-xs" onClick={() => onNavigate("new-review")}>
              <FilePlus size={12} /> New contract
            </button>
          </div>

          <div className="surface-card overflow-hidden">
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
                      borderBottom: "1px solid var(--cc-border)",
                      transition: "background 120ms",
                    }}
                    onClick={() => handleRowClick(row)}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(11,43,38,0.55)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "")}
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-[13px] font-medium truncate" style={{ color: "var(--cc-text-muted)" }}>{row.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--cc-text-soft)" }}>{row.counterparty}</p>
                    </div>
                    <span className="text-[11px] truncate" style={{ color: "var(--cc-text-soft)" }}>
                      {row.type.replace("Customer Order Form", "Order Form").replace("Mutual NDA", "NDA")}
                    </span>
                    <span><RiskBadge level={row.risk} size="sm" /></span>
                    <span className="text-[11px] truncate pr-2" style={{ color: "var(--cc-text-soft)" }}>
                      {row.route
                        .replace("Batch for spot-check or quick legal review", "Batch spot-check")
                        .replace("Lawyer quick review required.", "Quick review")
                        .replace("Full legal review required. Do not proceed without legal sign-off.", "Full review")}
                    </span>
                    <span className="text-[11px] truncate pr-2" style={{ color: "var(--cc-text-soft)" }}>{row.issue}</span>
                    <span className="text-[11px] font-semibold" style={{ color: "var(--cc-green)" }}>{row.saved}</span>
                    <span><span className={STATUS_STYLE[row.status] ?? "pill pill-neutral"}>{row.status}</span></span>
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                      style={{ background: "var(--cc-surface-raised)", color: "var(--cc-text-soft)", border: "1px solid var(--cc-border)" }}
                      aria-label="Open review"
                      onClick={e => { e.stopPropagation(); handleRowClick(row); }}
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                ))}

                {displayQueue.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <p className="text-[13px]" style={{ color: "var(--cc-text-soft)" }}>
                      No contracts in queue. Load the demo queue or run a new review.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence panel */}
        <div className="space-y-4">
          {/* Triage distribution */}
          <div className="surface-card p-5">
            <h3 className="card-title mb-4">Triage distribution</h3>
            {[
              { label: "Green", count: totalReviewed > 0 ? green : 2, total: totalReviewed > 0 ? totalReviewed : 5, color: "var(--cc-green)" },
              { label: "Amber", count: totalReviewed > 0 ? amber : 2, total: totalReviewed > 0 ? totalReviewed : 5, color: "var(--cc-amber)" },
              { label: "Red",   count: totalReviewed > 0 ? red   : 1, total: totalReviewed > 0 ? totalReviewed : 5, color: "var(--cc-red)"   },
            ].map(({ label, count, total, color }) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={label} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px]" style={{ color: "var(--cc-text-muted)" }}>{label}</span>
                    <span className="text-[12px] font-semibold" style={{ color }}>{count} · {pct}%</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: "var(--cc-border)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: color, transition: "width 400ms ease" }}
                    />
                  </div>
                </div>
              );
            })}
            {totalReviewed === 0 && (
              <p className="text-[11px] mt-2" style={{ color: "var(--cc-text-soft)" }}>Estimated · run reviews to update</p>
            )}
          </div>

          {/* Key signals */}
          <div className="surface-card p-5">
            <h3 className="card-title mb-4">Key signals</h3>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[12px] font-medium" style={{ color: "var(--cc-text-muted)" }}>Pending escalations</p>
                <span className={escalations > 0 ? "pill pill-red" : "pill pill-neutral"}>{escalations}</span>
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

          {/* Time hypothesis */}
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

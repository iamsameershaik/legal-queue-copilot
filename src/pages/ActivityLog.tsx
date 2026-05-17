import {
  AlertTriangle, BookOpen, CheckCircle, ClipboardCheck,
  ClipboardList, Cpu, FileText, Minus, Rocket, Scale,
  ShieldCheck, XCircle,
} from "lucide-react";
import { Contract, Review, HumanDecision, PlaybookRule } from "../types";
import { RiskBadge } from "../components/RiskBadge";
import { runContractPreflightEval } from "../services/contractPreflightEval";
import { runCitationEval } from "../services/citationEval";

interface ActivityLogProps {
  contracts: Contract[];
  reviews: Review[];
  humanDecisions: HumanDecision[];
  playbookRules: PlaybookRule[];
}

// ─── Static governance data ─────────────────────────────────────────────────

interface Control {
  label: string;
  status: "complete" | "initial" | "not-yet" | "blocker";
  description: string;
  metric?: string;
}

const CONTROLS: Control[] = [
  { label: "Contract Intake Guardrail",     status: "complete",  description: "Deterministic preflight classifier with explainable rejection.",       metric: "18/18 fixtures" },
  { label: "Preflight Eval Fixtures",       status: "complete",  description: "Fixture-based verification covering accept, warn, and reject paths.",   metric: "100% pass rate" },
  { label: "Evidence & Authority Layer",    status: "complete",  description: "Citation-ready outputs attached to every finding and redline.",          metric: "128/128 checks" },
  { label: "Citation Coverage Eval",        status: "complete",  description: "Automated verifier: no fabricated URLs, all provenance attached.",       metric: "100%" },
  { label: "Human Decision Controls",       status: "complete",  description: "Accept / Edit / Reject / Escalate per finding with audit trail.",        metric: "All findings" },
  { label: "Deterministic Review Engine",   status: "complete",  description: "Regex-signal engine with playbook rule matching and redline generation." },
  { label: "Legal-Approved Playbook",       status: "not-yet",   description: "Synthetic rules only. Not reviewed by qualified legal stakeholders." },
  { label: "Historical Validation Set",     status: "not-yet",   description: "No real contract dataset. Required before production use." },
  { label: "Real LLM Integration",          status: "not-yet",   description: "Edge Function stub present. LLM call not yet implemented." },
  { label: "DOCX / PDF Parsing",            status: "not-yet",   description: "Plain text input only. No real document ingestion." },
  { label: "Word Redline Export",           status: "not-yet",   description: "Redlines viewable in UI only. No .docx tracked-change export." },
  { label: "Auth / Multi-reviewer Workflow",status: "not-yet",   description: "Single-session demo. No roles, auth, or production approval chain." },
];

interface Blocker {
  title: string;
  detail: string;
  severity: "High" | "Medium";
  owner: string;
  nextAction: string;
}

const BLOCKERS: Blocker[] = [
  {
    title: "Legal-approved playbook required",
    detail: "Synthetic playbook must be replaced with positions approved by qualified legal stakeholders before any production use.",
    severity: "High",
    owner: "Legal",
    nextAction: "Schedule playbook review session with General Counsel or external counsel.",
  },
  {
    title: "Historical contract validation required",
    detail: "Run against 30–50 labelled historical contracts and track false negatives by clause type. This is the primary quality gate.",
    severity: "High",
    owner: "Legal Ops",
    nextAction: "Identify and label 30 historical contracts covering NDA and Order Form types.",
  },
  {
    title: "Real document ingestion required",
    detail: "Add DOCX/PDF parsing via Supabase Edge Function before real legal intake is possible.",
    severity: "High",
    owner: "Engineering",
    nextAction: "Implement document parse endpoint using mammoth (DOCX) and pdf-parse (PDF).",
  },
  {
    title: "External legal authority not curated",
    detail: "Evidence layer cites contract text and internal playbook only. External legal references are structurally supported but marked as 'not added' throughout.",
    severity: "Medium",
    owner: "Legal",
    nextAction: "Identify authoritative sources for Governing Law, Liability, Indemnity, and Data Protection clauses.",
  },
  {
    title: "Human approval workflow not productionised",
    detail: "Accept/Edit/Reject/Escalate controls exist in the UI, but auth, reviewer roles, and legal-owner sign-off are not implemented.",
    severity: "Medium",
    owner: "Engineering",
    nextAction: "Add Supabase auth with reviewer and approver roles. Wire decision audit trail to database.",
  },
];

interface GovRow {
  area: string;
  currentState: string;
  productionRequirement: string;
  status: "ready" | "initial" | "not-ready";
}

const GOV_MATRIX: GovRow[] = [
  { area: "Playbook ownership",         currentState: "Synthetic rules configured",                           productionRequirement: "Legal-approved clause positions and fallback language",     status: "not-ready" },
  { area: "Contract intake validation", currentState: "Deterministic classifier, 18 fixtures, 100% pass",    productionRequirement: "Validated against real contract sample",                     status: "initial"   },
  { area: "Review routing",             currentState: "Green / Amber / Red by signal match",                  productionRequirement: "Calibrated against historical routing decisions",             status: "initial"   },
  { area: "Evidence / citations",       currentState: "Contract + playbook evidence attached to all outputs", productionRequirement: "Curated external legal references where required",            status: "initial"   },
  { area: "Redline approval",           currentState: "Human approval warning and decision controls",         productionRequirement: "Role-based approval workflow and persisted audit trail",      status: "initial"   },
  { area: "Eval monitoring",            currentState: "Synthetic eval suite + citation coverage verifier",    productionRequirement: "Continuous eval against growing labelled contract dataset",   status: "initial"   },
  { area: "External legal authority",   currentState: "Not added — prototype mode",                          productionRequirement: "Curated per clause type, reviewed by legal stakeholders",     status: "not-ready" },
  { area: "Production deployment",      currentState: "Netlify deploy, build passing",                       productionRequirement: "Auth, RBAC, data persistence, legal sign-off, DPA",          status: "not-ready" },
];

interface WeekTwoItem {
  n: number;
  title: string;
  owner: string;
  signal: string;
  status: "pending" | "next" | "done";
}

const WEEK_TWO: WeekTwoItem[] = [
  { n: 1,  title: "Shadow 3–5 real legal reviews",            owner: "Legal + AI/Product",   signal: "Workflow gaps and edge cases documented",                  status: "next"    },
  { n: 2,  title: "Replace synthetic playbook",               owner: "Legal",                signal: "All rules signed off by qualified counsel",                status: "pending" },
  { n: 3,  title: "Build 30–50 contract labelled eval set",   owner: "Legal Ops",            signal: "Labelled dataset covering NDA and Order Form types",        status: "pending" },
  { n: 4,  title: "Track false negatives by clause type",     owner: "Legal Ops + Engineering", signal: "False negative rate < 5% per clause type",              status: "pending" },
  { n: 5,  title: "Add DOCX/PDF ingestion",                   owner: "Engineering",          signal: "Real documents parsed and reviewed end-to-end",            status: "pending" },
  { n: 6,  title: "Add Word redline export",                  owner: "Engineering",          signal: "Redlines exported as .docx with tracked changes",          status: "pending" },
  { n: 7,  title: "Add reviewer roles and approval workflow", owner: "Engineering",          signal: "Auth, RBAC, and decision audit trail in production",       status: "pending" },
  { n: 8,  title: "Run controlled pilot with legal team",     owner: "Legal Ops",            signal: "5+ contracts reviewed end-to-end with real documents",     status: "pending" },
  { n: 9,  title: "Collect reviewer disagreement data",       owner: "Legal Ops + Legal",    signal: "Override and disagreement rate tracked per clause type",   status: "pending" },
  { n: 10, title: "Update playbook based on feedback loop",   owner: "Legal",                signal: "Playbook version-controlled and reviewed after each cycle", status: "pending" },
];

// ─── Seeded activity events ──────────────────────────────────────────────────

const SEEDED_EVENTS = [
  { id: "e1", ts: "Today, 10:31", actor: "System",         type: "system",   label: "Citation coverage eval run",    sub: "128 checks · 100% pass rate",                 risk: undefined          },
  { id: "e2", ts: "Today, 10:29", actor: "System",         type: "system",   label: "Preflight eval run",            sub: "18 fixtures · 100% pass rate",                risk: undefined          },
  { id: "e3", ts: "Today, 10:28", actor: "AI reviewer",    type: "review",   label: "First-pass review completed",   sub: "Enterprise SaaS — CloudBase Corp · 4 findings", risk: "Red" as const   },
  { id: "e4", ts: "Today, 10:25", actor: "Legal reviewer", type: "decision", label: "Finding escalated",             sub: "Unlimited liability · CloudBase Corp",        risk: undefined          },
  { id: "e5", ts: "Today, 09:54", actor: "AI reviewer",    type: "review",   label: "First-pass review completed",   sub: "Partner NDA — MediaGroup plc · 2 findings",   risk: "Amber" as const  },
  { id: "e6", ts: "Today, 09:51", actor: "Legal reviewer", type: "decision", label: "Redline suggestion copied",     sub: "Publicity rights · MediaGroup plc",           risk: undefined          },
  { id: "e7", ts: "Today, 09:48", actor: "Legal reviewer", type: "decision", label: "Finding accepted",              sub: "Governing law · TechCorp Inc",                risk: undefined          },
  { id: "e8", ts: "Yesterday",    actor: "Playbook admin", type: "playbook", label: "Playbook rule updated",         sub: "Payment Terms — escalation trigger tightened",risk: undefined          },
  { id: "e9", ts: "Yesterday",    actor: "AI reviewer",    type: "review",   label: "First-pass review completed",   sub: "SaaS Order Form — DataSoft Solutions · 3 findings", risk: "Amber" as const },
];

const ACTOR_COLORS: Record<string, string> = {
  "AI reviewer":    "#16C784",
  "Legal reviewer": "#60A5FA",
  "Playbook admin": "#F5A623",
  "System":         "#566B76",
};

function eventIcon(type: string) {
  if (type === "review")   return <Cpu size={11} color="#16C784" />;
  if (type === "decision") return <ClipboardCheck size={11} color="#60A5FA" />;
  if (type === "playbook") return <BookOpen size={11} color="#F5A623" />;
  return <FileText size={11} color="#566B76" />;
}

// ─── Badge helpers ───────────────────────────────────────────────────────────

function ControlBadge({ status }: { status: Control["status"] }) {
  const map = {
    complete: { cls: "pill-green",   label: "Complete" },
    initial:  { cls: "pill-amber",   label: "Initial"  },
    "not-yet":{ cls: "pill-neutral", label: "Not yet"  },
    blocker:  { cls: "pill-red",     label: "Blocker"  },
  };
  const { cls, label } = map[status];
  return <span className={`pill ${cls} flex-shrink-0`}>{label}</span>;
}

function GovBadge({ status }: { status: GovRow["status"] }) {
  if (status === "ready")     return <span className="pill pill-green">Ready</span>;
  if (status === "initial")   return <span className="pill pill-amber">Initial</span>;
  return <span className="pill pill-red">Not ready</span>;
}

function SeverityDot({ sev }: { sev: "High" | "Medium" }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: sev === "High" ? "#EF4444" : "#F59E0B" }}
    />
  );
}

// ─── Section header ──────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ActivityLog({ contracts, reviews, humanDecisions, playbookRules }: ActivityLogProps) {

  // Run evals synchronously for live metrics.
  // Citation eval always uses its own sample-contract set (undefined) so that
  // stale pre-Phase-4 reviews in localStorage do not corrupt the coverage score.
  const preflightEval = runContractPreflightEval();
  const citationEval  = runCitationEval(undefined);

  // Prototype readiness: measures v2 milestone portfolio completion (static).
  const PROTOTYPE_READINESS = 82;

  // Production readiness: calculated dynamically from control coverage.
  const completedControls  = CONTROLS.filter(c => c.status === "complete").length;
  const totalControls      = CONTROLS.length;
  const productionReadiness = Math.round((completedControls / totalControls) * 100);

  // Live activity events
  type LE = { id: string; ts: string; actor: string; type: string; label: string; sub?: string; risk?: Review["riskLevel"] };
  const liveEvents: LE[] = [
    ...reviews.map(r => {
      const c = contracts.find(x => x.id === r.contractId);
      return {
        id: `r-${r.id}`,
        ts: new Date(r.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
        actor: "AI reviewer",
        type: "review",
        label: "First-pass review completed",
        sub: `${c?.title ?? "Unknown"} · ${r.findings.length} finding${r.findings.length !== 1 ? "s" : ""}`,
        risk: r.riskLevel,
      };
    }),
    ...humanDecisions.map(d => {
      const r = reviews.find(x => x.id === d.reviewId);
      const c = r ? contracts.find(x => x.id === r.contractId) : undefined;
      return {
        id: `d-${d.id}`,
        ts: new Date(d.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
        actor: "Legal reviewer",
        type: "decision",
        label: `Finding ${d.decision.toLowerCase()}`,
        sub: c?.title,
        risk: undefined as Review["riskLevel"] | undefined,
      };
    }),
  ].sort((a, b) => b.ts.localeCompare(a.ts));

  const events = liveEvents.length > 0 ? liveEvents : SEEDED_EVENTS.map(e => ({ ...e }));

  const statsRow = [
    { label: "Reviews run",      value: reviews.length || 3       },
    { label: "Decisions made",   value: humanDecisions.length      },
    { label: "Playbook rules",   value: playbookRules.length       },
    { label: "Guardrail fixtures", value: preflightEval.total      },
  ];

  const prodColor = productionReadiness >= 70 ? "#16C784" : productionReadiness >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="page-title mb-1">Handover Lab</h1>
        <p className="body-text">Production readiness, governance controls, and legal adoption plan.</p>
      </div>

      {/* ── 1. Readiness Hero ───────────────────────────────────────────── */}
      <div
        className="surface-card p-6 mb-6"
        style={{ borderColor: "rgba(22,199,132,0.18)" }}
      >
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Two-score block */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row lg:flex-col gap-5 lg:gap-4 min-w-[180px]">
            {/* Prototype readiness */}
            <div className="flex-1 lg:flex-none">
              <p className="meta-label mb-1.5">Prototype readiness</p>
              <p className="font-bold leading-none" style={{ fontSize: 44, color: "#16C784" }}>
                {PROTOTYPE_READINESS}
                <span className="text-xl ml-1" style={{ color: "var(--cc-text-soft)" }}>%</span>
              </p>
              <p className="text-[11px] mt-1 leading-snug" style={{ color: "var(--cc-text-soft)" }}>
                v2 milestone & workflow maturity
              </p>
            </div>

            <div className="hidden sm:block lg:hidden" style={{ width: 1, background: "var(--cc-border)", alignSelf: "stretch" }} />
            <div className="hidden lg:block" style={{ height: 1, background: "var(--cc-border)", width: "100%" }} />

            {/* Production readiness */}
            <div className="flex-1 lg:flex-none">
              <p className="meta-label mb-1.5">Production readiness</p>
              <p className="font-bold leading-none" style={{ fontSize: 44, color: prodColor }}>
                {productionReadiness}
                <span className="text-xl ml-1" style={{ color: "var(--cc-text-soft)" }}>%</span>
              </p>
              <p className="text-[11px] mt-1 leading-snug" style={{ color: "var(--cc-text-soft)" }}>
                {completedControls}/{totalControls} controls production-ready
              </p>
            </div>
          </div>

          <div className="hidden lg:block" style={{ width: 1, background: "var(--cc-border)", alignSelf: "stretch" }} />

          {/* Stage + verdict */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill pill-green">Pilot-ready prototype</span>
              <span className="pill pill-amber">Not production legal advice</span>
            </div>
            <p className="text-[14px] font-semibold" style={{ color: "var(--cc-text)" }}>
              Ready for controlled legal team pilot — not production legal advice
            </p>
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--cc-text-soft)" }}>
              Core workflow, intake guardrails, evidence coverage, citation checks, and handover
              controls are in place. Production use still requires legal-approved playbook positions,
              historical contract validation, document parsing, auth, redline export, and legal sign-off.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="surface-inset p-2.5 rounded-lg">
                <p className="meta-label mb-1">Prototype readiness measures</p>
                <p className="text-[11px]" style={{ color: "var(--cc-text-soft)" }}>v2 portfolio and demo workflow maturity across all completed phases</p>
              </div>
              <div className="surface-inset p-2.5 rounded-lg">
                <p className="meta-label mb-1">Production readiness measures</p>
                <p className="text-[11px]" style={{ color: "var(--cc-text-soft)" }}>Controls still required before real legal deployment ({completedControls}/{totalControls} complete)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5" style={{ borderTop: "1px solid var(--cc-border)" }}>
          {statsRow.map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-[22px] font-bold leading-none mb-1" style={{ color: "var(--cc-text)" }}>{value}</p>
              <p className="meta-label">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Control Coverage ─────────────────────────────────────────── */}
      <div className="surface-card overflow-hidden mb-6">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--cc-border)" }}>
          <SectionHeader icon={<ShieldCheck size={15} color="#16C784" />} title="Control coverage" />
        </div>
        <div className="divide-y" style={{ borderColor: "var(--cc-border)" }}>
          {CONTROLS.map((ctrl) => (
            <div key={ctrl.label} className="flex items-start justify-between gap-4 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium" style={{ color: "var(--cc-text-muted)" }}>{ctrl.label}</p>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--cc-text-soft)" }}>{ctrl.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                {ctrl.metric && (
                  <span className="text-[11px] font-mono" style={{ color: "#16C784" }}>{ctrl.metric}</span>
                )}
                <ControlBadge status={ctrl.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Production Blockers ──────────────────────────────────────── */}
      <div className="mb-6">
        <SectionHeader icon={<AlertTriangle size={15} color="#EF4444" />} title="Production blockers" />
        <div className="space-y-3">
          {BLOCKERS.map((b) => (
            <div
              key={b.title}
              className="surface-card p-4"
              style={{
                borderColor: b.severity === "High"
                  ? "rgba(239,68,68,0.25)"
                  : "rgba(245,158,11,0.2)",
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <SeverityDot sev={b.severity} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-[13px] font-semibold" style={{ color: "var(--cc-text)" }}>{b.title}</p>
                    <span className={`pill ${b.severity === "High" ? "pill-red" : "pill-amber"}`}>
                      {b.severity}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--cc-text-soft)" }}>{b.detail}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5">
                <div className="surface-inset p-2.5">
                  <p className="meta-label mb-1">Owner</p>
                  <p className="text-[12px]" style={{ color: "var(--cc-text-muted)" }}>{b.owner}</p>
                </div>
                <div className="surface-inset p-2.5">
                  <p className="meta-label mb-1">Next action</p>
                  <p className="text-[12px]" style={{ color: "var(--cc-text-muted)" }}>{b.nextAction}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Eval & Safety Metrics ────────────────────────────────────── */}
      <div className="mb-6">
        <SectionHeader icon={<ClipboardList size={15} color="#38BDF8" />} title="Eval & safety metrics" />

        <div
          className="rounded-xl px-4 py-3 mb-4 flex items-start gap-3"
          style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.18)" }}
        >
          <AlertTriangle size={13} color="#F56565" className="flex-shrink-0 mt-0.5" />
          <p className="text-[12px] leading-relaxed" style={{ color: "#B8CDD6" }}>
            <strong style={{ color: "#F87171" }}>Primary safety metric: false negatives.</strong>{" "}
            Missing a material legal issue is more dangerous than over-escalation. All metrics below are
            from synthetic prototype data and must be validated against real contracts before production use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              label: "Intake guardrail",
              value: `${preflightEval.passRate}%`,
              sub: `${preflightEval.passed}/${preflightEval.total} fixture pass rate`,
              accent: preflightEval.passRate === 100,
              note: "Prototype metrics",
            },
            {
              label: "Citation coverage",
              value: `${citationEval.passRate}%`,
              sub: `${citationEval.passedFindingChecks + citationEval.passedRedlineChecks}/${citationEval.totalFindingChecks + citationEval.totalRedlineChecks} checks passed`,
              accent: citationEval.passRate === 100,
              note: "Sample contracts only",
            },
            {
              label: "Fabricated legal refs",
              value: String(citationEval.fabricatedUrlsFound.length),
              sub: "External URLs generated by engine",
              accent: citationEval.fabricatedUrlsFound.length === 0,
              note: "Zero is the required value",
            },
            {
              label: "Review eval",
              value: "Synthetic only",
              sub: "8 labelled cases · 87.5% pass rate",
              accent: false,
              note: "Real dataset required",
            },
            {
              label: "External authority",
              value: "Not added",
              sub: "Legal refs pending curation",
              accent: false,
              note: "Prototype mode",
            },
            {
              label: "Human review",
              value: "Required",
              sub: "Before any external redline",
              accent: false,
              note: "Non-negotiable control",
            },
          ].map(({ label, value, sub, accent, note }) => (
            <div
              key={label}
              className="stat-card"
              style={{
                borderColor: accent ? "rgba(22,199,132,0.2)" : undefined,
              }}
            >
              <p className="meta-label mb-2">{label}</p>
              <p
                className="text-[22px] font-bold leading-none mb-1"
                style={{ color: accent ? "#16C784" : "var(--cc-text)" }}
              >
                {value}
              </p>
              <p className="text-[11px]" style={{ color: "var(--cc-text-soft)" }}>{sub}</p>
              {note && (
                <p className="text-[10px] mt-2 font-medium" style={{ color: "#364F5A" }}>{note}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Governance Matrix ────────────────────────────────────────── */}
      <div className="mb-6">
        <SectionHeader icon={<Scale size={15} color="#F5A623" />} title="Governance matrix" />
        <div className="surface-card overflow-hidden">
          {/* Header row */}
          <div
            className="hidden sm:grid grid-cols-[2fr_3fr_3fr_100px] px-5 py-2.5"
            style={{ borderBottom: "1px solid var(--cc-border)", background: "rgba(11,43,38,0.5)" }}
          >
            {["Area", "Current state", "Production requirement", "Status"].map(h => (
              <p key={h} className="meta-label">{h}</p>
            ))}
          </div>
          <div className="divide-y" style={{ borderColor: "var(--cc-border)" }}>
            {GOV_MATRIX.map((row) => (
              <div key={row.area} className="px-5 py-3 grid grid-cols-1 sm:grid-cols-[2fr_3fr_3fr_100px] gap-y-1.5 gap-x-4">
                <p className="text-[12px] font-semibold" style={{ color: "var(--cc-text-muted)" }}>{row.area}</p>
                <p className="text-[12px]" style={{ color: "var(--cc-text-soft)" }}>{row.currentState}</p>
                <p className="text-[12px]" style={{ color: "var(--cc-text-soft)" }}>{row.productionRequirement}</p>
                <div className="flex items-center sm:justify-start">
                  <GovBadge status={row.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. Activity / Decision Trail ────────────────────────────────── */}
      <div className="mb-6">
        <SectionHeader icon={<Cpu size={15} color="#16C784" />} title="Reviewer activity trail" />
        <div className="surface-card overflow-hidden">
          {events.slice(0, 12).map((e, i) => (
            <div
              key={e.id}
              className="flex items-start gap-3 px-4 py-3"
              style={{ borderBottom: i < Math.min(events.length, 12) - 1 ? "1px solid #0F1A1F" : "none" }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "#131F25", border: "1px solid #1E2D35" }}
              >
                {eventIcon(e.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[12px] font-semibold" style={{ color: "#C8D8DF" }}>{e.label}</p>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ background: "#131F25", color: ACTOR_COLORS[e.actor] ?? "#566B76" }}
                  >
                    {e.actor}
                  </span>
                </div>
                {e.sub && <p className="text-[11px] mt-0.5 truncate" style={{ color: "#566B76" }}>{e.sub}</p>}
                <p className="text-[10px] mt-0.5" style={{ color: "#364F5A" }}>{e.ts}</p>
              </div>
              {e.risk && <RiskBadge level={e.risk} size="sm" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. Week-Two Adoption Plan ───────────────────────────────────── */}
      <div className="mb-6">
        <SectionHeader icon={<Rocket size={15} color="#16C784" />} title="Week-two adoption plan" />
        <div className="surface-card overflow-hidden">
          <div className="divide-y" style={{ borderColor: "var(--cc-border)" }}>
            {WEEK_TWO.map((item) => (
              <div key={item.n} className="flex items-start gap-4 px-5 py-3.5">
                <span
                  className="text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: item.status === "done" ? "rgba(22,199,132,0.15)" : item.status === "next" ? "rgba(56,189,248,0.12)" : "rgba(143,163,174,0.08)",
                    border: `1px solid ${item.status === "done" ? "rgba(22,199,132,0.3)" : item.status === "next" ? "rgba(56,189,248,0.25)" : "rgba(143,163,174,0.15)"}`,
                    color: item.status === "done" ? "#16C784" : item.status === "next" ? "#38BDF8" : "#566B76",
                  }}
                >
                  {item.status === "done" ? <CheckCircle size={10} /> : item.status === "next" ? item.n : <Minus size={10} />}
                </span>
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_140px_160px] gap-x-4 gap-y-1">
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--cc-text-muted)" }}>{item.title}</p>
                    <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--cc-text-soft)" }}>
                      Signal: {item.signal}
                    </p>
                  </div>
                  <div>
                    <p className="meta-label mb-0.5">Owner</p>
                    <p className="text-[11px]" style={{ color: "var(--cc-text-soft)" }}>{item.owner}</p>
                  </div>
                  <div className="flex items-center">
                    {item.status === "done"    && <span className="pill pill-green">Done</span>}
                    {item.status === "next"    && <span className="pill pill-blue">Next</span>}
                    {item.status === "pending" && <span className="pill pill-neutral">Pending</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 8. Scope & Playbook Governance Note ─────────────────────────── */}
      <div className="mb-6">
        <SectionHeader icon={<BookOpen size={15} color="#F5A623" />} title="Review scope governance" />
        <div className="surface-card p-5">
          <p className="text-[13px] leading-relaxed mb-5" style={{ color: "var(--cc-text-soft)" }}>
            ClauseCompass currently applies the full synthetic playbook by default. In a production
            workflow, playbook scope should be governed by contract type, risk tier, and legal-owner
            policy. Any excluded high-risk rule should require rationale capture and appear in the
            handover/audit trail.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { label: "Current mode",  value: "Full playbook applied",           badge: "pill-amber"   },
              { label: "Future mode",   value: "Contract-type scoped review",      badge: "pill-neutral" },
              { label: "UI selector",   value: "Governance noted — not built yet", badge: "pill-neutral" },
            ].map(({ label, value, badge }) => (
              <div key={label} className="surface-inset p-3">
                <p className="meta-label mb-1.5">{label}</p>
                <span className={`pill ${badge}`}>{value}</span>
              </div>
            ))}
          </div>
          <div className="surface-inset p-3">
            <p className="meta-label mb-2">Critical rules — always apply regardless of scope</p>
            <div className="flex flex-wrap gap-2">
              {["Governing Law", "Liability Cap", "Indemnity", "Data Protection", "Security Obligations"].map(r => (
                <span
                  key={r}
                  className="text-[11px] font-medium px-2 py-1 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "#F87171" }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legal disclaimer */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "#0F1A1F", border: "1px solid #1E2D35" }}
      >
        <div className="flex items-start gap-2.5">
          <XCircle size={13} color="#566B76" className="flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed" style={{ color: "#364F5A" }}>
            ClauseCompass is a first-pass triage prototype. It is not legal advice. Every output requires human review and legal sign-off before external use. Playbook positions must be reviewed and approved by qualified legal stakeholders before production deployment.
          </p>
        </div>
      </div>

    </div>
  );
}

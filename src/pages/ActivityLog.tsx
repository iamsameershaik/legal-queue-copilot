import { Contract, Review, HumanDecision, PlaybookRule } from "../types";
import { RiskBadge } from "../components/RiskBadge";
import {
  AlertTriangle, BookOpen,
  FileText, ClipboardCheck, Rocket, Cpu,
} from "lucide-react";

interface ActivityLogProps {
  contracts:      Contract[];
  reviews:        Review[];
  humanDecisions: HumanDecision[];
  playbookRules:  PlaybookRule[];
}

const READINESS: { label: string; status: "done" | "partial" | "pending" | "ready"; sub: string }[] = [
  { label: "Prototype workflow",              status: "done",    sub: "All 6 pages, mock engine" },
  { label: "Playbook seed",                   status: "done",    sub: "10 standard rules" },
  { label: "Eval suite",                      status: "partial", sub: "8 synthetic cases · 87.5%" },
  { label: "Real LLM integration",            status: "pending", sub: "Edge Function stub ready" },
  { label: "Historical contract validation",  status: "pending", sub: "Requires 30–50 contracts" },
  { label: "Legal sign-off on playbook",      status: "pending", sub: "Not yet reviewed" },
  { label: "Deployment",                      status: "ready",   sub: "Netlify-ready, build passes" },
];

const READINESS_SCORE = 72;

const WEEK_TWO = [
  { n: 1, title: "Shadow real legal reviews",          sub: "Sit with 3–5 lawyers reviewing routine contracts. Map current workflow and edge cases the prototype doesn't handle." },
  { n: 2, title: "Replace synthetic playbook",         sub: "Replace illustrative rules with positions reviewed and approved by qualified counsel." },
  { n: 3, title: "DOCX/PDF parsing + Word export",     sub: "Add file parsing via Edge Function. Export redlines as .docx with tracked changes — the expected output format." },
  { n: 4, title: "Evaluate against historical data",   sub: "Run against 30–50 historical contracts. False negative rate is the primary quality metric." },
  { n: 5, title: "Measure time saved",                 sub: "Simple timer study with the legal team. Quantify the baseline vs. AI-assisted first-pass time." },
  { n: 6, title: "Legal intake integration",           sub: "Connect email triage, Slack workflow, or legal ticketing system." },
  { n: 7, title: "Adoption guide + feedback loop",     sub: "Short guide for the legal team. Structured way to flag AI errors and improve the playbook." },
];

const STATUS_ICON_MAP: Record<string, React.CSSProperties> = {
  done:    { background: "rgba(22,199,132,0.1)",  color: "#16C784" },
  partial: { background: "rgba(245,158,11,0.1)",  color: "#F5A623" },
  pending: { background: "rgba(143,163,174,0.06)", color: "#566B76" },
  ready:   { background: "rgba(96,165,250,0.1)",  color: "#60A5FA" },
};
const STATUS_LABEL: Record<string, string> = { done: "Complete", partial: "Initial", pending: "Not yet", ready: "Ready" };

const SEEDED_EVENTS = [
  { id: "e1", ts: "Today, 10:31", actor: "System",          type: "system",   label: "Eval suite run",                sub: "8 test cases · 87.5% pass rate",              risk: undefined    },
  { id: "e2", ts: "Today, 10:28", actor: "AI reviewer",     type: "review",   label: "First-pass review completed",   sub: "Enterprise SaaS — CloudBase Corp · Red",       risk: "Red" as const },
  { id: "e3", ts: "Today, 10:25", actor: "Legal reviewer",  type: "decision", label: "Finding escalated",             sub: "Unlimited liability · CloudBase Corp",          risk: undefined    },
  { id: "e4", ts: "Today, 09:54", actor: "AI reviewer",     type: "review",   label: "First-pass review completed",   sub: "Partner NDA — MediaGroup plc · Amber",          risk: "Amber" as const },
  { id: "e5", ts: "Today, 09:51", actor: "Legal reviewer",  type: "decision", label: "Redline suggestion copied",     sub: "Publicity rights · MediaGroup plc",             risk: undefined    },
  { id: "e6", ts: "Today, 09:48", actor: "Legal reviewer",  type: "decision", label: "Finding accepted",              sub: "Governing law · TechCorp Inc",                  risk: undefined    },
  { id: "e7", ts: "Yesterday",    actor: "Playbook admin",  type: "playbook", label: "Playbook rule updated",         sub: "Payment Terms — escalation trigger tightened", risk: undefined    },
  { id: "e8", ts: "Yesterday",    actor: "AI reviewer",     type: "review",   label: "First-pass review completed",   sub: "SaaS Order Form — DataSoft Solutions · Amber",  risk: "Amber" as const },
];

const ACTOR_COLORS: Record<string, string> = {
  "AI reviewer":    "#16C784",
  "Legal reviewer": "#60A5FA",
  "Playbook admin": "#A78BFA",
  "System":         "#566B76",
};

function eventIcon(type: string) {
  const size = 11;
  if (type === "review")   return <Cpu size={size} color="#16C784" />;
  if (type === "decision") return <ClipboardCheck size={size} color="#60A5FA" />;
  if (type === "playbook") return <BookOpen size={size} color="#A78BFA" />;
  if (type === "system")   return <FileText size={size} color="#566B76" />;
  return <AlertTriangle size={size} color="#F56565" />;
}

export default function ActivityLog({ contracts, reviews, humanDecisions, playbookRules }: ActivityLogProps) {
  type LE = { id: string; ts: string; actor: string; type: string; label: string; sub?: string; risk?: Review["riskLevel"] };

  const liveEvents: LE[] = [
    ...reviews.map(r => {
      const c = contracts.find(x => x.id === r.contractId);
      return { id: `r-${r.id}`, ts: new Date(r.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), actor: "AI reviewer", type: "review", label: "First-pass review completed", sub: `${c?.title ?? "Unknown"} · ${r.findings.length} findings`, risk: r.riskLevel };
    }),
    ...humanDecisions.map(d => {
      const r = reviews.find(x => x.id === d.reviewId);
      const c = r ? contracts.find(x => x.id === r.contractId) : undefined;
      return { id: `d-${d.id}`, ts: new Date(d.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), actor: "Legal reviewer", type: "decision", label: `Finding ${d.decision.toLowerCase()}`, sub: c?.title };
    }),
  ].sort((a, b) => b.ts.localeCompare(a.ts));

  const events = liveEvents.length > 0 ? liveEvents : SEEDED_EVENTS.map(e => ({ ...e }));

  const statsRow = [
    { label: "Reviews run",    value: reviews.length || SEEDED_EVENTS.filter(e => e.type === "review").length },
    { label: "Decisions made", value: humanDecisions.length },
    { label: "Escalations",    value: contracts.filter(c => c.status === "Escalated").length || 1 },
    { label: "Playbook rules", value: playbookRules.length },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="page-title mb-1">Handover</h1>
        <p className="body-text">Launch readiness, activity trail, and week two plan.</p>
      </div>

      {/* Readiness score hero */}
      <div
        className="surface-card p-6 mb-6"
        style={{ borderColor: "rgba(96,165,250,0.2)" }}
      >
        <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
          <div className="flex-shrink-0">
            <p className="meta-label mb-2">Handover readiness</p>
            <p className="text-5xl font-bold text-[#E8EFF2] leading-none">{READINESS_SCORE}<span className="text-2xl text-[#566B76] ml-1">%</span></p>
            <p className="text-[12px] text-[#566B76] mt-2">Prototype stage · not production-ready</p>
          </div>
          <div className="hidden sm:block divider self-stretch" style={{ width: "1px", height: "auto" }} />
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {READINESS.map(item => (
              <div key={item.label} className="flex items-start gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-bold"
                  style={STATUS_ICON_MAP[item.status]}
                >
                  {item.status === "done" ? "✓" : item.status === "ready" ? "✓" : item.status === "partial" ? "~" : "○"}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-[#C8D8DF]">{item.label}</p>
                  <p className="text-[11px] text-[#566B76]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsRow.map(({ label, value }) => (
          <div key={label} className="surface-card p-4 text-center">
            <p className="text-[22px] font-bold text-[#E8EFF2]">{value}</p>
            <p className="meta-label mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 mb-8">
        {/* Activity trail */}
        <div className="min-w-0">
          <h2 className="section-title mb-4">Activity trail</h2>
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
                    <p className="text-[12px] font-semibold text-[#C8D8DF]">{e.label}</p>
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{ background: "#131F25", color: ACTOR_COLORS[e.actor] ?? "#566B76" }}
                    >
                      {e.actor}
                    </span>
                  </div>
                  {e.sub && <p className="text-[11px] text-[#566B76] mt-0.5 truncate">{e.sub}</p>}
                  <p className="text-[10px] text-[#364F5A] mt-0.5">{e.ts}</p>
                </div>
                {e.risk && <RiskBadge level={e.risk} size="sm" />}
              </div>
            ))}
          </div>
        </div>

        {/* Deployment checklist */}
        <div>
          <h2 className="section-title mb-4">Deployment checklist</h2>
          <div className="surface-card overflow-hidden">
            {READINESS.map((item, i) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < READINESS.length - 1 ? "1px solid #0F1A1F" : "none" }}
              >
                <div>
                  <p className="text-[12px] font-medium text-[#8FA3AE]">{item.label}</p>
                  <p className="text-[10px] text-[#364F5A] mt-0.5">{item.sub}</p>
                </div>
                <span
                  className="pill flex-shrink-0 ml-2"
                  style={STATUS_ICON_MAP[item.status]}
                >
                  {STATUS_LABEL[item.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Week two plan */}
      <div className="surface-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Rocket size={15} color="#16C784" />
          <h2 className="section-title">What I would do in week two</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WEEK_TWO.map(item => (
            <div
              key={item.n}
              className="surface-raised rounded-xl p-4"
              style={{ transition: "background 120ms" }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(22,199,132,0.1)", border: "1px solid rgba(22,199,132,0.2)", color: "#16C784" }}
                >
                  {item.n}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-[#C8D8DF] mb-1">{item.title}</p>
                  <p className="text-[11px] text-[#566B76] leading-relaxed">{item.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

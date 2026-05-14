import { EvalTest } from "../types";
import { RiskBadge } from "../components/RiskBadge";
import { CheckCircle, XCircle, MinusCircle, AlertTriangle } from "lucide-react";

interface EvaluationProps {
  evalTests: EvalTest[];
}

function PassBadge({ v }: { v: EvalTest["passFail"] }) {
  if (v === "Pass")    return <span className="pill pill-green"><CheckCircle size={9} /> Pass</span>;
  if (v === "Fail")    return <span className="pill pill-red"><XCircle size={9} /> Fail</span>;
  return <span className="pill pill-amber"><MinusCircle size={9} /> Partial</span>;
}

export default function Evaluation({ evalTests }: EvaluationProps) {
  const total    = evalTests.length;
  const pass     = evalTests.filter(t => t.passFail === "Pass").length;
  const partial  = evalTests.filter(t => t.passFail === "Partial").length;
  const fail     = evalTests.filter(t => t.passFail === "Fail").length;
  const passRate = total > 0 ? ((pass / total) * 100).toFixed(1) : "0";

  const riskOk   = evalTests.filter(t => t.actualRiskLevel === t.expectedRiskLevel).length;
  const riskAcc  = total > 0 ? ((riskOk / total) * 100).toFixed(1) : "0";

  const issHits  = evalTests.reduce((a, t) => a + t.detectedIssues.filter(i => t.expectedIssues.includes(i)).length, 0);
  const issTotal = evalTests.reduce((a, t) => a + t.expectedIssues.length, 0);
  const issAcc   = issTotal > 0 ? Math.round((issHits / issTotal) * 100) : 100;

  const fp = evalTests.reduce((a, t) => a + t.detectedIssues.filter(i => !t.expectedIssues.includes(i)).length, 0);
  const fn = evalTests.reduce((a, t) => a + t.expectedIssues.filter(i => !t.detectedIssues.includes(i)).length, 0);

  const metrics = [
    { label: "Eval pass rate",        value: `${passRate}%`,  sub: `${pass} pass · ${partial} partial · ${fail} fail`, accent: true  },
    { label: "Risk routing accuracy", value: `${riskAcc}%`,   sub: `${riskOk}/${total} correct routes`               , accent: false },
    { label: "Issue detection",       value: `${issAcc}%`,    sub: `${issHits}/${issTotal} expected issues found`     , accent: false },
    { label: "False positives",       value: String(fp),       sub: "Unexpected flags raised"                         , accent: false },
    { label: "False negatives",       value: String(fn),       sub: "Expected issues missed"                          , accent: fn > 0 },
    { label: "Partial passes",        value: String(partial),  sub: "Require calibration"                             , accent: false },
  ];

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="page-title mb-1">Evaluation</h1>
        <p className="body-text">Initial eval suite across {total} synthetic legal scenarios.</p>
      </div>

      {/* Primary safety metric */}
      <div
        className="rounded-xl px-5 py-4 mb-6 flex items-start gap-3"
        style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.18)" }}
      >
        <AlertTriangle size={14} color="#F56565" className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-[#F87171] mb-1">Primary safety metric: false negatives</p>
          <p className="text-[12px] text-[#8FA3AE] leading-relaxed">
            False negatives: <strong className="text-[#F56565]">{fn}</strong> across {total} scenarios.
            Missing a material legal issue is more dangerous than over-escalating a routine contract.
            Current count is within acceptable range for a v0 deterministic engine.
          </p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.map(({ label, value, sub, accent }) => (
          <div key={label} className="surface-card p-5">
            <p className="meta-label mb-2">{label}</p>
            <p className={`text-2xl font-bold tracking-tight ${accent ? (label.includes("negative") ? "text-[#F56565]" : "text-[#16C784]") : "text-[#E8EFF2]"}`}>{value}</p>
            <p className="text-[11px] text-[#566B76] mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Context note */}
      <div
        className="rounded-xl px-4 py-3 mb-6"
        style={{ background: "#0F1A1F", border: "1px solid #1E2D35" }}
      >
        <p className="text-[12px] text-[#566B76] leading-relaxed">
          Eval tests use synthetic contracts covering common risk patterns. The deterministic engine performs well on explicit signals but misses absent or paraphrased clauses. A production eval set of 30–50 labelled historical contracts is required before deployment.
        </p>
      </div>

      {/* Test cases table */}
      <div className="surface-card overflow-hidden mb-6">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #131F25" }}>
          <h2 className="section-title">Test Cases</h2>
        </div>

        <div className="overflow-x-auto">
          <div style={{ minWidth: "680px" }}>
            {/* Table header */}
            <div
              className="grid text-[11px] font-semibold text-[#566B76] uppercase tracking-wider px-5 py-2.5"
              style={{ gridTemplateColumns: "1fr 96px 110px 1fr 72px 180px", borderBottom: "1px solid #131F25" }}
            >
              <span>Scenario</span>
              <span>Type</span>
              <span>Risk Route</span>
              <span>Issues</span>
              <span>Result</span>
              <span>Notes</span>
            </div>

            {evalTests.map((t, i) => (
              <div
                key={t.id}
                className="grid px-5 py-4"
                style={{
                  gridTemplateColumns: "1fr 96px 110px 1fr 72px 180px",
                  borderBottom: i < evalTests.length - 1 ? "1px solid #0F1A1F" : "none",
                  alignItems: "start",
                }}
              >
                {/* Scenario */}
                <div className="pr-4">
                  <p className="text-[13px] font-medium text-[#C8D8DF] leading-snug">{t.title}</p>
                  <p className="text-[11px] text-[#566B76] mt-1 leading-relaxed line-clamp-2">{t.scenario}</p>
                </div>

                {/* Type */}
                <div className="pr-3">
                  <p className="text-[11px] text-[#8FA3AE] leading-relaxed">{t.contractType.replace("Customer Order Form", "Order Form")}</p>
                </div>

                {/* Risk Route — Expected + Actual stacked */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-6.5">
                    <span className="text-[10px] text-[#566B76] w-[44px] flex-shrink-0">Expected</span>
                    <RiskBadge level={t.expectedRiskLevel} size="sm" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#566B76] w-[44px] flex-shrink-0">Actual</span>
                    <RiskBadge level={t.actualRiskLevel} size="sm" />
                    {t.actualRiskLevel !== t.expectedRiskLevel && (
                      <span className="text-[10px] text-[#F5A623] font-bold">↕</span>
                    )}
                  </div>
                </div>

                {/* Issues */}
                <div className="pr-4">
                  <p className="text-[11px] text-[#8FA3AE] leading-relaxed">
                    {t.expectedIssues.length > 0 ? t.expectedIssues.join(", ") : "None"}
                  </p>
                  {t.detectedIssues.length > 0 && (
                    <p className="text-[11px] text-[#566B76] mt-1 leading-relaxed">
                      Found: {t.detectedIssues.join(", ")}
                    </p>
                  )}
                </div>

                {/* Result */}
                <div>
                  <PassBadge v={t.passFail} />
                </div>

                {/* Notes */}
                <p
                  className={`text-[11px] leading-relaxed ${t.passFail === "Pass" ? "text-[#364F5A]" : "text-[#8FA3AE]"}`}
                  title={t.notes}
                >
                  {t.notes.slice(0, 120)}{t.notes.length > 120 ? "…" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Production eval plan */}
      <div className="surface-card p-5 mb-4">
        <h2 className="section-title mb-4">Production eval plan</h2>
        <div className="space-y-3">
          {[
            "Run parallel review against 30–50 historical contracts — compare AI route vs. lawyer route",
            "Track false negatives by clause type — identify which patterns need regex or LLM improvement",
            "Track time saved by contract type to validate the primary business hypothesis",
            "Use lawyer decisions to tune playbook rules and recalibrate severity levels",
            "Require legal sign-off before any autonomous routing change goes live",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(22,199,132,0.1)", border: "1px solid rgba(22,199,132,0.2)", color: "#16C784" }}
              >
                {i + 1}
              </span>
              <p className="text-[13px] text-[#8FA3AE] leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div
        className="rounded-xl p-4"
        style={{ background: "#0F1A1F", border: "1px solid #1E2D35" }}
      >
        <p className="meta-label mb-2">Evaluation limitations</p>
        <ul className="space-y-1.5">
          {[
            "Synthetic contracts — real-world drafting variance may differ significantly",
            "Regex matching cannot detect absent clauses (e.g. missing survival clause = false negative)",
            "Severity levels are assigned by pattern definition, not calibrated on lawyer decisions",
            "Suggested redline quality not yet evaluated by qualified counsel",
          ].map((l, i) => (
            <li key={i} className="text-[12px] text-[#566B76] flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">·</span> {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { Upload, Loader2, Zap, AlertCircle, ChevronRight, Check } from "lucide-react";
import { Contract, ContractType, Urgency } from "../types";
import {
  sampleStandardNDA, sampleRiskyNDA, sampleOrderForm,
  sampleEnterpriseOrderForm, samplePartnerNDA,
} from "../data/sampleContracts";

let _cid = 1;
function newId() { return `contract-${Date.now()}-${_cid++}`; }

interface NewReviewProps {
  onSubmit: (contract: Contract) => Promise<void>;
  isProcessing: boolean;
}

const SAMPLES = [
  { key: "standard-nda",   label: "Standard NDA",   risk: "green" as const,  title: "Mutual NDA — Supplier Co Ltd",        counterparty: "Supplier Co Ltd",    type: "Mutual NDA" as ContractType,         urgency: "Low" as Urgency,    context: "Early-stage partnership discussions. Standard mutual NDA.", text: sampleStandardNDA },
  { key: "risky-nda",      label: "Risky NDA",       risk: "red" as const,    title: "NDA — TechCorp Inc",                  counterparty: "TechCorp Inc",        type: "Mutual NDA" as ContractType,         urgency: "Medium" as Urgency, context: "US vendor-proposed NDA. Sent by counterparty.", text: sampleRiskyNDA },
  { key: "order-form",     label: "Order Form",      risk: "amber" as const,  title: "SaaS Order Form — DataSoft Solutions",counterparty: "DataSoft Solutions",  type: "Customer Order Form" as ContractType,urgency: "High" as Urgency,   context: "Annual analytics platform subscription.", text: sampleOrderForm },
  { key: "enterprise",     label: "Enterprise SaaS", risk: "red" as const,    title: "Enterprise SaaS — CloudBase Corp",    counterparty: "CloudBase Corp",      type: "Customer Order Form" as ContractType,urgency: "High" as Urgency,   context: "Large cloud infrastructure deal. Vendor-drafted.", text: sampleEnterpriseOrderForm },
  { key: "partner-nda",    label: "Partner NDA",     risk: "amber" as const,  title: "Partner NDA — MediaGroup plc",        counterparty: "MediaGroup plc",      type: "Mutual NDA" as ContractType,         urgency: "Low" as Urgency,    context: "Co-marketing partnership. Drafted by MediaGroup.", text: samplePartnerNDA },
];

const RISK_DOT: Record<string, string> = { green: "#16C784", amber: "#F5A623", red: "#F56565" };

const REVIEW_STEPS = [
  { n: 1, label: "Intake",          sub: "Contract text and metadata" },
  { n: 2, label: "Playbook match",  sub: "10 clause rules applied" },
  { n: 3, label: "Risk route",      sub: "Green / Amber / Red" },
  { n: 4, label: "Human decision",  sub: "Accept / Edit / Escalate" },
  { n: 5, label: "Handover trail",  sub: "Decisions logged" },
];

export default function NewReview({ onSubmit, isProcessing }: NewReviewProps) {
  const [title, setTitle] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [contractType, setContractType] = useState<ContractType>("Mutual NDA");
  const [urgency, setUrgency] = useState<Urgency>("Low");
  const [context, setContext] = useState("");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

  function loadSample(s: typeof SAMPLES[0]) {
    setTitle(s.title); setCounterparty(s.counterparty); setContractType(s.type);
    setUrgency(s.urgency); setContext(s.context); setText(s.text);
    setFileName(undefined); setError(null); setActiveStep(1);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["txt", "md"].includes(f.name.split(".").pop()?.toLowerCase() ?? "")) {
      setError("Only .txt and .md files supported. Paste contract text for other formats.");
      return;
    }
    setText(await f.text());
    setFileName(f.name);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Please enter a contract title."); return; }
    if (!counterparty.trim()) { setError("Please enter the counterparty name."); return; }
    if (!text.trim()) { setError("Please paste the contract text."); return; }
    setError(null); setActiveStep(2);
    await onSubmit({ id: newId(), title: title.trim(), counterparty: counterparty.trim(), contractType, urgency, commercialContext: context.trim(), contractText: text.trim(), fileName, status: "Draft", createdAt: new Date().toISOString() });
  }

  const inputCls = "input-field text-sm";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="page-title mb-1">Start first-pass review</h1>
        <p className="body-text">Submit a contract for AI triage against the legal playbook.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        {/* Left: form */}
        <div className="min-w-0">
          {/* Sample selector */}
          <div className="surface-card p-4 mb-4">
            <p className="meta-label mb-3">Load sample contract</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLES.map(s => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => loadSample(s)}
                  className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: text === s.text ? "#16C78420" : "#131F25",
                    border: `1px solid ${text === s.text ? "#16C78440" : "#1E2D35"}`,
                    color: text === s.text ? "#16C784" : "#8FA3AE",
                  }}
                >
                  {text === s.text && <Check size={10} />}
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: RISK_DOT[s.risk] }}
                  />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="surface-card p-5 mb-4">
            <p className="meta-label mb-4">Contract details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="meta-label mb-1.5 block">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Mutual NDA — Acme Vendor" className={inputCls} />
              </div>
              <div>
                <label className="meta-label mb-1.5 block">Counterparty</label>
                <input value={counterparty} onChange={e => setCounterparty(e.target.value)} placeholder="e.g. TechCorp Inc" className={inputCls} />
              </div>
              <div>
                <label className="meta-label mb-1.5 block">Contract type</label>
                <select value={contractType} onChange={e => setContractType(e.target.value as ContractType)} className={inputCls} style={{ cursor: "pointer" }}>
                  {(["Mutual NDA", "Customer Order Form", "Other"] as ContractType[]).map(t => (
                    <option key={t} value={t} style={{ background: "#080D10" }}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="meta-label mb-1.5 block">Urgency</label>
                <select value={urgency} onChange={e => setUrgency(e.target.value as Urgency)} className={inputCls} style={{ cursor: "pointer" }}>
                  {(["Low", "Medium", "High"] as Urgency[]).map(u => (
                    <option key={u} value={u} style={{ background: "#080D10" }}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="meta-label mb-1.5 block">Commercial context</label>
              <textarea value={context} onChange={e => setContext(e.target.value)} rows={2} placeholder="Brief context: what is this contract for, any known risks?" className={inputCls} style={{ resize: "none" }} />
            </div>
          </div>

          {/* Contract text */}
          <div className="surface-card overflow-hidden mb-4">
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid #131F25" }}
            >
              <div className="flex items-center gap-3">
                <p className="meta-label">Contract text</p>
                <span className="pill pill-green text-[10px]">Primary input</span>
              </div>
              <div className="flex items-center gap-2">
                {text && (
                  <span className="text-[11px] text-[#566B76]">
                    {text.split(/\s+/).filter(Boolean).length} words
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-[#566B76] hover:text-[#8FA3AE] transition-colors"
                >
                  <Upload size={11} /> Upload .txt / .md
                </button>
                {fileName && <span className="text-[11px] text-[#16C784]">{fileName}</span>}
                <input ref={fileRef} type="file" accept=".txt,.md" onChange={handleFile} className="hidden" />
              </div>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={20}
              placeholder="Paste the full contract text here…"
              className="w-full outline-none resize-y px-5 py-4"
              style={{
                background: "#060B0E",
                color: "#B8CDD6",
                fontFamily: "'SF Mono','Fira Code','Cascadia Code',monospace",
                fontSize: "12.5px",
                lineHeight: "1.65",
                minHeight: "380px",
                maxWidth: "100%",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 text-[13px] rounded-xl px-4 py-3 mb-4"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171" }}
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => { setTitle(""); setCounterparty(""); setContractType("Mutual NDA"); setUrgency("Low"); setContext(""); setText(""); setFileName(undefined); setError(null); }}
              className="text-[13px] text-[#566B76] hover:text-[#8FA3AE] transition-colors"
            >
              Clear form
            </button>
            <button onClick={handleSubmit} disabled={isProcessing} className="btn-primary">
              {isProcessing
                ? <><Loader2 size={13} className="animate-spin" /> Running review…</>
                : <><Zap size={13} /> Run first-pass review</>}
            </button>
          </div>
        </div>

        {/* Right: review path + coverage + safety */}
        <div className="space-y-4">
          {/* Review path */}
          <div className="surface-card p-5">
            <p className="meta-label mb-4">Review path</p>
            <div>
              {REVIEW_STEPS.map((step, i) => {
                const isActive = step.n === activeStep;
                const isPast   = step.n < activeStep;
                return (
                  <div key={step.n} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{
                          background: isActive ? "#16C784" : isPast ? "#0E9060" : "#131F25",
                          color: isActive || isPast ? "#040D09" : "#566B76",
                          border: isActive ? "none" : "1px solid #1E2D35",
                        }}
                      >
                        {isPast ? "✓" : step.n}
                      </div>
                      {i < REVIEW_STEPS.length - 1 && (
                        <div className="w-px my-1 flex-1" style={{ background: isPast ? "#0E9060" : "#1E2D35", minHeight: "12px" }} />
                      )}
                    </div>
                    <div className="pb-3.5">
                      <p className={`text-[13px] font-semibold ${isActive ? "text-[#16C784]" : isPast ? "text-[#8FA3AE]" : "text-[#566B76]"}`}>{step.label}</p>
                      <p className="text-[11px] text-[#364F5A] mt-0.5">{step.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Playbook coverage */}
          <div className="surface-card p-5">
            <p className="meta-label mb-3">Playbook coverage</p>
            <div className="space-y-2">
              {[
                "Governing Law", "Liability Cap", "Indemnity", "Auto-Renewal",
                "Data Protection", "Publicity Rights", "Assignment", "Payment Terms",
              ].map(label => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[12px] text-[#8FA3AE]">{label}</span>
                  <span className="pill pill-green text-[10px]">Covered</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#566B76]">+ 2 more rules</span>
                <ChevronRight size={11} className="text-[#364F5A]" />
              </div>
            </div>
          </div>

          {/* Safety note */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "#0F1A1F", border: "1px solid #1E2D35" }}
          >
            <div className="flex gap-2 mb-1.5">
              <AlertCircle size={12} className="text-[#F5A623] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-[#F5A623]">Important</p>
            </div>
            <p className="text-[11px] text-[#566B76] leading-relaxed">
              This is first-pass triage, not legal advice. Human approval is required before any external redline is sent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { PlaybookRule } from "../types";

interface PlaybookProps {
  rules: PlaybookRule[];
  onAdd:    (rule: Omit<PlaybookRule, "id">) => void;
  onUpdate: (rule: PlaybookRule) => void;
  onDelete: (id: string) => void;
}

const EMPTY: Omit<PlaybookRule, "id"> = {
  clauseType: "", preferredPosition: "", acceptableFallback: "",
  escalationTrigger: "", suggestedFallbackWording: "", rationale: "",
};

// Coverage matrix
const CT = ["Mutual NDA", "Order Form", "Other"];
const CLAUSES = ["Governing Law", "Liability", "Indemnity", "Confidentiality", "Data Protection", "Renewal", "Publicity", "Assignment"];
const COV: Record<string, Record<string, "full" | "partial" | "none">> = {
  "Governing Law":   { "Mutual NDA": "full",    "Order Form": "full",    "Other": "partial" },
  "Liability":       { "Mutual NDA": "full",    "Order Form": "full",    "Other": "partial" },
  "Indemnity":       { "Mutual NDA": "full",    "Order Form": "full",    "Other": "none"    },
  "Confidentiality": { "Mutual NDA": "full",    "Order Form": "partial", "Other": "partial" },
  "Data Protection": { "Mutual NDA": "partial", "Order Form": "full",    "Other": "partial" },
  "Renewal":         { "Mutual NDA": "none",    "Order Form": "full",    "Other": "partial" },
  "Publicity":       { "Mutual NDA": "full",    "Order Form": "partial", "Other": "none"    },
  "Assignment":      { "Mutual NDA": "full",    "Order Form": "full",    "Other": "partial" },
};

function CovBadge({ status }: { status: "full" | "partial" | "none" }) {
  if (status === "full")    return <span className="pill pill-green text-[10px]">Covered</span>;
  if (status === "partial") return <span className="pill pill-amber text-[10px]">Partial</span>;
  return <span className="pill pill-neutral text-[10px]">—</span>;
}

function RuleForm({ initial, onSave, onCancel }: {
  initial: Omit<PlaybookRule, "id">;
  onSave: (r: Omit<PlaybookRule, "id">) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState(initial);
  const fields: { key: keyof typeof EMPTY; label: string; multi?: boolean }[] = [
    { key: "clauseType",            label: "Clause Type" },
    { key: "preferredPosition",     label: "Preferred Position",      multi: true },
    { key: "acceptableFallback",    label: "Acceptable Fallback",     multi: true },
    { key: "escalationTrigger",     label: "Escalation Trigger",      multi: true },
    { key: "suggestedFallbackWording", label: "Suggested Fallback Wording", multi: true },
    { key: "rationale",             label: "Rationale",               multi: true },
  ];
  return (
    <div className="surface-card p-5 space-y-3">
      {fields.map(({ key, label, multi }) => (
        <div key={key}>
          <label className="meta-label mb-1.5 block">{label}</label>
          {multi ? (
            <textarea rows={2} value={f[key]} onChange={e => setF(p => ({ ...p, [key]: e.target.value }))} className="input-field text-[13px] resize-none" />
          ) : (
            <input type="text" value={f[key]} onChange={e => setF(p => ({ ...p, [key]: e.target.value }))} className="input-field text-[13px]" />
          )}
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(f)} disabled={!f.clauseType.trim()} className="btn-primary text-[12px] px-4 py-1.5 rounded-lg disabled:opacity-40"><Save size={11} /> Save rule</button>
        <button onClick={onCancel} className="btn-ghost text-[12px] px-4 py-1.5 rounded-lg"><X size={11} /> Cancel</button>
      </div>
    </div>
  );
}

function RuleRow({ rule, onEdit, onDelete }: { rule: PlaybookRule; onEdit: () => void; onDelete: () => void }) {
  const [exp, setExp] = useState(false);
  return (
    <div className="surface-card overflow-hidden mb-2">
      <div
        className="accordion-header rounded-none border-0"
        style={{ borderRadius: 0 }}
        onClick={() => setExp(e => !e)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(22,199,132,0.1)" }}>
            <ShieldCheck size={12} color="#16C784" />
          </div>
          <div className="min-w-0">
            <p className="card-title">{rule.clauseType}</p>
            <p className="text-[11px] text-[#566B76] truncate max-w-md">{rule.preferredPosition}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
          <button onClick={e => { e.stopPropagation(); onEdit(); }} className="btn-ghost p-1.5 rounded-lg"><Edit2 size={12} /></button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="btn-ghost p-1.5 rounded-lg" style={{ color: "#F56565" }}><Trash2 size={12} /></button>
          <span className="text-[#566B76] ml-1">{exp ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</span>
        </div>
      </div>
      {exp && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-3" style={{ borderTop: "1px solid #131F25" }}>
          {[
            { label: "Preferred Position",  content: rule.preferredPosition },
            { label: "Acceptable Fallback",  content: rule.acceptableFallback },
            { label: "Escalation Trigger",   content: rule.escalationTrigger },
            { label: "Rationale",            content: rule.rationale },
          ].map(({ label, content }) => (
            <div key={label} className="pt-4">
              <p className="meta-label mb-1.5">{label}</p>
              <p className="text-[12px] text-[#8FA3AE] leading-relaxed">{content}</p>
            </div>
          ))}
          <div className="col-span-2 pt-3">
            <p className="meta-label mb-2" style={{ color: "#16C784" }}>Suggested fallback wording</p>
            <div className="code-block">{rule.suggestedFallbackWording}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Playbook({ rules, onAdd, onUpdate, onDelete }: PlaybookProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [delId, setDelId]  = useState<string | null>(null);

  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title mb-1">Playbook</h1>
          <p className="body-text">Policy control centre — AI applies the playbook; lawyers own the policy.</p>
        </div>
        {!showAdd && (
          <button onClick={() => setShowAdd(true)} className="btn-secondary flex-shrink-0">
            <Plus size={13} /> Add rule
          </button>
        )}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Rules configured",       value: rules.length    },
          { label: "Contract types covered",  value: 3               },
          { label: "High-risk triggers",      value: 4               },
          { label: "Legal owner",             value: "Unassigned"    },
        ].map(({ label, value }) => (
          <div key={label} className="surface-card p-4">
            <p className="meta-label mb-1">{label}</p>
            <p className="text-[18px] font-bold text-[#E8EFF2]">{value}</p>
          </div>
        ))}
      </div>

      {/* Ownership notice */}
      <div
        className="rounded-xl px-4 py-3 mb-6 flex gap-2"
        style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)" }}
      >
        <ShieldCheck size={13} color="#60A5FA" className="flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-[#60A5FA] leading-relaxed opacity-80">
          In production, this playbook is reviewed and owned by Legal. Changes should go through a legal sign-off workflow before going live.
        </p>
      </div>

      {/* Coverage matrix */}
      <div className="surface-card overflow-hidden mb-6">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #131F25" }}>
          <h2 className="section-title">Coverage Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #131F25" }}>
                <th className="text-left px-5 py-3 meta-label">Clause</th>
                {CT.map(ct => <th key={ct} className="text-center px-4 py-3 meta-label">{ct}</th>)}
              </tr>
            </thead>
            <tbody>
              {CLAUSES.map((clause, i) => (
                <tr key={clause} style={{ borderBottom: i < CLAUSES.length - 1 ? "1px solid #0F1A1F" : "none" }}>
                  <td className="px-5 py-3 text-[13px] text-[#8FA3AE] font-medium">{clause}</td>
                  {CT.map(ct => (
                    <td key={ct} className="px-4 py-3 text-center">
                      <CovBadge status={COV[clause]?.[ct] ?? "none"} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-4">
          <p className="meta-label mb-2">New rule</p>
          <RuleForm initial={EMPTY} onSave={r => { onAdd(r); setShowAdd(false); }} onCancel={() => setShowAdd(false)} />
        </div>
      )}

      {/* Rules list */}
      <h2 className="section-title mb-3">Rules <span className="text-[#566B76] font-normal">({rules.length})</span></h2>
      <div>
        {rules.map(rule =>
          editId === rule.id ? (
            <div key={rule.id} className="mb-2">
              <p className="meta-label mb-2">Editing: {rule.clauseType}</p>
              <RuleForm
                initial={rule}
                onSave={r => { onUpdate({ ...r, id: rule.id }); setEditId(null); }}
                onCancel={() => setEditId(null)}
              />
            </div>
          ) : delId === rule.id ? (
            <div
              key={rule.id}
              className="rounded-xl p-4 flex items-center justify-between gap-4 mb-2"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <p className="text-[13px] text-[#F87171]">Delete <strong>{rule.clauseType}</strong>?</p>
              <div className="flex gap-2">
                <button onClick={() => { onDelete(rule.id); setDelId(null); }} className="btn-ghost text-[12px] px-3 py-1.5" style={{ color: "#F56565", borderColor: "rgba(239,68,68,0.3)" }}>Delete</button>
                <button onClick={() => setDelId(null)} className="btn-ghost text-[12px] px-3 py-1.5">Cancel</button>
              </div>
            </div>
          ) : (
            <RuleRow key={rule.id} rule={rule} onEdit={() => setEditId(rule.id)} onDelete={() => setDelId(rule.id)} />
          )
        )}
      </div>
    </div>
  );
}

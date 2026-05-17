import { FileText, BookOpen, Scale, Cpu, ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle, Minus } from "lucide-react";
import { useState } from "react";
import type {
  ReviewCitation,
  FindingProvenance,
  AuthorityStatus,
  LegalReferenceStatus,
  EvidenceStrength,
  CitationSourceType,
} from "../types";

interface CitationPanelProps {
  citations?: ReviewCitation[];
  requiresLegalReference?: boolean;
  legalReferenceStatus?: LegalReferenceStatus;
  authorityStatus?: AuthorityStatus;
  provenance?: FindingProvenance;
}

const SOURCE_CONFIG: Record<
  CitationSourceType,
  { label: string; icon: React.ElementType; chipClass: string }
> = {
  contract: {
    label: "Contract",
    icon: FileText,
    chipClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  playbook: {
    label: "Playbook",
    icon: BookOpen,
    chipClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "legal-reference": {
    label: "Legal Ref",
    icon: Scale,
    chipClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  system: {
    label: "System",
    icon: Cpu,
    chipClass: "bg-[var(--cc-surface-raised)] text-[var(--cc-text-soft)] border-[var(--cc-border)]",
  },
};

const STRENGTH_CONFIG: Record<
  EvidenceStrength,
  { label: string; icon: React.ElementType; className: string }
> = {
  direct: {
    label: "Direct",
    icon: CheckCircle,
    className: "text-emerald-600",
  },
  inferred: {
    label: "Inferred",
    icon: HelpCircle,
    className: "text-amber-500",
  },
  missing: {
    label: "Missing",
    icon: Minus,
    className: "text-red-500",
  },
  ambiguous: {
    label: "Ambiguous",
    icon: AlertCircle,
    className: "text-[var(--cc-text-soft)]",
  },
};

const AUTHORITY_LABELS: Record<AuthorityStatus, { text: string; className: string }> = {
  "contract-grounded": { text: "Contract-grounded", className: "pill-green" },
  "playbook-grounded": { text: "Playbook-grounded", className: "pill-green" },
  "external-authority-required": { text: "External authority required", className: "pill-red" },
  "external-authority-not-added": {
    text: "External authority not added",
    className: "pill-amber",
  },
  "external-authority-curated": { text: "External authority curated", className: "pill-green" },
};

function CitationChip({ citation }: { citation: ReviewCitation }) {
  const [expanded, setExpanded] = useState(false);
  const src = SOURCE_CONFIG[citation.sourceType];
  const Icon = src.icon;
  const strength = citation.evidenceStrength
    ? STRENGTH_CONFIG[citation.evidenceStrength]
    : null;
  const StrengthIcon = strength?.icon;

  return (
    <div className="border border-[var(--cc-border)] rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--cc-surface-raised)] transition-colors"
      >
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${src.chipClass}`}
        >
          <Icon size={11} />
          {src.label}
        </span>
        <span className="flex-1 text-xs text-[var(--cc-text)] truncate">{citation.title}</span>
        {strength && StrengthIcon && (
          <span className={`flex items-center gap-1 text-xs font-medium ${strength.className}`}>
            <StrengthIcon size={12} />
            {strength.label}
          </span>
        )}
        {expanded ? (
          <ChevronUp size={13} className="text-[var(--cc-text-soft)] shrink-0" />
        ) : (
          <ChevronDown size={13} className="text-[var(--cc-text-soft)] shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-[var(--cc-border)] bg-[var(--cc-surface-raised)] space-y-2">
          {citation.excerpt && (
            <blockquote className="text-xs text-[var(--cc-text-soft)] border-l-2 border-[var(--cc-border)] pl-2 italic leading-relaxed">
              {citation.excerpt}
            </blockquote>
          )}
          {citation.location && (
            <p className="text-xs text-[var(--cc-text-soft)]">
              <span className="font-medium text-[var(--cc-text)]">Location:</span>{" "}
              {citation.location}
            </p>
          )}
          {citation.label && (
            <p className="text-xs text-[var(--cc-text-soft)]">
              <span className="font-medium text-[var(--cc-text)]">Reference:</span>{" "}
              {citation.label}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function CitationPanel({
  citations,
  requiresLegalReference,
  legalReferenceStatus,
  authorityStatus,
  provenance,
}: CitationPanelProps) {
  const [provenanceOpen, setProvenanceOpen] = useState(false);

  const hasCitations = citations && citations.length > 0;
  const hasProvenance = !!provenance;
  const hasAuthority = !!authorityStatus;
  const hasAnything = hasCitations || hasProvenance || hasAuthority;

  if (!hasAnything) return null;

  const authorityInfo = authorityStatus ? AUTHORITY_LABELS[authorityStatus] : null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="meta-label">Evidence</span>
        {authorityInfo && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${authorityInfo.className}`}>
            {authorityInfo.text}
          </span>
        )}
        {requiresLegalReference && legalReferenceStatus === "not-added" && (
          <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
            <AlertCircle size={11} />
            Legal citation pending
          </span>
        )}
      </div>

      {hasCitations && (
        <div className="space-y-1.5">
          {citations!.map((c) => (
            <CitationChip key={c.id} citation={c} />
          ))}
        </div>
      )}

      {hasProvenance && (
        <div className="border border-[var(--cc-border)] rounded-lg overflow-hidden">
          <button
            onClick={() => setProvenanceOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--cc-surface-raised)] transition-colors"
          >
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium bg-[var(--cc-surface-raised)] text-[var(--cc-text-soft)] border-[var(--cc-border)]">
              <Cpu size={11} />
              Provenance
            </span>
            <span className="flex-1 text-xs text-[var(--cc-text-soft)] truncate">
              {provenance!.ruleName}
            </span>
            <span className="text-xs text-[var(--cc-text-soft)]">{provenance!.detectionType}</span>
            {provenanceOpen ? (
              <ChevronUp size={13} className="text-[var(--cc-text-soft)] shrink-0" />
            ) : (
              <ChevronDown size={13} className="text-[var(--cc-text-soft)] shrink-0" />
            )}
          </button>

          {provenanceOpen && (
            <div className="px-3 pb-3 pt-1 border-t border-[var(--cc-border)] bg-[var(--cc-surface-raised)] space-y-2">
              <p className="text-xs text-[var(--cc-text-soft)]">
                <span className="font-medium text-[var(--cc-text)]">Rule ID:</span>{" "}
                {provenance!.ruleId}
              </p>
              <p className="text-xs text-[var(--cc-text-soft)]">
                <span className="font-medium text-[var(--cc-text)]">Detector:</span>{" "}
                {provenance!.detector}
              </p>
              {provenance!.matchedSignals.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[var(--cc-text)] mb-1">Matched signals:</p>
                  <div className="flex flex-wrap gap-1">
                    {provenance!.matchedSignals.map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-[var(--cc-surface)] border border-[var(--cc-border)] rounded px-1.5 py-0.5 text-[var(--cc-text-soft)] font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

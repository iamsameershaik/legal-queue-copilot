import { RiskLevel, Severity } from "../types";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
}

const DOT_COLOR: Record<RiskLevel, string> = {
  Green: "#16C784",
  Amber: "#F5A623",
  Red:   "#F56565",
};

export function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const cls = {
    sm: "pill text-[10px] px-2 py-0.5",
    md: "pill",
    lg: "pill text-[13px] px-3 py-1",
  }[size];

  const variant = { Green: "pill-green", Amber: "pill-amber", Red: "pill-red" }[level];

  return (
    <span className={`${cls} ${variant}`}>
      <span
        className="rounded-full flex-shrink-0"
        style={{ width: 5, height: 5, background: DOT_COLOR[level], display: "inline-block" }}
      />
      {level}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: Severity;
  size?: "sm" | "md";
}

export function SeverityBadge({ severity, size = "md" }: SeverityBadgeProps) {
  const variant = {
    Low:    "pill-neutral",
    Medium: "pill-amber",
    High:   "pill-red",
  }[severity];
  const cls = size === "sm" ? "pill text-[10px] px-2 py-0.5" : "pill";
  return <span className={`${cls} ${variant}`}>{severity}</span>;
}

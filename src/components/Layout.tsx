import { useState } from "react";
import {
  LayoutDashboard, FilePlus, FileText, BookOpen,
  FlaskConical, ClipboardList, Scale, Menu, X, ChevronsLeft, ChevronsRight,
} from "lucide-react";

export type Page =
  | "dashboard"
  | "new-review"
  | "review-results"
  | "playbook"
  | "evaluation"
  | "activity-log";

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  reviewResultsAvailable: boolean;
}

const NAV_ITEMS: {
  id: Page;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "dashboard",      label: "Command Centre",  icon: LayoutDashboard },
  { id: "new-review",     label: "New Review",      icon: FilePlus },
  { id: "review-results", label: "Review Results",  icon: FileText },
  { id: "playbook",       label: "Playbook",        icon: BookOpen },
  { id: "evaluation",     label: "Evaluation",      icon: FlaskConical },
  { id: "activity-log",   label: "Handover",        icon: ClipboardList },
];

export default function Layout({ currentPage, onNavigate, children, reviewResultsAvailable }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function navigate(page: Page) {
    onNavigate(page);
    setMobileOpen(false);
  }

  /* ── Expanded sidebar content ───────────────────────────────────────── */
  const expandedNav = (
    <>
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid #1E2D35" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#16C784" }}
          >
            <Scale size={13} color="#040D09" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#E8EFF2] leading-tight">ClauseCompass</p>
            <p className="text-[11px] text-[#566B76] leading-tight mt-0.5">First-pass legal triage</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = currentPage === id;
          const isDisabled = id === "review-results" && !reviewResultsAvailable;
          return (
            <button
              key={id}
              onClick={() => !isDisabled && navigate(id)}
              disabled={isDisabled}
              className={isActive ? "nav-item-active" : "nav-item"}
              style={isDisabled ? { opacity: 0.3, cursor: "not-allowed" } : {}}
            >
              <Icon size={15} className="flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-4 pt-3 flex-shrink-0" style={{ borderTop: "1px solid #1E2D35" }}>
        <div
          className="pill pill-neutral mb-3"
          style={{ fontSize: "10px", display: "inline-flex" }}
        >
          Demo mode
        </div>
        <p className="text-[11px] text-[#364F5A] leading-relaxed">
          Human approval required before any external redline is sent.
        </p>
      </div>
    </>
  );

  /* ── Collapsed (icon-only) sidebar content ──────────────────────────── */
  const collapsedNav = (
    <>
      {/* Brand icon only */}
      <div className="py-5 flex-shrink-0 flex justify-center" style={{ borderBottom: "1px solid #1E2D35" }}>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "#16C784" }}
        >
          <Scale size={13} color="#040D09" strokeWidth={2.5} />
        </div>
      </div>

      {/* Nav — icons only */}
      <nav className="flex-1 flex flex-col items-center py-3 gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, icon: Icon }) => {
          const isActive = currentPage === id;
          const isDisabled = id === "review-results" && !reviewResultsAvailable;
          return (
            <button
              key={id}
              onClick={() => !isDisabled && navigate(id)}
              disabled={isDisabled}
              title={NAV_ITEMS.find(n => n.id === id)?.label}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background: isActive ? "rgba(22,199,132,0.12)" : "transparent",
                color: isActive ? "#16C784" : "#566B76",
                opacity: isDisabled ? 0.3 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            >
              <Icon size={15} />
            </button>
          );
        })}
      </nav>

      {/* Footer spacer */}
      <div className="pb-4 pt-3 flex-shrink-0" style={{ borderTop: "1px solid #1E2D35" }} />
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080D10" }}>

      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col h-full flex-shrink-0 relative overflow-hidden"
        style={{
          width: collapsed ? "72px" : "252px",
          background: "#0A1114",
          borderRight: "1px solid #1E2D35",
          transition: "width 180ms ease",
        }}
      >
        {collapsed ? collapsedNav : expandedNav}

        {/* Collapse / expand toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute bottom-16 flex items-center justify-center rounded-lg transition-colors"
          style={{
            right: collapsed ? "50%" : "12px",
            transform: collapsed ? "translateX(50%)" : "none",
            width: "24px",
            height: "24px",
            background: "#131F25",
            border: "1px solid #1E2D35",
            color: "#566B76",
          }}
        >
          {collapsed
            ? <ChevronsRight size={12} />
            : <ChevronsLeft size={12} />}
        </button>
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────────── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{ background: "#0A1114", borderBottom: "1px solid #1E2D35" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#16C784" }}>
            <Scale size={11} color="#040D09" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-semibold text-[#E8EFF2]">ClauseCompass</p>
        </div>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="w-8 h-8 flex items-center justify-center rounded-lg"
          style={{ background: "#131F25", color: "#8FA3AE" }}
        >
          {mobileOpen ? <X size={15} /> : <Menu size={15} />}
        </button>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-20"
          onClick={() => setMobileOpen(false)}
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <aside
            className="flex flex-col h-full w-64"
            style={{ background: "#0A1114", borderRight: "1px solid #1E2D35" }}
            onClick={e => e.stopPropagation()}
          >
            {expandedNav}
          </aside>
        </div>
      )}

      {/* ── Workspace ────────────────────────────────────────────────────── */}
      <main
        className="flex-1 min-w-0 w-full overflow-y-auto overflow-x-hidden md:pt-0 pt-[52px]"
        style={{ background: "#080D10" }}
      >
        {children}
      </main>
    </div>
  );
}

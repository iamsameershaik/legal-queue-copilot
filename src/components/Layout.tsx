import { useState } from "react";
import {
  LayoutDashboard, FilePlus, FileText, BookOpen,
  FlaskConical, ClipboardList, Scale, Menu, X, ChevronsLeft, ChevronsRight,
  type LucideIcon,
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
  icon: LucideIcon;
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
      <div
        className="px-5 pt-5 pb-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(142,182,155,0.12)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #16C784 0%, #0BDA51 100%)",
              boxShadow: "0 0 12px rgba(22,199,132,0.30)",
            }}
          >
            <Scale size={14} color="#031314" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-700 text-[#F2FFF7] leading-tight font-semibold">ClauseCompass</p>
            <p className="text-[10.5px] leading-tight mt-0.5" style={{ color: "#7E948A" }}>Legal triage copilot</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = currentPage === id;
          const isDisabled = id === "review-results" && !reviewResultsAvailable;
          return (
            <button
              key={id}
              onClick={() => !isDisabled && navigate(id)}
              disabled={isDisabled}
              aria-label={label}
              className={isActive ? "nav-item-active" : "nav-item"}
              style={isDisabled ? { opacity: 0.28, cursor: "not-allowed" } : {}}
            >
              <Icon size={14} className="flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-4 pb-4 pt-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(142,182,155,0.10)" }}
      >
        <div
          className="pill pill-neutral mb-3"
          style={{ fontSize: "10px", display: "inline-flex" }}
        >
          Demo mode
        </div>
        <p className="text-[10.5px] leading-relaxed" style={{ color: "rgba(126,148,138,0.65)" }}>
          Human approval required before any external redline is sent.
        </p>
      </div>
    </>
  );

  /* ── Collapsed (icon-only) sidebar content ──────────────────────────── */
  const collapsedNav = (
    <>
      {/* Brand icon only */}
      <div
        className="py-5 flex-shrink-0 flex justify-center"
        style={{ borderBottom: "1px solid rgba(142,182,155,0.12)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #16C784 0%, #0BDA51 100%)",
            boxShadow: "0 0 12px rgba(22,199,132,0.28)",
          }}
        >
          <Scale size={14} color="#031314" strokeWidth={2.5} />
        </div>
      </div>

      {/* Nav — icons only */}
      <nav className="flex-1 flex flex-col items-center py-3 gap-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const isActive = currentPage === id;
          const isDisabled = id === "review-results" && !reviewResultsAvailable;
          return (
            <button
              key={id}
              onClick={() => !isDisabled && navigate(id)}
              disabled={isDisabled}
              title={label}
              aria-label={label}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all relative"
              style={{
                background: isActive ? "rgba(22,199,132,0.12)" : "transparent",
                color: isActive ? "#16C784" : "#7E948A",
                opacity: isDisabled ? 0.28 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
                boxShadow: isActive ? "inset 0 1px 0 rgba(218,241,222,0.08)" : "none",
              }}
            >
              <Icon size={14} />
              {/* Right-edge indicator on collapsed active item */}
              {isActive && (
                <span
                  className="absolute right-0 top-2 bottom-2 rounded-l"
                  style={{
                    width: 3,
                    background: "linear-gradient(180deg, #20F29C, #16C784)",
                    boxShadow: "0 0 6px rgba(22,199,132,0.5)",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer spacer */}
      <div
        className="pb-4 pt-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(142,182,155,0.10)" }}
      />
    </>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--cc-bg-deep)" }}
    >
      {/* ── Cinematic app background glow ────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            radial-gradient(ellipse 60% 40% at 70% 0%, rgba(11,43,38,0.55) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 100% 20%, rgba(22,199,132,0.07) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col h-full flex-shrink-0 relative z-10 overflow-hidden"
        style={{
          width: collapsed ? "72px" : "248px",
          background: "linear-gradient(180deg, #0B2B26 0%, #051F20 100%)",
          borderRight: "1px solid rgba(142,182,155,0.12)",
          transition: "width 180ms ease",
          boxShadow: "2px 0 24px rgba(3,19,20,0.5)",
        }}
      >
        {collapsed ? collapsedNav : expandedNav}

        {/* Collapse / expand toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute bottom-[72px] flex items-center justify-center rounded-lg transition-colors"
          style={{
            right: collapsed ? "50%" : "12px",
            transform: collapsed ? "translateX(50%)" : "none",
            width: "22px",
            height: "22px",
            background: "rgba(11,43,38,0.9)",
            border: "1px solid rgba(142,182,155,0.18)",
            color: "#7E948A",
          }}
        >
          {collapsed
            ? <ChevronsRight size={11} />
            : <ChevronsLeft size={11} />}
        </button>
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────────────── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(5,31,32,0.95)",
          borderBottom: "1px solid rgba(142,182,155,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #16C784 0%, #0BDA51 100%)" }}
          >
            <Scale size={11} color="#031314" strokeWidth={2.5} />
          </div>
          <p className="text-[13px] font-semibold" style={{ color: "#F2FFF7" }}>ClauseCompass</p>
        </div>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="w-8 h-8 flex items-center justify-center rounded-lg"
          style={{ background: "rgba(11,43,38,0.8)", color: "#7E948A", border: "1px solid rgba(142,182,155,0.14)" }}
        >
          {mobileOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-20"
          onClick={() => setMobileOpen(false)}
          style={{ background: "rgba(3,19,20,0.72)", backdropFilter: "blur(4px)" }}
        >
          <aside
            className="flex flex-col h-full w-64"
            style={{
              background: "linear-gradient(180deg, #0B2B26 0%, #051F20 100%)",
              borderRight: "1px solid rgba(142,182,155,0.12)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {expandedNav}
          </aside>
        </div>
      )}

      {/* ── Workspace ────────────────────────────────────────────────────── */}
      <main
        className="flex-1 min-w-0 w-full overflow-y-auto overflow-x-hidden md:pt-0 pt-[52px] relative z-10"
        style={{ background: "var(--cc-bg-deep)" }}
      >
        {children}
      </main>
    </div>
  );
}

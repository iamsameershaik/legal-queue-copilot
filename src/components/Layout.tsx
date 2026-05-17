import { useState } from "react";
import {
  LayoutDashboard, FilePlus, FileText, BookOpen,
  FlaskConical, ClipboardList, Code2, Menu, X, ChevronsLeft, ChevronsRight,
  type LucideIcon,
} from "lucide-react";
import BrandMark from "./BrandMark";

export type Page =
  | "dashboard"
  | "new-review"
  | "review-results"
  | "playbook"
  | "evaluation"
  | "activity-log"
  | "builder-notes";

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
  reviewResultsAvailable: boolean;
}

const NAV_ITEMS: { id: Page; label: string; icon: LucideIcon }[] = [
  { id: "dashboard",      label: "Command Centre", icon: LayoutDashboard },
  { id: "new-review",     label: "New Review",     icon: FilePlus        },
  { id: "review-results", label: "Review Results", icon: FileText        },
  { id: "playbook",       label: "Playbook",       icon: BookOpen        },
  { id: "evaluation",     label: "Evaluation",     icon: FlaskConical    },
  { id: "activity-log",   label: "Handover",       icon: ClipboardList   },
  { id: "builder-notes",  label: "Builder Notes",  icon: Code2           },
];

/* Sidebar content — single tree used for both desktop and mobile drawer.
   `collapsed` only applies on desktop; mobile drawer is always expanded. */
function SidebarContent({
  currentPage,
  onNavigate,
  reviewResultsAvailable,
  collapsed = false,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  reviewResultsAvailable: boolean;
  collapsed?: boolean;
}) {
  return (
    <>
      {/* Brand */}
      <div
        className="flex-shrink-0 flex items-center px-3 pt-4 pb-3.5"
        style={{
          borderBottom: "1px solid rgba(142,182,155,0.12)",
          gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "gap 180ms ease, justify-content 180ms ease",
        }}
      >
        <div
          className="flex-shrink-0"
          style={{ filter: "drop-shadow(0 0 8px rgba(22,199,132,0.28))" }}
        >
          <BrandMark size={28} />
        </div>

        {/* Label — fades and clips horizontally */}
        <div
          aria-hidden={collapsed}
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            maxWidth: collapsed ? 0 : 160,
            opacity: collapsed ? 0 : 1,
            transition: "max-width 180ms ease, opacity 140ms ease",
            pointerEvents: collapsed ? "none" : "auto",
          }}
        >
          <p className="text-[13px] font-semibold leading-tight" style={{ color: "#F2FFF7" }}>
            ClauseCompass
          </p>
          <p className="text-[10px] leading-tight mt-0.5" style={{ color: "#7E948A" }}>
            Legal triage copilot
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 py-3 overflow-y-auto"
        style={{ padding: "12px 8px" }}
      >
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive   = currentPage === id;
          const isDisabled = id === "review-results" && !reviewResultsAvailable;

          return (
            <button
              key={id}
              onClick={() => !isDisabled && onNavigate(id)}
              disabled={isDisabled}
              title={collapsed ? label : undefined}
              aria-label={label}
              className="relative flex items-center w-full rounded-lg mb-0.5"
              style={{
                height: 36,
                gap: 10,
                /* Keep icon centred when collapsed by padding symmetrically */
                padding: collapsed ? "0 11px" : "0 10px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: isActive ? "rgba(22,199,132,0.09)" : "transparent",
                color: isActive ? "#16C784" : "#7E948A",
                boxShadow: isActive ? "inset 0 1px 0 rgba(218,241,222,0.08)" : "none",
                opacity: isDisabled ? 0.28 : 1,
                cursor: isDisabled ? "not-allowed" : "pointer",
                border: "none",
                fontWeight: isActive ? 600 : 500,
                fontSize: 13,
                transition: "background 120ms, color 120ms, padding 180ms ease",
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(11,43,38,0.8)";
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {/* Icon — always in a fixed-width container so it never shifts */}
              <span className="flex-shrink-0 flex items-center justify-center" style={{ width: 16 }}>
                <Icon size={14} />
              </span>

              {/* Label — fades and clips */}
              <span
                aria-hidden={collapsed}
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: collapsed ? 0 : 180,
                  opacity: collapsed ? 0 : 1,
                  transition: "max-width 180ms ease, opacity 140ms ease",
                  flex: 1,
                  textAlign: "left",
                  pointerEvents: "none",
                }}
              >
                {label}
              </span>

              {/* Right-edge active gradient bar — always rendered, fades when inactive */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: 0,
                  top: 6,
                  bottom: 6,
                  width: 3,
                  borderRadius: "3px 0 0 3px",
                  background: "linear-gradient(180deg, #20F29C, #16C784)",
                  boxShadow: "0 0 8px rgba(22,199,132,0.5)",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 140ms ease",
                  pointerEvents: "none",
                }}
              />
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="flex-shrink-0 px-3 pb-4 pt-3"
        style={{
          borderTop: "1px solid rgba(142,182,155,0.10)",
          overflow: "hidden",
          maxHeight: collapsed ? 0 : 100,
          opacity: collapsed ? 0 : 1,
          transition: "max-height 180ms ease, opacity 140ms ease",
          pointerEvents: collapsed ? "none" : "auto",
        }}
      >
        <div className="pill pill-neutral mb-2" style={{ fontSize: "10px", display: "inline-flex" }}>
          Demo mode
        </div>
        <p className="text-[10.5px] leading-relaxed" style={{ color: "rgba(126,148,138,0.65)" }}>
          Human approval required before any external redline is sent.
        </p>
      </div>
    </>
  );
}

export default function Layout({ currentPage, onNavigate, children, reviewResultsAvailable }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed]   = useState(false);

  function navigate(page: Page) {
    onNavigate(page);
    setMobileOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--cc-bg-deep)" }}>

      {/* ── Cinematic background glow ────────────────────────────────────── */}
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
          width: collapsed ? "60px" : "248px",
          background: "linear-gradient(180deg, #0B2B26 0%, #051F20 100%)",
          borderRight: "1px solid rgba(142,182,155,0.12)",
          transition: "width 180ms ease",
          boxShadow: "2px 0 24px rgba(3,19,20,0.5)",
        }}
      >
        <SidebarContent
          currentPage={currentPage}
          onNavigate={navigate}
          reviewResultsAvailable={reviewResultsAvailable}
          collapsed={collapsed}
        />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute bottom-[86px] flex items-center justify-center rounded-lg"
          style={{
            right: "50%",
            transform: "translateX(50%)",
            width: 22,
            height: 22,
            background: "rgba(11,43,38,0.9)",
            border: "1px solid rgba(142,182,155,0.18)",
            color: "#7E948A",
            transition: "background 120ms",
            cursor: "pointer",
          }}
        >
          {collapsed ? <ChevronsRight size={11} /> : <ChevronsLeft size={11} />}
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
          <BrandMark size={22} />
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
            {/* Mobile drawer is always expanded */}
            <SidebarContent
              currentPage={currentPage}
              onNavigate={navigate}
              reviewResultsAvailable={reviewResultsAvailable}
              collapsed={false}
            />
          </aside>
        </div>
      )}

      {/* ── Workspace ────────────────────────────────────────────────────── */}
      <main
        className="flex-1 min-w-0 w-full overflow-y-auto overflow-x-hidden md:pt-0 pt-[52px] relative z-10 cc-workspace-bg"
        style={{ background: "var(--cc-bg-deep)" }}
      >
        {children}
      </main>
    </div>
  );
}

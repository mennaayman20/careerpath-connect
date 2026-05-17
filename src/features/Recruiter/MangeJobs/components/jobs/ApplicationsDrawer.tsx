"use client";

import React, { useEffect, useState } from "react";
import { X, Download, Upload, Users, MessageSquare } from "lucide-react";
import { useApplications } from "../../hooks/useApplications";
import { ApplicationResponse, ApplicationStatus, JobResponse } from "../../types/recruiter.types";
import { ApplicantDetailModal } from "../applicant/ApplicantDetailModal";
import { RecruiterChatPage } from "../../../recruiter-chat/components/RecruiterChatPage";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES: ApplicationStatus[] = [
  "SUBMITTED", "UNDER_REVIEW", "SHORTLISTED",
  "INTERVIEW", "OFFERED", "HIRED", "REJECTED", "WITHDRAWN",
];

const STATUS_CONFIG: Record<ApplicationStatus, { color: string; bg: string; border: string }> = {
  SUBMITTED:    { color: "#64748b",  bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)" },
  UNDER_REVIEW: { color: "#2D236A",  bg: "rgba(45,35,106,0.08)",   border: "rgba(45,35,106,0.2)"   },
  SHORTLISTED:  { color: "#7c3aed",  bg: "rgba(124,58,237,0.08)",  border: "rgba(124,58,237,0.2)"  },
  INTERVIEW:    { color: "#d97706",  bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)"  },
  OFFERED:      { color: "#0891b2",  bg: "rgba(8,145,178,0.08)",   border: "rgba(8,145,178,0.2)"   },
  HIRED:        { color: "#1ca37b",  bg: "rgba(28,163,123,0.08)",  border: "rgba(28,163,123,0.2)"  },
  REJECTED:     { color: "#ef4444",  bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)"   },
  WITHDRAWN:    { color: "#94a3b8",  bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" },
};

type DrawerTab = "applications" | "chat";

// ─── Main Drawer ──────────────────────────────────────────────────────────────

interface Props {
  job: JobResponse;
  onClose: () => void;
}

export const ApplicationsDrawer: React.FC<Props> = ({ job, onClose }) => {
  const {
    applications, pagination, activeStatus, loading,
    statusUpdating, exporting, exportTask,
    fetchApplications, filterByStatus, updateStatus,
    startExport, downloadExport, goToPage,
  } = useApplications(job.id);

  const [selectedApp, setSelectedApp] = useState<ApplicationResponse | null>(null);
  const [activeTab, setActiveTab] = useState<DrawerTab>("applications");

  useEffect(() => { fetchApplications(0); }, [fetchApplications]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1a1540]/40 backdrop-blur-sm z-40"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{ width: "min(700px, 95vw)", background: "#f6f5ff" }}
      >
        {/* Top accent bar */}
        <div className="h-[4px] bg-[#2D236A] shrink-0" />

        {/* ── Header ── */}
        <div className="shrink-0 px-7 py-5 border-b border-[#2D236A]/8 bg-white/80 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1ca37b]/10 border border-[#1ca37b]/25 text-[#1ca37b] text-[9px] font-bold uppercase tracking-[0.15em] rounded-full px-3 py-1 mb-2 font-syne">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] animate-pulse" />
                {activeTab === "applications" ? "Applications" : "AI Chat"}
              </div>
              <h2 className="font-syne text-lg font-extrabold text-[#1a1540] mb-0.5">
                {job.title}
              </h2>
              <p className="text-[13px] text-[#2D236A]/45 font-medium">
                {pagination.totalElements} applicants
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Export buttons — only visible on applications tab */}
              {activeTab === "applications" && (
                <>
                  <button
                    onClick={startExport}
                    disabled={exporting}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl font-syne text-[11px] font-bold uppercase tracking-wide border transition-all duration-200"
                    style={{
                      color: "#1ca37b",
                      background: "rgba(28,163,123,0.08)",
                      borderColor: "rgba(28,163,123,0.25)",
                      opacity: exporting ? 0.6 : 1,
                      cursor: exporting ? "not-allowed" : "pointer",
                    }}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {exporting ? "Exporting..." : "Export Excel"}
                  </button>

                  {exportTask?.status === "COMPLETED" && (
                    <button
                      onClick={downloadExport}
                      className="flex items-center gap-2 px-4 py-2 rounded-2xl font-syne text-[11px] font-bold uppercase tracking-wide border transition-all duration-200"
                      style={{
                        color: "#2D236A",
                        background: "rgba(45,35,106,0.06)",
                        borderColor: "rgba(45,35,106,0.2)",
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  )}
                </>
              )}

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-2xl flex items-center justify-center border border-[#2D236A]/12 bg-white text-[#2D236A]/40 hover:text-[#2D236A] hover:bg-[#2D236A]/5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Tab Switcher ── */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#2D236A]/6 border border-[#2D236A]/8 w-fit mb-4">
            <TabButton
              icon={<Users className="w-3.5 h-3.5" />}
              label="Applications"
              active={activeTab === "applications"}
              onClick={() => setActiveTab("applications")}
            />
            <TabButton
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              label="AI Chat"
              active={activeTab === "chat"}
              onClick={() => setActiveTab("chat")}
              accent
            />
          </div>

          {/* Status filter — only on applications tab */}
          {activeTab === "applications" && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <FilterTab label="All" active={activeStatus === null} onClick={() => filterByStatus(null)} />
              {STATUSES.map((s) => (
                <FilterTab
                  key={s}
                  label={s.replace("_", " ")}
                  active={activeStatus === s}
                  color={STATUS_CONFIG[s].color}
                  onClick={() => filterByStatus(s)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "applications" ? (
          <>
            {/* Applications List */}
            <div className="flex-1 overflow-y-auto px-7 py-5">
              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[90px] rounded-3xl bg-white/60 border border-white/70 animate-pulse" />
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                 
                  <p className="font-syne text-[#2D236A]/35 text-sm">No applications found</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {applications.map((app) => (
                    <ApplicationRow
                      key={app.id}
                      app={app}
                      statusUpdating={statusUpdating}
                      onViewDetails={() => setSelectedApp(app)}
                      onUpdateStatus={(newStatus) => updateStatus(app.id, newStatus)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="shrink-0 px-7 py-4 border-t border-[#2D236A]/8 bg-white/60 flex justify-center items-center gap-2">
                <PaginationBtn
                  label="← Prev"
                  disabled={pagination.page === 0}
                  onClick={() => goToPage(pagination.page - 1)}
                />
                <span className="font-syne text-[12px] font-semibold text-[#2D236A]/40 px-3">
                  {pagination.page + 1} / {pagination.totalPages}
                </span>
                <PaginationBtn
                  label="Next →"
                  disabled={pagination.page >= pagination.totalPages - 1}
                  onClick={() => goToPage(pagination.page + 1)}
                />
              </div>
            )}
          </>
        ) : 
        (
          /* ── Chat Tab ── */
          <div className="flex-1 overflow-hidden">
            {/* <RecruiterChatPage defaultJobId={job.id} /> */}
          </div>
        )}
      </div>

      {selectedApp && (
        <ApplicantDetailModal application={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </>
  );
};

// ─── Tab Button ───────────────────────────────────────────────────────────────

const TabButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: boolean;
}> = ({ icon, label, active, onClick, accent }) => {
  const activeColor = accent ? "#1a6b5a" : "#2D236A";
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl font-syne text-[11px] font-bold uppercase tracking-wide transition-all duration-200"
      style={{
        color: active ? activeColor : "rgba(45,35,106,0.4)",
        background: active ? "white" : "transparent",
        boxShadow: active ? "0 2px 8px rgba(45,35,106,0.1)" : "none",
      }}
    >
      {icon}
      {label}
    </button>
  );
};

// ─── Application Row ──────────────────────────────────────────────────────────

const ApplicationRow: React.FC<{
  app: ApplicationResponse;
  statusUpdating: number | null;
  onViewDetails: () => void;
  onUpdateStatus: (status: ApplicationStatus) => void;
}> = ({ app, statusUpdating, onViewDetails, onUpdateStatus }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const sc = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.SUBMITTED;
  const isUpdating = statusUpdating === app.id;

  const matchColor =
    app.matchingRatio == null ? "#94a3b8"
    : app.matchingRatio >= 0.7 ? "#1ca37b"
    : app.matchingRatio >= 0.4 ? "#d97706"
    : "#ef4444";

  return (
    <div
      className="group relative rounded-3xl border border-white/70 transition-all duration-300"
      style={{
        overflow: "visible",
        background: "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.65))",
        boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px -8px rgba(45,35,106,0.12)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(45,35,106,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.03)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.7)";
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: sc.color }} />

      <div className="flex items-center gap-4 px-5 py-4 pl-6">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-syne font-extrabold text-sm"
          style={{
            background: `linear-gradient(135deg, ${sc.color}20, ${sc.color}10)`,
            border: `1.5px solid ${sc.border}`,
            color: sc.color,
          }}
        >
          {app.applicantFullName?.[0]?.toUpperCase() ?? "?"}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-syne text-[14px] font-bold text-[#1a1540] truncate mb-0.5">
            {app.applicantFullName}
          </p>
          <p className="text-[12px] text-[#2D236A]/40 font-medium truncate">
            {app.applicantEmail}
          </p>
          {app.university && (
            <p className="text-[11px] text-[#2D236A]/35 mt-0.5">🎓 {app.university}</p>
          )}
        </div>

        {app.matchingRatio != null && (
          <div className="text-center shrink-0">
            <div className="font-syne text-[16px] font-extrabold" style={{ color: matchColor }}>
              {Math.round(app.matchingRatio * 100)}%
            </div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-[#2D236A]/30 font-syne">match</div>
          </div>
        )}

        <div className="relative shrink-0">
          <button
            onClick={() => setShowStatusMenu((v) => !v)}
            disabled={isUpdating}
            className="font-syne text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border transition-all"
            style={{
              color: sc.color,
              background: sc.bg,
              borderColor: sc.border,
              opacity: isUpdating ? 0.6 : 1,
              cursor: isUpdating ? "not-allowed" : "pointer",
            }}
          >
            {isUpdating ? "..." : app.status.replace("_", " ")}
            {" ▾"}
          </button>

          {showStatusMenu && (
            <div
              className="absolute right-0 z-[60] rounded-2xl border border-[#2D236A]/15"
              style={{
                top: "100%",
                marginTop: "8px",
                minWidth: "180px",
                background: "#ffffff",
                boxShadow: "0 20px 50px -12px rgba(45,35,106,0.22)",
              }}
            >
              {STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const isActiveState = app.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => { setShowStatusMenu(false); onUpdateStatus(s); }}
                    className="w-full text-left px-4 py-3 font-syne text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-[#2D236A]/5 first:rounded-t-2xl last:rounded-b-2xl"
                    style={{
                      color: cfg.color,
                      fontWeight: isActiveState ? "800" : undefined,
                      backgroundColor: isActiveState ? `${cfg.color}10` : undefined,
                    }}
                  >
                    {s.replace("_", " ")}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={onViewDetails}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl font-syne text-[11px] font-bold uppercase tracking-wide border border-[#2D236A]/12 bg-white text-[#2D236A]/50 hover:bg-[#2D236A] hover:text-white hover:border-[#2D236A] transition-all duration-300"
        >
          View →
        </button>
      </div>
    </div>
  );
};

// ─── Filter Tab ───────────────────────────────────────────────────────────────

const FilterTab: React.FC<{
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}> = ({ label, active, color = "#2D236A", onClick }) => (
  <button
    onClick={onClick}
    className="font-syne text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border transition-all duration-200 shrink-0 whitespace-nowrap"
    style={{
      color: active ? color : "#6b7280",
      background: active ? `${color}15` : "#f3f4f6",
      borderColor: active ? `${color}30` : "#e5e7eb",
    }}
  >
    {label}
  </button>
);

// ─── Pagination Button ────────────────────────────────────────────────────────

const PaginationBtn: React.FC<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
}> = ({ label, onClick, disabled }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="px-4 py-2 rounded-xl font-syne text-[12px] font-bold border transition-all"
    style={{
      color: disabled ? "rgba(45,35,106,0.2)" : "#2D236A",
      background: disabled ? "transparent" : "white",
      borderColor: disabled ? "rgba(45,35,106,0.08)" : "rgba(45,35,106,0.15)",
      cursor: disabled ? "not-allowed" : "pointer",
    }}
  >
    {label}
  </button>
);
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, Download, Upload, Users, MessageSquare,
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useApplications } from "../../hooks/useApplications";
import {
  ApplicationResponse,
  ApplicationStatus,
  JobResponse,
} from "../../types/recruiter.types";
import { ApplicantDetailModal } from "../applicant/ApplicantDetailModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import AiButton from '@/components/ui/AiButton';
import { AIChatFAB } from "./Aichatfab";

// ─── Constants ────────────────────────────────────────────────────────────────
const handleCreateInterview = () => {
    console.log("الركروتر ضغط على الزرار! افتحي الـ Modal هنا 🚀");
};

const STATUSES: ApplicationStatus[] = [
  "SUBMITTED", "UNDER_REVIEW", "SHORTLISTED",
  "INTERVIEW", "OFFERED", "HIRED", "REJECTED", "WITHDRAWN",
];

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { color: string; bg: string; border: string; label: string }
> = {
  SUBMITTED:    { color: "#475569", bg: "rgba(71,85,105,0.08)",   border: "rgba(71,85,105,0.20)",   label: "Submitted"    },
  UNDER_REVIEW: { color: "#1d4ed8", bg: "rgba(29,78,216,0.07)",   border: "rgba(29,78,216,0.20)",   label: "Under Review" },
  SHORTLISTED:  { color: "#6d28d9", bg: "rgba(109,40,217,0.07)",  border: "rgba(109,40,217,0.20)",  label: "Shortlisted"  },
  INTERVIEW:    { color: "#b45309", bg: "rgba(180,83,9,0.07)",    border: "rgba(180,83,9,0.20)",    label: "Interview"    },
  OFFERED:      { color: "#0369a1", bg: "rgba(3,105,161,0.07)",   border: "rgba(3,105,161,0.20)",   label: "Offered"      },
  HIRED:        { color: "#047857", bg: "rgba(4,120,87,0.08)",    border: "rgba(4,120,87,0.22)",    label: "Hired"        },
  REJECTED:     { color: "#b91c1c", bg: "rgba(185,28,28,0.08)",   border: "rgba(185,28,28,0.22)",   label: "Rejected"     },
  WITHDRAWN:    { color: "#64748b", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.20)", label: "Withdrawn"    },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  job?: JobResponse;
}

export const ApplicationsPage: React.FC<Props> = ({ job: jobProp }) => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate   = useNavigate();
  const location   = useLocation();
  const routeState = (location.state ?? {}) as { jobTitle?: string };

  const resolvedId = jobProp?.id ?? Number(jobId);

  const {
    applications, pagination, activeStatus, loading,
    statusUpdating, exporting, exportTask,
    fetchApplications, filterByStatus, updateStatus,
    startExport, downloadExport, goToPage,
  } = useApplications(resolvedId);

  const [selectedApp, setSelectedApp] = useState<ApplicationResponse | null>(null);
  const [search, setSearch]           = useState("");

  useEffect(() => { fetchApplications(0); }, [fetchApplications]);

  const visible = search.trim()
    ? applications.filter(
        (a) =>
          a.applicantFullName?.toLowerCase().includes(search.toLowerCase()) ||
          a.applicantEmail?.toLowerCase().includes(search.toLowerCase()),
      )
    : applications;

  const jobTitle = jobProp?.title ?? routeState.jobTitle ?? "Applications";

  return (
    <div className="min-h-screen font-sans bg-[#F8F9FC]">
      <Navbar />
      
      {/* ══ Hero Banner ══════════════════════════════════════════════════════ */}
      <header className="relative overflow-hidden bg-[#2D236A]">
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 py-10">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-white/50 hover:text-white text-[13px] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </button>

          <div className="flex flex-wrap items-end justify-between gap-6">
            {/* Left: Title block */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1ca37b]/15 border border-[#1ca37b]/30 text-[#5de8b8] text-[10px] font-bold uppercase tracking-[0.18em] rounded-full px-3 py-1 mb-3 font-syne">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] animate-pulse" />
                Applicants
              </div>
              <h1 className="font-syne text-2xl md:text-3xl font-extrabold text-white leading-tight mb-1">
                {jobTitle}
              </h1>
              <p className="text-[13px] text-white/70 font-medium">
                {pagination.totalElements} total applicant{pagination.totalElements !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* ── Status Strip ── */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <StatusPill
              label="All"
              count={pagination.totalElements}
              active={activeStatus === null}
              color="#1ca37b"
              onClick={() => filterByStatus(null)}
            />
            {STATUSES.map((s) => {
              const cnt = applications.filter((a) => a.status === s).length;
              return (
                <StatusPill
                  key={s}
                  label={STATUS_CONFIG[s].label}
                  count={cnt}
                  active={activeStatus === s}
                  color={STATUS_CONFIG[s].color}
                  onClick={() => filterByStatus(s)}
                />
              );
            })}
          </div>
        </div>
      </header>

      {/* ══ Toolbar ══════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{ background: "rgba(246,245,255,0.88)", borderColor: "rgba(45,35,106,0.08)" }}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div
            className="flex items-center gap-2 flex-1 max-w-sm px-4 py-2.5 rounded-2xl border"
            style={{ background: "white", borderColor: "rgba(45,35,106,0.12)" }}
          >
            <Search className="w-4 h-4 text-[#2D236A]/30 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="flex-1 text-[13px] bg-transparent outline-none text-[#1a1540] placeholder:text-[#2D236A]/30 font-medium"
            />
          </div>

          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[12px] font-syne font-bold uppercase tracking-wide text-[#2D236A]/50"
            style={{ background: "white", borderColor: "rgba(45,35,106,0.10)" }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {pagination.totalElements} Results
          </div>
        </div>
      </div>

      {/* ══ Main Content Area ═════════════════════════════════════════════════ */}
      <main className="max-w-screen-xl mx-auto px-6 md:px-10 py-8">
        
        {/* ── Excel Feature Row (Placed Clearly Above the Cards Stack) ── */}
        <div className="mb-6 flex items-center justify-between bg-white border border-[#2D236A]/5 p-4 rounded-3xl shadow-[0_4px_20px_rgba(45,35,106,0.02)] flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1ca37b]/10 flex items-center justify-center text-[#1ca37b]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-syne text-[13px] font-extrabold text-[#2D236A] uppercase tracking-wider">Export Applicants Data</h3>
              <p className="text-[11px] text-gray-400 font-medium">Download current filtered list to Microsoft Excel format</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Export Button */}
            <button
              onClick={startExport}
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-syne text-[11px] font-extrabold uppercase tracking-wider border transition-all duration-300 shadow-sm disabled:cursor-not-allowed"
              style={{
                color: "#1ca37b",
                background: "linear-gradient(135deg, rgba(28,163,123,0.08) 0%, rgba(28,163,123,0.15) 100%)",
                borderColor: "rgba(28,163,123,0.25)",
                opacity: exporting ? 0.55 : 1,
              }}
              onMouseEnter={(e) => {
                if (!exporting) {
                  e.currentTarget.style.background = "rgba(28,163,123,0.20)";
                  e.currentTarget.style.borderColor = "rgba(28,163,123,0.45)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!exporting) {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(28,163,123,0.08) 0%, rgba(28,163,123,0.15) 100%)";
                  e.currentTarget.style.borderColor = "rgba(28,163,123,0.25)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              <Upload className={`w-3.5 h-3.5 ${exporting ? 'animate-bounce' : ''}`} />
              <span>{exporting ? "Exporting…" : "Export Excel"}</span>
            </button>

{/* زر التحميل (Download Button) */}
{exportTask?.status === "COMPLETED" && (
  <button
    onClick={downloadExport}
    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-syne text-[11px] font-extrabold uppercase tracking-wider border transition-all duration-300 shadow-md backdrop-blur-sm"
    style={{
      color: "#fff",
      background: "linear-gradient(135deg, #1ca37b 0%, #158061 100%)",
      borderColor: "#1ca37b",
    }}
    onMouseEnter={(e) => {
      // هنا غيرنا الـ Hover لتدرج لوني أغمق سنة بدل اللون المصمت عشان نمنع الوميض الأبيض
      e.currentTarget.style.background = "linear-gradient(135deg, #158061 0%, #0f5c45 100%)";
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(28,163,123,0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "linear-gradient(135deg, #1ca37b 0%, #158061 100%)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <Download className="w-3.5 h-3.5 animate-pulse" />
    <span>Download Ready</span>
  </button>
)}
          </div>
        </div>

        {/* ── Applications Cards Stack ── */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {visible.map((app, idx) => (
              <ApplicationCard
                key={app.id}
                app={app}
                index={idx}
                statusUpdating={statusUpdating}
                onViewDetails={() => setSelectedApp(app)}
                onUpdateStatus={(s) => updateStatus(app.id, s)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && !search.trim() && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <NavBtn
              icon={<ChevronLeft className="w-4 h-4" />}
              disabled={pagination.page === 0}
              onClick={() => goToPage(pagination.page - 1)}
            />
            <span className="font-syne text-[13px] font-semibold text-[#2D236A]/50 px-2">
              Page <span className="text-[#2D236A] font-extrabold">{pagination.page + 1}</span>
              {" "}of{" "}
              <span className="text-[#2D236A] font-extrabold">{pagination.totalPages}</span>
            </span>
            <NavBtn
              icon={<ChevronRight className="w-4 h-4" />}
              disabled={pagination.page >= pagination.totalPages - 1}
              onClick={() => goToPage(pagination.page + 1)}
            />
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedApp && (
        <ApplicantDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

      {/* ══ AI Interview Card Feature ════════════════════════════════════════ */}
      <div className="mx-auto my-8 max-w-2xl overflow-hidden rounded-3xl border border-teal-400/40 bg-white p-8 relative
        shadow-[0_4px_24px_-4px_rgba(28,163,123,0.12),0_1px_4px_rgba(28,163,123,0.06)]
        transition-all duration-500 ease-out
        hover:shadow-[0_16px_48px_-8px_rgba(28,163,123,0.22),0_4px_16px_rgba(28,163,123,0.10)]
        hover:-translate-y-1
        hover:border-teal-400/70">

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-md">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#1ca37b]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#107e5e]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1ca37b]" />
              Live Simulator
            </div>
            <h2 className="font-syne text-xl font-extrabold text-gray-800 leading-snug mb-2">
              AI Voice <span className="text-[#1ca37b]">Interviews</span>
            </h2>
            <p className="text-[13px] leading-relaxed text-gray-500">
              Generate custom job-specific questions, run real-time voice-to-text conversations, and get instant semantic scoring using advanced Cross-Encoder evaluation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-center justify-center gap-3 shrink-0">
            <AiButton onClick={handleCreateInterview} />
          </div>
        </div>
      </div>

      <AIChatFAB 
        jobs={[]} 
        directJobId={resolvedId}
        tooltip="Ask AI about candidates & insights" 
      />

      <Footer />
    </div>
  );
};

// ─── Status Pill ──────────────────────────────────────────────────────────────

const StatusPill: React.FC<{
  label: string;
  count: number;
  active: boolean;
  color?: string;
  onClick: () => void;
}> = ({ label, count, active, color = "#fff", onClick }) => {
  
  // تحديد الألوان بناءً على حالة الزرار (نشط أم لا) لضمان أعلى تباين فوق الخلفية الغامقة
  const buttonStyle = active 
    ? {
        color: "#ffffff",
        background: color, // بياخد اللون الصريح للحالة بدون أي تدرج أو شفافية عشان يظهر بقوة
        borderColor: color,
        boxShadow: `0 4px 14px ${color}40`, // لمسة ضوء خفيفة بلون الحالة
      }
    : {
        color: "rgba(255, 255, 255, 0.85)", // أبيض واضح جداً وليس باهت
        background: "rgba(255, 255, 255, 0.06)",
        borderColor: "rgba(255, 255, 255, 0.25)", // حدود ظاهرة تحدد شكل الزرار
      };

  const countStyle = active
    ? {
        background: "rgba(255, 255, 255, 0.25)",
        color: "#ffffff",
      }
    : {
        background: "rgba(255, 255, 255, 0.12)",
        color: "rgba(255, 255, 255, 0.70)",
      };

  return (
    <button
      onClick={onClick}
      className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold uppercase tracking-[0.12em] font-syne transition-all duration-200 hover:scale-[1.02]"
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.45)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
        }
      }}
    >
      {label}
      {count > 0 && (
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-extrabold min-w-[20px] text-center"
          style={countStyle}
        >
          {count}
        </span>
      )}
    </button>
  );
};

// ─── Application Card ─────────────────────────────────────────────────────────

const ApplicationCard: React.FC<{
  app: ApplicationResponse;
  index: number;
  statusUpdating: number | null;
  onViewDetails: () => void;
  onUpdateStatus: (s: ApplicationStatus) => void;
}> = ({ app, index, statusUpdating, onViewDetails, onUpdateStatus }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const sc        = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.SUBMITTED;
  const isUpdating = statusUpdating === app.id;

  const matchColor =
    app.matchingRatio == null    ? "#94a3b8"
    : app.matchingRatio >= 0.7  ? "#1ca37b"
    : app.matchingRatio >= 0.4  ? "#d97706"
    : "#ef4444";

  const matchLabel =
    app.matchingRatio == null    ? "N/A"
    : app.matchingRatio >= 0.7  ? "Strong"
    : app.matchingRatio >= 0.4  ? "Fair"
    : "Weak";

  const initials = (app.applicantFullName ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={`group relative rounded-3xl border bg-white transition-all duration-300 ${
        menuOpen ? "z-40" : "hover:-translate-y-0.5"
      }`}
      style={{
        borderColor: "rgba(45,35,106,0.10)",
        boxShadow: menuOpen ? "0 10px 30px rgba(45,35,106,0.15)" : "0 2px 12px rgba(0,0,0,0.03)",
        animationDelay: `${index * 40}ms`,
      }}
      onMouseEnter={(e) => {
        if (!menuOpen) {
          (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px -8px rgba(45,35,106,0.13)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,35,106,0.18)";
        }
      }}
      onMouseLeave={(e) => {
        if (!menuOpen) {
          (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.03)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,35,106,0.10)";
        }
      }}
    >
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
        style={{ background: sc.color }}
      />

      <div className="flex items-center gap-4 md:gap-6 px-6 py-5 pl-7">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-syne font-extrabold text-[15px]"
          style={{
            background: `linear-gradient(135deg,${sc.color}22,${sc.color}10)`,
            border: `1.5px solid ${sc.border}`,
            color: sc.color,
          }}
        >
          {initials || "?"}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-syne text-[15px] font-extrabold text-[#1a1540] truncate leading-tight mb-0.5">
            {app.applicantFullName}
          </p>
          <p className="text-[12px] text-[#2D236A]/40 font-medium truncate">
            {app.applicantEmail}
          </p>
          {app.university && (
            <p className="mt-1 text-[11px] text-[#2D236A]/35 font-medium">
              🎓 {app.university}
            </p>
          )}
        </div>

        {/* Match Score */}
        {app.matchingRatio != null && (
          <div className="hidden sm:flex flex-col items-center shrink-0">
            <span className="font-syne text-[22px] font-black leading-none" style={{ color: matchColor }}>
              {Math.round(app.matchingRatio * 100)}
              <span className="text-[13px] font-bold">%</span>
            </span>
            <span
              className="mt-0.5 text-[9px] font-extrabold uppercase tracking-widest font-syne px-2 py-0.5 rounded-full"
              style={{ color: matchColor, background: `${matchColor}18` }}
            >
              {matchLabel}
            </span>
          </div>
        )}

        {/* Status Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            disabled={isUpdating}
            className="font-syne text-[10px] font-bold uppercase tracking-[0.15em] px-3.5 py-2 rounded-full border transition-all duration-200 flex items-center gap-1.5"
            style={{
              color: sc.color,
              background: sc.bg,
              borderColor: sc.border,
              opacity: isUpdating ? 0.55 : 1,
            }}
          >
            {isUpdating ? "…" : sc.label}
            <span className="opacity-50">▾</span>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 z-50 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  top: "calc(100% + 6px)",
                  minWidth: "200px",
                  background: "white",
                  border: "1px solid rgba(45,35,106,0.12)",
                }}
              >
                <div className="px-4 py-2.5 border-b" style={{ borderColor: "rgba(45,35,106,0.07)", background: "rgba(45,35,106,0.02)" }}>
                  <p className="font-syne text-[9px] font-bold uppercase tracking-[0.18em] text-[#2D236A]/35">
                    Change Status
                  </p>
                </div>

                <div className="py-1.5">
                  {STATUSES.map((s) => {
                    const cfg      = STATUS_CONFIG[s];
                    const isActive = app.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => { setMenuOpen(false); onUpdateStatus(s); }}
                        className="w-full text-left px-3 py-2 mx-1.5 transition-all duration-150 flex items-center gap-3 rounded-xl"
                        style={{
                          width: "calc(100% - 12px)",
                          background: isActive ? `${cfg.color}12` : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.background = `${cfg.color}0d`;
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: cfg.color, opacity: isActive ? 1 : 0.5 }}
                        />
                        <span
                          className="font-syne text-[12px] font-bold flex-1"
                          style={{ color: isActive ? cfg.color : "#374151" }}
                        >
                          {cfg.label}
                        </span>
                        {isActive && (
                          <span
                            className="text-[10px] font-extrabold font-syne"
                            style={{ color: cfg.color }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* View Button */}
        <button
          onClick={onViewDetails}
          className="shrink-0 px-5 py-2 rounded-2xl font-syne text-[11px] font-bold uppercase tracking-wide border transition-all duration-300"
          style={{
            color: "#2D236A",
            background: "transparent",
            borderColor: "rgba(45,35,106,0.14)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#2D236A";
            (e.currentTarget as HTMLElement).style.color = "white";
            (e.currentTarget as HTMLElement).style.borderColor = "#2D236A";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#2D236A";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,35,106,0.14)";
          }}
        >
          View →
        </button>
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className="h-[88px] rounded-3xl border border-[#2D236A]/6 bg-white animate-pulse" />
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-28 text-center">
    <p className=" text-[#2D236A]/70 font-bold">No applicants found</p>
    <p className="text-sm text-[#2D236A]/50 mt-1">
      Try clearing your search or selecting a different status.
    </p>
  </div>
);

const NavBtn: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}> = ({ icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
    style={{
      borderColor: disabled ? "rgba(45,35,106,0.08)" : "rgba(45,35,106,0.18)",
      color:       disabled ? "rgba(45,35,106,0.20)" : "#2D236A",
      background:  disabled ? "transparent" : "white",
      cursor:      disabled ? "not-allowed" : "pointer",
      boxShadow:   disabled ? "none" : "0 2px 8px rgba(45,35,106,0.06)",
    }}
  >
    {icon}
  </button>
);
"use client";

import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff, Download, Mail, ExternalLink, GraduationCap, Briefcase, Hash, BarChart2 } from "lucide-react";
import { ApplicationResponse } from "../../types/recruiter.types";
import { useApplicantDetail } from "../../hooks/useApplicantDetail";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isEmail = (value?: string) => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.replace(/^mailto:/i, "").trim());
};

const buildHref = (value: string) => {
  if (isEmail(value)) return `mailto:${value.replace(/^mailto:/i, "").trim()}`;
  if (value.startsWith("http")) return value;
  return `https://${value}`;
};

interface SocialLink { platform: string; url: string; }

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface Props {
  application: ApplicationResponse;
  onClose: () => void;
}

export const ApplicantDetailModal: React.FC<Props> = ({ application, onClose }) => {
  const {
    applicant, loading, resumeUrl, resumeLoading, downloading,
    fetchApplicant, viewResume, downloadResume, clearResume,
  } = useApplicantDetail();

  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    fetchApplicant(application.id);
    return () => clearResume();
  }, [application.id]);

  const data = applicant ?? application;

  const handleViewResume = async () => {
    if (!resumeUrl) await viewResume(application.id);
    setShowResume((v) => !v);
  };

  const ratio = data.matchingRatio ?? null;

  const matchPalette =
    ratio == null       ? null
    : ratio >= 0.7      ? { color: "#1ca37b", bg: "rgba(28,163,123,0.08)",  border: "rgba(28,163,123,0.2)",  label: "Strong match"   }
    : ratio >= 0.4      ? { color: "#d97706", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  label: "Moderate match" }
    :                     { color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.2)",   label: "Weak match"     };

  const initials = (data.applicantFullName ?? "?")
    .split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-[#1a1540]/50 backdrop-blur-sm z-[60]" />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] flex flex-col overflow-hidden"
        style={{
          width: "min(660px, 93vw)",
          maxHeight: "90vh",
          background: "#f6f5ff",
          borderRadius: "32px",
          boxShadow: "0 40px 100px rgba(45,35,106,0.22), 0 0 0 1px rgba(45,35,106,0.08)",
        }}
      >
        {/* Gradient top bar */}
        <div className="h-[3px] shrink-0" style={{ background: "linear-gradient(90deg,#2D236A,#1ca37b)" }} />

        {/* ── Hero Header ── */}
        <div
          className="shrink-0 px-8 pt-6 pb-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(45,35,106,0.05) 0%,rgba(28,163,123,0.04) 100%)", borderBottom: "1px solid rgba(45,35,106,0.08)" }}
        >
          {/* Decorative bg circle */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-[0.04] pointer-events-none" style={{ background: "#2D236A" }} />

          <div className="flex items-start gap-5 relative z-10">
            {/* Avatar — initials */}
            <div
              className="shrink-0 rounded-3xl flex items-center justify-center font-syne font-extrabold text-lg"
              style={{
                width: 60, height: 60,
                background: "linear-gradient(135deg,rgba(45,35,106,0.14),rgba(45,35,106,0.07))",
                border: "1.5px solid rgba(45,35,106,0.18)",
                color: "#2D236A",
                letterSpacing: "-0.02em",
              }}
            >
              {initials}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              {/* Green badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#1ca37b]/10 border border-[#1ca37b]/25 text-[#1ca37b] font-syne text-[9px] font-bold uppercase tracking-[0.18em] rounded-full px-2.5 py-1 mb-2">
                <span className="w-1 h-1 rounded-full bg-[#1ca37b] animate-pulse" />
                Applicant
              </div>

              <h2 className="font-syne text-[19px] font-extrabold text-[#1a1540] leading-tight mb-1 truncate">
                {loading ? "Loading..." : data.applicantFullName}
              </h2>

              {/* Email link */}
              <a href={`mailto:${data.applicantEmail}`} style={{ textDecoration: "none" }} className="inline-flex items-center gap-1.5 group">
                <Mail className="w-3 h-3 text-[#2D236A]/25 group-hover:text-[#1ca37b] transition-colors" />
                <span className="text-[12px] text-[#2D236A]/40 font-medium group-hover:text-[#1ca37b] group-hover:underline underline-offset-2 transition-colors">
                  {data.applicantEmail}
                </span>
              </a>
            </div>

            {/* Match ratio pill */}
            {matchPalette && ratio != null && (
              <div
                className="shrink-0 flex flex-col items-center justify-center rounded-3xl px-5 py-3"
                style={{ background: matchPalette.bg, border: `1px solid ${matchPalette.border}` }}
              >
                <span className="font-syne text-[26px] font-extrabold leading-none" style={{ color: matchPalette.color }}>
                  {Math.round(ratio * 100)}%
                </span>
                <span className="font-syne text-[8px] font-bold uppercase tracking-[0.18em] mt-1" style={{ color: matchPalette.color }}>
                  match
                </span>
              </div>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center border border-[#2D236A]/10 bg-white/80 text-[#2D236A]/35 hover:text-[#2D236A] hover:bg-white hover:border-[#2D236A]/20 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Info chips row ── */}
          <div className="flex gap-2 flex-wrap mt-5 relative z-10">
            {data.university && <InfoChip icon={<GraduationCap className="w-3 h-3" />} value={data.university} />}
            {data.jobTitle   && <InfoChip icon={<Briefcase     className="w-3 h-3" />} value={data.jobTitle} />}
            {data.status     && <StatusChip value={data.status} />}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5">

          {/* AI Summary */}
          {data.summary && <AISummaryCard summary={data.summary} matchPalette={matchPalette} ratio={ratio} />}

          {/* Cover Letter */}
          {data.coverLetter && (
            <div>
              <SectionLabel title="Cover Letter" />
              <div
                className="text-[13px] text-[#2D236A]/60 leading-relaxed whitespace-pre-line rounded-2xl p-5 max-h-[160px] overflow-y-auto font-medium"
                style={{ background: "rgba(45,35,106,0.03)", border: "1px solid rgba(45,35,106,0.07)" }}
              >
                {data.coverLetter}
              </div>
            </div>
          )}

          {/* Social Links */}
          {Array.isArray(data.applicantSocialLinks) && data.applicantSocialLinks.length > 0 && (
            <div>
              <SectionLabel title="Social Links" />
              <div className="flex gap-2 flex-wrap">
                {data.applicantSocialLinks.map((link: SocialLink, i: number) => {
                  const url   = link.url ?? "";
                  const email = isEmail(url);
                  const href  = buildHref(url);
                  return (
                    <a
                      key={i}
                      href={href}
                      target={email ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none",
                        color: email ? "#1ca37b" : "#2D236A",
                        background: email ? "rgba(28,163,123,0.06)" : "rgba(45,35,106,0.05)",
                        borderColor: email ? "rgba(28,163,123,0.2)" : "rgba(45,35,106,0.12)",
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl font-syne text-[11px] font-bold uppercase tracking-wide border transition-all duration-300 hover:opacity-80"
                      onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = email ? "#1ca37b" : "#2D236A"; el.style.color = "#fff"; el.style.borderColor = "transparent"; }}
                      onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = email ? "rgba(28,163,123,0.06)" : "rgba(45,35,106,0.05)"; el.style.color = email ? "#1ca37b" : "#2D236A"; el.style.borderColor = email ? "rgba(28,163,123,0.2)" : "rgba(45,35,106,0.12)"; }}
                    >
                      {email ? <Mail className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                      {link.platform}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resume inline viewer */}
          {showResume && resumeUrl && (
            <div>
              <SectionLabel title="Resume Preview" />
              <iframe
                src={resumeUrl}
                className="w-full rounded-2xl border border-[#2D236A]/10"
                style={{ height: "380px", background: "#fff" }}
                title="Resume"
              />
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="shrink-0 px-8 py-4 flex gap-3"
          style={{ borderTop: "1px solid rgba(45,35,106,0.07)", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}
        >
          <FooterBtn
            onClick={handleViewResume}
            disabled={resumeLoading}
            icon={showResume ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            label={resumeLoading ? "Loading..." : showResume ? "Hide Resume" : "View Resume"}
            variant="navy"
          />
          <FooterBtn
            onClick={() => downloadResume(application.id, data.applicantFullName)}
            disabled={downloading}
            icon={<Download className="w-4 h-4" />}
            label={downloading ? "Downloading..." : "Download Resume"}
            variant="green"
          />
        </div>
      </div>
    </>
  );
};

// ─── AI Summary Card ──────────────────────────────────────────────────────────

const AISummaryCard: React.FC<{
  summary: string;
  matchPalette: { color: string; bg: string; border: string; label: string } | null;
  ratio: number | null;
}> = ({ summary, matchPalette, ratio }) => (
  <div>
    <SectionLabel title="AI Summary" />
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg,rgba(45,35,106,0.04),rgba(28,163,123,0.03))",
        border: "1px solid rgba(45,35,106,0.09)",
      }}
    >
      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,#2D236A,#1ca37b)" }} />

      <div className="pt-5 px-5 pb-4">
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
          style={{ background: "rgba(45,35,106,0.08)", border: "1px solid rgba(45,35,106,0.12)" }}
        >
          <BarChart2 className="w-4 h-4 text-[#2D236A]" />
        </div>

        <p className="text-[13px] leading-[1.85] font-medium text-[#2D236A]/65 whitespace-pre-line">
          {summary}
        </p>


      </div>
    </div>
  </div>
);

// ─── Small helpers ────────────────────────────────────────────────────────────

const InfoChip: React.FC<{ icon: React.ReactNode; value: string }> = ({ icon, value }) => (
  <span
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-syne text-[11px] font-bold border"
    style={{ color: "#2D236A", background: "rgba(45,35,106,0.05)", borderColor: "rgba(45,35,106,0.1)" }}
  >
    <span className="text-[#2D236A]/40">{icon}</span>
    {value}
  </span>
);

const STATUS_PALETTE: Record<string, { color: string; bg: string; border: string }> = {
  SUBMITTED:    { color: "#64748b", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)" },
  UNDER_REVIEW: { color: "#2D236A", bg: "rgba(45,35,106,0.08)",  border: "rgba(45,35,106,0.2)"  },
  SHORTLISTED:  { color: "#7c3aed", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" },
  INTERVIEW:    { color: "#d97706", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  OFFERED:      { color: "#0891b2", bg: "rgba(8,145,178,0.08)",  border: "rgba(8,145,178,0.2)"  },
  HIRED:        { color: "#1ca37b", bg: "rgba(28,163,123,0.08)", border: "rgba(28,163,123,0.2)" },
  REJECTED:     { color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)"  },
  WITHDRAWN:    { color: "#94a3b8", bg: "rgba(148,163,184,0.08)",border: "rgba(148,163,184,0.2)"},
};

const StatusChip: React.FC<{ value: string }> = ({ value }) => {
  const p = STATUS_PALETTE[value] ?? { color: "#64748b", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-syne text-[11px] font-bold border"
      style={{ color: p.color, background: p.bg, borderColor: p.border }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
      {value.replace("_", " ")}
    </span>
  );
};

const SectionLabel: React.FC<{ title: string }> = ({ title }) => (
  <p className="font-syne text-[9px] font-bold uppercase tracking-[0.18em] text-[#2D236A]/30 mb-3">{title}</p>
);

const FooterBtn: React.FC<{
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  variant: "navy" | "green";
}> = ({ onClick, disabled, icon, label, variant }) => {
  const s = variant === "green"
    ? { color: "#1ca37b", bg: "rgba(28,163,123,0.08)",  border: "rgba(28,163,123,0.2)",  hover: "#1ca37b" }
    : { color: "#2D236A", bg: "rgba(45,35,106,0.06)",   border: "rgba(45,35,106,0.15)",  hover: "#2D236A" };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-syne text-[12px] font-bold uppercase tracking-wide border transition-all duration-300"
      style={{ color: s.color, background: s.bg, borderColor: s.border, opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
      onMouseEnter={(e) => { if (!disabled) { const el = e.currentTarget; el.style.background = s.hover; el.style.color = "#fff"; el.style.borderColor = s.hover; } }}
      onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = s.bg; el.style.color = s.color; el.style.borderColor = s.border; }}
    >
      {icon}{label}
    </button>
  );
};
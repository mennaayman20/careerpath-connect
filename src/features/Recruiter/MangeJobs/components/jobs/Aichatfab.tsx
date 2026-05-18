// ─── AIChatFAB — Floating AI Chat Button ────────────────────────────────────
// يظهر كزرار دائري في أسفل الصفحة
// لما يتضغط: يهتز ويفتح قائمة الوظائف
// لما يختار وظيفة: يبعت الـ id تلقائياً مع firstPrompt للـ chat

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { chatService } from "../../../recruiter-chat/services/chatService";
import { JobResponse } from "../../types/recruiter.types";

interface AIChatFABProps {
  jobs: JobResponse[];
}

const FIRST_PROMPT = "Give me a quick summary of this job and the top candidates that applied.";

export const AIChatFAB: React.FC<AIChatFABProps> = ({ jobs }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"idle" | "pick" | "loading">("idle");
  const [loadingJobId, setLoadingJobId] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة لو ضغط براها
  useEffect(() => {
    if (step !== "pick") return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setStep("idle");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [step]);

  const handleFABClick = () => {
    if (step === "idle") setStep("pick");
    else setStep("idle");
  };
// AIChatFAB.tsx — الحل الأبسط
const handlePickJob = (job: JobResponse) => {
  navigate(`/recruiter/jobs/${job.id}/chat`, {
    state: { jobId: job.id, autoStart: true }
  });
};

  const activeJobs = jobs.filter(
    (j) => j.jobSource !== "external" && j.status?.toUpperCase() !== "CLOSED"
  );

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
      }}
    >
      {/* ── Job Picker Panel ── */}
      <AnimatePresence>
        {step === "pick" && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "300px",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
              border: "1px solid #e8e8e4",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "14px 18px 10px",
              borderBottom: "1px solid #f0f0ec",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <div style={{
                width: "28px", height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #1a6b5a, #2d9b81)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                    stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#141413", margin: 0 }}>
                  Ask AI about a Job
                </p>
                <p style={{ fontSize: "11px", color: "#9b9b96", margin: 0 }}>
                  Pick a job to start
                </p>
              </div>
            </div>

            {/* Jobs List */}
            <div style={{ maxHeight: "280px", overflowY: "auto", padding: "8px" }}>
              {activeJobs.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9b9b96", fontSize: "13px", padding: "20px" }}>
                  No active jobs found
                </p>
              ) : (
                activeJobs.map((job) => (
                  <motion.button
                    key={job.id}
                    whileHover={{ backgroundColor: "#f0faf7" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePickJob(job)}
                    disabled={loadingJobId === job.id}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s",
                    }}
                  >
                    {/* Job icon */}
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
                      background: "#e8f5f1",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {loadingJobId === job.id ? (
                        <div style={{
                          width: "14px", height: "14px",
                          border: "2px solid #1a6b5a",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "fab-spin 0.7s linear infinite",
                        }} />
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="7" width="20" height="14" rx="2"
                            stroke="#1a6b5a" strokeWidth="2"/>
                          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                            stroke="#1a6b5a" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: "13px", fontWeight: 600, color: "#141413",
                        margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {job.title}
                      </p>
                      <p style={{ fontSize: "11px", color: "#9b9b96", margin: 0, fontFamily: "monospace" }}>
                        ID: {job.id}
                        {job.location ? ` · ${job.location}` : ""}
                      </p>
                    </div>

                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: "#c5e8df" }}>
                      <path d="M9 18l6-6-6-6" stroke="#1a6b5a" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Button ── */}
      <motion.button
        onClick={handleFABClick}
        animate={step === "idle" ? {
          scale: [1, 1.06, 1],
          boxShadow: [
            "0 8px 30px rgba(26,107,90,0.35)",
            "0 12px 40px rgba(26,107,90,0.5)",
            "0 8px 30px rgba(26,107,90,0.35)",
          ],
        } : { scale: 1 }}
        transition={step === "idle" ? {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        } : { duration: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: "60px", height: "60px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #1a6b5a 0%, #2d9b81 100%)",
          boxShadow: "0 8px 30px rgba(26,107,90,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ripple ring */}
        {step === "idle" && (
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(26,107,90,0.6)",
              pointerEvents: "none",
            }}
          />
        )}

        <AnimatePresence mode="wait">
          {step === "loading" ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              transition={{ rotate: { duration: 0.7, repeat: Infinity, ease: "linear" } }}
              style={{
                width: "22px", height: "22px",
                border: "2.5px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
              }}
            />
          ) : step === "pick" ? (
            <motion.svg
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              width="20" height="20" viewBox="0 0 24 24" fill="none"
            >
              <path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              width="24" height="24" viewBox="0 0 24 24" fill="none"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 10h8M8 14h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes fab-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
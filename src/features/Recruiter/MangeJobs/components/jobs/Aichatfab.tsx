// ─── AIChatFAB — Floating AI Chat Button ────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { JobResponse } from "../../types/recruiter.types";

interface AIChatFABProps {
  jobs: JobResponse[];
}

const keyframes = `
  @keyframes fab-circuit-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes fab-shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes fab-ring-expand {
    0%   { transform: scale(1);   opacity: .5; }
    100% { transform: scale(1.9); opacity: 0;  }
  }
  @keyframes fab-ring-expand2 {
    0%   { transform: scale(1);   opacity: .3; }
    100% { transform: scale(2.4); opacity: 0;  }
  }
  @keyframes fab-orb-pulse {
    0%, 100% { transform: scale(1);    opacity: .7; }
    50%       { transform: scale(1.15); opacity: 1;  }
  }
  @keyframes fab-particle-float {
    0%   { transform: translateY(0)     scale(1); opacity: .8; }
    100% { transform: translateY(-64px) scale(0); opacity: 0;  }
  }
  @keyframes fab-brain-glow {
    0%, 100% { filter: drop-shadow(0 0 4px rgba(45,155,129,.4)); }
    50%       { filter: drop-shadow(0 0 10px rgba(45,155,129,.9)); }
  }
  @keyframes fab-dot-blink {
    0%, 100% { opacity: 1;  }
    50%       { opacity: .2; }
  }
  @keyframes fab-bar-blink {
    0%, 100% { opacity: .7;  }
    50%       { opacity: .15; }
  }
`;

const particles = [
  { left: "50%", delay: "0s",   size: 4, color: "#5de0b8" },
  { left: "68%", delay: ".5s",  size: 3, color: "#a8f0da" },
  { left: "35%", delay: "1s",   size: 3, color: "#7ee8c8" },
  { left: "75%", delay: "1.6s", size: 2, color: "#5de0b8" },
  { left: "25%", delay: "2.1s", size: 2, color: "#a8f0da" },
];

const bars = [
  { h: 8,  delay: "0s"   },
  { h: 12, delay: ".15s" },
  { h: 6,  delay: ".3s"  },
  { h: 10, delay: ".45s" },
];

export const AIChatFAB: React.FC<AIChatFABProps> = ({ jobs }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"idle" | "pick">("idle");
  const panelRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة لو ضغط براها
  useEffect(() => {
    if (step !== "pick") return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setStep("idle");
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [step]);

  const handleFABClick = () => setStep((s) => (s === "idle" ? "pick" : "idle"));

  const handlePickJob = (job: JobResponse) => {
    navigate(`/recruiter/jobs/${job.id}/chat`, {
      state: { jobId: job.id, autoStart: true },
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
      <style>{keyframes}</style>

      {/* ── Floating particles ── */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: "68px",
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity: 0,
            animation: `fab-particle-float 2.4s ease-out ${p.delay} infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Job Picker Panel ── */}
      <AnimatePresence>
        {step === "pick" && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "300px",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,.15), 0 4px 16px rgba(0,0,0,.08)",
              border: "1px solid #e8e8e4",
              overflow: "hidden",
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: "14px 18px 12px",
                borderBottom: "1px solid #f0f0ec",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "linear-gradient(135deg, rgba(26,107,90,.06), rgba(45,155,129,.03))",
              }}
            >
              <div
                style={{
                  width: "32px", height: "32px",
                  borderRadius: "9px",
                  background: "linear-gradient(135deg, #1a6b5a, #2d9b81)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                    stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                  <path d="M8 10h8M8 14h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>

              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#141413", margin: 0 }}>
                  Ask AI about a Job
                </p>
                {/* AI ready indicator */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  fontSize: "10px", color: "#1a6b5a", fontWeight: 600, marginTop: "2px",
                }}>
                  <div style={{
                    width: "5px", height: "5px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    animation: "fab-dot-blink 1.4s ease-in-out infinite",
                  }} />
                  AI ready
                </div>
              </div>
            </div>

            {/* Jobs list */}
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
                      transition: "background .15s",
                    }}
                  >
                    {/* Job icon */}
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                      background: "linear-gradient(135deg, #e8f5f1, #d0eee6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="7" width="20" height="14" rx="2"
                          stroke="#1a6b5a" strokeWidth="2"/>
                        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                          stroke="#1a6b5a" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: "13px", fontWeight: 600, color: "#141413",
                        margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {job.title}
                      </p>
                      <p style={{ fontSize: "11px", color: "#9b9b96", margin: 0, fontFamily: "monospace" }}>
                        ID: {job.id}{job.location ? ` · ${job.location}` : ""}
                      </p>
                    </div>

                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M9 18l6-6-6-6" stroke="#1a6b5a" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </motion.button>
                ))
              )}
            </div>

            {/* Animated footer */}
            <div style={{
              padding: "10px 14px",
              borderTop: "1px solid #f0f0ec",
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "11px", color: "#9b9b96",
            }}>
              <div style={{ display: "flex", gap: "3px", alignItems: "flex-end" }}>
                {bars.map((b, i) => (
                  <div key={i} style={{
                    width: "3px",
                    height: b.h,
                    borderRadius: "2px",
                    background: "#1a6b5a",
                    opacity: .7,
                    animation: `fab-bar-blink .8s ${b.delay} ease-in-out infinite`,
                  }} />
                ))}
              </div>
              AI is ready to analyze candidates &amp; job details
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Button ── */}
      <div style={{ position: "relative", width: "64px", height: "64px" }}>

        {/* Pulse rings */}
        {step === "idle" && (
          <>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid rgba(26,107,90,.55)",
              animation: "fab-ring-expand 2.2s ease-out infinite",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "1.5px solid rgba(45,155,129,.35)",
              animation: "fab-ring-expand2 2.2s ease-out .6s infinite",
              pointerEvents: "none",
            }} />
          </>
        )}

        {/* Rotating dashed circuit ring */}
        <svg
          viewBox="0 0 80 80"
          fill="none"
          style={{
            position: "absolute",
            inset: "-8px",
            width: "calc(100% + 16px)",
            height: "calc(100% + 16px)",
            animation: "fab-circuit-spin 8s linear infinite",
            pointerEvents: "none",
          }}
        >
          <circle
            cx="40" cy="40" r="36"
            stroke="rgba(45,155,129,0.28)"
            strokeWidth="1"
            strokeDasharray="6 5"
            fill="none"
          />
          <circle cx="40" cy="4"  r="2.5" fill="rgba(93,224,184,.75)" />
          <circle cx="76" cy="40" r="2"   fill="rgba(93,224,184,.5)"  />
          <circle cx="40" cy="76" r="2"   fill="rgba(93,224,184,.5)"  />
          <circle cx="4"  cy="40" r="2.5" fill="rgba(93,224,184,.75)" />
        </svg>

        {/* Main FAB */}
        <motion.button
          onClick={handleFABClick}
          animate={step === "idle" ? {
            scale: [1, 1.06, 1],
            boxShadow: [
              "0 8px 30px rgba(26,107,90,.35)",
              "0 12px 40px rgba(26,107,90,.55)",
              "0 8px 30px rgba(26,107,90,.35)",
            ],
          } : { scale: 1 }}
          transition={step === "idle"
            ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.2 }
          }
          whileHover={{ scale: 1.1  }}
          whileTap={{   scale: 0.94 }}
          aria-label="Ask AI"
          style={{
            width: "64px", height: "64px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #1a6b5a 0%, #2d9b81 60%, #3abf9e 100%)",
            boxShadow: "0 8px 30px rgba(26,107,90,.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            outline: "none",
          }}
        >
          {/* Orb highlight */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,.28) 0%, transparent 65%)",
            animation: "fab-orb-pulse 3s ease-in-out infinite",
            pointerEvents: "none",
          }} />

          {/* AI shimmer badge */}
          <div style={{
            position: "absolute",
            top: "-6px", right: "-6px",
            padding: "2px 7px",
            borderRadius: "20px",
            background: "linear-gradient(90deg, #0f6e56, #1a9b7a, #0f6e56)",
            backgroundSize: "200% auto",
            animation: "fab-shimmer 2.5s linear infinite",
            fontSize: "10px", fontWeight: 700,
            color: "#fff", letterSpacing: ".5px",
            border: "1.5px solid rgba(255,255,255,.3)",
            pointerEvents: "none",
            zIndex: 2,
          }}>
            AI
          </div>

          {/* Icon */}
          <AnimatePresence mode="wait">
            {step === "pick" ? (
              <motion.svg
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0   }}
                exit={{    opacity: 0, rotate: 90   }}
                width="22" height="22" viewBox="0 0 24 24" fill="none"
                style={{ position: "relative", zIndex: 1 }}
              >
                <path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              </motion.svg>
            ) : (
              <motion.svg
                key="chat"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1   }}
                exit={{    opacity: 0, scale: 0.7  }}
                width="26" height="26" viewBox="0 0 24 24" fill="none"
                style={{
                  position: "relative", zIndex: 1,
                  animation: "fab-brain-glow 2.5s ease-in-out infinite",
                }}
              >
                <path
                  d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  fill="rgba(255,255,255,.12)"
                />
                <path d="M8 10h8M8 14h5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
                {/* Sparkle star */}
                <path
                  d="M19 2l.5 1.5L21 4l-1.5.5L19 6l-.5-1.5L17 4l1.5-.5z"
                  fill="rgba(255,255,255,.95)"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};
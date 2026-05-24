import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Search, Check, X, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useMyApplications } from "@/features/submitedApplication/useSubmitted";
import { useNavigate } from "react-router-dom";
import { Application } from "@/features/submitedApplication/submitedInterface";

// ── Config ──────────────────────────────────────────────────────────────────

const STEPS = [
  { key: "SUBMITTED",    label: "Submitted" },
  { key: "UNDER_REVIEW", label: "Under review" },
  { key: "SHORTLISTED",  label: "Shortlisted" },
  { key: "INTERVIEW",    label: "Interview" },
  { key: "OFFERED",      label: "Offered" },
  { key: "HIRED",        label: "Hired" },
] as const;

const statusBadge: Record<string, { label: string; bg: string; text: string }> = {
  SUBMITTED:    { label: "Submitted",    bg: "#E6F1FB", text: "#0C447C" },
  UNDER_REVIEW: { label: "Under review", bg: "#FAEEDA", text: "#633806" },
  SHORTLISTED:  { label: "Shortlisted",  bg: "#EEEDFE", text: "#3C3489" },
  INTERVIEW:    { label: "Interview",    bg: "#FEF3C7", text: "#92400E" },
  OFFERED:      { label: "Offered",      bg: "#E0F2FE", text: "#0C4A6E" },
  HIRED:        { label: "Hired",        bg: "#E1F5EE", text: "#085041" },
  REJECTED:     { label: "Rejected",     bg: "#FCEBEB", text: "#791F1F" },
  WITHDRAWN:    { label: "Withdrawn",    bg: "#F1EFE8", text: "#444441" },
};

const matchColor = (pct: number) =>
  pct >= 75 ? "#1ca37b" : pct >= 50 ? "#EF9F27" : "#E24B4A";

// ── Timeline ─────────────────────────────────────────────────────────────────

function ApplicationTimeline({ status }: { status: Application["status"] }) {
  const isRejected  = status === "REJECTED";
  const isWithdrawn = status === "WITHDRAWN";
  const isTerminal  = isRejected || isWithdrawn;

  // لو rejected/withdrawn نقطع الـ timeline بعد SHORTLISTED ونضيف الـ terminal step
  const steps = isTerminal
    ? [...STEPS.slice(0, 3), { key: status, label: isRejected ? "Rejected" : "Withdrawn" }]
    : [...STEPS];

  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="px-4 pb-4 flex items-start overflow-x-auto scrollbar-none gap-0">
      {steps.map((step, i) => {
        const isDone     = i < currentIdx;
        const isActive   = i === currentIdx;
        const isTermStep = isTerminal && i === steps.length - 1;

        return (
          <div key={step.key} className="flex flex-col items-center flex-1 min-w-[52px] relative">
            {/* connector line */}
            {i < steps.length - 1 && (
              <div className="absolute top-[10px] left-[calc(50%+11px)] right-[calc(-50%+11px)] h-[2px] z-0"
                style={{
                  background: isDone && !isTermStep
                    ? isRejected && i === steps.length - 2 ? "#E24B4A" : "#1ca37b"
                    : "#e8e8e4"
                }}
              />
            )}

            {/* dot */}
            <div className="relative z-10 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                borderColor: isTermStep  ? (isRejected ? "#E24B4A" : "#888780")
                           : isActive    ? "#378ADD"
                           : isDone      ? "#1ca37b"
                           : "#e8e8e4",
                background:  isTermStep  ? (isRejected ? "#FEECEC" : "#F1EFE8")
                           : isActive    ? "#EBF4FF"
                           : isDone      ? "#1ca37b"
                           : "#fff",
                boxShadow: isActive ? "0 0 0 4px rgba(55,138,221,0.15)" : undefined,
              }}
            >
              {isDone && !isTermStep && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              {isActive && !isTermStep && (
                <div className="w-2 h-2 rounded-full"
                  style={{ background: "#378ADD" }} />
              )}
              {isTermStep && isRejected  && <X      className="w-3 h-3" style={{ color: "#E24B4A" }} strokeWidth={3} />}
              {isTermStep && isWithdrawn && <Circle className="w-2.5 h-2.5" style={{ color: "#888" }} />}
            </div>

            {/* label */}
            <span className="text-[9.5px] font-semibold text-center mt-1.5 leading-tight"
              style={{
                color: isTermStep  ? (isRejected ? "#E24B4A" : "#888780")
                     : isActive    ? "#378ADD"
                     : isDone      ? "#1ca37b"
                     : "#bbb"
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Match bar ────────────────────────────────────────────────────────────────

// function MatchBar({ pct }: { pct: number }) {
//   const color = matchColor(pct);
//   return (
//     <div className="flex items-center gap-2.5 px-4 pb-4">
//       <span className="text-[11px] font-semibold text-muted-foreground w-9">Match</span>
//       <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
//         <motion.div className="h-full rounded-full"
//           style={{ background: color }}
//           initial={{ width: 0 }}
//           animate={{ width: `${pct}%` }}
//           transition={{ duration: 1, ease: "easeOut" }}
//         />
//       </div>
//       <span className="text-[11px] font-bold font-mono w-7 text-right" style={{ color }}>
//         {pct}%
//       </span>
//     </div>
//   );
// }

// ── Main ─────────────────────────────────────────────────────────────────────

const Applications = () => {
  const { applications, isLoading, error } = useMyApplications();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="container flex-1 py-10 max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#e8f5f0] flex items-center justify-center shrink-0">
            <FileText className="h-6 w-6 text-[#1ca37b]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My applications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track and manage your AI-matched job applications
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground animate-pulse">Fetching your applications…</p>
          </div>

        ) : error ? (
          <div className="text-center py-16 bg-destructive/5 rounded-2xl border border-destructive/20">
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>

        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed rounded-2xl gap-3">
            <Search className="h-10 w-10 text-muted-foreground/30" />
            <h2 className="text-base font-medium text-foreground">No applications yet</h2>
            <p className="text-sm text-muted-foreground">Start applying to jobs to track your progress here.</p>
          </div>

        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app, i) => {
              const badge = statusBadge[app.status] ?? { label: app.status, bg: "#f5f5f3", text: "#666" };
              const pct   = Math.round(app.matchingRatio ?? 0);

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
                  onClick={() => navigate(`/jobs?id=${app.jobId}`)}
                  className="bg-card border border-border/60 rounded-2xl overflow-hidden cursor-pointer transition-shadow"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
                    <div className="min-w-0">
                      <p className="text-[17px] font-semibold text-foreground truncate">
                        {app.jobTitle}
                      </p>
                      {app.coverLetter && (
                        <p className="text-[12px] text-muted-foreground italic truncate mt-0.5">
                          {app.coverLetter}
                        </p>
                      )}
                    </div>
                    <Badge className="rounded-full text-[11px] px-2.5 py-0.5 border-0 font-semibold shrink-0"
                      style={{ background: badge.bg, color: badge.text }}>
                      {badge.label}
                    </Badge>
                  </div>

                  {/* Timeline */}
                  <ApplicationTimeline status={app.status} />

                  
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Applications;
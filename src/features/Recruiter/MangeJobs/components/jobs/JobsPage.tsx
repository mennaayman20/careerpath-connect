"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useJobs } from "../../hooks/useJobs";
import { JobCard } from "./JobsCard";
import { JobResponse } from "../../types/recruiter.types";
import { ApplicationsDrawer } from "../jobs/ApplicationsDrawer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRecruiterOrg } from "../../../../org-connect/useRecruiterOrg";
import { useNavigate } from "react-router-dom";
import AiButton from "@/components/ui/AiButton";
import { cn } from "@/lib/utils";

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const TipItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-xs text-black/70">
    <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] shrink-0" />
    {text}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white/60 border border-white/70 rounded-3xl p-6 h-[130px] animate-pulse" />
);

const EmptyState = ({ status }: { status: string }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <p className="font-syne text-[#2D236A]/70 text-base">
      No {status.toLowerCase()} jobs found.
    </p>
    <p className="text-sm text-slate-400 mt-1">
      Try switching tabs or post a new job from your dashboard.
    </p>
  </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export const JobsPage: React.FC = () => {
  const { orgId, loading: orgLoading } = useRecruiterOrg();
  const navigate = useNavigate();

  const {
    jobs,
    pagination,
    loading,
    actionLoading,
    handleJobAction,
    goToPage,
    filterByStatus,
    activeStatus,
  } = useJobs(orgId ?? 0);

  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // تعيين الحالة الافتراضية لتكون OPEN بدلاً من all عند تحميل الصفحة لأول مرة
  useEffect(() => {
    if (activeStatus === "all") {
      filterByStatus("OPEN");
    }
  }, [activeStatus, filterByStatus]);

  const [prevActionLoading, setPrevActionLoading] = useState(false);

  // مراقبة انتهاء الأكشن لعرض رسالة النجاح بشكل انسيابي
  useEffect(() => {
    if (prevActionLoading && !actionLoading) {
      setToastMessage("Job status updated successfully!");
      setShowSuccessToast(true);
      const timer = setTimeout(() => setShowSuccessToast(false), 4000);
      return () => clearTimeout(timer);
    }
    setPrevActionLoading(Boolean(actionLoading));
  }, [actionLoading, prevActionLoading]);

  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f5ff]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D236A]" />
      </div>
    );
  }

  // مصفوفة الحالات الجديدة بدون "all"
  const statuses = ["OPEN", "PAUSED", "CLOSED"] as const;

  // دالة لتحديد ألوان التابات ديناميكياً بناءً على الحالة النشطة
  const getTabColorClass = (status: typeof statuses[number]) => {
    if (activeStatus !== status) return "text-slate-500 hover:bg-slate-50 hover:text-[#2D236A]";
    
    switch (status) {
      case "OPEN":
        return "bg-[#1ca37b] text-white shadow-md shadow-emerald-500/20";
      case "PAUSED":
        return "bg-amber-500 text-white shadow-md shadow-amber-500/20";
      case "CLOSED":
        return "bg-rose-700 text-white shadow-md shadow-rose-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5ff] relative">
      <Navbar />

      {/* رسالة نجاح التحديث الإنسيابية (Toast Notification) */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-white border border-emerald-100 px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_-5px_rgba(16,185,129,0.2)]"
          >
            <div className="bg-emerald-50 p-1 rounded-lg">
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
            <span className="text-xs font-bold text-slate-800 font-sans tracking-wide">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الـ motion.div الرئيسي المفتوح في الأعلى */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-[#f6f5ff] font-sans"
      >
        {/* ── Hero ── */}
        <section className="relative bg-[#2D236A] overflow-hidden py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_120%_at_85%_50%,rgba(28,163,123,.2)_0%,transparent_70%)]" />

          <div className="relative z-10 max-w-screen-xl mx-auto px-6 flex flex-wrap items-center justify-between gap-8">
            <div className="flex flex-col items-start">
              <button
                onClick={() => navigate("/recruiter-dashboard")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors mb-4 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Dashboard
              </button>

              <div className="inline-flex items-center gap-2 bg-[#1ca37b]/15 border border-[#1ca37b]/35 text-[#5de8b8] text-[10px] font-bold uppercase rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] animate-pulse" />
                Job Listings
              </div>

              <h1 className="font-syne text-2xl md:text-3xl font-extrabold text-white mb-2">
                Your <span className="text-[#59daad]">Job Listings</span>
              </h1>

              <p className="text-sm text-white/80 max-w-md">
                Track, manage, and act on all your postings filtered by status.
              </p>
            </div>

            {/* Total Count */}
            <div className="flex flex-col items-center px-6 border-r border-white/10">
              <span className="font-syne text-2xl font-extrabold text-white leading-none">
                {pagination.totalElements}
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-white/40 mt-1">
                {activeStatus === "all" ? "Open" : activeStatus} Jobs
              </span>
            </div>
          </div>
        </section>

        {/* ── Main Content ── */}
        <main className="max-w-screen-xl mx-auto px-6 py-8">

{/* Status Filter Tabs */}
<div className="relative flex items-center gap-1 mb-8
 bg-white/60 dark:bg-slate-900/60 p-1 rounded-[14px] border
  border-slate-300/80 dark:border-slate-700/80 max-w-full mx-auto md:mx-0 shadow-[0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-md">
  {statuses.map((s) => {
    const isActive = activeStatus === s;
    
    return (
      <button
        key={s}
        onClick={() => filterByStatus(s)}
        className={cn(
          "relative flex-1 text-center py-1.5 text-[12px] font-semibold rounded-[10px] transition-colors duration-300 uppercase tracking-wider z-10 select-none",
          isActive 
            ? "text-white" 
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-900"
        )}
      >
        {/* الأنيميشن السحري للخلفية المتحركة */}
        {isActive && (
          <motion.div
            layoutId="activeTabBackground"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className={cn(
              "absolute inset-0 rounded-[10px] z-[-1]",
              s === "OPEN" && "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm shadow-emerald-500/10",
              s === "PAUSED" && "bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm shadow-amber-500/10",
              s === "CLOSED" && "bg-gradient-to-r from-rose-700 to-red-600 shadow-sm shadow-rose-500/10"
            )}
          />
        )}
        <span className="relative z-10">{s}</span>
      </button>
    );
  })}
</div>
          {/* Header */}
          <header className="flex items-center gap-3 mb-5">
            <span className="font-syne text-[13px] font-medium uppercase whitespace-nowrap text-[#2D236A]">
              {activeStatus === "all" ? "Open Listings" : `${activeStatus} Listings`}
            </span>
            <div className="flex-1 h-px bg-[#2D236A]/50" />
          </header>

          {/* Jobs List */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState status={activeStatus} />
          ) : (
            <motion.div 
              layout 
              className="flex flex-col gap-3"
            >
              <AnimatePresence mode="popLayout">
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobCard
                      job={job}
                      actionLoading={Boolean(actionLoading)}
                      onAction={(id, action) => handleJobAction(id, action)}
                     
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-8">
              <button
                onClick={() => goToPage(Math.max(0, pagination.page - 1))}
                disabled={pagination.page === 0}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-border bg-card hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-sm text-muted-foreground whitespace-nowrap">
                <span className="font-semibold text-foreground">{pagination.page + 1}</span>
                {" / "}
                <span className="font-semibold text-foreground">{pagination.totalPages}</span>
              </span>

              <button
                onClick={() => goToPage(Math.min(pagination.totalPages - 1, pagination.page + 1))}
                disabled={pagination.page >= pagination.totalPages - 1}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-border bg-card hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* AI Voice Interviews Section */}
          <div className="w-full overflow-hidden rounded-[32px] border border-teal-500/20 bg-gradient-to-r from-white via-[#1ca37b]/5 to-[#2D236A]/5 p-8 md:p-10 relative mt-12
            shadow-[0_12px_40px_-12px_rgba(28,163,123,0.15)] transition-all duration-500 ease-out
            hover:shadow-[0_24px_60px_-10px_rgba(45,35,106,0.2)] hover:-translate-y-1 hover:border-teal-400/50"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#1ca37b]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1ca37b]/15 to-[#2D236A]/15 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-[#107e5e] border border-[#1ca37b]/20 shadow-sm">
                  <Sparkles size={12} className="text-[#1ca37b] animate-pulse" />
                  <span>Next-Gen Feature</span>
                </div>

                <h2 className="font-syne text-2xl font-extrabold text-gray-900 leading-tight mb-3">
                  AI Voice <span className="text-[#1ca37b]">Interviews Simulator</span>
                </h2>

                <p className="text-sm md:text-base leading-relaxed text-gray-600 font-medium max-w-2xl">
                  Generate custom job-specific questions, run real-time voice-to-text conversations,
                  and get instant semantic scoring using advanced Cross-Encoder evaluation.
                </p>
              </div>

              <div className="flex items-center justify-start lg:justify-center shrink-0 self-start lg:self-center bg-white p-3 rounded-2xl shadow-md border border-slate-100/80">
                <AiButton onClick={() => console.log("Open Interview Modal 🚀")} />
              </div>
            </div>
          </div>

          {/* Tips Footer */}
          <footer className="mt-5 bg-white rounded-2xl border border-[#2D236A]/8 px-6 py-4 flex items-center gap-6 flex-wrap shadow-sm">
            <span className="font-syne text-[10px] font-bold uppercase text-[#1ca37b]">
              💡 Recruiter Tips
            </span>
            <TipItem text="Use pipeline stages to track applicant progress efficiently" />
            <TipItem text="Clear and precise job requirements attract highly qualified talent." />
            <TipItem text="Update job status regularly to maintain an active talent pool" />
          </footer>
        </main>
      </motion.div> {/* تم الاستبدال هنا بـ motion.div مغلق بشكل صحيح */}

      <Footer />

      {selectedJob && (
        <ApplicationsDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};
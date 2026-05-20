"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useJobs } from "../../hooks/useJobs";
import { JobCard } from "./JobsCard";
import { JobResponse } from "../../types/recruiter.types";
import { ApplicationsDrawer } from "../jobs/ApplicationsDrawer";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRecruiterOrg } from "../../../../org-connect/useRecruiterOrg";
import { AIChatFAB } from "./Aichatfab";
import { useNavigate } from "react-router-dom";

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const Stat = ({ num, label }: { num: string; label: string }) => (
  <div className="flex flex-col items-center px-6 first:pl-0 last:pr-0 border-r border-white/10 last:border-0">
    <span className="font-syne text-2xl font-extrabold text-white leading-none">{num}</span>
    <span className="text-[10px] font-semibold tracking-widest uppercase text-white/40 mt-1">{label}</span>
  </div>
);

const TipItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-xs text-black/70">
    <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] shrink-0" />
    {text}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white/60 border border-white/70 rounded-3xl p-6 h-[130px] animate-pulse" />
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <p className="font-syne text-[#2D236A]/70 text-base">No jobs posted yet.</p>
    <p className="text-sm text-slate-400 mt-1">Click "Post a Job" from your dashboard to get started.</p>
  </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export const JobsPage: React.FC = () => {
  const { orgId, loading: orgLoading } = useRecruiterOrg(); // ← من الـ API
  const navigate = useNavigate();

  const { jobs, pagination, loading, actionLoading, fetchJobs, handleJobAction, goToPage } =
    useJobs(orgId ?? 0);

  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);
  const [search, setSearch] = useState("");

  // ✅ hooks قبل أي early return
  useEffect(() => {
    if (orgId) fetchJobs(0);
  }, [fetchJobs, orgId]);

  // ✅ early return بعد كل الـ hooks
  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f5ff]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D236A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5ff]">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-[#f6f5ff] font-sans"
      >
        {/* ── Hero Section ── */}
<section className="relative bg-[#2D236A] overflow-hidden py-16">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_120%_at_85%_50%,rgba(28,163,123,.2)_0%,transparent_70%)]" />
  <div className="pointer-events-none absolute inset-y-0 top-0 w-1/2 bg-[radial-gradient(ellipse_at_top_center,_#7c3aed10_0%,_transparent_60%)]" />

  <div className="relative z-10 max-w-screen-xl mx-auto px-6 flex flex-wrap items-center justify-between gap-8">
    
    {/* Content Column */}
    <div className="flex flex-col items-start">
      
      {/* زر العودة مستقر في الأعلى */}
      <button
        onClick={() => navigate("/recruiter-dashboard")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors mb-4 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* Tag Label */}
      <div className="inline-flex items-center gap-2 bg-[#1ca37b]/15 border border-[#1ca37b]/35 text-[#5de8b8] text-[10px] font-bold uppercase rounded-full px-3 py-1 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] animate-pulse" />
        Job Listings
      </div>

      {/* Title */}
      <h1 className="font-syne text-2xl md:text-3xl font-extrabold text-white mb-2">
        Your <span className="text-[#59daad]">Job Listings</span>
      </h1>

      {/* Description */}
      <p className="text-sm text-white/50 max-w-md">
        Track, manage, and act on all your postings in one place.
      </p>
    </div>

    {/* <div className="flex shrink-0">
      <Stat num={String(pagination?.totalElements || 0)} label="Total Jobs" />
      <Stat
        num={String(jobs?.filter((j) => j.status === "ACTIVE").length || 0)}
        label="Active"
      />
      <Stat num="—" label="Applications" />
    </div> */}
    
  </div>
</section>

        {/* ── Main Content ── */}
        <main className="max-w-screen-xl mx-auto px-6 py-8">
          <header className="flex items-center gap-3 mb-5">
            <span className="font-syne text-[13px] font-medium uppercase whitespace-nowrap text-[#2D236A]">
              All Listings
            </span>
            <div className="flex-1 h-px bg-[#2D236A]/70" />
          </header>

          {/* Jobs List */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : !jobs || jobs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  actionLoading={Boolean(actionLoading)}
                  onAction={(id, action) =>
                    handleJobAction(id, action, () => fetchJobs(pagination.page))
                  }
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && !search?.trim() && (
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
      </motion.div>

      <Footer />

      {/* Applications Drawer */}
      {selectedJob && (
        <ApplicationsDrawer
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* <AIChatFAB jobs={jobs ?? []} /> */}
      
    </div>
  );
};
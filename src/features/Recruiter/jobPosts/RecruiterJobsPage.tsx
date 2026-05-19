import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Plus, X, Pencil, MapPin, Layers, Building2,
  Calendar, ChevronDown, ChevronUp, Loader2,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useJobs } from "./Usejobs.hook";
import { JobPostForm } from "./Jobpostform";
import { JobResponse } from "../../../types/jobs";
import { jobsService } from "./Jobs.service";
import { toast } from "sonner";
import { useRecruiterOrg } from "@/features/org-connect/useRecruiterOrg";
import { Navigate, useNavigate } from "react-router-dom";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  OPEN: {
    label: "Open",
    dot: "bg-emerald-500 animate-pulse",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100/80 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
    bar: "bg-emerald-500",
  },
  PAUSED: {
    label: "Paused",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-600 border-amber-100/80 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
    bar: "bg-amber-500",
  },
  CLOSED: {
    label: "Closed",
    dot: "bg-slate-400",
    badge: "bg-slate-50 text-slate-500 border-slate-200/60 dark:bg-slate-800 dark:text-slate-400",
    bar: "bg-slate-300",
  },
};

// ─── Meta pill ────────────────────────────────────────────────────────────────
const MetaPill = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D236A]/60 bg-[#2D236A]/5 dark:bg-white/5 dark:text-white/60 px-3 py-1 rounded-full border border-slate-50">
    <Icon size={12} className="shrink-0 text-[#2D236A]/40" />
    {text}
  </span>
);

// ─── Job card ─────────────────────────────────────────────────────────────────
const JobCard = ({
  job,
  onEdit,
  isEditing,
}: {
  job: JobResponse;
  onEdit: (job: JobResponse) => void;
  isEditing: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  const status =
    STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG] ?? {
      label: job.status,
      dot: "bg-slate-400",
      badge: "bg-slate-50 text-slate-500 border-slate-200",
      bar: "bg-slate-300",
    };

  const visibleSkills = job.skills?.slice(0, 4) ?? [];
  const extraSkills = (job.skills?.length ?? 0) - 4;

  return (
    <div
      className={`group relative rounded-3xl border bg-white transition-all duration-300 overflow-hidden flex flex-col justify-between h-full
        ${isEditing
          ? "border-violet-400 ring-4 ring-violet-500/10 shadow-lg"
          : "border-slate-100/80 hover:border-violet-200/60 hover:shadow-[0_20px_45px_-12px_rgba(45,35,106,0.08)] hover:-translate-y-1"
        }`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[4px] transition-all duration-500 ${status.bar}`} />

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${status.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>

                {isEditing && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-violet-200 bg-violet-50 text-violet-600 animate-pulse">
                    Editing Mode
                  </span>
                )}
              </div>

              <h3 className="font-syne text-xl font-bold text-slate-900 leading-snug tracking-tight truncate" title={job.title}>
                {job.title}
              </h3>

              {job.organizationName && (
                <p className="text-sm text-slate-400 font-semibold mt-1 flex items-center gap-1">
                  <Building2 size={12} className="text-violet-500" />
                  {job.organizationName}
                </p>
              )}
            </div>

            {/* Edit button */}
            <button
              onClick={() => onEdit(job)}
              className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border shadow-sm
                ${isEditing
                  ? "bg-[#2D236A] text-white border-[#2D236A] scale-105"
                  : "bg-slate-50 hover:bg-[#2D236A] text-slate-400 hover:text-white border-slate-100 hover:scale-105 active:scale-95"
                }`}
              title="Edit job"
            >
              <Pencil size={14} />
            </button>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.type && <MetaPill icon={Briefcase} text={job.type} />}
            {job.seniority && <MetaPill icon={Layers} text={job.seniority} />}
            {job.model && <MetaPill icon={Layers} text={job.model} />}
            {job.location && <MetaPill icon={MapPin} text={job.location} />}
          </div>

          {/* Skills */}
          {visibleSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {visibleSkills.map((skill, i) => (
                <span
                  key={i}
                  className="text-[11px] font-bold bg-emerald-50/60 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-full"
                >
                  {skill.skillName}
                </span>
              ))}
              {extraSkills > 0 && (
                <span className="text-[11px] font-bold bg-slate-50 text-slate-400 border border-slate-100 px-2.5 py-0.5 rounded-full">
                  +{extraSkills} more
                </span>
              )}
            </div>
          )}

          {/* Description expandable */}
          {job.description && (
            <div className="mb-4 bg-slate-50/60 rounded-2xl p-3.5 border border-slate-50">
              <p className={`text-xs text-slate-500 leading-relaxed transition-all duration-300 ${expanded ? "" : "line-clamp-2"}`}>
                {job.description}
              </p>
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-[11px] font-extrabold text-[#2D236A] hover:underline flex items-center gap-0.5 transition-colors"
              >
                {expanded ? (
                  <><ChevronUp size={12} /> Show less</>
                ) : (
                  <><ChevronDown size={12} /> Show more</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center pt-4 mt-2 border-t border-slate-100">
          <span className="text-[15px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Calendar size={12} className="text-violet-800" />
            {getRelativeTime(job.createdDate)}
          </span>
        </div>
      </div>
    </div>
  );
};


const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const pastDate = new Date(date);
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return pastDate.toLocaleDateString();
}


// ─── Main page ────────────────────────────────────────────────────────────────
export const RecruiterJobsPage = () => {
  const { orgId, loading: orgLoading } = useRecruiterOrg();
  const navigate = useNavigate();
  const {
    jobs,
    loading,
    submitting,
    error,
    editingJob,
    setEditingJob,
    createJob,
    updateJob,
  } = useJobs(orgId ?? 0);

  // ✅ كل الـ hooks قبل أي early return
  const [showForm, setShowForm] = useState(false);

  React.useEffect(() => {
    if (editingJob) setShowForm(true);
  }, [editingJob]);

  // ✅ early return بعد كل الـ hooks
  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f5ff]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D236A]" />
      </div>
    );
  }

  const cancelEdit = () => {
    setEditingJob(null);
    setShowForm(false);
  };

  const handleEditClick = async (jobId: number) => {
    const response = await jobsService.getJobById(jobId);
    if (response.success && response.data) {
      setEditingJob(response.data);
      setShowForm(true);
    } else {
      toast.error(response.error || "Could not load job details");
    }
  };

  const handleToggleForm = () => {
    if (showForm) {
      cancelEdit();
    } else {
      setEditingJob(null);
      setShowForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5ff]">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* ── Hero ── */}
<section className="relative bg-[#2D236A] overflow-hidden py-16">
  {/* Radial Gradient Background Blur */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_120%_at_85%_50%,rgba(28,163,123,.2)_0%,transparent_70%)]" />
  
  <div className="relative z-10 max-w-screen-xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
    
    {/* Left Content Column */}
    <div className="flex flex-col items-start">
      
      {/* 1. Back to Dashboard Button (Top) */}
      <button
        onClick={() => navigate("/recruiter-dashboard")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors mb-4 md:mb-6 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* 2. Tag Label */}
      <div className="inline-flex items-center gap-2 bg-[#1ca37b]/15 border border-[#1ca37b]/35 text-[#5de8b8] text-[10px] font-bold uppercase rounded-full px-3 py-1 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] animate-pulse" />
        Job Listings
      </div>

      {/* 3. Title */}
      <h1 className="font-syne text-3xl md:text-3xl font-extrabold text-white mb-2">
        Manage Your <span className="text-[#59daad]">Listings</span>
      </h1>

      {/* 4. Description */}
      <p className="text-sm text-white/50 max-w-md">
        Post new roles and edit existing listings anytime.
      </p>
    </div>

    {/* Right Content Column: Toggle form button */}
<button
  onClick={handleToggleForm}
  className={`inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl border transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] group
    ${showForm
      ? "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
      : "bg-[#1ca37b] text-white border-transparent shadow-lg hover:bg-[#18906b] hover:shadow-[0_10px_20px_rgba(28,163,123,0.3)]"
    }`}
>
  {showForm ? (
    <>
      <X size={16} className="group-hover:rotate-90 group-hover:scale-110 transition-transform duration-300" />
      <span>Close Form</span>
    </>
  ) : (
    <>
      <Plus size={16} className="group-hover:rotate-180 group-hover:scale-110 transition-transform duration-500" />
      <span>Post a Job</span>
    </>
  )}
</button>

  </div>
</section>

        {/* ── Main ── */}
        <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">

          {/* ── Form Panel ── */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                key="form-panel"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_8px_30px_rgba(45,35,106,0.04)]"
              >
                <JobPostForm
                  onSubmit={async (payload) => {
                    if (editingJob) {
                      return await updateJob(editingJob.id, payload);
                    } else {
                      return await createJob(payload);
                    }
                  }}
                  submitting={submitting}
                  editingJob={editingJob}
                  onCancelEdit={cancelEdit}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Listings ── */}
          <div>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-syne text-[13px] font-bold uppercase tracking-wider whitespace-nowrap text-[#2D236A]/70">
                Your Listings
              </span>
              <div className="flex-1 h-px bg-slate-200" />
              {!loading && (
                <span className="text-xs font-bold text-slate-400 bg-slate-100/80 border border-slate-200/40 px-2.5 py-0.5 rounded-lg whitespace-nowrap">
                  {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
                </span>
              )}
            </div>

            {/* Loading skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-64 rounded-3xl bg-white border border-slate-100 shadow-sm animate-pulse"
                  />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-3xl bg-[#2D236A]/6 flex items-center justify-center mb-4">
                  <Briefcase size={22} className="text-[#2D236A]/30" />
                </div>
                <p className="font-syne text-base font-bold text-[#2D236A]/40 mb-1">
                  No listings yet
                </p>
                <p className="text-xs text-[#2D236A]/30 mb-4">
                  Post your first job to start attracting talent.
                </p>
                <button
  onClick={() => {
    setEditingJob(null);
    setShowForm(true);
  }}
  className="inline-flex items-center gap-2 bg-[#2D236A] text-white text-sm font-bold px-5 py-2.5 rounded-xl border border-white/10 shadow-md transition-all duration-300 ease-out hover:bg-[#241b54] hover:border-white/20 hover:scale-[1.03] hover:shadow-[0_10px_20px_rgba(45,35,106,0.3)] active:scale-[0.98] group"
>
  <Plus 
    size={16} 
    className="group-hover:rotate-180 group-hover:scale-110 transition-transform duration-500 ease-in-out" 
  />
  <span>Post a Job</span>
</button>
              </div>
            ) : (
              /* Job cards grid */
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatePresence>
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                    >
                      <JobCard
                        job={job}
                        onEdit={(j) => {
                          handleEditClick(j.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        isEditing={editingJob?.id === job.id}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </main>
      </motion.div>

      <Footer />
    </div>
  );
};
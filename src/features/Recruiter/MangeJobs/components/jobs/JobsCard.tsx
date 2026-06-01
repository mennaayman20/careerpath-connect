import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Briefcase, Clock, Building2,
  Eye, XCircle, Pause, Play,
} from "lucide-react";
import { Badge }   from "@/components/ui/badge";
import { Button }  from "@/components/ui/button";
import { cn }      from "@/lib/utils";
import { JobResponse } from "../../types/recruiter.types";

export type JobActionType = "resume" | "pause" | "close";

interface JobCardProps {
  job:           JobResponse;
  actionLoading: boolean;
  onAction:      (id: number, action: JobActionType) => void;
}

const getRelativeTime = (date: string | Date): string => {
  const now      = new Date();
  const pastDate = new Date(date);
  const seconds  = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  if (seconds < 60)  return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)  return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7)      return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4)     return `${weeks}w ago`;
  return pastDate.toLocaleDateString();
};

export const JobCard: React.FC<JobCardProps> = ({
  job,
  actionLoading,
  onAction,
}) => {
  const navigate = useNavigate();

  if (job.jobSource === "external") return null;

  const isPaused = job.status?.toUpperCase() === "PAUSED";
  const isClosed = job.status?.toUpperCase() === "CLOSED";

  return (
    <motion.div
     initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  // ⬇️ عملنا transition سريع ومحدد للـ hover بس (Duration: 0.2 ثانية)
  whileHover={{ 
    scale: 1.02, 
    y: -2,
    transition: { duration: 0.2, ease: "easeInOut" }
  }}
  // الـ transition ده هيفضل مسؤول بس عن أول ما الكارد يظهر في الصفحة
  transition={{ duration: 0.2, ease: "easeOut" }}
  className={cn(
    "group relative rounded-[24px] border-2 border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900 m-3 p-6 flex flex-col justify-between h-full",
    "shadow-[0_8px_24px_rgba(45,35,106,0.02)] hover:shadow-[0_20px_40px_-4px_rgba(45,35,106,0.12)]",
    "hover:border-violet-400/80 dark:hover:border-violet-500/80 transition-colors duration-300" 
    // 💡 شيلنا transition-all وخليناها transition-colors عشان الـ Tailwind ما يعملش تداخل مع الـ Framer Motion في الأبعاد
  )}
    >
      {/* Smooth Subtle Glow Background Layer on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[22px] pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1 justify-between">
        {/* Top Section: Title & Status Badge */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <h3 className="font-syne font-bold text-lg md:text-[22px] text-[#2D236A] dark:text-white leading-snug tracking-tight truncate group-hover:text-violet-900 dark:group-hover:text-violet-300 transition-colors duration-300">
                {job.title}
              </h3>

              {job.organizationName && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <Building2 className="h-4 w-4 text-violet-500 shrink-0" />
                  <span className="truncate">{job.organizationName}</span>
                </p>
              )}
            </div>

            {/* Status Badge */}
            <Badge
              className={cn(
                "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm border-0 shrink-0 select-none transition-all duration-300",
                !isClosed
                  ? "bg-[#1ca37b] text-white hover:bg-[#19926e]"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              {job.status || "Unknown"}
            </Badge>
          </div>

          {/* Job Source Tag */}
          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-0.5 rounded-md dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/60">
              By UPPLY
            </span>
          </div>
        </div>

        {/* Metadata Grid (Location, Type, Time) */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-x-4 gap-y-2.5 text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">
          {job.location && (
            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 px-2.5 py-1 rounded-lg">
              <MapPin className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              {job.location}
            </span>
          )}
          {job.type && (
            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 px-2.5 py-1 rounded-lg">
              <Briefcase className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              {job.type}
            </span>
          )}
          <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/40 px-2.5 py-1 rounded-lg ml-auto">
            <Clock className="h-3.5 w-3.5 text-violet-400 shrink-0" />
            {getRelativeTime(job.createdDate || new Date())}
          </span>
        </div>
      </div>

      {/* ── Action Buttons Bottom Row ── */}
      <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-3 gap-2 w-full">
        
        {/* Applicants Button */}
        <Button
          size="sm"
          variant="outline"
          className="h-10 gap-1.5 text-xs font-bold rounded-xl border-slate-300 text-violet-600 bg-white hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300 dark:border-slate-800 dark:text-violet-400 shadow-sm"
          onClick={() => navigate(`/recruiter/jobs/${job.id}/applications`, { state: { jobTitle: job.title } })}
        >
          <Eye className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Applicants</span>
        </Button>

        {/* Pause / Resume Button */}
        <Button
          size="sm"
          variant="outline"
          disabled={actionLoading}
          className={cn(
            "h-10 gap-1.5 text-xs font-bold rounded-xl transition-all duration-300 shadow-sm",
            isPaused
              ? "border-emerald-200 text-emerald-600 bg-emerald-50/20 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
              : "border-amber-300 text-amber-600 bg-amber-50/20 hover:bg-amber-600 hover:text-white hover:border-amber-600"
          )}
          onClick={() => onAction(job.id, isPaused ? "resume" : "pause")}
        >
          {isPaused ? (
            <>
              <Play className="h-4 w-4 shrink-0" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 shrink-0" />
              <span>Pause</span>
            </>
          )}
        </Button>

        {/* Close Button */}
        <Button
          size="sm"
          variant="outline"
          disabled={actionLoading || isClosed}
          className="h-10 gap-1.5 text-xs font-bold rounded-xl border-red-300 text-red-600 bg-red-50/10 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 shadow-sm disabled:opacity-30 disabled:hover:bg-transparent"
          onClick={() => onAction(job.id, "close")}
        >
          <XCircle className="h-4 w-4 shrink-0" />
          <span>Close</span>
        </Button>
      </div>
    </motion.div>
  );
};
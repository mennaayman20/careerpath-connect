import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Briefcase, Clock, Building2, Globe,
  Eye, XCircle, Pause, Play, MessageSquare,
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
       "   rounded-3xl border border-slate-300 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 p-6 transition-all duration-300",
"hover:shadow-xl hover:border-violet-400 dark:hover:border-violet-500 backdrop-blur-sm flex flex-col justify-between"
      )}
    >

      {/* الجزء العلوي: العنوان وبادج الحالة */}
      <div className="flex items-start justify-between gap-4 ">
        <div>
          <h3 className="font-syne font-bold text-xl text-[#2D236A] dark:text-white leading-snug">
            {job.title}
          </h3>

          {job.organizationName && (
            <p className="mt-1.5 flex items-center gap-1.5 text-l text-slate-500 dark:text-slate-400">
              <Building2 className="h-3.5 w-3.5 text-violet-500" />
              {job.organizationName}
            </p>
          )}

          {/* مصدر الوظيفة */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-200/60 px-2 py-0.5 rounded-md dark:bg-violet-950/20 dark:text-violet-400 dark:border-violet-800">
              By UPPLY
            </span>
          </div>
        </div>

        {/* بادج الحالة يمين فوق */}
        <Badge
          className={cn(
            "px-3 py-1 text-[10px] font-semibold uppercase border-none tracking-wider rounded-lg shadow-sm shrink-0",
            !isClosed
              ? "bg-[#4da78c] text-white"
              : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
          )}
        >
          {job.status || "Unknown"}
        </Badge>
      </div>

      {/* الـ Meta Data (الموقع، النوع، الوقت) مصفوفة بشكل منظم قبل الأزرار مباشرة */}
      <div className="mt-4 pt-3 border-t border-slate-100/70 dark:border-white/5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
        {job.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-violet-400" />
            {job.location}
          </span>
        )}
        {job.type && (
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-violet-400" />
            {job.type}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-violet-400" />
          {getRelativeTime(job.createdDate || new Date())}
        </span>
      </div>

      {/* ── حاوية أزرار التحكم السفلية (تحت الداتا بالكامل) ── */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-2.5">
        
        {/* زر Ask AI */}
        <Button
          size="sm"
          variant="outline"
          className="h-10 gap-1.5 text-xs font-semibold rounded-xl border-[#1ca37b]/30 text-[#1ca37b] bg-[#1ca37b]/5 hover:bg-[#1ca37b] hover:text-white hover:border-[#1ca37b] transition-all duration-200"
          onClick={() => navigate(`/recruiter/jobs/${job.id}/chat`)}
        >
          <MessageSquare className="h-4 w-4" />
          Ask AI
        </Button>

        {/* زر View Applicants */}
        <Button
          size="sm"
          variant="outline"
          className="h-10 gap-1.5 text-xs font-semibold rounded-xl border-violet-200 text-violet-600 bg-violet-50/40 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-200 dark:border-violet-900 dark:text-violet-400"
          onClick={() => navigate(`/recruiter/jobs/${job.id}/applications`, { state: { jobTitle: job.title } })}
        >
          <Eye className="h-4 w-4" />
          Applicants
        </Button>

        {/* زر Pause / Resume */}
        <Button
          size="sm"
          variant="outline"
          disabled={actionLoading}
          className={cn(
            "h-10 gap-1.5 text-xs font-semibold rounded-xl transition-all duration-200",
            isPaused
              ? "border-green-200 text-green-600 bg-green-50/30 hover:bg-green-600 hover:text-white hover:border-green-600"
              : "border-amber-200 text-amber-600 bg-amber-50/30 hover:bg-amber-600 hover:text-white hover:border-amber-300"
          )}
          onClick={() => onAction(job.id, isPaused ? "resume" : "pause")}
        >
          {isPaused ? <><Play className="h-4 w-4" /> Resume</> : <><Pause className="h-4 w-4" /> Pause</>}
        </Button>

        {/* زر Close */}
        <Button
          size="sm"
          variant="outline"
          disabled={actionLoading || isClosed}
          className="h-10 gap-1.5 text-xs font-semibold rounded-xl border-red-200 text-red-600 bg-red-50/30 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-transparent"
          onClick={() => onAction(job.id, "close")}
        >
          <XCircle className="h-4 w-4" />
          Close
        </Button>
      </div>

    </motion.div>
  );
};
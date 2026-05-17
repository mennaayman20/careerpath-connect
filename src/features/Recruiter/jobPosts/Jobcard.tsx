import React, { useState } from "react";
import { Pencil, MapPin, Briefcase, Layers, Building2, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { JobResponse } from "../../../types/jobs";

interface JobCardProps {
  job: JobResponse;
  onEdit: (id: number) => void; // متوافقة تماماً الآن مع الـ Recruiter Page
  onPause: (id: number) => void;
  onResume: (id: number) => void;
  onClose: (id: number) => void;
  isEditing?: boolean; // 💡 تم إضافة هذا البروب ليتوافق مع كود الصفحة المطور
}

const STATUS_CONFIG = {
  OPEN: {
    label: "Open",
    dot: "bg-[#1ca37b] animate-pulse",
    badge: "bg-[#1ca37b]/10 text-[#1ca37b] border-[#1ca37b]/20",
    bar: "bg-[#1ca37b]",
  },
  PAUSED: {
    label: "Paused",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-600 border-amber-200",
    bar: "bg-amber-400",
  },
  CLOSED: {
    label: "Closed",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-500 border-slate-200",
    bar: "bg-slate-300",
  },
};

const MetaPill = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2D236A]/60 bg-[#2D236A]/5 px-2.5 py-1 rounded-full">
    <Icon size={11} className="shrink-0" />
    {text}
  </span>
);

const ActionBtn = ({
  label,
  variant,
  onClick,
  disabled = false,
}: {
  label: string;
  variant: "primary" | "warn" | "ghost" | "danger";
  onClick: () => void;
  disabled?: boolean;
}) => {
  const styles = {
    primary: "bg-[#2D236A] text-white hover:bg-[#1e1850] shadow-sm hover:shadow-md",
    warn: "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100",
    ghost: "bg-[#1ca37b]/10 text-[#1ca37b] border border-[#1ca37b]/20 hover:bg-[#1ca37b]/20",
    danger: "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {label}
    </button>
  );
};

export const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onPause, onResume, onClose, isEditing = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);

  const status = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG] ?? {
    label: job.status,
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-500 border-slate-200",
    bar: "bg-slate-300",
  };

  const isOpen = job.status === "OPEN";
  const isPaused = job.status === "PAUSED";
  const isClosed = job.status === "CLOSED";

  const handleClose = async () => {
    setClosing(true);
    await onClose(job.id);
    setClosing(false);
  };

  const visibleSkills = job.skills?.slice(0, 4) ?? [];
  const extraSkills = (job.skills?.length ?? 0) - 4;

  return (
    <div
      className={`group relative rounded-3xl border bg-white transition-all duration-300 overflow-hidden h-full flex flex-col justify-between
        ${isClosed
          ? "border-slate-100 opacity-70"
          : isEditing
            ? "border-violet-400 ring-4 ring-violet-500/10 shadow-lg" // تأثير الـ Editing المضيء المتناسق مع الصفحة
            : "border-[#2D236A]/10 hover:border-[#2D236A]/20 hover:shadow-[0_12px_40px_-12px_rgba(45,35,106,0.12)] hover:-translate-y-0.5"
        }`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] transition-all duration-500 ${status.bar}`} />

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${status.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                
                {isEditing && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#2D236A]/20 bg-[#2D236A]/5 text-[#2D236A]/60 animate-pulse">
                    Editing
                  </span>
                )}
              </div>
              
              <h3 className="font-syne text-[17px] font-bold text-[#1a1540] leading-snug truncate">
                {job.title}
              </h3>
              
              {job.organizationName && (
                <p className="text-xs text-[#2D236A]/40 font-medium mt-0.5 flex items-center gap-1">
                  <Building2 size={10} />{job.organizationName}
                </p>
              )}
            </div>
            
            {!isClosed && (
              <button
                onClick={() => onEdit(job.id)} // يمرر الـ id مباشرة للدالة بدون كسر أي كود خارجي
                className={`shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 
                  ${isEditing 
                    ? "bg-[#2D236A] text-white" 
                    : "bg-[#2D236A]/5 hover:bg-[#2D236A] text-[#2D236A]/40 hover:text-white group-hover:rotate-[-12deg]"
                  }`}
              >
                <Pencil size={15} />
              </button>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.type && <MetaPill icon={Briefcase} text={job.type} />}
            {job.seniority && <MetaPill icon={Layers} text={job.seniority} />}
            {job.model && <MetaPill icon={Layers} text={job.model} />}
            {job.location && <MetaPill icon={MapPin} text={job.location} />}
          </div>

          {/* Skills */}
          {visibleSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {visibleSkills.map((skill, i) => (
                <span key={i} className="text-[11px] font-semibold bg-[#1ca37b]/8 text-[#1ca37b] border border-[#1ca37b]/15 px-2.5 py-0.5 rounded-full">
                  {skill.skillName}
                </span>
              ))}
              {extraSkills > 0 && (
                <span className="text-[11px] font-semibold bg-slate-50 text-slate-400 border border-slate-100 px-2.5 py-0.5 rounded-full">
                  +{extraSkills} more
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {job.description && (
            <div className="mb-4">
              <p className={`text-xs text-[#2D236A]/50 leading-relaxed transition-all duration-300 ${expanded ? "" : "line-clamp-2"}`}>
                {job.description}
              </p>
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1 text-[11px] font-bold text-[#2D236A]/40 hover:text-[#2D236A] flex items-center gap-0.5 transition-colors"
              >
                {expanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Show more</>}
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
          <span className="text-[10px] text-[#2D236A]/30 font-medium flex items-center gap-1">
            <Calendar size={10} />
            {new Date(job.createdDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <div className="flex items-center gap-2">
            {isOpen && <ActionBtn label="Pause" variant="warn" onClick={() => onPause(job.id)} />}
            {isPaused && <ActionBtn label="Resume" variant="ghost" onClick={() => onResume(job.id)} />}
            {!isClosed && <ActionBtn label={closing ? "Closing…" : "Close"} variant="danger" onClick={handleClose} disabled={closing} />}
          </div>
        </div>
      </div>
    </div>
  );
};
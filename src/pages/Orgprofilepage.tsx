import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, MapPin, Users, Briefcase, Globe, Camera,
  Check, X, Pencil, ArrowLeft, Loader2, AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRecruiterOrg } from "@/features/org-connect/useRecruiterOrg";
import { useEditOrganization } from "@/features/org-connect/Useeditorganization";
import type { OrganizationResponse } from "@/features/org-connect/organization.interfaces";

// ─── Types ────────────────────────────────────────────────────────────────────

type EditableField = "name" | "industry" | "size" | "location" | "website" | "logoUrl";

interface FieldConfig {
  key: EditableField;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FIELDS: FieldConfig[] = [
  { key: "name",       label: "Organization Name", placeholder: "Acme Corp",         icon: <Building2 size={16} /> },
  { key: "industry",  label: "Industry",           placeholder: "Technology",        icon: <Briefcase size={16} /> },
  { key: "size",      label: "Company Size",       placeholder: "50–200 employees",   icon: <Users     size={16} /> },
  { key: "location",  label: "Location",           placeholder: "Cairo, Egypt",       icon: <MapPin    size={16} /> },
  { key: "website",   label: "Website",            placeholder: "https://acme.com",   icon: <Globe     size={16} />, type: "url" },
  { key: "logoUrl",   label: "Logo URL",           placeholder: "https://…/logo.png", icon: <Camera    size={16} />, type: "url" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function OrgAvatar({ name, logoUrl }: { name: string; logoUrl?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="relative shrink-0 z-20">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover ring-4 ring-white shadow-xl bg-white"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full  bg-gradient-to-br from-[#2D236A] to-[#322a66] flex items-center justify-center ring-4 ring-[#70daba] shadow-xl">
          <span className="font-syne text-3xl font-bold text-white">{initials}</span>
        </div>
      )}
    </div>
  );
}

function InlineField({
  config,
  value,
  isEditing,
  onChange,
  onSave,
  onCancel,
  onStartEdit,
  error,
  saving,
}: {
  config: FieldConfig;
  value: string;
  isEditing: boolean;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onStartEdit: () => void;
  error?: string;
  saving: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  return (
    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:border-[#2D236A]/10 flex flex-col justify-between min-h-[110px]">
      <div>
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#2D236A]/50 mb-2 font-syne">
          <span className="text-violet-500">{config.icon}</span>
          {config.label}
        </p>

        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              ref={inputRef}
              type={config.type ?? "text"}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={config.placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
                if (e.key === "Escape") onCancel();
              }}
              className="flex-1 rounded-xl border border-[#2D236A]/20 bg-white px-3 py-2.5 text-[15px] font-medium text-[#1a1540] focus:outline-none focus:ring-2 focus:ring-[#2D236A]/30 transition-all"
            />
            <button
              onClick={onSave}
              disabled={saving}
              className="w-10 h-10 rounded-xl bg-[#1ca37b] text-white flex items-center justify-center hover:bg-[#178a68] transition-colors disabled:opacity-60 shrink-0"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            </button>
            <button
              onClick={onCancel}
              className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={onStartEdit}
            className="flex items-center justify-between rounded-xl px-2 py-1.5 cursor-pointer hover:bg-[#2D236A]/10 transition-colors group/field"
          >
            <span className={`text-[15px] font-semibold tracking-tight ${value ? "text-[#1a1540]" : "text-slate-300"}`}>
              {value || config.placeholder}
            </span>
            <div className="w-7 h-7 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center opacity-0 group-hover/field:opacity-100 transition-opacity">
              <Pencil size={12} className="text-[#2D236A]/60" />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-2 font-medium">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6 p-8">
      <div className="flex gap-5">
        <div className="w-28 h-28 rounded-2xl bg-slate-200" />
        <div className="flex-1 space-y-3 pt-4">
          <div className="h-7 w-64 rounded-lg bg-slate-200" />
          <div className="h-4 w-40 rounded-lg bg-slate-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center shadow-sm">
        <AlertCircle className="text-red-400" size={32} />
      </div>
      <p className="text-base font-medium text-slate-500">Couldn't load your organization profile.</p>
      <button
        onClick={onRetry}
        className="text-sm font-bold text-[#2D236A] hover:underline uppercase tracking-wider"
      >
        Try again
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrganizationProfilePage() {
  const navigate = useNavigate();
  const { org, orgId, loading: orgLoading } = useRecruiterOrg();

  const [loadError, setLoadError] = useState(false);
  const [activeField, setActiveField] = useState<EditableField | null>(null);
  const [savedField, setSavedField] = useState<EditableField | null>(null);
  
  const activeFieldRef = useRef<EditableField | null>(null);
  const orgLoaded = useRef(false);
  
  // seed the edit hook once org loads
  const {
    form,
    errors,
    loading: saving,
    serverError,
    setField,
    submit,
    reset,
  } = useEditOrganization({
    organizationId: orgId ?? 0,
    initialData: org
      ? {
          name:     org.name,
          industry: org.industry,
          size:     org.size,
          location: org.location,
          website:  org.website,
          logoUrl:  org.logoUrl,
        }
      : {},
    onSuccess: (updated: OrganizationResponse) => {
      setSavedField(activeFieldRef.current); 
      setActiveField(null);
      setTimeout(() => setSavedField(null), 2000);
    },
  });

  // sync form when org data arrives
  useEffect(() => {
    if (org && !orgLoaded.current) {
      reset();
      orgLoaded.current = true;
    }
  }, [org?.id]);

  if (orgLoading) {
    return (
      <div className="min-h-screen bg-[#f6f5ff] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10">
          <div className="bg-white rounded-[32px] border border-[#2D236A]/8 overflow-hidden">
            <Skeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!org || loadError) {
    return (
      <div className="min-h-screen bg-[#f6f5ff] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10">
          <ErrorState onRetry={() => { setLoadError(false); window.location.reload(); }} />
        </main>
        <Footer />
      </div>
    );
  }

  const handleSave = async (field: EditableField) => {
    await submit();
  };

  const handleCancel = () => {
    if (org && activeField) {
      setField(activeField, (org[activeField as keyof typeof org] as string) ?? "");
    }
    setActiveField(null);
    activeFieldRef.current = null; 
  };

  return (
    <div className="min-h-screen bg-[#f6f5ff] flex flex-col">
      <Navbar />
<section className="relative bg-[#2D236A] overflow-hidden py-10 md:py-14 min-h-[180px] md:min-h-[220px] flex flex-col justify-center">
  {/* Radial Background Effect */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_120%_at_85%_50%,rgba(28,163,123,.2)_0%,transparent_70%)] pointer-events-none" />
  
  <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10">
    
    {/* زر العودة تم تعديل ألوانه ليكون واضحاً وقابلاً للقراءة فوق الخلفية الموف */}
    <button
      onClick={() => navigate("/recruiter-dashboard")}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors mb-4 md:mb-6 group"
    >
      <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
      Back to Dashboard
    </button>

    {/* المحتوى الرئيسي */}
    <div className="max-w-2xl">
      <div className="inline-flex items-center gap-2 bg-[#1ca37b]/15 border border-[#1ca37b]/35 text-[#5de8b8] text-[10px] font-bold uppercase rounded-full px-3 py-1 mb-3 font-syne tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] animate-pulse" /> 
        Verified Recruiter
      </div>
      
      <h1 className="font-syne text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
        Your <span className="text-[#59daad]">Organization Profile</span>
      </h1>
      
      <p className="text-xs md:text-sm text-white/60 max-w-md font-medium leading-relaxed">
        Build, manage, and refine your company profile to stand out to top talents.
      </p>
    </div>

  </div>
</section>
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
    
        className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-10"
      >


        {/* Card */}
        <div className="bg-white rounded-[32px] border border-[#2D236A]/8 overflow-hidden shadow-[0_12px_50px_-12px_rgba(45,35,106,0.08)]">

          {/* زيادة طول الـ Hero banner ليتناسب مع العرض الممتد */}
          <div className="relative h-44 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
          </div>

          {/* Profile header */}
          <div className="px-6 md:px-10 pb-8">
            
            {/* حل مشكلة عدم وضوح الاسم: تقليل الـ Negative Margin السلبي وضمان توزيع مرن يمنع الاختفاء */}
            <div className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-7 -mt-16 md:-mt-20 mb-8 z-10">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full min-w-0">
                
                {/* الأفاتار بحجم أكبر متناسق مع الواجهة الجديدة */}
                <OrgAvatar name={org.name} logoUrl={org.logoUrl} />
                
                {/* معلومات المؤسسة تملأ العرض المتاح مع تثبيت اسم واضح بخط كبير وكامل */}
                <div className="md:pb-2 min-w-0 flex-1">
                  <h1 className="font-syne text-3xl md:text-4xl font-extrabold text-[#1a1540] tracking-tight truncate drop-shadow-sm md:max-w-3xl">
                    {org.name}
                  </h1>
                  <p className="text-[15px] font-medium text-slate-500 mt-2 flex items-center gap-1.5">
                    <MapPin size={15} className="text-violet-500 shrink-0" />
                    {org.location || "Location not set"}
                  </p>
                </div>
              </div>

              {/* Saved badge */}
              <AnimatePresence>
                {savedField && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1ca37b]/10 text-[#1ca37b] text-xs font-bold shadow-sm shrink-0 self-start md:self-auto"
                  >
                    <Check size={14} /> SAVED SUCCESSFULLY
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-300 mb-8" />

            {/* Fields Grid Layout */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-4 bg-[#2D236A] rounded-full" />
                <p className="font-syne text-xs font-black uppercase tracking-[0.15em] text-[#2D236A]/70">
                  Organization Management Details
                </p>
              </div>

              {/* تحويل قائمة الحقول إلى نظام Grid ذكي ثلاثي/ثنائي الأعمدة لاستغلال المساحة الممتدة */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {FIELDS.map((field) => (
                  <InlineField
                    key={field.key}
                    config={field}
                    value={form[field.key] ?? ""}
                    isEditing={activeField === field.key}
                    onChange={(v) => setField(field.key, v)}
                    onSave={() => handleSave(field.key)}
                    onCancel={handleCancel}
                    onStartEdit={() => {
                      if (activeField && activeField !== field.key) handleCancel();
                      activeFieldRef.current = field.key; // تثبيت في الـ Ref أولاً
                      setActiveField(field.key);
                    }}
                    error={errors[field.key]}
                    saving={saving}
                  />
                ))}
              </div>
            </div>

            {/* Server error */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 flex items-center gap-2 text-sm font-medium text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100"
                >
                  <AlertCircle size={16} />
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer hint */}
          <div className="px-6 md:px-10 py-4 border-t border-slate-100 bg-slate-50/60">
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Pencil size={12} className="text-[#2D236A]/40" />
              Click any individual card above to update it inline. Changes will save automatically upon confirmation.
            </p>
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
import React, { useState, useEffect, KeyboardEvent } from "react";
import { X, Plus, Sparkles, Loader2 } from "lucide-react";
import { JobRequest, JobResponse , JobModel ,JobSeniority,JobType } from "../../../types/jobs";
import { jobsService } from "./Jobs.service";

interface JobPostFormProps {
  onSubmit: (payload: JobRequest) => Promise<boolean>;
  submitting: boolean;
  editingJob?: JobResponse | null;
  onCancelEdit?: () => void;
}

const INITIAL_FORM: JobRequest = {
  title: "",
  type: "",
  seniority: "",
  model: "",
  location: "",
  description: "",
  skillIds: [],
};

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field = ({
  label,
  required,
  error,
  hint,
  children,
  full = false,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div className={full ? "col-span-2" : ""}>
    <label className="block font-syne text-[11px] font-bold uppercase tracking-widest text-[#2D236A]/50 mb-1.5">
      {label}
      {required && <span className="text-[#1ca37b] ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-[11px] text-red-500 font-medium">{error}</p>}
    {hint && !error && <p className="mt-1 text-[11px] text-[#2D236A]/30">{hint}</p>}
  </div>
);

const inputCls =
  "w-full bg-[#f6f5ff] border border-[#2D236A]/10 rounded-2xl px-4 py-2.5 text-sm text-[#1a1540] font-medium placeholder:text-[#2D236A]/25 focus:outline-none focus:border-[#2D236A]/40 focus:bg-white transition-all duration-200";

const selectCls = inputCls + " cursor-pointer appearance-none";

// ─── Skill entry with real ID ─────────────────────────────────────────────────
interface SkillEntry {
  name: string;
  id: number | null;   // null = لسه بيتـresolve
  resolving: boolean;
  error?: string;
}

export const JobPostForm: React.FC<JobPostFormProps> = ({
  onSubmit,
  submitting,
  editingJob,
  onCancelEdit,
}) => {
  const [form, setForm] = useState<JobRequest>(INITIAL_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof JobRequest, string>>>({});

  // ── Sync form when editing ────────────────────────────────────────────────
// في ملف Jobpostform.tsx
useEffect(() => {
  if (editingJob) {
    // تأكدي من تحويل القيم القادمة من الـ API لتطابق خيارات الـ Select بالفورم
    const formattedType = editingJob.type ? editingJob.type.toUpperCase().replace("-", "_") : "";
    const formattedSeniority = editingJob.seniority ? editingJob.seniority.toUpperCase() : "";
    const formattedModel = editingJob.model ? editingJob.model.toUpperCase() : "";

    setForm({
      title: editingJob.title || "",
      type: formattedType as JobType, 
      seniority: formattedSeniority as JobSeniority, 
      model: formattedModel as JobModel,
      location: editingJob.location || "",
      description: editingJob.description || "", 
      skillIds: editingJob.skills?.map((s) => s.skillId) || [],
    });

    // تحديث مصفوفة المهارات المرئية داخل الفورم بالبيانات الجديدة
    if (editingJob.skills) {
      setSkills(
        editingJob.skills.map((s) => ({
          name: s.skillName,
          id: s.skillId,
          resolving: false,
        }))
      );
    }
  } else {
    // إذا أصبحت الـ editingJob تساوي null (عند إغلاق الفورم أو حفظه) نقوم بتصفيره
    resetForm();
  }
}, [editingJob]); // الـ useEffect سيشعر بأي تغيير يحدث في الـ editingJob ويحدث الفورم فوراً
console.log("Raw Editing Job Data:", editingJob);
  // ── Sync skillIds in form whenever skills list changes ───────────────────
  useEffect(() => {
    const resolvedIds = skills
      .filter((s) => s.id !== null)
      .map((s) => s.id as number);
    setForm((prev) => ({ ...prev, skillIds: resolvedIds }));
  }, [skills]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSkills([]);
    setSkillInput("");
    setErrors({});
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof JobRequest, string>> = {};
    if (!form.title || form.title.length < 3) e.title = "Title must be at least 3 characters";
    if (!form.type) e.type = "Job type is required";
    if (!form.seniority) e.seniority = "Seniority is required";
    if (!form.model) e.model = "Work model is required";
    if (!form.description || form.description.length < 20)
      e.description = "Description must be at least 20 characters";

    const stillResolving = skills.some((s) => s.resolving);
    const hasErrors = skills.some((s) => s.error);
    const resolvedIds = skills.filter((s) => s.id !== null);

    if (stillResolving) {
      e.skillIds = "Skills are still loading, please wait…";
    } else if (hasErrors) {
      e.skillIds = "Some skills couldn't be added, remove them and try again";
    } else if (resolvedIds.length === 0) {
      e.skillIds = "At least one skill is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof JobRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Add skill: resolve against backend ───────────────────────────────────
  const addSkill = async () => {
    const name = skillInput.trim().replace(/,/g, "");
    if (!name) return;
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;

    setSkillInput("");
    if (errors.skillIds) setErrors((prev) => ({ ...prev, skillIds: undefined }));

    // أضيف الـ entry فورًا بـ resolving = true
    const entry: SkillEntry = { name, id: null, resolving: true };
    setSkills((prev) => [...prev, entry]);

    // Resolve من الـ backend
    const res = await jobsService.resolveSkillIds([name]);

    if (res.error || res.ids.length === 0) {
      setSkills((prev) =>
        prev.map((s) =>
          s.name === name && s.resolving
            ? { ...s, resolving: false, error: res.error || "Failed" }
            : s
        )
      );
    } else {
      setSkills((prev) =>
        prev.map((s) =>
          s.name === name && s.resolving
            ? { ...s, resolving: false, id: res.ids[0] }
            : s
        )
      );
    }
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
    if (e.key === "Backspace" && !skillInput && skills.length) {
      // حذف آخر skill لو المدخل فاضي
      const last = skills[skills.length - 1];
      if (!last.resolving) removeSkill(skills.length - 1);
    }
  };

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const success = await onSubmit(form);
    if (success) resetForm();
  };

  const isEditing = !!editingJob;

  return (
    <div className="space-y-6">
      {/* Form header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#2D236A]/8 flex items-center justify-center">
          <Sparkles size={14} className="text-[#2D236A]/60" />
        </div>
        <div>
          <p className="font-syne text-[10px] font-bold uppercase tracking-widest text-[#2D236A]/40">
            {isEditing ? "Edit listing" : "New listing"}
          </p>
        </div>
      </div>

      {/* Grid fields */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        <Field
          label="Job Title"
          required
          error={errors.title}
          hint={form.title.length > 0 ? `${form.title.length}/100` : undefined}
        >
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
            maxLength={100}
            className={inputCls}
          />
        </Field>

        <Field label="Location">
          <input
            type="text"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="e.g. Cairo, Egypt or Remote"
            maxLength={150}
            className={inputCls}
          />
        </Field>

<Field label="Job Type" required error={errors.type}>
  <select
    value={form.type}
    onChange={(e) => handleChange("type", e.target.value)}
    className={selectCls}
  >
    <option value="">Select Job Type</option>
    <option value="FULL_TIME">Full Time</option>
    <option value="PART_TIME">Part Time</option>
    
    <option value="INTERNSHIP">Internship</option>
  </select>
</Field>

<Field label="Seniority" required error={errors.seniority}>
  <select
    value={form.seniority}
    onChange={(e) => handleChange("seniority", e.target.value)}
    className={selectCls}
  >
    <option value="">Select level…</option>
    <option value={JobSeniority.INTERN}>Intern</option>
    <option value={JobSeniority.JUNIOR}>Junior</option>
    <option value={JobSeniority.MID}>Mid-level</option>
    <option value={JobSeniority.SENIOR}>Senior</option>
    <option value={JobSeniority.LEAD}>Lead</option>
    <option value={JobSeniority.MANAGER}>Manager</option>
  </select>
</Field>

<Field label="Work Model" required error={errors.model}>
  <select
    value={form.model}
    onChange={(e) => handleChange("model", e.target.value)}
    className={selectCls}
  >
    <option value="">Select model…</option>
    <option value={JobModel.ONSITE}>On-site</option>
    <option value={JobModel.HYBRID}>Hybrid</option>
    <option value={JobModel.REMOTE}>Remote</option>
  </select>
</Field>

        <Field
          label="Description"
          required
          error={errors.description}
          hint={`${form.description.length}/5000 (min 20)`}
          full
        >
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe the role, responsibilities, and what makes this position unique…"
            maxLength={5000}
            rows={4}
            className={inputCls + " resize-none"}
          />
        </Field>

        {/* ── Skills field ──────────────────────────────────────────────── */}
        <Field
          label="Required Skills"
          required
          error={errors.skillIds}
          full
        >
          <div
            className={`flex flex-wrap gap-2 min-h-[44px] bg-[#f6f5ff] border rounded-2xl px-3 py-2 transition-all duration-200 focus-within:border-[#2D236A]/40 focus-within:bg-white
              ${errors.skillIds ? "border-red-300" : "border-[#2D236A]/10"}`}
          >
            {skills.map((s, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all
                  ${s.error
                    ? "bg-red-50 text-red-500 border-red-200"
                    : s.resolving
                    ? "bg-[#2D236A]/5 text-[#2D236A]/40 border-[#2D236A]/10"
                    : "bg-[#1ca37b]/10 text-[#1ca37b] border-[#1ca37b]/20"
                  }`}
              >
                {/* Spinner while resolving */}
                {s.resolving && (
                  <Loader2 size={10} className="animate-spin shrink-0" />
                )}
                {s.name}
                {/* Remove button — مش متاح وهو بيتـresolve */}
                {!s.resolving && (
                  <button
                    type="button"
                    onClick={() => removeSkill(i)}
                    className="hover:text-red-500 transition-colors ml-0.5"
                    title="Remove skill"
                  >
                    <X size={10} />
                  </button>
                )}
              </span>
            ))}

            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder={skills.length === 0 ? "Type a skill and press Enter…" : ""}
              className="flex-1 min-w-[140px] bg-transparent text-sm text-[#1a1540] font-medium placeholder:text-[#2D236A]/25 focus:outline-none"
            />
          </div>
          <p className="mt-1 text-[10px] text-[#2D236A]/30">
            Press Enter or comma to add · Skills are resolved automatically from the system
          </p>
        </Field>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2D236A]/5">
        {isEditing && (
          <button
            onClick={onCancelEdit}
            className="text-sm font-bold text-[#2D236A]/40 hover:text-[#2D236A] transition-colors px-4 py-2 rounded-xl hover:bg-[#2D236A]/5"
          >
            Cancel
          </button>
        )}
        <button
          onClick={resetForm}
          className="text-sm font-bold text-[#2D236A]/40 hover:text-[#2D236A] transition-colors px-4 py-2 rounded-xl hover:bg-[#2D236A]/5"
        >
          Reset
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || skills.some((s) => s.resolving)}
          className="inline-flex items-center gap-2 bg-[#2D236A] hover:bg-[#1e1850] text-white text-sm font-bold px-6 py-2.5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isEditing ? "Saving…" : "Posting…"}
            </span>
          ) : skills.some((s) => s.resolving) ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Resolving skills…
            </span>
          ) : (
            <>
              <Plus size={15} />
              {isEditing ? "Save Changes" : "Post Job"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
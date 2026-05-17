"use client";

import { useEditOrganization } from "./Useeditorganization";
import type { OrganizationUpdateRequest } from "./Organization update.interfaces ";
import type { OrganizationResponse } from "./organization.interfaces";

// ─── Shared field primitives ──────────────────────────────────────────────────

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-white/50">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
      {!error && hint && <p className="text-xs text-white/30">{hint}</p>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  maxLength,
  hasError,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  hasError?: boolean;
  type?: string;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 outline-none transition-all duration-200
          ${hasError
            ? "border-red-400/60 focus:border-red-400"
            : "border-white/10 focus:border-[#2DD4BF]/60 focus:bg-white/8"
          }`}
      />
      {maxLength && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 4,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  hasError?: boolean;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 outline-none transition-all duration-200 resize-none
          ${hasError
            ? "border-red-400/60 focus:border-red-400"
            : "border-white/10 focus:border-[#2DD4BF]/60 focus:bg-white/8"
          }`}
      />
      {maxLength && (
        <span className="absolute right-3 bottom-3 text-[10px] text-white/20">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

// ─── Logo preview ─────────────────────────────────────────────────────────────

function LogoPreview({ url }: { url: string }) {
  if (!url.trim()) return null;
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
        <img
          src={url}
          alt="Logo preview"
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <span className="text-xs text-white/30">Logo preview</span>
    </div>
  );
}

// ─── Industry & Size selects ──────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  "Technology", "Finance", "Healthcare", "Education", "Retail",
  "Manufacturing", "Consulting", "Media", "Real Estate", "Other",
];

const SIZE_OPTIONS = ["1–10", "11–50", "51–200", "201–500", "501–1000", "1000+"];

// ─── Main component ───────────────────────────────────────────────────────────

interface EditOrganizationFormProps {
  organizationId: number;
  initialData?: Partial<OrganizationUpdateRequest>;
  /** Fired after a successful PATCH — receives the updated org */
  onSuccess?: (updated: OrganizationResponse) => void;
  /** Show cancel button */
  onCancel?: () => void;
}

export function EditOrganizationForm({
  organizationId,
  initialData,
  onSuccess,
  onCancel,
}: EditOrganizationFormProps) {
  const { form, errors, loading, serverError, saved, setField, submit, reset } =
    useEditOrganization({ organizationId, initialData, onSuccess });

  const f = <K extends keyof OrganizationUpdateRequest>(key: K) =>
    (val: OrganizationUpdateRequest[K]) => setField(key, val);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Edit Organization</h2>
        <p className="text-sm text-white/40 mt-1">
          Update your company profile. Changes apply immediately after saving.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* ── Basic info ── */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
          <p className="text-xs font-bold tracking-widest uppercase text-[#2DD4BF]/70">
            Basic Info
          </p>

          <Field label="Company Name" error={errors.name} hint="2–100 characters">
            <TextInput
              value={form.name ?? ""}
              onChange={f("name")}
              placeholder="Acme Corp"
              maxLength={100}
              hasError={!!errors.name}
            />
          </Field>

          <Field label="Description" error={errors.description} hint="Up to 1000 characters">
            <TextArea
              value={form.description ?? ""}
              onChange={f("description")}
              placeholder="Tell candidates what your company does, your mission, and culture..."
              maxLength={1000}
              rows={5}
              hasError={!!errors.description}
            />
          </Field>
        </div>

        {/* ── Online presence ── */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
          <p className="text-xs font-bold tracking-widest uppercase text-[#2DD4BF]/70">
            Online Presence
          </p>

          <Field label="Website" error={errors.website} hint="https://yourcompany.com">
            <TextInput
              value={form.website ?? ""}
              onChange={f("website")}
              placeholder="https://acmecorp.com"
              maxLength={255}
              hasError={!!errors.website}
            />
          </Field>

          <Field label="Logo URL" error={errors.logoUrl} hint="Direct link to your logo image">
            <TextInput
              value={form.logoUrl ?? ""}
              onChange={f("logoUrl")}
              placeholder="https://acmecorp.com/logo.png"
              hasError={!!errors.logoUrl}
            />
            <LogoPreview url={form.logoUrl ?? ""} />
          </Field>
        </div>

        {/* ── Company details ── */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
          <p className="text-xs font-bold tracking-widest uppercase text-[#2DD4BF]/70">
            Company Details
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Industry" error={errors.industry}>
              <select
                value={form.industry ?? ""}
                onChange={(e) => setField("industry", e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-[#2DD4BF]/60 rounded-lg px-4 py-3 text-white text-sm outline-none transition-all duration-200 appearance-none"
              >
                <option value="" className="bg-[#0F1642]">Select industry</option>
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#0F1642]">{opt}</option>
                ))}
              </select>
            </Field>

            <Field label="Location" error={errors.location} hint="City, Country">
              <TextInput
                value={form.location ?? ""}
                onChange={f("location")}
                placeholder="New York, NY"
                maxLength={150}
                hasError={!!errors.location}
              />
            </Field>
          </div>

          <Field label="Company Size" error={errors.size}>
            <div className="grid grid-cols-3 gap-2">
              {SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setField("size", opt)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    form.size === opt
                      ? "bg-[#2DD4BF]/15 border-[#2DD4BF] text-[#2DD4BF]"
                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/70"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* ── Server error ── */}
        {serverError && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-red-300 leading-relaxed">{serverError}</p>
          </div>
        )}

        {/* ── Success toast ── */}
        {saved && (
          <div className="flex items-center gap-2 bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-[#2DD4BF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xs text-[#2DD4BF] font-semibold">Organization updated successfully.</p>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-1">
          {onCancel && (
            <button
              onClick={() => { reset(); onCancel(); }}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold text-sm py-3.5 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
          )}
          <button
            onClick={submit}
            disabled={loading}
            className="flex-[2] bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 disabled:opacity-40 disabled:cursor-not-allowed text-[#0F1642] font-bold text-sm py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#0F1642]/30 border-t-[#0F1642] rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditOrganizationForm;
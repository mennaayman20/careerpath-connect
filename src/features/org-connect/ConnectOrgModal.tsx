"use client";

import { useEffect, useRef, useState } from "react";
import { useConnectOrg } from "../org-connect/useConnectOrg";
import type { OrganizationDetails } from "../org-connect/organization.interfaces";
import { useRecruiterOrg } from "./useRecruiterOrg";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              i < current
                ? "bg-[#2DD4BF] w-6"
                : i === current
                ? "bg-[#2DD4BF] w-8"
                : "bg-white/20 w-6"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  maxLength,
  hint,
  autoFocus,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  maxLength?: number;
  hint?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-white/50">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-white/25 text-sm outline-none transition-all duration-200
          ${error ? "border-red-400/60 focus:border-red-400" : "border-white/10 focus:border-[#2DD4BF]/60 focus:bg-white/8"}`}
      />
      {hint && <p className="text-xs text-white/35 mt-0.5">{hint}</p>}
    </div>
  );
}

// ─── Screen: Email Input ──────────────────────────────────────────────────────

function EmailStep({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (email: string) => void;
  loading: boolean;
  error: string | null;
}) {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-[#2DD4BF] mb-2">
          Step 1 of 3
        </p>
        <h2 className="text-2xl font-bold text-white leading-tight">
          Enter your work email
        </h2>
        <p className="text-sm text-white/45 mt-2 leading-relaxed">
          We'll use this to verify your organization. Public email providers like
          Gmail aren't accepted.
        </p>
      </div>

      <InputField
        label="Business Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@company.com"
        error={!!error}
        autoFocus
      />

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-red-300 leading-relaxed">{error}</p>
        </div>
      )}

      <button
        onClick={() => onSubmit(email)}
        disabled={loading || !email.trim()}
        className="w-full bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 disabled:opacity-40 disabled:cursor-not-allowed text-[#0F1642] font-bold text-sm py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-[#0F1642]/30 border-t-[#0F1642] rounded-full animate-spin" />
            Checking...
          </>
        ) : (
          <>
            Continue
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}

// ─── Screen: Org Details ──────────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  "Technology", "Finance", "Healthcare", "Education", "Retail",
  "Manufacturing", "Consulting", "Media", "Real Estate", "Other",
];

const SIZE_OPTIONS = [
  "1–10", "11–50", "51–200", "201–500", "501–1000", "1000+",
];

function OrgDetailsStep({
  onSubmit,
  onBack,
  loading,
  error,
}: {
  onSubmit: (details: Partial<OrganizationDetails>) => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<Partial<OrganizationDetails>>({
    name: "",
    industry: "",
    size: "",
    location: "",
  });

  const set = (key: keyof OrganizationDetails) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-[#2DD4BF] mb-2">
          Step 2 of 3
        </p>
        <h2 className="text-2xl font-bold text-white leading-tight">
          Tell us about your organization
        </h2>
        <p className="text-sm text-white/45 mt-2 leading-relaxed">
          Your company isn't in our system yet. Fill in the details below and we'll
          create your organization profile.
        </p>
      </div>

      <InputField
        label="Company Name"
        value={form.name ?? ""}
        onChange={set("name")}
        placeholder="Acme Corp"
        maxLength={100}
        hint="2–100 characters"
        error={!!error && !form.name?.trim()}
        autoFocus
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-widest uppercase text-white/50">
          Industry
        </label>
        <select
          value={form.industry ?? ""}
          onChange={(e) => set("industry")(e.target.value)}
          className="w-full bg-white/5 border border-white/10 focus:border-[#2DD4BF]/60 rounded-lg px-4 py-3 text-white text-sm outline-none transition-all duration-200 appearance-none"
        >
          <option value="" disabled className="bg-[#0F1642]">Select industry</option>
          {INDUSTRY_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-[#0F1642]">{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold tracking-widest uppercase text-white/50">
          Company Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => set("size")(opt)}
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
      </div>

      <InputField
        label="Location"
        value={form.location ?? ""}
        onChange={set("location")}
        placeholder="New York, NY"
        maxLength={150}
        hint="City, Country"
      />

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-red-300 leading-relaxed">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          onClick={onBack}
          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-semibold text-sm py-3.5 rounded-lg transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={() => onSubmit(form)}
          disabled={loading}
          className="flex-[2] bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 disabled:opacity-40 disabled:cursor-not-allowed text-[#0F1642] font-bold text-sm py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-[#0F1642]/30 border-t-[#0F1642] rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            "Send Verification Email"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Email Sent ───────────────────────────────────────────────────────

function EmailSentStep({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-[#2DD4BF]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-[#2DD4BF] mb-2">
          Step 3 of 3
        </p>
        <h2 className="text-2xl font-bold text-white">Check your inbox</h2>
        <p className="text-sm text-white/45 mt-3 leading-relaxed max-w-xs mx-auto">
          We've sent a verification link to{" "}
          <span className="text-white font-semibold">{email}</span>.
          Click the link — it'll open this app and complete your connection
          automatically.
        </p>
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-left">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          What happens next
        </p>
        <div className="flex flex-col gap-3">
          {[
            "Open the verification email we sent you",
            "Click the link — you'll be redirected back here",
            "Your organization connection completes automatically",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-[#2DD4BF]">{i + 1}</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onBack}
        className="text-xs text-white/35 hover:text-white/60 transition-colors underline underline-offset-2"
      >
        Use a different email
      </button>
    </div>
  );
}

// ─── Screen: Connected ────────────────────────────────────────────────────────

function ConnectedStep({
  orgName,
  onDone,
}: {
  orgName: string;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-2xl bg-[#2DD4BF]/20 animate-ping" />
        <div className="relative w-16 h-16 rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white">You're connected!</h2>
        <p className="text-sm text-white/45 mt-2 leading-relaxed">
          Successfully linked to{" "}
          <span className="text-white font-semibold">{orgName}</span>. You can now
          create and manage job listings.
        </p>
      </div>

      <button
        onClick={onDone}
        className="w-full bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#0F1642] font-bold text-sm py-3.5 rounded-lg transition-all duration-200"
      >
        Post a Job Now →
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface ConnectOrgModalProps {
  /** Called when connection is established — passes the new orgId */
  onConnected?: (org: import("../org-connect/organization.interfaces").OrganizationResponse) => void;
  /** Called when the modal is dismissed */
  onClose?: () => void;
}

export function ConnectOrgModal({ onConnected, onClose }: ConnectOrgModalProps) {
        const { onOrgConnected } = useRecruiterOrg(); // ← أضف ده

  const { state, startFlow, submitEmail, submitOrgDetails, goBack, reset } = useConnectOrg();
    

  const overlayRef = useRef<HTMLDivElement>(null);

  // Auto-start on mount
  useEffect(() => {
    startFlow();
  }, [startFlow]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      reset();
      onClose?.();
    }
  };

  const stepIndex = {
    idle: 0,
    email_input: 0,
    org_details: 1,
    email_sent: 2,
    verifying: 2,
    connected: 2,
    error: 2,
  }[state.step];

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md bg-[#0F1642] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top gradient accent */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#2DD4BF]/50 to-transparent" />

        {/* Close button */}
        <button
          onClick={() => { reset(); onClose?.(); }}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all z-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-7">
          {/* Progress */}
          {state.step !== "connected" && (
            <StepIndicator current={stepIndex} total={3} />
          )}

          {/* Step screens */}
          {state.step === "email_input" && (
            <EmailStep
              onSubmit={submitEmail}
              loading={state.loading}
              error={state.error}
            />
          )}

          {state.step === "org_details" && (
            <OrgDetailsStep
              onSubmit={submitOrgDetails}
              onBack={goBack}
              loading={state.loading}
              error={state.error}
            />
          )}

{state.step === "email_sent" && (
  <EmailSentStep
    email={state.businessEmail}
    onBack={goBack}
  />
)}

          {state.step === "verifying" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <span className="w-10 h-10 border-2 border-white/10 border-t-[#2DD4BF] rounded-full animate-spin" />
              <p className="text-sm text-white/50">Verifying your email...</p>
            </div>
          )}

{state.step === "connected" && (
  <ConnectedStep
    orgName={state.connectedOrg?.name ?? "your organization"}
    onDone={() => {
      if (state.connectedOrg) {
        onOrgConnected(state.connectedOrg);  // ← ده بيحفظ الـ id
        onConnected?.(state.connectedOrg);
      }
    }}
  />
)}

          {state.step === "error" && (
            <div className="flex flex-col gap-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                <p className="text-sm font-semibold text-red-300 mb-1">
                  Verification failed
                </p>
                <p className="text-xs text-red-300/70 leading-relaxed">{state.error}</p>
              </div>
              <button
                onClick={reset}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-semibold text-sm py-3 rounded-lg transition-all"
              >
                Start over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConnectOrgModal;
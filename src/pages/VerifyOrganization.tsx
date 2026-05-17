// pages/VerifyOrganization.tsx

import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useConnectOrg } from "../features/org-connect/useConnectOrg";

export default function VerifyOrganization() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state, verifyEmail } = useConnectOrg();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyEmail(token);
    }
  }, []);

  // ── بعد نجاح الـ verify ──────────────────────────────────────────
  useEffect(() => {
    if (state.step === "connected") {
      // احفظ الـ org في localStorage
      if (state.connectedOrg) {
        localStorage.setItem("organizationId", String(state.connectedOrg.id));
      }
      // بعد ثانيتين روح للداشبورد
      setTimeout(() => navigate("/recruiter-dashboard"), 2000);
    }
  }, [state.step]);

  return (
    <div className="min-h-screen bg-[#f6f5ff] flex items-center justify-center">
        
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center flex flex-col items-center gap-6">
        
        {/* Loading */}
        {state.step === "verifying" && (
          <>
            <span className="w-12 h-12 border-4 border-[#2D236A]/20 border-t-[#2D236A] rounded-full animate-spin" />
            <p className="text-[#2D236A] font-semibold">Verifying your email...</p>
          </>
        )}

        {/* Success */}
        {state.step === "connected" && (
          <>
            <div className="w-16 h-16 rounded-full bg-[#1ca37b]/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#1ca37b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1a1540]">You're connected!</h2>
              <p className="text-sm text-slate-400 mt-1">
                Linked to <span className="font-semibold text-[#2D236A]">{state.connectedOrg?.name}</span>
              </p>
              <p className="text-xs text-slate-300 mt-3">Redirecting to dashboard...</p>
            </div>
          </>
        )}

        {/* Error */}
        {state.step === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1a1540]">Verification failed</h2>
              <p className="text-sm text-red-400 mt-1">{state.error}</p>
              <p className="text-xs text-slate-300 mt-1">The link may have expired.</p>
            </div>
            <button
              onClick={() => navigate("/recruiter-dashboard")}
              className="bg-[#2D236A] text-white text-sm font-semibold px-6 py-2.5 rounded-lg"
            >
              Back to Dashboard
            </button>
          </>
        )}

      </div>
    </div>
  );
}
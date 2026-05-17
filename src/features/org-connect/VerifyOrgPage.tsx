import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useConnectOrg } from "../org-connect/useConnectOrg";
import { useRecruiterOrg } from "../org-connect/useRecruiterOrg";

export default function VerifyOrgPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, state } = useConnectOrg();
  const { onOrgConnected } = useRecruiterOrg();
  const didRun = useRef(false);

  useEffect(() => {
    // نتأكد إننا ما نكلمش الـ API أكتر من مرة (StrictMode double-invoke)
    if (didRun.current) return;
    didRun.current = true;

    const token = searchParams.get("token");
    if (!token) {
      navigate("/recruiter/dashboard", { replace: true });
      return;
    }
    verifyEmail(token);
  }, [searchParams, verifyEmail, navigate]);

  // بعد الـ verify ينجح
  useEffect(() => {
    if (state.step === "connected" && state.connectedOrg) {
      onOrgConnected(state.connectedOrg);
      // انتظر ثانية عشان المستخدم يشوف رسالة النجاح
      const t = setTimeout(() => {
        navigate(`/organization/${state.connectedOrg!.id}`, { replace: true });
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [state.step, state.connectedOrg, onOrgConnected, navigate]);

  return (
    <div className="min-h-screen bg-[#0F1642] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center">
        {state.step === "verifying" && (
          <>
            <span className="inline-block w-10 h-10 border-2 border-white/10 border-t-[#2DD4BF] rounded-full animate-spin mb-4" />
            <p className="text-white font-semibold">Verifying your email...</p>
            <p className="text-sm text-white/40 mt-2">Just a moment</p>
          </>
        )}

        {state.step === "connected" && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#2DD4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white font-bold text-lg">You're connected!</p>
            <p className="text-sm text-white/40 mt-2">
              Redirecting to{" "}
              <span className="text-white">{state.connectedOrg?.name}</span>...
            </p>
          </>
        )}

        {state.step === "error" && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-white font-bold text-lg">Verification failed</p>
            <p className="text-sm text-red-300/70 mt-2">{state.error}</p>
            <button
              onClick={() => navigate("/recruiter/dashboard", { replace: true })}
              className="mt-6 text-xs text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
            >
              Back to dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
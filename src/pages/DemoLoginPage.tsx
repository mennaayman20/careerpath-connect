import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import organizationService from "../features/org-connect/organization.service";
import { AlertCircle, Loader2 } from "lucide-react";

export const DemoLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("Preparing your demo session...");
  const [subMessage, setSubMessage] = useState("Please wait while we set up your workspace.");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const autoLoginDemo = async () => {
      try {
        // Your actual credentials
        const demoEmail = "mennaayman200004@gmail.com";
        const demoPassword = "Menna2004@";  
  
        const ok = await login(demoEmail, demoPassword);

        if (!ok) {
          throw new Error("Invalid demo credentials");
        }

        setStatusMessage("Authorizing access...");
        setSubMessage("Verifying account permissions and profile status.");

        try {
          const org = await organizationService.getMyOrganization();
          if (org) {
            // Organization account found -> Redirect to home/recruiter portal
            navigate("/", { replace: true });
          } else {
            // Standard candidate account -> Redirect to jobs
            navigate("/jobs", { replace: true });
          }
        } catch (orgError) {
          console.warn("Organization check failed, defaulting to regular user:", orgError);
          // Fallback redirect if organization check fails
          navigate("/jobs", { replace: true });
        }

      } catch (err) {
        console.error("Demo Login Error:", err);
        setHasError(true);
        setStatusMessage("Authentication Failed");
        setSubMessage("Unable to access the demo account automatically. Redirecting to standard login...");
        
        // Redirect to standard login form on failure after 3.5 seconds
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3500);
      }
    };

    autoLoginDemo();
  }, [login, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2D236A] px-6 relative overflow-hidden selection:bg-purple-500/30">
      
      {/* Premium background decorative blur effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      {/* Main card container */}
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-center flex flex-col items-center gap-6">
        
        {/* Animated Brand Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-wider text-white font-display bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text">
            UPPLY
          </h1>
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto" />
        </div>

        {/* Dynamic Status Icon Indicator */}
        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white/[0.02] border border-white/5 shadow-inner relative">
          {!hasError ? (
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-purple-400/30 animate-ping p-8" />
              <Loader2 className="h-10 w-10 text-purple-400 animate-spin relative z-10" />
            </div>
          ) : (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-full animate-pulse border border-red-500/20">
              <AlertCircle className="h-8 w-8" />
            </div>
          )}
        </div>
        
        {/* Texts section */}
        <div className="space-y-2">
          <h2 className={`text-xl font-bold tracking-tight transition-colors duration-300 ${hasError ? "text-red-400" : "text-white"}`}>
            {statusMessage}
          </h2>
          <p className="text-sm leading-relaxed text-purple-100/60 max-w-xs mx-auto">
            {subMessage}
          </p>
        </div>

        {/* Footer branding note */}
        {!hasError && (
          <div className="mt-2 text-[11px] font-medium tracking-widest text-purple-300/30 uppercase">
            Instant Demo Experience
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoLoginPage;
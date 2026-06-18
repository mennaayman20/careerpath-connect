import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { ConnectOrgModal } from "../../features/org-connect/ConnectOrgModal";
import { useRecruiterOrg } from "../../features/org-connect/useRecruiterOrg";
import type { OrganizationResponse } from "../../features/org-connect/organization.interfaces";
import { useJobs } from "./jobPosts/Usejobs.hook";
import AiButton from '@/components/ui/AiButton';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const handleCreateInterview = () => {
  console.log("الركروتر ضغط على الزرار! افتحي الـ Modal هنا 🚀");
};
  
const COLORS = {
  navy: {
    border: "border-[#2D236A]/30 hover:border-[#2D236A]/50",
    gradient: "from-[#2D236A] to-[#1a1540]",
    accent: "bg-[#2D236A]",
    arrowActive: "bg-white text-[#2D236A]",
  },
  green: {
    border: "border-[#1ca37b]/45 hover:border-[#1ca37b]/70",
    gradient: "from-[#1ca37b] to-[#106b50]",
    accent: "bg-[#1ca37b]",
    arrowActive: "bg-white text-[#1ca37b]",
  },
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const Stat = ({ num, label }: { num: string; label: string }) => (
  <div className="flex flex-col items-center px-6 first:pl-0 last:pr-0 border-r border-white/10 last:border-0">
    <span className="font-syne text-2xl font-extrabold text-white leading-none">{num}</span>
    <span className="text-[10px] font-semibold tracking-widest uppercase text-white/40 mt-1">{label}</span>
  </div>
);

const TipItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-xs text-black/70">
    <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] shrink-0" />
    {text}
  </div>
);

function DashCard({
  step, title, subtitle, description, cta, accent, isActive, onClick,
}: {
  step: string; title: string; subtitle: string; description: string;
  cta: string; accent: "navy" | "green"; isActive: boolean; onClick: () => void;
}) {
  const theme = accent === "green" ? COLORS.green : COLORS.navy;

  return (
    <button
      onClick={onClick}
      className={`group relative flex-1 min-w-0 text-left rounded-[28px] border-2 transition-all duration-500 ease-in-out focus:outline-none overflow-hidden flex flex-col justify-between h-full
      ${isActive
        ? `shadow-[0_24px_50px_-12px_rgba(45,35,106,0.25)] -translate-y-1.5 border-transparent text-white`
        : `bg-white text-[#1a1540] shadow-[0_8px_24px_rgba(45,35,106,0.04)] hover:shadow-[0_24px_48px_-10px_rgba(45,35,106,0.15)] hover:-translate-y-1.5 hover:border-transparent ${theme.border}`
      }`}
    >
      {/* Dynamic Smooth Background Layer */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} transition-opacity duration-500 ease-in-out pointer-events-none
        ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} 
      />

      {/* Huge Background Number Deco */}
      <span className={`absolute top-4 right-6 font-syne text-6xl font-black tracking-tighter select-none pointer-events-none transition-all duration-500 ease-in-out
        ${isActive 
          ? "text-white opacity-[0.07] scale-105" 
          : "text-[#2D236A] opacity-[0.05] group-hover:text-white group-hover:opacity-[0.08] group-hover:scale-105"}`}
      >
        {step}
      </span>

      {/* Card Top / Header */}
      <div className="relative p-7 w-full z-10 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          {/* <span className={`font-syne text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border transition-all duration-500 ease-in-out
            ${isActive
              ? "bg-white/10 text-white border-white/10"
              : "bg-slate-100 border-slate-300 text-slate-500 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/10"}`}>
            Step {step}
          </span> */}
        </div>

        {/* Card Body */}
        <div className="flex-1">
          <p className={`font-syne text-[10px] font-bold uppercase tracking-widest mb-1.5 transition-colors duration-500 ease-in-out
            ${isActive ? "text-white/60" : "text-slate-500 group-hover:text-white/70"}`}>
            {subtitle}
          </p>
          <h3 className={`font-syne text-xl font-black tracking-tight mb-3 transition-colors duration-500 ease-in-out
            ${isActive ? "text-white" : "text-[#1a1540] group-hover:text-white"}`}>
            {title}
          </h3>
          <p className={`text-sm leading-relaxed font-medium transition-colors duration-500 ease-in-out
            ${isActive ? "text-white/70" : "text-slate-600 group-hover:text-white/80"}`}>
            {description}
          </p>
        </div>
      </div>

      {/* Card Footer / CTA */}
      <div className={`relative z-10 w-full px-7 pb-6 pt-4 flex items-center justify-between border-t transition-colors duration-500 ease-in-out
        ${isActive ? "border-white/10" : "border-slate-100 group-hover:border-white/10"}`}>
        <span className={`text-sm font-bold tracking-tight transition-colors duration-500 ease-in-out
          ${isActive ? "text-white" : "text-slate-800 group-hover:text-white"}`}>
          {cta}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ease-in-out transform
          ${isActive 
            ? theme.arrowActive + " shadow-md" 
            : `bg-slate-100 text-slate-500 group-hover:rotate-[-45deg] group-hover:shadow-md ${theme.arrowActive}`}`}
        >
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </div>
      </div>
    </button>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { org, hasOrg, orgId, loading, onOrgConnected } = useRecruiterOrg();
  const { jobs } = useJobs(orgId ?? 0);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingDest, setPendingDest] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5ff]">
        <span className="w-10 h-10 border-2 border-[#2D236A]/20 border-t-[#2D236A] rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasOrg || !orgId) {
    return <Navigate to="/settings" replace />;
  }

  const handleConnected = (connectedOrg: OrganizationResponse) => {
    onOrgConnected(connectedOrg);
    setShowModal(false);
    const dest = pendingDest ?? `/organization/${connectedOrg.id}`;
    setTimeout(() => navigate(dest), 300);
    setPendingDest(null);
  };

  const handleOrgClick = () => {
    setActiveSection("org");
    setTimeout(() => navigate(`/recruiter/OrganizationProfile`), 300);
  };

  const handlePostJobClick = () => {
    setActiveSection("post");
    setTimeout(() => navigate("/recruiter/jobs"), 300);
  };

  const handleManageClick = () => {
    setActiveSection("manage");
    setTimeout(() => navigate("/recruiter/manageJobs"), 300);
  };

  return (
    <div className="min-h-screen bg-[#f6f5ff]">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-[#f6f5ff] font-sans"
      >
        {/* Hero Section */}
        <section className="relative bg-[#2D236A] overflow-hidden py-16 h-1/4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_120%_at_85%_50%,rgba(28,163,123,.2)_0%,transparent_70%)]" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-6 flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1ca37b]/15 border border-[#1ca37b]/35 text-[#5de8b8] text-[10px] font-bold uppercase rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] animate-pulse" /> Verified Recruiter
              </div>
              <h1 className="font-syne text-3xl md:text-3xl font-bold text-white mb-2">
                Welcome to your <span className="text-[#59daad]">Recruiter Dashboard</span>
              </h1>
              <p className="text-sm text-white/70 max-w-md">
                Build your org, post jobs, and manage all listings in one place.
              </p>
            </div>
            <div className="flex shrink-0 justify-center">
              <Stat
                num={loading ? "—" : hasOrg ? org!.name.split(" ")[0] : "—"}
                label="Organization"
              />
              <Stat num={loading ? "—" : String(jobs.length)} label="active Jobs" />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-screen-xl mx-auto px-6 py-8">
          <header className="flex items-center gap-3 mb-6">
            <span className="font-syne text-[12px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Get Started
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </header>

          {/* 3 Steps Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <DashCard
              step="01"
              title="Organization Profile"
              subtitle="Build your brand"
              description="Set up your company page, add culture highlights, and perks."
              cta={hasOrg ? "Edit Profile" : "Create Profile"}
              accent="navy"
              isActive={activeSection === "org"}
              onClick={handleOrgClick}
            />
            <DashCard
              step="02"
              title="Post a Job"
              subtitle="Reach talent fast"
              description="Publish a new listing with role details and compensation."
              cta="Post Now"
              accent="green"
              isActive={activeSection === "post"}
              onClick={handlePostJobClick}
            />
            <DashCard
              step="03"
              title="Manage Jobs"
              subtitle="Stay in control"
              description="Track active, paused, and closed listings in real time."
              cta="View Listings"
              accent="navy"
              isActive={activeSection === "manage"}
              onClick={handleManageClick}
            />
          </div>

          {/* AI Voice Interviews Section */}
          <div className="w-full overflow-hidden rounded-[32px] border border-teal-500/20 bg-gradient-to-r from-white via-[#1ca37b]/5 to-[#2D236A]/5 p-8 md:p-10 relative
            shadow-[0_12px_40px_-12px_rgba(28,163,123,0.15)]
            transition-all duration-500 ease-out
            hover:shadow-[0_24px_60px_-10px_rgba(45,35,106,0.2)]
            hover:-translate-y-1
            hover:border-teal-400/50"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#1ca37b]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-[#2D236A]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1ca37b]/15 to-[#2D236A]/15 px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-[#107e5e] border border-[#1ca37b]/20 shadow-sm">
                  <Sparkles size={12} className="text-[#1ca37b] animate-pulse" />
                  <span>Next-Gen Feature</span>
                </div>
                
                <h2 className="font-syne text-2xl md:text-2xl font-extrabold text-gray-900 leading-tight mb-3">
                  AI Voice <span className="text-[#1ca37b]">Interviews Simulator</span>
                </h2>
                
                <p className="text-sm md:text-base leading-relaxed text-gray-600 font-medium max-w-2xl">
                  Generate custom job-specific questions, run real-time voice-to-text conversations, 
                  and get instant semantic scoring using advanced Cross-Encoder evaluation. 
                  Streamline your screening workflow effortlessly.
                </p>
              </div>
          
              <div className="flex items-center justify-start lg:justify-center shrink-0 self-start lg:self-center bg-white p-3 rounded-2xl shadow-md border border-slate-100/80">
                <AiButton onClick={handleCreateInterview} />
              </div>
            </div>
          </div>

          {/* Quick Tips Footer */}
          <footer className="mt-6 bg-white rounded-2xl border border-[#2D236A]/8 px-6 py-4 flex items-center gap-6 flex-wrap">
            <span className="font-syne text-[10px] font-bold uppercase text-[#1ca37b]">💡 Quick Tips</span>
            <TipItem text="Complete your org profile first to boost job visibility" />
            <TipItem text="Detailed posts get 3× more qualified applicants" />
            <TipItem text="Respond to candidates within 48 hrs" />
          </footer>
        </main>
      </motion.div>

      {/* ConnectOrgModal */}
      {showModal && (
        <ConnectOrgModal
          onConnected={handleConnected}
          onClose={() => {
            setShowModal(false);
            setPendingDest(null);
            setActiveSection(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
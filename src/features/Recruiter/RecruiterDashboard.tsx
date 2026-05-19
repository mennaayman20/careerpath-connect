import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { ConnectOrgModal } from "../../features/org-connect/ConnectOrgModal";
import { useRecruiterOrg } from "../../features/org-connect/useRecruiterOrg";
import type { OrganizationResponse } from "../../features/org-connect/organization.interfaces";
import { useJobs } from "./jobPosts/Usejobs.hook";
// import { OrganizationProfile } from "../Recruiter/OrgProfile/Orgprofilepage";
// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const COLORS = {
  navy: {
    border: "border-[#2D236A]/30",
    bgActive: "bg-[#2D236A]/6",
    accent: "bg-[#2D236A]",
    text: "text-[#2D236A]",
  },
  green: {
    border: "border-[#1ca37b]/50",
    bgActive: "bg-[#1ca37b]/8",
    accent: "bg-[#1ca37b]",
    text: "text-[#1ca37b]",
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
      className={`group relative flex-1 min-w-0 text-left rounded-3xl border transition-all duration-500 focus:outline-none overflow-hidden 
      ${isActive
        ? `${theme.border} ${theme.bgActive} shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] -translate-y-1`
        : "border-white/60 bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(45,35,106,0.15)] hover:-translate-y-2"
      }`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="20" />
        </svg>
      </div>
      <div className={`absolute top-0 left-0 right-0 h-[4px] transition-all duration-500 
        ${isActive ? theme.accent : "bg-slate-100 group-hover:bg-[#2D236A]/30"}`} />
      <div className="relative p-8 flex flex-col gap-6 h-full z-10">
        <div className="flex justify-between items-center">
          <span className={`font-syne text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border transition-all duration-300
            ${isActive
              ? "bg-white border-transparent shadow-sm text-current"
              : "bg-slate-50 border-slate-100 text-slate-400 group-hover:border-[#2D236A]/10 group-hover:text-[#2D236A]/60"}`}>
            Step {step}
          </span>
          <div className={`w-2 h-2 rounded-full ${isActive ? "animate-pulse " + theme.accent : "bg-slate-200"}`} />
        </div>
        <div className="flex-1">
          <p className="font-syne text-[10px] font-bold uppercase tracking-widest text-[#2D236A]/30 mb-2 group-hover:text-[#2D236A]/50 transition-colors">
            {subtitle}
          </p>
          <h3 className="font-syne text-xl font-medium text-[#1a1540] mb-3 tracking-tight leading-none transition-transform duration-300 group-hover:translate-x-1">
            {title}
          </h3>
          <p className={`text-sm leading-relaxed font-medium transition-colors duration-300 
            ${isActive ? "text-[#2D236A]/70" : "text-slate-400 group-hover:text-[#2D236A]/70"}`}>
            {description}
          </p>
        </div>
        <div className={`flex items-center justify-between pt-4 border-t border-slate-50 transition-colors group-hover:border-[#2D236A]/5 ${theme.text}`}>
          <span className="text-sm font-bold tracking-tight">{cta}</span>
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-500 transform
            ${isActive ? theme.accent + " text-white shadow-lg" : "bg-slate-50 text-slate-400 group-hover:bg-[#2D236A] group-hover:text-white group-hover:rotate-[-45deg] group-hover:shadow-lg"}`}>
            <ArrowUpRight size={18} />
          </div>
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
  // نحفظ الـ destination اللي المستخدم كان رايح ليها قبل ما الـ modal يفتح
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

  // ── فتح الـ modal ─────────────────────────────────────────────────────────
  const openModal = (section: string, dest: string) => {
    setActiveSection(section);
    setPendingDest(dest);
    setShowModal(true);
  };

  // ── بعد نجاح الـ connect ──────────────────────────────────────────────────
  const handleConnected = (connectedOrg: OrganizationResponse) => {
    onOrgConnected(connectedOrg);
    setShowModal(false);
    const dest = pendingDest ?? `/organization/${connectedOrg.id}`;
    setTimeout(() => navigate(dest), 300);
    setPendingDest(null);
  };

  // ── كارت 01 – Org ─────────────────────────────────────────────────────────
  const handleOrgClick = () => {
    setActiveSection("org");

      setTimeout(() => navigate(`/recruiter/OrganizationProfile`), 300);
  
     
    
  };

  // ── كارت 02 – Post Job ────────────────────────────────────────────────────
  const handlePostJobClick = () => {
    setActiveSection("post");
  
      setTimeout(() => navigate("/recruiter/jobs"), 300);
  
      
    
  };

  // ── كارت 03 – Manage ─────────────────────────────────────────────────────
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
        {/* Hero */}
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
              <p className="text-sm text-white/50 max-w-md">
                Build your org, post jobs, and manage all listings in one place.
              </p>
            </div>
<div className="flex shrink-0 justify-center">
  <Stat
    num={loading ? "—" : hasOrg ? org!.name.split(" ")[0] : "—"}
    label="Organization"
  />
  <Stat num={loading ? "—" : String(jobs.length)} label="Total Jobs" />
</div>
          </div>
        </section>

        {/* Main */}
        <main className="max-w-screen-xl mx-auto px-6 py-8">
          <header className="flex items-center gap-3 mb-5">
            <span className="font-syne text-[13px] font-medium uppercase whitespace-nowrap">
              Get Started
            </span>
            <div className="flex-1 h-px bg-[#2D236A]/70" />
          </header>

          <div className="flex flex-col md:flex-row gap-4">
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

          <footer className="mt-5 bg-white rounded-2xl border border-[#2D236A]/8 px-6 py-4 flex items-center gap-6 flex-wrap">
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








// import { useState } from "react";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import { motion } from "framer-motion";
// import { ArrowUpRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { CreateJobButton } from "../../features/org-connect/CreateJobButton";









// // ─── CONSTANTS ──────────────────────────────────────────────────────
// const COLORS = {
//   navy: {
//     border: "border-[#2D236A]/30",
//     bgActive: "bg-[#2D236A]/6",
//     accent: "bg-[#2D236A]",
//     text: "text-[#2D236A]",
//   },
//   green: {
//     border: "border-[#1ca37b]/50",
//     bgActive: "bg-[#1ca37b]/8",
//     accent: "bg-[#1ca37b]",
//     text: "text-[#1ca37b]",
//   },
// };



// // ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

// const Stat = ({ num, label }: { num: string; label: string }) => (
//   <div className="flex flex-col items-center px-6 first:pl-0 last:pr-0 border-r border-white/10 last:border-0">
//     <span className="font-syne text-2xl font-extrabold text-white leading-none">{num}</span>
//     <span className="text-[10px] font-semibold tracking-widest uppercase text-white/40 mt-1">{label}</span>
//   </div>
// );

// const TipItem = ({ text }: { text: string }) => (
//   <div className="flex items-center gap-2 text-xs text-black/70">
//     <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] shrink-0" />
//     {text}
//   </div>
// );

// // مكون الكارت الموحد لاستخدامه يدوياً
// function DashCard({
//   step,
//   title,
//   subtitle,
//   description,
//   cta,
//   accent,
//   isActive,
//   onClick,
// }: {
//   step: string;
//   title: string;
//   subtitle: string;
//   description: string;
//   cta: string;
//   accent: "navy" | "green";
//   isActive: boolean;
//   onClick: () => void;
// }) {
//   const theme = accent === "green" ? COLORS.green : COLORS.navy;






//   return (
//     <button
//       onClick={onClick}
//       className={`group relative flex-1 min-w-0 text-left rounded-3xl border transition-all duration-500 focus:outline-none overflow-hidden 
//       ${isActive 
//         ? `${theme.border} ${theme.bgActive} shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] -translate-y-1` 
//         : "border-white/60 bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(45,35,106,0.15)] hover:-translate-y-2"
//       }`}
//     >
//       <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
//         <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
//           <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="20" />
//         </svg>
//       </div>

//       <div className={`absolute top-0 left-0 right-0 h-[4px] transition-all duration-500 
//         ${isActive ? theme.accent : "bg-slate-100 group-hover:bg-[#2D236A]/30"}`} 
//       />

//       <div className="relative p-8 flex flex-col gap-6 h-full z-10">
//         <div className="flex justify-between items-center">
//           <span className={`font-syne text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border transition-all duration-300
//             ${isActive 
//               ? "bg-white border-transparent shadow-sm text-current" 
//               : "bg-slate-50 border-slate-100 text-slate-400 group-hover:border-[#2D236A]/10 group-hover:text-[#2D236A]/60"}`}>
//             Step {step}
//           </span>
//           <div className={`w-2 h-2 rounded-full ${isActive ? "animate-pulse " + theme.accent : "bg-slate-200"}`} />
//         </div>

//         <div className="flex-1">
//           <p className="font-syne text-[10px] font-bold uppercase tracking-widest text-[#2D236A]/30 mb-2 group-hover:text-[#2D236A]/50 transition-colors">
//             {subtitle}
//           </p>
//           <h3 className="font-syne text-xl font-medium text-[#1a1540] mb-3 tracking-tight leading-none transition-transform duration-300 group-hover:translate-x-1">
//             {title}
//           </h3>
//           <p className={`text-sm leading-relaxed font-medium transition-colors duration-300 
//             ${isActive ? "text-[#2D236A]/70" : "text-slate-400 group-hover:text-[#2D236A]/70"}`}>
//             {description}
//           </p>
//         </div>

//         <div className={`flex items-center justify-between pt-4 border-t border-slate-50 transition-colors group-hover:border-[#2D236A]/5 ${theme.text}`}>
//           <span className="text-sm font-bold tracking-tight">{cta}</span>
//           <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-500 transform
//             ${isActive ? theme.accent + " text-white shadow-lg" : "bg-slate-50 text-slate-400 group-hover:bg-[#2D236A] group-hover:text-white group-hover:rotate-[-45deg] group-hover:shadow-lg"}`}>
//             <ArrowUpRight size={18} /> 
//           </div>
//         </div>
//       </div>
//     </button>
//   );
// }

// // ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

// export default function RecruiterDashboard() {
//   const { user } = useAuth();
//   console.log("Current User Data:", user);
//   const [activeSection, setActiveSection] = useState<string | null>(null);
//   const navigate = useNavigate();


//   const handleNavigation = (id: string, path: string) => {
//     setActiveSection(id);
//     setTimeout(() => {
//       navigate(path);
//     }, 300);
//   };

  

//   return (
//     <div className="min-h-screen bg-[#f6f5ff]">
//       <Navbar />
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="min-h-screen bg-[#f6f5ff] font-sans"
//       >
//         {/* Hero Section */}
//         <section className="relative bg-[#2D236A] overflow-hidden py-16 h-1/4">
//           <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_120%_at_85%_50%,rgba(28,163,123,.2)_0%,transparent_70%)]" />
//           <div className="relative z-10 max-w-screen-xl mx-auto px-6 flex flex-wrap items-center justify-between gap-8">
//             <div>
//               <div className="inline-flex items-center gap-2 bg-[#1ca37b]/15 border border-[#1ca37b]/35 text-[#5de8b8] text-[10px] font-bold uppercase rounded-full px-3 py-1 mb-4">
//                 <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] animate-pulse" /> Verified Recruiter
//               </div>
//               <h1 className="font-syne text-2xl md:text-3xl font-extrabold text-white mb-2">
//                 Welcome to your <span className="text-[#1ca37b]">Recruiter Dashboard</span>
//               </h1>
//               <p className="text-sm text-white/50 max-w-md">Build your org, post jobs, and manage all listings in one place.</p>
//             </div>
//             <div className="flex shrink-0">
//               <Stat num="0" label="Active Jobs" />
//               <Stat num="—" label="Organization" />
//               <Stat num="0" label="Applications" />
//             </div>
//           </div>
//         </section>

//         {/* Main Content */}
//         <main className="max-w-screen-xl mx-auto px-6 py-8">
//           <header className="flex items-center gap-3 mb-5">
//             <span className="font-syne text-[13px] font-medium uppercase whitespace-nowrap">Get Started</span>
//             <div className="flex-1 h-px bg-[#2D236A]/70" />
//           </header>

//           {/* Cards Container - الماب تم استبدالها هنا بوضع الكروت يدوياً */}
//           <div className="flex flex-col md:flex-row gap-4">
// <DashCard
//   step="01"
//   title="Organization Profile"
//   subtitle="Build your brand"
//   description="Set up your company page, add culture highlights, and perks."
//   // هنا سيظهر "Edit Profile" تلقائياً لأننا حدثنا الـ Context
//   cta={user?.organizationId ? "Edit Profile" : "Create Profile"}
//   accent="navy"
//   isActive={activeSection === "org"}
//   onClick={() => {
//     setActiveSection("org");
    
//     // فحص القيمة المحدثة في الـ user object
//     if (user?.organizationId) {
//       // لو الشركة موجودة، نستخدم الـ ID المحفوظ للذهاب لصفحة العرض/التعديل
//       setTimeout(() => navigate(`/organization/${user.organizationId}`), 300);
//     } else {
//       // لو لسه null، يروح لصفحة الكرييت
//       setTimeout(() => navigate("/organization/create"), 300);
//     }
//   }}
// />

//             <DashCard
//               step="02"
//               title="Post a Job"
//               subtitle="Reach talent fast"
//               description="Publish a new listing with role details and compensation."
//               cta="Post Now"
//               accent="green"
//               isActive={activeSection === "post"}
//               //هتتعدل 
//               onClick={() => handleNavigation("post", "/recruiter/jobs")}
//             />

//             <DashCard
//               step="03"
//               title="Manage Jobs"
//               subtitle="Stay in control"
//               description="Track active, paused, and closed listings in real time."
//               cta="View Listings"
//               accent="navy"
//               isActive={activeSection === "manage"}
//               //هتتعدل 
//               onClick={() => handleNavigation("manage", "/recruiter/manageJobs")}
//             />
//           </div>

//           {/* Tips Footer */}
//           <footer className="mt-5 bg-white rounded-2xl border border-[#2D236A]/8 px-6 py-4 flex items-center gap-6 flex-wrap">
//             <span className="font-syne text-[10px] font-bold uppercase text-[#1ca37b]">💡 Quick Tips</span>
//             <TipItem text="Complete your org profile first to boost job visibility" />
//             <TipItem text="Detailed posts get 3× more qualified applicants" />
//             <TipItem text="Respond to candidates within 48 hrs" />
//           </footer>
//         </main>
//       </motion.div>
//       <Footer />
//     </div>
//   );
// }
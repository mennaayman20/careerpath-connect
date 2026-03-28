import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Search, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Application } from "@/features/submitedApplication/submitedInterface";
import { useMyApplications } from "@/features/submitedApplication/useSubmitted";

const statusAccent: Record<string, string> = {
  HIRED:        "border-l-[#1ca37b]",
  SHORTLISTED:  "border-l-[#7F77DD]",
  UNDER_REVIEW: "border-l-[#EF9F27]",
  SUBMITTED:    "border-l-[#378ADD]",
  REJECTED:     "border-l-[#E24B4A]",
};



const statusBadge: Record<string, { label: string; className: string }> = {
  HIRED:        { label: "Hired",        className: "bg-[#E1F5EE] text-[#085041]" },
  SHORTLISTED:  { label: "Shortlisted",  className: "bg-[#EEEDFE] text-[#3C3489]" },
  UNDER_REVIEW: { label: "Under review", className: "bg-[#FAEEDA] text-[#633806]" },
  SUBMITTED:    { label: "Submitted",    className: "bg-[#E6F1FB] text-[#0C447C]" },
  REJECTED:     { label: "Rejected",     className: "bg-[#FCEBEB] text-[#791F1F]" },
};

const matchColor: Record<string, string> = {
  HIRED:        "#1ca37b",
  SHORTLISTED:  "#7F77DD",
  UNDER_REVIEW: "#EF9F27",
  SUBMITTED:    "#378ADD",
  REJECTED:     "#E24B4A",
};

const Applications = () => {
  const { applications, isLoading, error } = useMyApplications();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="container flex-1 py-10 max-w-3xl">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#e8f5f0] flex items-center justify-center shrink-0">
            <FileText className="h-6 w-6 text-[#1ca37b]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              My Applications
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track and manage your AI-matched job applications
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Fetching your applications...
            </p>
          </div>

        /* Error */
        ) : error ? (
          <div className="text-center py-16 bg-destructive/5 rounded-2xl border border-destructive/20">
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>

        /* Empty */
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed rounded-2xl">
            <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <h2 className="text-base font-medium text-foreground">
              No applications yet
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Start applying to jobs to track your progress here.
            </p>
          </div>

        /* List */
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((app, i) => {
              const badge  = statusBadge[app.status] ?? { label: app.status, className: "bg-muted text-muted-foreground" };
              const accent = statusAccent[app.status] ?? "border-l-border";
              const color  = matchColor[app.status]  ?? "#888";
              const pct    = Math.round(app.matchingRatio ?? 0);

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`
                    rounded-2xl bg-card
                    border border-border/50 border-l-[3px] ${accent}
                    p-5 flex flex-col gap-3
                    hover:border-border transition-colors
                  `}
                >
                  {/* Row 1 — title + badge */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex flex-col gap-0.5">
                    
                      <span className="text-[15px] font-semibold text-foreground">
                        {app.jobTitle}
                      </span>
                    </div>

                    <Badge
                      className={`${badge.className} rounded-full text-[11px] px-2.5 py-0.5 border-0 font-medium`}
                    >
                      {badge.label}
                    </Badge>
                  </div>

                
                 

                  {/* Row 3 — cover letter */}
                  <p className="text-[12px] text-muted-foreground italic truncate">
                    {app.coverLetter || "No cover letter provided."}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Applications;


















// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { FileText, Search } from "lucide-react";
// import { motion } from "framer-motion";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress"; // عشان الـ Matching Ratio
// // 1. استيراد الـ Hook الجديد والنوع
// import { useMyApplications } from "@/features/submitedApplication/useSubmitted";


// // 2. تحديث الألوان لتناسب الحالات الحقيقية من الـ Swagger
// const statusColor: Record<string, string> = {
//   SUBMITTED: "bg-blue-100 text-blue-700 hover:bg-blue-100",
//   UNDER_REVIEW: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
//   SHORTLISTED: "bg-purple-100 text-purple-700 hover:bg-purple-100",
//   REJECTED: "bg-red-100 text-red-700 hover:bg-red-100",
//   HIRED: "bg-green-100 text-green-700 hover:bg-green-100",
// };

// const Applications = () => {
//   // 3. استخدام الـ Hook بدلاً من الـ useState المحلي
//   const { applications, isLoading, error } = useMyApplications();

//   return (
//     <div className="flex min-h-screen flex-col bg-background">
//       <Navbar />
//       <div className="container flex-1 py-10 max-w-5xl">
//         <div className="mb-10 flex items-center gap-4">
//           <div className="p-3 bg-primary/10 rounded-xl">
//             <FileText className="h-8 w-8 text-primary" />
//           </div>
//           <div>
//             <h1 className="font-display text-4xl font-extrabold text-foreground tracking-tight">My Applications</h1>
//             <p className="text-muted-foreground mt-1">Track and manage your AI-matched job applications</p>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center py-24 gap-4">
//             <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//             <p className="text-muted-foreground animate-pulse">Fetching your applications...</p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20">
//             <p className="text-destructive font-semibold">{error}</p>
//           </div>
//         ) : applications.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl bg-card/50">
//             <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
//             <h2 className="text-xl font-semibold text-foreground">No applications yet</h2>
//             <p className="text-muted-foreground mb-6">Start applying to jobs to track your progress here.</p>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {applications.map((app, i) => (
//               <motion.div
//                 key={app.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.1 }}
//                 className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:border-primary/20"
//               >
//                 <div className="flex-1 space-y-3">
//                   <div className="flex items-center gap-3">
//                     <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
//                       {app.jobTitle}
//                     </h3>
//                     <Badge className={`${statusColor[app.status]} border-none font-medium px-3`}>
//                       {app.status}
//                     </Badge>
//                   </div>
                  
                 
                  

//                   <p className="text-sm text-muted-foreground line-clamp-1 italic">
//                     {app.coverLetter || "No cover letter provided."}
//                   </p>
//                 </div>

                
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Applications;
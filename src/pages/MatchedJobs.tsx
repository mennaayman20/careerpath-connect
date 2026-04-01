import { useState } from "react";
import { Job } from "@/types/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Building2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { jobService } from "@/services/jobService";
import { useNavigate } from "react-router-dom";
import { ApplyModal } from "@/features/application/components/applyModal";
import { useMatchedJobs } from "@/hooks/useJobs";

const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const pastDate = new Date(date);
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return pastDate.toLocaleDateString();
};

const getTier = (pct: number) => {
  if (pct >= 80) return "gold";
  if (pct >= 65) return "silver";
  return "bronze";
};

const tierConfig = {
  gold: {
    label: "Best match",
    accent: "#639922",
    badge: { bg: "#EAF3DE", color: "#27500A" },
    borderStyle: "1.5px solid #3B6D11",
    sectionColor: "#3B6D11",
    hint: "Skill set highly relevant.",
  },
  silver: {
    label: "Strong match",
    accent: "#378ADD",
    badge: { bg: "#E6F1FB", color: "#0C447C" },
    borderStyle: "0.5px solid #185FA5",
    sectionColor: "#185FA5",
    hint: "Qualified with growth potential.",
  },
  bronze: {
    label: "Good match",
    accent: "#BA7517",
    badge: { bg: "#FAEEDA", color: "#633806" },
    borderStyle: "0.5px solid #BA7517",
    sectionColor: "#854F0B",
    hint: "Worth applying; needs further skill refinement.",
  },
};

const tierOrder: Array<"gold" | "silver" | "bronze"> = ["gold", "silver", "bronze"];

const MatchedJobs = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({});
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const jobIdFromUrl = searchParams.get("id");

  const { data: jobs = [], isLoading } = useMatchedJobs();

  const sortedJobs = [...jobs].sort(
    (a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0)
  );

  const grouped = sortedJobs.reduce<Record<string, Job[]>>((acc, job) => {
    const tier = getTier(job.matchPercentage ?? 0);
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(job);
    return acc;
  }, {});

  const handleJobSelect = async (job: Job) => {
    setSearchParams({ id: job.id.toString() });
    setSelectedJob(job);
    if (!job.description) {
      const details = await jobService.getJobById(job.id);
      setSelectedJob((prev) => ({ ...prev, ...details }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container flex-1 py-9  max-w-7xl">

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground animate-pulse">Analyzing your profile...</p>
          </div>
        ) : (
          <>
            {/* Empty state */}
            {jobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-lg flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-muted rounded-3xl bg-card/50"
              >
                <div className="mb-6 rounded-full bg-accent/10 p-5">
                  <Sparkles className="h-12 w-12 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Unlock Your AI Career Matches</h2>
                <p className="mt-3 text-muted-foreground">
                  We couldn't find any matches because your profile is still empty.
                  Fill in your skills and experience to let our AI find the perfect roles for you.
                </p>
                <Button
                  className="mt-8 gradient-accent px-10 h-12 text-lg font-bold shadow-lg hover:shadow-accent/20 transition-all"
                  onClick={() => navigate("/profile")}
                >
                  Complete My Profile
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="mb-8">
                   
                  <h1 className="text-3xl font-bold font-display flex items-center gap-2">
    <Sparkles className="h-7 w-7 text-accent" />
    Recommended Jobs
  </h1>
                  <p className="text-muted-foreground">Top picks based on your unique skill set</p>
                </div>

                {!selectedJob ? (
                  <div className="space-y-10">

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-muted/40 border border-border text-sm">
                      {tierOrder.map((tier) => {
                        const cfg = tierConfig[tier];
                        return (
                          <div key={tier} className="flex items-start gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                              style={{ background: cfg.accent }}
                            />
                            <div>
                              <span className="font-medium text-foreground">{cfg.label}</span>
                              <span className="text-muted-foreground"> — {cfg.hint}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tier sections */}
                    {tierOrder.map((tier) => {
                      const group = grouped[tier];
                      if (!group || group.length === 0) return null;

                      const cfg = tierConfig[tier];
                      const isExpanded = expandedTiers[tier];
                      const visibleJobs = isExpanded ? group : group.slice(0, 3);

                      return (
                        <div key={tier}>
                          {/* Section header */}
                          <div className="flex items-center gap-3 mb-4">
                            <span
                              className="text-xs font-medium uppercase tracking-widest whitespace-nowrap"
                              style={{ color: cfg.sectionColor }}
                            >
                              {cfg.label}
                            </span>
                            <div className="flex-1 h-px bg-border" />
                          </div>

                          {/* Jobs list */}
                          <div className="flex flex-col gap-3">
                            {visibleJobs.map((job, i) => {
                              const rank = sortedJobs.indexOf(job) + 1;
                              const pct = job.matchPercentage ?? 0;

                              return (
                                <motion.div
                                  key={job.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.08 }}
                                  className="relative rounded-2xl bg-card p-5 cursor-pointer overflow-hidden transition-all hover:shadow-elevated"
                                  style={{ border: cfg.borderStyle }}
                                  onClick={() => handleJobSelect(job)}
                                >
                                  {/* Top accent bar */}
                                  <div
                                    className="absolute top-0 left-0 right-0 h-[3px]"
                                    style={{ background: cfg.accent }}
                                  />

                                  {/* Rank */}
                                  <span className="absolute top-3 right-4 text-[11px] text-muted-foreground font-medium">
                                    #{rank}
                                  </span>

                                  {/* Match badge */}
                                  {/* <span
                                    className="inline-block text-xs font-semibold px-3 py-1 rounded-md mb-3 mt-1"
                                    style={{ background: cfg.badge.bg, color: cfg.badge.color }}
                                  >
                                    {pct}% match
                                  </span> */}

                                  <h3 className="text-base font-semibold text-foreground mb-1 leading-snug pr-8">
                                    {job.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                                    <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                                    {job.organizationName}
                                  </p>

                                  {/* Progress bar */}
                                  <div className="w-1/4 h-1 rounded-full bg-muted overflow-hidden">
  <div
    className="h-1 rounded-full transition-all"
    style={{ width: `${pct}%`, background: cfg.accent }}
  />
</div>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Show more / less button */}
                          {group.length > 3 && (
                            <button
                              className="mt-3 w-full py-2 text-sm rounded-xl border border-border text-muted-foreground hover:bg-muted/40 transition-all"
                              onClick={() =>
                                setExpandedTiers((prev) => ({ ...prev, [tier]: !prev[tier] }))
                              }
                            >
                              {isExpanded ? "Show less" : `Show ${group.length - 3} more`}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Selected job detail */
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-elevated mx-auto"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">{selectedJob.title}</h2>
                        <p className="mt-1 text-muted-foreground">
                          {selectedJob.organizationName} · {selectedJob.location}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedJob(null);
                          setSearchParams((prev) => {
                            const newParams = new URLSearchParams(prev);
                            newParams.delete("id");
                            return newParams;
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-accent/10 text-accent border-0 font-bold">
                        {selectedJob.matchPercentage}% Match
                      </Badge>
                      <Badge>{selectedJob.type}</Badge>
                      <Badge>{selectedJob.status}</Badge>
                      <Badge>{selectedJob.seniority}</Badge>
                      <Badge>{selectedJob.model}</Badge>
                      <Badge>Posted {getRelativeTime(selectedJob.createdDate)}</Badge>
                    </div>

                    {selectedJob.description && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-base text-foreground mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedJob.description}</p>
                      </div>
                    )}

                    {selectedJob.skills && selectedJob.skills.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-base text-foreground mb-2">Required Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.map((skill) => (
                            <Badge key={skill.skillId} variant="secondary">{skill.skillName}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="mt-8 w-full gradient-primary border-0"
                      disabled={selectedJob.status === "Closed"}
                    >
                      {selectedJob.status === "Closed" ? "Position Closed" : "Apply Now"}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5 mt-5"
                      onClick={() => navigate(`/resume-analysis?jobId=${jobIdFromUrl}`)}
                    >
                      <Sparkles size={16} /> Analyze My Resume
                    </Button>

                    <ApplyModal
                      jobId={selectedJob.id}
                      jobTitle={selectedJob.title}
                      isOpen={isApplyModalOpen}
                      onClose={() => setIsApplyModalOpen(false)}
                    />
                  </motion.div>
                )}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MatchedJobs;





// import { useState, useEffect } from "react";
// import { api } from "@/lib/api";
// import { Job } from "@/types/jobs";
// import { MatchedJob } from "@/types/jobs";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { Sparkles, MapPin, Briefcase, Building2, X, Clock } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { motion } from "framer-motion";
// import { useSearchParams } from "react-router-dom";
// import { jobService } from "@/services/jobService";
// import { useNavigate } from "react-router-dom";
// import { ApplyModal } from "@/features/application/components/applyModal";
// import { useMatchedJobs } from "@/hooks/useJobs";

// const getRelativeTime = (date: string | Date): string => {
//   const now = new Date();
//   const pastDate = new Date(date);
//   const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
//   if (seconds < 60) return "just now";
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   if (days < 7) return `${days}d ago`;
//   const weeks = Math.floor(days / 7);
//   if (weeks < 4) return `${weeks}w ago`;
//   return pastDate.toLocaleDateString();
// };


// const MatchedJobs = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
// //   const [jobs, setJobs] = useState<MatchedJob[]>([]);
// //   const [loading, setLoading] = useState(true);

//   const [selectedJob, setSelectedJob] = useState<Job | null>(null);
//   const [searchParams, setSearchParams] = useSearchParams();
// const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({});

//   const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
// // const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
// const jobIdFromUrl = searchParams.get("id");

// const { 
//   data: jobs = [], 
//   isLoading, 
//   error 
// } = useMatchedJobs();

//   const handleJobSelect = async (job: Job) => {
    
//     setSearchParams({ id: job.id.toString() });
//     setSelectedJob(job);
//     if (!job.description) {
//       const details = await jobService.getJobById(job.id); //
//       setSelectedJob((prev) => ({ ...prev, ...details }));
//     }
//   };

//   const handleApply = (job: Job) => {
//     toast({ title: "Application Submitted!", description: `You've applied to ${job.title} at ${job.organizationName}.` });
//   };

// const getTier = (pct: number) => {
//   if (pct >= 85) return "gold";
//   if (pct >= 65) return "silver";
//   return "bronze";
// };

// const tierConfig = {
//   gold: {
//     label: "Best match",
//     accent: "#639922",
//     badge: { bg: "#EAF3DE", color: "#27500A" },
//     bar: "#639922",
//     borderStyle: "1.5px solid #3B6D11",
//     sectionColor: "#3B6D11",
//     hint: "Skill set highly relevant.",
//   },
//   silver: {
//     label: "Strong match",
//     accent: "#378ADD",
//     badge: { bg: "#E6F1FB", color: "#0C447C" },
//     bar: "#378ADD",
//     borderStyle: "0.5px solid #185FA5",
//     sectionColor: "#185FA5",
//     hint: "Qualified with growth potential",
//   },
//   bronze: {
//     label: "Good match",
//     accent: "#BA7517",
//     badge: { bg: "#FAEEDA", color: "#633806" },
//     bar: "#BA7517",
//     borderStyle: "0.5px solid var(--color-border-tertiary)",
//     sectionColor: "#854F0B",
//     hint:"Worth applying; needs further skill refinement",
//   },
// };



// // Sort descending
// const sortedJobs = [...jobs].sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));

// // Group by tier
// const grouped = sortedJobs.reduce<Record<string, Job[]>>((acc, job) => {
//   const tier = getTier(job.matchPercentage ?? 0);
//   if (!acc[tier]) acc[tier] = [];
//   acc[tier].push(job);
//   return acc;
// }, {});

// const tierOrder: Array<"gold" | "silver" | "bronze"> = ["gold", "silver", "bronze"];





//   return (
//   <div className="flex min-h-screen flex-col bg-background">
//     <Navbar />
//     <main className="container flex-1 py-8">
      
//       {/* 1. حالة التحميل */}
//       {isLoading ? (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//           <p className="mt-4 text-muted-foreground animate-pulse">Analyzing your profile...</p>
//         </div>
//       ) : (
//         <>
//           {/* 2. حالة البروفايل الفاضي ( jobs.length === 0 ) */}
//           {jobs.length === 0 ? (
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="mx-auto max-w-lg flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-muted rounded-3xl bg-card/50"
//             >
//               <div className="mb-6 rounded-full bg-accent/10 p-5">
//                 <Sparkles className="h-12 w-12 text-accent" />
//               </div>
//               <h2 className="text-2xl font-bold text-foreground">Unlock Your AI Career Matches</h2>
//               <p className="mt-3 text-muted-foreground">
//                 We couldn't find any matches because your profile is still empty. 
//                 Fill in your skills and experience to let our AI find the perfect roles for you.
//               </p>
//               <Button 
//                 className="mt-8 gradient-accent px-10 h-12 text-lg font-bold shadow-lg hover:shadow-accent/20 transition-all"
//                 onClick={() => navigate("/profile") }
//               >
//                 Complete My Profile
//               </Button>
//             </motion.div>
//           ) : (
            
//             /* 3. حالة عرض الوظائف (لو فيه داتا) */
//             <div className="space-y-6">
//               <div className="mb-8">
//                 <h1 className="text-3xl font-bold font-display">Recommended Jobs</h1>
//                 <p className="text-muted-foreground">Top picks based on your unique skill set</p>
//               </div>

//              {!selectedJob ? (
//   <div className="space-y-10">

// <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-xl bg-muted/40 border border-border text-sm">
//       {tierOrder.map((tier) => {
//         const cfg = tierConfig[tier];
//         return (
//           <div key={tier} className="flex items-start gap-2">
//             <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: cfg.accent }} />
//             <div>
//               <span className="font-medium text-foreground">{cfg.label}</span>
//               <span className="text-muted-foreground"> — {cfg.hint}</span>
//             </div>
//           </div>
//         );
//       })}
//     </div>


//     {tierOrder.map((tier) => {
//       const group = grouped[tier];
//       if (!group || group.length === 0) return null;
//       const cfg = tierConfig[tier];

//       return (
//         <div key={tier}>
//           {/* Section header */}
//           <div className="flex items-center gap-3 mb-4">
//             <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground whitespace-nowrap">
//               {cfg.label}
//             </span>
//             <div className="flex-1 h-px bg-border" />
//           </div>

//           <div className="flex flex-col gap-3">
//             {group.map((job, i) => {
//               // Global rank across all sorted jobs
//               const rank = sortedJobs.indexOf(job) + 1;
//               const pct = job.matchPercentage ?? 0;

//               return (
//                 <motion.div
//                   key={job.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: i * 0.08 }}
//                   className="relative rounded-2xl border bg-card p-5 hover:shadow-elevated transition-all cursor-pointer overflow-hidden"
//                   style={{ borderColor: cfg.accent, borderWidth: tier === "gold" ? "1.5px" : "0.5px" }}
//                   onClick={() => handleJobSelect(job)}
//                 >
//                   {/* Top accent bar */}
//                   <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: cfg.accent }} />

//                   {/* Rank number */}
//                   <span className="absolute top-3 right-4 text-[11px] text-muted-foreground font-medium">
//                     #{rank}
//                   </span>

//                   {/* Match badge */}
//                   {/* <span
//                     className="inline-block text-xs font-semibold px-3 py-1 rounded-md mb-3 mt-1"
//                     style={{ background: cfg.badge.bg, color: cfg.badge.color }}
//                   >
//                     {pct}% match
//                   </span> */}

//                   <h3 className="text-base font-semibold text-foreground mb-1 leading-snug pr-4">
//                     {job.title}
//                   </h3>
//                   <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
//                     <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
//                     {job.organizationName}
//                   </p>

//                   {/* Progress bar */}
//                   <div className="h-1 rounded-full bg-muted mb-4 overflow-hidden">
//                     <div
//                       className="h-1 rounded-full transition-all"
//                       style={{ width: `${pct}%`, background: cfg.accent }}
//                     />


                    
//                   </div>

//                   {/* <Button
//                     size="sm"
//                     variant="outline"
//                     className="w-full text-sm"
//                     onClick={(e) => { e.stopPropagation(); handleJobSelect(job); }}
//                   >
//                     View details
//                   </Button> */}
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       );
//     })}
//   </div>
// ) : (
//                 <motion.div
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-elevated mx-auto"
//                 >
//                   <div className="flex items-start justify-between mb-4 ">
//                     <div>
//                       <h2 className="font-display text-2xl font-bold text-foreground">{selectedJob.title}</h2>
//                       <p className="mt-1 text-muted-foreground">{selectedJob.organizationName} · {selectedJob.location}</p>
//                     </div>
//                     <Button variant="ghost" size="icon" 
//                     onClick={() => {
//                       setSelectedJob(null);
//                       setSearchParams(prev => {
//                         const newParams = new URLSearchParams(prev);
//                         newParams.delete("id");
//                         return newParams;
//                       });
//                     }}>
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <Badge className="bg-accent/10 text-accent border-0 font-bold">
//                       {selectedJob.matchPercentage}% Match
//                     </Badge>
//                     <Badge>{selectedJob.type}</Badge>
//                     <Badge>{selectedJob.status}</Badge>
//                     <Badge>{selectedJob.seniority}</Badge>
//                     <Badge>{selectedJob.model}</Badge>
//                     <Badge>Posted {getRelativeTime(selectedJob.createdDate)}</Badge>
//                   </div>

//                   {/* Job Description */}
//                   {selectedJob.description && (
//                     <div className="mt-6">
//                       <h4 className="font-semibold text-base text-foreground mb-2">Description</h4>
//                       <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedJob.description}</p>
//                     </div>
//                   )}

//                   {/* Required Skills */}
//                   {selectedJob.skills && selectedJob.skills.length > 0 && (
//                     <div className="mt-6">
//                       <h4 className="font-semibold text-base text-foreground mb-2">Required Skills</h4>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedJob.skills.map((skill) => (
//                           <Badge key={skill.skillId} variant="secondary">{skill.skillName}</Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <Button 
//                     onClick={() => setIsApplyModalOpen(true)}
//                     className="mt-8 w-full gradient-primary border-0"
//                     disabled={selectedJob.status === "Closed"}
//                   >
//                     {selectedJob.status === "Closed" ? "Position Closed" : "Apply Now"}
//                   </Button>

//                   <Button 
//   variant="outline" 
//   className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5 mt-5"
//   onClick={() => navigate(`/resume-analysis?jobId=${jobIdFromUrl}`)} // نفترض إن عندك jobId هنا
// >
//   <Sparkles size={16} /> Analyze My Resume
// </Button>
                  
//                   {/* المودال - بنبعت بيانات الـ selectedJob */}
//                   <ApplyModal 
//                     jobId={selectedJob.id} 
//                     jobTitle={selectedJob.title} 
//                     isOpen={isApplyModalOpen} 
//                     onClose={() => setIsApplyModalOpen(false)} 
//                   />
//                 </motion.div>
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </main>
//     <Footer />
//   </div>
// );
// };

// export default MatchedJobs;

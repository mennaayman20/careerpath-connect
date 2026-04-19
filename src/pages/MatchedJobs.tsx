import { useState } from "react";
import { Job } from "@/types/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Building2, X, Clock, Globe, Star, Briefcase, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { jobService } from "@/services/jobService";
import { useNavigate } from "react-router-dom";
import { ApplyModal } from "@/features/application/components/applyModal";
import { useMatchedJobs } from "@/hooks/useJobs";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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



  const getSkillStyle = (index: number) => {
  const styles = [
    { bg: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800", dot: "bg-blue-400" },
    { bg: "bg-violet-50 text-violet-900 border-violet-200 dark:bg-violet-950/50 dark:text-violet-200 dark:border-violet-800", dot: "bg-violet-400" },
    { bg: "bg-teal-50 text-teal-900 border-teal-200 dark:bg-teal-950/50 dark:text-teal-200 dark:border-teal-800", dot: "bg-teal-400" },
    { bg: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800", dot: "bg-amber-400" },
    { bg: "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-800", dot: "bg-rose-400" },
  ];
  return styles[index % styles.length];
};





const MatchedJobs = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({});
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
const { isAuthenticated } = useAuth();
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
  

  const handleProtectedAction = (action: () => void) => {
  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please login to access this feature.",
      variant: "destructive",
    });
    // بنبعته للوجين وبنحفظ هو كان فين عشان نرجعه تاني (state)
    setTimeout(() => navigate("/login", { state: { from: window.location.pathname + window.location.search } }), 1000);
    return;
  }
  // لو مسجل، نفذ الأكشن عادي
  action();
};




const handleApplicationClick = () => {
  handleProtectedAction(() => {
    const link = selectedJob?.applicationLink;
    if (!link) return;

    if (isEmailLink(link)) {
      const email = link.replace(/^mailto:/i, "").trim();
      window.location.href = `mailto:${email}`;
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  });
};

const isEmailLink = (link?: string) => {
  if (!link) return false;
  // لو بيبدأ بـ http أو https = رابط مش إيميل
  if (link.startsWith("http://") || link.startsWith("https://")) return false;
  // باقي الحالات = إيميل
  return true;
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
                  className="mt-8  px-10 h-12 text-lg font-bold shadow-lg hover:shadow-accent/20 transition-all"
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

                                  <h3 className="text-base font-semibold text-foreground  leading-snug pr-8">
                                    {job.title}
                                  </h3>

                                  {/* داخل الكارت - البحث عن جزء الـ Rank */}
<div className="flex justify-end items-start">
  <Badge 
    className={`
      flex items-center gap-1 px-4 py-1 rounded-full text-[10px] uppercase transition-all
      ${job.status?.toLowerCase() === "open" 
        ? "bg-[#4da78c] text-white shadow-sm shadow-[#1ca37b]/50 border-none" 
        : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      }
    `}
  >
    {job.status || "Unknown"}
  </Badge>
  

</div>
                                 {job.organizationName &&(
                           <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                         
                          <Building2 className="h-3.5 w-3.5" /> {job.organizationName}
                        </p>

                        )}

                                  


                                  {/* external */}
                         <div className="mt-2 mb-4 flex items-center gap-2">
  {job.jobSource === "external" ? (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
      <Globe className="h-3 w-3" /> External Source
    </span>
  ) : (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
      <Building2 className="h-3 w-3" /> BY UPPLY
    </span>
  )}
</div>






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


  {/* <Badge className="bg-accent/10 text-accent border-0 font-bold">
                        {selectedJob.matchPercentage}% Match
                      </Badge>
                    */}


                <div className="mt-4 flex flex-wrap gap-2 items-center">

  {/* type */}
  {selectedJob.type && (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
    bg-blue-50 text-blue-900 border-blue-200
    dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800">
    <Briefcase className="w-3 h-3" />
    {selectedJob.type}
  </span>
  )}


  {/* status — نقطة خضراء نابضة لو active */}
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
    bg-green-50 text-green-900 border-green-200
    dark:bg-green-950/50 dark:text-green-200 dark:border-green-800">
    <span className={cn(
      "w-1.5 h-1.5 rounded-full flex-shrink-0",
      selectedJob.status === "Active"
        ? "bg-green-500 animate-pulse"
        : "bg-muted-foreground"
    )} />
    {selectedJob.status}
  </span>

  {/* seniority */}
  {selectedJob.seniority && (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
    bg-amber-50 text-amber-900 border-amber-200
    dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800">
    <Star className="w-3 h-3" />
    {selectedJob.seniority}
  </span>
  )}


  {/* model */}
  {selectedJob.model && (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
    bg-violet-50 text-violet-900 border-violet-200
    dark:bg-violet-950/50 dark:text-violet-200 dark:border-violet-800">

    <Globe className="w-3 h-3" />
    {selectedJob.model}
  </span>

  )}

  {/* date */}
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
   bg-yellow-200 text-violet-900 border-violet-200
    dark:text-violet-200 dark:border-yellow-100
    border-border/50 text-muted-foreground bg-muted/40">
    <Clock className="w-3 h-3" />
    {getRelativeTime(selectedJob.createdDate)}
  </span>

</div>

                    {selectedJob.description && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-base text-foreground mb-2">Description</h4>
                       <p className="text-sm text-muted-foreground leading-relaxed tracking-wide whitespace-pre-line bg-muted/20 p-4 rounded-xl border border-border/50 font-medium">
    {selectedJob.description}
  </p> 
                      </div>
                    )}

                                  {/* Required Skills */}
                {selectedJob.skills?.length > 0 && (
  <div className="mt-8">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
        Required Skills
      </h4>
     
    </div>

    {/* Skills Grid */}
    <div className="flex flex-wrap gap-2.5">
      {selectedJob.skills.map((skill, i) => {
        const { bg, dot } = getSkillStyle(i);
        return (
          <span
            key={skill.skillId}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] font-semibold border transition-all hover:scale-105 cursor-default ${bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
            {skill.skillName}
          </span>
        );
      })}
    </div>
  </div>
)}

{selectedJob.jobSource?.toLowerCase() === "external" ? (
  <div className="mt-8 overflow-hidden rounded-2xl border-2 border-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm">
    <div className="flex items-center gap-3 bg-blue-500/10 px-4 py-3 border-b border-blue-500/10">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/30">
        <Globe className="h-5 w-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground">Apply Externally</h4>
        {/* <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Official Company Portal</p> */}
      </div>
    </div>
    
    <div className="p-4">
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        To apply, please use the contact method or external link provided by the recruiter below:
      </p>
      
           <div
  onClick={handleApplicationClick}
  className="group relative flex items-center justify-between gap-3 rounded-xl bg-background border border-border p-3 transition-all hover:border-blue-500 hover:shadow-md cursor-pointer"
>
  <span className="truncate text-sm font-medium text-blue-600 dark:text-blue-400 underline-offset-4 group-hover:underline">
    {selectedJob.applicationLink}
  </span>
  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
    {isEmailLink(selectedJob?.applicationLink) ? (
      <Mail className="h-3 w-3" />
    ) : (
      <Sparkles className="h-3 w-3" />
    )}
  </div>
</div>

    </div>
  </div>
) : (
  /* الزراير الأصلية بتاعتك */
  <>
     <Button 
      onClick={() => handleProtectedAction(() => setIsApplyModalOpen(true))}
      className="mt-8 w-full gradient-primary border-0"
      disabled={selectedJob.status === "Closed"}
    >
      {selectedJob.status === "Closed" ? "Position Closed" : "Apply Now"}
    </Button>

   
  </>
)}

<Button 
  variant="outline" 
  className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5 mt-5"
  onClick={() => handleProtectedAction(() => navigate(`/resume-analysis?jobId=${jobIdFromUrl}`))}
>
  <Sparkles size={16} /> Analyze My Resume
</Button>

{/* 3. المودال الداخلي */}
<ApplyModal 
  jobId={selectedJob.id} 
  jobTitle={selectedJob.title} 
  isOpen={isApplyModalOpen} 
  onClose={() => setIsApplyModalOpen(false)} 
/>



                    {/* <Button
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
                    /> */}
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

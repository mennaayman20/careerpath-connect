import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Job } from "@/types/jobs";
import { jobService } from "@/services/jobService";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, MapPin, Clock, Building2, Briefcase, X, Sparkles, Star, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ApplyModal } from "@/features/application/components/applyModal";
import { cn } from "@/lib/utils";
import { useJobDetails, useJobs } from "@/hooks/useJobs";



interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    postedAt: string;
    status: string;
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);}

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




const Jobs = () => {



  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get("id");



const { data: jobs = [], isLoading: isJobsLoading } = useJobs();
const { data: selectedJobDetails, isLoading: isDetailsLoading } = useJobDetails(jobIdFromUrl);

  
  const currentJobBase = jobs.find(j => j.id.toString() === jobIdFromUrl);
  const selectedJob = selectedJobDetails ? { ...currentJobBase, ...selectedJobDetails } : currentJobBase;

  const handleJobSelect = (job: Job) => {
    setSearchParams({ id: job.id.toString() });
    
  };

const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
const [applyingJobId, setApplyingJobId] = useState<number | null>(null);

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      (j.organizationName ?? "").toLowerCase().includes(q) ||
      j.type.toLowerCase().includes(q) ||
      j.seniority.toLowerCase().includes(q) ||
      j.model.toLowerCase().includes(q) ||
      j.status.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    );
  });


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

// const handleApplyClick = (job: Job) => {
//   if (!isAuthenticated) {
//     toast({
//       title: "Please login to apply",
//       description: "Create an account or sign in to apply for jobs.",
//       variant: "destructive",
//     });
//     setTimeout(() => navigate("/login"), 1500);
//     return;
//   }
//   setApplyingJobId(job.id);
//   setIsApplyModalOpen(true);

// };
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container flex-1 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Browse Jobs</h1>
          <p className="mt-1 text-muted-foreground">Find your next opportunity</p>
        
          {/* Search bar */}
<div className="relative mt-4 max-w-md">
  <Search
  id="search-input" 
  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-blue-500" />

  <Input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search by title, company, or skill…"
    className="peer h-11 rounded-full pl-11 pr-20 border-border/60  border-blue-300  
               focus:border-blue-400 focus:ring-2 focus:ring-blue-100
               dark:focus:ring-blue-950 transition-all"
  />

  
</div>
        </div>

        {isJobsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (

          <div className="flex gap-6">
          
            {/* Job list */}
            <div className={`flex-1 space-y-4 ${selectedJob ? "hidden md:block md:max-w-md" : ""}`}>
              {filtered.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No jobs found</p>
              ) : (
                filtered.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`cursor-pointer rounded-xl border bg-card p-5 transition-all hover:shadow-card ${selectedJob?.id === job.id ? "border-primary shadow-card" : "border-border"}`}
                    onClick={() => handleJobSelect(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-foreground">{job.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5" /> {job.organizationName}
                        </p>
                      </div>
                      <Badge variant={job.status === "Open" ? "default" : "secondary"} className={job.status === "Open" ? "bg-success text-success-foreground" : ""}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.type}</span>
                      {/* No hybrid or postedAt in new API. Show createdDate as posted date */}
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(job.createdDate).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Detail panel */}
          
            {selectedJob && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 rounded-xl border border-border bg-card p-6 shadow-card md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">{selectedJob.title}</h2>
                    <p className="mt-1 text-muted-foreground">{selectedJob.organizationName} · {selectedJob.location}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="md:hidden" 
                  onClick={() => {

                   
                    setSearchParams(prev => {
                      const newParams = new URLSearchParams(prev);
                      newParams.delete("id");
                      return newParams;
                    });
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>


                {/* <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{selectedJob.type}</Badge>
                   <Badge>{selectedJob.status}</Badge>
                
                  <Badge>{selectedJob.seniority}</Badge>
                  <Badge>{selectedJob.model}</Badge>

                 
                  <Badge>Posted {getRelativeTime(selectedJob.createdDate)}</Badge>

                  
                </div> */}




                <div className="mt-4 flex flex-wrap gap-2 items-center">

  {/* type */}
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
    bg-blue-50 text-blue-900 border-blue-200
    dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800">
    <Briefcase className="w-3 h-3" />
    {selectedJob.type}
  </span>

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
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
    bg-amber-50 text-amber-900 border-amber-200
    dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800">
    <Star className="w-3 h-3" />
    {selectedJob.seniority}
  </span>

  {/* model */}
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
    bg-violet-50 text-violet-900 border-violet-200
    dark:bg-violet-950/50 dark:text-violet-200 dark:border-violet-800">
    <Globe className="w-3 h-3" />
    {selectedJob.model}
  </span>

  {/* date */}
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border
   bg-yellow-200 text-violet-900 border-violet-200
    dark:text-violet-200 dark:border-yellow-100
    border-border/50 text-muted-foreground bg-muted/40">
    <Clock className="w-3 h-3" />
    {getRelativeTime(selectedJob.createdDate)}
  </span>

</div>

                


                {/* Job Description */}
                <div className="mt-6">
                  <h4 className="font-semibold text-base text-foreground mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedJob.description}</p>
                </div>

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

                


{/* زرار الـ Apply Now */}
<Button 

  onClick={() => setIsApplyModalOpen(true)}
  className="mt-8 w-full gradient-primary border-0"
  disabled={selectedJob.status === "Closed"}
>
  {selectedJob.status === "Closed" ? "Position Closed" : "Apply Now"}
</Button>

{/* المودال - بنبعت بيانات الـ selectedJob */}
<ApplyModal 
  jobId={selectedJob.id} 
  jobTitle={selectedJob.title} 
  isOpen={isApplyModalOpen} 
  onClose={() => setIsApplyModalOpen(false)} 
/>



<Button 
  variant="outline" 
  className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5 mt-5"
  onClick={() => navigate(`/resume-analysis?jobId=${jobIdFromUrl}`)} // نفترض إن عندك jobId هنا
>
  <Sparkles size={16} /> Analyze My Resume
</Button>


     


              </motion.div>
            )}
          </div> 
        )}
      </div>
 


      <Footer />
    </div>
  );
};

export default Jobs;

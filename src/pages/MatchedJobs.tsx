import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Job } from "@/types/jobs";
import { MatchedJob } from "@/types/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, MapPin, Briefcase, Building2, X, Clock } from "lucide-react";
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


const MatchedJobs = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
//   const [jobs, setJobs] = useState<MatchedJob[]>([]);
//   const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();


  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
// const [applyingJobId, setApplyingJobId] = useState<number | null>(null);



//   useEffect(() => {
//     // استدعاء الـ API الجديد
//     const fetchMatchedJobs = async () => {
//       try {
//         setLoading(true);
//     const data = await jobService.getMatchedJobs() as MatchedJob[];
//       setJobs(data);
//     } catch (error) {
//       console.error("Error fetching matched jobs:", error);
      
//     }
//     finally {      setLoading(false);
//     }
//   };
  
//   fetchMatchedJobs();
//   }, []);


const { 
  data: jobs = [], 
  isLoading, 
  error 
} = useMatchedJobs();

  const handleJobSelect = async (job: Job) => {
    
    setSearchParams({ id: job.id.toString() });
    setSelectedJob(job);
    if (!job.description) {
      const details = await jobService.getJobById(job.id); //
      setSelectedJob((prev) => ({ ...prev, ...details }));
    }
  };

  const handleApply = (job: Job) => {
    toast({ title: "Application Submitted!", description: `You've applied to ${job.title} at ${job.organizationName}.` });
  };
  return (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="container flex-1 py-8">
      
      {/* 1. حالة التحميل */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground animate-pulse">Analyzing your profile...</p>
        </div>
      ) : (
        <>
          {/* 2. حالة البروفايل الفاضي ( jobs.length === 0 ) */}
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
                onClick={() => navigate("/profile") }
              >
                Complete My Profile
              </Button>
            </motion.div>
          ) : (
            
            /* 3. حالة عرض الوظائف (لو فيه داتا) */
            <div className="space-y-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold font-display">Recommended Jobs</h1>
                <p className="text-muted-foreground">Top picks based on your unique skill set</p>
              </div>

              {!selectedJob ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  ">
                  {jobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative rounded-2xl border border-border bg-card p-6 hover:border-accent/50 hover:shadow-elevated transition-all cursor-pointer"
                      onClick={() => handleJobSelect(job)}
                    >
                      {/* محتوى كرت الوظيفة */}
                      
                      <div className="flex justify-between items-start mb-4  ">
                         <Badge className="bg-accent/10 text-accent border-0 font-bold">
                           {job.matchPercentage}% Match
                         </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                      <p className="text-muted-foreground flex items-center gap-2 mb-4">
                         <Building2 className="h-4 w-4" /> {job.organizationName}
                      </p>
                      <Button className="w-full variant-outline group-hover:gradient-accent transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJobSelect(job);
                        }}
                      >
                        View job details
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-elevated mx-auto"
                >
                  <div className="flex items-start justify-between mb-4 ">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground">{selectedJob.title}</h2>
                      <p className="mt-1 text-muted-foreground">{selectedJob.organizationName} · {selectedJob.location}</p>
                    </div>
                    <Button variant="ghost" size="icon" 
                    onClick={() => {
                      setSelectedJob(null);
                      setSearchParams(prev => {
                        const newParams = new URLSearchParams(prev);
                        newParams.delete("id");
                        return newParams;
                      });
                    }}>
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

                  {/* Job Description */}
                  {selectedJob.description && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-base text-foreground mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedJob.description}</p>
                    </div>
                  )}

                  {/* Required Skills */}
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
                  
                  {/* المودال - بنبعت بيانات الـ selectedJob */}
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

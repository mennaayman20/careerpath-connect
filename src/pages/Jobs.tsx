import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Job } from "@/types/jobs";
import { jobService } from "@/services/jobService";
import { JobDetails } from "@/types/jobdetails";
import { useSearchParams } from "react-router-dom";
import { Resume } from "../features/application/types/application.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, MapPin, Clock, Building2, Briefcase, X, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

import { ApplyModal } from "@/features/application/components/applyModal";
import { error } from "console";


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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
const [searchParams, setSearchParams] = useSearchParams();
const jobIdFromUrl = searchParams.get("id");

const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
const [applyingJobId, setApplyingJobId] = useState<number | null>(null);

const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);








 // 1. اجعلي الـ useEffect تجلب القائمة الأساسية فقط
useEffect(() => {
  const fetchJobsAndInitialDetails = async () => {
    try {
      setLoading(true);
      const data = await jobService.getAllJobs();
      const jobsFromApi = (data.content || []).map((j: Job) => ({
        ...j,
        organization: j.organizationName,
      }));
      setJobs(jobsFromApi);

      // لو فيه ID في الرابط، ابحث عنه في القائمة واجلب تفاصيله
      if (jobIdFromUrl) {
        const foundJob = jobsFromApi.find(j => j.id.toString() === jobIdFromUrl);
        if (foundJob) {
          // جلب التفاصيل الكاملة (الوصف والمهارات) للوظيفة المختارة في الرابط
          const details = await jobService.getJobById(foundJob.id);
          setSelectedJob({ ...foundJob, ...details });
        }
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  fetchJobsAndInitialDetails();
}, []); // بنشغلها مرة واحدة عند فتح الصفحة




// 2. دالة جديدة لجلب التفاصيل عند الضغط على الوظيفة فقط
const handleJobSelect = async (job: Job) => {
 setSearchParams({ id: job.id.toString() }); // تحديث الرابط بالـ ID
 setSelectedJob(job); // عرض البيانات الأساسية أولاً
  try {
    // اجلبي التفاصيل الإضافية (الوصف والمهارات) لو لم تكن موجودة
    if (!job.description) {
      const details = await jobService.getJobById(job.id);
      setSelectedJob(prev => prev?.id === job.id ? { ...prev, ...details } : prev);
      setJobs(prevJobs => prevJobs.map(j => j.id === job.id ? { ...j, ...details } : j)); //
      // تحديث القائمة الأصلية لكي لا نحتاج لجلب البيانات مرة أخرى لنفس الوظيفة
    }
  } catch (error) {
    console.error("Error fetching job details", error);
  }
};

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

const handleApplyClick = (job: Job) => {
  if (!isAuthenticated) {
    toast({
      title: "Please login to apply",
      description: "Create an account or sign in to apply for jobs.",
      variant: "destructive",
    });
    setTimeout(() => navigate("/login"), 1500);
    return;
  }
  setApplyingJobId(job.id);
  setIsApplyModalOpen(true);

};




  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container flex-1 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Browse Jobs</h1>
          <p className="mt-1 text-muted-foreground">Find your next opportunity</p>
          <div className="relative mt-4 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, company, or skill…" className="pl-10" />
          </div>
        </div>

        {loading ? (
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
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{selectedJob.type}</Badge>
                   <Badge>{selectedJob.status}</Badge>
                  {/* No hybrid in new API */}
                  <Badge>{selectedJob.seniority}</Badge>
                  <Badge>{selectedJob.model}</Badge>

                  {/* created date  */}
                  <Badge>Posted {getRelativeTime(selectedJob.createdDate)}</Badge>

                  
                </div>
                {/* Job Description */}
                <div className="mt-6">
                  <h4 className="font-semibold text-base text-foreground mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedJob.description}</p>
                </div>

                {/* Required Skills */}
                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-base text-foreground mb-1">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill) => (
                        <Badge key={skill.skillId} variant="secondary">{skill.skillName}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* <Button
        className="mt-8 w-full gradient-primary border-0"
        onClick={() => handleApplyClick(selectedJob)}
        disabled={selectedJob.status === "Closed"}
      >
        {selectedJob.status === "Closed" ? "Position Closed" : "Apply Now"}
      </Button>

      <ApplyModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={submitApplication}
        jobTitle={selectedJob?.title ?? ""}
        companyName={selectedJob?.organizationName ?? ""}
        resumes={[]}
        selectedResumeId={null}
        onSelectResume={setSelectedResumeId}
        coverLetter={""}
        onCoverLetterChange={setCoverLetter}
        isFetchingResumes={false}
        isSubmitting={isSubmitting}
        error={applyError}
      /> */}


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
      onClick={() => setIsAnalysisOpen(true)}
    >
      <Sparkles size={16} /> Analyze My Resume
    </Button>

    {/* استدعاء الـ Modal */}
     


              </motion.div>
            )}
          </div> 
        )}
      </div>



 {/* Apply Modal — add once, anywhere inside the return */}
 


      <Footer />
    </div>
  );
};

export default Jobs;

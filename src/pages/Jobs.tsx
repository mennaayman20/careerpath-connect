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
import { Search, MapPin, Clock, Building2, Briefcase, X, Sparkles, Star, Globe, Mail, ChevronRight, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ApplyModal } from "@/features/application/components/applyModal";
import { cn } from "@/lib/utils";
import { useJobDetails, useJobs, useJobSearch } from "@/hooks/useJobs";



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
 
  const [searchParams, setSearchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get("id");
  const { data: selectedJobDetails, isLoading: isDetailsLoading } = useJobDetails(jobIdFromUrl);


   
 const [search, setSearch] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");
const [currentPage, setCurrentPage] = useState(0);
const PAGE_SIZE = 10;

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 400);
  return () => clearTimeout(timer);
}, [search]);

const { data: jobsData, isLoading: isJobsLoading } = useJobs(currentPage, PAGE_SIZE);
const { data: searchData, isLoading: isSearchLoading } = useJobSearch(debouncedSearch, 0, PAGE_SIZE);

const isSearching = debouncedSearch.trim().length > 0;
const isLoading = isSearching ? isSearchLoading : isJobsLoading;
const totalPages = isSearching ? (searchData?.totalPages || 1) : (jobsData?.totalPages || 1);
const jobs = isSearching ? (searchData?.content || []) : (jobsData?.content || []);


// // 2. الـ Logic ده بيشتغل فوري في المتصفح
// const jobs = allJobs.filter((job) => {
//   const q = search.toLowerCase().trim();
  
//   // لو مفيش سيرش، اعرضي كل الوظائف
//   if (!q) return true;

//   // فلتري بناءً على الحقول اللي تحبيها
//   return (
//     job.title?.toLowerCase().includes(q) ||
//     job.organizationName?.toLowerCase().includes(q) ||
//     job.location?.toLowerCase().includes(q) ||
//     job.description?.toLowerCase().includes(q) ||
//     // لو عايزة تفلتري بالمهارات كمان:
//     job.skills?.some(skill => skill.skillName.toLowerCase().includes(q))
//   );
// });
  





  const currentJobBase = jobs.find(j => j.id.toString() === jobIdFromUrl);
  const selectedJob = selectedJobDetails ? { ...currentJobBase, ...selectedJobDetails } : currentJobBase;

  const handleJobSelect = (job: Job) => {
    setSearchParams({ id: job.id.toString() });
    
  };

const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
const [applyingJobId, setApplyingJobId] = useState<number | null>(null);




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
<section className="relative bg-[#2D236A] overflow-hidden py-10 px-8 mb-3 rounded-2xl">
  {/* Background Gradient */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_120%_at_85%_50%,rgba(28,163,123,.2)_0%,transparent_70%)]" />
  
  {/* 💡 الـ Container الأساسي اللي بيحكم المسافات والمحاذاة */}
  <div className="relative z-10 max-w-screen-xl mx-auto px-6 flex flex-col gap-8">
    
    {/* الجزء العلوي: النصوص والبادج */}
    <div>
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-[#1ca37b]/20 border border-[#1ca37b]/40 text-[#5de8b8] text-[10px] font-bold uppercase rounded-full px-3 py-1 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1ca37b] animate-pulse" /> 
        Explore Opportunities
      </div>
      
      {/* Main Heading - White and Bold */}
      <h1 className="font-display text-3xl md:text-2xl font-bold text-white mb-3">
        Browse <span className="text-[#59daad]">Available Jobs</span>
      </h1>
      
      {/* Subtitle - Brighter white for clarity */}
      <p className="text-white/80 max-w-lg leading-relaxed">
        Discover top opportunities and take the next step in your career.
      </p>
    </div>
    
    {/* 💡 السيرش بار: بنفس الاستايل الأصلي بتاعك بالظبط بس بمحاذاة مظبوطة */}
    <div className="w-full">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-20" />
        <Input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(0); }}
          placeholder="Search by Title, Company or location"
          className={cn(
            "peer h-11 w-full rounded-[15px] pl-11 pr-4 transition-all duration-300 ",
            "bg-background border-3 border-blue-200",
            "placeholder:text-muted-foreground/60",
            "animate-rotate-shadow focus:ring-0"
          )}
        />
      </div>
    </div>

  </div>
</section>
      <div className="container flex-1 py-8">
{/* Hero - full width */}







        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (

          <div className="flex gap-6">
          
            {/* Job list */}
            <div className={`flex-1 space-y-4 ${selectedJob ? "hidden md:block md:max-w-md" : ""}`}>
              {jobs.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No jobs found</p>
              ) : (
              jobs.map((job, i) => (
  <motion.div
    key={job.id}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05 }}
    onClick={() => handleJobSelect(job)}
    className={cn(
      "relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition-all duration-300",
      "bg-white  hover:shadow-xl hover:-translate-y-1 group",
      selectedJob?.id === job.id 
        ? "border-blue-300 bg-violet-50/30 dark:bg-violet-950/10 ring-1 ring-violet-500/20" 
        : "border-border hover:border-violet-300"
    )}
  >
    {/* شريط جانبي ملون - موف لـ Upply وأمبر للمصادر الخارجية */}
    <div className={cn(
      "absolute left-0 top-0 h-full w-1.5 transition-colors",
      job.jobSource === "external" ? "bg-amber-400" : "bg-violet-600"
    )} />

    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        {/* الشركة والمصدر */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {job.organizationName || "Confidential"}
          </span>
          <span className="h-1 w-1 rounded-full bg-border" />
          
          {job.jobSource === "external" ? (
             <span className="flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
               <Globe className="h-2.5 w-2.5" /> External
             </span>
          ) : (
             <span className="flex items-center gap-1 text-[10px] text-violet-700 font-bold bg-violet-100 px-2 py-0.5 rounded border border-violet-200">
               <Sparkles className="h-2.5 w-2.5" /> By UPPLY
             </span>
          )}
        </div>

        {/* عنوان الوظيفة */}
        <h3 className="font-display text-lg font-bold text-foreground transition-colors line-clamp-1">
          {job.title}
        </h3>

        {/* تفاصيل المكان والوقت */}
        <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4">
          {job.location && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted group-hover:bg-violet-100  transition-colors">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            {job.location}
          </div>
          )}


          {job.type && (
  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted group-hover:bg-violet-100 transition-colors">
      <Briefcase className="h-3.5 w-3.5" />
    </div>
    {job.type}
  </div>
)}

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted group-hover:bg-violet-100 transition-colors">
              <Clock className="h-3.5 w-3.5" />
            </div>
            {getRelativeTime(job.createdDate)}
          </div>
        </div>
      </div>

      {/* الحالة والسهم */}
      <div className="flex flex-col items-end gap-3">
        <Badge 
          className={cn(
            "rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase border-none shadow-sm transition-all",
            job.status?.toLowerCase() === "open" || job.status?.toLowerCase() === "active"
              ? "bg-[#1ca37b] text-white group-hover:bg-[#178a68]" 
              : "bg-slate-200 text-slate-600"
          )}
        >
          {job.status}
        </Badge>
        
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 shadow-sm">
          <ChevronRight className="h-4 w-4 text-violet-600" />
        </div>
      </div>
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


           




                <div className="mt-4 flex flex-wrap gap-2 items-center">

  {/* type */}

  {selectedJob.type &&(
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
  {selectedJob.model &&(
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

                


                {/* Job Description */}
                <div className="mt-6">
                  <h4 className="font-semibold text-base text-foreground mb-1">Description</h4>
<p className="text-sm text-muted-foreground leading-relaxed tracking-wide whitespace-pre-line bg-muted/20 p-4 rounded-xl border border-border/50 font-medium">
    {selectedJob.description}
  </p>                </div>

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
      

      {/* <a 
        href={selectedJob.applicationLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative flex items-center justify-between gap-3 rounded-xl bg-background border border-border p-3 transition-all hover:border-blue-500 hover:shadow-md"
      >



        <span className="truncate text-sm font-medium text-blue-600 dark:text-blue-400 underline-offset-4 group-hover:underline">
          {selectedJob.applicationLink}
        </span>

        
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
          <Sparkles className="h-3 w-3" />
        </div>
      </a> */}

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
  variant="ghost"
  className="w-full h-11 gap-2 mt-5 rounded-xl font-semibold relative overflow-hidden
             border-2 border-primary/40 text-primary bg-transparent
             transition-all duration-300 group
             hover:border-transparent hover:text-white hover:bg-transparent
             hover:[background:var(--gradient-primary,linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary)/0.7)))]
             hover:shadow-[0_4px_20px_hsl(var(--primary)/0.35)] hover:-translate-y-0.5"
  onClick={() => handleProtectedAction(() => navigate(`/resume-analysis?jobId=${jobIdFromUrl}`))}
>
  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent
                   -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
  <Sparkles size={16} className="transition-all duration-500 group-hover:rotate-180 group-hover:scale-110 relative z-10" />
  <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-px">
    Analyze Resume First
  </span>
</Button>

{/* 3. المودال الداخلي */}
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


        {totalPages > 1 && !search.trim() && (
            <div className="flex items-center justify-center gap-2 py-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-border bg-card hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-sm text-muted-foreground whitespace-nowrap">
                <span className="font-semibold text-foreground">{currentPage + 1}</span>
                {" / "}
                <span className="font-semibold text-foreground">{totalPages}</span>
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-border bg-card hover:border-primary/50 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
      </div>
 


      <Footer />
    </div>
  );
};

export default Jobs;

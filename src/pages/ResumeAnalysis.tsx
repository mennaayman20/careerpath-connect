import { useState, useEffect, useCallback , useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { applicationService } from "@/features/application/service/applicationService";
import { Job } from "@/types/jobs";
import {
  ArrowLeft,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,RefreshCw,Send,CloudUpload,X,
  Globe,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResumes } from "@/features/resume/hooks/useResumes";
import { ApplicationRequest } from "@/features/application/types/application.types";
import { toast } from "@/components/ui/sonner";
import { AnimatedNumber, AnimatedBar, FeedbackAccordion , SkillCard } from "./AnalysisHelpers"
import { Label } from "@/components/ui/label";
import { useJobDetails } from "@/hooks/useJobs";
/* ─── Circular progress ring ─── */
const CircularScore = ({ score }: { score: number }) => {
  const radius = 70;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "hsl(var(--chart-2))"
      : score >= 60
        ? "hsl(var(--chart-4))"
        : "hsl(var(--destructive))";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="180" height="180" className="-rotate-90">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="text-4xl font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {score}%
        </motion.span>
        <span className="text-xs text-muted-foreground font-medium">Match Score</span>
      </div>
    </div>
  );
};

const loadingMessages = [
  { text: "Scanning Resume…", icon: FileText },
  { text: "Comparing Skills with Job Requirements…", icon: Target },
  { text: "Calculating Match Score…", icon: Sparkles },
];



const ResumeAnalysis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId");
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
const fileInputRef = useRef<HTMLInputElement>(null);


const handleApply = async () => {
  if (!jobId || !selectedResumeId) {
    toast.error("Missing job or resume information.");
    return;
  }

  setIsApplying(true);
  try {
    const payload: ApplicationRequest = {
      jobId: Number(jobId),
      resumeId: Number(selectedResumeId),
     
    };

    console.log("Sending Payload:", payload);

    await applicationService.applyToJob(payload);
    
    toast.success("Application submitted successfully!");
    navigate("/applications");
  } catch (error: unknown) { // استخدمنا unknown بدل any
    console.error("Apply Error:", error);

    // التحقق من نوع الخطأ بشكل آمن للـ TypeScript
    let errorMessage = "Failed to submit application. Please try again.";
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    }

    toast.error(errorMessage);
  } finally {
    setIsApplying(false);
  }
};









  const {
    resumes,
    isLoading: isActionLoading,
    uploadResume,
    analyzeResume,
    analysisData,
    deleteResume,
  } = useResumes();

  const [state, setState] = useState<"upload" | "loading" | "result">("upload");
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
// ضيفي ده مع الـ Hooks في بداية Component ResumeAnalysis
const { data: jobDetails } = useJobDetails(jobId);

  useEffect(() => {
    if (resumes?.length > 0 && selectedResumeId === null) {
      setSelectedResumeId(resumes[0].id);
      setFileName(resumes[0].fileName);
    }
  }, [resumes, selectedResumeId]);


const handleUpload = useCallback(async (file: File) => {
    const newResume = await uploadResume(file);
    if (newResume) {
      setSelectedResumeId(newResume.id);
      setFileName(newResume.fileName);
    }
  }, [uploadResume]);




const onStartAnalysis = async () => {
    if (!selectedResumeId) {
      toast.error("Please select or upload a resume first");
      return;
    }
    
    setState("loading");
    try {
      await analyzeResume({ 
        resumeId: selectedResumeId, 
        jobId: jobId || undefined 
      });
      setState("result");
    } catch (error) {
      console.error(error);
      setState("upload");
      toast.error("Analysis failed. Please try again.");
    }
  };



  const handleDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  setDragActive(false);
  const file = e.dataTransfer.files?.[0];
  if (file?.type === "application/pdf") {
    handleUpload(file);
  }
}, [handleUpload]); // <--- ضيفها هنا




  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Job
          </Button>

<AnimatePresence mode="wait">
            {state === "upload" && (
              <motion.div key="upload" className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold">AI Resume Analysis</h1>
                  <p className="text-muted-foreground">Select a resume to analyze against this position</p>
                </div>

                <div className="mx-auto max-w-md space-y-6">
                  {/* Hidden File Input */}
                  <input 
                    type="file" ref={fileInputRef} className="hidden" accept=".pdf" 
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} 
                  />

                  {/* ✅ إصلاح 2: الـ Select الموحد */}
                  <div className="grid gap-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Target Resume</Label>
                    <Select
                      value={selectedResumeId?.toString() || ""}
                      onValueChange={(value) => {
                        if (value === "upload_new") {
                          fileInputRef.current?.click();
                        } else {
                          const res = resumes.find(r => r.id.toString() === value);
                          if (res) {
                            setSelectedResumeId(res.id);
                            setFileName(res.fileName);
                          }
                        }
                      }}
                    >
                      <SelectTrigger className="h-14 rounded-xl border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <SelectValue placeholder="Select or upload resume" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upload_new" className="font-bold text-primary">
                          + Upload new resume
                        </SelectItem>
                        {resumes?.map((resume) => (
                          <SelectItem key={resume.id} value={resume.id.toString()}>
                            {resume.fileName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Analyze Button */}
                  <div className="flex justify-center">
                    <Button 
                      size="lg" 
                      className="w-full gap-2" 
                      disabled={!selectedResumeId || isActionLoading} 
                      onClick={onStartAnalysis}
                    >
                      <Sparkles className="w-5 h-5" />
                      {isActionLoading ? "Processing..." : "Generate AI Analysis"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}



            {state === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 gap-10">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="p-5 rounded-full bg-primary/10">
                  <RefreshCw className="w-10 h-10 text-primary" />
                </motion.div>
                <div className="space-y-4 text-center w-full max-w-sm">
                  {loadingMessages.map((msg, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary">
                      <msg.icon className="w-5 h-5 animate-pulse" />
                      <span className="text-sm font-medium">{msg.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}



{state === "result" && analysisData && (
  <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    
    {/* ── HERO: Score + Bars ── */}
    <motion.div
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
      className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-0.5 rounded-2xl overflow-hidden border border-border shadow-sm"
    >
     <div className="bg-red-50/50 dark:bg-red-950/20 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border min-h-[320px]">
  {/* الجزء العلوي: الـ Circular Score */}
  <div className="flex flex-col items-center justify-center flex-1">
    <div className="relative">
      <CircularScore score={analysisData.jobMatchScore || 0} />
      {/* لمسة إضافية: كلمة Match Score تحت الرقم جوه الدايرة أو تحتها مباشرة */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-red-800/60 dark:text-red-500/60 mt-4 font-bold text-center">
        Match score
      </p>
    </div>
  </div>

  {/* الجزء السفلي: الـ Strengths */}
  <div className="mt-8">
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-semibold text-center md:text-left">
      Key Strengths
    </p>
    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
      {analysisData.topStrengths?.map((strength, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.1 }}
          className="bg-green-100/80 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full px-3 py-1 text-[11px] font-bold border border-green-200/50 dark:border-green-800"
        >
          {strength}
        </motion.span>
      ))}
    </div>
  </div>
</div>

      <div className="flex flex-col bg-stone-50/50 dark:bg-stone-900/20">
        {Object.entries(analysisData.score).map(([key, value], i, arr) => {
          const scoreValue = value as number;
          // تحسين: دالة موحدة لتحديد اللون بناءً على السكور
          const getScoreColor = (v: number) => v >= 70 ? "#16a34a" : v >= 40 ? "#ca8a04" : "#dc2626";
          const color = getScoreColor(scoreValue);

          return (
            <div key={key} className={`flex items-center gap-4 px-6 py-4 ${i !== arr.length - 1 ? "border-b border-border/50" : ""}`}>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 w-24 shrink-0 font-bold">
                {key.replace("_", " ")}
              </span>
              <div className="flex-1 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <AnimatedBar value={scoreValue} color={color} delay={400 + i * 100} />
              </div>
              <span className="text-xs font-bold w-8 text-right font-mono" style={{ color }}>{scoreValue}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>

    {/* ── STRATEGIC ADVICE ── */}
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }}
      className="bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-5 flex gap-4 items-start border border-blue-100 dark:border-blue-900"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 shadow-sm">
        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold mb-1">Strategic Advice</p>
        <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed font-medium">{analysisData.topTip}</p>
      </div>
    </motion.div>

    {/* ── FEEDBACK DETAILS ── */}
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.4 }}>
      <p className="text-[13px] uppercase tracking-widest text-muted-foreground font-semibold mb-3 px-1">Analysis Details</p>
      <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
        {Object.entries(analysisData.feedback).map(([key, text], i, arr) => {
          const scoreValue = analysisData.score[key as keyof typeof analysisData.score] as number;
          const color = scoreValue >= 70 ? "#16a34a" : scoreValue >= 40 ? "#ca8a04" : "#dc2626";
          
          return (
            <FeedbackAccordion
              key={key}
              label={key.replace("_", " ")}
              text={text as string}
              fix={analysisData.fixes[key as keyof typeof analysisData.fixes]}
              score={scoreValue}
              color={color}
              isLast={i === arr.length - 1}
            />
          );
        })}
      </div>
    </motion.div>

    {/* ── SKILLS GRID ── */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkillCard 
        title="Matched skills" 
        skills={analysisData.matchedSkills} 
        variant="green" 
        icon={<CheckCircle2 className="w-3.5 h-3.5" />} 
      />
      <SkillCard 
        title="Missing skills" 
        skills={analysisData.missingSkills} 
        variant="red" 
        icon={<X className="w-3.5 h-3.5" />} 
      />
    </div>

    {/* ── QUICK WINS ── */}
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.4 }}
      className="rounded-2xl overflow-hidden border border-border shadow-sm"
    >
      <div className="bg-violet-50 dark:bg-violet-950/30 px-5 py-3 border-b border-border flex items-center gap-2 font-bold uppercase tracking-widest text-[11px] text-violet-600 dark:text-violet-400">
        <Sparkles className="w-4 h-4" /> Quick wins
      </div>
      <div className="bg-background divide-y divide-border">
        {analysisData.quickWins?.map((win, i) => (
          <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-stone-50/50 dark:hover:bg-stone-900/20 transition-colors">
            <span className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-[11px] font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <span className="text-sm text-foreground/80 leading-relaxed font-medium">{win}</span>
          </div>
        ))}
      </div>
    </motion.div>

    {/* ── FOOTER ACTIONS ── */}
  {/* ── FOOTER ACTIONS (النسخة الذكية والغير تقليدية) ── */}
<div className="pt-8 mt-10 border-t border-border/80 flex flex-col items-center gap-10">
  
  {/* لو الوظيفة خارجية (External) */}
  {jobDetails?.jobSource?.toLowerCase() === "external" ? (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.5 }}
      className="w-full max-w-3xl overflow-hidden rounded-3xl border border-blue-100 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900 shadow-lg shadow-blue-500/5"
    >
      <div className="flex items-center gap-4 bg-blue-100 dark:bg-blue-900 px-6 py-4 border-b border-blue-200 dark:border-blue-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-base font-extrabold text-foreground">Apply with this Analysis</h4>
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.15em]">Direct Contact / External Application</p>
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-8 bg-background/50 backdrop-blur-sm">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {/* جملة واضحة ومكملة للـ Flow */}
            Now that you've seen your AI analysis, use the recruiter's official link below to submit your resume and complete your application directly.
          </p>
        </div>
        
        <div className="shrink-0 flex items-center justify-center">
          {jobDetails.applicationLink ? (
            <a 
              href={jobDetails.applicationLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-[13px] tracking-wide text-white transition-all duration-300
                bg-blue-600 shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5"
            >
              Go to Application way
              <ArrowLeft className="w-4 h-4 rotate-180" /> {/* سهم للأمام */}
            </a>
          ) : (
            <span className="text-sm font-semibold text-destructive/80">Application link is not available.</span>
          )}
        </div>
      </div>
    </motion.div>
  ) : (
    /* لو داخلية (Internal) - بنعرض الـ Button الأصلي بتاعك */
    <div className="w-full flex justify-center">
      <Button 
        size="lg" 
        className="gap-2 min-w-[280px] rounded-xl font-semibold tracking-widest shadow-lg shadow-primary/20" 
        onClick={handleApply} 
        disabled={isApplying}
      >
        {isApplying ? (
          <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting...</>
        ) : (
          <><Send className="w-4 h-4" /> Apply Now</>
        )}
      </Button>
    </div>
  )}

  {/* ديما بنسيب زرار الـ "Analyze Another" تحت كـ Option */}
  <Button 
  variant="outline" // غيرنا الـ variant لـ outline عشان ياخد برواز

  onClick={() => setState("upload")} 
  disabled={isApplying} 
  className="
    gap-2 px-12 py-2 rounded-xl text-[13px] font-bold tracking-wide
    border-dashed border-2  border-slate-400
    
    hover:bg-primary/5 hover:text-primary hover:border-primary/30 
    transition-all duration-300 group
  "
>
  {/* أيقونة بتتحرك خفيف مع الـ hover */}
  <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
  Analyze another resume
</Button>
</div>
  </motion.div>
)}



            
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResumeAnalysis;
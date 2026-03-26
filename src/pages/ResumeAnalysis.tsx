import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResumes } from "@/features/resume/hooks/useResumes";
import Jobs from "./Jobs";
import { ApplicationRequest } from "@/features/application/types/application.types";
import { toast } from "@/components/ui/sonner";
import { AnimatedNumber, AnimatedBar, FeedbackAccordion , SkillCard } from "./AnalysisHelpers";

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


  

  const handleApply = async () => {

    
  if (!jobId || !selectedResumeId) {
    alert("Missing job or resume information.");
    return;
  }

 setIsApplying(true);
  try {
    // --- هنا مكان الـ Payload المظبوط ---
    const payload: ApplicationRequest = {
      jobId: parseInt(jobId), // تأكد إن الـ jobId رقم
        resumeId: selectedResumeId,
        coverLetter: coverLetter || "", // عشان نضمن إن الـ Key يتبعت دايماً
    };

    console.log("البيانات اللي رايحة للسيرفر:", payload);

    // نبعت الـ payload للـ service
    await applicationService.applyToJob(payload);
    
    toast.success("application submitted successfully!");
    navigate("/applications");
  } catch (error) {
    console.error("خطأ أثناء التقديم:", error);
    toast.error("Failed to submit application. Please try again.");
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

  useEffect(() => {
    if (resumes && resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0].id);
      setFileName(resumes[0].fileName);
    }
  }, [resumes, selectedResumeId]);

  const handleUpload = async (file: File) => {
    const newResume = await uploadResume(file);
    if (newResume) {
      setSelectedResumeId(newResume.id);
      setFileName(newResume.fileName);
    }
  };

  const onStartAnalysis = async () => {
    if (!selectedResumeId) return;
    setState("loading");
    try {
      await analyzeResume(selectedResumeId, jobId || undefined);
      setState("result");
    } catch {
      setState("upload");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") {
      handleUpload(file);
    }
  }, []);

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
              <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-foreground">AI Resume Analysis for</h1>
                  <p className="text-muted-foreground max-w-lg mx-auto">Upload or select your resume to get an AI-powered analysis.</p>
                </div>

                {fileName && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md">
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="flex items-center gap-4 py-4 px-5">
                        <div className="p-2 rounded-lg bg-primary/10"><FileText className="w-6 h-6 text-primary" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                          <p className="text-xs text-muted-foreground">Current Resume</p>
                        </div>
                        {/* <Button variant="ghost" size="icon" 
                        onClick={() => { if (selectedResumeId) deleteResume(selectedResumeId); setFileName(null); setSelectedResumeId(null); }}>
                          <X className="w-4 h-4" />
                        </Button> */}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                <label
                  className={`mx-auto max-w-md flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"}`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <CloudUpload className="w-8 h-8 text-primary" />
                  <div className="text-center">
                    <p className="font-medium">{fileName ? "Change Resume" : "Drag & Drop Resume"}</p>
                    <p className="text-sm text-muted-foreground">PDF only · Max 10 MB</p>
                  </div>
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                </label>

                <div className="flex justify-center">
                  <Button size="lg" disabled={!selectedResumeId || isActionLoading} className="gap-2" onClick={onStartAnalysis}>
                    <Sparkles className="w-5 h-5" />
                    {isActionLoading ? "Processing..." : "Generate AI Analysis"}
                  </Button>
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

            {/* الاصل */}
            {/* {state === "result" && analysisData && (
              <motion.div key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <Card className="overflow-hidden">
                  <CardContent className="p-0 grid md:grid-cols-[auto_1fr] items-center">
                    <div className="flex items-center justify-center p-10 bg-muted/30">
                      <CircularScore score={analysisData.jobMatchScore || 0} />
                    </div>
                    <div className="p-8 space-y-4">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" /> AI Summary
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">{analysisData.feedback.CULTURE_FIT}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-chart-2/20">
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="text-chart-2 w-5 h-5"/> Strengths</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {analysisData.topStrengths?.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5" />{s}</div>
                      ))}
                    </CardContent>
                  </Card>


                 

                  <Card className="border-chart-4/20">
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="text-chart-4 w-5 h-5"/> 
                    Improvements</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {analysisData.quickWins?.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm"><AlertCircle className="w-4 h-4 text-chart-4 mt-0.5" />{w}</div>
                      ))}
                    </CardContent>
                  </Card>


                  <Card className="border-chart-4/20">
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="text-chart-4 w-5 h-5"/>Missing Skills</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {analysisData.missingSkills?.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm"><AlertCircle className="w-4 h-4 text-chart-4 mt-0.5" />{w}</div>
                      ))}
                    </CardContent>
                  </Card>




                  <Card className="border-chart-4/20">
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="text-chart-4 w-5 h-5"/>top tip</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2 text-sm"><AlertCircle className="w-4 h-4 text-chart-4 mt-0.5" />{analysisData.topTip}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => setState("upload")}>Analyze Another</Button>

  





  <Button 
    className="gap-2 min-w-[140px]" 
    onClick={handleApply} // بننادي على الدالة اللي جهزنا فيها الـ Payload
    disabled={isApplying} // تعطيل الزرار عشان نمنع الـ Double Click
  >
    {isApplying ? (
      <>
        <RefreshCw className="w-4 h-4 animate-spin" />
        Applying...
      </>
    ) : (
      <>
        <Send className="w-4 h-4" />
        Apply Now
      </>
    )}
  </Button>


                </div>
              </motion.div>
            )} */}



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
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border">
      <Button variant="ghost" size="lg" onClick={() => setState("upload")} disabled={isApplying} className="rounded-xl font-semibold border-4  tracking-widest ">
        Analyze another
      </Button>
      <Button size="lg" className="gap-2 min-w-[200px] rounded-xl font-semibold  tracking-widest shadow-lg shadow-primary/20" onClick={handleApply} disabled={isApplying}>
        {isApplying ? <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Apply Now</>}
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
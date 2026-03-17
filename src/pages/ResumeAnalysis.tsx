import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Target,
  Zap,
  RefreshCw,
  Send,
  CloudUpload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Mock analysis result
const mockAnalysis = {
  summary:
    "This resume shows strong backend experience but needs to highlight distributed systems skills more prominently.",
  score: { Backend: 90, Cloud: 75, "Distributed Systems": 50 },
  jobMatchScore: 82,
  topStrengths: ["Expert in Java/Spring Boot", "Proficient in Docker/K8s"],
  quickWins: ["Add Kafka keywords", "Highlight DB optimization"],
  matchedSkills: ["Java", "Spring Boot", "Microservices"],
  missingSkills: ["Kafka", "Scalability", "NoSQL"],
  topTip:
    "Tailor your project descriptions to emphasize distributed systems scale.",
  jobSpecific: true,
};

type PageState = "upload" | "loading" | "result";

const loadingMessages = [
  { text: "Scanning Resume…", icon: FileText, duration: 1800 },
  { text: "Comparing Skills with Job Requirements…", icon: Target, duration: 2200 },
  { text: "Calculating Match Score…", icon: Sparkles, duration: 1600 },
];

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
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
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
        <span className="text-xs text-muted-foreground font-medium">
          Match Score
        </span>
      </div>
    </div>
  );
};

/* ─── Category bar ─── */
const ScoreBar = ({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) => (
  <motion.div
    className="space-y-1"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-semibold text-foreground">{value}%</span>
    </div>
    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{
          background:
            value >= 80
              ? "hsl(var(--chart-2))"
              : value >= 60
                ? "hsl(var(--chart-4))"
                : "hsl(var(--destructive))",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
      />
    </div>
  </motion.div>
);

/* ─── Main page ─── */
const ResumeAnalysis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId") || "1";

  const [state, setState] = useState<PageState>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Simulate existing resume
  const [hasExistingResume] = useState(true);
  const existingResumeName = "My_Resume_2026.pdf";

  useEffect(() => {
    if (hasExistingResume && !fileName) {
      setFileName(existingResumeName);
    }
  }, [hasExistingResume]);

  /* loading sequence */
  useEffect(() => {
    if (state !== "loading") return;
    let step = 0;
    setLoadingStep(0);

    const advance = () => {
      step++;
      if (step < loadingMessages.length) {
        setLoadingStep(step);
        setTimeout(advance, loadingMessages[step].duration);
      } else {
        setTimeout(() => setState("result"), 600);
      }
    };
    setTimeout(advance, loadingMessages[0].duration);

    return () => {
      step = loadingMessages.length; // cancel
    };
  }, [state]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") setFileName(file.name);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Job
          </Button>

          <AnimatePresence mode="wait">
            {/* ───── UPLOAD STATE ───── */}
            {state === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    AI Resume Analysis
                  </h1>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Upload or select your resume to get an AI-powered analysis
                    matched against the job requirements.
                  </p>
                </div>

                {/* Current resume */}
                {fileName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-auto max-w-md"
                  >
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="flex items-center gap-4 py-4 px-5">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Current Resume
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => setFileName(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Drop zone */}
                <label
                  className={`mx-auto max-w-md flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? "border-primary bg-primary/10 scale-[1.02]"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <div className="p-4 rounded-full bg-primary/10">
                    <CloudUpload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-medium text-foreground">
                      {fileName ? "Change Resume" : "Drag & Drop your Resume"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF only · Max 10 MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {/* CTA */}
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    disabled={!fileName}
                    className="gap-2 px-8 text-base"
                    onClick={() => setState("loading")}
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate AI Analysis
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ───── LOADING STATE ───── */}
            {state === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-10"
              >
                {/* spinner */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="p-5 rounded-full bg-primary/10"
                >
                  <RefreshCw className="w-10 h-10 text-primary" />
                </motion.div>

                <div className="space-y-6 text-center w-full max-w-sm">
                  {loadingMessages.map((msg, i) => {
                    const Icon = msg.icon;
                    const isActive = i === loadingStep;
                    const isDone = i < loadingStep;
                    return (
                      <motion.div
                        key={i}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-300 ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : isDone
                              ? "text-muted-foreground"
                              : "text-muted-foreground/40"
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-chart-2 shrink-0" />
                        ) : (
                          <Icon
                            className={`w-5 h-5 shrink-0 ${isActive ? "animate-pulse" : ""}`}
                          />
                        )}
                        <span className="text-sm font-medium">{msg.text}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ───── RESULT STATE ───── */}
            {state === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Hero: Score + Summary */}
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-[auto_1fr] items-center">
                      {/* Score ring */}
                      <div className="flex items-center justify-center p-8 md:p-10 bg-muted/30">
                        <CircularScore score={mockAnalysis.jobMatchScore} />
                      </div>

                      {/* Summary */}
                      <div className="p-6 md:p-8 space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <h2 className="text-xl font-bold text-foreground">
                            AI Analysis Summary
                          </h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {mockAnalysis.summary}
                        </p>

                        {/* Category scores */}
                        <div className="space-y-3 pt-2">
                          {Object.entries(mockAnalysis.score).map(
                            ([label, value], i) => (
                              <ScoreBar
                                key={label}
                                label={label}
                                value={value}
                                delay={0.3 + i * 0.15}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Grid: Strengths / Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="h-full border-chart-2/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="p-1.5 rounded-lg bg-chart-2/10">
                            <CheckCircle2 className="w-5 h-5 text-chart-2" />
                          </div>
                          Top Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {mockAnalysis.topStrengths.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                            <span className="text-foreground">{s}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Quick Wins */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="h-full border-chart-4/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="p-1.5 rounded-lg bg-chart-4/10">
                            <TrendingUp className="w-5 h-5 text-chart-4" />
                          </div>
                          Quick Wins
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {mockAnalysis.quickWins.map((w, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 text-sm"
                          >
                            <AlertCircle className="w-4 h-4 text-chart-4 mt-0.5 shrink-0" />
                            <span className="text-foreground">{w}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Skills comparison */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Matched */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="h-full">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Target className="w-5 h-5 text-chart-2" />
                          Matched Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {mockAnalysis.matchedSkills.map((s) => (
                            <Badge
                              key={s}
                              className="bg-chart-2/10 text-chart-2 border-chart-2/20 hover:bg-chart-2/20"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Missing */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="h-full">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Zap className="w-5 h-5 text-chart-4" />
                          Missing Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {mockAnalysis.missingSkills.map((s) => (
                            <Badge
                              key={s}
                              variant="outline"
                              className="border-chart-4/30 text-chart-4"
                            >
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Top Tip */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                    <CardContent className="flex items-start gap-4 py-5 px-6">
                      <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                        <Lightbulb className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Pro Tip
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {mockAnalysis.topTip}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setState("upload")}
                  >
                    <Upload className="w-4 h-4" />
                    Analyze Another Resume
                  </Button>
                  <Button size="lg" className="gap-2 px-8">
                    <Send className="w-5 h-5" />
                    Apply Now with this Resume
                  </Button>
                </motion.div>
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

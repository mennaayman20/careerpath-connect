import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { type Job } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, MapPin, Briefcase, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const MatchedJobs = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMatchedJobs().then((data) => { setJobs(data); setLoading(false); });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container flex-1 py-8">
        <div className="mb-8 flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-accent" />
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Jobs Matched for You</h1>
            <p className="text-muted-foreground">AI-ranked based on your profile and skills</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-elevated"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-display font-semibold text-foreground">{job.title}</h3>
                  <Badge className="gradient-accent border-0 text-accent-foreground font-bold">
                    {job.matchPercentage}%
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" /> {job.organization}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.type}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {job.skills.slice(0, 3).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                  {job.skills.length > 3 && <Badge variant="secondary" className="text-xs">+{job.skills.length - 3}</Badge>}
                </div>
                <Button className="mt-4 w-full gradient-primary border-0" size="sm" onClick={() => toast({ title: "Applied!", description: `Application sent to ${job.organization}.` })}>
                  Apply Now
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MatchedJobs;

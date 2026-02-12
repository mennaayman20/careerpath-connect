import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { type Job } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, MapPin, Clock, Building2, Briefcase, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Jobs = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getJobs().then((data) => { setJobs(data); setLoading(false); });
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.organization.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApply = (job: Job) => {
    if (!isAuthenticated) {
      toast({ title: "Please login to apply", description: "Create an account or sign in to apply for jobs.", variant: "destructive" });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    toast({ title: "Application Submitted!", description: `You've applied to ${job.title} at ${job.organization}.` });
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
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-foreground">{job.title}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5" /> {job.organization}
                        </p>
                      </div>
                      <Badge variant={job.status === "Open" ? "default" : "secondary"} className={job.status === "Open" ? "bg-success text-success-foreground" : ""}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.type}</span>
                      {job.hybrid && <Badge variant="outline" className="text-xs">Hybrid</Badge>}
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.postedAt}</span>
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
                    <p className="mt-1 text-muted-foreground">{selectedJob.organization} · {selectedJob.location}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedJob(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{selectedJob.type}</Badge>
                  {selectedJob.hybrid && <Badge variant="outline">Hybrid</Badge>}
                  <Badge variant={selectedJob.status === "Open" ? "default" : "secondary"} className={selectedJob.status === "Open" ? "bg-success text-success-foreground" : ""}>
                    {selectedJob.status}
                  </Badge>
                </div>
                <div className="mt-6">
                  <h3 className="font-display font-semibold text-foreground">Description</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selectedJob.description}</p>
                </div>
                <div className="mt-6">
                  <h3 className="font-display font-semibold text-foreground">Required Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedJob.skills.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
                <Button className="mt-8 w-full gradient-primary border-0" onClick={() => handleApply(selectedJob)} disabled={selectedJob.status === "Closed"}>
                  {selectedJob.status === "Closed" ? "Position Closed" : "Apply Now"}
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

import { useState, useEffect } from "react";
import { resumeService } from "../../resume/services/resume.service";
import { ApplicationRequest} from "../types/application.types";
import { ResumeResponse } from "@/features/resume/types/resume.types";
import { useToast } from "@/hooks/use-toast";

export const useJobApplication = (jobId: number) => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  
  const [isUploading, setIsUploading] = useState(false);

  // 1. تحميل كل الريزمي والـ default واحد
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [allResumes, lastResume] = await Promise.all([
          resumeService.getAllResumes(),
          resumeService.getLatestResume()
        ]);
        setResumes(allResumes);
        if (lastResume) setSelectedResumeId(lastResume.id);
      } catch (err) {
        console.error("Failed to load application data", err);
      }
    };
    loadInitialData();
  }, []);

  // 2. فنكشن التقديم
  const submitApplication = async () => {
    if (!selectedResumeId) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please select a resume" });
      return;
    }

    setIsSubmitting(true);
    try {
      await resumeService.applyToJob({
        jobId,
        resumeId: selectedResumeId,
        coverLetter
      });
      toast({ title: "Applied!", description: "Your application was sent successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "You have already applied for this job" });
    } finally {
      setIsSubmitting(false);
    }
  };





 const uploadAndSelectResume = async (file: File) => {
    setIsUploading(true);
    try {
      const newResume = await resumeService.uploadResume(file);
      setResumes((prev) => [newResume, ...prev]); // نضيف الملف الجديد للقائمة
      setSelectedResumeId(newResume.id); // نختاره تلقائياً
      toast({ title: "Success", description: "Resume uploaded successfully" });
    } catch (err) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload file" });
    } finally {
      setIsUploading(false);
    }
  };







  return {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    coverLetter,
    setCoverLetter,
    submitApplication,
    isSubmitting,

    isUploading,
    uploadAndSelectResume,


    
  };
};
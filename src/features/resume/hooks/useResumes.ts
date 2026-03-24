import { useState, useEffect, useCallback } from "react";
import { ResumeFeedbackResponse, ResumeResponse } from "../types/resume.types";
import { resumeService } from "../services/resume.service";
import { useToast } from "@/hooks/use-toast";

export const useResumes = () => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<{ id: number; fileName: string; pdfUrl: string } | null>(null);


const [analysisData, setAnalysisData] = useState<ResumeFeedbackResponse | null>(null);


  /**
   * Fetch all resumes
   */
  const fetchResumes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await resumeService.getAllResumes();
      setResumes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load resumes";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Upload a new resume
   */
  const uploadResume = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);
      try {
        const newResume = await resumeService.uploadResume(file);
        setResumes((prev) => [newResume, ...prev]);
        toast({
          title: "Success",
          description: "Resume uploaded successfully",
        });
        return newResume;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to upload resume";
        setError(message);
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: message,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  /**
   * Delete a resume and refresh the list
   */
  const deleteResume = useCallback(
    async (resumeId: number) => {
      try {
        await resumeService.deleteResume(resumeId);
        setResumes((prev) => prev.filter((r) => r.id !== resumeId));
        toast({
          title: "Deleted",
          description: "Resume deleted successfully",
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete resume";
        setError(message);
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: message,
        });
        throw err;
      }
    },
    [toast]
  );

  /**
   * View resume in modal with PDF viewer
   */
  const viewResume = useCallback(async (resumeId: number) => {
    try {
      const pdfUrl = await resumeService.viewResumeAsBlob(resumeId);
      const resume = resumes.find((r) => r.id === resumeId);
      if (resume) {
        setSelectedResume({
          id: resumeId,
          fileName: resume.fileName,
          pdfUrl,
        });
        setViewerOpen(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to view resume";
      toast({
        variant: "destructive",
        title: "View Failed",
        description: message,
      });
    }
  }, [resumes, toast]);

  /**
   * Download resume
   */
  const downloadResume = useCallback(
    async (resumeId: number) => {
      try {
        await resumeService.downloadResume(resumeId);
        toast({
          title: "Downloaded",
          description: "Resume download started",
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to download resume";
        toast({
          variant: "destructive",
          title: "Download Failed",
          description: message,
        });
      }
    },
    [toast]
  );

  const closeViewer = useCallback(() => {
    if (selectedResume?.pdfUrl) {
      URL.revokeObjectURL(selectedResume.pdfUrl);
    }
    setViewerOpen(false);
    setSelectedResume(null);
  }, [selectedResume]);

  // Fetch resumes on mount
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);


const analyzeResume = useCallback(async (resumeId: number, jobId?: string) => {
  setIsLoading(true);
  try {
    const data = await resumeService.getResumeAnalysis(resumeId, jobId);
    setAnalysisData(data);
    return data;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    toast({ variant: "destructive", title: "Analysis Error", description: message });
    throw err;
  } finally {
    setIsLoading(false);
  }
}, [toast]);

// رجع analyzeResume و analysisData في الـ return










  return {
    resumes,
    isLoading,
    error,
    uploadResume,
    deleteResume,
    viewResume,
    downloadResume,
    refetch: fetchResumes,
    viewerOpen,
    selectedResume,
    closeViewer,
    
    analyzeResume,
    analysisData,
  };
};
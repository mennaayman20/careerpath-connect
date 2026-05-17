import { useState, useCallback } from "react";
import { applicationService } from "../services/application.service";
import { ApplicationResponse } from "../types/recruiter.types";
import { toast } from "sonner";


export const useApplicantDetail = () => {
  const [applicant, setApplicant] = useState<ApplicationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchApplicant = useCallback(async (applicationId: number) => {
    setLoading(true);
    try {
      const data = await applicationService.getApplicationById(applicationId);
      setApplicant(data);
    } catch {
      toast.error("Failed to load applicant details");
    } finally {
      setLoading(false);
    }
  }, []);

  const viewResume = useCallback(async (applicationId: number) => {
    setResumeLoading(true);
    try {
      const url = await applicationService.viewResume(applicationId);
      setResumeUrl(url);
    } catch {
      toast.error("Failed to load resume");
    } finally {
      setResumeLoading(false);
    }
  }, []);

  const downloadResume = useCallback(
    async (applicationId: number, applicantName: string) => {
      setDownloading(true);
      try {
        await applicationService.downloadResume(applicationId, applicantName);
        toast.success("Resume downloaded");
      } catch {
        toast.error("Failed to download resume");
      } finally {
        setDownloading(false);
      }
    },
    []
  );

  const clearResume = useCallback(() => {
    if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    setResumeUrl(null);
  }, [resumeUrl]);

  return {
    applicant,
    loading,
    resumeUrl,
    resumeLoading,
    downloading,
    fetchApplicant,
    viewResume,
    downloadResume,
    clearResume,
  };
};
import { useState, useCallback } from "react";
import { recruiterJobService } from "../services/recruiterJob.service";
import { JobResponse, PaginatedJobsResponse } from "../types/recruiter.types";
import { toast } from "sonner";


export const useJobs = (organizationId: number) => {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchJobs = useCallback(async (page = 0, size = 10) => {
    if (!organizationId) {
    console.error("Organization ID is missing!");
    return;
  }
    setLoading(true);
    try {
      const data: PaginatedJobsResponse = await recruiterJobService.getJobs(organizationId,page, size);
      setJobs(data.content);
      setPagination({
        page: data.number,
        size: data.size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  const handleJobAction = useCallback(
    async (
      id: number,
      action: "resume" | "pause" | "close",
      onSuccess?: () => void
    ) => {
      setActionLoading(id);
      try {
        const actionMap = {
          resume: recruiterJobService.resumeJob,
          pause: recruiterJobService.pauseJob,
          close: recruiterJobService.closeJob,
        };
        const updated = await actionMap[action](id);
        setJobs((prev) =>
          prev.map((job) => (job.id === id ? { ...job, status: updated.status } : job))
        );
        toast.success(`Job ${action}d successfully`);
        onSuccess?.();
      } catch {
        toast.error(`Failed to ${action} job`);
      } finally {
        setActionLoading(null);
      }
    },
    []
  );

  const goToPage = useCallback(
    (page: number) => fetchJobs(page, pagination.size),
    [fetchJobs, pagination.size]
  );

  return {
    jobs,
    pagination,
    loading,
    actionLoading,
    fetchJobs,
    handleJobAction,
    goToPage,
  };
};
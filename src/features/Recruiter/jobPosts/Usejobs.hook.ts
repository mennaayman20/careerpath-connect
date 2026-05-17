import { useState, useEffect, useCallback } from "react";
import { jobsService } from "./Jobs.service";


import { Job, JobRequest, JobResponse, PaginatedJobs, UseJobsReturn } from "@/types/jobs";

export function useJobs(orgId: number): UseJobsReturn {
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
 const [editingJob, setEditingJob] = useState<Job | null>(null);

  const fetchJobs = useCallback(async (pageNum = 0) => {
    if (!orgId) return;
    setLoading(true);
    setError(null);
    const res = await jobsService.getOrganizationJobs(orgId, pageNum);
    if (res.success && res.data) {
      // السطر 21
const pageData = res.data as PaginatedJobs;
      setJobs(pageData.content);
      setTotalPages(pageData.totalPages);
      setPage(pageNum);
    } else {
      setError(res.error || "Failed to load jobs");
    }
    setLoading(false);
  }, [orgId]);

  useEffect(() => {
    fetchJobs(0);
  }, [fetchJobs]);

  const createJob = async (payload: JobRequest): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    const res = await jobsService.createJob(payload);
    setSubmitting(false);
    if (res.success) {
      await fetchJobs(0);
      return true;
    }
    setError(res.error || "Failed to create job");
    return false;
  };

const updateJob = async (id: number, payload: JobRequest): Promise<boolean> => {
  setSubmitting(true);
  try {
    const res = await jobsService.updateJob(id, payload);
    if (res.success) {
      setEditingJob(null); // مسح البيانات القديمة فوراً
      await fetchJobs(page); // جلب البيانات الجديدة من السيرفر
      return true;
    }
    setError(res.error || "Failed to update job");
    return false;
  } finally {
    setSubmitting(false);
  }
};
  const pauseJob = async (id: number): Promise<boolean> => {
    const res = await jobsService.pauseJob(id);
    if (res.success) {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: "PAUSED" } : j));
      return true;
    }
    setError(res.error || "Failed to pause job");
    return false;
  };

  const resumeJob = async (id: number): Promise<boolean> => {
    const res = await jobsService.resumeJob(id);
    if (res.success) {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: "OPEN" } : j));
      return true;
    }
    setError(res.error || "Failed to resume job");
    return false;
  };

  const closeJob = async (id: number): Promise<boolean> => {
    const res = await jobsService.closeJob(id);
    if (res.success) {
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: "CLOSED" } : j));
      return true;
    }
    setError(res.error || "Failed to close job");
    return false;
  };

  return {
    jobs,
    loading,
    submitting,
    error,
    page,
    totalPages,
    editingJob,
    setEditingJob,
    fetchJobs,
    createJob,
    updateJob,
    pauseJob,
    resumeJob,
    closeJob,
  };
}
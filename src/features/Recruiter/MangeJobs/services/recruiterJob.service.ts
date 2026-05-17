import { api } from "@/lib/api";
import {
  JobRequest,
  JobResponse,
  PaginatedJobsResponse,
  ExportTaskResponse,
} from "../types/recruiter.types";


export const recruiterJobService = {
  // ── List open jobs (paginated) ────────────────────────────────────────────
  getJobs: async ( id : number , page = 0, size = 10): Promise<PaginatedJobsResponse> => {
    const response = await api.get<PaginatedJobsResponse>(`/organizations/${id}/jobs`, {
      params: { page, size },
    });
    return response.data;
  },

  // ── Get job by ID ─────────────────────────────────────────────────────────
  getJobById: async (id: number): Promise<JobResponse> => {
    const response = await api.get<JobResponse>(`/jobs/${id}`);
    return response.data;
  },

  // ── Update job ────────────────────────────────────────────────────────────
  updateJob: async (id: number, data: Partial<JobRequest>): Promise<JobResponse> => {
    const response = await api.patch<JobResponse>(`/jobs/${id}`, data);
    return response.data;
  },

  // ── Resume job ────────────────────────────────────────────────────────────
  resumeJob: async (id: number): Promise<JobResponse> => {
    const response = await api.patch<JobResponse>(`/jobs/${id}/resume`);
    return response.data;
  },

  // ── Pause job ─────────────────────────────────────────────────────────────
  pauseJob: async (id: number): Promise<JobResponse> => {
    const response = await api.patch<JobResponse>(`/jobs/${id}/pause`);
    return response.data;
  },

  // ── Close job ─────────────────────────────────────────────────────────────
  closeJob: async (id: number): Promise<JobResponse> => {
    const response = await api.patch<JobResponse>(`/jobs/${id}/close`);
    return response.data;
  },

  // ── Start export applications to Excel ───────────────────────────────────
  startExportApplications: async (id: number): Promise<ExportTaskResponse> => {
    const response = await api.post<ExportTaskResponse>(
      `/jobs/${id}/applications/export`
    );
    return response.data;
  },

  // ── Poll export task status ───────────────────────────────────────────────
  getExportStatus: async (
    jobId: number,
    taskId: string
  ): Promise<ExportTaskResponse> => {
    const response = await api.get<ExportTaskResponse>(
      `/jobs/${jobId}/applications/export/${taskId}/status`
    );
    return response.data;
  },

  // ── Download exported Excel file ──────────────────────────────────────────
  getExportDownloadUrl: async (
    jobId: number,
    taskId: string
  ): Promise<ExportTaskResponse> => {
    const response = await api.get<ExportTaskResponse>(
      `/jobs/${jobId}/applications/export/${taskId}/download`
    );
    return response.data;
  },
};
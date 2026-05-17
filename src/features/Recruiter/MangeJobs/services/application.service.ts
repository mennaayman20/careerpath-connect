import { api } from "@/lib/api";
import {
  ApplicationResponse,
  ApplicationStatus,
  PaginatedApplicationsResponse,
} from "../types/recruiter.types";

export const applicationService = {
  // ── List job applications (paginated) ─────────────────────────────────────
  getApplicationsByJob: async (
    jobId: number,
    page = 0,
    size = 10
  ): Promise<PaginatedApplicationsResponse> => {
    const response = await api.get<PaginatedApplicationsResponse>(
      `/jobs/${jobId}/applications`,
      { params: { page, size } }
    );
    return response.data;
  },

  // ── List applications by status (paginated) ───────────────────────────────
getApplicationsByStatus: async (
  jobId: number,
  status: ApplicationStatus,
  page = 0,
  size = 10
): Promise<PaginatedApplicationsResponse> => {
  const response = await api.get<PaginatedApplicationsResponse>(
    `/jobs/${jobId}/applications`,  // ✅
    { params: { page, size, status } }
  );
  return response.data;
},

  // ── Get application by ID ─────────────────────────────────────────────────
  getApplicationById: async (
    applicationId: number
  ): Promise<ApplicationResponse> => {
    const response = await api.get<ApplicationResponse>(
      `/applications/${applicationId}`
    );
    return response.data;
  },

  // ── Update application status ─────────────────────────────────────────────
updateApplicationStatus: async (
  applicationId: number,
  status: ApplicationStatus
): Promise<ApplicationResponse> => {
  const response = await api.patch<ApplicationResponse>(
    `/applications/${applicationId}/status`,
    null,
    { params: { status } }  // ✅ بيبعته كـ query param
  );
  return response.data;
},

  // ── View resume (returns URL/blob) ────────────────────────────────────────
  viewResume: async (applicationId: number): Promise<string> => {
    const response = await api.get<Blob>(
      `/applications/${applicationId}/resume/view`,
      { responseType: "blob" }
    );
    return URL.createObjectURL(response.data);
  },

  // ── Download resume ───────────────────────────────────────────────────────
  downloadResume: async (
    applicationId: number,
    applicantName: string
  ): Promise<void> => {
    const response = await api.get<Blob>(
      `/applications/${applicationId}/resume/download`,
      { responseType: "blob" }
    );
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${applicantName}-resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
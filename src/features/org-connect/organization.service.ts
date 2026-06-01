import { api } from "@/lib/api";
import type {
  ConnectToOrganizationRequest,
  ConnectToOrganizationResponse,
  OrganizationResponse,
} from "./organization.interfaces";
import { JobResponse } from "../Recruiter/MangeJobs/types/recruiter.types"; // ← اضبط الـ path


// ─── Types ────────────────────────────────────────────────────────────────────

interface PaginatedJobsResponse {
  content: JobResponse[];   // ← بدل Job[]
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
interface Job {
  id: number;
  title: string;
  // extend as needed per your Job schema
  [key: string]: unknown;
}

interface UpdateOrganizationPayload {
  name?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  location?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────







const organizationService = {
  /**
   * POST /organizations/connect
   * Initiates the connection flow — sends a verification email.
   * Pass `organization` only when the org doesn't exist yet.
   */



  // أضف الدالة دي في organizationService







  connectToOrganization: async (
    payload: ConnectToOrganizationRequest
  ): Promise<ConnectToOrganizationResponse> => {
    const { data } = await api.post<ConnectToOrganizationResponse>(
      "/organizations/connect",
      payload
    );
    return data;
  },

  /**
   * GET /organizations/connect/verify
   * Called after the user clicks the verification link in their email.
   * The backend resolves the token (usually passed as a query param).
   */
  verifyConnection: async (token: string): Promise<ConnectToOrganizationResponse> => {
    const { data } = await api.get<ConnectToOrganizationResponse>(
      "/organizations/connect/verify",
      { params: { token } }
    );
    return data;
  },

  /**
   * GET /organizations/{id}
   * Fetch a single organization by its ID.
   */
  getOrganizationById: async (id: number): Promise<OrganizationResponse> => {
    const { data } = await api.get<OrganizationResponse>(`/organizations/${id}`);
    return data;
  },


getMyOrganization: async (): Promise<OrganizationResponse | null> => {
  try {
    const { data } = await api.get<OrganizationResponse>("/user/me/organization");
    return data;
  } catch {
    return null; // 404 = مش متكونكتد
  }
},

  /**
   * PATCH /organizations/{id}
   * Partially update an organization.
   */
  updateOrganization: async (
    id: number,
    payload: UpdateOrganizationPayload
  ): Promise<OrganizationResponse> => {
    const { data } = await api.patch<OrganizationResponse>(
      `/organizations/${id}`,
      payload
    );
    return data;
  },

  /**
   * GET /organizations/{id}/jobs
   * List open jobs for an organization (paginated).
   */
  getOrganizationJobs: async (
    id: number,
    page = 0,
    size = 10
  ): Promise<PaginatedJobsResponse> => {
    const { data } = await api.get<PaginatedJobsResponse>(
      `/organizations/${id}/jobs`,
      { params: { page, size } }
    );
    return data;
  },



// أضف دي جنب getOrganizationJobs
getOrganizationJobsByStatus: async (
  id: number,
  status: "OPEN" | "PAUSED" | "CLOSED",  // ← uppercase
  page = 0,
  size = 10
): Promise<PaginatedJobsResponse> => {
  const { data } = await api.get<PaginatedJobsResponse>(
    `/organizations/${id}/jobs/${status}`,
    { params: { page, size } }
  );
  return data;
},


  



};

export default organizationService;
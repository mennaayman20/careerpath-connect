import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { Job, JobRequest, JobResponse, PaginatedJobs } from "@/types/jobs";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

type BackendError = { message: string };

// ─── Skills types ─────────────────────────────────────────────────────────────
export interface SkillRequest {
  skillName: string;
}

export interface SkillResponse {
  skillId: number;
  skillName: string;
}

export const jobsService = {
  // ── Jobs ──────────────────────────────────────────────────────────────────

  async getJobById(id: number): Promise<ApiResponse<JobResponse>> {
    try {
      // نستخدم الـ generic type <JobResponse> لضمان الحصول على كافة الحقول (Description, Skills, etc.)
      const { data } = await api.get<JobResponse>(`/jobs/${id}`);
      return { success: true, data };
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      return { 
        success: false, 
        error: err.response?.data?.message || "Failed to fetch job details" 
      };
    }
  },


  async createJob(payload: JobRequest): Promise<ApiResponse<Job>> {
    try {
      const { data } = await api.post<Job>("/jobs", payload);
      return { success: true, data };
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      return { success: false, error: err.response?.data?.message || "Failed to create job" };
    }
  },



  async updateJob(id: number, payload: JobRequest): Promise<ApiResponse<Job>> {
    try {
      const { data } = await api.patch<Job>(`/jobs/${id}`, payload);
      return { success: true, data };
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      return { success: false, error: err.response?.data?.message || "Failed to update job" };
    }
  },

  async pauseJob(id: number): Promise<ApiResponse<Job>> {
    try {
      const { data } = await api.patch<Job>(`/jobs/${id}/pause`);
      return { success: true, data };
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      return { success: false, error: err.response?.data?.message || "Failed to pause job" };
    }
  },

  async resumeJob(id: number): Promise<ApiResponse<Job>> {
    try {
      const { data } = await api.patch<Job>(`/jobs/${id}/resume`);
      return { success: true, data };
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      return { success: false, error: err.response?.data?.message || "Failed to resume job" };
    }
  },

  async closeJob(id: number): Promise<ApiResponse<Job>> {
    try {
      const { data } = await api.patch<Job>(`/jobs/${id}/close`);
      return { success: true, data };
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      return { success: false, error: err.response?.data?.message || "Failed to close job" };
    }
  },

  async getOrganizationJobs(orgId: number, page = 0, size = 10): Promise<ApiResponse<PaginatedJobs>> {
    try {
      const { data } = await api.get<PaginatedJobs>(`/organizations/${orgId}/jobs`, {
        params: { page, size },
      });
      return { success: true, data };
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      return { success: false, error: err.response?.data?.message || "Failed to fetch jobs" };
    }
  },

  // ── Skills ────────────────────────────────────────────────────────────────

  /** GET /skills/name?name=... — ابحث عن skill بالاسم */
  async getSkillByName(name: string): Promise<ApiResponse<SkillResponse>> {
    try {
      const { data } = await api.get<SkillResponse>("/skills/name", {
        params: { name },
      });
      return { success: true, data };
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      // 404 = مش موجودة — مش error حقيقي، بس نرجع success: false
      if (err.response?.status === 404) return { success: false };
      return { success: false, error: err.response?.data?.message || "Failed to search skill" };
    }
  },

  /** POST /skills — أنشئ skill جديدة */
  async createSkill(payload: SkillRequest): Promise<ApiResponse<SkillResponse>> {
    try {
      const { data } = await api.post<SkillResponse>("/skills", payload);
      return { success: true, data };
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      return { success: false, error: err.response?.data?.message || "Failed to create skill" };
    }
  },

  /** GET /skills — جلب كل الـ skills */
  async getAllSkills(): Promise<ApiResponse<SkillResponse[]>> {
    try {
      const { data } = await api.get<SkillResponse[]>("/skills");
      return { success: true, data };
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      return { success: false, error: err.response?.data?.message || "Failed to fetch skills" };
    }
  },

  /**
   * الدالة الأساسية:
   * بتاخد array من skillNames، بتدور على كل واحدة بالاسم،
   * لو مش موجودة بتعملها، وترجع array من skillIds صح.
   */
  async resolveSkillIds(skillNames: string[]): Promise<{ ids: number[]; error?: string }> {
    const ids: number[] = [];

    for (const name of skillNames) {
      // 1. دور عليها الأول
      const searchRes = await jobsService.getSkillByName(name);

      if (searchRes.success && searchRes.data) {
        ids.push(searchRes.data.skillId);
        continue;
      }

      // 2. لو مش موجودة، أنشئها
      const createRes = await jobsService.createSkill({ skillName: name });

      if (createRes.success && createRes.data) {
        ids.push(createRes.data.skillId);
      } else {
        return { ids: [], error: `Failed to resolve skill: "${name}"` };
      }
    }

    return { ids };
  },
};
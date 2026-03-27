import axios, { AxiosInstance } from "axios";
import { ResumeFeedbackResponse, ResumeResponse, ResumeUploadResponse } from "../types/resume.types";
import { ApplicationRequest, ApplicationResponse } from "@/features/application/types/application.types";
import { api } from "@/lib/api"; 
class ResumeService {
  getMyApplications() {
      throw new Error("Method not implemented.");
  }
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api",
      // withCredentials: true,
    });

    // Add request interceptor to include Authorization header
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Upload a PDF resume file
   * POST /user/me/resume
   */
  async uploadResume(file: File): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<ResumeUploadResponse>(
    "/user/me/resume", 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data', 
      }
    }
  );

    return response.data;
  }

  /**
   * Fetch all resumes for the current user
   * GET /user/me/resume
   */
  async getAllResumes(): Promise<ResumeResponse[]> {
    const response = await this.api.get<ResumeResponse[]>("/user/me/resume");
    return response.data;
  }

  /**
   * Fetch the latest resume
   * GET /user/me/resume/last
   */
  async getLatestResume(): Promise<ResumeResponse> {
    const response = await this.api.get<ResumeResponse>("/user/me/resume/last");
    return response.data;
  }

  /**
   * View resume as Blob URL (for in-app viewer)
   * GET /user/me/resume/view/{resumeId}
   */
  async viewResumeAsBlob(resumeId: number): Promise<string> {
    try {
      const response = await this.api.get(`/user/me/resume/view/${resumeId}`, {
        responseType: 'blob',
        headers: {
          'X-Requested-With': 'XMLHttpRequest', // Prevent IDM interception
        },
      });

      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      return fileURL;
    } catch (error) {
      console.error("View Resume Error:", error);
      throw new Error("Could not load PDF. Make sure you are authorized.");
    }
  }

  /**
   * Download resume file
   * GET /user/me/resume/download/{resumeId}
   */
  async downloadResume(resumeId: number): Promise<void> {
    try {
      const response = await this.api.get(
        `/user/me/resume/download/${resumeId}`,
        {
          responseType: "blob",
          headers: {
            'X-Requested-With': 'XMLHttpRequest', // Prevent IDM interception
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume-${resumeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error("Failed to download resume");
    }
  }

  /**
   * Delete a resume
   * DELETE /user/me/resume/{resumeId}
   */
  async deleteResume(resumeId: number): Promise<void> {
    await this.api.delete(`/user/me/resume/${resumeId}`);
  }







  async applyToJob(data: ApplicationRequest): Promise<ApplicationResponse> {
  const response = await this.api.post<ApplicationResponse>("/applications", data);
  return response.data;
}




// services/resume.service.ts
async getResumeAnalysis(resumeId: number, jobId?: string): Promise<ResumeFeedbackResponse> {
  // لو فيه jobId نستخدم الـ endpoint المخصص للوظيفة، لو مفيش نستخدم العام
  const url = jobId 
    ? `/user/me/resume/feedback/${resumeId}/job/${jobId}`
    : `/user/me/resume/feedback/${resumeId}`;
    
  const response = await this.api.get<ResumeFeedbackResponse>(url);
  return response.data;
}







}

export const resumeService = new ResumeService();
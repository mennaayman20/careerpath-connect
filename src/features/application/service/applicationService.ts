// import { api } from "@/lib/api";
// import { ApplicationRequest, ApplicationResponse, Resume } from "../types/application.types";


// export const applicationService = {
//   // جلب آخر ملف تم رفعه
//   getLastResume: () => api.get<Resume>('/user/me/resume/last'),
  
//   // جلب كل الملفات المرفوعة
//   getAllResumes: () => api.get<Resume[]>('/user/me/resume'),
  
//   // إرسال طلب التقديم
//   submitApplication: (data: ApplicationRequest) => api.post<ApplicationResponse>('/applications', data)
// };


// services/applicationService.ts

import { api } from "@/lib/api";
import type {
  ApplicationRequest,
  ApplicationResponse,
  Resume,
} from "../types/application.types";

export const applicationService = {
  /**
   * Get all resumes for the dropdown
   */
  getAllResumes: async () => {
    return api.get<Resume[]>("/user/me/resume");
  },

  /**
   * Get the last (default) resume
   */
  getLastResume: async () => {
    return api.get<Resume>("/user/me/resume/last");
  },

  /**
   * Submit application and get matchingRatio
   */
  applyToJob: async (payload: ApplicationRequest) => {
    return api.post<ApplicationResponse>("/applications", payload);
  },


  submitedApplications: async () => {
    return api.get<ApplicationResponse[]>("/applications/my");
  }








};
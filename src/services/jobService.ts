import { api } from "@/lib/api";
import { JobDetails } from "@/types/jobdetails";
import { PaginatedJobs } from "@/types/jobs";
import { Job } from "@/types/jobs";

export const jobService = {
  // نداء جلب كل الوظائف
  getAllJobs: async (page = 0, size = 10) => {
    const response = await api.get<PaginatedJobs>("/jobs", {
      params: { page, size},
      
    });
    return response.data;
  },

  // نداء جلب وظيفة واحدة بالتفاصيل
  getJobById: async (id: string | number): Promise<JobDetails> => {
  const response = await api.get<JobDetails>(`/jobs/${id}`);
  return response.data;
},

// داخل jobService.ts
getMatchedJobs: async () => {
  const response = await api.get<Job[]>('/jobs/matched');
  // ملاحظة: لو الباك-أند بيبعت الـ Matching Score (نسبة التوافق) تأكدي إنها موجودة في الـ Type
  return response.data; 
},


searchJobs: async (keyword: string, page = 0, size = 10) => {
  const response = await api.get<PaginatedJobs>("/jobs/search", {
    params: { 
      pageNumber: page, 
      size,
      keyword,
    },
  });
  

  
  return response.data;
},



 


};
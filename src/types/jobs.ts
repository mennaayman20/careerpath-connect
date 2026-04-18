export interface Skill {
  skillId: number;
  skillName: string;
}

export interface Job {
  id: number;
  title: string;
  organizationName?: string;
  type: string;
  seniority: string;
  model: string;
  status: string;
  jobSource:string;
  applicationLink:string;
  location: string;
  description: string;
  createdDate: string;
  matchPercentage?: number; // نسبة التوافق مع الملف الشخصي (اختياري، لو الباك-أند بيبعتها)
  
  skills: Skill[];
}

// Matches backend Swagger response
export interface PaginatedJobs {
  content: Job[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
  
export interface MatchedJob extends Job {
  matchScore: number; // نسبة التوافق مع الملف الشخصي
  matchPercentage: number; // نسبة التوافق مع الملف الشخصي
}

export type JobResponse = Job;

// في jobs.ts — أضيفي في الآخر

export interface JobRequest {
  title: string;
  type: string;
  seniority: string;
  model: string;
  location: string;
  description: string;
  skillIds: number[];
}

export interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  editingJob: Job | null;
  setEditingJob: (job: Job | null) => void;
  fetchJobs: (page?: number) => Promise<void>;
  createJob: (payload: JobRequest) => Promise<boolean>;
  updateJob: (id: number, payload: JobRequest) => Promise<boolean>;
  pauseJob: (id: number) => Promise<boolean>;
  resumeJob: (id: number) => Promise<boolean>;
  closeJob: (id: number) => Promise<boolean>;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
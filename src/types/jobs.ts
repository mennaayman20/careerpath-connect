export interface Skill {
  skillId: number;
  skillName: string;
}

export interface Job {
  id: number;
  title: string;
  organizationName: string;
  type: string;
  seniority: string;
  model: string;
  status: string;
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
// ─── Job Types ───────────────────────────────────────────────────────────────

export interface JobRequest {

  title: string; // [3, 100]
  type: string;
  seniority: string;
  model: string;
  location: string; // [0, 150]
  description: string; // [20, 5000]
  skillIds: number[]; // >= 1 unique items
}

export interface Skill {
  id: number;
  name: string;
}

export interface JobResponse {
  id: number;
  title: string;
  organizationName: string;
  type: string;
  seniority: string;
  model: string;
  status: string;
  jobSource: string;
  location: string;
  description: string;
  createdDate: string;
  skills: Skill[];
  applicationLink: string;
}

export interface PaginatedJobsResponse {
  id:number;
  content: JobResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ─── Application Types ────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "OFFERED"
  | "HIRED"
  | "REJECTED"
  | "WITHDRAWN";
export interface ApplicationRequest {
  jobId: number;
  resumeId: number;
  coverLetter?: string; // [0, 5000]
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ApplicationResponse {
  id: number;
  applicantFullName: string;
  applicantEmail: string;
  university: string;
  applicantSocialLinks: SocialLink[];
  jobId: number;
  jobTitle: string;
  coverLetter: string;
  resumeId: number;
  status: ApplicationStatus;
  matchingRatio: number;
  summary: string;
}

export interface PaginatedApplicationsResponse {
  content: ApplicationResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ─── Export Types ─────────────────────────────────────────────────────────────

export interface ExportTaskResponse {
  taskId: string;
  status: string;
  downloadUrl: string;
}
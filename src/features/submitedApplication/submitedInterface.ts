export interface Application {
  id: number;
  jobTitle: string;
  applicantFullName: string;
  applicantEmail: string;
  university: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW" | "OFFERED" | "HIRED" | "REJECTED" | "WITHDRAWN";
  matchingRatio: number;
  jobId: number;
  resumeId: number;
  coverLetter: string;
  // أضيفي أي بيانات تانية ظاهرة في الـ Swagger
}

export interface PaginatedApplications {
  content: Application[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
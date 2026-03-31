// types/application.ts

export interface Resume {
  id: number;
  fileName: string;
  blobName: string;
  createdAt: string;
}

// export interface ApplicationRequest {
//   jobId: number;       // int64, >= 1
//   resumeId: number;    // int64, >= 1
//   coverLetter?: string; // string, [0, 5000] characters
// }

// export interface ApplicationResponse {
//   id: number;
//   applicantFullName: string;
//   applicantEmail: string;
//   university: string;
//   applicantSocialLinks: SocialLinkItem[];
//   jobId: number;
//   jobTitle: string;
//   coverLetter: string;
//   resumeId: number;
//   status: ApplicationStatus;
//   matchingRatio: number;
// }

// export interface SocialLinkItem {
//   id: number;
//   url: string;
//   socialType: string;
// }

// export type ApplicationStatus =
//   | "PENDING"
//   | "ACCEPTED"
//   | "REJECTED"
//   | "UNDER_REVIEW";



export interface ApplicationRequest {
  jobId: number;
  resumeId: number;
  coverLetter?: string;
}

export interface ApplicationResponse {
  id: number;
  status: "SUBMITTED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW" | "OFFERED" | "HIRED" | "REJECTED" | "WITHDRAWN";
  matchingRatio: number;
  // ... باقي البيانات اللي في الصورة
}





export interface ResumeResponse {
  id: number;
  fileName: string;
  createdAt: string;
  blobName: string;
}

export interface ResumeUploadResponse {
  id: number;
  fileName: string;
  createdAt: string;
  blobName: string;
}






// types/resume.types.ts (ضيفي ده هناك)
// export interface ResumeFeedbackResponse {
//   summary: string;
//   score: Record<string, number>;
//   feedback: Record<string, string>;
//   fixes: Record<string, string>;
//   topStrengths: string[];
//   quickWins: string[];
//   jobMatchScore: number;
//   matchedSkills: string[];
//   missingSkills: string[];
//   topTip: string;
//   jobSpecific: boolean;
// }

export interface ResumeFeedbackResponse {
  summary: string;
  // الـ Score مفاتيحه دايمًا UPPER_CASE حسب الـ JSON بتاعك
  score: {
    EXPERIENCE_LEVEL: number;
    IMPACT: number;
    RELEVANCE: number;
    CULTURE_FIT: number;
    SKILLS_ALIGNMENT: number;
  };
  // الـ Feedback والـ Fixes برضو بنفس النمط
  feedback: {
    CULTURE_FIT: string;
    EXPERIENCE_LEVEL: string;
    IMPACT: string;
    RELEVANCE: string;
    SKILLS_ALIGNMENT: string;
  };
  fixes: {
    CULTURE_FIT: string;
    EXPERIENCE_LEVEL: string;
    IMPACT: string;
    RELEVANCE: string;
    SKILLS_ALIGNMENT: string;
  };
  topStrengths: string[];
  quickWins: string[];
  jobMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  topTip: string;
  jobSpecific: boolean;
}


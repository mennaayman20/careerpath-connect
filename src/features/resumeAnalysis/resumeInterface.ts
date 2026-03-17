// export interface ResumeFeedbackResponse {
//   summary: string;
//   score: { [key: string]: number };
//   feedback: { [key: string]: string };
//   fixes: { [key: string]: string };
//   topStrengths: string[];
//   quickWins: string[];
//   jobMatchScore: number;
//   matchedSkills: string[];
//   missingSkills: string[];
//   topTip: string;
//   jobSpecific: boolean;
// }
// export interface UserResume {
//   id: number;
//   fileName: string;
//   url?: string;
// }




// export interface ResumeFeedbackResponse {
//   summary: string;
//   score: Record<string, number>; // عشان الـ additionalProps
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




// // التعريف الخاص بالريزمي اللي موجودة فعلاً
// export interface UserResume {
//   id: number;
//   fileName: string;
//   uploadDate: string; // ISO string
//   isAnalyzedBefore?: boolean; // لو حابب تحط علامة عليها
// }

// // التعريف الخاص بالـ State بتاع الـ Component
// interface ResumeSelectorState {
//   savedResumes: UserResume[];
//   selectedId: number | null;
//   loading: boolean;
//   isUploadingNew: boolean;
// }
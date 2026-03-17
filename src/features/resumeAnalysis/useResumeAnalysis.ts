// // import { useState, useEffect } from "react";
// // import { resumeService } from "./resumeService"; // تأكدي من المسار
// // import { UserResume } from "./resumeInterface";
// // import { api } from "@/lib/api";

// // export const useJobApplication = (jobId: number) => {
// //   const [resumes, setResumes] = useState<UserResume[]>([]);
// //   const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
// //   const [coverLetter, setCoverLetter] = useState("");
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [isUploading, setIsUploading] = useState(false); // تم إضافته لحل الخطأ
// //   const [isAnalysisOpen, setIsAnalysisOpen] = useState(false); // تم إضافته لحل الخطأ

// //   useEffect(() => {
// //     // كود جلب السير الذاتية من الباكيند
// //     const fetchResumes = async () => {
// //       try {
// //         const data = await api.get("/api/user/me/resumes");
// //         setResumes(data.data);
// //       } catch (err) { console.error(err); }
// //     };
// //     fetchResumes();
// //   }, []);

// //   const handleUpload = async (file: File) => {
// //     setIsUploading(true);
// //     try {
// //       const formData = new FormData();
// //       formData.append("file", file);
// //       const res = await api.post("/api/user/me/resume", formData);
// //       setResumes(prev => [...prev, res.data]);
// //       setSelectedResumeId(res.data.id);
// //     } finally { setIsUploading(false); }
// //   };

// //   const submitApplication = async () => {
// //     setIsSubmitting(true);
// //     // كود التقديم...
// //     setIsSubmitting(false);
// //   };

// //   return {
// //     resumes,
// //     selectedResumeId,
// //     setSelectedResumeId,
// //     coverLetter,
// //     setCoverLetter,
// //     submitApplication,
// //     isSubmitting,
// //     isUploading, // مرجع للـ Modal
// //     handleUpload, // مرجع للـ Modal
// //     isAnalysisOpen, // مرجع للـ Modal
// //     setIsAnalysisOpen // مرجع للـ Modal
// //   };
// // };




// // hooks/useResumeAnalysis.ts
// import { useState } from 'react';
// import { getResumeFeedback } from './resumeService';
// import { ResumeFeedbackResponse } from './resumeInterface';

// export const useResumeAnalysis = () => {
//   const [data, setData] = useState<ResumeFeedbackResponse | null>(null);
//   const [loading, setLoading] = useState(false);

//   const analyze = async (resumeId: number, jobId: number) => {
//     setLoading(true);
//     try {
//       const result = await getResumeFeedback(resumeId, jobId);
//       setData(result);
//     } catch (err) {
//       console.error("Analysis failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { analyze, data, loading };
// };
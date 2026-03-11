// // hooks/useApply.ts

// import { useState, useEffect, useCallback } from "react";
// import { applicationService } from "../service/applicationService";
// import { Resume, ApplicationRequest } from "../types/application.types";
// import { useToast } from "@/hooks/use-toast";

// interface UseApplyReturn {
//   // state
//   isOpen: boolean;
//   isFetchingResumes: boolean;
//   isSubmitting: boolean;
//   resumes: Resume[];
//   selectedResumeId: number | null;
//   lastResumeId: number | null;
//   coverLetter: string;
//   error: string | null;

//   // actions
//   openModal: (jobId: number) => void;
//   closeModal: () => void;
//   setSelectedResumeId: (id: number) => void;
//   setCoverLetter: (value: string) => void;
//   submitApplication: () => Promise<void>;
// }

// export const useApply = (): UseApplyReturn => {
//   const { toast } = useToast();

//   const [isOpen, setIsOpen] = useState(false);
//   const [isFetchingResumes, setIsFetchingResumes] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [resumes, setResumes] = useState<Resume[]>([]);
//   const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
//   const [lastResumeId, setLastResumeId] = useState<number | null>(null);
//   const [coverLetter, setCoverLetter] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [currentJobId, setCurrentJobId] = useState<number | null>(null);

//   // Fetch all resumes and set last as default
//   const fetchResumes = useCallback(async () => {
//     setIsFetchingResumes(true);
//     try {
//       const [allRes, lastRes] = await Promise.all([
//         applicationService.getAllResumes(),
//         applicationService.getLastResume(),
//       ]);

//       setResumes(allRes.data);
//       if (lastRes.data?.id) {
//         setLastResumeId(lastRes.data.id);
//         setSelectedResumeId(lastRes.data.id);
//       }
//     } catch (err) {
//       console.error("Failed to fetch resumes:", err);
//       setError("Could not load resumes");
//       toast({
//         variant: "destructive",
//         title: "Failed to load resumes",
//         description: "Please try again later",
//       });
//     } finally {
//       setIsFetchingResumes(false);
//     }
//   }, [toast]);

//   const openModal = useCallback(
//     async (jobId: number) => {
//       setCurrentJobId(jobId);
//       setCoverLetter("");
//       setError(null);
//       setIsOpen(true);
//       await fetchResumes();
//     },
//     [fetchResumes],
//   );

//   const closeModal = useCallback(() => {
//     setIsOpen(false);
//     setCurrentJobId(null);
//     setResumes([]);
//     setSelectedResumeId(null);
//     setCoverLetter("");
//     setError(null);
//   }, []);

//   const submitApplication = useCallback(async () => {
//     if (!currentJobId) {
//       setError("Job ID is missing");
//       return;
//     }
//     if (!selectedResumeId) {
//       setError("Please select a resume");
//       return;
//     }
//     if (coverLetter.length > 5000) {
//       setError("Cover letter must be 5000 characters or fewer");
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     const payload: ApplicationRequest = {
//       jobId: currentJobId,
//       resumeId: selectedResumeId,
//       coverLetter: coverLetter.trim() || undefined,
//     };

//     try {
//       const { data } = await applicationService.applyToJob(payload);
      
//       toast({
//         title: "Application Submitted! 🎉",
//         description: `Match: ${Math.round(data.matchingRatio * 100)}%`,
//       });
//       closeModal();
//     } catch (err: unknown) {
//       const message =
//         (err as { response?: { data?: { message?: string } } })?.response?.data
//           ?.message ?? "Something went wrong. Please try again.";
//       setError(message);
//       toast({
//         variant: "destructive",
//         title: "Submission Failed",
//         description: message,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [currentJobId, selectedResumeId, coverLetter, closeModal, toast]);

//   return {
//     isOpen,
//     isFetchingResumes,
//     isSubmitting,
//     resumes,
//     selectedResumeId,
//     lastResumeId,
//     coverLetter,
//     error,
//     openModal,
//     closeModal,
//     setSelectedResumeId,
//     setCoverLetter,
//     submitApplication,
//   };
// };





import { useState, useEffect } from "react";
import { resumeService } from "../../resume/services/resume.service";
import { ApplicationRequest} from "../types/application.types";
import { ResumeResponse } from "@/features/resume/types/resume.types";
import { useToast } from "@/hooks/use-toast";

export const useJobApplication = (jobId: number) => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. تحميل كل الريزمي والـ default واحد
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [allResumes, lastResume] = await Promise.all([
          resumeService.getAllResumes(),
          resumeService.getLatestResume()
        ]);
        setResumes(allResumes);
        if (lastResume) setSelectedResumeId(lastResume.id);
      } catch (err) {
        console.error("Failed to load application data", err);
      }
    };
    loadInitialData();
  }, []);

  // 2. فنكشن التقديم
  const submitApplication = async () => {
    if (!selectedResumeId) {
      toast({ variant: "destructive", title: "Missing Info", description: "Please select a resume" });
      return;
    }

    setIsSubmitting(true);
    try {
      await resumeService.applyToJob({
        jobId,
        resumeId: selectedResumeId,
        coverLetter
      });
      toast({ title: "Applied!", description: "Your application was sent successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "You have already applied for this job" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    coverLetter,
    setCoverLetter,
    submitApplication,
    isSubmitting
  };
};
// hooks/useAutoFill.ts
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userProfileService } from "@/services/userService";
import { resumeService } from "@/features/resume/services/resume.service";
import { useToast } from "@/hooks/use-toast";

export type AutoFillPreview = {
  firstName?: string;
  lastName?: string;
  university?: string;
  experiences?: {
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  projects?: {
    title: string;
    description: string;
    projectUrl: string;
    startDate: string;
    endDate: string;
    technologies: string;
  }[];
  skills?: string[];
  socialLinks?: { platform: string; url: string }[];
};

export type AutoFillOptions = {
 applyPersonal: false,
  applyExperiences: boolean;
  applyProjects: boolean;
  applySocialLinks: boolean;
  selectedSkills: string[];
};

type Step = "idle" | "uploading" | "parsing" | "preview" | "done";

export const useAutoFill = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("idle");
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [preview, setPreview] = useState<AutoFillPreview | null>(null);
  const [showModal, setShowModal] = useState(false);

  // الـ flow كله في دالة واحدة
  const handleFileUpload = async (file: File) => {
    try {
      // Step 1: Upload
      setStep("uploading");
      const uploaded = await resumeService.uploadResume(file);
      const id = uploaded.id;
      setResumeId(id);

      // Step 2: Parse/Preview
      setStep("parsing");
      const previewData = await userProfileService.previewResumeAutoFill(id);
      setPreview(previewData);

      // Step 3: فتح الـ Modal
      setStep("preview");
      setShowModal(true);
    } catch (err) {
      setStep("idle");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not process your CV. Please try again.",
      });
    }
  };

  // Confirm & Apply
  const confirmMutation = useMutation({
    mutationFn: (options: AutoFillOptions) =>
      userProfileService.confirmResumeAutoFill(resumeId!, options),
    onSuccess: () => {
      // كل الـ hooks الموجودة هترفرش أوتوماتيك
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Profile Updated!",
        description: "Your profile has been auto-filled successfully.",
      });
      setShowModal(false);
      setPreview(null);
      setResumeId(null);
      setStep("done");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not apply resume data.",
      });
    },
  });

  const reset = () => {
    setStep("idle");
    setPreview(null);
    setResumeId(null);
    setShowModal(false);
  };

  return {
    step,
    preview,
    showModal,
    resumeId,
    handleFileUpload,
    confirmAutoFill: confirmMutation.mutate,
    isConfirming: confirmMutation.isPending,
    reset,
    setShowModal,
  };
};
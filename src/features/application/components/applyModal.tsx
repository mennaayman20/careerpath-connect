



// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// interface ApplyModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: () => Promise<void>;
//   jobTitle: string;
//   companyName: string;
//   resumes: Array<{ id: number; fileName: string }>;
//   selectedResumeId: number | null;
//   onSelectResume: (id: number) => void;
//   coverLetter: string;
//   onCoverLetterChange: (value: string) => void;
//   isFetchingResumes: boolean;
//   isSubmitting: boolean;
//   error: string | null;
// }

// export function ApplyModal({
//   isOpen,
//   onClose,
//   onSubmit,
//   jobTitle,
//   companyName,
//   resumes,
//   selectedResumeId,
//   onSelectResume,
//   coverLetter,
//   onCoverLetterChange,
//   isFetchingResumes,
//   isSubmitting,
//   error,
// }: ApplyModalProps) {
//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>Apply for {jobTitle}</DialogTitle>
//           <p className="text-sm text-muted-foreground">{companyName}</p>
//         </DialogHeader>

//         <div className="space-y-4">
//           {/* Resume Selection */}
//           <div>
//             <label className="mb-2 block text-sm font-medium">Resume</label>
//             <Select
//               value={selectedResumeId?.toString() || ""}
//               onValueChange={(v) => onSelectResume(Number(v))}
//               disabled={isFetchingResumes || isSubmitting}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a resume" />
//               </SelectTrigger>
//               <SelectContent>
//                 {resumes.map((resume) => (
//                   <SelectItem key={resume.id} value={resume.id.toString()}>
//                     {resume.fileName}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {isFetchingResumes && (
//               <p className="mt-1 text-xs text-muted-foreground">Loading resumes…</p>
//             )}
//             {resumes.length === 0 && !isFetchingResumes && (
//               <p className="mt-1 text-xs text-destructive">
//                 No resumes found. Please upload one first.
//               </p>
//             )}
//           </div>

//           {/* Cover Letter */}
//           <div>
//             <label className="mb-2 block text-sm font-medium">
//               Cover Letter (optional)
//             </label>
//             <Textarea
//               value={coverLetter}
//               onChange={(e) => onCoverLetterChange(e.target.value)}
//               placeholder="Tell us why you're interested in this position…"
//               maxLength={5000}
//               disabled={isSubmitting}
//               rows={4}
//             />
//             <p className="mt-1 text-xs text-muted-foreground">
//               {coverLetter.length}/5000
//             </p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
//               {error}
//             </div>
//           )}
//         </div>

//         <DialogFooter>
//           <Button
//             variant="ghost"
//             onClick={onClose}
//             disabled={isSubmitting || isFetchingResumes}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={onSubmit}
//             disabled={
//               isSubmitting ||
//               isFetchingResumes ||
//               !selectedResumeId ||
//               resumes.length === 0
//             }
//           >
//             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             {isSubmitting ? "Submitting…" : "Confirm"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }





import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useJobApplication } from "../../application/hook/useApplication"; // المسار بتاعك
import { Loader2, FileText } from "lucide-react";

interface ApplyModalProps {
  jobId: number;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyModal = ({ jobId, jobTitle, isOpen, onClose }: ApplyModalProps) => {
  const {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    coverLetter,
    setCoverLetter,
    submitApplication,
    isSubmitting,
  } = useJobApplication(jobId);

  const handleApply = async () => {
    await submitApplication();
    onClose(); // نقفل المودال بعد النجاح
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Choose your resume and write a brief cover letter to stand out.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* اختيار الـ Resume */}
          <div className="grid gap-2">
            <Label htmlFor="resume">Select Resume</Label>
            <Select
              value={selectedResumeId?.toString()}
              onValueChange={(value) => setSelectedResumeId(Number(value))}
            >
              <SelectTrigger id="resume" className="w-full">
                <SelectValue placeholder="Select a resume" />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((resume) => (
                  <SelectItem key={resume.id} value={resume.id.toString()}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{resume.fileName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* خانة الـ Cover Letter */}
          <div className="grid gap-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell the recruiter why you're a great fit..."
              className="min-h-[150px] resize-none"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <p className="text-xs text-muted-foreground text-right">
              {coverLetter.length}/5000 characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={isSubmitting || !selectedResumeId}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
import { useState, useRef } from "react";
import { useResumes } from "../hooks/useResumes";
import { ResumeCard } from "./ResumeCard";
import { ResumePdfViewer } from "./ResumePdfViewer";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ResumeSection = () => {
  const { toast } = useToast();
  // const {
  //   resumes,
  //   isLoading,
  //   uploadResume,
  //   deleteResume,
  //   viewResume,
  //   downloadResume,
  //   viewerOpen,
  //   selectedResume,
  //   closeViewer,
  // } = useResumes();

  const {
  resumes,
  isLoading,
  uploadResume,
  isUploading, // دي بقت من الهوك مباشرة
  deleteResume,
  isDeleting,
  viewResume,
  downloadResume,
  deleteMutation,
  viewerOpen,
  selectedResume,
  closeViewer,
} = useResumes();

  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Only PDF files are allowed",
      });
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Maximum file size is 5 MB",
      });
      return false;
    }

    return true;
  };

 const handleUpload = async (file: File) => {
  if (!validateFile(file)) return;

  try {
    await uploadResume(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  } catch (error) {
    // يفضل تسيبي الـ catch عشان لو حصل خطأ الـ App ميفصلش
    console.error("Upload failed:", error);
  }
};

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleUploadButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <>
      <section className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Resume Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload, view, and manage your professional resumes
          </p>
        </div>

        {/* Upload Area */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`mb-6 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-primary/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              disabled={isUploading}
              className="hidden"
            />

            <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-3" />

            <p className="text-sm font-medium text-foreground mb-2">
              {isUploading ? "Uploading..." : "Drag and drop your PDF resume here"}
            </p>

            <p className="text-xs text-muted-foreground mb-4">
              or click the button below to select a file
            </p>

            <Button
              onClick={handleUploadButtonClick}
              disabled={isUploading}
              variant="outline"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </>
              ) : (
                "Select PDF File"
              )}
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              Maximum size: 5 MB • Format: PDF only
            </p>
          </div>
        </form>

        {/* Resume List */}
        {/* <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">Your Resumes</h3>

          {isLoading && !resumes.length ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-8 rounded-lg bg-muted/20 border border-border">
              <p className="text-sm text-muted-foreground">No resumes found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your first resume to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onView={viewResume}
                  onDownload={downloadResume}
                  onDelete={deleteResume}
                  isDeleting={false}
                />
              ))}
            </div>
          )}
        </div> */}

        {/* Resume List */}
<div>
  <h3 className="text-sm font-semibold text-foreground mb-4">Your Resumes</h3>

  {isLoading && !resumes.length ? (
    <div className="text-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">Loading resumes...</p>
    </div>
  ) : resumes.length === 0 ? (
    <div className="text-center py-8 rounded-lg bg-muted/20 border border-border">
      <p className="text-sm text-muted-foreground">No resumes found</p>
    </div>
  ) : (
    <div className="space-y-3">
      {/* 🎯 حطي الـ Component هنا جوه الـ map */}
      {resumes.map((resume) => (
        <ResumeCard
          key={resume.id}
          resume={resume}
          onView={viewResume}
          onDownload={downloadResume}
          onDelete={deleteResume}
          // الـ isDeleting هنا هيفضل true طول ما الـ Mutation شغالة
          isDeleting={isDeleting && deleteMutation.variables === resume.id} 
        />
      ))}
    </div>
  )}
</div>
      </section>

      {/* PDF Viewer Modal */}
      {selectedResume && (
        <ResumePdfViewer
          isOpen={viewerOpen}
          resumeId={selectedResume.id}
          fileName={selectedResume.fileName}
          pdfUrl={selectedResume.pdfUrl}
          onClose={closeViewer}
        />
      )}
    </>
  );
};
// components/AutoFillSection.tsx
import { useRef, useState } from "react";
import { Sparkles, Upload, Loader2, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoFill } from "@/hooks/useAutoFill";
import { AutoFillModal } from "./AutoFillModal";

export const AutoFillSection = () => {
  const {
    step,
    preview,
    showModal,
    handleFileUpload,
    confirmAutoFill,
    isConfirming,
    reset,
    setShowModal,
  } = useAutoFill();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") return;
    handleFileUpload(file);
  };

  const isProcessing = step === "uploading" || step === "parsing";

  const statusMessage = {
    idle: null,
    uploading: "Uploading your CV...",
    parsing: "AI is reading your CV...",
    preview: null,
    done: "Profile updated successfully!",
  }[step];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Auto-Fill <span className="text-[#1ca37b]">from CV</span>
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Upload your CV and we'll automatically fill your profile using AI.
          </p>
        </div>

        {/* Upload Card */}
        <div className="rounded-xl bg-card border border-border/50 p-8">
          {step === "done" ? (
            // Success State
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="rounded-full bg-[#1ca37b]/10 p-4">
                <CheckCircle2 className="h-10 w-10 text-[#1ca37b]" />
              </div>
              <div className="text-center">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Profile Updated!
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your profile has been filled from your CV.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={reset}
                className="border-border text-foreground hover:bg-secondary"
              >
                Upload Another CV
              </Button>
            </div>
          ) : isProcessing ? (
            // Loading State
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <div className="rounded-full bg-[#1ca37b]/10 p-4">
                  <Loader2 className="h-10 w-10 text-[#1ca37b] animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">{statusMessage}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {step === "parsing"
                    ? "This may take a few seconds..."
                    : "Please wait..."}
                </p>
              </div>
            </div>
          ) : (
            // Upload State
            <div
              onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors
                ${isDragging
                  ? "border-[#1ca37b] bg-[#1ca37b]/5"
                  : "border-border hover:border-[#1ca37b]/50 hover:bg-secondary/30"
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />

              {/* Icon */}
              <div className="mx-auto mb-4 w-fit rounded-2xl bg-[#1ca37b]/10 p-4">
                <Sparkles className="h-10 w-10 text-[#1ca37b]" />
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Drop your CV here
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Upload your PDF resume and let AI fill your profile automatically
              </p>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#1ca37b] hover:bg-[#1ca37b]/90 text-white border-0 gap-2"
              >
                <Upload className="h-4 w-4" />
                Select PDF File
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                PDF only · Max 10MB
              </p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        {step === "idle" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: FileText, title: "Upload CV", desc: "Upload your PDF resume" },
              { icon: Sparkles, title: "AI Parsing", desc: "We extract your info automatically" },
              { icon: CheckCircle2, title: "Review & Apply", desc: "Choose what to add to your profile" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl bg-card border border-border/50 p-4 text-center">
                <div className="mx-auto mb-3 w-fit rounded-lg bg-[#1ca37b]/10 p-2.5">
                  <Icon className="h-5 w-5 text-[#1ca37b]" />
                </div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && preview && (
        <AutoFillModal
          preview={preview}
          isConfirming={isConfirming}
          onConfirm={confirmAutoFill}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
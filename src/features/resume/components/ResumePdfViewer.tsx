import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumePdfViewerProps {
  isOpen: boolean;
  resumeId: number;
  fileName: string;
  pdfUrl: string;
  onClose: () => void;
}

export const ResumePdfViewer = ({
  isOpen,
  resumeId,
  fileName,
  pdfUrl,
  onClose,
}: ResumePdfViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex h-full w-full max-h-screen max-w-5xl flex-col rounded-lg bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{fileName}</h2>
            <p className="text-xs text-muted-foreground">Resume ID: {resumeId}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden bg-muted/20">
          {error ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-destructive">{error}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Please try again or download the file
                </p>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <iframe
                src={pdfUrl}
                className="h-full w-full border-0"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setError("Failed to load PDF. Please try downloading instead.");
                }}
                title={fileName}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3">
          <p className="text-xs text-muted-foreground">
            If the PDF doesn't display, try downloading it instead
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
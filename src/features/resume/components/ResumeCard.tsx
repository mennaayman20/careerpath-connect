import { ResumeResponse } from "../types/resume.types";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2 , Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ResumeCardProps {
  resume: ResumeResponse;
  onView: (id: number) => void;
  onDownload: (id: number) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export const ResumeCard = ({
  resume,
  onView,
  onDownload,
  onDelete,
  isDeleting = false,
}: ResumeCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h3 className="font-semibold text-foreground truncate">{resume.fileName}</h3>
        <p className="text-xs text-muted-foreground">
          Uploaded {formatDistanceToNow(new Date(resume.createdAt), { addSuffix: true })}
        </p>
      </div>

      <div className="flex gap-2 ml-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onView(resume.id)}
          title="View Resume"
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onDownload(resume.id)}
          title="Download Resume"
        >
          <Download className="h-4 w-4" />
        </Button>

        {/* <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.preventDefault(); // Prevent any default form submission
            onDelete(resume.id);
          }}
          disabled={isDeleting}
          title="Delete Resume"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button> */}
        <Button
  variant="outline"
  size="icon"
  onClick={(e) => {
    e.preventDefault();
    onDelete(resume.id);
  }}
  disabled={isDeleting} // الـ Prop ده جاي من الـ map اللي فيه الـ id check
  title="Delete Resume"
>
  {isDeleting ? (
    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
  ) : (
    <Trash2 className="h-4 w-4 text-destructive" />
  )}
</Button>
      </div>
    </div>
  );
};
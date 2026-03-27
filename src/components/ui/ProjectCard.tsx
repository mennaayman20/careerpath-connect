import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userProfileService } from "@/services/userService";
import { Project } from "@/types/profile";
import { useToast } from "@/hooks/use-toast"; // تأكد من المسار الصح عندك
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FolderGit2, Trash2, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 1. حالة محلية عشان التغييرات اللي بتكتبها تكون سريعة (Performance)
  const [localData, setLocalData] = useState<Project>(project);

  // 2. Mutation الحفظ لهذا الكارد فقط
  const saveMutation = useMutation({
    mutationFn: () => userProfileService.updateUserProject(project.id, localData),
    onSuccess: () => {
      // بنعمل invalidate عشان نضمن إن الداتا اللي في الكاش هي اللي في السيرفر
      queryClient.invalidateQueries({ queryKey: ["profile", "projects"] });
      toast({ title: "Saved!", description: "Project updated successfully." });
    },
    onError: () => toast({ variant: "destructive", title: "Save Failed" }),
  });

  // 3. Mutation الحذف لهذا الكارد فقط
  const deleteMutation = useMutation({
    mutationFn: () => userProfileService.deleteUserProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "projects"] });
      toast({ title: "Deleted", description: "Project removed." });
    },
    onError: () => toast({ variant: "destructive", title: "Delete Failed" }),
  });

  const handleChange = (field: keyof Project, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="group rounded-xl bg-card shadow-card border border-border/50 overflow-hidden hover:shadow-elevated transition-shadow">
      {/* Project Header */}
      <div className="aspect-video bg-gradient-to-br from-secondary to-secondary/50 relative flex items-center justify-center">
        <FolderGit2 className="h-12 w-12 text-muted-foreground" />
        
        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 rounded-full bg-accent p-2 text-accent-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        {/* زرار الحذف - هيعمل Loading في الكارد ده بس */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="absolute top-4 right-4 h-8 w-8 p-0 bg-background/80 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {deleteMutation.isPending ? "..." : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project Title</Label>
            <Input
              value={localData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="My Awesome Project"
              className="mt-1 bg-input border-0 p-0 text-foreground font-display font-semibold text-lg"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project URL</Label>
              <Input
                value={localData.projectUrl || ""}
                onChange={(e) => handleChange("projectUrl", e.target.value)}
                placeholder="https://..."
                className="mt-1 bg-input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Technologies</Label>
              <Input
                value={localData.technologies || ""}
                onChange={(e) => handleChange("technologies", e.target.value)}
                placeholder="React, Node.js..."
                className="mt-1 bg-input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Start Date</Label>
              <Input
                type="date"
                value={localData.startDate || ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="mt-1 bg-input"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">End Date</Label>
              <Input
                type="date"
                value={localData.endDate || ""}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="mt-1 bg-input"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</Label>
            <Textarea
              value={localData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description..."
              className="mt-1 bg-input min-h-[80px] resize-none"
            />
          </div>

          {/* زرار الحفظ - هيعمل Loading في الكارد ده بس */}
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !localData.title?.trim() || !localData.description?.trim()}
            className="w-full bg-[#4b4f52] border-0 text-accent-foreground"
          >
            {saveMutation.isPending ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </div>
    </div>
  );
};
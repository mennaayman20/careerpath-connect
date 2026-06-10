import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userProfileService } from "@/services/userService";
import { Project } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FolderGit2, Trash2, ExternalLink, Loader2 } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [localData, setLocalData] = useState<Project>(project);

  useEffect(() => {
    setLocalData(project);
  }, [project]);

  // 1. Mutation الحفظ
  const saveMutation = useMutation({
    mutationFn: () => userProfileService.updateUserProject(project.id, localData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "projects"] });
      toast({ title: "Saved!", description: "Project updated successfully." });
    },
    onError: () => toast({ variant: "destructive", title: "Save Failed", description: "Please complete all fields to proceed" }),
  });

  // 2. Mutation الحذف
  const deleteMutation = useMutation({
    mutationFn: () => userProfileService.deleteUserProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "projects"] });
      toast({ title: "Deleted", description: "Project removed successfully." });
    },
    onError: () => toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete project." }),
  });

  const handleChange = (field: keyof Project, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const isPending = saveMutation.isPending || deleteMutation.isPending;
  const isSaveDisabled = isPending || !localData.title?.trim() || !localData.description?.trim();

  return (
    <div className="group rounded-xl bg-card shadow-sm border border-border/60 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all duration-300">
      
      {/* Project Compact Header Strip */}
      <div className="h-14 bg-gradient-to-r from-secondary/70 to-secondary/30 px-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-background/80 border border-border/40 shadow-sm text-muted-foreground/80 group-hover:text-primary transition-colors duration-300">
            <FolderGit2 className="h-4 w-4" />
          </div>
          
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-background/50 px-2.5 py-1 rounded-md border border-border/40 shadow-2xs transition-all duration-300 ease-out
              group-hover:text-primary-foreground group-hover:bg-primary group-hover:border-primary group-hover:scale-105 group-hover:shadow-[0_0_14px_rgba(var(--primary),0.35)]"
            >
              {/* السهم بيتحرك بالتوازي والتزامن التام مع تكبير الكبسولة (الديف) */}
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 ease-out transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span className="max-w-[120px] truncate text-[10px] font-bold tracking-wide uppercase">View Project</span>
            </a>
          )}
        </div>

        {/* زرار الحذف */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteMutation.mutate()}
          disabled={isPending}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          title="Delete Project"
        >
          {deleteMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Project Content Form */}
      <div className="p-5">
        <div className="space-y-4">
          
          {/* Title */}
          <div className="space-y-1">
            <Label className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wide flex items-center gap-1">
              Project Title
              {!localData.title?.trim() && <span className="text-destructive font-bold">*</span>}
            </Label>
            <Input
              value={localData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              disabled={isPending}
              placeholder="My Awesome Project"
              className="bg-transparent border-0 p-0 text-foreground font-semibold text-base focus-visible:ring-0 shadow-none h-auto placeholder:text-muted-foreground/40"
            />
          </div>

          {/* Grid Inputs */}
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wide">Project URL</Label>
              <Input
                value={localData.projectUrl || ""}
                onChange={(e) => handleChange("projectUrl", e.target.value)}
                disabled={isPending}
                placeholder="https://..."
                className="bg-muted/30 focus-visible:bg-transparent transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wide">Technologies</Label>
              <Input
                value={localData.technologies || ""}
                onChange={(e) => handleChange("technologies", e.target.value)}
                disabled={isPending}
                placeholder="React, Node.js..."
                className="bg-muted/30 focus-visible:bg-transparent transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wide">Start Date</Label>
              <Input
                type="date"
                value={localData.startDate || ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
                disabled={isPending}
                className="bg-muted/30 focus-visible:bg-transparent transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wide">End Date</Label>
              <Input
                type="date"
                value={localData.endDate || ""}
                onChange={(e) => handleChange("endDate", e.target.value)}
                disabled={isPending}
                className="bg-muted/30 focus-visible:bg-transparent transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wide flex items-center gap-1">
              Description
              {!localData.description?.trim() && <span className="text-destructive font-bold">*</span>}
            </Label>
            <Textarea
              value={localData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={isPending}
              placeholder="Brief description..."
              className="bg-muted/30 focus-visible:bg-transparent min-h-[85px] resize-none transition-colors"
            />
          </div>

          {/* زرار الحفظ */}
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={isSaveDisabled}
            className="w-full bg-[#4b4f52] hover:bg-[#3b3e40] text-white font-medium shadow-sm transition-colors mt-2"
          >
            {saveMutation.isPending ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Save Project"
            )}
          </Button>
          
        </div>
      </div>
    </div>
  );
};
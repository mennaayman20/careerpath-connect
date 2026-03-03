import { useState, useEffect } from "react";
import { FolderGit2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { userProfileService } from "@/services/userService";
import { Project } from "@/types/profile";
import ProjectModal from "./projectModal";

export const ProjectsSection = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  const loadProjects = async () => {
    try {
      const data = await userProfileService.getUserProjects();
      setProjects(data);
    } catch (err) {
      toast({ variant: "destructive", title: "Error loading projects" });
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleDelete = async (id: number) => {
    try {
      await userProfileService.deleteUserProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({ title: "Project deleted" });
    } catch (err) {
      toast({ variant: "destructive", title: "Delete failed" });
    }
  };

  return (
    <section className="p-6 border rounded-xl bg-card space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Projects</h2>
        </div>
        <Button onClick={() => { setSelectedProject(undefined); setIsModalOpen(true); }} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" /> Add Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((proj) => (
          <Card key={proj.id} className="p-4 flex justify-between items-start hover:border-primary transition-colors">
            <div className="space-y-1">
              <h3 className="font-bold text-lg">{proj.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{proj.description}</p>
              {proj.projectUrl && (
                <a href={proj.projectUrl} target="_blank" className="text-xs text-blue-500 hover:underline block">
                  {proj.projectUrl}
                </a>
              )}
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => { setSelectedProject(proj); setIsModalOpen(true); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(proj.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedProject}
        onSuccess={loadProjects}
      />
    </section>
  );
};
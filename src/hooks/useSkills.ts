import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skill, SkillRequest } from "@/types/profile";
import { userProfileService } from "@/services/userService";
import { useToast } from "./use-toast";

export const useSkills = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["profile", "skills"],
    queryFn: userProfileService.getUserSkills,
    staleTime: 5 * 60 * 1000,
  });

  const addMutation = useMutation({
    mutationFn: (name: string) => userProfileService.addSkill({ skillName: name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "skills"] });
      // ── جديد: يبطل الكاش الخاص بالـ matched jobs ──
      queryClient.invalidateQueries({ queryKey: ["matchedJobs"] });
      toast({ title: "Skill Added" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Add Failed" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (skillId: number) => userProfileService.deleteSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "skills"] });
      // ── جديد ──
      queryClient.invalidateQueries({ queryKey: ["matchedJobs"] });
      toast({ title: "Skill Removed" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  });

  return { 
    skills, 
    handleAddSkill: addMutation.mutate, 
    handleRemoveSkill: deleteMutation.mutate, 
    isLoading,
    isSkillsSaving: addMutation.isPending || deleteMutation.isPending
  };
};
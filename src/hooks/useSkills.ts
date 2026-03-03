import { useState, useEffect } from "react";
import { Skill, SkillRequest } from "@/types/profile";
import { userProfileService } from "@/services/userService";
import { useToast } from "./use-toast";

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSkills = async () => {
    try {
      const data = await userProfileService.getUserSkills();
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills", error);
    }
  };

  const handleAddSkill = async (name: string) => {
    if (!name.trim()) return;
    try {
      setIsLoading(true);
      const newSkill = await userProfileService.addSkill({ skillName: name });
      setSkills(prev => [...prev, newSkill]);
      toast({ title: "Skill Added" });
    } catch (error) {
      toast({ variant: "destructive", title: "Add Failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId: number) => {
    try {
      await userProfileService.deleteSkill(skillId);
      setSkills(prev => prev.filter(s => s.skillId !== skillId));
      toast({ title: "Skill Removed" });
    } catch (error) {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  return { skills, handleAddSkill, handleRemoveSkill, isLoading };
};
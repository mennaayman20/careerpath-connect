import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skill, SkillRequest } from "@/types/profile";
import { userProfileService } from "@/services/userService";
import { useToast } from "./use-toast";

export const useSkills = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. جلب المهارات
  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["profile", "skills"],
    queryFn: userProfileService.getUserSkills,
    staleTime: 5 * 60 * 1000,
  });

  // 2. إضافة مهارة جديدة
  const addMutation = useMutation({
    mutationFn: (name: string) => userProfileService.addSkill({ skillName: name }),
    onSuccess: () => {
      // تحديث الداتا في الخلفية
      queryClient.invalidateQueries({ queryKey: ["profile", "skills"] });
      toast({ title: "Skill Added" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Add Failed" });
    }
  });

  // 3. حذف مهارة
  const deleteMutation = useMutation({
    mutationFn: (skillId: number) => userProfileService.deleteSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "skills"] });
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
    isLoading, // جلب البيانات لأول مرة
    isSkillsSaving: addMutation.isPending || deleteMutation.isPending // حالة الحفظ أو الحذف
  };
};

// import { useState, useEffect } from "react";
// import { Skill, SkillRequest } from "@/types/profile";
// import { userProfileService } from "@/services/userService";
// import { useToast } from "./use-toast";

// export const useSkills = () => {
//   const [skills, setSkills] = useState<Skill[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   const fetchSkills = async () => {
//     try {
//       const data = await userProfileService.getUserSkills();
//       setSkills(data);
//     } catch (error) {
//       console.error("Failed to fetch skills", error);
//     }
//   };

//   const handleAddSkill = async (name: string) => {
//     if (!name.trim()) return;
//     try {
//       setIsLoading(true);
//       const newSkill = await userProfileService.addSkill({ skillName: name });
//       setSkills(prev => [...prev, newSkill]);
//       toast({ title: "Skill Added" });
//     } catch (error) {
//       toast({ variant: "destructive", title: "Add Failed" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRemoveSkill = async (skillId: number) => {
//     try {
//       await userProfileService.deleteSkill(skillId);
//       setSkills(prev => prev.filter(s => s.skillId !== skillId));
//       toast({ title: "Skill Removed" });
//     } catch (error) {
//       toast({ variant: "destructive", title: "Delete Failed" });
//     }
//   };

//   useEffect(() => { fetchSkills(); }, []);

//   return { skills, handleAddSkill, handleRemoveSkill, isLoading };
// };
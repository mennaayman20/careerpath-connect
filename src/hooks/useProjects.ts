import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userProfileService } from "@/services/userService";
import { Project } from "@/types/profile";
import { useToast } from "./use-toast";
import { useState } from "react";

export const useProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1. جلب المشاريع
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["profile", "projects"],
    queryFn: userProfileService.getUserProjects,
    staleTime: 5 * 60 * 1000,
  });

  // 2. إضافة مشروع جديد (ببيانات مبدئية)
 const addMutation = useMutation({
  mutationFn: () => userProfileService.addUserProject({
    title: "New Project",
    description: "Project Description",
    startDate: new Date().toISOString().split('T')[0],
    projectUrl: "", 
    technologies: " ", // جرب تغييرها لمصفوفة فارغة بدل string
    // أضف أي حقول إجباريّة أخرى يطلبها الـ Interface هنا
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["profile", "projects"] });
    toast({ title: "Added", description: "New project created." });
  },
    onError: () => toast({ variant: "destructive", title: "Error", description: "Could not add project." })
  });

  // 3. حفظ التعديلات (Update)
  const saveMutation = useMutation({
    mutationFn: (proj: Project) => {
      if (!proj.id) throw new Error("Project ID is missing");
      return userProfileService.updateUserProject(proj.id, proj);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "projects"] });
      toast({ title: "Saved!", description: "Project updated successfully." });
    },
    onError: () => toast({ variant: "destructive", title: "Save Failed" })
  });

  // 4. حذف مشروع
  const deleteMutation = useMutation({
    mutationFn: (id: number) => userProfileService.deleteUserProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "projects"] });
      toast({ title: "Deleted" });
    },
    onError: () => toast({ variant: "destructive", title: "Delete Failed" })
  });

  // تحديث الـ UI لحظياً (Local Cache Update)
  const updateProject = (id: number, field: string, value: string) => {
    queryClient.setQueryData(["profile", "projects"], (old: Project[] | undefined) =>
      old?.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  const isInvalidate = projects.some(p => 
    !p.title?.trim() || p.title === "New Project" || !p.description?.trim()
  );

  return { 
    projects, 
    addProject: addMutation.mutate, 
    updateProject, 
    removeProject: deleteMutation.mutate, 
    saveProjects: saveMutation.mutate, 
    isInvalidate, 
    isLoading,
    isProjectsSaving: saveMutation.isPending || addMutation.isPending || deleteMutation.isPending
  };
};


// import { userProfileService } from "@/services/userService";
// import { useEffect, useState } from "react";
// import { useToast } from "./use-toast";
// import { Project } from "@/types/profile";

// export const useProject = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   const fetchProjects = async () => {
//     setIsLoading(true);
//     try {
//       const data = await userProfileService.getUserProjects();
//       setProjects(data);
//     } catch (error) {
//       toast({ variant: "destructive", title: "Error", description: "Failed to load projects" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addProject = async () => {
//     try {
//       const newProj = await userProfileService.addUserProject({
//         title: "New Project",
//         description: "Project Description",
//         startDate: new Date().toISOString().split('T')[0],
//         projectUrl: "",
//         technologies: ""
//       });
//       setProjects(prev => [...prev, newProj]);
//       toast({ title: "Added", description: "New project created." });
//     } catch (error) {
//       toast({ variant: "destructive", title: "Error", description: "Could not add project." });
//     }
//   };

//   const updateProject = (id: number, field: string, value: string) => {
//     setProjects(prev => prev.map(p => 
//       p.id === id ? { ...p, [field]: value } : p
//     ));
//   };

// const saveProjects = async (proj: Project) => {
//   try {
//     setIsLoading(true);
//     if (proj.id) {
//       // تعديل بروجكت موجود فعلاً
//       await userProfileService.updateUserProject(proj.id, proj);
//       toast({ title: "Updated!" });
//     } else {
//       // إضافة بروجكت جديد خالص
//       const savedProj = await userProfileService.addUserProject(proj);
//       // تحديث الـ state بالـ ID الجديد اللي رجع من السيرفر
//       setProjects(prev => prev.map(p => p === proj ? savedProj : p));
//       toast({ title: "Created!" });
//     }
//   } catch (error) {
//     toast({ variant: "destructive", title: "Save Failed" });
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const isInvalidate = projects.some(p => 
//     !p.title?.trim() || p.title === "New Project" || !p.description?.trim()
//   );

//   const removeProject = async (id: number) => {
//     try {
//       await userProfileService.deleteUserProject(id);
//       setProjects(prev => prev.filter(p => p.id !== id));
//       toast({ title: "Deleted" });
//     } catch (error) {
//       toast({ variant: "destructive", title: "Delete Failed" });
//     }
//   };

//   useEffect(() => { fetchProjects(); }, []);

//   return { projects, addProject, updateProject, removeProject, saveProjects, isInvalidate, isLoading };
// };
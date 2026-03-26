import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userProfileService } from "@/services/userService";
import { Experience } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const useExperience = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1. جلب البيانات (الـ Fetching)
  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["profile", "experiences"],
    queryFn: userProfileService.getUserExperiences,
    staleTime: 5 * 60 * 1000, // الداتا تفضل فريش 5 دقائق
    refetchOnWindowFocus: false,
  });

  // 2. دالة الإضافة (Mutation)
  const addMutation = useMutation({
    mutationFn: () => userProfileService.addUserExperience({
      title: "Job Title",
      organization: "Organization",
      startDate: new Date().toISOString().split('T')[0],
      description: "Description",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "experiences"] });
      toast({ title: "Added", description: "New experience created." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Could not add experience." });
    }
  });

  // 3. دالة الحفظ/التعديل (Mutation)
  const saveMutation = useMutation({
  mutationFn: (data: Experience) => userProfileService.updateUserExperience(data.id, data),
  onSuccess: (updatedData) => {
    // 1. تحديث الـ Cache يدوياً بالعنصر الجديد اللي رجع من السيرفر
    queryClient.setQueryData(["profile", "experiences"], (oldData: Experience[] | undefined) => {
      if (!oldData) return [];
      return oldData.map((exp) => (exp.id === updatedData.id ? updatedData : exp));
    });

    // 2. اختياري: امسحي سطر invalidateQueries لو مش عايزة الـ GET الـ "زحمة" تحصل
    // queryClient.invalidateQueries({ queryKey: ["profile", "experiences"] });

    toast({ title: "Success", description: "Experience updated!" });
  },
});

  // 4. دالة الحذف (Mutation)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => userProfileService.deleteUserExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "experiences"] });
      toast({ title: "Deleted" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  });

  // --- Helpers ---

  // ملاحظة: التعديل اللحظي في الـ Input لسه محتاج State محلية 
  // أو ممكن نستخدم "Optimistic Updates" بس للتبسيط هنخلي الـ Component تتعامل مع الـ Data اللي راجعة
  const updateExperience = (id: number, field: string, value: string) => {
    // هنا ممكن تستخدمي setQueryData لو عايزة تحديث لحظي في الـ Cache
    queryClient.setQueryData(["profile", "experiences"], (old: Experience[]) => 
      old.map(e => e.id === id ? { ...e, [field]: value } : e)
    );
  };

  const validateExperiences = () => {
    const tempErrors: Record<string, string> = {};
    let isValid = true;
    experiences.forEach((exp) => {
      if (!exp.title?.trim()) {
        tempErrors[`title-${exp.id}`] = "Job title is required";
        isValid = false;
      }
      if (!exp.organization?.trim()) {
        tempErrors[`org-${exp.id}`] = "Organization name is required";
        isValid = false;
      }
    });
    setErrors(tempErrors);
    return isValid;
  };

  const isInvalid = experiences.some(exp => 
    !exp.title?.trim() || exp.title === "Job Title" || !exp.organization?.trim()
  );

  return { 
    experiences, 
    addExperience: addMutation.mutate, 
    updateExperience, 
    removeExperience: deleteMutation.mutate, 
    saveExperiences: saveMutation.mutate,
    validateExperiences,
    saveMutation,
    isInvalid, 
    errors, 
    isLoading, // ده جاي من useQuery
    isSaving: saveMutation.isPending || addMutation.isPending || deleteMutation.isPending // حالات التحميل للـ Actions
  };
};


// import { useState, useEffect } from "react";
// import { userProfileService } from "@/services/userService";
// import { Experience, ExperienceRequest } from "@/types/profile";
// import { useToast } from "@/hooks/use-toast";

// export const useExperience = () => {
//   const [experiences, setExperiences] = useState<Experience[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({}); // 1. ضيفي الـ State دي
//   const { toast } = useToast();


//   const fetchExps = async () => {
//     setIsLoading(true);
//     try {
//       const data = await userProfileService.getUserExperiences();
//       setExperiences(data);
//     } catch (error) {
//       toast({ variant: "destructive", title: "Error", description: "Failed to load experiences" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addExperience = async () => {
//     try {
//       const newExp = await userProfileService.addUserExperience({
//         title: "  Job Title",
//         organization: " Organization", 
//         startDate: new Date().toISOString().split('T')[0],
//         description: " Description", 
//       });
//       setExperiences(prev => [...prev, newExp]);
//       toast({ title: "Added", description: "New experience created." });
//     } catch (error) {
//       toast({ variant: "destructive", title: "Error", description: "Could not add experience." });
//     }
//   };

//   // تعديل دالة التحديث لتكون UI-Only
// const updateExperience = (id: number, field: string, value: string) => {
//   setExperiences(prev => prev.map(e => 
//     e.id === id ? { ...e, [field]: value } : e
//   ));
// };

// const saveExperiences = async (exp: Experience) => {
//   try {
//     setIsLoading(true);
//     toast({ title: "Saving...", description: `Updating your role at ${exp.organization|| 'Company'}` });

//     // التأكد من وجود ID لمنع الـ undefined في الـ URL
//     if (!exp.id) {
//       throw new Error("Experience ID is missing");
//     }

//     // إرسال الطلب للـ ID الخاص بالخبرة دي بس
//     await userProfileService.updateUserExperience(exp.id, {
//       title: exp.title,
//         organization: exp.organization,
//         startDate: exp.startDate,
//         description: exp.description // تأكدي إنه UPPERCASE لو السيرفر طالب Enum
//     });

//     toast({ title: "Success", description: "Experience updated successfully!" });
//   } catch (error) {
//     console.error("Save Error:", error);
//     toast({ 
//       variant: "destructive", 
//       title: "Save Failed", 
//       description: "Could not update experience. Check your data." 
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };
// const validateExperiences = () => {
//  const tempErrors: Record<string, string> = {}; // وعاء مؤقت للأخطاء
//   let isValid = true;

//   experiences.forEach((exp) => {
//     // التأكد من وجود العنوان (Title)
//     if (!exp.title || exp.title.trim() === "") {
//       tempErrors[`title-${exp.id}`] = "Job title is required";
//       isValid = false;
//     }
    
//     // التأكد من وجود الشركة (Organization)
//     if (!exp.organization || exp.organization.trim() === "") {
//       tempErrors[`org-${exp.id}`] = "Organization name is required";
//       isValid = false;
//     }

//     // مثال لـ Validation التواريخ (اختياري بس برنس)
//     if (exp.endDate && new Date(exp.startDate) > new Date(exp.endDate)) {
//       tempErrors[`date-${exp.id}`] = "End date can't be before start date";
//       isValid = false;
//     }
//   });

//   setErrors(tempErrors); // بنحط الأخطاء في الـ State عشان تظهر في الـ UI
//   return isValid; // بترجع True لو كله تمام
// };


// const isInvalid = experiences.some(exp => 
//   !exp.title?.trim() || 
//   exp.title === "New Position" || 
//   !exp.organization?.trim() ||
//   exp.organization === "Company Name"
// );


//   const removeExperience = async (id: number) => {
//     try {
//       await userProfileService.deleteUserExperience(id);
//       setExperiences(prev => prev.filter(e => e.id !== id));
//       toast({ title: "Deleted" });
//     } catch (error) {
//       toast({ variant: "destructive", title: "Delete Failed" });
//     }
//   };

//   useEffect(() => { fetchExps(); }, []);

//   return { experiences, addExperience, updateExperience, removeExperience, validateExperiences, saveExperiences , isInvalid , errors, isLoading };
// };
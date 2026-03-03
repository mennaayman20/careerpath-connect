import { useState, useEffect } from "react";
import { userProfileService } from "@/services/userService";
import { Experience, ExperienceRequest } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

export const useExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({}); // 1. ضيفي الـ State دي
  const { toast } = useToast();


  const fetchExps = async () => {
    setIsLoading(true);
    try {
      const data = await userProfileService.getUserExperiences();
      setExperiences(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load experiences" });
    } finally {
      setIsLoading(false);
    }
  };

  const addExperience = async () => {
    try {
      const newExp = await userProfileService.addUserExperience({
        title: "  Job Title",
        organization: " Organization", 
        startDate: new Date().toISOString().split('T')[0],
        description: " Description", 
      });
      setExperiences(prev => [...prev, newExp]);
      toast({ title: "Added", description: "New experience created." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not add experience." });
    }
  };

  // تعديل دالة التحديث لتكون UI-Only
const updateExperience = (id: number, field: string, value: string) => {
  setExperiences(prev => prev.map(e => 
    e.id === id ? { ...e, [field]: value } : e
  ));
};

const saveExperiences = async (exp: Experience) => {
  try {
    setIsLoading(true);
    toast({ title: "Saving...", description: `Updating your role at ${exp.organization|| 'Company'}` });

    // التأكد من وجود ID لمنع الـ undefined في الـ URL
    if (!exp.id) {
      throw new Error("Experience ID is missing");
    }

    // إرسال الطلب للـ ID الخاص بالخبرة دي بس
    await userProfileService.updateUserExperience(exp.id, {
      title: exp.title,
        organization: exp.organization,
        startDate: exp.startDate,
        description: exp.description // تأكدي إنه UPPERCASE لو السيرفر طالب Enum
    });

    toast({ title: "Success", description: "Experience updated successfully!" });
  } catch (error) {
    console.error("Save Error:", error);
    toast({ 
      variant: "destructive", 
      title: "Save Failed", 
      description: "Could not update experience. Check your data." 
    });
  } finally {
    setIsLoading(false);
  }
};
const validateExperiences = () => {
 const tempErrors: Record<string, string> = {}; // وعاء مؤقت للأخطاء
  let isValid = true;

  experiences.forEach((exp) => {
    // التأكد من وجود العنوان (Title)
    if (!exp.title || exp.title.trim() === "") {
      tempErrors[`title-${exp.id}`] = "Job title is required";
      isValid = false;
    }
    
    // التأكد من وجود الشركة (Organization)
    if (!exp.organization || exp.organization.trim() === "") {
      tempErrors[`org-${exp.id}`] = "Organization name is required";
      isValid = false;
    }

    // مثال لـ Validation التواريخ (اختياري بس برنس)
    if (exp.endDate && new Date(exp.startDate) > new Date(exp.endDate)) {
      tempErrors[`date-${exp.id}`] = "End date can't be before start date";
      isValid = false;
    }
  });

  setErrors(tempErrors); // بنحط الأخطاء في الـ State عشان تظهر في الـ UI
  return isValid; // بترجع True لو كله تمام
};


const isInvalid = experiences.some(exp => 
  !exp.title?.trim() || 
  exp.title === "New Position" || 
  !exp.organization?.trim() ||
  exp.organization === "Company Name"
);


  const removeExperience = async (id: number) => {
    try {
      await userProfileService.deleteUserExperience(id);
      setExperiences(prev => prev.filter(e => e.id !== id));
      toast({ title: "Deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  };

  useEffect(() => { fetchExps(); }, []);

  return { experiences, addExperience, updateExperience, removeExperience, validateExperiences, saveExperiences , isInvalid , errors, isLoading };
};
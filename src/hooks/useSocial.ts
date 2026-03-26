import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { SocialLink, SocialLinkRequest } from "@/types/profile";
import { userProfileService } from "@/services/userService";
import { useState } from "react";

export const useSocialLinks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1. جلب اللينكات
  const { data: links = [], isLoading } = useQuery({
    queryKey: ["profile", "social-links"],
    queryFn: userProfileService.getUserSocialLinks,
    staleTime: 5 * 60 * 1000,
  });

  // 2. إضافة لينك جديد (سلوت فاضي)
  const addMutation = useMutation({
    mutationFn: () => userProfileService.addUserSocialLink({
      socialType: "OTHER",
      url: "https://"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "social-links"] });
      toast({ title: "Added", description: "New social link slot created." });
    },
    onError: () => toast({ variant: "destructive", title: "Error", description: "Could not add social link." })
  });

  // 3. تحديث لينك (Update)
  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SocialLinkRequest }) => 
      userProfileService.updateUserSocialLink(id, data),
    onSuccess: (updatedLink) => {
      queryClient.invalidateQueries({ queryKey: ["profile", "social-links"] });
      toast({ title: "Success", description: `${updatedLink.socialType} saved successfully!` });
    },
    onError: () => toast({ variant: "destructive", title: "Save Failed" })
  });

  // 4. حذف لينك
  const deleteMutation = useMutation({
    mutationFn: (id: number) => userProfileService.deleteUserSocialLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "social-links"] });
      toast({ title: "Deleted" });
    },
    onError: () => toast({ variant: "destructive", title: "Delete Failed" })
  });

  // تحديث الـ Cache لحظياً أثناء الكتابة
  const updateLink = (id: number, field: string, value: string) => {
    queryClient.setQueryData(["profile", "social-links"], (old: SocialLink[] | undefined) =>
      old?.map(l => l.id === id ? { ...l, [field]: value } : l)
    );
    
    if (errors[`url-${id}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`url-${id}`];
        return newErrors;
      });
    }
  };

  const validateSocialLinks = () => {
    const tempErrors: Record<string, string> = {};
    let isValid = true;
    links.forEach((link) => {
      if (!link.url || !link.url.startsWith("http")) {
        tempErrors[`url-${link.id}`] = "Invalid URL";
        isValid = false;
      }
    });
    setErrors(tempErrors);
    return isValid;
  };

  return { 
    links, 
    addSocialLink: addMutation.mutate, 
    updateLink, 
    saveSocialLink: (id: number, socialType: string, url: string) => 
      saveMutation.mutate({ id, data: { socialType: socialType.toUpperCase(), url } }), 
    removeSocialLink: deleteMutation.mutate, 
    isLoading, 
    isLinksSaving: addMutation.isPending || saveMutation.isPending || deleteMutation.isPending,
    errors, 
    validateSocialLinks,
    isInvalidSocial: links.some(link => !link.url?.trim())
  };
};

// import { useEffect, useState } from "react";
// import { useToast } from "./use-toast";
// import { SocialLink, SocialLinkRequest } from "@/types/profile";
// import { userProfileService } from "@/services/userService";

// export const useSocialLinks = () => {
//   const [links, setLinks] = useState<SocialLink[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//     const [errors, setErrors] = useState<Record<string, string>>({});
//   const { toast } = useToast();

//   const fetchLinks = async () => {
//     try {
//       setIsLoading(true);
//       const data = await userProfileService.getUserSocialLinks();
//       setLinks(data);
//     } catch (error) {
//       console.error("Fetch links failed", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const addSocialLink = async () => {
//   try {
//     // 1. نبعت بيانات مبدئية للسيرفر (Object مطابق للـ SocialLinkRequest)
//     const newLinkData: SocialLinkRequest = {
//       socialType: "OTHER", // أو قيمة افتراضية يختارها اليوزر
//       url: "https://"
//     };

//     // 2. نطلب من السيرفر يكاريه عشان ناخد الـ ID
//     const response = await userProfileService.addUserSocialLink(newLinkData);
    
//     // 3. نضيفه للمصفوفة في الـ UI
//     setLinks(prev => [...prev, response]);
    
//     toast({ title: "Added", description: "New social link slot created." });
//   } catch (error) {
//     toast({ variant: "destructive", title: "Error", description: "Could not add social link." });
//   }
// };

//   // تحديث الـ URL بناءً على نوع المنصة (socialType)
// const updateLink = (id: number, field: string, value: string) => {
//     setLinks(prev => prev.map(l => 
//       l.id === id ? { ...l, [field]: value } : l
//     ));
//     // نمسح الإيرور أول ما اليوزر يبدأ يصلح
//     if (errors[`url-${id}`]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[`url-${id}`];
//         return newErrors;
//       });
//     }
//   };

// const saveSocialLinks = async (id: number, socialType: string, url: string) => {
//   try {
//     setIsLoading(true);
//     // تنبيه بالبدء للينك ده بس
//     toast({ title: "Saving...", description: `Updating ${socialType}` });

//     // نبعت الـ PUT للـ ID ده بس
//     await userProfileService.updateUserSocialLink(id, {
//       socialType: socialType.toUpperCase(), // نضمن إنه كابتل زي ما السيرفر عايز
//       url: url
//     });

//     toast({ title: "Success", description: `${socialType} saved successfully!` });
//   } catch (error) {
//     console.error(error);
//     toast({ variant: "destructive", title: "Save Failed" });
//   } finally {
//     setIsLoading(false);
//   }
// };

// const removeSocialLink = async (id: number) => {
//     try {
//       await userProfileService.deleteUserSocialLink(id);
//       setLinks(prev => prev.filter(l => l.id !== id));
//       toast({ title: "Deleted" });
//     } catch (error) {
//       toast({ variant: "destructive", title: "Delete Failed" });
//     }
//   };

//   const validateSocialLinks = () => {
//     const tempErrors: Record<string, string> = {};
//     let isValid = true;
//     links.forEach((link) => {
//       if (!link.url || !link.url.startsWith("http")) {
//         tempErrors[`url-${link.id}`] = "Invalid URL";
//         isValid = false;
//       }
//     });
//     setErrors(tempErrors);
//     return isValid;
//   };

//   const isInvalidSocial = links.some(link => !link.url?.trim());

//  useEffect(() => { 
//     fetchLinks();
//   }, []);

//   return { links, addSocialLink , fetchLinks ,updateLink, saveSocialLinks , removeSocialLink, isLoading, errors, validateSocialLinks, isInvalidSocial };
// };
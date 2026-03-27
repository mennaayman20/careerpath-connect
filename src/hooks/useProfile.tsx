import { useQuery } from "@tanstack/react-query";
import {  userProfileService } from "../services/userService"; // اتأكدي من المسار صح

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: userProfileService.getUserProfile,
    staleTime: Infinity, // البيانات هتفضل "فريش" طول ما الصفحة مفتوحة
    gcTime: 1000 * 60 * 30, // احتفظ بالبيانات في الكاش لمدة 30 دقيقة (بديل cacheTime)
  });
};
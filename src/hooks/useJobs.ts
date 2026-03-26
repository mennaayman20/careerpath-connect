// src/hooks/useJobs.ts
import { useQuery } from "@tanstack/react-query";
import { jobService } from "@/services/jobService";

export const useJobs = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['jobs', page, size],
    queryFn: () => jobService.getAllJobs(page, size),
    select: (data) => data.content || [], // بيرجع المصفوفة مباشرة
    staleTime: 1000 * 60 * 5, // الداتا تفضل "طازة" لمدة 5 دقائق، مش هيبعت request تاني لو رحتي ورجعتي في الوقت ده
    gcTime: 1000 * 60 * 10,
  });
};

export const useJobDetails = (id: string | null) => {
  return useQuery({
    queryKey: ['jobDetails', id],
    queryFn: () => jobService.getJobById(id!),
    enabled: !!id, // مش هيشتغل غير لو فيه ID
    staleTime: 1000 * 60 * 5, // الكاش يفضل صالح لـ 5 دقائق
    gcTime: 1000 * 60 * 10,
  });
};

export const useMatchedJobs = () => {
  return useQuery({
    queryKey: ['matchedJobs'],
    queryFn: jobService.getMatchedJobs,
    staleTime: 1000 * 60 * 5, // الداتا تفضل "طازة" لمدة 5 دقائق، مش هيبعت request تاني لو رحتي ورجعتي في الوقت ده
    gcTime: 1000 * 60 * 10,
    // لو حابة تضيفي Logic معين للداتا قبل ما ترجع
  });
};
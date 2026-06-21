import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userProfileService } from "../services/userService";
import { toast } from "./use-toast";
import axios from "axios";

export const useProfilePicture = () => {
  const queryClient = useQueryClient();

const { data: pictureUrl, isLoading } = useQuery({
  queryKey: ["profile-picture"],
  queryFn: async () => {
    try {
      return await userProfileService.getProfilePicture();
    } catch (error) {
  if (axios.isAxiosError(error) && error.response?.status === 404) return null;
  throw error;
}
  },
  staleTime: 5 * 60 * 1000,
  retry: false,
});

  const uploadMutation = useMutation({
    mutationFn: userProfileService.uploadProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-picture"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] }); // يحدّث hasProfilePicture
      toast({ title: "Profile picture updated!" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Upload failed", description: "Max size is 2MB. Accepted: JPG, PNG, WebP." });
    },
  });

  const deleteMutation = useMutation({
  mutationFn: userProfileService.deleteProfilePicture,
  onSuccess: () => {
    // صفري الـ cache فوراً
    queryClient.setQueryData(["profile-picture"], null);
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast({ title: "Profile picture removed." });
  },
});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too large", description: "Max size is 2MB." });
      return;
    }
    uploadMutation.mutate(file);
  };

  return {
    pictureUrl,
    isLoading,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    handleFileChange,
    deleteProfilePicture: deleteMutation.mutate,
  };
};
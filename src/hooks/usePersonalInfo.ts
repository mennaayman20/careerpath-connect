import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userProfileService } from "../services/userService";
import { personal } from "@/types/profile";
import { toast } from "./use-toast";
import { useState, useEffect } from "react";

export const useProfileManager = () => {
  const queryClient = useQueryClient();
  const [personalState, setPersonalState] = useState<personal>({
    id: 0, firstName: "", lastName: "", university: "",
  });

  const { data, isLoading: loading } = useQuery({
    queryKey: ["profile", "personal"],
    queryFn: userProfileService.getUserProfile,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // sync server data into local editable state once it arrives
  useEffect(() => {
    if (data) {
      setPersonalState({
        id: data.id || 0,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        university: data.university || "",
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: personal) => userProfileService.updateUserProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile", "personal"], updated);
      toast({ title: "Personal Info Updated Successfully" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Update Failed", description: "Failed to update personal info." });
    },
  });

  return {
    personal: personalState,
    setPersonal: setPersonalState,
    loading: loading || saveMutation.isPending,
    handleSave: () => saveMutation.mutate(personalState),
  };
};
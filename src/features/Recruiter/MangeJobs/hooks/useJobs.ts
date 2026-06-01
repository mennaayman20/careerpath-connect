import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import organizationService from "../../../org-connect/organization.service";
import { JobResponse } from "../types/recruiter.types";

type JobStatus = "OPEN" | "PAUSED" | "CLOSED";
type StatusFilter = JobStatus | "all";
type JobActionType = "resume" | "pause" | "close";

export function useJobs(orgId: number) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ["jobs", orgId, activeStatus, page],
    queryFn: () =>
      activeStatus === "all"
        ? organizationService.getOrganizationJobs(orgId, page)
        : organizationService.getOrganizationJobsByStatus(orgId, activeStatus, page),
    enabled: !!orgId,
    staleTime: 1000 * 60 * 2,
  });

  // ── Actions ───────────────────────────────────────────────────────────────
  const { mutate: jobActionMutate, isPending: actionLoading } = useMutation({
    mutationFn: ({ id, action }: { id: number; action: JobActionType }) =>
      api.patch(`/jobs/${id}/${action}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", orgId] });
    },
  });

  const handleJobAction = (
    id: number,
    action: JobActionType,
    _?: () => void
  ) => jobActionMutate({ id, action });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const filterByStatus = (status: StatusFilter) => {
    setActiveStatus(status);
    setPage(0);
  };

  const goToPage = (newPage: number) => setPage(newPage);

  const fetchJobs = () =>
    queryClient.invalidateQueries({ queryKey: ["jobs", orgId] });

  return {
    jobs: (data?.content as JobResponse[]) ?? [],
    pagination: {
      page: data?.number ?? 0,
      totalPages: data?.totalPages ?? 1,
      totalElements: data?.totalElements ?? 0,
    },
    loading: isLoading,
    actionLoading,
    activeStatus,
    fetchJobs,
    handleJobAction,
    goToPage,
    filterByStatus,
  };
}
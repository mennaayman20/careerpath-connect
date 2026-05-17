import { useState, useCallback } from "react";
import { applicationService } from "../services/application.service";
import { recruiterJobService } from "../services/recruiterJob.service";
import {
  ApplicationResponse,
  ApplicationStatus,
  PaginatedApplicationsResponse,
  ExportTaskResponse,
} from "../types/recruiter.types";
import { toast } from "sonner";
import { api } from "@/lib/api";


export const useApplications = (jobId: number) => {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [activeStatus, setActiveStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportTask, setExportTask] = useState<ExportTaskResponse | null>(null);

  const fetchApplications = useCallback(
    async (page = 0, size = 10, status?: ApplicationStatus) => {
      setLoading(true);
      try {
        let data: PaginatedApplicationsResponse;
        if (status) {
          data = await applicationService.getApplicationsByStatus(jobId, status, page, size);
        } else {
          data = await applicationService.getApplicationsByJob(jobId, page, size);
        }
        setApplications(data.content);
        setPagination({
          page: data.number,
          size: data.size,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        });
      } catch {
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    },
    [jobId]
  );

  const filterByStatus = useCallback(
    (status: ApplicationStatus | null) => {
      setActiveStatus(status);
      fetchApplications(0, pagination.size, status ?? undefined);
    },
    [fetchApplications, pagination.size]
  );

  const updateStatus = useCallback(
    async (applicationId: number, newStatus: ApplicationStatus) => {
      setStatusUpdating(applicationId);
      try {
        const updated = await applicationService.updateApplicationStatus(
          applicationId,
          newStatus
        );
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: updated.status } : app
          )
        );
        toast.success("Status updated");
      } catch {
        toast.error("Failed to update status");
      } finally {
        setStatusUpdating(null);
      }
    },
    []
  );

  // ── Export to Excel flow ───────────────────────────────────────────────────
  const startExport = useCallback(async () => {
    setExporting(true);
    setExportTask(null);
    try {
      const task = await recruiterJobService.startExportApplications(jobId);
      setExportTask(task);
      toast.success("Export started, polling status...");
      pollExportStatus(task.taskId);
    } catch {
      toast.error("Export failed to start");
      setExporting(false);
    }
  }, [jobId]);

  const pollExportStatus = useCallback(
    async (taskId: string) => {
      const interval = setInterval(async () => {
        try {
          const status = await recruiterJobService.getExportStatus(jobId, taskId);
          setExportTask(status);
          if (status.status === "COMPLETED" || status.downloadUrl) {
            clearInterval(interval);
            setExporting(false);
            toast.success("Export ready! Click Download.");
          } else if (status.status === "FAILED") {
            clearInterval(interval);
            setExporting(false);
            toast.error("Export failed");
          }
        } catch {
          clearInterval(interval);
          setExporting(false);
        }
      }, 2000);
    },
    [jobId]
  );

const downloadExport = useCallback(async () => {
  if (!exportTask?.taskId) return;
  try {
    const response = await api.get(
      `/jobs/${jobId}/applications/export/${exportTask.taskId}/download`,
      { responseType: "blob" }  // ← المهم هنا
    );
    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `applications-job-${jobId}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  } catch {
    toast.error("Download failed");
  }
}, [jobId, exportTask]);

  const goToPage = useCallback(
    (page: number) => fetchApplications(page, pagination.size, activeStatus ?? undefined),
    [fetchApplications, pagination.size, activeStatus]
  );

  return {
    applications,
    pagination,
    activeStatus,
    loading,
    statusUpdating,
    exporting,
    exportTask,
    fetchApplications,
    filterByStatus,
    updateStatus,
    startExport,
    downloadExport,
    goToPage,
  };
};
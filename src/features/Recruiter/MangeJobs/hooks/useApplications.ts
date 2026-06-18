import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "../services/application.service";
import { recruiterJobService } from "../services/recruiterJob.service";
import type {
  ApplicationStatus,
  ExportTaskResponse,
} from "../types/recruiter.types";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const useApplications = (jobId: number) => {
  const queryClient = useQueryClient();

  // 1. حالات التحكم المحلية فقط (UI State)
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [activeStatus, setActiveStatus] = useState<ApplicationStatus | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  // 2. Query: جلب طلبات التوظيف (تتحدث تلقائياً عند تغيير الـ page أو الـ status)
  const { data: applicationsData, isLoading: loading } = useQuery({
    queryKey: ["applications", jobId, page, activeStatus],
    queryFn: () => {
      if (activeStatus) {
        return applicationService.getApplicationsByStatus(jobId, activeStatus, page, size);
      }
      return applicationService.getApplicationsByJob(jobId, page, size);
    },
    placeholderData: (previousData) => previousData, // تجربة مستخدم سلسة أثناء التنقل بين الصفحات
  });

  // 3. Query: عمل Polling لحالة الـ Export (تعمل فقط عندما يتوفر taskId)
  const { data: exportTask } = useQuery<ExportTaskResponse | null>({
    queryKey: ["exportStatus", jobId, taskId],
    queryFn: () => recruiterJobService.getExportStatus(jobId, taskId!),
    enabled: !!taskId,
    refetchInterval: (query) => {
      const task = query.state.data;
      // استمر في عمل Request كل ثانيتين طالما الحالة ليست نوتة نهائية
      if (task && (task.status === "COMPLETED" || task.status === "FAILED" || task.downloadUrl)) {
        return false;
      }
      return 2000;
    },
  });

  // مراقبة تحديثات الـ Export لإظهار الـ Toasts المناسبة
  const isExporting = !!taskId && exportTask?.status !== "COMPLETED" && exportTask?.status !== "FAILED";

  // 4. Mutation: تحديث حالة طلب التوظيف
  const updateStatusMutation = useMutation({
    mutationFn: ({ appId, newStatus }: { appId: number; newStatus: ApplicationStatus }) =>
      applicationService.updateApplicationStatus(appId, newStatus),
    onSuccess: () => {
      toast.success("Status updated");
      // إعادة جلب البيانات فوراً لتحديث القائمة في الخلفية
      queryClient.invalidateQueries({ queryKey: ["applications", jobId] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  // 5. Mutation: بدء عملية الـ Export
  const startExportMutation = useMutation({
    mutationFn: () => recruiterJobService.startExportApplications(jobId),
    onSuccess: (task) => {
      setTaskId(task.taskId);
      toast.success("Export started, polling status...");
    },
    onError: () => {
      toast.error("Export failed to start");
    },
  });

  // ─── Actions ────────────────────────────────────────────────────────────────

  const filterByStatus = useCallback((status: ApplicationStatus | null) => {
    setActiveStatus(status);
    setPage(0); // العودة للصفحة الأولى دائماً عند الفلترة
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const downloadExport = useCallback(async () => {
    if (!taskId) return;
    try {
      const response = await api.get(
        `/jobs/${jobId}/applications/export/${taskId}/download`,
        { responseType: "blob" }
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
  }, [jobId, taskId]);

  // تجهيز بيانات الـ pagination بالشكل القديم لكي لا يتأثر الـ UI الحالي لديك
  const pagination = {
    page: applicationsData?.number ?? 0,
    size: applicationsData?.size ?? 10,
    totalPages: applicationsData?.totalPages ?? 0,
    totalElements: applicationsData?.totalElements ?? 0,
  };

  return {
    applications: applicationsData?.content ?? [],
    pagination,
    activeStatus,
    loading,
    statusUpdating: updateStatusMutation.isPending ? updateStatusMutation.variables?.appId ?? null : null,
    exporting: isExporting,
    exportTask: exportTask ?? null,
    fetchApplications: () => queryClient.invalidateQueries({ queryKey: ["applications", jobId] }),
    filterByStatus,
    updateStatus: (appId: number, newStatus: ApplicationStatus) => updateStatusMutation.mutate({ appId, newStatus }),
    startExport: startExportMutation.mutate,
    downloadExport,
    goToPage,
  };
};
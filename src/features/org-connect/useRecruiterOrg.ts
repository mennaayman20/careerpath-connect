import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { OrganizationResponse } from "./organization.interfaces";
import organizationService from "./organization.service";

export function useRecruiterOrg() {
  const queryClient = useQueryClient();

  // جلب بيانات المنظمة باستخدام useQuery
  const { data: org, isLoading } = useQuery<OrganizationResponse | null>({
    queryKey: ["myOrganization"],
    queryFn: async () => {
      try {
        return await organizationService.getMyOrganization();
      } catch {
        return null;
      }
    },
    // خيارات إضافية مفيدة:
    staleTime: 1000 * 60 * 5, // اعتبار البيانات فريش لمدة 5 دقائق لتقليل الـ API Calls
  });

  // تحديث الكاش يدوياً عند حدوث الاتصال بنجاح
  const onOrgConnected = (connectedOrg: OrganizationResponse) => {
    queryClient.setQueryData(["myOrganization"], connectedOrg);
  };

  // التأكد من أن القيمة الراجعة هي null في حال عدم وجود بيانات وليس undefined
  const currentOrg = org ?? null;

  return {
    org: currentOrg,
    hasOrg: currentOrg !== null && currentOrg.verified === true,
    orgId: currentOrg?.id ?? null,
    loading: isLoading,
    onOrgConnected,
  };
}
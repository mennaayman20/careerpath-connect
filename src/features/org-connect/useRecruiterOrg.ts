import { useState, useEffect } from "react";
import type { OrganizationResponse } from "./organization.interfaces";
import organizationService from "./organization.service";

const ORG_ID_KEY = "organizationId";

export function useRecruiterOrg() {
  const [org, setOrg] = useState<OrganizationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // قرأ الـ orgId مرة واحدة من localStorage
const [orgId, setOrgId] = useState<number | null>(() => {
  // const stored = localStorage.getItem("organizationId");
  // return stored ? Number(stored) : null;
    // const stored = localStorage.getItem("organizationId");
  // return stored ? Number(stored) : null;
  return 1; // ← مؤقت للتست
});

  // لو عنده orgId محفوظ، جيب بيانات الـ org من الـ API
  useEffect(() => {
    if (orgId === null) {
      setLoading(false);
      return;
    }
    setLoading(true);
    organizationService
      .getOrganizationById(orgId)
      .then((data) => setOrg(data))
      .catch(() => {
        // الـ token انتهى أو الـ org اتحذف — نمسح المحفوظ
        localStorage.removeItem(ORG_ID_KEY);
        setOrgId(null);
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  const onOrgConnected = (connectedOrg: OrganizationResponse) => {
    localStorage.setItem(ORG_ID_KEY, String(connectedOrg.id));
    setOrgId(connectedOrg.id);
    setOrg(connectedOrg);
  };

  return {
    org,
    hasOrg: orgId !== null,
    orgId,
    loading,
    onOrgConnected,
  };
}
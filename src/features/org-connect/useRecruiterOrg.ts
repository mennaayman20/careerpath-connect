import { useState, useEffect } from "react";
import type { OrganizationResponse } from "./organization.interfaces";
import organizationService from "./organization.service";

export function useRecruiterOrg() {
  const [org, setOrg] = useState<OrganizationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    organizationService
      .getMyOrganization()          // ← GET /user/me/organization
      .then((data) => setOrg(data))
      .catch(() => setOrg(null))
      .finally(() => setLoading(false));
  }, []);

  const onOrgConnected = (connectedOrg: OrganizationResponse) => {
    setOrg(connectedOrg);
  };

  return {
    org,
    hasOrg: org !== null,
    orgId: org?.id ?? null,         // ← بييجي من الـ API مباشرة
    loading,
    onOrgConnected,
  };
}
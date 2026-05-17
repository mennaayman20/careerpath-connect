import { useCallback, useState } from "react";
import organizationService from "./organization.service";
import {
  validateOrgUpdate,
  isUpdateValid,
} from "./Organization update.interfaces ";
import type {
  OrganizationUpdateRequest,
  UpdateOrgErrors,
} from "./Organization update.interfaces ";
import type { OrganizationResponse } from "./organization.interfaces";

interface UseEditOrgOptions {
  organizationId: number;
  /** Seed the form with existing data */
  initialData?: Partial<OrganizationUpdateRequest>;
  onSuccess?: (updated: OrganizationResponse) => void;
}

export function useEditOrganization({
  organizationId,
  initialData = {},
  onSuccess,
}: UseEditOrgOptions) {
  const [form, setForm] = useState<OrganizationUpdateRequest>({
    name: "",
    description: "",
    website: "",
    logoUrl: "",
    industry: "",
    size: "",
    location: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<UpdateOrgErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const setField = useCallback(
    <K extends keyof OrganizationUpdateRequest>(key: K, value: OrganizationUpdateRequest[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      // Clear field error on change
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setSaved(false);
    },
    []
  );

  const submit = useCallback(async () => {
    const validationErrors = validateOrgUpdate(form);
    if (!isUpdateValid(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    // Strip empty-string optional fields so PATCH stays clean
    const payload: OrganizationUpdateRequest = Object.fromEntries(
  Object.entries(form).filter(([, v]) => v !== "" && v != null) // ✅ استبعد null كمان
);

    setLoading(true);
    setServerError(null);

    try {
      const updated = await organizationService.updateOrganization(organizationId, payload);
      setSaved(true);
      onSuccess?.(updated);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setServerError(
        axiosErr?.response?.data?.message ?? "Failed to save changes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [form, organizationId, onSuccess]);

  const reset = useCallback(() => {
    setForm({ name: "", description: "", website: "", logoUrl: "", industry: "", size: "", location: "", ...initialData });
    setErrors({});
    setServerError(null);
    setSaved(false);
  }, [initialData]);

  return { form, errors, loading, serverError, saved, setField, submit, reset };
}
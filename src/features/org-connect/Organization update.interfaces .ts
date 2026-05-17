// ─── Request Type ─────────────────────────────────────────────────────────────

export interface OrganizationUpdateRequest {
  /** 2–100 characters */
  name?: string;
  /** 0–1000 characters */
  description?: string;
  /** 0–255 chars, must match URL regex */
  website?: string;
  /** must match URL regex (no length cap in schema) */
  logoUrl?: string;
  /** 0–100 characters */
  industry?: string;
  /** 0–50 characters */
  size?: string;
  /** 0–150 characters */
  location?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const URL_REGEX =
  /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

export type UpdateOrgErrors = Partial<Record<keyof OrganizationUpdateRequest, string>>;

export function validateOrgUpdate(data: OrganizationUpdateRequest): UpdateOrgErrors {
  const errors: UpdateOrgErrors = {};

  if (data.name !== undefined) {
    if (data.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
    else if (data.name.length > 100) errors.name = "Name must be at most 100 characters.";
  }

  if (data.description !== undefined && data.description.length > 1000)
    errors.description = "Description must be at most 1000 characters.";

 if (data.website != null && data.website.trim() !== "") { // ✅ != بدل !== عشان يشمل null و undefined
  if (data.website.length > 255) errors.website = "...";
  else if (!URL_REGEX.test(data.website)) errors.website = "...";
}

if (data.logoUrl != null && data.logoUrl.trim() !== "") { // ✅ نفس الحل
  if (!URL_REGEX.test(data.logoUrl)) errors.logoUrl = "...";
}
  if (data.industry !== undefined && data.industry.length > 100)
    errors.industry = "Industry must be at most 100 characters.";

  if (data.size !== undefined && data.size.length > 50)
    errors.size = "Size must be at most 50 characters.";

  if (data.location !== undefined && data.location.length > 150)
    errors.location = "Location must be at most 150 characters.";

  return errors;
}

export function isUpdateValid(errors: UpdateOrgErrors): boolean {
  return Object.keys(errors).length === 0;
}
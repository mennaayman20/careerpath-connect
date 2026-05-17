// ─── Core Org Types ───────────────────────────────────────────────────────────

export interface OrganizationDetails {
  /** 2–100 characters */
  name: string;
  /** 0–100 characters */
  industry: string;
  /** 0–50 characters */
  size: string;
  /** 0–150 characters */
  location: string;
}

export interface OrganizationResponse {
  id: number;
  name: string;
  domain: string;
  description: string;
  website: string;
  logoUrl: string;
  industry: string;
  size: string;
  location: string;
  createdDate: string;
  lastModifiedDate: string;
  verified: boolean;
}

// ─── Update (PATCH) ───────────────────────────────────────────────────────────

export interface OrganizationUpdateRequest {
  name?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  size?: string;
  location?: string;
}

// ─── Connect Flow ─────────────────────────────────────────────────────────────

export interface ConnectToOrganizationRequest {
  /** Must be a corporate (non-public) email */
  businessEmail: string;
  /** Required only when the org doesn't exist yet */
  organization?: OrganizationDetails;
}

export interface ConnectToOrganizationResponse {
  message: string;
  /** true → org was just created; false → org already existed */
  organizationCreated: boolean;
  organization: OrganizationResponse;
}

// ─── Connect Wizard State ─────────────────────────────────────────────────────

export type ConnectOrgStep =
  | "idle"
  | "email_input"
  | "org_details"
  | "email_sent"
  | "verifying"
  | "connected"
  | "error";

export interface ConnectOrgState {
  step: ConnectOrgStep;
  businessEmail: string;
  orgDetails: Partial<OrganizationDetails>;
  /** true → org already exists, skip org_details step */
  orgExists: boolean;
  connectedOrg: OrganizationResponse | null;
  error: string | null;
  loading: boolean;
}

export const INITIAL_CONNECT_STATE: ConnectOrgState = {
  step: "idle",
  businessEmail: "",
  orgDetails: {},
  orgExists: false,
  connectedOrg: null,
  error: null,
  loading: false,
};

// ─── Public-domain blocklist ──────────────────────────────────────────────────

export const PUBLIC_EMAIL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
  "live.com", "icloud.com", "protonmail.com", "aol.com",
  "mail.com", "zoho.com", "yandex.com", "gmx.com",
]);


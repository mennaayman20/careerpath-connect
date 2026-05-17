import { useCallback, useReducer } from "react";
import organizationService from "./organization.service";
import {
  INITIAL_CONNECT_STATE,
  PUBLIC_EMAIL_DOMAINS,
} from "./organization.interfaces";
import type {
  ConnectOrgState,
  ConnectOrgStep,
  OrganizationDetails,
  OrganizationResponse,
} from "./organization.interfaces";

// ─── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_STEP"; payload: ConnectOrgStep }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_ORG_DETAILS"; payload: Partial<OrganizationDetails> }
  | { type: "SET_ORG_EXISTS"; payload: boolean }
  | { type: "SET_CONNECTED_ORG"; payload: OrganizationResponse }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };

function reducer(state: ConnectOrgState, action: Action): ConnectOrgState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_STEP":
      return { ...state, step: action.payload, error: null };
    case "SET_EMAIL":
      return { ...state, businessEmail: action.payload };
    case "SET_ORG_DETAILS":
      return { ...state, orgDetails: { ...state.orgDetails, ...action.payload } };
    case "SET_ORG_EXISTS":
      return { ...state, orgExists: action.payload };
    case "SET_CONNECTED_ORG":
      return { ...state, connectedOrg: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "RESET":
      return INITIAL_CONNECT_STATE;
    default:
      return state;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

function isPublicDomain(email: string): boolean {
  return PUBLIC_EMAIL_DOMAINS.has(getDomain(email));
}

function validateOrgDetails(details: Partial<OrganizationDetails>): string | null {
  if (!details.name || details.name.trim().length < 2)
    return "Organization name must be at least 2 characters.";
  if (details.name.length > 100)
    return "Organization name must be at most 100 characters.";
  if (!details.industry || details.industry.trim().length === 0)
    return "Industry is required.";
  if (!details.size || details.size.trim().length === 0)
    return "Company size is required.";
  if (!details.location || details.location.trim().length === 0)
    return "Location is required.";
  return null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useConnectOrg() {
  const [state, dispatch] = useReducer(reducer, INITIAL_CONNECT_STATE);

  const startFlow = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: "email_input" });
  }, []);

  // ✅ Step 1 — validate locally فقط، zero API calls
  const submitEmail = useCallback(async (email: string) => {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed.includes("@") || !trimmed.includes(".")) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a valid email address." });
      return;
    }

    if (isPublicDomain(trimmed)) {
      dispatch({
        type: "SET_ERROR",
        payload: "Please use a corporate email. Gmail, Outlook, etc. are not accepted.",
      });
      return;
    }

    // ✅ حفظ الـ email والانتقال للخطوة التانية — مفيش API هنا
    dispatch({ type: "SET_EMAIL", payload: trimmed });
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_STEP", payload: "org_details" });
  }, []);

  // ✅ Step 2 — الـ request الوحيد في الفلو كله
// جوه useConnectOrg Hook
const submitOrgDetails = useCallback(
  async (details: Partial<OrganizationDetails>) => {
    // ... التقييد والـ Loading
    try {
      const response = await organizationService.connectToOrganization({
        businessEmail: state.businessEmail,
        organization: details as OrganizationDetails,
      });

      dispatch({ type: "SET_CONNECTED_ORG", payload: response.organization });
      dispatch({ type: "SET_STEP", payload: "email_sent" });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const message = axiosErr?.response?.data?.message;

      // ✅ الحل هنا: لو الرسالة بتقول إنه مربوط فعلاً، انقله لصفحة النجاح فوراً
      if (message === "You are already connected to this organization.") {
        // ممكن تندهي API تجيب بيانات الـ Org لو محتاجاها، 
        // أو ببساطة تحوليه للداشبورد لأن حسابه جاهز
        dispatch({ type: "SET_STEP", payload: "connected" }); 
        return;
      }

      dispatch({ type: "SET_ERROR", payload: message ?? "Failed to connect." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  },
  [state.businessEmail]
);

  const goBack = useCallback(() => {
    if (state.step === "org_details") {
      dispatch({ type: "SET_STEP", payload: "email_input" });
    }
  }, [state.step]);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const verifyEmail = useCallback(async (token: string) => {
    dispatch({ type: "SET_STEP", payload: "verifying" });
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await organizationService.verifyConnection(token);
      dispatch({ type: "SET_CONNECTED_ORG", payload: response.organization });
      dispatch({ type: "SET_STEP", payload: "connected" });
    }// جوه الـ catch block في useConnectOrg
catch (err: unknown) {
  const axiosErr = err as { response?: { data?: { message?: string }, status?: number } };
  
  // لو الـ error إن التوكن expired، ممكن نشيك لو اليوزر فعلاً اتوصل خلاص
  if (axiosErr?.response?.status === 400 && axiosErr?.response?.data?.message === "Token expired") {
     // هنا ممكن تندهي API تانية تشيك على حالة اليوزر الحالية
     // لو اليوزر "connected" فعلاً، انقلي الخطوة لـ "connected" بدل "error"
  }
  
  dispatch({
    type: "SET_ERROR",
    payload: axiosErr?.response?.data?.message ?? "Verification failed.",
  });
  dispatch({ type: "SET_STEP", payload: "error" });
}
  }, []);

  return {
    state,
    startFlow,
    submitEmail,
    submitOrgDetails,
    verifyEmail,
    goBack,
    reset,
    updateOrgDetails: useCallback(
      (details: Partial<OrganizationDetails>) =>
        dispatch({ type: "SET_ORG_DETAILS", payload: details }),
      []
    ),
  };
}
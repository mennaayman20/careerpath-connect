import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Settings as SettingsIcon,
  Building2,
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useConnectOrg } from "@/features/org-connect/useConnectOrg";

// أو لو مش هتستخدم المودال، تعمل الـ UI inline زي تحت

const Settings = () => {
  const navigate = useNavigate();
  const {
    state,
    checkCurrentOrg,
    submitEmail,
    submitOrgDetails,
    goBack,
    reset,
  } = useConnectOrg();

  const { step, businessEmail, loading, error } = state;

   useEffect(() => {
    checkCurrentOrg();
  }, [])

   if (loading && step === "idle") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Step renderers ──────────────────────────────────────────────────────────

  const renderEmailStep = () => (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="biz-email">Business Email</Label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            submitEmail(fd.get("email") as string);
          }}
          className="flex gap-3 mt-1"
        >
          <Input
            id="biz-email"
            name="email"
            type="email"
            required
            placeholder="name@company.com"
            className="flex-1"
          />
          <Button type="submit" disabled={loading} className="gradient-primary border-0">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Next"}
          </Button>
        </form>
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <XCircle className="h-4 w-4" /> {error}
        </p>
      )}
    </div>
  );

  const renderOrgDetailsStep = () => (
    <div className="flex flex-col gap-4">
      <button
        onClick={goBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <p className="text-sm text-muted-foreground">
        Using: <strong>{businessEmail}</strong>
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          submitOrgDetails({
            name: fd.get("name") as string,
            industry: fd.get("industry") as string,
            size: fd.get("size") as string,
            location: fd.get("location") as string,
          });
        }}
        className="flex flex-col gap-3"
      >
        <div>
          <Label htmlFor="org-name">Organization Name</Label>
          <Input id="org-name" name="name" required placeholder="Acme Corp" className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" required placeholder="Technology" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="size">Company Size</Label>
            <Input id="size" name="size" required placeholder="50-200" className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" required placeholder="Cairo, Egypt" className="mt-1" />
        </div>
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <XCircle className="h-4 w-4" /> {error}
          </p>
        )}
        <Button type="submit" disabled={loading} className="gradient-primary border-0 mt-1">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Submit & Send Verification
        </Button>
      </form>
    </div>
  );

  const renderEmailSentStep = () => (
    <div className="rounded-lg bg-success/10 p-4 text-center flex flex-col items-center gap-3">
      <Mail className="h-8 w-8 text-success" />
      <p className="font-medium text-foreground">Verification link sent!</p>
      <p className="text-sm text-muted-foreground">
        Check <strong>{businessEmail}</strong> to complete verification.
      </p>
      <Button
        onClick={() => navigate("/recruiter-dashboard")}
        variant="outline"
        className="gap-2"
      >
        Go to Dashboard <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderConnectedStep = () => (
    <div className="rounded-lg bg-success/10 p-4 text-center flex flex-col items-center gap-3">
      <CheckCircle2 className="h-8 w-8 text-success" />
      <p className="font-medium text-foreground">You're already connected!</p>
      <Button
        onClick={() => navigate("/recruiter-dashboard")}
        className="gap-2 gradient-primary border-0"
      >
        Go to Dashboard <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderErrorStep = () => (
    <div className="rounded-lg bg-destructive/10 p-4 text-center flex flex-col items-center gap-3">
      <XCircle className="h-8 w-8 text-destructive" />
      <p className="font-medium text-foreground">Something went wrong</p>
      <p className="text-sm text-muted-foreground">{error}</p>
      <Button variant="outline" onClick={reset}>Try Again</Button>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case "email_input":   return renderEmailStep();
      case "org_details":   return renderOrgDetailsStep();
      case "email_sent":    return renderEmailSentStep();
      case "connected":     return renderConnectedStep();
      case "error":         return renderErrorStep();
      default:              return renderEmailStep(); // idle → show form directly
    }
  };

  // ── UI ──────────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container max-w-2xl flex-1 py-8">
        <div className="mb-8 flex items-center gap-3">
          <SettingsIcon className="h-7 w-7 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        </div>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-display font-semibold text-foreground">Become a Recruiter</h3>
              <p className="text-sm text-muted-foreground">
                Enter your business email to connect your organization
              </p>
            </div>
          </div>

          {renderStep()}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
// components/AutoFillModal.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AutoFillPreview, AutoFillOptions } from "@/hooks/useAutoFill";
import {
  X, User, Briefcase, FolderGit2,
  Link, Code2, Sparkles, CheckCircle2
} from "lucide-react";

type Props = {
  preview: AutoFillPreview;
  isConfirming: boolean;
  onConfirm: (options: AutoFillOptions) => void;
  onClose: () => void;
};

export const AutoFillModal = ({ preview, isConfirming, onConfirm, onClose }: Props) => {
  const [options, setOptions] = useState<AutoFillOptions>({
applyPersonal: false,
    applyExperiences: !!(preview.experiences?.length),
    applyProjects: !!(preview.projects?.length),
    applySocialLinks: !!(preview.socialLinks?.length),
    selectedSkills: preview.skills ?? [],
  });

  useEffect(() => {
    setOptions((prev) => ({ ...prev, selectedSkills: preview.skills ?? [] }));
  }, [preview.skills]);

  const toggle = (key: keyof Omit<AutoFillOptions, "selectedSkills">) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSkill = (skill: string) => {
    setOptions((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter((s) => s !== skill)
        : [...prev.selectedSkills, skill],
    }));
  };

  const sections = [
    {
      key: "applyPersonal" as const,
      label: "Personal Info",
      icon: User,
      summary: preview.firstName
        ? `${preview.firstName} ${preview.lastName ?? ""}${preview.university ? ` · ${preview.university}` : ""}`
        : null,
    },
    {
      key: "applyExperiences" as const,
      label: "Experience",
      icon: Briefcase,
      summary: preview.experiences?.length
        ? `${preview.experiences.length} position(s) found`
        : null,
    },
    {
      key: "applyProjects" as const,
      label: "Projects",
      icon: FolderGit2,
      summary: preview.projects?.length
        ? `${preview.projects.length} project(s) found`
        : null,
    },
    {
      key: "applySocialLinks" as const,
      label: "Social Links",
      icon: Link,
      summary: preview.socialLinks?.length
        ? `${preview.socialLinks.length} link(s) found`
        : null,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border/50 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#1ca37b]/10 p-2">
              <Sparkles className="h-5 w-5 text-[#1ca37b]" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Auto-Fill Preview
              </h2>
              <p className="text-xs text-muted-foreground">
                Select what to apply to your profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sections */}
        <div className="px-6 py-5 space-y-3 max-h-[55vh] overflow-y-auto">
          {sections.map(({ key, label, icon: Icon, summary }) => {
            const isAvailable = !!summary;
            const isActive = options[key] && isAvailable;
            return (
              <div
                key={key}
                onClick={() => isAvailable && toggle(key)}
                className={`flex items-center gap-4 rounded-xl p-4 border transition-all
                  ${isAvailable ? "cursor-pointer" : "opacity-40 cursor-not-allowed"}
                  ${isActive
                    ? "border-[#1ca37b]/40 bg-[#1ca37b]/5"
                    : "border-border/50 bg-secondary/30"
                  }`}
              >
                <div className={`rounded-lg p-2 ${isActive ? "bg-[#1ca37b]/10" : "bg-secondary"}`}>
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#1ca37b]" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {summary ?? "Nothing found in resume"}
                  </p>
                </div>
                {isAvailable && (
                  <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0
                    ${isActive ? "bg-[#1ca37b]" : "bg-border"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform
                      ${isActive ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Skills */}
          {(preview.skills?.length ?? 0) > 0 && (
            <div className="rounded-xl border border-border/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#1ca37b]" />
                <p className="text-sm font-medium text-foreground">Skills</p>
                <span className="text-xs text-muted-foreground ml-auto">
                  {options.selectedSkills.length}/{preview.skills?.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {preview.skills?.map((skill) => {
                  const selected = options.selectedSkills.includes(skill);
                  return (
                    <Badge
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`cursor-pointer select-none transition-colors ${
                        selected
                          ? "bg-[#1ca37b] text-white hover:bg-[#1ca37b]/80"
                          : "bg-secondary text-muted-foreground hover:bg-border"
                      }`}
                    >
                      {skill}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/50 bg-secondary/20">
          <Button variant="ghost" onClick={onClose} disabled={isConfirming}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(options)}
            disabled={isConfirming}
            className="bg-[#1ca37b] hover:bg-[#1ca37b]/90 text-white border-0 gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isConfirming ? "Applying..." : "Apply to Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
};
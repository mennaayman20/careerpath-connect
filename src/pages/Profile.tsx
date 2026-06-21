import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Plus, Trash2, User, Link as LinkIcon, FolderGit2, Briefcase, Code2, X,
  Save, LayoutGrid, Star, Eye, Edit3, Sparkles, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useExperience } from "@/hooks/useExperience";
import { useProject } from "@/hooks/useProjects";
import { useSocialLinks } from "@/hooks/useSocial";
import { useSkills } from "@/hooks/useSkills";
import { useProfileManager } from "@/hooks/usePersonalInfo";
import { ResumeSection } from "@/features/resume/components/ResumeSection";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useProfile } from "@/hooks/useProfile";
import { AutoFillSection } from "@/components/ui/AutoFillSection";
import { ProfileViewMode } from "./Profileviewmode"; // Ensured safe casing for deployment builds
import { useLocation } from "react-router-dom";
import { ProfileAvatar } from "./ProfileAvatar";
const Profile = () => {
  const { toast } = useToast();
  const { personal, setPersonal, loading, handleSave } = useProfileManager();
  const [newSkill, setNewSkill] = useState({ category: "Frontend", skillName: "" });
  const [isViewMode, setIsViewMode] = useState(true);
const location = useLocation();

const [activeSection, setActiveSection] = useState(
  location.state?.defaultSection || "autofill"
);

useEffect(() => {
  if (location.state?.defaultSection) {
    setActiveSection(location.state.defaultSection);
    setIsViewMode(false); // عشان يفتح في edit mode على طول مش view mode
  }
}, [location.state]);

  const { data: profile } = useProfile();

  const {
    experiences = [],
    addExperience,
    updateExperience,
    removeExperience,
    saveExperiences,
    validateExperiences,
    saveMutation,
    errors,
    isLoading: isExperienceLoading,
  } = useExperience();

  const { 
    projects = [], 
    addProject, 
    isAdding, 
    isLoading: isProjectsLoading 
  } = useProject();

  const {
    links = [],
    addSocialLink,
    updateLink,
    saveSocialLink,
    removeSocialLink,
    isLoading: isLinksLoading,
    isLinksSaving,
    validateSocialLinks
  } = useSocialLinks();

  const {
    skills = [],
    handleAddSkill,
    handleRemoveSkill,
    isSkillsSaving
  } = useSkills();

  const navItems = [
    { id: "autofill", label: "Auto-Fill CV", icon: Sparkles },
    { id: "personal", label: "About Me", icon: User },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "social", label: "Social Links", icon: LinkIcon },
  ];

  // Global loading states evaluation
  const isGlobalDataLoading = isExperienceLoading || isProjectsLoading || isLinksLoading;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* ── HERO HEADER ─────────────────────────────────────────────────────── */}
      <section className="border-b border-border/50 py-10 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex flex-wrap items-center gap-6">
              {/* Avatar */}
              <ProfileAvatar />

              {/* Info */}
              <div className="min-w-[180px]">
                <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
                  {personal?.firstName
                    ? `${personal.firstName.charAt(0).toUpperCase()}${personal.firstName.slice(1)}`
                    : "Your"}{" "}
                  {personal?.lastName
                    ? `${personal.lastName.charAt(0).toUpperCase()}${personal.lastName.slice(1)}`
                    : "Name"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {personal?.university ? `Studying at ${personal.university}` : "Building digital experiences"}
                </p>
              </div>
            </div>

            {/* Stats Metrics Grid */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3 bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 rounded-xl p-3.5 min-w-[120px]">
                <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0">
                  <LayoutGrid className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-violet-900 dark:text-violet-100 leading-none">
                    {projects?.length ?? 0}
                  </span>
                  <span className="text-xs text-violet-600 dark:text-violet-400 mt-1">Projects</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3.5 min-w-[120px]">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 leading-none">
                    {experiences?.length ?? 0}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Experience</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3.5 min-w-[120px]">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-amber-900 dark:text-amber-100 leading-none">
                    {skills?.length ?? 0}
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 mt-1">Skills</span>
                </div>
              </div>

              {/* ── VIEW / EDIT TOGGLE BUTTON ── */}
              <button
                onClick={() => setIsViewMode((v) => !v)}
                className="flex-shrink-0 group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer select-none border border-emerald-500/20 shadow-md"
                style={{
                  background: "linear-gradient(180deg, #1fba8d 0%, #1ca37b 100%)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none"
                  style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)" }}
                />
                <div 
                  className="absolute -inset-2 opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl pointer-events-none -z-10"
                  style={{ background: "radial-gradient(circle, #1ca37b 0%, transparent 65%)" }}
                />
                <div 
                  className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.8s_infinite] transition-transform duration-1000 ease-in-out pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)" }}
                />

                <div className="relative z-10 flex items-center gap-2.5 tracking-[0.02em] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                  {isViewMode ? (
                    <>
                      <Edit3 className="w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-emerald-100" />
                      <span>Edit Profile</span>
                    </>
                  ) : (
                    <>
                      <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
                        <Eye className="w-4 h-4 absolute transition-all duration-300 group-hover:-translate-y-5 group-hover:opacity-0" />
                        <Eye className="w-4 h-4 absolute translate-y-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-emerald-100" />
                      </div>
                      <span>Preview View</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE LAYOUT SECTIONS ─────────────────────────────────────────────────── */}
      <div className="flex-1">
        {isViewMode ? (
          /* ── VIEW MODE ── */
          <main className="container mx-auto w-10/12 px-6 py-12">
            <ProfileViewMode
              personal={personal}
              experiences={experiences}
              projects={projects}
              skills={skills}
              links={links}
              onEdit={() => setIsViewMode(false)}
            />
            <div className="mt-16 pt-8 border-t border-border/50">
              <ResumeSection />
            </div>
          </main>
        ) : (
          /* ── EDIT MODE ── */
          <>
            {/* Sticky Content Tabs Navigation */}
            <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-6 py-4">
                <nav className="flex gap-2 overflow-x-auto no-scrollbar">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveSection(id)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                        activeSection === id
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <main className="container mx-auto w-10/12 px-6 py-12">
              {isGlobalDataLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-[#1ca37b]" />
                  <p className="text-sm text-muted-foreground font-medium">Fetching profile context...</p>
                </div>
              ) : (
                <>
                  {activeSection === "autofill" && <AutoFillSection />}

                  {/* ── Personal Info ── */}
                  {activeSection === "personal" && (
                    <div className="space-y-8">
                      <div className="text-center lg:text-left">
                        <h2 className="font-display text-3xl font-bold text-foreground">
                          Your <span className="text-[#1ca37b]">Profile</span> Details
                        </h2>
                      </div>

                      <div className="rounded-xl bg-card p-8 shadow-card border border-border/50">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={personal?.firstName || ""}
                              onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
                              placeholder="John"
                              className="bg-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={personal?.lastName || ""}
                              onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
                              placeholder="Doe"
                              className="bg-input"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="university">University (Optional)</Label>
                            <Input
                              id="university"
                              value={personal?.university || ""}
                              onChange={(e) => setPersonal({ ...personal, university: e.target.value })}
                              placeholder="Your University"
                              className="bg-input"
                            />
                          </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                          <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-[#4b4f52] hover:bg-[#3d4042] text-white rounded-xl px-5"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Skills ── */}
                  {activeSection === "skills" && (
                    <div className="space-y-6">
                      <h2 className="font-display text-3xl font-bold text-foreground">
                        Technical <span className="text-[#1ca37b]">Skills</span>
                      </h2>

                      <div className="rounded-xl bg-card p-5 border border-border/50">
                        <h3 className="text-[15px] font-medium text-foreground mb-4">Add new skill</h3>
                        <div className="flex gap-2.5 items-end">
                          <div className="flex-1 space-y-1.5">
                            <Label className="text-xs text-muted-foreground font-medium">Skill name</Label>
                            <Input
                              placeholder="React, TypeScript, Tailwind CSS..."
                              value={newSkill.skillName}
                              onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newSkill.skillName.trim()) {
                                  handleAddSkill(newSkill.skillName);
                                  setNewSkill({ ...newSkill, skillName: "" });
                                }
                              }}
                              className="h-9 bg-muted/50"
                            />
                          </div>
                          <Button
                            onClick={() => {
                              if (newSkill.skillName.trim()) {
                                handleAddSkill(newSkill.skillName);
                                setNewSkill({ ...newSkill, skillName: "" });
                              }
                            }}
                            disabled={isSkillsSaving || !newSkill.skillName.trim()}
                            className="h-9 px-4 bg-[#4b4f52] hover:bg-[#3d4042] text-white gap-1.5 rounded-lg"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </Button>
                        </div>
                      </div>

                      {skills.length === 0 ? (
                        <div className="rounded-xl bg-card p-12 text-center border border-border/50">
                          <Code2 className="mx-auto h-11 w-11 text-muted-foreground/30" />
                          <h3 className="mt-3 text-[15px] font-medium text-foreground">No skills added yet</h3>
                          <p className="mt-1.5 text-sm text-muted-foreground">Add your first skill above to showcase your expertise.</p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2.5">
                          {skills.map((s) => (
                            <div
                              key={s.skillId}
                              className="flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-full bg-card border border-border/50 hover:border-border transition-colors shadow-sm"
                            >
                              <span className="text-[13px] font-medium text-foreground">{s.skillName}</span>
                              <button
                                onClick={() => handleRemoveSkill(s.skillId)}
                                disabled={isSkillsSaving}
                                className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Projects ── */}
                  {activeSection === "projects" && (
                    <div className="space-y-8">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-display text-3xl font-bold text-foreground">
                          My <span className="text-[#1ca37b]">Projects</span>
                        </h2>
                        <Button 
                          onClick={() => addProject()} 
                          disabled={isAdding}
                          className="bg-[#2e2a72] hover:bg-[#221f55] text-white font-medium shadow-sm transition-colors rounded-xl"
                        >
                          {isAdding ? (
                            <span className="flex items-center gap-2 justify-center">
                              <Loader2 className="h-4 w-4 animate-spin" /> Adding...
                            </span>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" /> Add Project
                            </>
                          )}
                        </Button>
                      </div>

                      {projects.length === 0 ? (
                        <div className="rounded-xl bg-card p-12 text-center shadow-card border border-border/50">
                          <FolderGit2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                          <h3 className="mt-4 font-display text-lg font-semibold text-foreground">No projects added yet</h3>
                          <p className="mt-2 text-muted-foreground">Showcase your work by adding your projects.</p>
                        </div>
                      ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {projects.map((proj) => (
                            <ProjectCard key={proj.id} project={proj} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Experience ── */}
                  {activeSection === "experience" && (
                    <div className="space-y-8">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-display text-3xl font-bold text-foreground">
                          Work <span className="text-[#1ca37b]">Experience</span>
                        </h2>
                        <Button onClick={() => addExperience()} className="rounded-xl">
                          <Plus className="mr-2 h-4 w-4" /> Add Experience
                        </Button>
                      </div>

                      {experiences.length === 0 ? (
                        <div className="rounded-xl bg-card p-12 text-center shadow-card border border-border/50">
                          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
                          <h3 className="mt-4 font-display text-lg font-semibold text-foreground">No experience added yet</h3>
                          <p className="mt-2 text-muted-foreground">Add your work experience to showcase your professional journey.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {experiences.map((exp) => (
                            <div key={exp.id} className="rounded-xl bg-card p-6 shadow-card border border-border/50">
                              <div className="mb-6 flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="rounded-lg bg-accent/10 p-3">
                                    <Briefcase className="h-6 w-6 text-accent" />
                                  </div>
                                  <div>
                                    <h3 className="font-display font-semibold text-foreground">
                                      {exp.title || "Untitled Position"}
                                    </h3>
                                    {exp.organization && (
                                      <p className="text-accent font-medium text-sm">{exp.organization}</p>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => exp.id && removeExperience(exp.id)}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                  <Label>Job Title</Label>
                                  <Input
                                    value={exp.title || ""}
                                    onChange={(e) => updateExperience(exp.id!, "title", e.target.value)}
                                    placeholder="Software Engineer"
                                    className={`bg-input ${errors[`title-${exp.id}`] ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                  />
                                  {errors[`title-${exp.id}`] && <p className="text-xs text-destructive mt-1">{errors[`title-${exp.id}`]}</p>}
                                </div>

                                <div className="space-y-2">
                                  <Label>Organization</Label>
                                  <Input
                                    value={exp.organization || ""}
                                    onChange={(e) => updateExperience(exp.id!, "organization", e.target.value)}
                                    placeholder="Company Name"
                                    className={`bg-input ${errors[`org-${exp.id}`] ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                  />
                                  {errors[`org-${exp.id}`] && <p className="text-xs text-destructive mt-1">{errors[`org-${exp.id}`]}</p>}
                                </div>

                                <div className="space-y-2">
                                  <Label>Start Date</Label>
                                  <Input
                                    type="date"
                                    value={exp.startDate ? exp.startDate.split('T')[0] : ""}
                                    onChange={(e) => updateExperience(exp.id!, "startDate", e.target.value)}
                                    className="bg-input"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>End Date</Label>
                                  <Input
                                    type="date"
                                    value={exp.endDate ? exp.endDate.split('T')[0] : ""}
                                    onChange={(e) => updateExperience(exp.id!, "endDate", e.target.value)}
                                    className={`bg-input ${errors[`date-${exp.id}`] ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                  />
                                  {errors[`date-${exp.id}`] && <p className="text-xs text-destructive mt-1">{errors[`date-${exp.id}`]}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2 lg:col-span-4">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={exp.description || ""}
                                    onChange={(e) => updateExperience(exp.id!, "description", e.target.value)}
                                    placeholder="Describe your architectural implementations, UI accomplishments, or roles..."
                                    className="bg-input min-h-[100px] resize-none"
                                  />
                                </div>
                              </div>

                              <div className="mt-6 flex justify-end">
                                <Button
                                  onClick={() => {
                                    if (validateExperiences()) saveExperiences(exp);
                                  }}
                                  disabled={saveMutation.isPending && saveMutation.variables?.id === exp.id}
                                  size="sm"
                                  className="px-5 rounded-lg"
                                >
                                  {saveMutation.isPending && saveMutation.variables?.id === exp.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                      Saving...
                                    </>
                                  ) : "Save"}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Social Links ── */}
                  {activeSection === "social" && (
                    <div className="space-y-8">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-display text-3xl font-bold text-foreground">
                          Social <span className="text-[#1ca37b]">Links</span>
                        </h2>
                        <Button
                          onClick={() => addSocialLink()}
                          disabled={isLinksSaving}
                          className="bg-[#2e2a72] hover:bg-[#221f55] text-white font-medium shadow-sm transition-colors rounded-xl"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Link
                        </Button>
                      </div>

                      {links.length === 0 ? (
                        <div className="rounded-xl bg-card p-12 text-center shadow-card border border-border/50">
                          <LinkIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                          <h3 className="mt-4 font-display text-lg font-semibold text-foreground">No social links yet</h3>
                          <p className="mt-2 text-muted-foreground">Add your social profiles to showcase your online presence.</p>
                        </div>
                      ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                          {links.map((link) => (
                            <div key={link.id} className="rounded-xl bg-card p-6 shadow-card border border-border/50">
                              <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-2.5 w-2.5 rounded-full bg-[#13CA92]"></div>
                                  <span className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {link.socialType || "Platform"}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSocialLink(link.id)}
                                  disabled={isLinksSaving}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                                <div className="space-y-2">
                                  <Label>Platform</Label>
                                  <Select 
                                    value={link.socialType} 
                                    onValueChange={(value) => updateLink(link.id, "socialType", value)}
                                  >
                                    <SelectTrigger className="bg-input">
                                      <SelectValue placeholder="Select Platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {["LINKEDIN", "GITHUB", "BEHANCE", "DRIBBLE", "PORTFOLIO", "MEDIUM", "DISCORD", "STACKOVERFLOW", "GITLAB", "TWITTER", "OTHER"].map(p => (
                                        <SelectItem key={p} value={p}>
                                          {p.charAt(0) + p.slice(1).toLowerCase()}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Profile URL</Label>
                                  <Input
                                    value={link.url || ""}
                                    onChange={(e) => updateLink(link.id, "url", e.target.value)}
                                    placeholder="https://..."
                                    className={`bg-input ${errors[`url-${link.id}`] ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                  />
                                  {errors[`url-${link.id}`] && (
                                    <p className="text-xs text-destructive mt-1">{errors[`url-${link.id}`]}</p>
                                  )}
                                </div>
                              </div>

                              <div className="mt-6 flex justify-end">
                                <Button
                                  onClick={() => {
                                    if (validateSocialLinks()) {
                                      saveSocialLink(link.id, link.socialType || "OTHER", link.url || "");
                                    }
                                  }}
                                  disabled={isLinksSaving || !link.url?.trim()}
                                  size="sm"
                                  className="bg-[#4b4f52] hover:bg-[#3d4042] border-0 text-white rounded-lg px-4"
                                >
                                  {isLinksSaving ? "Saving..." : "Save Link"}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resume Section inside Edit Mode */}
                  <div className="mt-16 pt-8 border-t border-border/50">
                    <ResumeSection />
                  </div>
                </>
              )}
            </main>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
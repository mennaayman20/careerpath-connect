import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialLinkRequest, personal, ProjectRequest, SkillRequest, ExperienceRequest } from "@/types/profile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Plus, Trash2, User, Link as LinkIcon, FolderGit2, Briefcase, Code2, X,
  Mail, Phone, Twitter, Github, Linkedin, Globe, ExternalLink, Save,
  ChevronRight, Star, Download, Edit3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userProfileService } from "@/services/userService";
import { useExperience } from "@/hooks/useExperience";
import { useProject } from "@/hooks/useProjects";
import { useSocialLinks } from "@/hooks/useSocial";
import { useSkills } from "@/hooks/useSkills";
import { useProfileManager } from "@/hooks/usePersonalInfo";
import { ResumeSection } from "@/features/resume/components/ResumeSection";

const socialPlatforms = ["LINKEDIN", "GITHUB", "PORTFOLIO", "DRIBBLE", "BEHANCE", "MEDIUM", "DISCORD", "GITLAB", "OTHER"];
const skillCategories = ["Frontend", "Backend", "DevOps", "Design", "Data Science", "Mobile", "Other"];

const Profile = () => {
  const { toast } = useToast();
  const { personal, setPersonal, loading, handleSave } = useProfileManager();
  const [newSkill, setNewSkill] = useState({ category: "Frontend", skillName: "" });
  const [activeSection, setActiveSection] = useState("personal");

  const { experiences, addExperience, updateExperience, removeExperience, validateExperiences, saveExperiences, isInvalid, errors, isLoading } = useExperience();
  const { projects, addProject, updateProject, removeProject, saveProjects, isInvalidate, isLoading: isProjectsLoading } = useProject();
  const { links, updateLink, saveSocialLinks, isLoading: isLinksLoading, removeSocialLink, addSocialLink, validateSocialLinks, isInvalidSocial } = useSocialLinks();
  const { skills, isLoading: isSkillsLoading, handleAddSkill, handleRemoveSkill } = useSkills();

  const navItems = [
    { id: "personal", label: "About Me", icon: User },
    { id: "social", label: "Social Links", icon: LinkIcon },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderGit2 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-border/50 bg-gradient-to-br from-background via-secondary/20 to-background py-12">
        <div className="container mx-auto px-6 ">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
            {/* Avatar */}
            
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-secondary flex items-center justify-center ring-2 ring-accent/20 mt-10">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
                {/* <div className="absolute -bottom-2 -right-2 rounded-full bg-accent p-2 text-accent-foreground shadow-lg">
                  <Edit3 className="h-4 w-4" />
                </div> */}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center mt-16 lg:text-left">
              <div className="mb-6">
                <h1 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
                  {personal.firstName || "Your"} {personal.lastName || "Name"}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {personal.university ? `Studying at ${personal.university}` : "Building digital experiences"}
                </p>
              </div>

              {/* Contact Info */}
              {/* <div className="mb-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
                  <Mail className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">example@domain.com</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
                  <Phone className="h-4 w-4 text-accent" />
                  <span className="text-muted-foreground">+1 (234) 567-890</span>
                </div>
              </div> */}

              {/* Action Buttons */}
              {/* <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                <Button
                  onClick={() => setActiveSection("personal")}
                  className="gradient-accent border-0 text-accent-foreground shadow-elevated"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </div> */}
            </div>

            {/* Stats */}
            <div className="flex gap-6 lg:flex-col lg:gap-4">
              <div className="rounded-xl bg-card p-4 text-center shadow-card border border-border/50">
                <div className="font-display text-2xl font-bold text-accent">{projects.length}</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
              <div className="rounded-xl bg-card p-4 text-center shadow-card border border-border/50">
                <div className="font-display text-2xl font-bold text-accent">{experiences.length}</div>
                <div className="text-xs text-muted-foreground">Experience</div>
              </div>
              <div className="rounded-xl bg-card p-4 text-center shadow-card border border-border/50">
                <div className="font-display text-2xl font-bold text-accent">{skills.length}</div>
                <div className="text-xs text-muted-foreground">Skills</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex gap-2 overflow-x-auto">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === id
                    ? "bg-accent text-accent-foreground"
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

      {/* Main Content */}
      <main className="container mx-auto w-10/12 px-6 py-12">
        {/* Personal Info */}
        {activeSection === "personal" && (
          <div className="space-y-8">
            <div>
              <div className="mb-8 text-center lg:text-left">
                {/* <Badge variant="secondary" className="mb-4 gradient-accent text-accent-foreground">
                  Personal Information
                </Badge> */}
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Your <span className="text-accent">Profile</span> Details
                </h2>
              </div>

              <div className="rounded-xl bg-card p-8 shadow-card border border-border/50">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={personal.firstName}
                      onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
                      placeholder="John"
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={personal.lastName}
                      onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
                      placeholder="Doe"
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="university">University (Optional)</Label>
                    <Input
                      id="university"
                      value={personal.university}
                      onChange={(e) => setPersonal({ ...personal, university: e.target.value })}
                      placeholder="Your University"
                      className="bg-input"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button onClick={handleSave} disabled={loading} className="gradient-accent border-0 text-accent-foreground">
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Links */}
        {activeSection === "social" && (
          <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {/* <Badge variant="secondary" className="mb-4 gradient-accent text-accent-foreground">
                  Connect
                </Badge> */}
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Social <span className="text-accent">Links</span>
                </h2>
              </div>
              <Button onClick={addSocialLink} variant="outline" className="border-border text-foreground hover:bg-secondary">
                <Plus className="mr-2 h-4 w-4" />
                Add Link
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
                        <div className="h-2 w-2 rounded-full bg-accent"></div>
                        <span className="font-display text-sm font-semibold uppercase tracking-wide text-accent">
                          {link.socialType}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocialLink(link.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                      <div className="space-y-2">
                        <Label>Platform</Label>
                        <Select value={link.socialType} onValueChange={(value) => updateLink(link.id, "socialType", value)}>
                          <SelectTrigger className="bg-input">
                            <SelectValue placeholder="Select Platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {["LINKEDIN", "GITHUB", "BEHANCE", "DRIBBLE", "PORTFOLIO", "MEDIUM", "DISCORD", "STACKOVERFLOW", "GITLAB", "TWITTER", "FACEBOOK", "INSTAGRAM", "OTHER"].map(p => (
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
                          className="bg-input"
                        />
                        {errors[`url-${link.id}`] && (
                          <p className="text-sm text-destructive">{errors[`url-${link.id}`]}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => saveSocialLinks(link.id, link.socialType || "OTHER", link.url || "")}
                        disabled={isLinksLoading || !link.url?.trim()}
                        size="sm"
                        className="gradient-accent border-0 text-accent-foreground"
                      >
                        {isLinksLoading ? "Saving..." : "Save Link"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {activeSection === "skills" && (
          <div className="space-y-8">
            <div>
              {/* <Badge variant="secondary" className="mb-4 gradient-accent text-accent-foreground">
                My Work Skills
              </Badge> */}
              <h2 className="font-display text-3xl font-bold text-foreground">
                Technical <span className="text-accent">Expertise</span>
              </h2>
            </div>

            {/* Add Skill */}
            <div className="rounded-xl bg-card p-6 shadow-card border border-border/50">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Add New Skill</h3>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-2">
                  <Label>Category</Label>
                  <Select value={newSkill.category} onValueChange={(v) => setNewSkill({ ...newSkill, category: v })}>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Skill Name</Label>
                  <Input
                    placeholder="React, Figma, etc."
                    value={newSkill.skillName}
                    onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddSkill(newSkill.skillName);
                        setNewSkill({ ...newSkill, skillName: "" });
                      }
                    }}
                    className="bg-input"
                  />
                </div>
                <Button
                  onClick={() => { handleAddSkill(newSkill.skillName); setNewSkill({ ...newSkill, skillName: "" }); }}
                  disabled={isSkillsLoading || !newSkill.skillName.trim()}
                  className="gradient-accent border-0 text-accent-foreground"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            {/* Skills Grid */}
            {skills.length === 0 ? (
              <div className="rounded-xl bg-card p-12 text-center shadow-card border border-border/50">
                <Code2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">No skills added yet</h3>
                <p className="mt-2 text-muted-foreground">Add your first skill above to showcase your expertise.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skills.map((s) => (
                  <div key={s.skillId} className="rounded-xl bg-card p-6 shadow-card border border-border/50">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-display font-semibold text-foreground">{s.skillName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSkill(s.skillId)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="h-2 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full gradient-accent transition-all duration-1000"
                        style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                      />
                    </div>
                    <div className="mt-2 text-right text-sm font-medium text-accent">
                      {Math.floor(Math.random() * 40) + 60}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Experience */}
        {activeSection === "experience" && (
          <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {/* <Badge variant="secondary" className="mb-4 gradient-accent text-accent-foreground">
                  My Services
                </Badge> */}
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Work <span className="text-accent">Experience</span>
                </h2>
              </div>
              <Button onClick={addExperience} variant="outline" className="border-border text-foreground hover:bg-secondary">
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
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
                            {exp.title || `Experience ${exp.id}`}
                          </h3>
                          {exp.organization && (
                            <p className="text-accent font-medium">{exp.organization}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title || ""}
                          onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                          placeholder="Software Engineer"
                          className="bg-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Organization</Label>
                        <Input
                          value={exp.organization || ""}
                          onChange={(e) => updateExperience(exp.id, "organization", e.target.value)}
                          placeholder="Company Name"
                          className="bg-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={exp.startDate || ""}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          className="bg-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={exp.endDate || ""}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          className="bg-input"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2 lg:col-span-4">
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description || ""}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          placeholder="Describe your role and achievements..."
                          className="bg-input min-h-[100px] resize-none"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => saveExperiences(exp)}
                        disabled={isLoading || !exp.title?.trim() || !exp.organization?.trim() || !exp.startDate}
                        className="gradient-accent border-0 text-accent-foreground"
                      >
                        {isLoading ? "Saving..." : "Save Experience"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Projects */}
        {activeSection === "projects" && (
          <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {/* <Badge variant="secondary" className="mb-4 gradient-accent text-accent-foreground">
                  Portfolio
                </Badge> */}
                <h2 className="font-display text-3xl font-bold text-foreground">
                  My <span className="text-accent">Projects</span>
                </h2>
              </div>
              <Button onClick={addProject} variant="outline" className="border-border text-foreground hover:bg-secondary">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
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
                  <div key={proj.id} className="group rounded-xl bg-card shadow-card border border-border/50 overflow-hidden hover:shadow-elevated transition-shadow">
                    {/* Project Header */}
                    <div className="aspect-video bg-gradient-to-br from-secondary to-secondary/50 relative flex items-center justify-center">
                      <FolderGit2 className="h-12 w-12 text-muted-foreground" />
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-4 right-4 rounded-full bg-accent p-2 text-accent-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(proj.id)}
                        className="absolute top-4 right-4 h-8 w-8 p-0 bg-background/80 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Project Content */}
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project Title</Label>
                          <Input
                            value={proj.title || ""}
                            onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                            placeholder="My Awesome Project"
                            className="mt-1 bg-input border-0 p-0 text-foreground font-display font-semibold text-lg"
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project URL</Label>
                            <Input
                              value={proj.projectUrl || ""}
                              onChange={(e) => updateProject(proj.id, "projectUrl", e.target.value)}
                              placeholder="https://..."
                              className="mt-1 bg-input"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Technologies</Label>
                            <Input
                              value={proj.technologies || ""}
                              onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                              placeholder="React, Node.js..."
                              className="mt-1 bg-input"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Start Date</Label>
                            <Input
                              type="date"
                              value={proj.startDate || ""}
                              onChange={(e) => updateProject(proj.id, "startDate", e.target.value)}
                              className="mt-1 bg-input"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">End Date</Label>
                            <Input
                              type="date"
                              value={proj.endDate || ""}
                              onChange={(e) => updateProject(proj.id, "endDate", e.target.value)}
                              className="mt-1 bg-input"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</Label>
                          <Textarea
                            value={proj.description || ""}
                            onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                            placeholder="Brief description of the project..."
                            className="mt-1 bg-input min-h-[80px] resize-none"
                          />
                        </div>

                     

                        <Button
                          onClick={() => saveProjects(proj)}
                          disabled={isProjectsLoading || !proj.title?.trim() || !proj.description?.trim() || !proj.startDate}
                          className="w-full gradient-accent border-0 text-accent-foreground"
                        >
                          {isProjectsLoading ? "Saving..." : "Save Project"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resume Section */}
        <div className="mt-16 pt-8 border-t border-border/50">
          {/* <Badge variant="secondary" className="mb-4 gradient-accent text-accent-foreground">
            Resume
          </Badge> */}
          <ResumeSection />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
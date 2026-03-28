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
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useProfile } from "@/hooks/useProfile";
const socialPlatforms = ["LINKEDIN", "GITHUB", "PORTFOLIO", "DRIBBLE", "BEHANCE", "MEDIUM", "DISCORD", "GITLAB", "OTHER"];
const skillCategories = ["Frontend", "Backend", "DevOps", "Design", "Data Science", "Mobile", "Other"];

const Profile = () => {
  const { toast } = useToast();
  const { personal, setPersonal, loading, handleSave } = useProfileManager();
  const [newSkill, setNewSkill] = useState({ category: "Frontend", skillName: "" });
  const [activeSection, setActiveSection] = useState("personal");
const { data: profile, isLoading: isProfileLoading } = useProfile();



// السطر 33 المعدل
const { 
  experiences, 
  addExperience, 
  updateExperience, 
  removeExperience, 
  saveExperiences, 
  validateExperiences, 
  saveMutation,
  errors, 
  isLoading, 
  isSaving 
} = useExperience();

const { projects, addProject, isAdding, isLoading : isProjectsLoading} = useProject();

 const { 
  links, 
  addSocialLink, 
  updateLink, 
  saveSocialLink, // اتأكدي من الاسم هنا
  removeSocialLink, 
  isLoading: isLinksLoading, 
  isLinksSaving,
  validateSocialLinks 
} = useSocialLinks();


 const { 
  skills, 
  handleAddSkill, 
  handleRemoveSkill, 
  isLoading: isSkillsLoading, 
  isSkillsSaving 
} = useSkills();

  const navItems = [
    { id: "personal", label: "About Me", icon: User },
    { id: "social", label: "Social Links", icon: LinkIcon },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderGit2 },
  ];

  return (
    // لو لسه بيجيب البيانات لأول مرة، ممكن تعرضي Spinner أو صفحة تحميل بسيطة

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
      {isLoading ? (
    <div className="flex justify-center py-20">
       <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
    </div>
  ) : (
    <>
        {/* Personal Info */}
        {activeSection === "personal" && (
          <div className="space-y-8">
            <div>
              <div className="mb-8 text-center lg:text-left">
                {/* <Badge variant="secondary" className="mb-4 gradient-accent text-accent-foreground">
                  Personal Information
                </Badge> */}
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Your <span className=" text-[#1ca37b] ">Profile</span> Details
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
                  <Button onClick={handleSave} disabled={loading} className=" border-0 
                  bg-[#4b4f52]
                  text-accent-foreground">
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
                  Social <span className="text-[#1ca37b]">Links</span>
                </h2>
              </div>
             <Button 
  onClick={() => addSocialLink()} 
  disabled={isLinksSaving} // تعطيل الزرار أثناء الإضافة
  variant="outline" 
  className="border-border text-foreground hover:bg-secondary"
>
  {isLinksSaving ? (
    <span className="flex items-center gap-2">Saving...</span>
  ) : (
    <>
      <Plus className="mr-2 h-4 w-4" /> Add Link
    </>
  )}
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
                        <div className="h-3 w-3 rounded-full bg-[#13CA92]"></div>
                        <span className="font-display text-sm font-semibold uppercase tracking-wide text-accent">
                          {link.socialType}
                        </span>
                      </div>
                      <Button
  variant="ghost"
  size="sm"
  onClick={() => removeSocialLink(link.id)}
  disabled={isLinksSaving} // تعطيل المسح أثناء أي عملية حفظ
  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive disabled:opacity-50"
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
  className={`bg-input ${errors[`url-${link.id}`] ? "border-destructive focus-visible:ring-destructive" : ""}`}
/>
                        {errors[`url-${link.id}`] && (
                          <p className="text-sm text-destructive">{errors[`url-${link.id}`]}</p>
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
  disabled={isLinksSaving || !link.url?.trim()} // تعطيل لو الـ URL فاضي أو فيه حفظ شغال
  size="sm"
  className="  bg-[#4b4f52] border-0 text-accent-foreground "
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

        {/* Skills */}
        {activeSection === "skills" && (
  <div className="space-y-6">
    <h2 className="font-display text-3xl font-bold text-foreground">
      Technical <span className="text-[#1ca37b]">Skills</span>
    </h2>

    {/* Add Skill */}
    <div className="rounded-xl bg-card p-5 border border-border/50">
      <h3 className="text-[15px] font-medium text-foreground mb-4">Add new skill</h3>
      <div className="flex gap-2.5 items-end">
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium">Skill name</Label>
          <Input
            placeholder="React, Figma, etc."
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
          className="h-9 px-4 bg-[#4b4f52] border-0 text-white gap-1.5"
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>
    </div>

    {/* Skills */}
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
            className="flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-full bg-card border border-border/50 hover:border-border transition-colors"
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

       {/* Experience */}
{activeSection === "experience" && (
  <div className="space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-3xl font-bold text-foreground">
          Work <span className="text-[#1ca37b]">Experience</span>
        </h2>
      </div>
      <Button onClick={() => addExperience()} disabled={isSaving}> 
  <Plus className="mr-2 h-4 w-4" /> Add Experience 
</Button>
    </div>

    {/* حالة الـ Loading لأول مرة جلب بيانات */}
    {isLoading && experiences.length === 0 ? (
      <div className="text-center py-10">Loading experiences...</div>
    ) : experiences.length === 0 ? (
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
                    <p className="text-accent font-medium">{exp.organization}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exp.id && removeExperience(exp.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Job Title */}
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={exp.title || ""}
                  onChange={(e) => updateExperience(exp.id!, "title", e.target.value)}
                  placeholder="Software Engineer"
                  className={`bg-input ${errors[`title-${exp.id}`] ? "border-destructive" : ""}`}
                />
                {errors[`title-${exp.id}`] && <p className="text-xs text-destructive">{errors[`title-${exp.id}`]}</p>}
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label>Organization</Label>
                <Input
                  value={exp.organization || ""}
                  onChange={(e) => updateExperience(exp.id!, "organization", e.target.value)}
                  placeholder="Company Name"
                  className={`bg-input ${errors[`org-${exp.id}`] ? "border-destructive" : ""}`}
                />
                {errors[`org-${exp.id}`] && <p className="text-xs text-destructive">{errors[`org-${exp.id}`]}</p>}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={exp.startDate ? exp.startDate.split('T')[0] : ""}
                  onChange={(e) => updateExperience(exp.id!, "startDate", e.target.value)}
                  className="bg-input"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={exp.endDate ? exp.endDate.split('T')[0] : ""}
                  onChange={(e) => updateExperience(exp.id!, "endDate", e.target.value)}
                  className={`bg-input ${errors[`date-${exp.id}`] ? "border-destructive" : ""}`}
                />
                {errors[`date-${exp.id}`] && <p className="text-xs text-destructive">{errors[`date-${exp.id}`]}</p>}
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-4">
                <Label>Description</Label>
                <Textarea
                  value={exp.description || ""}
                  onChange={(e) => updateExperience(exp.id!, "description", e.target.value)}
                  placeholder="Describe your role..."
                  className="bg-input min-h-[100px] resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
             <Button
  onClick={() => saveExperiences(exp)}
  // هنا بنقوله: لو فيه عملية حفظ شغالة "و" الـ ID اللي بيتحفظ هو نفس الـ ID بتاع الكارت ده بس
  disabled={saveMutation.isPending && saveMutation.variables?.id === exp.id}
  size="sm"
>
  {saveMutation.isPending && saveMutation.variables?.id === exp.id ? "Saving..." : "Save"}
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
    {/* Header Section */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-3xl font-bold text-foreground">
          My <span className="text-[#1ca37b]">Projects</span>
        </h2>
      </div>
      
      {/* زرار الإضافة يستخدم حالة isAdding الخاصة به فقط */}
      <Button 
        onClick={() => addProject()} 
        disabled={isAdding} 
        variant="outline"
      >
        <Plus className="mr-2 h-4 w-4" /> 
        {isAdding ? "Adding..." : "Add Project"}
      </Button>
    </div>

    {/* Projects Content */}
    {isLoading ? (
      <div className="text-center py-12">Loading Projects...</div>
    ) : projects.length === 0 ? (
      <div className="rounded-xl bg-card p-12 text-center shadow-card border border-border/50">
        <FolderGit2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
          No projects added yet
        </h3>
        <p className="mt-2 text-muted-foreground">
          Showcase your work by adding your projects.
        </p>
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((proj) => (
          /* نادينا الكومبوننت الجديد هنا 
             كل كارد دلوقتي مسؤول عن الـ Mutations والـ Loading بتاعه
          */
          <ProjectCard key={proj.id} project={proj} />
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


        </>
  )}
      </main>





      <Footer />
    </div>
  );
};

export default Profile;
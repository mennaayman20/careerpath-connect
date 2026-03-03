// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// import { ProjectsSection } from "@/components/ui/projectsSection";
// import { SkillsSection } from "@/components/ui/skillsection";
// import { SocialLinksSection } from "@/components/ui/socialLinkSection";
// import { ExperienceSection } from "@/components/ui/experiencesection";

// const Profile = () => {
//   return (
//     <div className="flex min-h-screen flex-col bg-background">
//       <Navbar />
      
//       <main className="container max-w-4xl flex-1 py-10 space-y-8">
//         {/* Header القسم العلوي */}
//         <div>
//           <h1 className="text-4xl font-bold tracking-tight">Profile Builder</h1>
//           <p className="text-muted-foreground mt-2">
//             Keep your professional information up to date.
//           </p>
//         </div>

//         {/* تقسيم المكونات بشكل منظم */}
//         <div className="grid gap-8">
//           {/* هنا ممكن تضيفي الـ Personal Info اللي كنتِ عاملاها */}
//           <ExperienceSection />
//           <ProjectsSection />
          
//           <div className="grid md:grid-cols-2 gap-8">
//             <SkillsSection />
//             <SocialLinksSection />
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Profile;









import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialLinkRequest , UserProfile , ProjectRequest , SkillRequest , ExperienceRequest } from "@/types/profile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Trash2, User, Link as LinkIcon, FolderGit2, Briefcase, Code2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userProfileService} from "@/services/userService";
import { id } from "node_modules/date-fns/locale/id";
import { useExperience } from "@/hooks/useExperience";
import { useProject } from "@/hooks/useProjects";
import { useSocialLinks } from "@/hooks/useSocial";
import { useSkills } from "@/hooks/useSkills";




const socialPlatforms = ["LINKEDIN", "GITHUB", "PORTFOLIO", "DRIBBLE", "BEHANCE", "MEDIUM", "DISCORD", "GITLAB", "OTHER"];
const skillCategories = ["Frontend", "Backend", "DevOps", "Design", "Data Science", "Mobile", "Other"];

const Profile = () => {
  const { toast } = useToast();
  const [personal, setPersonal] = useState({ firstName: "", lastName: "", university: "" });

 
 
  const [newSkill, setNewSkill] = useState({ category: "Frontend", skillName: "" });



const { experiences, addExperience , updateExperience, removeExperience , validateExperiences , saveExperiences, isInvalid , errors , isLoading} = useExperience();
const {projects , addProject , updateProject , removeProject , saveProjects  , isInvalidate, isLoading: isProjectsLoading} = useProject();
const { links, updateLink, saveSocialLinks, isLoading: isLinksLoading , removeSocialLink , addSocialLink , validateSocialLinks , isInvalidSocial} = useSocialLinks();
const { skills , isLoading: isSkillsLoading ,handleAddSkill, handleRemoveSkill } = useSkills();
const [newSkillName, setNewSkillName] = useState("");




// useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [expsData, projsData, socialsData , skillsData] = await Promise.all([
//           userProfileService.getUserExperience(),
//           userProfileService.getUserProjects(),
//           userProfileService.getUserSocialLinks(),
//           userProfileService.getUserSkills()

          
//         ]);
//         setExperiences(expsData);
//         setProjects(projsData);
//         setSocials(socialsData);
//         setSkills(skillsData);

//       } catch (error) {
//         toast({ variant: "destructive", title: "Fetch Error", description: "Failed to load profile data." });
//       }
//     };
//     fetchData();
//   }, []);

// // 2. دوال الـ Social Links
//   const addSocial = async () => {
//   try {
//     // السيرفر هيرجع Object فيه الـ ID الجديد
//     const newLink = await userProfileService.addUserSocialLink({ socialType: "GITHUB", url: "" });
//     setSocials([...socials, newLink]); 
//     toast({ title: "Added", description: "Empty social link created." });
//   } catch (error) {
//     toast({ variant: "destructive", title: "Error", description: "Could not add social link." });
//   }
// };

//  const updateSocial = async (socialId: number, field: "url" | "socialType", value: string) => {
//   const link = socials.find(s => s.id === socialId);
//   if (!link) return;
//   const updated = { ...link, [field]: value };
//   try {
//     await userProfileService.updateUserSocialLink(socialId, {
//       url: updated.url,
//       socialType: updated.socialType
//     });
//     setSocials(socials.map(s => s.id === socialId ? updated : s));
//   } catch (error) { 
//     toast({ variant: "destructive", title: "Update Failed" }); 
//   }
// };

//   const removeSocial = async (id: number) => {
//     try {
//       await userProfileService.deleteUserSocialLink(id); // بنحذف بالـ ID الحقيقي
//       setSocials(socials.filter(s => s.id !== id));
//       toast({ title: "Deleted", description: "Link removed successfully." });
//     } catch (error) {
//       toast({ variant: "destructive", title: "Error" });
//     }
//   };

  // 3. دوال الـ Experience
  // const addExperience = async () => {
  //   try {
  //     // بنبعت بيانات وهمية "إلزامية" عشان السيرفر يقبل الـ Create
  //     const newExp = await userProfileService.addUserExperience({
  //       title: "New Role",
  //       organization: "Company",
  //       startDate: new Date().toISOString().split('T')[0],
  //       endDate: "",
  //       description: "Description"
  //     });
  //     setExperiences([...experiences, { ...newExp, organization: newExp.organization }]);
  //   } catch (error) {
  //     toast({ variant: "destructive", title: "Error", description: "Could not add experience." });
  //   }
  // };

  // const updateExperience = async (id: number, field: string, value: string) => {
  //   const exp = experiences.find(e => e.id === id);
  //   if (!exp) return;
  //   const updated = { ...exp, [field]: value };
  //   try {
  //     await userProfileService.updateUserExperience(id, {
  //       title: updated.title,
  //       organization: updated.organization, // التأكد من مسمى organization
  //       startDate: updated.startDate,
  //       endDate: updated.endDate,
  //       description: updated.description
  //     });
  //     setExperiences(experiences.map(e => e.id === id ? updated : e));
  //   } catch (error) {
  //     toast({ variant: "destructive", title: "Update Failed" });
  //   }
  // };

  // const removeExperience = async (id: number) => {
  //   try {
  //     await userProfileService.deleteUserExperience(id);
  //     setExperiences(experiences.filter(e => e.id !== id));
  //     toast({ title: "Deleted" });
  //   } catch (error) {
  //     toast({ variant: "destructive", title: "Delete Failed" });
  //   }
  // };





  // 4. دوال الـ Projects
//   const addProject = async () => {
//     try {
//       const newProj = await userProfileService.addUserProject({
//         title: "New Project",
//         description: "Project Description",
//         startDate: new Date().toISOString().split('T')[0],
//         projectUrl: "", // مسمى الباك-أند
//         endDate: "",
//         technologies: ""
//       });
//       setProjects([...projects, { ...newProj, projectUrl: newProj.projectUrl }]);
//     } catch (error) {
//       toast({ variant: "destructive", title: "Error" });
//     }
//   };

//   const updateProject = async (projectId: number, field: string, value: string | string[]) => {
//   const proj = projects.find(p => p.id === projectId);
//   if (!proj) return;
//   const updated = { ...proj, [field]: value };
//   try {
//     await userProfileService.updateUserProject(projectId, {
//       title: updated.title,
//       description: updated.description,
//       projectUrl: updated.projectUrl, // الاسم الموحد
//       startDate: updated.startDate,
//       endDate: updated.endDate,
//       // السيرفر مستنيها string مفصول بفاصلة
//       technologies: Array.isArray(updated.technologies) ? updated.technologies.join(',') : updated.technologies
//     });
//     setProjects(projects.map(p => p.id === projectId ? updated : p));
//   } catch (error) { toast({ variant: "destructive", title: "Update Failed" }); }
// };

//   const removeProject = async (id: number) => {
//     try {
//       await userProfileService.deleteUserProject(id);
//       setProjects(projects.filter(p => p.id !== id));
//       toast({ title: "Deleted" });
//     } catch (error) {
//       toast({ variant: "destructive", title: "Delete Failed" });
//     }
//   };

//   const addSkill = () => {
//   if (!newSkill.skillName.trim()) return;
//   userProfileService.addSkillByName({ skillName: newSkill.skillName }) //
//     .then((created: Skill) => {
//       setSkills([...skills, created]); // السيرفر هيرجع الـ ID الجديد
//       setNewSkill({ ...newSkill, skillName: "" });
//     }).catch(() => toast({ variant: "destructive", title: "Error" }));
// };

//  const removeSkill = (skillId: number) => {
//   userProfileService.deleteUserSkill(skillId) //
//     .then(() => {
//       setSkills(skills.filter(s => s.id !== skillId));
//       toast({ title: "Deleted" });
//     }).catch(() => toast({ variant: "destructive", title: "Delete Failed" }));
// };

 

  const save = () => toast({ title: "Profile Saved", description: "Your profile has been updated successfully." });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="container max-w-3xl flex-1 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Profile Builder</h1>
        <p className="mb-8 text-muted-foreground">Build your professional profile step by step</p>

        {/* Personal Info */}
        <section className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-foreground">
            <User className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold">Personal Information</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>First Name</Label><Input className="mt-1" value={personal.firstName} onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })} /></div>
            <div><Label>Last Name</Label><Input className="mt-1" value={personal.lastName} onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>University (Optional)</Label><Input className="mt-1" value={personal.university} onChange={(e) => setPersonal({ ...personal, university: e.target.value })} /></div>
          </div>
        </section>

        {/* Social Links */}
<section className="mb-8 rounded-xl border border-border bg-card p-6">
  {/* الهيدر */}
  <div className="mb-4 flex items-center justify-between">
    <div className="flex items-center gap-2 text-foreground">
      <LinkIcon className="h-5 w-5 text-primary" />
      <h2 className="font-display text-lg font-semibold">Social Links</h2>
    </div>
    {/* زرار الـ Add لو حابة تضيفي لينك جديد يدوي */}
    <Button variant="outline" size="sm" onClick={addSocialLink}>
      <Plus className="mr-1 h-4 w-4" /> Add Link
    </Button>
  </div>

  <div className="space-y-4">
    {links.map((link) => (
      <div key={link.id} className="rounded-lg border border-border p-4 bg-muted/30">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-primary uppercase">
            {link.socialType}
          </span>
          {/* زرار الحذف مربوط بالـ ID */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => removeSocialLink(link.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        <div className="grid gap-3">
         <div>
  <Label>Platform Type</Label>
  <Select 
    value={link.socialType} 
    onValueChange={(value) => updateLink(link.id, "socialType", value)}
  >
    <SelectTrigger className="mt-1 w-full">
      <SelectValue placeholder="Select Platform" />
    </SelectTrigger>
    <SelectContent>
      {/* القائمة اللي في صورة الباك-أند بالظبط */}
      <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
      <SelectItem value="GITHUB">GitHub</SelectItem>
      <SelectItem value="BEHANCE">Behance</SelectItem>
      <SelectItem value="DRIBBLE">Dribbble</SelectItem>
      <SelectItem value="PORTFOLIO">Portfolio</SelectItem>
      <SelectItem value="MEDIUM">Medium</SelectItem>
      <SelectItem value="DISCORD">Discord</SelectItem>
      <SelectItem value="STACKOVERFLOW">StackOverflow</SelectItem>
      <SelectItem value="GITLAB">GitLab</SelectItem>
      <SelectItem value="TWITTER">Twitter</SelectItem>
      <SelectItem value="FACEBOOK">Facebook</SelectItem>
      <SelectItem value="INSTAGRAM">Instagram</SelectItem>
      
      <SelectItem value="OTHER">Other</SelectItem>
      {/* ضيفي الباقي بنفس الطريقة */}
    </SelectContent>
  </Select>
</div>

          <div>
            <Label>Profile URL</Label>
            <Input 
              className={`mt-1 ${errors[`url-${link.id}`] ? "border-destructive" : ""}`}
              value={link.url || ""} 
              onChange={(e) => updateLink(link.id, "url", e.target.value)} 
              placeholder="https://..."
            />
            {/* إظهار خطأ الـ Validation لو اللينك مش بادئ بـ http */}
            {errors[`url-${link.id}`] && (
              <p className="text-xs text-destructive mt-1">{errors[`url-${link.id}`]}</p>
            )}
          
          
          </div>
        
        <Button 
  className="gradient-primary border-0 mt-4" 
  size="lg" 
  onClick={() => saveSocialLinks(link.id, link.socialType || "OTHER", link.url || "")}
   // هنا السحر كله بيحصل
disabled={isLoading || !link.url?.trim()}
>
{isLoading ? "Saving..." : "Save Social Link"}
</Button>
        
        </div>
      </div>
    ))}
  </div>

  {links.length === 0 && (
    <p className="text-sm text-muted-foreground text-center py-4">No social links added yet.</p>
  )}
</section>

        {/* Projects */}
<section className="mb-8 rounded-xl border border-border bg-card p-6">
  <div className="mb-4 flex items-center justify-between">
    <div className="flex items-center gap-2 text-foreground">
      <FolderGit2 className="h-5 w-5 text-primary" />
      <h2 className="font-display text-lg font-semibold">Projects</h2>
    </div>
    <Button variant="outline" size="sm" onClick={addProject}>
      <Plus className="mr-1 h-4 w-4" /> Add
    </Button>
  </div>

  {projects.map((proj) => (
    <div key={proj.id} className="mb-4 rounded-lg border border-border p-4">
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-medium text-foreground">Project {proj.id}</span>
        <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Project Title</Label>
          <Input className="mt-1" value={proj.title || ""} onChange={(e) => updateProject(proj.id, "title", e.target.value)} />
        </div>
        <div>
          <Label>Project URL</Label>
          <Input className="mt-1" value={proj.projectUrl || ""} onChange={(e) => updateProject(proj.id, "projectUrl", e.target.value)} />
        </div>
        <div>
          <Label>Technologies</Label>
          <Input className="mt-1" placeholder="React, Node.js..." value={proj.technologies || ""} onChange={(e) => updateProject(proj.id, "technologies", e.target.value)} />
        </div>
        <div>
          <Label>Start Date</Label>
          <Input className="mt-1" type="date" value={proj.startDate || ""} onChange={(e) => updateProject(proj.id, "startDate", e.target.value)} />
        </div>
        <div>
          <Label>End Date</Label>
          <Input className="mt-1" type="date" value={proj.endDate || ""} onChange={(e) => updateProject(proj.id, "endDate", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Description</Label>
          <Textarea className="mt-1" value={proj.description || ""} onChange={(e) => updateProject(proj.id, "description", e.target.value)} />
        </div>
                  <Button 
      className="gradient-primary border-0 mt-4" 
      size="lg" 
      // بنباصي الـ project الحالي اللي الـ map واقفة عنده
      onClick={() => saveProjects(proj)}
      
      // الزرار هيكون disabled لو البروجكت ده بس بياناته ناقصة
      disabled={
        isLoading || 
        !proj.title?.trim() || 
        !proj.description?.trim() ||
        !proj.startDate // تقدري تضيفي أي شروط تانية هنا
      }
    >
      {isLoading ? "Saving..." : "Save This Project"}
    </Button>
      
      </div>
    </div>
  ))}

  
  {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects added yet.</p>}
  
</section>

        {/* Experience */}
        <section className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Experience</h2>
            </div>
            <Button variant="outline" size="sm" onClick={addExperience}><Plus className="mr-1 h-4 w-4" /> Add</Button>
          </div>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-4 rounded-lg border border-border p-4">
              <div className="mb-2 flex justify-between"><span className="text-sm font-medium text-foreground">Experience {exp.id}</span><Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Job Title</Label><Input className="mt-1" value={exp.title || ""} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} /></div>
                <div><Label>Organization</Label><Input className="mt-1" value={exp.organization || ""} onChange={(e) => updateExperience(exp.id, "organization", e.target.value)} /></div>
                <div><Label>Start Date</Label><Input className="mt-1" type="date" value={exp.startDate || ""} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} /></div>
                <div><Label>End Date</Label><Input className="mt-1" type="date" value={exp.endDate || ""} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} /></div>
                <div className="sm:col-span-2"><Label>Description</Label><Textarea className="mt-1" value={exp.description || ""} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} /></div>
              </div>
            <Button 
      className="gradient-primary border-0 mt-4" 
      size="lg" 
      // بنمرر الـ exp الحالي للدالة
      onClick={() => saveExperiences(exp)}
      
      // الزرار هيكون disabled لو البيانات الأساسية للخبرة دي ناقصة
      disabled={
        isLoading || 
        !exp.title?.trim() || 
        !exp.organization?.trim() ||
        !exp.startDate
      }
    >
      {isLoading ? "Saving..." : `Save ${exp.organization || 'Experience'}`}
    </Button>
            </div>
          ))}
          {experiences.length === 0 && <p className="text-sm text-muted-foreground">No experience added yet.</p>}
        
        
        
        </section>

        {/* Skills */}
        <section className="mb-8 rounded-xl border border-border bg-card p-6">
  <div className="mb-4 flex items-center gap-2 text-foreground">
    <Code2 className="h-5 w-5 text-primary" />
    <h2 className="font-display text-lg font-semibold">Skills</h2>
  </div>

  <div className="mb-3 flex gap-2">
    {/* لو السيرفر مش مستني Category، الـ Select ده ممكن نستخدمه عشان اليوزر ينظم كتابته بس */}
    <Select 
      value={newSkill.category} 
      onValueChange={(v) => setNewSkill({ ...newSkill, category: v })}
    >
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        {skillCategories.map((c) => (
          <SelectItem key={c} value={c}>{c}</SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Input 
      placeholder="Skill name" 
      value={newSkill.skillName} 
      onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })} 
      // نربط مع handleAddSkill من الهوك
      onKeyDown={(e) => e.key === "Enter" && (handleAddSkill(newSkill.skillName), setNewSkill({ ...newSkill, skillName: "" }))} 
    />
    
    <Button 
      variant="outline" 
      onClick={() => {
        handleAddSkill(newSkill.skillName);
        setNewSkill({ ...newSkill, skillName: "" });
      }}
      disabled={isLoading || !newSkill.skillName.trim()}
    >
      {isLoading ? "..." : <Plus className="h-4 w-4" />}
    </Button>
  </div>

  <div className="flex flex-wrap gap-2">
    {skills.map((s) => (
      // نستخدم s.skillId لأنه المسمى اللي راجع من الـ API بتاعك
      <Badge key={s.skillId} variant="secondary" className="gap-1 pr-1 py-1.5">
        {s.skillName}
        <button 
          onClick={() => handleRemoveSkill(s.skillId)} 
          className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    ))}
    
    {skills.length === 0 && !isLoading && (
      <p className="text-sm text-muted-foreground">No skills added yet.</p>
    )}
  </div>
</section>

        <Button className="gradient-primary border-0" size="lg" onClick={save}>Save Profile</Button>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

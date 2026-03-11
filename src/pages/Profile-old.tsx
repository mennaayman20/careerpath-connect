//الاصلي اللي فالاول خالص 
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { SocialLinkRequest , personal , ProjectRequest , SkillRequest , ExperienceRequest } from "@/types/profile";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { Plus, Trash2, User, Link as LinkIcon, FolderGit2, Briefcase, Code2, X } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { userProfileService} from "@/services/userService";
// import { id } from "node_modules/date-fns/locale/id";
// import { useExperience } from "@/hooks/useExperience";
// import { useProject } from "@/hooks/useProjects";
// import { useSocialLinks } from "@/hooks/useSocial";
// import { useSkills } from "@/hooks/useSkills";
// import { useProfileManager } from "@/hooks/usePersonalInfo";
// import { ResumeSection } from "@/features/resume/components/ResumeSection";

// const socialPlatforms = ["LINKEDIN", "GITHUB", "PORTFOLIO", "DRIBBLE", "BEHANCE", "MEDIUM", "DISCORD", "GITLAB", "OTHER"];
// const skillCategories = ["Frontend", "Backend", "DevOps", "Design", "Data Science", "Mobile", "Other"];

// const Profile = () => {
//   const { toast } = useToast();
// const { personal, setPersonal, loading, handleSave } = useProfileManager();
 
 
//   const [newSkill, setNewSkill] = useState({ category: "Frontend", skillName: "" });



// const { experiences, addExperience , updateExperience, removeExperience , validateExperiences , saveExperiences, isInvalid , errors , isLoading} = useExperience();
// const {projects , addProject , updateProject , removeProject , saveProjects  , isInvalidate, isLoading: isProjectsLoading} = useProject();
// const { links, updateLink, saveSocialLinks, isLoading: isLinksLoading , removeSocialLink , addSocialLink , validateSocialLinks , isInvalidSocial} = useSocialLinks();
// const { skills , isLoading: isSkillsLoading ,handleAddSkill, handleRemoveSkill } = useSkills();
// const [newSkillName, setNewSkillName] = useState("");




//   const save = () => toast({ title: "Profile Saved", description: "Your profile has been updated successfully." });

//   return (
//     <div className="flex min-h-screen flex-col bg-background">
//       <Navbar />
//       <div className="container max-w-3xl flex-1 py-8">
//         <h1 className="font-display text-3xl font-bold text-foreground">Profile Builder</h1>
//         <p className="mb-8 text-muted-foreground">Build your professional profile step by step</p>

//         {/* Personal Info */}
//      <section className="mb-8 rounded-xl border border-border bg-card p-6">
//       <div className="mb-4 flex items-center gap-2 text-foreground">
//         <User className="h-5 w-5 text-primary" />
//         <h2 className="font-display text-lg font-semibold">Personal Information</h2>
//       </div>
      
//       <div className="grid gap-4 sm:grid-cols-2">
//         <div>
//           <Label>First Name</Label>
//           <Input 
//             className="mt-1" 
//             value={personal.firstName} 
//             onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })} 
//           />
//         </div>
//         <div>
//           <Label>Last Name</Label>
//           <Input 
//             className="mt-1" 
//             value={personal.lastName} 
//             onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })} 
//           />
//         </div>
//         <div className="sm:col-span-2">
//           <Label>University (Optional)</Label>
//           <Input 
//             className="mt-1" 
//             value={personal.university} 
//             onChange={(e) => setPersonal({ ...personal, university: e.target.value })} 
//           />
//         </div>
//       </div>
//       <Button 
//   className="gradient-primary border-0 mt-4" 
//   size="lg" 
//   onClick={handleSave}
// >
// save changes
// </Button>
      
//     </section>

//         {/* Social Links */}
// <section className="mb-8 rounded-xl border border-border bg-card p-6">
//   {/* الهيدر */}
//   <div className="mb-4 flex items-center justify-between">
//     <div className="flex items-center gap-2 text-foreground">
//       <LinkIcon className="h-5 w-5 text-primary" />
//       <h2 className="font-display text-lg font-semibold">Social Links</h2>
//     </div>
//     {/* زرار الـ Add لو حابة تضيفي لينك جديد يدوي */}
//     <Button variant="outline" size="sm" onClick={addSocialLink}>
//       <Plus className="mr-1 h-4 w-4" /> Add Link
//     </Button>
//   </div>

//   <div className="space-y-4">
//     {links.map((link) => (
//       <div key={link.id} className="rounded-lg border border-border p-4 bg-muted/30">
//         <div className="flex justify-between items-center mb-3">
//           <span className="text-sm font-bold text-primary uppercase">
//             {link.socialType}
//           </span>
//           {/* زرار الحذف مربوط بالـ ID */}
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             onClick={() => removeSocialLink(link.id)}
//           >
//             <Trash2 className="h-4 w-4 text-destructive" />
//           </Button>
//         </div>

//         <div className="grid gap-3">
//          <div>
//   <Label>Platform Type</Label>
//   <Select 
//     value={link.socialType} 
//     onValueChange={(value) => updateLink(link.id, "socialType", value)}
//   >
//     <SelectTrigger className="mt-1 w-full">
//       <SelectValue placeholder="Select Platform" />
//     </SelectTrigger>
//     <SelectContent>
//       {/* القائمة اللي في صورة الباك-أند بالظبط */}
//       <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
//       <SelectItem value="GITHUB">GitHub</SelectItem>
//       <SelectItem value="BEHANCE">Behance</SelectItem>
//       <SelectItem value="DRIBBLE">Dribbble</SelectItem>
//       <SelectItem value="PORTFOLIO">Portfolio</SelectItem>
//       <SelectItem value="MEDIUM">Medium</SelectItem>
//       <SelectItem value="DISCORD">Discord</SelectItem>
//       <SelectItem value="STACKOVERFLOW">StackOverflow</SelectItem>
//       <SelectItem value="GITLAB">GitLab</SelectItem>
//       <SelectItem value="TWITTER">Twitter</SelectItem>
//       <SelectItem value="FACEBOOK">Facebook</SelectItem>
//       <SelectItem value="INSTAGRAM">Instagram</SelectItem>
      
//       <SelectItem value="OTHER">Other</SelectItem>
//       {/* ضيفي الباقي بنفس الطريقة */}
//     </SelectContent>
//   </Select>
// </div>

//           <div>
//             <Label>Profile URL</Label>
//             <Input 
//               className={`mt-1 ${errors[`url-${link.id}`] ? "border-destructive" : ""}`}
//               value={link.url || ""} 
//               onChange={(e) => updateLink(link.id, "url", e.target.value)} 
//               placeholder="https://..."
//             />
//             {/* إظهار خطأ الـ Validation لو اللينك مش بادئ بـ http */}
//             {errors[`url-${link.id}`] && (
//               <p className="text-xs text-destructive mt-1">{errors[`url-${link.id}`]}</p>
//             )}
          
          
//           </div>
        
//         <Button 
//   className="gradient-primary border-0 mt-4" 
//   size="lg" 
//   onClick={() => saveSocialLinks(link.id, link.socialType || "OTHER", link.url || "")}
//    // هنا السحر كله بيحصل
// disabled={isLoading || !link.url?.trim()}
// >
// {isLoading ? "Saving..." : "Save Social Link"}
// </Button>
        
//         </div>
//       </div>
//     ))}
//   </div>

//   {links.length === 0 && (
//     <p className="text-sm text-muted-foreground text-center py-4">No social links added yet.</p>
//   )}
// </section>

//         {/* Projects */}
// <section className="mb-8 rounded-xl border border-border bg-card p-6">
//   <div className="mb-4 flex items-center justify-between">
//     <div className="flex items-center gap-2 text-foreground">
//       <FolderGit2 className="h-5 w-5 text-primary" />
//       <h2 className="font-display text-lg font-semibold">Projects</h2>
//     </div>
//     <Button variant="outline" size="sm" onClick={addProject}>
//       <Plus className="mr-1 h-4 w-4" /> Add
//     </Button>
//   </div>

//   {projects.map((proj) => (
//     <div key={proj.id} className="mb-4 rounded-lg border border-border p-4">
//       <div className="mb-2 flex justify-between">
//         <span className="text-sm font-medium text-foreground">Project {proj.id}</span>
//         <Button variant="ghost" size="icon" onClick={() => removeProject(proj.id)}>
//           <Trash2 className="h-4 w-4 text-destructive" />
//         </Button>
//       </div>

//       <div className="grid gap-3 sm:grid-cols-2">
//         <div className="sm:col-span-2">
//           <Label>Project Title</Label>
//           <Input className="mt-1" value={proj.title || ""} onChange={(e) => updateProject(proj.id, "title", e.target.value)} />
//         </div>
//         <div>
//           <Label>Project URL</Label>
//           <Input className="mt-1" value={proj.projectUrl || ""} onChange={(e) => updateProject(proj.id, "projectUrl", e.target.value)} />
//         </div>
//         <div>
//           <Label>Technologies</Label>
//           <Input className="mt-1" placeholder="React, Node.js..." value={proj.technologies || ""} onChange={(e) => updateProject(proj.id, "technologies", e.target.value)} />
//         </div>
//         <div>
//           <Label>Start Date</Label>
//           <Input className="mt-1" type="date" value={proj.startDate || ""} onChange={(e) => updateProject(proj.id, "startDate", e.target.value)} />
//         </div>
//         <div>
//           <Label>End Date</Label>
//           <Input className="mt-1" type="date" value={proj.endDate || ""} onChange={(e) => updateProject(proj.id, "endDate", e.target.value)} />
//         </div>
//         <div className="sm:col-span-2">
//           <Label>Description</Label>
//           <Textarea className="mt-1" value={proj.description || ""} onChange={(e) => updateProject(proj.id, "description", e.target.value)} />
//         </div>
//                   <Button 
//       className="gradient-primary border-0 mt-4" 
//       size="lg" 
//       // بنباصي الـ project الحالي اللي الـ map واقفة عنده
//       onClick={() => saveProjects(proj)}
      
//       // الزرار هيكون disabled لو البروجكت ده بس بياناته ناقصة
//       disabled={
//         isLoading || 
//         !proj.title?.trim() || 
//         !proj.description?.trim() ||
//         !proj.startDate // تقدري تضيفي أي شروط تانية هنا
//       }
//     >
//       {isLoading ? "Saving..." : "Save This Project"}
//     </Button>
      
//       </div>
//     </div>
//   ))}

  
//   {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects added yet.</p>}
  
// </section>

//         {/* Experience */}
//         <section className="mb-8 rounded-xl border border-border bg-card p-6">
//           <div className="mb-4 flex items-center justify-between">
//             <div className="flex items-center gap-2 text-foreground">
//               <Briefcase className="h-5 w-5 text-primary" />
//               <h2 className="font-display text-lg font-semibold">Experience</h2>
//             </div>
//             <Button variant="outline" size="sm" onClick={addExperience}><Plus className="mr-1 h-4 w-4" /> Add</Button>
//           </div>
//           {experiences.map((exp) => (
//             <div key={exp.id} className="mb-4 rounded-lg border border-border p-4">
//               <div className="mb-2 flex justify-between"><span className="text-sm font-medium text-foreground">Experience {exp.id}</span><Button variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
//               <div className="grid gap-3 sm:grid-cols-2">
//                 <div><Label>Job Title</Label><Input className="mt-1" value={exp.title || ""} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} /></div>
//                 <div><Label>Organization</Label><Input className="mt-1" value={exp.organization || ""} onChange={(e) => updateExperience(exp.id, "organization", e.target.value)} /></div>
//                 <div><Label>Start Date</Label><Input className="mt-1" type="date" value={exp.startDate || ""} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} /></div>
//                 <div><Label>End Date</Label><Input className="mt-1" type="date" value={exp.endDate || ""} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} /></div>
//                 <div className="sm:col-span-2"><Label>Description</Label><Textarea className="mt-1" value={exp.description || ""} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} /></div>
//               </div>
//             <Button 
//       className="gradient-primary border-0 mt-4" 
//       size="lg" 
//       // بنمرر الـ exp الحالي للدالة
//       onClick={() => saveExperiences(exp)}
      
//       // الزرار هيكون disabled لو البيانات الأساسية للخبرة دي ناقصة
//       disabled={
//         isLoading || 
//         !exp.title?.trim() || 
//         !exp.organization?.trim() ||
//         !exp.startDate
//       }
//     >
//       {isLoading ? "Saving..." : "Save Experience"}
//     </Button>
//             </div>
//           ))}
//           {experiences.length === 0 && <p className="text-sm text-muted-foreground">No experience added yet.</p>}
        
        
        
//         </section>

//         {/* Skills */}
//         <section className="mb-8 rounded-xl border border-border bg-card p-6">
//   <div className="mb-4 flex items-center gap-2 text-foreground">
//     <Code2 className="h-5 w-5 text-primary" />
//     <h2 className="font-display text-lg font-semibold">Skills</h2>
//   </div>

//   <div className="mb-3 flex gap-2">
//     {/* لو السيرفر مش مستني Category، الـ Select ده ممكن نستخدمه عشان اليوزر ينظم كتابته بس */}
//     <Select 
//       value={newSkill.category} 
//       onValueChange={(v) => setNewSkill({ ...newSkill, category: v })}
//     >
//       <SelectTrigger className="w-36">
//         <SelectValue placeholder="Category" />
//       </SelectTrigger>
//       <SelectContent>
//         {skillCategories.map((c) => (
//           <SelectItem key={c} value={c}>{c}</SelectItem>
//         ))}
//       </SelectContent>
//     </Select>

//     <Input 
//       placeholder="Skill name" 
//       value={newSkill.skillName} 
//       onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })} 
//       // نربط مع handleAddSkill من الهوك
//       onKeyDown={(e) => e.key === "Enter" && (handleAddSkill(newSkill.skillName), setNewSkill({ ...newSkill, skillName: "" }))} 
//     />
    
//     <Button 
//       variant="outline" 
//       onClick={() => {
//         handleAddSkill(newSkill.skillName);
//         setNewSkill({ ...newSkill, skillName: "" });
//       }}
//       disabled={isLoading || !newSkill.skillName.trim()}
//     >
//       {isLoading ? "..." : <Plus className="h-4 w-4" />}
//     </Button>
//   </div>

//   <div className="flex flex-wrap gap-2">
//     {skills.map((s) => (
//       // نستخدم s.skillId لأنه المسمى اللي راجع من الـ API بتاعك
//       <Badge key={s.skillId} variant="secondary" className="gap-1 pr-1 py-1.5">
//         {s.skillName}
//         <button 
//           onClick={() => handleRemoveSkill(s.skillId)} 
//           className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
//         >
//           <X className="h-3 w-3" />
//         </button>
//       </Badge>
//     ))}
    
//     {skills.length === 0 && !isLoading && (
//       <p className="text-sm text-muted-foreground">No skills added yet.</p>
//     )}
//   </div>
// </section>

//         {/* Resume Section */}
//         <ResumeSection />
        

//         <Button className="gradient-primary border-0" size="lg" onClick={save}>Save Profile</Button>
//       </div>
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
import { SocialLinkRequest, personal, ProjectRequest, SkillRequest, ExperienceRequest } from "@/types/profile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Plus, Trash2, User, Link as LinkIcon, FolderGit2, Briefcase, Code2, X,
  Mail, Phone, Twitter, Github, Linkedin, Globe, ExternalLink, Save,
  ChevronRight, Star, Download
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

// Skill progress levels (visual only, can be mapped from real data)
const skillProgressMap: Record<string, number> = {
  Frontend: 95, Backend: 88, DevOps: 78, Design: 92, "Data Science": 80, Mobile: 85, Other: 75,
};

const Profile = () => {
  const { toast } = useToast();
  const { personal, setPersonal, loading, handleSave } = useProfileManager();
  const [newSkill, setNewSkill] = useState({ category: "Frontend", skillName: "" });
  const [activeSection, setActiveSection] = useState("personal");

  const { experiences, addExperience, updateExperience, removeExperience, validateExperiences, saveExperiences, isInvalid, errors, isLoading } = useExperience();
  const { projects, addProject, updateProject, removeProject, saveProjects, isInvalidate, isLoading: isProjectsLoading } = useProject();
  const { links, updateLink, saveSocialLinks, isLoading: isLinksLoading, removeSocialLink, addSocialLink, validateSocialLinks, isInvalidSocial } = useSocialLinks();
  const { skills, isLoading: isSkillsLoading, handleAddSkill, handleRemoveSkill } = useSkills();

  const save = () => toast({ title: "Profile Saved", description: "Your profile has been updated successfully." });

  const navItems = [
    { id: "personal", label: "About Me", icon: User },
    { id: "social", label: "Social Links", icon: LinkIcon },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: FolderGit2 },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0d0d", fontFamily: "'Syne', 'DM Sans', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        
        :root {
          --orange: #ff6b35;
          --orange-light: #ff8c5a;
          --dark: #0d0d0d;
          --card: #141414;
          --card2: #1a1a1a;
          --border: #2a2a2a;
          --text: #e8e8e8;
          --muted: #888;
        }

        * { box-sizing: border-box; }

        .orange-btn {
          background: var(--orange);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 10px 24px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .orange-btn:hover { background: var(--orange-light); transform: translateY(-1px); }
        .orange-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .outline-btn {
          background: transparent;
          color: var(--orange);
          border: 1.5px solid var(--orange);
          border-radius: 50px;
          padding: 9px 22px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .outline-btn:hover { background: var(--orange); color: white; }

        .skill-bar-track {
          background: #2a2a2a;
          border-radius: 50px;
          height: 6px;
          overflow: hidden;
          margin-top: 8px;
        }
        .skill-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--orange), var(--orange-light));
          border-radius: 50px;
          transition: width 1s ease;
        }

        .profile-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          transition: border-color 0.3s;
        }
        .profile-card:hover { border-color: #3a3a3a; }

        .section-tag {
          display: inline-block;
          background: rgba(255,107,53,0.15);
          color: var(--orange);
          border: 1px solid rgba(255,107,53,0.3);
          border-radius: 50px;
          padding: 4px 16px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          margin-bottom: 12px;
        }

        .nav-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          border: 1.5px solid transparent;
          color: var(--muted);
          background: transparent;
        }
        .nav-pill:hover { color: var(--text); border-color: var(--border); }
        .nav-pill.active { background: var(--orange); color: white; border-color: var(--orange); }

        .dark-input {
          background: #1e1e1e !important;
          border: 1px solid var(--border) !important;
          color: var(--text) !important;
          border-radius: 10px !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .dark-input:focus { border-color: var(--orange) !important; outline: none !important; box-shadow: 0 0 0 2px rgba(255,107,53,0.15) !important; }
        .dark-input::placeholder { color: #555 !important; }

        .dark-label {
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 6px;
          display: block;
        }

        .project-card {
          background: var(--card2);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .project-card:hover { border-color: var(--orange); transform: translateY(-3px); }

        .exp-card {
          background: var(--card2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 16px;
          transition: border-color 0.3s;
        }
        .exp-card:hover { border-color: #3a3a3a; }

        .skill-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1e1e1e;
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 50px;
          padding: 6px 14px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s;
        }
        .skill-badge:hover { border-color: var(--orange); }

        .orange-dot {
          width: 8px; height: 8px;
          background: var(--orange);
          border-radius: 50%;
          display: inline-block;
        }

        .hero-avatar-ring {
          width: 140px; height: 140px;
          border-radius: 50%;
          border: 3px solid var(--orange);
          padding: 4px;
          background: var(--card2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .hero-avatar-ring::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px dashed rgba(255,107,53,0.3);
          animation: spin 20s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .section-divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 32px 0;
        }

        .link-social-card {
          background: var(--card2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 14px;
          transition: border-color 0.3s;
        }
        .link-social-card:hover { border-color: #3a3a3a; }

        .section-header {
          margin-bottom: 28px;
        }

        .stat-box {
          background: var(--card2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px 22px;
          text-align: center;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--dark); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

        /* Override shadcn inputs */
        input, textarea, select {
          background: #1e1e1e !important;
          border-color: #2a2a2a !important;
          color: #e8e8e8 !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        input:focus, textarea:focus {
          border-color: #ff6b35 !important;
          box-shadow: 0 0 0 2px rgba(255,107,53,0.12) !important;
        }
      `}</style>

      <Navbar />

      {/* ─── Hero / About Banner ─── */}
      <section style={{ background: "linear-gradient(135deg, #111 0%, #0d0d0d 100%)", borderBottom: "1px solid #1e1e1e", padding: "72px 24px 60px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            <div className="hero-avatar-ring">
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User style={{ width: 56, height: 56, color: "#555" }} />
              </div>
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <span className="section-tag">About Me</span>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: "0 0 14px" }}>
              {personal.firstName || "Your"} {personal.lastName || "Name"}
            </h1>
            <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 480 }}>
              {personal.university ? `Studying at ${personal.university}. ` : ""}
              Building digital experiences that leave a lasting impression.
            </p>

            {/* Contact pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 50, padding: "8px 16px" }}>
                <Mail style={{ width: 14, height: 14, color: "#ff6b35" }} />
                <span style={{ color: "#aaa", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>example@domain.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 50, padding: "8px 16px" }}>
                <Phone style={{ width: 14, height: 14, color: "#ff6b35" }} />
                <span style={{ color: "#aaa", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>+1 (234) 567-890</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="orange-btn" onClick={() => setActiveSection("personal")}>
                Edit Profile <ChevronRight style={{ width: 15, height: 15 }} />
              </button>
              <button className="outline-btn">
                Download Resume <Download style={{ width: 15, height: 15 }} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 130 }}>
            <div className="stat-box">
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#ff6b35" }}>{projects.length || "0"}</div>
              <div style={{ color: "#666", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>Projects</div>
            </div>
            <div className="stat-box">
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#ff6b35" }}>{experiences.length || "0"}</div>
              <div style={{ color: "#666", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>Experiences</div>
            </div>
            <div className="stat-box">
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#ff6b35" }}>{skills.length || "0"}</div>
              <div style={{ color: "#666", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>Skills</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sticky Nav ─── */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(13,13,13,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e1e1e", padding: "12px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 6, overflowX: "auto" }}>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-pill ${activeSection === id ? "active" : ""}`} onClick={() => setActiveSection(id)}>
              <Icon style={{ width: 14, height: 14 }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px", width: "100%" }}>

        {/* ══ PERSONAL INFO ══ */}
        {activeSection === "personal" && (
          <div>
            <div className="section-header">
              <span className="section-tag">Personal Information</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
                Your <span style={{ color: "#ff6b35" }}>Profile</span> Details
              </h2>
            </div>

            <div className="profile-card">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                <div>
                  <label className="dark-label">First Name</label>
                  <Input
                    className="dark-input"
                    value={personal.firstName}
                    onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="dark-label">Last Name</label>
                  <Input
                    className="dark-input"
                    value={personal.lastName}
                    onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="dark-label">University (Optional)</label>
                  <Input
                    className="dark-input"
                    value={personal.university}
                    onChange={(e) => setPersonal({ ...personal, university: e.target.value })}
                    placeholder="Your University"
                  />
                </div>
              </div>

              <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                <button className="orange-btn" onClick={handleSave}>
                  <Save style={{ width: 15, height: 15 }} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ SOCIAL LINKS ══ */}
        {activeSection === "social" && (
          <div>
            <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <div>
                <span className="section-tag">Connect</span>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
                  Social <span style={{ color: "#ff6b35" }}>Links</span>
                </h2>
              </div>
              <button className="outline-btn" onClick={addSocialLink}>
                <Plus style={{ width: 15, height: 15 }} /> Add Link
              </button>
            </div>

            {links.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 24px", color: "#444", fontFamily: "'DM Sans', sans-serif" }}>
                <LinkIcon style={{ width: 40, height: 40, margin: "0 auto 14px", display: "block", opacity: 0.3 }} />
                <p>No social links added yet.</p>
              </div>
            )}

            {links.map((link) => (
              <div key={link.id} className="link-social-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="orange-dot" />
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#ff6b35", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
                      {link.socialType}
                    </span>
                  </div>
                  <button onClick={() => removeSocialLink(link.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ff4444")} onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
                    <Trash2 style={{ width: 16, height: 16 }} />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14, alignItems: "end" }}>
                  <div>
                    <label className="dark-label">Platform</label>
                    <Select value={link.socialType} onValueChange={(value) => updateLink(link.id, "socialType", value)}>
                      <SelectTrigger className="dark-input" style={{ width: "100%", borderRadius: 10 }}>
                        <SelectValue placeholder="Select Platform" />
                      </SelectTrigger>
                      <SelectContent style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                        {["LINKEDIN", "GITHUB", "BEHANCE", "DRIBBLE", "PORTFOLIO", "MEDIUM", "DISCORD", "STACKOVERFLOW", "GITLAB", "TWITTER", "FACEBOOK", "INSTAGRAM", "OTHER"].map(p => (
                          <SelectItem key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="dark-label">Profile URL</label>
                    <Input
                      className="dark-input"
                      value={link.url || ""}
                      onChange={(e) => updateLink(link.id, "url", e.target.value)}
                      placeholder="https://..."
                    />
                    {errors[`url-${link.id}`] && (
                      <p style={{ color: "#ff4444", fontSize: 12, marginTop: 4 }}>{errors[`url-${link.id}`]}</p>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                  <button className="orange-btn"
                    onClick={() => saveSocialLinks(link.id, link.socialType || "OTHER", link.url || "")}
                    disabled={isLinksLoading || !link.url?.trim()}
                    style={{ fontSize: 13, padding: "8px 20px" }}>
                    {isLinksLoading ? "Saving..." : "Save Link"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ SKILLS ══ */}
        {activeSection === "skills" && (
          <div>
            <div className="section-header">
              <span className="section-tag">My Work Skills</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
                Technical <span style={{ color: "#ff6b35" }}>Expertise</span>
              </h2>
            </div>

            {/* Add Skill */}
            <div className="profile-card" style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", color: "#aaa", fontSize: 14, fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Add New Skill</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Select value={newSkill.category} onValueChange={(v) => setNewSkill({ ...newSkill, category: v })}>
                  <SelectTrigger style={{ width: 150, borderRadius: 10, background: "#1e1e1e", borderColor: "#2a2a2a", color: "#e8e8e8" }}>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                    {skillCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input
                  className="dark-input"
                  placeholder="Skill name (e.g. React, Figma)"
                  value={newSkill.skillName}
                  style={{ flex: 1, minWidth: 160 }}
                  onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddSkill(newSkill.skillName);
                      setNewSkill({ ...newSkill, skillName: "" });
                    }
                  }}
                />
                <button className="orange-btn"
                  onClick={() => { handleAddSkill(newSkill.skillName); setNewSkill({ ...newSkill, skillName: "" }); }}
                  disabled={isSkillsLoading || !newSkill.skillName.trim()}
                  style={{ padding: "10px 20px" }}>
                  {isSkillsLoading ? "..." : <><Plus style={{ width: 16, height: 16 }} /> Add</>}
                </button>
              </div>
            </div>

            {/* Skills Grid */}
            {skills.length === 0 && !isSkillsLoading ? (
              <div style={{ textAlign: "center", padding: "60px 24px", color: "#444", fontFamily: "'DM Sans', sans-serif" }}>
                <Code2 style={{ width: 40, height: 40, margin: "0 auto 14px", display: "block", opacity: 0.3 }} />
                <p>No skills added yet. Add your first skill above.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
                {skills.map((s) => (
                  <div key={s.skillId} className="profile-card" style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#e8e8e8", fontSize: 14 }}>{s.skillName}</span>
                      <button onClick={() => handleRemoveSkill(s.skillId)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#444", transition: "color 0.2s", padding: 2 }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#ff4444")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                        <X style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                    <div className="skill-bar-track">
                      <div className="skill-bar-fill" style={{ width: `${skillProgressMap[newSkill.category] || 80}%` }} />
                    </div>
                    <div style={{ marginTop: 6, color: "#ff6b35", fontSize: 12, fontFamily: "'Syne', sans-serif", fontWeight: 700, textAlign: "right" }}>
                      {skillProgressMap[newSkill.category] || 80}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ EXPERIENCE / SERVICES ══ */}
        {activeSection === "experience" && (
          <div>
            <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <div>
                <span className="section-tag">My Services</span>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
                  Work <span style={{ color: "#ff6b35" }}>Experience</span>
                </h2>
              </div>
              <button className="outline-btn" onClick={addExperience}>
                <Plus style={{ width: 15, height: 15 }} /> Add Experience
              </button>
            </div>

            {experiences.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 24px", color: "#444", fontFamily: "'DM Sans', sans-serif" }}>
                <Briefcase style={{ width: 40, height: 40, margin: "0 auto 14px", display: "block", opacity: 0.3 }} />
                <p>No experience added yet.</p>
              </div>
            )}

            {experiences.map((exp) => (
              <div key={exp.id} className="exp-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Briefcase style={{ width: 20, height: 20, color: "#ff6b35" }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#e8e8e8", fontSize: 16 }}>
                        {exp.title || `Experience ${exp.id}`}
                      </div>
                      {exp.organization && (
                        <div style={{ color: "#ff6b35", fontSize: 13, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{exp.organization}</div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => removeExperience(exp.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#444", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ff4444")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                    <Trash2 style={{ width: 16, height: 16 }} />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                  <div>
                    <label className="dark-label">Job Title</label>
                    <Input className="dark-input" value={exp.title || ""} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className="dark-label">Organization</label>
                    <Input className="dark-input" value={exp.organization || ""} onChange={(e) => updateExperience(exp.id, "organization", e.target.value)} placeholder="Company Name" />
                  </div>
                  <div>
                    <label className="dark-label">Start Date</label>
                    <Input className="dark-input" type="date" value={exp.startDate || ""} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} />
                  </div>
                  <div>
                    <label className="dark-label">End Date</label>
                    <Input className="dark-input" type="date" value={exp.endDate || ""} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="dark-label">Description</label>
                    <Textarea className="dark-input" value={exp.description || ""} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} placeholder="Describe your role and achievements..." style={{ minHeight: 90, resize: "vertical" }} />
                  </div>
                </div>

                <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                  <button className="orange-btn"
                    onClick={() => saveExperiences(exp)}
                    disabled={isLoading || !exp.title?.trim() || !exp.organization?.trim() || !exp.startDate}
                    style={{ fontSize: 13, padding: "8px 20px" }}>
                    {isLoading ? "Saving..." : "Save Experience"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ PROJECTS ══ */}
        {activeSection === "projects" && (
          <div>
            <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
              <div>
                <span className="section-tag">Portfolio</span>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", margin: 0 }}>
                  My <span style={{ color: "#ff6b35" }}>Projects</span>
                </h2>
              </div>
              <button className="outline-btn" onClick={addProject}>
                <Plus style={{ width: 15, height: 15 }} /> Add Project
              </button>
            </div>

            {projects.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 24px", color: "#444", fontFamily: "'DM Sans', sans-serif" }}>
                <FolderGit2 style={{ width: 40, height: 40, margin: "0 auto 14px", display: "block", opacity: 0.3 }} />
                <p>No projects added yet.</p>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20 }}>
              {projects.map((proj) => (
                <div key={proj.id} className="project-card">
                  {/* Card Header Visual */}
                  <div style={{ height: 140, background: "linear-gradient(135deg, #1a1a1a 0%, #222 100%)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(255,107,53,0.08) 0%, transparent 60%)" }} />
                    <FolderGit2 style={{ width: 48, height: 48, color: "#333" }} />
                    {/* External link */}
                    {proj.projectUrl && (
                      <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer"
                        style={{ position: "absolute", bottom: 12, right: 12, width: 36, height: 36, background: "#ff6b35", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                        <ExternalLink style={{ width: 16, height: 16, color: "white" }} />
                      </a>
                    )}
                    {/* Delete */}
                    <button onClick={() => removeProject(proj.id)}
                      style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#ff4444")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: 20 }}>
                    <div style={{ marginBottom: 16 }}>
                      <label className="dark-label">Project Title</label>
                      <Input className="dark-input" value={proj.title || ""} onChange={(e) => updateProject(proj.id, "title", e.target.value)} placeholder="My Awesome Project" />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div>
                        <label className="dark-label">Project URL</label>
                        <Input className="dark-input" value={proj.projectUrl || ""} onChange={(e) => updateProject(proj.id, "projectUrl", e.target.value)} placeholder="https://..." />
                      </div>
                      <div>
                        <label className="dark-label">Technologies</label>
                        <Input className="dark-input" value={proj.technologies || ""} onChange={(e) => updateProject(proj.id, "technologies", e.target.value)} placeholder="React, Node.js..." />
                      </div>
                      <div>
                        <label className="dark-label">Start Date</label>
                        <Input className="dark-input" type="date" value={proj.startDate || ""} onChange={(e) => updateProject(proj.id, "startDate", e.target.value)} />
                      </div>
                      <div>
                        <label className="dark-label">End Date</label>
                        <Input className="dark-input" type="date" value={proj.endDate || ""} onChange={(e) => updateProject(proj.id, "endDate", e.target.value)} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label className="dark-label">Description</label>
                      <Textarea className="dark-input" value={proj.description || ""} onChange={(e) => updateProject(proj.id, "description", e.target.value)} placeholder="Brief description of the project..." style={{ minHeight: 80, resize: "vertical" }} />
                    </div>

                    {/* Tech tags */}
                    {proj.technologies && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                        {proj.technologies.split(",").map((tech, i) => (
                          <span key={i} style={{ background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)", color: "#ff6b35", borderRadius: 50, padding: "3px 10px", fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <button className="orange-btn"
                      onClick={() => saveProjects(proj)}
                      disabled={isProjectsLoading || !proj.title?.trim() || !proj.description?.trim() || !proj.startDate}
                      style={{ width: "100%", justifyContent: "center", fontSize: 13, padding: "10px" }}>
                      {isProjectsLoading ? "Saving..." : <><Save style={{ width: 14, height: 14 }} /> Save Project</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume Section - always visible at bottom */}
        <hr className="section-divider" />
        <div style={{ marginTop: 8 }}>
          <span className="section-tag">Resume</span>
          <ResumeSection />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;


























//claude profile page v2 - more modern, sleek, and user-friendly design with better UX for editing and managing profile details, projects, experience, and skills. Also includes a sticky nav for easy section switching and a resume section at the bottom for quick access to resume management features.

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select, SelectContent, SelectItem,
//   SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// import { SocialLinkRequest, personal, ProjectRequest, SkillRequest, ExperienceRequest } from "@/types/profile";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import {
//   Plus, Trash2, User, Link as LinkIcon, FolderGit2,
//   Briefcase, Code2, X, Mail, Phone, Twitter, Github,
//   Linkedin, Globe, ExternalLink, ArrowUpRight, Star,
//   ChevronRight, Download, Sun, Moon,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { userProfileService } from "@/services/userService";
// import { useExperience } from "@/hooks/useExperience";
// import { useProject } from "@/hooks/useProjects";
// import { useSocialLinks } from "@/hooks/useSocial";
// import { useSkills } from "@/hooks/useSkills";
// import { useProfileManager } from "@/hooks/usePersonalInfo";
// import { ResumeSection } from "@/features/resume/components/ResumeSection";

// /* ─────────────────────────────────────────────────────────
//    CONSTANTS
// ───────────────────────────────────────────────────────── */
// const skillCategories = ["Frontend", "Backend", "DevOps", "Design", "Data Science", "Mobile", "Other"];

// const SKILL_PROGRESS: Record<string, number> = {
//   React: 95, "Next.js": 92, TypeScript: 88, JavaScript: 97,
//   CSS: 90, Tailwind: 93, Node: 85, Python: 80, Figma: 78, Git: 91,
// };
// const getProgress = (name: string) => SKILL_PROGRESS[name] ?? 82;

// const getSocialIcon = (type: string) => {
//   const s = { height: "1rem", width: "1rem" };
//   switch (type) {
//     case "LINKEDIN":  return <Linkedin style={s} />;
//     case "GITHUB":    return <Github style={s} />;
//     case "TWITTER":   return <Twitter style={s} />;
//     default:          return <Globe style={s} />;
//   }
// };

// /* ─────────────────────────────────────────────────────────
//    THEME TOKENS  (dark / light)
// ───────────────────────────────────────────────────────── */
// const DARK = {
//   bg:          "#0d0c1a",
//   bgCard:      "#13112a",
//   bgInput:     "#1a1730",
//   border:      "#2d2a4a",
//   borderAccent:"#2D236A",
//   text:        "#ede9fe",
//   textMuted:   "#8b83b8",
//   textFaint:   "#4b4680",
//   brand:       "#2D236A",
//   brandLight:  "#3d3090",
//   brandGlow:   "rgba(45,35,106,0.35)",
//   accent:      "#7c6fcd",
//   accentSoft:  "rgba(124,111,205,0.15)",
//   progress:    "linear-gradient(90deg,#2D236A,#7c6fcd)",
//   heroBlobA:   "rgba(45,35,106,0.18)",
//   heroBlobB:   "rgba(124,111,205,0.08)",
// };

// const LIGHT = {
//   bg:          "#f5f4fb",
//   bgCard:      "#ffffff",
//   bgInput:     "#f0eef9",
//   border:      "#d8d4f0",
//   borderAccent:"#2D236A",
//   text:        "#1a1540",
//   textMuted:   "#5a5390",
//   textFaint:   "#9b97c0",
//   brand:       "#2D236A",
//   brandLight:  "#3d3090",
//   brandGlow:   "rgba(45,35,106,0.20)",
//   accent:      "#5046a8",
//   accentSoft:  "rgba(45,35,106,0.08)",
//   progress:    "linear-gradient(90deg,#2D236A,#5046a8)",
//   heroBlobA:   "rgba(45,35,106,0.10)",
//   heroBlobB:   "rgba(124,111,205,0.06)",
// };

// type Theme = typeof DARK;

// /* ─────────────────────────────────────────────────────────
//    GLOBAL CSS  (injected once)
// ───────────────────────────────────────────────────────── */
// const makeCSS = (t: Theme) => `
//   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

//   .pf-root *, .pf-root *::before, .pf-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   .pf-root {
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     background: ${t.bg};
//     color: ${t.text};
//     min-height: 100vh;
//     transition: background 0.3s, color 0.3s;
//   }

//   /* typography */
//   .pf-display { font-family: 'DM Serif Display', serif; }

//   /* buttons */
//   .pf-btn {
//     background: ${t.brand};
//     color: #fff;
//     border: none;
//     border-radius: 9999px;
//     padding: 0.6rem 1.5rem;
//     font-weight: 700;
//     font-size: 0.875rem;
//     cursor: pointer;
//     display: inline-flex;
//     align-items: center;
//     gap: 0.4rem;
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
//     box-shadow: 0 4px 18px ${t.brandGlow};
//     text-decoration: none;
//   }
//   .pf-btn:hover { background: ${t.brandLight}; transform: translateY(-1px); box-shadow: 0 8px 24px ${t.brandGlow}; }
//   .pf-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

//   .pf-btn-ghost {
//     background: transparent;
//     color: ${t.brand};
//     border: 1.5px solid ${t.brand};
//     border-radius: 9999px;
//     padding: 0.55rem 1.4rem;
//     font-weight: 700;
//     font-size: 0.875rem;
//     cursor: pointer;
//     display: inline-flex;
//     align-items: center;
//     gap: 0.4rem;
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     transition: all 0.2s;
//   }
//   .pf-btn-ghost:hover { background: ${t.brand}; color: #fff; }

//   /* cards */
//   .pf-card {
//     border-radius: 1rem;
//     border: 1px solid ${t.border};
//     background: ${t.bgCard};
//     transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
//   }
//   .pf-card:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 16px 48px rgba(0,0,0,0.12);
//     border-color: ${t.accent};
//   }

//   /* inputs */
//   .pf-inp {
//     background: ${t.bgInput};
//     border: 1px solid ${t.border};
//     border-radius: 0.5rem;
//     color: ${t.text};
//     padding: 0.5rem 0.75rem;
//     font-size: 0.875rem;
//     width: 100%;
//     outline: none;
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     transition: border-color 0.2s;
//   }
//   .pf-inp:focus { border-color: ${t.brand}; }
//   .pf-inp::placeholder { color: ${t.textFaint}; }

//   .pf-label {
//     font-size: 0.78rem;
//     font-weight: 600;
//     color: ${t.textMuted};
//     margin-bottom: 0.3rem;
//     display: block;
//     letter-spacing: 0.02em;
//   }

//   /* progress */
//   .pf-track { height: 6px; width: 100%; background: ${t.border}; border-radius: 9999px; }
//   .pf-bar   { height: 6px; border-radius: 9999px; background: ${t.progress}; }

//   /* tag */
//   .pf-tag {
//     background: ${t.accentSoft};
//     color: ${t.accent};
//     border: 1px solid ${t.border};
//     border-radius: 9999px;
//     font-size: 0.72rem;
//     font-weight: 600;
//     padding: 0.2rem 0.75rem;
//     display: inline-flex;
//     align-items: center;
//     gap: 0.25rem;
//   }

//   /* hover arrow on cards */
//   .pf-arrow {
//     position: absolute;
//     bottom: 1rem;
//     right: 1rem;
//     height: 2.25rem;
//     width: 2.25rem;
//     border-radius: 9999px;
//     background: ${t.brand};
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     opacity: 0;
//     transition: opacity 0.2s;
//     cursor: pointer;
//     border: none;
//     box-shadow: 0 4px 14px ${t.brandGlow};
//   }
//   .pf-card:hover .pf-arrow { opacity: 1; }

//   /* spin */
//   .pf-spin { animation: pfSpin 20s linear infinite; }
//   @keyframes pfSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

//   /* divider */
//   .pf-divider { border: none; border-top: 1px solid ${t.border}; margin: 0; }

//   /* section */
//   .pf-section { padding: 5.5rem 1.5rem; }

//   /* grids */
//   .pf-g2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1rem; }
//   .pf-g3 { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
//   .pf-g4 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1rem; }
//   .pf-footer-g { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }

//   @media(min-width:640px) {
//     .pf-g3 { grid-template-columns: repeat(2,1fr); }
//     .pf-g4 { grid-template-columns: repeat(3,1fr); }
//     .pf-footer-g { grid-template-columns: repeat(2,1fr); }
//   }
//   @media(min-width:768px) {
//     .pf-g3 { grid-template-columns: repeat(3,1fr); }
//     .pf-g4 { grid-template-columns: repeat(4,1fr); }
//     .pf-footer-g { grid-template-columns: repeat(4,1fr); }
//   }

//   /* hero layout */
//   .pf-hero {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 3.5rem;
//     max-width: 900px;
//     margin: 0 auto;
//   }
//   @media(min-width:768px) { .pf-hero { flex-direction: row; align-items: center; } }

//   /* edit accordion */
//   .pf-panel {
//     margin-bottom: 0.875rem;
//     border-radius: 0.875rem;
//     border: 1px solid ${t.border};
//     background: ${t.bgCard};
//     overflow: hidden;
//   }
//   .pf-panel-head {
//     display: flex;
//     width: 100%;
//     align-items: center;
//     justify-content: space-between;
//     padding: 1rem 1.25rem;
//     background: none;
//     border: none;
//     cursor: pointer;
//     text-align: left;
//     transition: background 0.15s;
//   }
//   .pf-panel-head:hover { background: ${t.accentSoft}; }
//   .pf-panel-body {
//     border-top: 1px solid ${t.border};
//     padding: 1.25rem;
//   }

//   /* theme toggle */
//   .pf-toggle {
//     background: ${t.accentSoft};
//     border: 1px solid ${t.border};
//     border-radius: 9999px;
//     padding: 0.4rem;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: all 0.2s;
//     color: ${t.accent};
//   }
//   .pf-toggle:hover { background: ${t.brand}; color: #fff; border-color: ${t.brand}; }

//   /* info card */
//   .pf-info-card {
//     display: inline-grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 0.75rem 2.5rem;
//     border-radius: 0.875rem;
//     border: 1px solid ${t.border};
//     background: ${t.bgCard};
//     padding: 1rem 1.5rem;
//     margin-bottom: 1.5rem;
//     font-size: 0.875rem;
//   }

//   /* select overrides for dark/light */
//   [data-radix-popper-content-wrapper] { z-index: 9999 !important; }

//   /* scrollbar */
//   .pf-root::-webkit-scrollbar { width: 6px; }
//   .pf-root::-webkit-scrollbar-track { background: ${t.bg}; }
//   .pf-root::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 9999px; }
// `;

// /* ─────────────────────────────────────────────────────────
//    SUB-COMPONENTS
// ───────────────────────────────────────────────────────── */
// const SectionHeader = ({
//   pre, title, accent, sub, t,
// }: { pre: string; title: string; accent: string; sub: string; t: Theme }) => (
//   <div style={{ textAlign: "center", marginBottom: "3rem" }}>
//     <p style={{ color: t.accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "0.6rem" }}>{pre}</p>
//     <h2 className="pf-display" style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 700, color: t.text, marginBottom: "0.75rem", lineHeight: 1.2 }}>
//       {title} <span style={{ color: t.brand }}>{accent}</span>
//     </h2>
//     <p style={{ color: t.textMuted, fontSize: "0.875rem", maxWidth: "480px", margin: "0 auto", lineHeight: 1.75 }}>{sub}</p>
//   </div>
// );

// const EditPanel = ({
//   children, title, icon, t,
// }: { children: React.ReactNode; title: string; icon: React.ReactNode; t: Theme }) => {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="pf-panel">
//       <button className="pf-panel-head" onClick={() => setOpen(!open)}>
//         <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 700, color: t.text }}>
//           <span style={{ color: t.brand }}>{icon}</span>
//           {title}
//         </span>
//         <ChevronRight style={{
//           height: "1rem", width: "1rem", color: t.textMuted,
//           transform: open ? "rotate(90deg)" : "rotate(0deg)",
//           transition: "transform 0.2s",
//         }} />
//       </button>
//       {open && <div className="pf-panel-body">{children}</div>}
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────────────────── */
// const Profile = () => {
//   const { toast } = useToast();
//   const [isDark, setIsDark] = useState(true);
//   const t = isDark ? DARK : LIGHT;

//   // ── all existing hooks – unchanged ──
//   const { personal, setPersonal, loading, handleSave } = useProfileManager();
//   const [newSkill, setNewSkill] = useState({ category: "Frontend", skillName: "" });

//   const {
//     experiences, addExperience, updateExperience, removeExperience,
//     saveExperiences, isLoading, errors,
//   } = useExperience();
//   const {
//     projects, addProject, updateProject, removeProject,
//     saveProjects, isLoading: isProjectsLoading,
//   } = useProject();
//   const {
//     links, updateLink, saveSocialLinks, isLoading: isLinksLoading,
//     removeSocialLink, addSocialLink,
//   } = useSocialLinks();
//   const {
//     skills, isLoading: isSkillsLoading,
//     handleAddSkill, handleRemoveSkill,
//   } = useSkills();

//   const save = () => toast({ title: "Profile Saved", description: "Your profile has been updated successfully." });
//   const fullName = `${personal.firstName || "Saira"} ${personal.lastName || "Karim"}`;

//   // placeholder skill rows when DB is empty
//   const displaySkills = skills.length > 0 ? skills : [
//     { skillId: "p1", skillName: "Figma" },
//     { skillId: "p2", skillName: "WordPress" },
//     { skillId: "p3", skillName: "React" },
//     { skillId: "p4", skillName: "Web Design" },
//     { skillId: "p5", skillName: "TypeScript" },
//     { skillId: "p6", skillName: "Xd" },
//     { skillId: "p7", skillName: "Node" },
//     { skillId: "p8", skillName: "Mobile App" },
//   ];

//   const displayExperiences = experiences.length > 0 ? experiences : [
//     { id: "d1", title: "UI / UX Design",    organization: "", startDate: "", endDate: "", description: "Crafting intuitive digital experiences that delight users." },
//     { id: "d2", title: "Web Design",        organization: "", startDate: "", endDate: "", description: "Building pixel-perfect responsive interfaces." },
//     { id: "d3", title: "Web Development",   organization: "", startDate: "", endDate: "", description: "End-to-end development with modern tech stacks." },
//   ];

//   /* icon size shorthand */
//   const ico = { height: "1rem", width: "1rem" };
//   const ico5 = { height: "1.25rem", width: "1.25rem" };

//   return (
//     <div className="pf-root">
//       {/* ── inject theme CSS ── */}
//       <style>{makeCSS(t)}</style>

//       <Navbar />

//       {/* ════════════════════════════════════════
//           THEME TOGGLE  (floating)
//       ════════════════════════════════════════ */}
//       <div style={{
//         position: "fixed", top: "5rem", right: "1.25rem", zIndex: 999,
//       }}>
//         <button className="pf-toggle" onClick={() => setIsDark(d => !d)}
//           title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
//           {isDark
//             ? <Sun style={ico} />
//             : <Moon style={ico} />}
//         </button>
//       </div>

//       {/* ════════════════════════════════════════
//           HERO
//       ════════════════════════════════════════ */}
//       <section className="pf-section" style={{ position: "relative", overflow: "hidden" }}>
//         {/* blobs */}
//         <div style={{ position: "absolute", top: "-6rem", left: "40%", height: "28rem", width: "28rem", borderRadius: "9999px", background: t.heroBlobA, filter: "blur(80px)", pointerEvents: "none" }} />
//         <div style={{ position: "absolute", bottom: "0", right: "5%", height: "16rem", width: "16rem", borderRadius: "9999px", background: t.heroBlobB, filter: "blur(60px)", pointerEvents: "none" }} />

//         <div className="pf-hero" style={{ position: "relative" }}>
//           {/* ── Avatar ── */}
//           <div style={{ position: "relative", flexShrink: 0 }}>
//             {/* spinning ring */}
//             <div className="pf-spin" style={{
//               position: "absolute", inset: "-14px", borderRadius: "9999px",
//               border: `2px dashed ${t.accent}`,
//               opacity: 0.45,
//             }} />
//             {/* solid ring */}
//             <div style={{
//               position: "absolute", inset: "-6px", borderRadius: "9999px",
//               border: `2px solid ${t.brand}`,
//               opacity: 0.3,
//             }} />
//             {/* photo circle */}
//             <div style={{
//               position: "relative", height: "216px", width: "216px",
//               borderRadius: "9999px",
//               border: `4px solid ${t.brand}`,
//               overflow: "hidden",
//               boxShadow: `0 0 48px ${t.brandGlow}`,
//             }}>
//               <div style={{
//                 width: "100%", height: "100%",
//                 background: isDark
//                   ? "linear-gradient(135deg,#1e1b3a,#13112a)"
//                   : "linear-gradient(135deg,#e9e6f9,#d4cfee)",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontFamily: "'DM Serif Display',serif", fontSize: "4rem", color: t.brand,
//               }}>
//                 {personal.firstName?.[0] || "S"}
//               </div>
//             </div>
//             {/* deco dots */}
//             <div style={{ position: "absolute", bottom: "-6px", right: "-8px", height: "2.25rem", width: "2.25rem", borderRadius: "9999px", background: t.brand }} />
//             <div style={{ position: "absolute", top: "0", left: "-14px", height: "1.25rem", width: "1.25rem", borderRadius: "9999px", background: t.accent, opacity: 0.5 }} />
//           </div>

//           {/* ── Bio ── */}
//           <div style={{ flex: 1, textAlign: "left" }}>
//             <span className="pf-tag" style={{ marginBottom: "1.1rem", display: "inline-block" }}>About Me</span>

//             <h1 className="pf-display" style={{
//               fontSize: "clamp(1.75rem,4vw,2.75rem)",
//               fontWeight: 700,
//               color: t.text,
//               lineHeight: 1.22,
//               marginBottom: "1rem",
//             }}>
//               Get a website that will make a{" "}
//               <span style={{ color: t.brand }}>lasting impression</span>{" "}
//               on your audience!!!
//             </h1>

//             <p style={{ color: t.textMuted, lineHeight: 1.8, marginBottom: "1.5rem", maxWidth: "500px", fontSize: "0.9375rem" }}>
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
//             </p>

//             {/* info grid */}
//             <div className="pf-info-card">
//               {[
//                 { label: "Name:",    val: fullName },
//                 { label: "Phone:",   val: "+(234) 567-8910" },
//                 { label: "Email:",   val: "example@domain.com" },
//                 { label: "Twitter:", val: `@${personal.firstName?.toLowerCase() || "sairakarim"}011` },
//               ].map(({ label, val }) => (
//                 <div key={label}>
//                   <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: t.brand, marginBottom: "0.15rem" }}>{label}</p>
//                   <p style={{ color: t.text, fontWeight: 600, fontSize: "0.875rem" }}>{val}</p>
//                 </div>
//               ))}
//             </div>

//             <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
//               <button className="pf-btn">Contact me <ArrowUpRight style={ico} /></button>
//               <button className="pf-btn-ghost"><Download style={ico} /> Download resume</button>
//             </div>
//           </div>
//         </div>
//       </section>

//       <hr className="pf-divider" />

//       {/* ════════════════════════════════════════
//           SKILLS
//       ════════════════════════════════════════ */}
//       <section className="pf-section">
//         <SectionHeader t={t} pre="What I Do" title="My Work" accent="Skills"
//           sub="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." />

//         <div style={{ maxWidth: "900px", margin: "0 auto" }}>
//           <div className="pf-g4">
//             {displaySkills.map((s: any) => {
//               const prog = getProgress(s.skillName);
//               return (
//                 <div key={s.skillId} className="pf-card" style={{ padding: "1.25rem", textAlign: "center" }}>
//                   <div style={{
//                     width: "3rem", height: "3rem", borderRadius: "0.75rem",
//                     background: t.accentSoft,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     margin: "0 auto 0.875rem",
//                   }}>
//                     <Code2 style={{ height: "1.4rem", width: "1.4rem", color: t.brand }} />
//                   </div>
//                   <p style={{ fontWeight: 700, color: t.text, fontSize: "0.875rem", marginBottom: "0.75rem" }}>{s.skillName}</p>
//                   <div className="pf-track">
//                     <div className="pf-bar" style={{ width: `${prog}%` }} />
//                   </div>
//                   <p style={{ marginTop: "0.4rem", fontSize: "0.75rem", fontWeight: 700, color: t.accent }}>{prog}%</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       <hr className="pf-divider" />

//       {/* ════════════════════════════════════════
//           SERVICES  (from experiences)
//       ════════════════════════════════════════ */}
//       <section className="pf-section" style={{ background: isDark ? "rgba(45,35,106,0.04)" : "rgba(45,35,106,0.02)" }}>
//         <SectionHeader t={t} pre="What I Offer" title="My" accent="Services"
//           sub="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." />

//         <div style={{ maxWidth: "900px", margin: "0 auto" }}>
//           <div className="pf-g3">
//             {displayExperiences.map((exp: any) => (
//               <div key={exp.id} className="pf-card" style={{ position: "relative", overflow: "hidden" }}>
//                 {/* top accent stripe */}
//                 <div style={{ height: "5px", background: `linear-gradient(90deg,${t.brand},${t.accent})` }} />
//                 {/* thumbnail */}
//                 <div style={{
//                   height: "9.5rem",
//                   background: isDark
//                     ? "linear-gradient(135deg,#1a1730,#13112a)"
//                     : "linear-gradient(135deg,#ebe9f7,#ddd9f0)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                 }}>
//                   <Briefcase style={{ height: "3rem", width: "3rem", color: t.border }} />
//                 </div>
//                 <div style={{ padding: "1.25rem" }}>
//                   <h3 style={{ fontWeight: 700, color: t.text, marginBottom: "0.35rem", fontSize: "1rem" }}>{exp.title}</h3>
//                   {exp.organization && <p style={{ fontSize: "0.75rem", color: t.brand, fontWeight: 600, marginBottom: "0.25rem" }}>{exp.organization}</p>}
//                   {exp.startDate && <p style={{ fontSize: "0.72rem", color: t.textFaint, marginBottom: "0.6rem" }}>{exp.startDate} → {exp.endDate || "Present"}</p>}
//                   <p style={{ fontSize: "0.875rem", color: t.textMuted, lineHeight: 1.7 }}>{exp.description}</p>
//                 </div>
//                 <button className="pf-arrow"><ArrowUpRight style={{ height: "1rem", width: "1rem", color: "#fff" }} /></button>
//               </div>
//             ))}
//           </div>

//           <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
//             <button className="pf-btn">See All <ChevronRight style={ico} /></button>
//           </div>
//         </div>
//       </section>

//       <hr className="pf-divider" />

//       {/* ════════════════════════════════════════
//           PROJECTS
//       ════════════════════════════════════════ */}
//       <section className="pf-section">
//         <SectionHeader t={t} pre="My Work" title="Recent" accent="Projects"
//           sub="A selection of my most recent and impactful projects." />

//         <div style={{ maxWidth: "900px", margin: "0 auto" }}>
//           {projects.length > 0 ? (
//             <div className="pf-g3">
//               {projects.map((proj: any) => (
//                 <div key={proj.id} className="pf-card" style={{ position: "relative", overflow: "hidden" }}>
//                   <div style={{
//                     height: "10rem",
//                     background: isDark
//                       ? "linear-gradient(135deg,#1a1730,#16132b)"
//                       : "linear-gradient(135deg,#ebe9f7,#e0dcf2)",
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                   }}>
//                     <FolderGit2 style={{ height: "3rem", width: "3rem", color: t.border }} />
//                   </div>
//                   <div style={{ padding: "1.25rem" }}>
//                     <h3 style={{ fontWeight: 700, color: t.text, marginBottom: "0.5rem" }}>{proj.title || "Project"}</h3>
//                     {proj.technologies && (
//                       <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.6rem" }}>
//                         {proj.technologies.split(",").map((tech: string) => (
//                           <span key={tech} className="pf-tag" style={{ fontSize: "0.65rem" }}>{tech.trim()}</span>
//                         ))}
//                       </div>
//                     )}
//                     <p style={{ fontSize: "0.875rem", color: t.textMuted, lineHeight: 1.7 }}>{proj.description}</p>
//                   </div>
//                   {proj.projectUrl && (
//                     <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="pf-arrow">
//                       <ExternalLink style={ico} color="#fff" />
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p style={{ textAlign: "center", color: t.textFaint, padding: "3rem 0", fontSize: "0.875rem" }}>No projects added yet.</p>
//           )}
//         </div>
//       </section>

//       <hr className="pf-divider" />

//       {/* ════════════════════════════════════════
//           TESTIMONIALS
//       ════════════════════════════════════════ */}
//       <section className="pf-section" style={{ background: isDark ? "rgba(45,35,106,0.04)" : "rgba(45,35,106,0.02)" }}>
//         <SectionHeader t={t} pre="Testimonials" title="What My" accent="Clients Say"
//           sub="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." />

//         <div style={{ maxWidth: "900px", margin: "0 auto" }}>
//           <div className="pf-g3">
//             {[
//               { name: "Robert J.", role: "CEO at Arame" },
//               { name: "Janica Z.", role: "Product Designer" },
//               { name: "Justin B.", role: "Tech Lead" },
//             ].map((person) => (
//               <div key={person.name} className="pf-card" style={{ padding: "1.5rem", position: "relative" }}>
//                 <div style={{ display: "flex", gap: "2px", marginBottom: "0.875rem" }}>
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} style={{ height: "1rem", width: "1rem", fill: t.brand, color: t.brand }} />
//                   ))}
//                 </div>
//                 <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
//                   <div style={{
//                     height: "2.5rem", width: "2.5rem", borderRadius: "9999px",
//                     background: `linear-gradient(135deg,${t.brand},${t.accent})`,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     color: "#fff", fontWeight: 800, fontSize: "0.875rem", flexShrink: 0,
//                   }}>
//                     {person.name[0]}
//                   </div>
//                   <div>
//                     <p style={{ fontWeight: 700, color: t.text, fontSize: "0.875rem" }}>{person.name}</p>
//                     <p style={{ fontSize: "0.75rem", color: t.textFaint }}>{person.role}</p>
//                   </div>
//                 </div>
//                 <p style={{ fontSize: "0.875rem", color: t.textMuted, lineHeight: 1.75 }}>
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                 </p>
//                 <span className="pf-display" style={{
//                   position: "absolute", right: "1.25rem", top: "1rem",
//                   fontSize: "5rem", lineHeight: 1, color: t.accentSoft,
//                   userSelect: "none", pointerEvents: "none",
//                 }}>"</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <hr className="pf-divider" />

//       {/* ════════════════════════════════════════
//           PROFILE EDITOR  (admin / collapsible)
//       ════════════════════════════════════════ */}
//       <section className="pf-section">
//         <div style={{ maxWidth: "720px", margin: "0 auto" }}>
//           <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
//             <h2 className="pf-display" style={{ fontSize: "2rem", fontWeight: 700, color: t.text }}>
//               Profile <span style={{ color: t.brand }}>Editor</span>
//             </h2>
//             <p style={{ color: t.textMuted, fontSize: "0.875rem", marginTop: "0.5rem" }}>Click a section to expand and edit your data.</p>
//           </div>

//           {/* ── Personal ── */}
//           <EditPanel t={t} title="Personal Information" icon={<User style={ico} />}>
//             <div className="pf-g2" style={{ marginBottom: "1rem" }}>
//               <div>
//                 <label className="pf-label">First Name</label>
//                 <input className="pf-inp" value={personal.firstName}
//                   onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })} />
//               </div>
//               <div>
//                 <label className="pf-label">Last Name</label>
//                 <input className="pf-inp" value={personal.lastName}
//                   onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })} />
//               </div>
//               <div style={{ gridColumn: "span 2" }}>
//                 <label className="pf-label">University (Optional)</label>
//                 <input className="pf-inp" value={personal.university}
//                   onChange={(e) => setPersonal({ ...personal, university: e.target.value })} />
//               </div>
//             </div>
//             <button className="pf-btn" onClick={handleSave}>Save Changes</button>
//           </EditPanel>

//           {/* ── Social Links ── */}
//           <EditPanel t={t} title="Social Links" icon={<LinkIcon style={ico} />}>
//             <div style={{ marginBottom: "0.875rem" }}>
//               {links.map((link) => (
//                 <div key={link.id} style={{
//                   marginBottom: "0.75rem", borderRadius: "0.625rem",
//                   border: `1px solid ${t.border}`, background: t.bgInput, padding: "1rem",
//                 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
//                     <span style={{ fontSize: "0.72rem", fontWeight: 700, color: t.brand, textTransform: "uppercase", letterSpacing: "0.1em" }}>{link.socialType}</span>
//                     <button onClick={() => removeSocialLink(link.id)}
//                       style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", display: "flex" }}>
//                       <Trash2 style={ico} />
//                     </button>
//                   </div>
//                   <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
//                     <div>
//                       <label className="pf-label">Platform</label>
//                       <Select value={link.socialType} onValueChange={(v) => updateLink(link.id, "socialType", v)}>
//                         <SelectTrigger style={{ background: t.bgInput, borderColor: t.border, color: t.text, height: "2.25rem", fontSize: "0.875rem", borderRadius: "0.5rem" }}>
//                           <SelectValue placeholder="Select Platform" />
//                         </SelectTrigger>
//                         <SelectContent style={{ background: t.bgCard, border: `1px solid ${t.border}`, zIndex: 9999 }}>
//                           {["LINKEDIN","GITHUB","BEHANCE","DRIBBLE","PORTFOLIO","MEDIUM","DISCORD","STACKOVERFLOW","GITLAB","TWITTER","FACEBOOK","INSTAGRAM","OTHER"].map(p => (
//                             <SelectItem key={p} value={p} style={{ color: t.text }}>{p.charAt(0) + p.slice(1).toLowerCase()}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <label className="pf-label">Profile URL</label>
//                       <input className="pf-inp" value={link.url || ""}
//                         onChange={(e) => updateLink(link.id, "url", e.target.value)}
//                         placeholder="https://..." />
//                       {errors[`url-${link.id}`] && (
//                         <p style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "0.25rem" }}>{errors[`url-${link.id}`]}</p>
//                       )}
//                     </div>
//                     <button className="pf-btn" style={{ alignSelf: "flex-start" }}
//                       onClick={() => saveSocialLinks(link.id, link.socialType || "OTHER", link.url || "")}
//                       disabled={isLinksLoading || !link.url?.trim()}>
//                       {isLinksLoading ? "Saving…" : "Save Link"}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               {links.length === 0 && (
//                 <p style={{ fontSize: "0.875rem", color: t.textFaint, textAlign: "center", padding: "0.75rem 0" }}>No social links added yet.</p>
//               )}
//             </div>
//             <button className="pf-btn-ghost" onClick={addSocialLink}><Plus style={ico} /> Add Link</button>
//           </EditPanel>

//           {/* ── Projects ── */}
//           <EditPanel t={t} title="Projects" icon={<FolderGit2 style={ico} />}>
//             {projects.map((proj: any) => (
//               <div key={proj.id} style={{
//                 marginBottom: "1rem", borderRadius: "0.625rem",
//                 border: `1px solid ${t.border}`, background: t.bgInput, padding: "1rem",
//               }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
//                   <span style={{ fontSize: "0.875rem", fontWeight: 600, color: t.text }}>Project {proj.id}</span>
//                   <button onClick={() => removeProject(proj.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", display: "flex" }}>
//                     <Trash2 style={ico} />
//                   </button>
//                 </div>
//                 <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
//                   <div><label className="pf-label">Title</label><input className="pf-inp" value={proj.title || ""} onChange={(e) => updateProject(proj.id, "title", e.target.value)} /></div>
//                   <div><label className="pf-label">Project URL</label><input className="pf-inp" value={proj.projectUrl || ""} onChange={(e) => updateProject(proj.id, "projectUrl", e.target.value)} /></div>
//                   <div><label className="pf-label">Technologies</label><input className="pf-inp" placeholder="React, Node.js…" value={proj.technologies || ""} onChange={(e) => updateProject(proj.id, "technologies", e.target.value)} /></div>
//                   <div className="pf-g2">
//                     <div><label className="pf-label">Start Date</label><input className="pf-inp" type="date" value={proj.startDate || ""} onChange={(e) => updateProject(proj.id, "startDate", e.target.value)} /></div>
//                     <div><label className="pf-label">End Date</label><input className="pf-inp" type="date" value={proj.endDate || ""} onChange={(e) => updateProject(proj.id, "endDate", e.target.value)} /></div>
//                   </div>
//                   <div><label className="pf-label">Description</label><textarea className="pf-inp" rows={3} value={proj.description || ""} onChange={(e) => updateProject(proj.id, "description", e.target.value)} style={{ resize: "vertical" }} /></div>
//                   <button className="pf-btn" style={{ alignSelf: "flex-start" }}
//                     onClick={() => saveProjects(proj)}
//                     disabled={isProjectsLoading || !proj.title?.trim() || !proj.description?.trim() || !proj.startDate}>
//                     {isProjectsLoading ? "Saving…" : "Save Project"}
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {projects.length === 0 && <p style={{ fontSize: "0.875rem", color: t.textFaint, marginBottom: "0.75rem" }}>No projects added yet.</p>}
//             <button className="pf-btn-ghost" onClick={addProject}><Plus style={ico} /> Add Project</button>
//           </EditPanel>

//           {/* ── Experience ── */}
//           <EditPanel t={t} title="Experience / Services" icon={<Briefcase style={ico} />}>
//             {experiences.map((exp: any) => (
//               <div key={exp.id} style={{
//                 marginBottom: "1rem", borderRadius: "0.625rem",
//                 border: `1px solid ${t.border}`, background: t.bgInput, padding: "1rem",
//               }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
//                   <span style={{ fontSize: "0.875rem", fontWeight: 600, color: t.text }}>Experience {exp.id}</span>
//                   <button onClick={() => removeExperience(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", display: "flex" }}>
//                     <Trash2 style={ico} />
//                   </button>
//                 </div>
//                 <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
//                   <div className="pf-g2">
//                     <div><label className="pf-label">Job Title</label><input className="pf-inp" value={exp.title || ""} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} /></div>
//                     <div><label className="pf-label">Organization</label><input className="pf-inp" value={exp.organization || ""} onChange={(e) => updateExperience(exp.id, "organization", e.target.value)} /></div>
//                     <div><label className="pf-label">Start Date</label><input className="pf-inp" type="date" value={exp.startDate || ""} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} /></div>
//                     <div><label className="pf-label">End Date</label><input className="pf-inp" type="date" value={exp.endDate || ""} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} /></div>
//                   </div>
//                   <div><label className="pf-label">Description</label><textarea className="pf-inp" rows={3} value={exp.description || ""} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} style={{ resize: "vertical" }} /></div>
//                   <button className="pf-btn" style={{ alignSelf: "flex-start" }}
//                     onClick={() => saveExperiences(exp)}
//                     disabled={isLoading || !exp.title?.trim() || !exp.organization?.trim() || !exp.startDate}>
//                     {isLoading ? "Saving…" : "Save Experience"}
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {experiences.length === 0 && <p style={{ fontSize: "0.875rem", color: t.textFaint, marginBottom: "0.75rem" }}>No experience added yet.</p>}
//             <button className="pf-btn-ghost" onClick={addExperience}><Plus style={ico} /> Add Experience</button>
//           </EditPanel>

//           {/* ── Skills ── */}
//           <EditPanel t={t} title="Skills" icon={<Code2 style={ico} />}>
//             <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
//               <Select value={newSkill.category} onValueChange={(v) => setNewSkill({ ...newSkill, category: v })}>
//                 <SelectTrigger style={{ width: "9.5rem", background: t.bgInput, borderColor: t.border, color: t.text, borderRadius: "0.5rem", height: "2.25rem", fontSize: "0.875rem" }}>
//                   <SelectValue placeholder="Category" />
//                 </SelectTrigger>
//                 <SelectContent style={{ background: t.bgCard, border: `1px solid ${t.border}` }}>
//                   {skillCategories.map((c) => <SelectItem key={c} value={c} style={{ color: t.text }}>{c}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//               <input className="pf-inp" placeholder="Skill name" value={newSkill.skillName}
//                 style={{ flex: 1 }}
//                 onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     handleAddSkill(newSkill.skillName);
//                     setNewSkill({ ...newSkill, skillName: "" });
//                   }
//                 }} />
//               <button className="pf-btn" style={{ borderRadius: "0.5rem", padding: "0.5rem 0.875rem" }}
//                 onClick={() => { handleAddSkill(newSkill.skillName); setNewSkill({ ...newSkill, skillName: "" }); }}
//                 disabled={isSkillsLoading || !newSkill.skillName.trim()}>
//                 {isSkillsLoading ? "…" : <Plus style={ico} />}
//               </button>
//             </div>
//             <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
//               {skills.map((s: any) => (
//                 <span key={s.skillId} className="pf-tag">
//                   {s.skillName}
//                   <button onClick={() => handleRemoveSkill(s.skillId)}
//                     style={{ background: "none", border: "none", cursor: "pointer", color: t.accent, display: "flex", padding: "1px" }}>
//                     <X style={{ height: "0.75rem", width: "0.75rem" }} />
//                   </button>
//                 </span>
//               ))}
//               {skills.length === 0 && !isSkillsLoading && (
//                 <p style={{ fontSize: "0.875rem", color: t.textFaint }}>No skills added yet.</p>
//               )}
//             </div>
//           </EditPanel>

//           <div style={{ marginTop: "1rem" }}>
//             <ResumeSection />
//           </div>
//         </div>
//       </section>

//       {/* ════════════════════════════════════════
//           FOOTER
//       ════════════════════════════════════════ */}
//       <footer style={{ borderTop: `1px solid ${t.border}`, background: isDark ? "#09080f" : "#f0eef9", padding: "4rem 1.5rem 2rem" }}>
//         <div style={{ maxWidth: "900px", margin: "0 auto" }}>
//           <div className="pf-footer-g" style={{ marginBottom: "3rem" }}>
//             {/* Brand */}
//             <div>
//               <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
//                 <div style={{
//                   height: "2.25rem", width: "2.25rem", borderRadius: "9999px",
//                   background: `linear-gradient(135deg,${t.brand},${t.accent})`,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: "0.78rem", fontWeight: 800, color: "#fff",
//                 }}>
//                   {(personal.firstName?.[0] || "S")}{(personal.lastName?.[0] || "K")}
//                 </div>
//                 <span className="pf-display" style={{ fontSize: "1.25rem", fontWeight: 700, color: t.text }}>
//                   {personal.firstName || "Saira"}
//                 </span>
//               </div>
//               <p style={{ fontSize: "0.875rem", color: t.textMuted, lineHeight: 1.75 }}>
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.
//               </p>
//             </div>

//             {/* Navigation */}
//             <div>
//               <h4 style={{ fontWeight: 700, color: t.text, marginBottom: "1rem", fontSize: "0.9375rem" }}>Navigation</h4>
//               <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
//                 {["Home", "Services", "Portfolio", "About", "Contact"].map((item) => (
//                   <li key={item}>
//                     <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: t.textMuted, textDecoration: "none", transition: "color 0.15s" }}
//                       onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = t.brand)}
//                       onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = t.textMuted)}>
//                       <ChevronRight style={{ height: "0.75rem", width: "0.75rem", color: t.brand }} />
//                       {item}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Contact */}
//             <div>
//               <h4 style={{ fontWeight: 700, color: t.text, marginBottom: "1rem", fontSize: "0.9375rem" }}>Contact</h4>
//               <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
//                 <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: t.textMuted }}>
//                   <Phone style={{ height: "0.875rem", width: "0.875rem", color: t.brand, flexShrink: 0 }} /> +(234) 567-8910
//                 </li>
//                 <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: t.textMuted }}>
//                   <Mail style={{ height: "0.875rem", width: "0.875rem", color: t.brand, flexShrink: 0 }} /> example@domain.com
//                 </li>
//                 {links.slice(0, 2).map((l) => (
//                   <li key={l.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: t.textMuted }}>
//                     <span style={{ color: t.brand, flexShrink: 0 }}>{getSocialIcon(l.socialType)}</span>
//                     <a href={l.url} target="_blank" rel="noreferrer"
//                       style={{ color: t.textMuted, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "150px" }}
//                       onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = t.brand)}
//                       onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = t.textMuted)}>
//                       {l.url}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Newsletter */}
//             <div>
//               <h4 style={{ fontWeight: 700, color: t.text, marginBottom: "1rem", fontSize: "0.9375rem" }}>Get the latest information</h4>
//               <p style={{ fontSize: "0.875rem", color: t.textMuted, marginBottom: "0.75rem", lineHeight: 1.6 }}>Lorem ipsum dolor sit amet, consectetur.</p>
//               <div style={{ display: "flex", gap: "0.5rem" }}>
//                 <input type="email" placeholder="Your email" className="pf-inp" style={{ flex: 1 }} />
//                 <button className="pf-btn" style={{ borderRadius: "0.5rem", padding: "0.5rem 0.875rem" }}>
//                   <ArrowUpRight style={ico} />
//                 </button>
//               </div>
//               {/* Social icons */}
//               <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.25rem" }}>
//                 {[Github, Twitter, Linkedin, Globe].map((Icon, i) => (
//                   <a key={i} href="#"
//                     style={{ height: "2rem", width: "2rem", borderRadius: "9999px", border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, transition: "all 0.2s", textDecoration: "none" }}
//                     onMouseEnter={(e) => {
//                       const el = e.currentTarget as HTMLElement;
//                       el.style.borderColor = t.brand;
//                       el.style.color = t.brand;
//                       el.style.background = t.accentSoft;
//                     }}
//                     onMouseLeave={(e) => {
//                       const el = e.currentTarget as HTMLElement;
//                       el.style.borderColor = t.border;
//                       el.style.color = t.textMuted;
//                       el.style.background = "transparent";
//                     }}>
//                     <Icon style={{ height: "0.875rem", width: "0.875rem" }} />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* bottom bar */}
//           <div style={{
//             borderTop: `1px solid ${t.border}`,
//             paddingTop: "1.5rem",
//             display: "flex", flexWrap: "wrap",
//             alignItems: "center", justifyContent: "space-between",
//             gap: "0.75rem", fontSize: "0.75rem", color: t.textFaint,
//           }}>
//             <p>Copyright © 2024 {personal.firstName || "Saira"}. All Rights Reserved.</p>
//             <div style={{ display: "flex", gap: "1.25rem" }}>
//               {["Terms & Service", "Privacy Policy"].map((label) => (
//                 <a key={label} href="#"
//                   style={{ color: t.textFaint, textDecoration: "none", transition: "color 0.15s" }}
//                   onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = t.brand)}
//                   onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = t.textFaint)}>
//                   {label}
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Profile;
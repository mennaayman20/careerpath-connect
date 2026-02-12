import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Trash2, User, Link as LinkIcon, FolderGit2, Briefcase, Code2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialLink { platform: string; url: string; }
interface Project { title: string; url: string; startDate: string; endDate: string; techStack: string[]; description: string; }
interface Experience { title: string; organization: string; startDate: string; endDate: string; description: string; }

const socialPlatforms = ["GitHub", "LinkedIn", "Portfolio", "Twitter", "Dribbble", "Behance"];
const skillCategories = ["Frontend", "Backend", "DevOps", "Design", "Data Science", "Mobile", "Other"];

const Profile = () => {
  const { toast } = useToast();
  const [personal, setPersonal] = useState({ firstName: "", lastName: "", university: "" });
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<{ category: string; name: string }[]>([]);
  const [newSkill, setNewSkill] = useState({ category: "Frontend", name: "" });

  const addSocial = () => setSocials([...socials, { platform: "GitHub", url: "" }]);
  const removeSocial = (i: number) => setSocials(socials.filter((_, idx) => idx !== i));

  const addProject = () => setProjects([...projects, { title: "", url: "", startDate: "", endDate: "", techStack: [], description: "" }]);
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));

  const addExperience = () => setExperiences([...experiences, { title: "", organization: "", startDate: "", endDate: "", description: "" }]);
  const removeExperience = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([...skills, { ...newSkill }]);
      setNewSkill({ ...newSkill, name: "" });
    }
  };
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));

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
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <LinkIcon className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Social Links</h2>
            </div>
            <Button variant="outline" size="sm" onClick={addSocial}><Plus className="mr-1 h-4 w-4" /> Add</Button>
          </div>
          {socials.map((s, i) => (
            <div key={i} className="mb-3 flex items-end gap-3">
              <div className="w-40">
                <Select value={s.platform} onValueChange={(v) => { const n = [...socials]; n[i].platform = v; setSocials(n); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{socialPlatforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex-1"><Input placeholder="https://…" value={s.url} onChange={(e) => { const n = [...socials]; n[i].url = e.target.value; setSocials(n); }} /></div>
              <Button variant="ghost" size="icon" onClick={() => removeSocial(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          {socials.length === 0 && <p className="text-sm text-muted-foreground">No social links added yet.</p>}
        </section>

        {/* Projects */}
        <section className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <FolderGit2 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Projects</h2>
            </div>
            <Button variant="outline" size="sm" onClick={addProject}><Plus className="mr-1 h-4 w-4" /> Add</Button>
          </div>
          {projects.map((p, i) => (
            <div key={i} className="mb-4 rounded-lg border border-border p-4">
              <div className="mb-2 flex justify-between"><span className="text-sm font-medium text-foreground">Project {i + 1}</span><Button variant="ghost" size="icon" onClick={() => removeProject(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Title</Label><Input className="mt-1" value={p.title} onChange={(e) => { const n = [...projects]; n[i].title = e.target.value; setProjects(n); }} /></div>
                <div><Label>URL</Label><Input className="mt-1" value={p.url} onChange={(e) => { const n = [...projects]; n[i].url = e.target.value; setProjects(n); }} /></div>
                <div><Label>Start Date</Label><Input className="mt-1" type="date" value={p.startDate} onChange={(e) => { const n = [...projects]; n[i].startDate = e.target.value; setProjects(n); }} /></div>
                <div><Label>End Date</Label><Input className="mt-1" type="date" value={p.endDate} onChange={(e) => { const n = [...projects]; n[i].endDate = e.target.value; setProjects(n); }} /></div>
                <div className="sm:col-span-2"><Label>Description</Label><Textarea className="mt-1" value={p.description} onChange={(e) => { const n = [...projects]; n[i].description = e.target.value; setProjects(n); }} /></div>
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
          {experiences.map((exp, i) => (
            <div key={i} className="mb-4 rounded-lg border border-border p-4">
              <div className="mb-2 flex justify-between"><span className="text-sm font-medium text-foreground">Experience {i + 1}</span><Button variant="ghost" size="icon" onClick={() => removeExperience(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Job Title</Label><Input className="mt-1" value={exp.title} onChange={(e) => { const n = [...experiences]; n[i].title = e.target.value; setExperiences(n); }} /></div>
                <div><Label>Organization</Label><Input className="mt-1" value={exp.organization} onChange={(e) => { const n = [...experiences]; n[i].organization = e.target.value; setExperiences(n); }} /></div>
                <div><Label>Start Date</Label><Input className="mt-1" type="date" value={exp.startDate} onChange={(e) => { const n = [...experiences]; n[i].startDate = e.target.value; setExperiences(n); }} /></div>
                <div><Label>End Date</Label><Input className="mt-1" type="date" value={exp.endDate} onChange={(e) => { const n = [...experiences]; n[i].endDate = e.target.value; setExperiences(n); }} /></div>
                <div className="sm:col-span-2"><Label>Description</Label><Textarea className="mt-1" value={exp.description} onChange={(e) => { const n = [...experiences]; n[i].description = e.target.value; setExperiences(n); }} /></div>
              </div>
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
            <Select value={newSkill.category} onValueChange={(v) => setNewSkill({ ...newSkill, category: v })}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>{skillCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Skill name" value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addSkill()} />
            <Button variant="outline" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <Badge key={i} variant="secondary" className="gap-1 pr-1">
                <span className="text-xs text-muted-foreground">{s.category}:</span> {s.name}
                <button onClick={() => removeSkill(i)} className="ml-1 rounded-full p-0.5 hover:bg-muted"><X className="h-3 w-3" /></button>
              </Badge>
            ))}
            {skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet.</p>}
          </div>
        </section>

        <Button className="gradient-primary border-0" size="lg" onClick={save}>Save Profile</Button>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

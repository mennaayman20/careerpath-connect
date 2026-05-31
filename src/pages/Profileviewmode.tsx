import { useState } from "react";
import {
  User, Briefcase, Code2, FolderGit2, LinkIcon,
  ExternalLink, Calendar, ChevronDown, ChevronUp,
  Github, Linkedin, Globe, Twitter
} from "lucide-react";
import { personal, Experience, Project, Skill, SocialLink } from "@/types/profile";

const GREEN = "#1ca37b";

// دالة ألوان المهارات المتناسقة
const getSkillStyle = (index: number) => {
  const styles = [
    { bg: "bg-emerald-500/5 text-emerald-600 border-emerald-500/20 hover:border-emerald-500/40", dot: "bg-emerald-500" },
    { bg: "bg-blue-500/5 text-blue-600 border-blue-500/20 hover:border-blue-500/40", dot: "bg-blue-500" },
    { bg: "bg-indigo-500/5 text-indigo-600 border-indigo-500/20 hover:border-indigo-500/40", dot: "bg-indigo-500" },
    { bg: "bg-purple-500/5 text-purple-600 border-purple-500/20 hover:border-purple-500/40", dot: "bg-purple-500" },
    { bg: "bg-amber-500/5 text-amber-600 border-amber-500/20 hover:border-amber-500/40", dot: "bg-amber-500" },
  ];
  return styles[index % styles.length];
};

const socialIcon = (type: string) => {
  const t = type?.toLowerCase();
  if (t === "github") return Github;
  if (t === "linkedin") return Linkedin;
  if (t === "twitter") return Twitter;
  return Globe;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const cap = (str?: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

// ترويسة السكاشن البارزة
const SectionHead = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3.5 mb-6 pb-3 border-b border-border">
    <div style={{ width: 4, height: 22, borderRadius: 4, background: GREEN }} className="flex-shrink-0 shadow-[0_0_12px_rgba(28,163,123,0.4)]" />
    <h2 className="font-display text-[19px] font-bold tracking-tight text-foreground">{label}</h2>
  </div>
);

const Chip = ({ label }: { label: string }) => (
  <span className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-secondary border border-border text-muted-foreground shadow-sm">
    {label}
  </span>
);

const Empty = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="rounded-2xl bg-card border border-border p-12 flex flex-col items-center gap-3 text-center shadow-sm">
    <Icon className="w-10 h-10 text-muted-foreground/30" />
    <p className="text-sm font-medium text-muted-foreground/70">{label}</p>
  </div>
);

// زر مخصص وموحد لإظهار/إخفاء الكروت الزائدة في السكاشن
const ShowMoreButton = ({ isExpanded, onClick }: { isExpanded: boolean; onClick: () => void }) => (
  <div className="flex justify-center mt-5 pt-2">
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-border bg-background hover:bg-secondary shadow-sm 
       text-[#342789] transition-all duration-200 focus:outline-none"
      
    >
      <span>{isExpanded ? "Show less" : "Show more"}</span>
      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
    </button>
  </div>
);

interface ProfileViewModeProps {
  personal: personal;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  links: SocialLink[];
  onEdit: () => void;
}

export const ProfileViewMode = ({
  personal, experiences, projects, skills, links,
}: ProfileViewModeProps) => {
  // حالات التحكم في عدد الكروت الظاهرة لكل سكشن بشكل مستقل
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const [expExpanded, setExpExpanded] = useState(false);
  const [projExpanded, setProjExpanded] = useState(false);
  const [linksExpanded, setLinksExpanded] = useState(false);

  // تحديد الكروت المراد عرضها بناءً على الحالة (الحد الأقصى الافتراضي هو 3 كروت)
  const visibleSkills = skillsExpanded ? skills : skills.slice(0, 11);
  const visibleExperiences = expExpanded ? experiences : experiences.slice(0, 3);
  const visibleProjects = projExpanded ? projects : projects.slice(0, 3);
  const visibleLinks = linksExpanded ? links : links.slice(0, 3);

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4">

      {/* ── SKILLS ─────────────────────────────────────────────── */}
      <section className="bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-border/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] pb-8 border-b border-border/60">
        <SectionHead label="Technical skills" />
        {skills.length === 0 ? (
          <Empty icon={Code2} label="No skills added yet." />
        ) : (
          <div>
            <div className="flex flex-wrap gap-2.5 transition-all duration-300">
              {visibleSkills.map((s, i) => {
                const { bg, dot } = getSkillStyle(i);
                return (
                  <span
                    key={s.skillId}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[13px] font-semibold border transition-all duration-200 cursor-default shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 ${bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot} shadow-[0_0_6px_rgba(0,0,0,0.1)]`} />
                    {s.skillName}
                  </span>
                );
              })}
            </div>
            
            {/* يظهر الزر هنا فقط إذا تجاوز عدد المهارات 7 عناصر */}
            {skills.length > 10 && (
              <ShowMoreButton
                isExpanded={skillsExpanded}
                onClick={() => setSkillsExpanded(!skillsExpanded)}
              />
            )}
          </div>
        )}
      </section>

      {/* ── EXPERIENCE ─────────────────────────────────────────── */}
      <section className="bg-card p-6 rounded-2xl border-2 border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <SectionHead label="Work experience" />
        {experiences.length === 0 ? (
          <Empty icon={Briefcase} label="No experience added yet." />
        ) : (
          <div className="relative pl-6 my-2">
            <div
              className="absolute left-[9px] top-3 bottom-3 w-px"
              style={{ background: `${GREEN}40` }}
            />
            <div className="space-y-5">
              {visibleExperiences.map((exp, i) => (
                <div key={exp.id ?? i} className="relative group animate-fadeIn">
                  <div
                    className="absolute -left-6 top-[20px] w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-125 z-10"
                    style={{
                      background: i === 0 ? GREEN : "var(--background)",
                      border: `2px solid ${GREEN}`,
                      boxShadow: i === 0 ? `0 0 0 5px ${GREEN}1a` : "none",
                    }}
                  />
                  <div className="rounded-xl bg-background border border-border px-6 py-5 shadow-sm hover:border-border hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                      <div>
                        <p className="text-[16px] font-bold text-foreground tracking-tight">{exp.title || "Untitled Position"}</p>
                        {exp.organization && (
                          <p className="text-sm font-bold mt-0.5" style={{ color: GREEN }}>{exp.organization}</p>
                        )}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg flex-shrink-0 border border-border/40">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {formatDate(exp.startDate)}
                            {exp.endDate ? ` — ${formatDate(exp.endDate)}` : " — Present"}
                          </span>
                        </div>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground/90 leading-relaxed font-normal whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* يظهر الزر فقط إذا كان إجمالي الخبرات أكبر من 3 */}
            {experiences.length > 3 && (
              <ShowMoreButton
                isExpanded={expExpanded}
                onClick={() => setExpExpanded(!expExpanded)}
              />
            )}
          </div>
        )}
      </section>

      {/* ── PROJECTS ───────────────────────────────────────────── */}
      <section className="bg-card p-6 rounded-2xl border-2 border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <SectionHead label="Projects" />
        {projects.length === 0 ? (
          <Empty icon={FolderGit2} label="No projects added yet." />
        ) : (
          <div>
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
              {visibleProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-xl bg-background border border-border p-5 flex flex-col gap-4 shadow-sm hover:border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fadeIn"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner border border-border/20 transition-colors duration-300 group-hover:bg-foreground/5"
                      style={{ background: `${GREEN}12` }}
                    >
                      <FolderGit2 className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" style={{ color: GREEN }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[16px] font-bold text-foreground group-hover:text-foreground truncate tracking-tight transition-colors">{proj.title}</p>
                      {proj.startDate && (
                        <p className="text-xs font-medium text-muted-foreground/80 mt-0.5">{formatDate(proj.startDate)}</p>
                      )}
                    </div>
                  </div>

                  {proj.description && (
                    <p className="text-sm text-muted-foreground/90 leading-relaxed font-normal">{proj.description}</p>
                  )}

                  {proj.technologies && (
                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                      {proj.technologies.split(/[,، ]/).filter(Boolean).slice(0, 4).map((t) => (
                        <Chip key={t} label={t.trim()} />
                      ))}
                    </div>
                  )}

                  {proj.projectUrl && (
                    <a
                      href={proj.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-bold hover:underline mt-2 pt-3 border-t border-border/60 w-fit"
                      style={{ color: GREEN }}
                    >
                      <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      <span>View project</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
            {/* يظهر الزر فقط إذا كان إجمالي المشاريع أكبر من 3 */}
            {projects.length > 5 && (
              <ShowMoreButton
                isExpanded={projExpanded}
                onClick={() => setProjExpanded(!projExpanded)}
              />
            )}
          </div>
        )}
      </section>

      {/* ── SOCIAL LINKS ───────────────────────────────────────── */}
      <section className="bg-card p-6 rounded-2xl border-2 border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <SectionHead label="Social links" />
        {links.length === 0 ? (
          <Empty icon={LinkIcon} label="No social links added yet." />
        ) : (
          <div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
              {visibleLinks.map((link) => {
                const Icon = socialIcon(link.socialType);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl bg-background border border-border px-5 py-4 shadow-sm hover:border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group no-underline animate-fadeIn"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner border border-border/20 transition-all duration-300 group-hover:scale-105"
                      style={{ background: `${GREEN}12` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: GREEN }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-extrabold text-muted-foreground/90 uppercase tracking-wider group-hover:text-muted-foreground transition-colors">
                        {cap(link.socialType)}
                      </p>
                      <p className="text-sm font-bold text-foreground/90 truncate mt-0.5">{link.url}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
                  </a>
                );
              })}
            </div>
            {/* يظهر الزر فقط إذا كان إجمالي الروابط أكبر من 3 */}
            {links.length > 3 && (
              <ShowMoreButton
                isExpanded={linksExpanded}
                onClick={() => setLinksExpanded(!linksExpanded)}
              />
            )}
          </div>
        )}
      </section>

    </div>
  );
};
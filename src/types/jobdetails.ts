export interface Skill {
  skillId: number;
  skillName: string;
}

export interface JobDetails {
  id: number;
  title: string;
  organizationName: string;
  type: string;
  seniority: string;
  model: string; // (e.g., Remote, On-site)
  status: string;
  jobSource:string;
  applicationLink:string;
  location: string;
  description: string;
  createdDate: string;
  skills: Skill[];
}
export interface Job {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: "Full-Time" | "Part-Time" | "Contract" | "Internship";
  hybrid: boolean;
  postedAt: string;
  status: "Open" | "Closed";
  description: string;
  skills: string[];
  matchPercentage?: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  organization: string;
  appliedAt: string;
  status: "Pending" | "Accepted" | "Rejected";
}

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    organization: "TechFlow Inc.",
    location: "San Francisco, CA",
    type: "Full-Time",
    hybrid: true,
    postedAt: "2 days ago",
    status: "Open",
    description: "We're looking for a senior frontend developer with expertise in React, TypeScript, and modern CSS frameworks. You'll lead the frontend architecture for our flagship product, mentoring junior developers and collaborating with design and backend teams.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "GraphQL"],
    matchPercentage: 92,
  },
  {
    id: "2",
    title: "Backend Engineer",
    organization: "DataStream Co.",
    location: "New York, NY",
    type: "Full-Time",
    hybrid: false,
    postedAt: "5 days ago",
    status: "Open",
    description: "Join our backend team to build scalable microservices and APIs. Experience with Node.js, PostgreSQL, and cloud infrastructure is essential.",
    skills: ["Node.js", "PostgreSQL", "AWS", "Docker", "REST APIs"],
    matchPercentage: 78,
  },
  {
    id: "3",
    title: "UI/UX Designer",
    organization: "CreativeHub",
    location: "Remote",
    type: "Contract",
    hybrid: false,
    postedAt: "1 week ago",
    status: "Open",
    description: "Design beautiful and intuitive user interfaces for web and mobile applications. Proficiency in Figma and understanding of design systems required.",
    skills: ["Figma", "UI Design", "Prototyping", "Design Systems", "User Research"],
    matchPercentage: 65,
  },
  {
    id: "4",
    title: "DevOps Engineer",
    organization: "CloudScale",
    location: "Austin, TX",
    type: "Full-Time",
    hybrid: true,
    postedAt: "3 days ago",
    status: "Open",
    description: "Manage and optimize our cloud infrastructure. Experience with Kubernetes, CI/CD pipelines, and monitoring tools is required.",
    skills: ["Kubernetes", "Docker", "CI/CD", "AWS", "Terraform"],
    matchPercentage: 70,
  },
  {
    id: "5",
    title: "Data Analyst Intern",
    organization: "InsightLab",
    location: "Chicago, IL",
    type: "Internship",
    hybrid: false,
    postedAt: "1 day ago",
    status: "Open",
    description: "Great opportunity for students to gain hands-on experience with data analysis, visualization, and reporting using Python and SQL.",
    skills: ["Python", "SQL", "Excel", "Data Visualization", "Statistics"],
    matchPercentage: 85,
  },
  {
    id: "6",
    title: "Mobile Developer",
    organization: "AppWorks Studio",
    location: "Seattle, WA",
    type: "Part-Time",
    hybrid: true,
    postedAt: "4 days ago",
    status: "Closed",
    description: "Build cross-platform mobile applications using React Native. Strong understanding of mobile UX patterns and performance optimization.",
    skills: ["React Native", "TypeScript", "iOS", "Android", "Firebase"],
    matchPercentage: 88,
  },
];

export const mockApplications: Application[] = [
  {
    id: "a1",
    jobId: "1",
    jobTitle: "Senior Frontend Developer",
    organization: "TechFlow Inc.",
    appliedAt: "Jan 15, 2026",
    status: "Pending",
  },
  {
    id: "a2",
    jobId: "5",
    jobTitle: "Data Analyst Intern",
    organization: "InsightLab",
    appliedAt: "Jan 10, 2026",
    status: "Accepted",
  },
  {
    id: "a3",
    jobId: "3",
    jobTitle: "UI/UX Designer",
    organization: "CreativeHub",
    appliedAt: "Jan 8, 2026",
    status: "Rejected",
  },
];

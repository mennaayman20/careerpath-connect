
import { N } from 'vitest/dist/chunks/environment.d.cL3nLXbE.js';
// interfaces/user-profile.interface.ts

export interface personal {
  id: number;
  firstName: string;
  lastName: string;
university?: string;
}

export interface SocialLinkRequest {
  url: string; // Required
  socialType?: string; // Optional
}

export interface SocialLink {
  id: number;
  url: string;
  socialType: string;
}

export interface Project {
  id: number; // Unique identifier for the project
  title: string; // Required
  description: string; // Required
  projectUrl?: string; 
  startDate: string; // Required (ISO format)
  endDate?: string; 
  technologies?: string; 
}

export interface ProjectRequest {
  title: string; // Required
  description: string; // Required
  projectUrl?: string; 
  startDate: string; // Required (ISO format)
  endDate?: string; 
  technologies?: string; 
}


export interface Experience { 
  id?: number; // Optional for creation, required for updates
  title: string; // Required
  organization: string; // Required
  startDate: string; // Required (ISO format)
  endDate?: string; 
  description: string; // Required
}
 
export interface ExperienceRequest {
  title: string; // Required
  organization: string; // Required
  startDate: string; // Required (ISO format)
  endDate?: string; 
  description: string; // Required
}



export interface Skill {
  skillId: number;
  skillName: string;
} 

export interface SkillRequest {

  skillName: string; // Required
}
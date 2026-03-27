
import {api} from "@/lib/api";
import { personal, SocialLinkRequest , SkillRequest , ExperienceRequest ,Experience, ProjectRequest, Project, SocialLink, Skill } from "@/types/profile";

export const userProfileService = {

  getUserProfile: async () => {
    const response = await api.get('/user/me');
    return response.data;
  }
  ,
  updateUserProfile: async (personalData: personal) => {
    const response = await api.put('/user/me', personalData)
    return response.data;
  }   ,

// skills


getUserSkills: async (): Promise<Skill[]> => {
  const response = await api.get('/user/me/skills');
  return response.data;
},

addSkill: async (skillName: SkillRequest): Promise<Skill> => {
  const response = await api.post('/user/me/skills', skillName);
  return response.data;
},

deleteSkill: async (skillId: number): Promise<void> => {
  // بنبعت الـ skillId في المسار
  await api.delete(`/user/me/skills/${skillId}`);
},


// experience
getUserExperiences: async (): Promise<Experience[]> => {
    const response = await api.get('/user/me/experiences');
    return response.data; // هنا الـ data هتكون مصفوفة من الـ Experience
  },

  getUserExperiencesbyId: async (): Promise<Experience[]> => {
    const response = await api.get('/user/me/experiences{$id}');
    return response.data; // هنا الـ data هتكون مصفوفة من الـ Experience
  },


  addUserExperience: async (experienceData: ExperienceRequest): Promise<Experience> => {
    const response = await api.post('/user/me/experiences', experienceData);
    return response.data;
  },

  updateUserExperience: async (experienceId: string | number, data: ExperienceRequest): Promise<Experience> => {
    const response = await api.put(`/user/me/experiences/${experienceId}`, data);
    return response.data;
  },

  deleteUserExperience: async (experienceId: string | number): Promise<void> => {
    await api.delete(`/user/me/experiences/${experienceId}`);
  },



  // projects
  // 1. جلب كل المشاريع
  // في ملف userProjectService.ts
getUserProjects: async (): Promise<Project[]> => {
    const response = await api.get('/user/me/projects');
    return response.data;
},

addUserProject: async (data: ProjectRequest): Promise<Project> => {
    const response = await api.post('/user/me/projects', data);
    return response.data;
},

updateUserProject: async (projectId: string | number, data: ProjectRequest): Promise<Project> => {
    const response = await api.put(`/user/me/projects/${projectId}`, data);
    return response.data;
},

deleteUserProject: async (projectId: string | number): Promise<void> => {
    await api.delete(`/user/me/projects/${projectId}`);
},

//social links

getUserSocialLinks: async (): Promise<SocialLink[]> => {
  const response = await api.get('/user/me/social-links');
  return response.data; // بترجع مصفوفة فيها { id, socialType, url }
},

addUserSocialLink: async (data: SocialLinkRequest): Promise<SocialLink> => {
  // بنبعت { "socialType": "GITHUB", "url": "..." }
  const response = await api.post('/user/me/social-links', data);
  return response.data;
},

updateUserSocialLink: async (socialId: number | string, data: SocialLinkRequest): Promise<SocialLink> => {
  // بنبعت الـ ID في الـ URL والبيانات الجديدة في الـ Body
  const response = await api.put(`/user/me/social-links/${socialId}`, data);
  return response.data;
},

deleteUserSocialLink: async (socialId: number | string): Promise<void> => {
  await api.delete(`/user/me/social-links/${socialId}`);
},







} 


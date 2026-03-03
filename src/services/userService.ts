
import {api} from "@/lib/api";
import { UserProfile, SocialLinkRequest , SkillRequest , ExperienceRequest ,Experience, ProjectRequest, Project, SocialLink, Skill } from "@/types/profile";

export const userProfileService = {

  getUserProfile: async () => {
    const response = await api.get('/api/user/me');
    return response.data;
  }
  ,
  updateUserProfile: async (profileData: UserProfile) => {
    const response = await api.put('/api/user/me', profileData)
    return response.data;
  }   ,

// skills


getUserSkills: async (): Promise<Skill[]> => {
  const response = await api.get('/api/user/me/skills');
  return response.data;
},

addSkill: async (skillName: SkillRequest): Promise<Skill> => {
  const response = await api.post('/api/user/me/skills', skillName);
  return response.data;
},

deleteSkill: async (skillId: number): Promise<void> => {
  // بنبعت الـ skillId في المسار
  await api.delete(`/api/user/me/skills/${skillId}`);
},


// experience
getUserExperiences: async (): Promise<Experience[]> => {
    const response = await api.get('/api/user/me/experiences');
    return response.data; // هنا الـ data هتكون مصفوفة من الـ Experience
  },

  addUserExperience: async (experienceData: ExperienceRequest): Promise<Experience> => {
    const response = await api.post('/api/user/me/experiences', experienceData);
    return response.data;
  },

  updateUserExperience: async (id: string | number, data: ExperienceRequest): Promise<Experience> => {
    const response = await api.put(`/api/user/me/experiences/${id}`, data);
    return response.data;
  },

  deleteUserExperience: async (id: string | number): Promise<void> => {
    await api.delete(`/api/user/me/experiences/${id}`);
  },



  // projects
  // 1. جلب كل المشاريع
  // في ملف userProjectService.ts
getUserProjects: async (): Promise<Project[]> => {
    const response = await api.get('/api/user/me/projects');
    return response.data;
},

addUserProject: async (data: ProjectRequest): Promise<Project> => {
    const response = await api.post('/api/user/me/projects', data);
    return response.data;
},

updateUserProject: async (projectId: string | number, data: ProjectRequest): Promise<Project> => {
    const response = await api.put(`/api/user/me/projects/${projectId}`, data);
    return response.data;
},

deleteUserProject: async (projectId: string | number): Promise<void> => {
    await api.delete(`/api/user/me/projects/${projectId}`);
},

//social links

getUserSocialLinks: async (): Promise<SocialLink[]> => {
  const response = await api.get('/api/user/me/social-links');
  return response.data; // بترجع مصفوفة فيها { id, socialType, url }
},

addUserSocialLink: async (data: SocialLinkRequest): Promise<SocialLink> => {
  // بنبعت { "socialType": "GITHUB", "url": "..." }
  const response = await api.post('/api/user/me/social-links', data);
  return response.data;
},

updateUserSocialLink: async (socialId: number | string, data: SocialLinkRequest): Promise<SocialLink> => {
  // بنبعت الـ ID في الـ URL والبيانات الجديدة في الـ Body
  const response = await api.put(`/api/user/me/social-links/${socialId}`, data);
  return response.data;
},

deleteUserSocialLink: async (socialId: number | string): Promise<void> => {
  await api.delete(`/api/user/me/social-links/${socialId}`);
},



// social links
// getUserSocialLinks: async () => {
//   const response = await api.get('/api/user/me/social-links');
//   return response.data;}
// ,
// addUserSocialLink: async (socialLinkData: SocialLinkRequest) => {
//   const response = await api.post('/api/user/me/social-links', socialLinkData);
//   return response.data;} ,


// addUserSocialLinkByType: async (socialType: string, socialLinkData: SocialLinkRequest) => {
//   const response = await api.post(`/api/user/me/social-links/${socialType}`, socialLinkData);
//   return response.data;} ,



// updateUserSocialLink: async (socialLinkId: string | number, socialLinkData: SocialLinkRequest) => {
//   const response = await api.put(`/api/user/me/social-links/${socialLinkId}`, socialLinkData);
//   return response.data;
// },

// deleteUserSocialLink: async (socialLinkId: string | number) => {
//   await api.delete(`/api/user/me/social-links/${socialLinkId}`); }



} 


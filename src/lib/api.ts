// Centralized API service - replace with real API calls when backend is ready
import { mockJobs, mockApplications, type Job, type Application } from "./mock-data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  // Jobs
  async getJobs(): Promise<Job[]> {
    await delay(300);
    return mockJobs;
  },
  async getJob(id: string): Promise<Job | undefined> {
    await delay(200);
    return mockJobs.find((j) => j.id === id);
  },
  async getMatchedJobs(): Promise<Job[]> {
    await delay(400);
    return mockJobs.filter((j) => j.matchPercentage && j.matchPercentage > 60).sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    await delay(300);
    return mockApplications;
  },
  async applyToJob(jobId: string): Promise<{ success: boolean }> {
    await delay(500);
    return { success: true };
  },

  // Auth (mock)
  async login(email: string, password: string): Promise<{ success: boolean; token?: string }> {
    await delay(500);
    if (email && password) return { success: true, token: "mock-token" };
    return { success: false };
  },
  async signup(data: { name: string; email: string; password: string }): Promise<{ success: boolean }> {
    await delay(500);
    return { success: true };
  },
  async forgotPassword(email: string): Promise<{ success: boolean }> {
    await delay(500);
    return { success: true };
  },
  async resetPassword(token: string, password: string): Promise<{ success: boolean }> {
    await delay(500);
    return { success: true };
  },
};

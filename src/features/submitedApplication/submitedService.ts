import { api } from "@/lib/api"; 
import { PaginatedApplications } from "./submitedInterface";

export const submitedService = {
  async getMyApplications(page = 0, size = 10): Promise<PaginatedApplications> {
    // استخدمي api مباشرة وشيلي <PaginatedApplications> من هنا لو لسه مدي لون أحمر
    const response = await api.get("/api/applications/me", {
      params: { page, size },
    });
    
    // إحنا بنأكد النوع هنا يدوي عشان نهرب من الـ Error بتاع Untyped function
    return response.data as PaginatedApplications; 
  },
};
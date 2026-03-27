import { api } from "@/lib/api";
import { RegisterRequest, LoginRequest, LoginResponse, ActivateParams } from "@/types/auth";
import axios from "axios";

// Register
export const registerUser = async (userData: RegisterRequest) => {
  return await api.post("/auth/register", userData);
};

// Login
export const loginUser = async (loginData: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", loginData);
  const token = response.data.token;
  if (token) {
    localStorage.setItem("token", token);
    
  }
  return response.data;
};

// Activate Account
export const activateAccount = async (token:string) => {
  const response = await api.get("/auth/activate", { params: { token } });
return response.data;
};
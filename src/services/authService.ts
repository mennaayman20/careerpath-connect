import { api } from "@/lib/api";
import { RegisterRequest, LoginRequest, LoginResponse, ActivateParams } from "@/types/auth";
import axios from "axios";

// Register
export const registerUser = async (userData: RegisterRequest) => {
  return await api.post("/api/auth/register", userData);
};

// Login
export const loginUser = async (loginData: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/api/auth/login", loginData);
  const token = response.data.token;
  if (token) {
    localStorage.setItem("token", token);
  }
  return response.data;
};

// Activate Account
export const activateAccount = async (token:string) => {
  const response = await api.get("/api/auth/activate", { params: { token } });
return response.data;
};
import { api } from "../../lib/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MeResponse,
} from "./auth.types";

export const login = (
  data: LoginRequest
) => {
  return api<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

export const register = (
  data: RegisterRequest
) => {
  return api<RegisterResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
};

export const getCurrentUser = (
  token: string
) => {
  return api<MeResponse>(
    "/auth/me",
    {
      method: "GET",
      token,
    }
  );
};
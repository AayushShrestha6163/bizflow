import { api } from "../lib/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  return api<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
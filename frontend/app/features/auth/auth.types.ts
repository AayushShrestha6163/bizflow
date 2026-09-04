export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "STAFF";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
}
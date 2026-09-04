import {
  login as loginApi,
  register as registerApi,
  getCurrentUser,
} from "./auth.api";

import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "./auth.types";

const TOKEN_KEY = "bizflow_token";
const USER_KEY = "bizflow_user";

export async function login(
  data: LoginRequest
) {
  const response = await loginApi(data);

  localStorage.setItem(
    TOKEN_KEY,
    response.token
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(response.user)
  );

  return response;
}

export async function register(
  data: RegisterRequest
) {
  const response = await registerApi(data);

  localStorage.setItem(
    TOKEN_KEY,
    response.token
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(response.user)
  );

  return response;
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser() {
  const token = getToken();

  if (!token) {
    return null;
  }

  const response =
    await getCurrentUser(token);

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(response.user)
  );

  return response.user;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
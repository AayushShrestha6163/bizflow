import { getToken } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type ApiOptions = RequestInit & {
  token?: string;
};

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, headers, ...fetchOptions } = options;

  // Use manually provided token first.
  // Otherwise get the logged-in user's token from localStorage.
  const authToken = token || getToken();

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",

        ...(authToken
          ? {
              Authorization: `Bearer ${authToken}`,
            }
          : {}),

        ...headers,
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Something went wrong. Please try again."
    );
  }

  return data;
}
"use server";

import { cookies } from "next/headers";
import type { SingleResponse, User } from "@/types/api";

const AUTH_COOKIE_NAME = "auth_token";

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function getCurrentUser() {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return null;
  }

  const response = await fetch(`${baseUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as SingleResponse<User>;
  return payload.data;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

import { env } from "../lib/env";
import type { UserProfile } from "./types";

async function cinebookRequest<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T | null> {
  const resp = await fetch(`${env.cinebookOpenUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
  if (!resp.ok) {
    const text = await resp.text();
    console.warn(
      `[cinebook] Request to ${path} failed (${resp.status}): ${text}`,
    );
    return null;
  }
  return resp.json() as Promise<T>;
}

export const users = {
  getProfile: (token: string) =>
    cinebookRequest<UserProfile>("/v1/users/me/profile", token),
};

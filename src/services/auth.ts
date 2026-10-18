import { apiFetch } from "@/lib/api";
import type {
  AuthTokens,
  EmailAvailabilityResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types";

export function login(credentials: LoginRequest): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export function getProfile(accessToken: string): Promise<User> {
  return apiFetch<User>("/auth/profile", { token: accessToken });
}

export function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  return apiFetch<AuthTokens>("/auth/refresh-token", {
    method: "POST",
    body: { refreshToken },
  });
}

export async function isEmailAvailable(email: string): Promise<boolean> {
  const res = await apiFetch<EmailAvailabilityResponse>("/users/is-available", {
    method: "POST",
    body: { email },
  });
  return res.isAvailable;
}

// The API requires an avatar URL when creating a user.
const DEFAULT_AVATAR = "https://picsum.photos/800";

export function register(
  data: Omit<RegisterRequest, "avatar"> & { avatar?: string },
): Promise<User> {
  return apiFetch<User>("/users", {
    method: "POST",
    body: { ...data, avatar: data.avatar || DEFAULT_AVATAR },
  });
}
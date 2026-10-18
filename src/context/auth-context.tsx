"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError } from "@/lib/api";
import { readStorage, removeStorage, writeStorage } from "@/lib/storage";
import {
  getProfile,
  login as loginRequest,
  refreshAccessToken,
} from "@/services/auth";
import type { LoginRequest, User } from "@/types";

const ACCESS_KEY = "auth-access-token";
const REFRESH_KEY = "auth-refresh-token";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function clearTokens() {
  removeStorage(ACCESS_KEY);
  removeStorage(REFRESH_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the session on first load; refresh the token if it has expired
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const access = readStorage<string | null>(ACCESS_KEY, null);
      const refresh = readStorage<string | null>(REFRESH_KEY, null);

      if (!access) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfile(access);
        if (!cancelled) setUser(profile);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401 && refresh) {
          try {
            const tokens = await refreshAccessToken(refresh);
            writeStorage(ACCESS_KEY, tokens.access_token);
            writeStorage(REFRESH_KEY, tokens.refresh_token);
            const profile = await getProfile(tokens.access_token);
            if (!cancelled) setUser(profile);
          } catch {
            clearTokens();
          }
        } else if (error instanceof ApiError && error.status === 401) {
          clearTokens();
        }
        // Other errors (e.g. network): keep tokens, user stays signed out for now
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const tokens = await loginRequest(credentials);
    const profile = await getProfile(tokens.access_token);
    writeStorage(ACCESS_KEY, tokens.access_token);
    writeStorage(REFRESH_KEY, tokens.refresh_token);
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
"use client";

// ============================================================================
// AUTH CONTEXT
// NextAuth 세션 관리 래퍼
// ============================================================================

import React, { createContext, useContext } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, AuthState } from "@/lib/types";

// Context Type
interface AuthContextType extends AuthState {
  logout: () => void;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // NextAuth 세션을 AuthState로 변환
  const authState: AuthState = {
    user: session?.user ? {
      id: session.user.id || "",
      name: session.user.name || "",
      email: session.user.email || "",
      // @ts-ignore
      githubUsername: session.user.username || session.user.email?.split('@')[0] || "",
      avatarUrl: session.user.image || "",
      role: "developer" as const,
      teams: [],
      lastLogin: new Date().toISOString(),
    } : null,
    isAuthenticated: !!session,
    isLoading: status === "loading",
  };

  // 로그아웃 함수
  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
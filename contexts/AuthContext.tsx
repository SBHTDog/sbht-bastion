"use client";

// ============================================================================
// AUTH CONTEXT
// 사용자 인증 상태 관리
// 디버깅: localStorage 및 React Context 사용
// ============================================================================

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState, debugLog } from "@/lib/types";
import { mockUsers } from "@/lib/mockData";

// Context Type
interface AuthContextType extends AuthState {
  login: (username: string) => Promise<boolean>;
  logout: () => void;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage Keys
const STORAGE_KEY = "sbht_auth_user";

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // 초기 로드: localStorage에서 사용자 정보 복원
  useEffect(() => {
    debugLog("AuthContext", "Initializing auth state");

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const user: User = JSON.parse(stored);
        debugLog("AuthContext", "User found in localStorage", user);

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        debugLog("AuthContext", "No user found in localStorage");
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("[AuthContext] Failed to restore user:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // 로그인 함수 (목 데이터)
  const login = async (username: string): Promise<boolean> => {
    debugLog("AuthContext", "Login attempt", { username });

    // 목 데이터에서 사용자 찾기
    const user = mockUsers.find((u) => u.githubUsername === username);

    if (!user) {
      debugLog("AuthContext", "User not found", { username });
      return false;
    }

    debugLog("AuthContext", "Login successful", user);

    // 상태 업데이트
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    // localStorage에 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    return true;
  };

  // 로그아웃 함수
  const logout = () => {
    debugLog("AuthContext", "Logout");

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
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

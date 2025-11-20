"use client";

// ============================================================================
// MOCK AUTH CONTEXT
// 목데이터를 사용한 테스트용 인증 컨텍스트
// ============================================================================

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "@/lib/types";
import { mockUsers } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

// Context Type
interface MockAuthContextType extends AuthState {
  login: (username: string) => Promise<boolean>;
  logout: () => void;
}

// Context 생성
const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================
export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기화 시 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const storedUser = localStorage.getItem("mockUser");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        debugLog("MockAuthContext", "Restored user from storage", userData);
        setUser(userData);
      } catch (error) {
        debugLog("MockAuthContext", "Failed to parse stored user", error);
        localStorage.removeItem("mockUser");
      }
    }
    setIsLoading(false);
  }, []);

  // 로그인 함수
  const login = async (username: string): Promise<boolean> => {
    debugLog("MockAuthContext", "Login attempt", { username });

    const mockUser = mockUsers.find(u => u.githubUsername === username);

    if (mockUser) {
      const userData: User = {
        ...mockUser
      };

      setUser(userData);
      localStorage.setItem("mockUser", JSON.stringify(userData));
      debugLog("MockAuthContext", "Login successful", userData);
      return true;
    }

    debugLog("MockAuthContext", "Login failed - user not found");
    return false;
  };

  // 로그아웃 함수
  const logout = () => {
    debugLog("MockAuthContext", "Logout");
    setUser(null);
    localStorage.removeItem("mockUser");
  };

  return (
    <MockAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================
export function useMockAuth() {
  const context = useContext(MockAuthContext);

  if (context === undefined) {
    throw new Error("useMockAuth must be used within a MockAuthProvider");
  }

  return context;
}
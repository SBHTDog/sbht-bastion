"use client";

// ============================================================================
// PROTECTED ROUTE
// 인증이 필요한 페이지를 보호하는 컴포넌트
// 디버깅: 리다이렉트 로직 명확화
// ============================================================================

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { debugLog } from "@/lib/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    debugLog("ProtectedRoute", "Check auth", {
      isAuthenticated,
      isLoading,
    });

    if (!isLoading && !isAuthenticated) {
      debugLog("ProtectedRoute", "Redirecting to login");
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="glass p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않음
  if (!isAuthenticated) {
    return null;
  }

  // 인증됨
  return <>{children}</>;
}

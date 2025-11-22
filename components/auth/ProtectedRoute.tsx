"use client";

// ============================================================================
// PROTECTED ROUTE
// Component that protects pages requiring authentication
// Debugging: Clarifying redirect logic
// ============================================================================

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMockAuth } from "@/contexts/MockAuthContext";
import { debugLog } from "@/lib/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();
  const mockAuth = useMockAuth();
  const router = useRouter();

  // OK if either MockAuth or Auth is authenticated
  const isAuthenticated = auth.isAuthenticated || mockAuth.isAuthenticated;
  const isLoading = auth.isLoading || mockAuth.isLoading;

  useEffect(() => {
    debugLog("ProtectedRoute", "Check auth", {
      authIsAuthenticated: auth.isAuthenticated,
      mockIsAuthenticated: mockAuth.isAuthenticated,
      isAuthenticated,
      isLoading,
    });

    if (!isLoading && !isAuthenticated) {
      debugLog("ProtectedRoute", "Redirecting to login");
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Loading
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

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated
  return <>{children}</>;
}

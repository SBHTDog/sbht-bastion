"use client";

// ============================================================================
// LOGIN PAGE
// GitHub 로그인 시뮬레이션 페이지 (목 데이터)
// 디버깅: 명확한 로그인 플로우
// ============================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { debugLog } from "@/lib/types";
import { mockUsers } from "@/lib/mockData";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedUser) {
      setError("사용자를 선택해주세요");
      return;
    }

    debugLog("LoginPage", "Attempting login", { selectedUser });
    setIsLoading(true);

    // 실제 API 호출 시뮬레이션 (1초 딜레이)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = await login(selectedUser);

    if (success) {
      debugLog("LoginPage", "Login successful, redirecting to dashboard");
      router.push("/dashboard");
    } else {
      debugLog("LoginPage", "Login failed");
      setError("로그인에 실패했습니다");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* 로그인 카드 */}
      <div className="glass max-w-md w-full p-8 relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600 inline-block mb-2">
            Deploy Monitor
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            GitHub으로 로그인
          </h1>
          <p className="text-gray-600">
            배포 모니터링을 시작하세요
          </p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* 사용자 선택 (목 데이터) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              테스트 계정 선택 (목 데이터)
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-lg text-gray-700 font-medium focus:border-blue-500 focus:outline-none transition-colors"
              disabled={isLoading}
            >
              <option value="">-- 사용자 선택 --</option>
              {mockUsers.map((user) => (
                <option key={user.id} value={user.githubUsername}>
                  {user.name} (@{user.githubUsername})
                </option>
              ))}
            </select>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full blue-gradient text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                로그인 중...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub으로 로그인
              </>
            )}
          </button>
        </form>

        {/* 안내 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ 목 데이터 테스트:</strong> 위 계정 중 하나를 선택하여 로그인하세요.
            실제 GitHub OAuth는 연결되지 않았습니다.
          </p>
        </div>

        {/* 홈으로 */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

// 프로젝트 생성 페이지
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { mockGitHubRepos } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoId = searchParams.get("repo");

  const repo = mockGitHubRepos.find((r) => r.id === repoId);
  const [projectName, setProjectName] = useState(repo?.name || "");
  const [branch, setBranch] = useState(repo?.defaultBranch || "main");
  const [environment, setEnvironment] = useState<"development" | "staging" | "production">(
    "production"
  );

  const handleCreate = () => {
    debugLog("NewProject", "Creating project", {
      projectName,
      branch,
      environment,
      repoId,
    });

    // 목 데이터이므로 실제 생성은 없고 바로 대시보드로 이동
    alert(`프로젝트 "${projectName}" 생성 완료! (목 데이터)`);
    router.push("/dashboard");
  };

  if (!repo) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
          <Card>
            <h1 className="text-xl font-bold text-gray-800 mb-4">레포지토리를 찾을 수 없습니다</h1>
            <Link href="/onboarding">
              <Button>레포지토리 선택으로 돌아가기</Button>
            </Link>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Deploy Monitor
            </Link>
          </div>
        </nav>

        <div className="container mx-auto p-8 max-w-2xl">
          {/* 헤더 */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2 text-gray-800">프로젝트 설정</h1>
            <p className="text-gray-600 text-lg">
              Repository: <strong>{repo.fullName}</strong>
            </p>
          </div>

          {/* 폼 */}
          <Card className="mb-8">
            <div className="space-y-6">
              {/* 프로젝트 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 이름
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-lg text-gray-700 font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* 브랜치 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">브랜치</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-lg text-gray-700 font-medium focus:border-blue-500 focus:outline-none"
                >
                  <option value="main">main</option>
                  <option value="develop">develop</option>
                  <option value="staging">staging</option>
                </select>
              </div>

              {/* 환경 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">배포 환경</label>
                <select
                  value={environment}
                  onChange={(e) =>
                    setEnvironment(e.target.value as "development" | "staging" | "production")
                  }
                  className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-lg text-gray-700 font-medium focus:border-blue-500 focus:outline-none"
                >
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>
          </Card>

          {/* 액션 */}
          <div className="flex gap-4">
            <Link href="/onboarding">
              <Button variant="ghost">← 뒤로</Button>
            </Link>
            <Button onClick={handleCreate} disabled={!projectName}>
              프로젝트 생성
            </Button>
          </div>

          {/* 안내 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ 목 데이터:</strong> 실제로 프로젝트가 생성되지는 않으며, 대시보드로
              이동합니다.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

// 프로젝트 상세 페이지
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { mockProjects, mockDeployments } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  debugLog("ProjectDetail", "Loading project", { projectId });

  const project = mockProjects.find((p) => p.id === projectId);
  const deployments = mockDeployments
    .filter((d) => d.projectId === projectId)
    .slice(0, 3); // 최근 3개만

  if (!project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
          <Card>
            <h1 className="text-xl font-bold text-gray-800 mb-4">프로젝트를 찾을 수 없습니다</h1>
            <Link href="/dashboard">
              <Button>대시보드로 돌아가기</Button>
            </Link>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const handleDeploy = () => {
    debugLog("ProjectDetail", "Starting deployment", { projectId });
    router.push(`/project/${projectId}/deploy`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Deploy Monitor
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/history" className="text-gray-600 hover:text-blue-600 font-medium">
                  History
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto p-8">
          {/* 프로젝트 헤더 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-800">{project.name}</h1>
              <Badge variant={project.status === "healthy" ? "success" : "error"}>
                {project.status}
              </Badge>
            </div>
            <p className="text-gray-600 text-lg mb-2">{project.description}</p>
            <p className="text-gray-500 text-sm">
              Repository: {project.repoFullName} • Branch: {project.branch}
            </p>
          </div>

          {/* 통계 */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <div className="text-gray-500 text-sm mb-2 font-medium">Total Deploys</div>
              <div className="text-4xl font-bold text-blue-600">{project.deployCount}</div>
            </Card>
            <Card>
              <div className="text-gray-500 text-sm mb-2 font-medium">Success Rate</div>
              <div className="text-4xl font-bold text-green-600">{project.successRate}%</div>
            </Card>
            <Card>
              <div className="text-gray-500 text-sm mb-2 font-medium">Last Deploy</div>
              <div className="text-2xl font-bold text-gray-700">{project.lastDeploy}</div>
            </Card>
          </div>

          {/* 배포 시작 버튼 */}
          <Card className="mb-12">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">새 배포 시작</h2>
                <p className="text-gray-600">
                  현재 브랜치: <strong>{project.branch}</strong>
                </p>
              </div>
              <Button onClick={handleDeploy} size="lg">
                🚀 배포 시작
              </Button>
            </div>
          </Card>

          {/* 최근 배포 */}
          <h2 className="text-3xl font-bold mb-6 text-gray-800">최근 배포</h2>
          <div className="space-y-4">
            {deployments.map((deploy) => (
              <Card key={deploy.id}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-800">{deploy.version}</span>
                      <Badge
                        variant={
                          deploy.status === "success"
                            ? "success"
                            : deploy.status === "failed"
                            ? "error"
                            : "warning"
                        }
                      >
                        {deploy.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {deploy.commitMessage} • {deploy.duration} • {deploy.author}
                    </p>
                  </div>
                  <Link href={`/project/${projectId}/reports/${deploy.id}`}>
                    <Button variant="ghost" size="sm">
                      상세 보기
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

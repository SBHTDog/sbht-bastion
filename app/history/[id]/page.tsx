"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useMockAuth } from "@/contexts/MockAuthContext";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

export default function HistoryDetailPage() {
  const params = useParams();
  const deploymentId = params.id as string;

  const auth = useAuth();
  const mockAuth = useMockAuth();
  const user = mockAuth.isAuthenticated ? mockAuth.user : auth.user;

  // 목데이터 - 실제로는 API에서 가져옴
  const deployment = {
    id: deploymentId,
    version: "v1.2.3",
    projectName: "frontend-app",
    branch: "main",
    status: Math.random() > 0.3 ? "success" : "failed",
    deployedAt: new Date().toISOString(),
    deployedBy: user?.name || "Unknown",
    duration: 180000, // 3분
    commitHash: "abc123def456",
    commitMessage: "feat: Add new deployment monitoring features"
  };

  // 빌드 타임라인 데이터
  const timeline = [
    { stage: "Checkout", duration: "5s", status: "success" },
    { stage: "Dependencies", duration: "45s", status: "success" },
    { stage: "Lint", duration: "12s", status: "success" },
    { stage: "Test", duration: "58s", status: deployment.status === "failed" ? "failed" : "success" },
    { stage: "Build", duration: deployment.status === "failed" ? "-" : "1m 20s", status: deployment.status === "failed" ? "skipped" : "success" },
    { stage: "Security Scan", duration: deployment.status === "failed" ? "-" : "30s", status: deployment.status === "failed" ? "skipped" : "success" },
    { stage: "Push ECR", duration: deployment.status === "failed" ? "-" : "15s", status: deployment.status === "failed" ? "skipped" : "success" },
    { stage: "Deploy", duration: deployment.status === "failed" ? "-" : "45s", status: deployment.status === "failed" ? "skipped" : "success" },
    { stage: "Health Check", duration: deployment.status === "failed" ? "-" : "10s", status: deployment.status === "failed" ? "skipped" : "success" },
  ];

  // Trivy 스캔 결과
  const trivyResults = {
    critical: 0,
    high: 2,
    medium: 5,
    low: 12,
    vulnerabilities: [
      {
        severity: "HIGH",
        cve: "CVE-2023-44487",
        package: "axios",
        version: "0.21.1",
        description: "HTTP/2 Rapid Reset Attack vulnerability",
        fixedVersion: "1.6.0"
      },
      {
        severity: "HIGH",
        cve: "CVE-2023-45857",
        package: "lodash",
        version: "4.17.19",
        description: "Prototype Pollution vulnerability",
        fixedVersion: "4.17.21"
      },
      {
        severity: "MEDIUM",
        cve: "CVE-2023-26159",
        package: "follow-redirects",
        version: "1.14.0",
        description: "Improper Input Validation",
        fixedVersion: "1.15.4"
      }
    ]
  };

  // Jenkins 로그 요약
  const jenkinsLogs = [
    { time: "14:23:45", level: "INFO", message: "Build started for frontend-app #42" },
    { time: "14:23:46", level: "INFO", message: "Checking out from git repository" },
    { time: "14:24:31", level: "INFO", message: "npm install completed successfully" },
    { time: "14:25:29", level: deployment.status === "failed" ? "ERROR" : "INFO",
      message: deployment.status === "failed" ? "Test failed: 2 test suites failed" : "All tests passed (142 tests)" },
    { time: "14:26:49", level: "INFO", message: deployment.status === "failed" ? "Build aborted due to test failure" : "Build completed successfully" },
  ];

  // ECS & Blue/Green 정보
  const ecsInfo = {
    taskDefinition: "frontend-app:42",
    revision: 42,
    service: "frontend-app-service",
    cluster: "production-cluster",
    desiredCount: 3,
    runningCount: deployment.status === "success" ? 3 : 0,
    cpu: "512",
    memory: "1024",
    containerImage: "123456789.dkr.ecr.ap-northeast-2.amazonaws.com/frontend-app:v1.2.3"
  };

  const blueGreenInfo = {
    deploymentId: "d-X9Y8Z7W6V5",
    deploymentGroup: "frontend-prod-deploy-group",
    blueTaskSet: "frontend-app:41",
    greenTaskSet: "frontend-app:42",
    trafficShift: deployment.status === "success" ? "100% → Green" : "0% → Green (Failed)",
    rollbackAvailable: deployment.status === "failed",
    startTime: new Date(Date.now() - 180000).toISOString(),
    endTime: new Date().toISOString()
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Deploy Monitor
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/history" className="text-blue-600 font-bold">
                  History
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-800">배포 상세 정보</h1>
                <Badge variant={deployment.status === "success" ? "success" : "error"}>
                  {deployment.status}
                </Badge>
              </div>
              <Link href="/history">
                <Button variant="secondary">← 목록으로</Button>
              </Link>
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-gray-500 text-sm">버전</span>
                <p className="text-lg font-bold text-gray-800">{deployment.version}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">프로젝트</span>
                <p className="text-lg font-bold text-gray-800">{deployment.projectName}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">브랜치</span>
                <p className="text-lg font-bold text-gray-800">{deployment.branch}</p>
              </div>
            </div>
          </div>

          {/* 빌드 타임라인 */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 빌드 타임라인</h2>
            <div className="space-y-3">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-32 font-medium text-gray-700">{item.stage}</div>
                  <div className="flex-1">
                    <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                          item.status === "success"
                            ? "bg-green-500"
                            : item.status === "failed"
                            ? "bg-red-500"
                            : "bg-gray-400"
                        }`}
                        style={{
                          width: item.status === "skipped" ? "0%" : "100%",
                          transition: "width 1s ease-out",
                        }}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-sm font-medium">
                        {item.duration}
                      </span>
                    </div>
                  </div>
                  <div className="w-20">
                    {item.status === "success" && <span className="text-green-600">✓</span>}
                    {item.status === "failed" && <span className="text-red-600">✕</span>}
                    {item.status === "skipped" && <span className="text-gray-400">-</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">총 소요시간</span>
                <span className="font-bold text-gray-800">
                  {Math.floor(deployment.duration / 60000)}분 {Math.floor((deployment.duration % 60000) / 1000)}초
                </span>
              </div>
            </div>
          </Card>

          {/* Trivy 스캔 결과 */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🛡️ Trivy 보안 스캔 결과</h2>

            {/* 요약 */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{trivyResults.critical}</div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{trivyResults.high}</div>
                <div className="text-sm text-gray-600">High</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{trivyResults.medium}</div>
                <div className="text-sm text-gray-600">Medium</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{trivyResults.low}</div>
                <div className="text-sm text-gray-600">Low</div>
              </div>
            </div>

            {/* 주요 취약점 */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800">주요 취약점</h3>
              {trivyResults.vulnerabilities.map((vuln, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-bold text-gray-800">{vuln.cve}</span>
                    <Badge variant={vuln.severity === "HIGH" ? "error" : "warning"}>
                      {vuln.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{vuln.description}</p>
                  <div className="text-xs text-gray-600">
                    📦 {vuln.package}@{vuln.version} → {vuln.fixedVersion}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Jenkins 로그 요약 */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Jenkins 로그 요약</h2>
            <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
              {jenkinsLogs.map((log, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-gray-500">[{log.time}]</span>
                  <span className={
                    log.level === "ERROR" ? "text-red-400" :
                    log.level === "WARN" ? "text-yellow-400" :
                    "text-green-400"
                  }>
                    [{log.level}]
                  </span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ECS & Blue/Green 정보 */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* ECS Task Revision */}
            <Card>
              <h3 className="text-xl font-bold mb-4 text-gray-800">📦 ECS Task Revision</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Task Definition</span>
                  <span className="font-mono font-bold">{ecsInfo.taskDefinition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revision</span>
                  <span className="font-mono font-bold text-blue-600">#{ecsInfo.revision}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-mono">{ecsInfo.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cluster</span>
                  <span className="font-mono">{ecsInfo.cluster}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasks</span>
                  <span className={`font-bold ${ecsInfo.runningCount === ecsInfo.desiredCount ? 'text-green-600' : 'text-red-600'}`}>
                    {ecsInfo.runningCount}/{ecsInfo.desiredCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CPU/Memory</span>
                  <span className="font-mono">{ecsInfo.cpu}/{ecsInfo.memory}</span>
                </div>
                <div className="mt-3 p-2 bg-gray-100 rounded break-all">
                  <span className="text-xs text-gray-600">Image: </span>
                  <code className="text-xs">{ecsInfo.containerImage}</code>
                </div>
              </div>
            </Card>

            {/* Blue/Green 라우팅 */}
            <Card>
              <h3 className="text-xl font-bold mb-4 text-gray-800">🔄 Blue/Green 배포</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deployment ID</span>
                  <span className="font-mono font-bold">{blueGreenInfo.deploymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deploy Group</span>
                  <span className="font-mono">{blueGreenInfo.deploymentGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blue (이전)</span>
                  <span className="font-mono text-blue-600">{blueGreenInfo.blueTaskSet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Green (신규)</span>
                  <span className="font-mono text-green-600">{blueGreenInfo.greenTaskSet}</span>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-bold text-gray-700 mb-2">트래픽 라우팅</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${deployment.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: deployment.status === 'success' ? '100%' : '0%' }}
                      />
                    </div>
                    <span className="text-xs font-bold">{blueGreenInfo.trafficShift}</span>
                  </div>
                </div>
                {blueGreenInfo.rollbackAvailable && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <span className="text-xs text-yellow-800">⚠️ 롤백 가능</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="flex gap-4 justify-center">
            <Link href="/history">
              <Button size="lg" variant="secondary" className="px-8">
                목록으로 돌아가기
              </Button>
            </Link>
            {deployment.status === "failed" && (
              <Link href={`/project/${deployment.projectName}/deploy`}>
                <Button size="lg" className="px-8">
                  다시 배포하기
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
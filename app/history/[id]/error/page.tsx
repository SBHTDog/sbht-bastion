"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useMockAuth } from "@/contexts/MockAuthContext";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";

export default function HistoryErrorPage() {
  const params = useParams();
  const router = useRouter();
  const deploymentId = params.id as string;

  const auth = useAuth();
  const mockAuth = useMockAuth();
  const user = mockAuth.isAuthenticated ? mockAuth.user : auth.user;

  // 목데이터 - 실패한 배포 정보
  const failedDeployment = {
    id: deploymentId,
    version: "v1.2.3",
    projectName: "frontend-app",
    projectId: "project-1",
    branch: "main",
    status: "failed",
    deployedAt: new Date(Date.now() - 3600000).toISOString(), // 1시간 전
    deployedBy: user?.name || "Unknown",
    failedStage: "Test",
    failureTime: new Date(Date.now() - 3000000).toISOString(), // 50분 전
    commitHash: "abc123def456",
    commitMessage: "feat: Add new deployment monitoring features"
  };

  // 실패 단계 정보
  const stageInfo = {
    stage: failedDeployment.failedStage,
    stageNumber: 4,
    totalStages: 9,
    duration: "58s",
    errorCode: "TEST_FAILURE",
    timestamp: failedDeployment.failureTime
  };

  // LLM 분석 결과
  const llmAnalysis = {
    summary: `배포가 ${stageInfo.stage} 단계에서 실패했습니다. 단위 테스트 중 2개의 테스트 스위트가 실패했으며, 주요 원인은 Header 컴포넌트의 props 타입 불일치와 환경 변수 미설정으로 분석됩니다.`,

    rootCause: [
      {
        title: "테스트 환경 설정 오류",
        description: "Header.test.tsx에서 예상하는 'Deploy Monitor' 타이틀이 실제로는 'Deploy Monitor Beta'로 렌더링되고 있습니다.",
        severity: "high",
        code: `Expected: "Deploy Monitor"\nReceived: "Deploy Monitor Beta"`
      },
      {
        title: "환경 변수 누락",
        description: "테스트 환경에서 NEXT_PUBLIC_APP_TITLE 환경 변수가 설정되지 않아 undefined 에러가 발생했습니다.",
        severity: "medium",
        code: `Cannot read property 'user' of undefined\nat Header.test.tsx:45`
      }
    ],

    suggestions: [
      {
        priority: "높음",
        action: "테스트 케이스 업데이트",
        description: "Header.test.tsx의 기대값을 현재 구현과 일치하도록 수정하세요.",
        command: `jest.mock('@/config', () => ({
  APP_TITLE: 'Deploy Monitor Beta'
}))`
      },
      {
        priority: "중간",
        action: "환경 변수 설정",
        description: ".env.test 파일에 필요한 환경 변수를 추가하세요.",
        command: `NEXT_PUBLIC_APP_TITLE="Deploy Monitor Beta"
NEXT_PUBLIC_API_URL="http://localhost:3000"`
      },
      {
        priority: "낮음",
        action: "의존성 버전 확인",
        description: "@testing-library/react 버전과 React 버전 호환성을 확인하세요.",
        command: "npm list @testing-library/react react"
      }
    ],

    confidence: 92 // AI 분석 신뢰도
  };

  // 취약점 요약
  const vulnerabilities = {
    summary: "보안 스캔에서 2개의 HIGH, 5개의 MEDIUM 취약점이 발견되었습니다.",
    high: [
      {
        cve: "CVE-2023-44487",
        package: "axios@0.21.1",
        description: "HTTP/2 Rapid Reset Attack - DoS 취약점",
        fixVersion: "1.6.0",
        impact: "서비스 거부 공격 가능"
      },
      {
        cve: "CVE-2023-45857",
        package: "lodash@4.17.19",
        description: "Prototype Pollution - 코드 실행 취약점",
        fixVersion: "4.17.21",
        impact: "원격 코드 실행 가능"
      }
    ],
    medium: [
      {
        cve: "CVE-2023-26159",
        package: "follow-redirects@1.14.0",
        description: "입력 검증 미흡",
        fixVersion: "1.15.4"
      },
      {
        cve: "CVE-2023-28155",
        package: "request@2.88.0",
        description: "SSRF 취약점",
        fixVersion: "deprecated"
      },
      {
        cve: "CVE-2023-26136",
        package: "tough-cookie@2.5.0",
        description: "정규식 DoS",
        fixVersion: "4.1.3"
      }
    ],
    critical: 0,
    low: 12
  };

  // 에러 로그
  const errorLogs = [
    { time: "14:24:48", level: "INFO", message: "Running test suites..." },
    { time: "14:25:03", level: "ERROR", message: "FAIL src/components/Header.test.tsx" },
    { time: "14:25:03", level: "ERROR", message: "  ✕ renders correct title (45ms)" },
    { time: "14:25:03", level: "ERROR", message: "  ✕ shows user menu when logged in (23ms)" },
    { time: "14:25:04", level: "ERROR", message: "Test Suites: 2 failed, 8 passed, 10 total" },
    { time: "14:25:04", level: "ERROR", message: "Tests: 2 failed, 140 passed, 142 total" },
    { time: "14:25:04", level: "FATAL", message: "npm ERR! Test failed. Exit code: 1" },
    { time: "14:25:04", level: "INFO", message: "Build aborted due to test failure" }
  ];

  const handleRetry = () => {
    router.push(`/project/${failedDeployment.projectId}/deploy`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-sm border-b border-red-100 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-red-600">
                Deploy Monitor
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/dashboard" className="text-gray-600 hover:text-red-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/history" className="text-red-600 font-bold">
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
                <h1 className="text-4xl font-bold text-gray-800">배포 실패 분석</h1>
                <Badge variant="error">Failed</Badge>
              </div>
              <Link href="/history">
                <Button variant="secondary">← 목록으로</Button>
              </Link>
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <span className="text-gray-500 text-sm">버전</span>
                <p className="text-lg font-bold text-gray-800">{failedDeployment.version}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">프로젝트</span>
                <p className="text-lg font-bold text-gray-800">{failedDeployment.projectName}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">브랜치</span>
                <p className="text-lg font-bold text-gray-800">{failedDeployment.branch}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">실패 시간</span>
                <p className="text-lg font-bold text-red-600">
                  {new Date(failedDeployment.failureTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* 실패 단계 정보 */}
          <Card className="mb-8 border-2 border-red-300 bg-red-50">
            <h2 className="text-2xl font-bold mb-6 text-red-700">❌ 실패 단계</h2>

            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{stageInfo.stageNumber}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{stageInfo.stage}</h3>
                    <p className="text-gray-600">단계 {stageInfo.stageNumber} / {stageInfo.totalStages}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">에러 코드</div>
                  <div className="text-lg font-mono font-bold text-red-600">{stageInfo.errorCode}</div>
                </div>
              </div>

              {/* 진행 바 */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full"
                  style={{ width: `${(stageInfo.stageNumber / stageInfo.totalStages) * 100}%` }}
                />
              </div>

              <div className="text-sm text-gray-600">
                소요 시간: {stageInfo.duration} •
                실패 시각: {new Date(stageInfo.timestamp).toLocaleString()}
              </div>
            </div>
          </Card>

          {/* LLM 분석 */}
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🤖 AI 실패 원인 분석</h2>
              <Badge variant="success">신뢰도 {llmAnalysis.confidence}%</Badge>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">{llmAnalysis.summary}</p>
            </div>

            {/* 근본 원인 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 text-gray-800">근본 원인</h3>
              <div className="space-y-3">
                {llmAnalysis.rootCause.map((cause, index) => (
                  <div key={index} className="border-l-4 border-red-400 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800">{cause.title}</h4>
                      <Badge variant={cause.severity === "high" ? "error" : "warning"}>
                        {cause.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{cause.description}</p>
                    {cause.code && (
                      <pre className="bg-gray-900 text-red-400 p-2 rounded text-xs overflow-x-auto">
                        {cause.code}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 개선 제안 */}
            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-800">💡 개선 제안</h3>
              <div className="space-y-3">
                {llmAnalysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold">#{index + 1}</span>
                        <h4 className="font-bold text-gray-800">{suggestion.action}</h4>
                      </div>
                      <Badge
                        variant={
                          suggestion.priority === "높음" ? "error" :
                          suggestion.priority === "중간" ? "warning" :
                          "default"
                        }
                      >
                        우선순위: {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    {suggestion.command && (
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                        {suggestion.command}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 취약점 요약 */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🛡️ 보안 취약점 요약</h2>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <p className="text-yellow-800">{vulnerabilities.summary}</p>
            </div>

            {/* 취약점 통계 */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{vulnerabilities.critical}</div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{vulnerabilities.high.length}</div>
                <div className="text-sm text-gray-600">High</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{vulnerabilities.medium.length}</div>
                <div className="text-sm text-gray-600">Medium</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{vulnerabilities.low}</div>
                <div className="text-sm text-gray-600">Low</div>
              </div>
            </div>

            {/* HIGH 취약점 상세 */}
            {vulnerabilities.high.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-red-700 mb-3">🔴 HIGH 취약점</h3>
                <div className="space-y-2">
                  {vulnerabilities.high.map((vuln, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono font-bold text-red-700">{vuln.cve}</span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">HIGH</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{vuln.description}</p>
                      <div className="text-xs text-gray-600">
                        📦 {vuln.package} → {vuln.fixVersion}
                      </div>
                      {vuln.impact && (
                        <div className="text-xs text-red-600 mt-1">⚠️ {vuln.impact}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MEDIUM 취약점 요약 */}
            {vulnerabilities.medium.length > 0 && (
              <div>
                <h3 className="font-bold text-yellow-700 mb-3">🟡 MEDIUM 취약점 ({vulnerabilities.medium.length}개)</h3>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <ul className="text-sm text-gray-700 space-y-1">
                    {vulnerabilities.medium.map((vuln, index) => (
                      <li key={index}>
                        • {vuln.cve}: {vuln.package} - {vuln.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>

          {/* 에러 로그 */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 에러 로그</h2>
            <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
              {errorLogs.map((log, index) => (
                <div key={index} className="flex gap-3">
                  <span className="text-gray-500">[{log.time}]</span>
                  <span className={
                    log.level === "ERROR" || log.level === "FATAL" ? "text-red-400" :
                    log.level === "WARN" ? "text-yellow-400" :
                    "text-green-400"
                  }>
                    [{log.level}]
                  </span>
                  <span className={log.level === "ERROR" || log.level === "FATAL" ? "text-red-300" : ""}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* 액션 버튼 */}
          <div className="flex gap-4 justify-center">
            <Link href="/history">
              <Button size="lg" variant="secondary" className="px-8">
                목록으로 돌아가기
              </Button>
            </Link>
            <Link href={`/history/${deploymentId}`}>
              <Button size="lg" variant="secondary" className="px-8">
                전체 상세보기
              </Button>
            </Link>
            <Button
              size="lg"
              onClick={handleRetry}
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              🔄 다시 배포하기
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
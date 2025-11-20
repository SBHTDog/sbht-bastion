"use client";

// 배포 상세 리포트 페이지
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { mockProjects, mockDeploymentDetails } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

export default function DeployReportPage() {
  const params = useParams();
  const projectId = params.id as string;
  const deployId = params.deployId as string;

  debugLog("DeployReport", "Loading report", { projectId, deployId });

  const project = mockProjects.find((p) => p.id === projectId);
  const detail = mockDeploymentDetails[deployId];

  if (!detail) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
          <Card>
            <h1 className="text-xl font-bold text-gray-800 mb-4">리포트를 찾을 수 없습니다</h1>
            <Link href={`/project/${projectId}`}>
              <Button>프로젝트로 돌아가기</Button>
            </Link>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const { deployment, analysis, llmAnalysis } = detail;
  const isSuccess = deployment.status === "success";

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
                <Link href={`/project/${projectId}`} className="text-gray-600 hover:text-blue-600 font-medium">
                  Project
                </Link>
                <Link href="/history" className="text-blue-600 font-bold">
                  History
                </Link>
                <Link href={`/project/${projectId}/deploy`} className="text-gray-600 hover:text-blue-600 font-medium">
                  Deploy
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto p-8">
          {/* 헤더 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-800">배포 리포트</h1>
              <Badge variant={isSuccess ? "success" : "error"}>{deployment.status}</Badge>
            </div>
            <p className="text-gray-600 text-lg">
              {project?.name} • {deployment.version} • {deployment.branch}
            </p>
          </div>

          {/* LLM 분석 */}
          {llmAnalysis && (
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">🤖 AI 분석</h2>
              <p className="text-gray-700 mb-4">{llmAnalysis.summary}</p>
              {llmAnalysis.failureReason && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-bold text-red-800 mb-2">실패 원인:</h3>
                  <p className="text-red-700">{llmAnalysis.failureReason}</p>
                </div>
              )}
              <div>
                <h3 className="font-bold text-gray-800 mb-2">
                  {isSuccess ? "최적화 제안:" : "개선 방안:"}
                </h3>
                <ul className="space-y-2">
                  {(llmAnalysis.recommendations || llmAnalysis.optimizations || []).map(
                    (item, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </Card>
          )}

          {/* 성공 케이스 */}
          {isSuccess && analysis.jobs && (
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">⏱️ Job별 소요 시간</h2>
              <div className="space-y-3">
                {analysis.jobs.map((job, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-800">{job.name}</span>
                    <span className="text-blue-600 font-bold">{job.duration}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 실패 케이스 */}
          {!isSuccess && (
            <>
              {/* 테스트 실패 */}
              {analysis.tests && (
                <Card className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">🧪 테스트 결과</h2>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">전체</div>
                      <div className="text-2xl font-bold text-gray-800">{analysis.tests.total}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">통과</div>
                      <div className="text-2xl font-bold text-green-600">{analysis.tests.passed}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">실패</div>
                      <div className="text-2xl font-bold text-red-600">{analysis.tests.failed}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-800">실패한 테스트:</h3>
                    {analysis.tests.failedTests.map((test, idx) => (
                      <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="font-medium text-red-800 mb-1">{test.name}</div>
                        <pre className="text-xs text-red-700 overflow-x-auto">{test.error}</pre>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Trivy 취약점 */}
              {analysis.trivy && (
                <Card className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">🛡️ 보안 스캔 (Trivy)</h2>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Critical</div>
                      <div className="text-2xl font-bold text-red-600">{analysis.trivy.critical}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">High</div>
                      <div className="text-2xl font-bold text-orange-600">{analysis.trivy.high}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Medium</div>
                      <div className="text-2xl font-bold text-yellow-600">{analysis.trivy.medium}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Low</div>
                      <div className="text-2xl font-bold text-blue-600">{analysis.trivy.low}</div>
                    </div>
                  </div>
                  {analysis.trivy.vulnerabilities.slice(0, 3).map((vuln, idx) => (
                    <div key={idx} className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-orange-800">{vuln.cve}</span>
                        <Badge variant="error">{vuln.severity}</Badge>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">{vuln.description}</div>
                      <div className="text-xs text-gray-600">
                        {vuln.package}@{vuln.version} → {vuln.fixedVersion || "패치 없음"}
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </>
          )}

          {/* 공유 버튼 */}
          <Card className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">리포트 공유</h3>
                <p className="text-gray-600 text-sm">팀원과 배포 결과를 공유하세요</p>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("링크가 복사되었습니다!");
                }}
              >
                📤 링크 복사
              </Button>
            </div>
          </Card>

          {/* 추가 액션 버튼들 */}
          <div className="flex gap-4 justify-center">
            <Link href={`/project/${projectId}`}>
              <Button size="lg" variant="secondary" className="px-8">
                프로젝트로 돌아가기
              </Button>
            </Link>
            <Link href="/history">
              <Button size="lg" variant="secondary" className="px-8">
                배포 히스토리 보기
              </Button>
            </Link>
            {!isSuccess && (
              <Link href={`/project/${projectId}/deploy`}>
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

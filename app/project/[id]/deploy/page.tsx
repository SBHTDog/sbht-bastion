"use client";

// 배포 실시간 모니터링 페이지
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { mockProjects, mockDeployments } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

export default function DeployPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const project = mockProjects.find((p) => p.id === projectId);
  const deploymentTemplate = mockDeployments[0]; // 템플릿으로 사용

  const stages = [
    { name: "Checkout", duration: 5000 },
    { name: "Dependencies", duration: 8000 },
    { name: "Lint", duration: 3000 },
    { name: "Test", duration: 10000 },
    { name: "Build", duration: 15000 },
    { name: "Security Scan", duration: 5000 },
    { name: "Push ECR", duration: 3000 },
    { name: "Deploy", duration: 8000 },
    { name: "Health Check", duration: 3000 },
  ];

  // 배포 시뮬레이션
  useEffect(() => {
    if (currentStage >= stages.length) {
      setIsComplete(true);
      debugLog("Deploy", "Deployment complete", { projectId });

      // 3초 후 리포트 페이지로 이동
      setTimeout(() => {
        router.push(`/project/${projectId}/reports/deploy-1`);
      }, 3000);
      return;
    }

    const stage = stages[currentStage];
    debugLog("Deploy", "Stage started", { stage: stage.name });

    // 로그 추가
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ⏳ ${stage.name} 시작...`]);

    const timer = setTimeout(() => {
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ✅ ${stage.name} 완료`]);
      setCurrentStage((prev) => prev + 1);
    }, stage.duration);

    return () => clearTimeout(timer);
  }, [currentStage, projectId, router]);

  const progress = ((currentStage / stages.length) * 100).toFixed(0);

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

        <div className="container mx-auto p-8">
          {/* 헤더 */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">배포 진행 중</h1>
            <p className="text-gray-600 text-lg">
              {project?.name} • {project?.branch} branch
            </p>
          </div>

          {/* 야구 전광판 스코어보드 */}
          <Card className="mb-8 bg-gray-900 border-4 border-gray-700">
            {/* 스코어보드 헤더 */}
            <div className="text-center mb-6 pb-4 border-b-2 border-gray-700">
              <div className="text-yellow-400 text-sm font-bold mb-2">DEPLOYMENT SCOREBOARD</div>
              <div className="flex justify-center gap-8 items-center">
                <Badge variant={isComplete ? "success" : "warning"}>
                  {isComplete ? "COMPLETE" : "IN PROGRESS"}
                </Badge>
                <div className="text-white font-mono text-lg">
                  {project?.name} • {project?.branch}
                </div>
              </div>
            </div>

            {/* 스코어보드 테이블 */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="text-yellow-400 text-xs font-bold py-2 px-4 border border-gray-700 text-left w-32">
                      STAGE
                    </th>
                    {[1, 2, 3, 4, 5].map((inning) => (
                      <th
                        key={inning}
                        className="text-yellow-400 text-xs font-bold py-2 px-3 border border-gray-700 text-center min-w-[80px]"
                      >
                        {inning}회
                      </th>
                    ))}
                    <th className="text-yellow-400 text-xs font-bold py-2 px-4 border border-gray-700 text-center w-20">
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* 초 (Top) */}
                  <tr className="bg-gray-800/50">
                    <td className="text-white font-mono text-sm py-3 px-4 border border-gray-700 font-bold">
                      ▲ 초
                    </td>
                    {[0, 2, 4, 6, 8].map((stageIndex, inning) => {
                      const stage = stages[stageIndex];
                      const isPast = stageIndex < currentStage;
                      const isCurrent = stageIndex === currentStage;

                      return (
                        <td
                          key={inning}
                          className={`border border-gray-700 text-center py-3 px-3 font-mono transition-all ${
                            isCurrent
                              ? "bg-yellow-400 text-gray-900 animate-pulse"
                              : isPast
                              ? "bg-green-600 text-white"
                              : "bg-gray-900 text-gray-600"
                          }`}
                        >
                          {stage ? (
                            <div>
                              <div className="text-xs font-bold mb-1">
                                {isPast ? "✓" : isCurrent ? "▶" : "-"}
                              </div>
                              <div className="text-[10px] leading-tight">{stage.name}</div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    })}
                    <td className="text-white font-mono text-lg py-3 px-4 border border-gray-700 text-center font-bold">
                      {[0, 2, 4, 6, 8].filter((i) => i < currentStage).length}
                    </td>
                  </tr>

                  {/* 말 (Bottom) */}
                  <tr className="bg-gray-800/50">
                    <td className="text-white font-mono text-sm py-3 px-4 border border-gray-700 font-bold">
                      ▼ 말
                    </td>
                    {[1, 3, 5, 7].map((stageIndex, inning) => {
                      const stage = stages[stageIndex];
                      const isPast = stageIndex < currentStage;
                      const isCurrent = stageIndex === currentStage;

                      return (
                        <td
                          key={inning}
                          className={`border border-gray-700 text-center py-3 px-3 font-mono transition-all ${
                            isCurrent
                              ? "bg-yellow-400 text-gray-900 animate-pulse"
                              : isPast
                              ? "bg-green-600 text-white"
                              : "bg-gray-900 text-gray-600"
                          }`}
                        >
                          {stage ? (
                            <div>
                              <div className="text-xs font-bold mb-1">
                                {isPast ? "✓" : isCurrent ? "▶" : "-"}
                              </div>
                              <div className="text-[10px] leading-tight">{stage.name}</div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    })}
                    <td className="text-white font-mono text-lg py-3 px-4 border border-gray-700 text-center font-bold">
                      {[1, 3, 5, 7].filter((i) => i < currentStage).length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 진행률 */}
            <div className="mt-6 pt-4 border-t-2 border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-400 text-xs font-bold">PROGRESS</span>
                <span className="text-white font-mono text-lg font-bold">{progress}%</span>
              </div>
              <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-700">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Card>

          {/* 로그 */}
          <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 Deployment Logs</h2>
            <div className="dev-minimal h-64 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
              {isComplete && (
                <div className="mt-4 text-green-400 font-bold">
                  🎉 배포 완료! 리포트 페이지로 이동 중...
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

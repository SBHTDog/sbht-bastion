"use client";

// 배포 실시간 모니터링 페이지
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import DeployResult from "@/components/deploy/DeployResult";
import { mockProjects, mockDeployments } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

export default function DeployPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [deployStatus, setDeployStatus] = useState<"success" | "failed" | null>(null);
  const [stageResults, setStageResults] = useState<Array<{
    name: string;
    status: "success" | "failed" | "skipped";
    duration: number;
  }>>([]);
  const [startTime] = useState(Date.now());
  const [baseballCommentary, setBaseballCommentary] = useState("🎤 플레이볼! 배포 경기가 곧 시작됩니다!");

  const project = mockProjects.find((p) => p.id === projectId);
  const deploymentTemplate = mockDeployments[0]; // 템플릿으로 사용

  const stages = [
    { name: "Checkout", duration: 2000, baseball: "선발 투수 Checkout이 마운드에 오릅니다!" },
    { name: "Dependencies", duration: 3000, baseball: "Dependencies, 강속구로 삼진을 잡아냅니다!" },
    { name: "Lint", duration: 2000, baseball: "Lint 타자, 깔끔한 안타를 쳐냅니다!" },
    { name: "Test", duration: 4000, failChance: 0.3, baseball: "Test, 풀카운트 승부 중입니다... 긴장감이 감돕니다!" },
    { name: "Build", duration: 5000, baseball: "Build 타자가 방망이를 힘차게 휘두릅니다!" },
    { name: "Security Scan", duration: 2000, baseball: "Security Scan, 수비가 탄탄합니다!" },
    { name: "Push ECR", duration: 2000, baseball: "Push ECR, 주자가 베이스를 훔칩니다!" },
    { name: "Deploy", duration: 3000, baseball: "Deploy, 결정적인 타석에 들어섭니다!" },
    { name: "Health Check", duration: 2000, baseball: "Health Check, 마지막 수비를 준비합니다!" },
  ];

  // 배포 재시도
  const handleRetry = () => {
    setCurrentStage(0);
    setLogs([]);
    setIsComplete(false);
    setDeployStatus(null);
    setStageResults([]);
    setBaseballCommentary("🎤 재경기 시작! 다시 한 번 도전합니다!");
  };

  // 배포 시뮬레이션
  useEffect(() => {
    if (deployStatus !== null) return; // 이미 완료된 경우 실행하지 않음

    if (currentStage >= stages.length) {
      // 배포 완료 - 모두 성공
      setIsComplete(true);
      setDeployStatus("success");
      setBaseballCommentary("🏆 게임셋! 완봉승! 모든 이닝을 완벽하게 마쳤습니다! 홈런급 배포 성공!");
      debugLog("Deploy", "Deployment complete - SUCCESS", { projectId });
      return;
    }

    const stage = stages[currentStage];
    const stageStartTime = Date.now();
    const inning = Math.ceil((currentStage + 1) / 2);
    const isTop = currentStage % 2 === 0;

    debugLog("Deploy", "Stage started", { stage: stage.name });

    // 야구 중계 문구 업데이트
    setBaseballCommentary(`🎤 ${inning}회 ${isTop ? '초' : '말'}, ${stage.baseball}`);

    // 로그 추가
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ⏳ ${stage.name} 시작...`]);

    const timer = setTimeout(() => {
      // 실패 확률 체크 (Test 단계에서만)
      const failed = stage.failChance && Math.random() < stage.failChance;
      const duration = Math.round((Date.now() - stageStartTime) / 1000);

      if (failed) {
        // 실패 처리
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ❌ ${stage.name} 실패`]);
        setBaseballCommentary(`⚾ 삼진 아웃! ${stage.name}에서 스트라이크 아웃! 경기가 중단되었습니다.`);

        // 현재 단계까지의 결과 저장
        const results = stages.map((s, index) => {
          if (index < currentStage) {
            return { name: s.name, status: "success" as const, duration: Math.round(s.duration / 1000) };
          } else if (index === currentStage) {
            return { name: s.name, status: "failed" as const, duration };
          } else {
            return { name: s.name, status: "skipped" as const, duration: 0 };
          }
        });

        setStageResults(results);
        setIsComplete(true);
        setDeployStatus("failed");
        debugLog("Deploy", "Deployment FAILED", { stage: stage.name });
      } else {
        // 성공 처리
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ✅ ${stage.name} 완료`]);

        // 성공 야구 문구
        const successComments = [
          `⚾ 안타! ${stage.name}이(가) 1루에 출루했습니다!`,
          `🔥 스트라이크! ${stage.name}이(가) 삼진을 잡았습니다!`,
          `💨 도루 성공! ${stage.name}이(가) 빠르게 진행됩니다!`,
          `🎯 완벽한 수비! ${stage.name}이(가) 실책 없이 처리했습니다!`
        ];

        const randomComment = successComments[Math.floor(Math.random() * successComments.length)];
        setTimeout(() => setBaseballCommentary(randomComment), 500);

        // 결과 업데이트
        setStageResults((prev) => [
          ...prev,
          { name: stage.name, status: "success", duration }
        ]);

        setCurrentStage((prev) => prev + 1);
      }
    }, stage.duration);

    return () => clearTimeout(timer);
  }, [currentStage, projectId, deployStatus]);

  const progress = ((currentStage / stages.length) * 100).toFixed(0);

  // 배포 완료된 경우 결과 표시
  if (deployStatus !== null) {
    const finalResults = deployStatus === "success"
      ? stages.map(s => ({
          name: s.name,
          status: "success" as const,
          duration: Math.round(s.duration / 1000)
        }))
      : stageResults;

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
            <DeployResult
              projectId={projectId}
              projectName={project?.name || "Project"}
              branch={project?.branch || "main"}
              status={deployStatus}
              duration={Date.now() - startTime}
              stages={finalResults}
              onRetry={handleRetry}
            />
          </div>
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
              <div className="text-yellow-400 text-xs font-bold mb-1">⚾ DEPLOYMENT BASEBALL ⚾</div>
              <div className="text-yellow-400 text-sm font-bold mb-3">배포 야구장 전광판</div>

              {/* 야구 중계 문구 */}
              <div className="bg-gray-800 px-6 py-3 rounded-lg mb-4 mx-4">
                <div className="text-white text-lg font-bold animate-pulse">
                  {baseballCommentary}
                </div>
              </div>

              <div className="flex justify-center gap-8 items-center">
                <Badge variant={isComplete ? "success" : "warning"}>
                  {isComplete ? "GAME OVER" : `${Math.ceil((currentStage + 1) / 2)}회 진행중`}
                </Badge>
                <div className="text-white font-mono text-lg">
                  홈팀: {project?.name} • 투수: {project?.branch} branch
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
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

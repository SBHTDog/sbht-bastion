"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import confetti from "canvas-confetti";

interface DeployResultProps {
  projectId: string;
  projectName: string;
  branch: string;
  status: "success" | "failed";
  duration: number;
  stages: Array<{
    name: string;
    status: "success" | "failed" | "skipped";
    duration: number;
  }>;
  onRetry?: () => void;
}

export default function DeployResult({
  projectId,
  projectName,
  branch,
  status,
  duration,
  stages,
  onRetry,
}: DeployResultProps) {
  const router = useRouter();
  const [showResult, setShowResult] = useState(false);

  // 목데이터
  const mockEcsRevision = "arn:aws:ecs:ap-northeast-2:123456789:task-definition/frontend-app:42";
  const mockCodeDeployId = "d-X9Y8Z7W6V5";
  const mockServiceName = "frontend-app-service";
  const mockClusterName = "production-cluster";
  const mockDeploymentGroup = "frontend-prod-deploy-group";

  // 실패 분석 목데이터
  const failureAnalysis = {
    failedStage: stages.find(s => s.status === "failed")?.name || "Test",
    summary: "테스트 단계에서 단위 테스트 2개가 실패했습니다. Header 컴포넌트의 타이틀 텍스트가 예상값과 일치하지 않습니다.",
    suggestions: [
      "Header.test.tsx 파일의 테스트 케이스를 최신 컴포넌트 변경사항에 맞게 업데이트",
      "환경 변수 NEXT_PUBLIC_APP_TITLE이 테스트 환경에서 올바르게 설정되었는지 확인",
      "의존성 패키지 버전 충돌 가능성 점검 (특히 @testing-library/react)"
    ]
  };

  useEffect(() => {
    // 결과 화면 표시 애니메이션
    setTimeout(() => setShowResult(true), 100);

    // 성공 시 축하 효과
    if (status === "success") {
      setTimeout(() => {
        // 좌측 캐논
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.1, y: 0.6 },
          colors: ["#10b981", "#22c55e", "#86efac"],
        });

        // 우측 캐논
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.9, y: 0.6 },
          colors: ["#10b981", "#22c55e", "#86efac"],
        });

        // 중앙 캐논
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
        });
      }, 500);
    }
  }, [status]);

  const successCount = stages.filter((s) => s.status === "success").length;
  const failedCount = stages.filter((s) => s.status === "failed").length;
  const totalDuration = Math.round(duration / 1000);

  return (
    <div
      className={`transition-all duration-1000 transform ${
        showResult ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}
    >
      {/* 결과 헤더 카드 */}
      <Card
        className={`mb-8 border-4 ${
          status === "success"
            ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
            : "border-red-500 bg-gradient-to-r from-red-50 to-pink-50"
        }`}
      >
        <div className="text-center py-12">
          {/* 상태 아이콘 */}
          <div className="mb-6">
            {status === "success" ? (
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500 text-white animate-bounce">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500 text-white animate-pulse">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* 결과 메시지 */}
          <h1
            className={`text-4xl font-bold mb-4 ${
              status === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {status === "success" ? "⚾ 홈런! 만루홈런급 완벽한 배포!" : "⚾ 삼진 아웃! 배포 실패"}
          </h1>

          {status === "success" && (
            <p className="text-xl text-green-600 mb-2">🏆 완봉승! 에러 없는 깔끔한 경기였습니다!</p>
          )}
          {status === "failed" && (
            <p className="text-xl text-red-600 mb-2">😢 아쉬운 경기! 다시 도전해보세요!</p>
          )}

          <p className="text-xl text-gray-600 mb-2">
            {projectName} • {branch} branch
          </p>

          <p className="text-gray-500">
            총 소요시간: {Math.floor(totalDuration / 60)}분 {totalDuration % 60}초
          </p>
        </div>
      </Card>

      {/* 성공 시 AWS 배포 정보 */}
      {status === "success" && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">🚀 AWS 배포 정보</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ECS 정보 */}
            <div className="bg-white/80 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-blue-700">ECS Task Definition</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revision:</span>
                  <span className="font-mono font-bold text-blue-600">42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-mono">{mockServiceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cluster:</span>
                  <span className="font-mono">{mockClusterName}</span>
                </div>
                <div className="mt-3 p-2 bg-gray-100 rounded">
                  <code className="text-xs break-all">{mockEcsRevision}</code>
                </div>
              </div>
            </div>

            {/* CodeDeploy 정보 */}
            <div className="bg-white/80 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-green-700">CodeDeploy Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deployment ID:</span>
                  <span className="font-mono font-bold">{mockCodeDeployId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deploy Group:</span>
                  <span className="font-mono">{mockDeploymentGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="success">Succeeded</Badge>
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs text-green-600 font-bold">100%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Blue/Green 배포 완료</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 실패 시 분석 정보 */}
      {status === "failed" && (
        <Card className="mb-8 border-2 border-red-300 bg-red-50">
          <h2 className="text-2xl font-bold mb-6 text-red-700">🔍 실패 분석</h2>

          {/* 실패 단계 */}
          <div className="bg-white/80 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-red-600 text-2xl">⚾</span>
              <div>
                <h3 className="font-bold text-lg text-gray-800">스트라이크 아웃 단계: {failureAnalysis.failedStage}</h3>
                <p className="text-gray-600 text-sm mt-1">🎤 "{failureAnalysis.failedStage} 타자가 삼진으로 물러났습니다!"</p>
                <p className="text-gray-600 text-sm mt-1">{failureAnalysis.summary}</p>
              </div>
            </div>
          </div>

          {/* 개선 제안 */}
          <div className="bg-white/80 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-gray-800">💡 개선 제안</h3>
            <ul className="space-y-2">
              {failureAnalysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-1">▸</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 에러 로그 */}
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-3 text-gray-800">📋 상세 로그</h3>
            <div className="dev-minimal bg-gray-900 text-red-400 p-4 rounded-lg font-mono text-sm">
              <div>[ERROR] Test suite failed at 14:25:03</div>
              <div>  ✕ src/components/Header.test.tsx (2 failed, 8 passed)</div>
              <div>    Test: "renders correct title"</div>
              <div>      Expected: "Deploy Monitor"</div>
              <div>      Received: "Deploy Monitor Beta"</div>
              <div className="mt-2">  ✕ src/components/Header.test.tsx</div>
              <div>    Test: "shows user menu when logged in"</div>
              <div>      Cannot read property 'user' of undefined</div>
              <div className="mt-2 text-yellow-400">[WARNING] Build skipped due to test failure</div>
              <div className="text-gray-500">Process exited with code 1</div>
            </div>
          </div>
        </Card>
      )}

      {/* 스테이지 상세 결과 */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">⚾ 이닝별 경기 결과</h2>

        {/* 스테이지 그리드 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stages.map((stage, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                stage.status === "success"
                  ? "border-green-400 bg-green-50"
                  : stage.status === "failed"
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-700">#{index + 1}</span>
                {stage.status === "success" && (
                  <span className="text-green-600 text-xl">✓</span>
                )}
                {stage.status === "failed" && (
                  <span className="text-red-600 text-xl">✕</span>
                )}
                {stage.status === "skipped" && (
                  <span className="text-gray-400 text-xl">⊘</span>
                )}
              </div>
              <div className="font-bold mb-1 text-gray-800">{stage.name}</div>
              <div className="text-sm text-gray-600">
                {stage.status === "skipped" ? "Skipped" : `${stage.duration}s`}
              </div>
            </div>
          ))}
        </div>

        {/* 요약 통계 */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-gray-600">성공</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{failedCount}</div>
            <div className="text-sm text-gray-600">실패</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">
              {stages.length - successCount - failedCount}
            </div>
            <div className="text-sm text-gray-600">건너뜀</div>
          </div>
        </div>
      </Card>

      {/* 액션 버튼들 */}
      <div className="flex gap-4 justify-center">
        {status === "success" ? (
          <>
            <Link href={`/project/${projectId}`}>
              <Button size="lg" className="px-8">
                프로젝트로 돌아가기
              </Button>
            </Link>
            <Link href={`/project/${projectId}/reports/deploy-1`}>
              <Button size="lg" variant="secondary" className="px-8">
                상세 리포트 보기
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Button
              size="lg"
              onClick={onRetry || (() => window.location.reload())}
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              🔄 다시 시도
            </Button>
            <Link href={`/project/${projectId}`}>
              <Button size="lg" variant="secondary" className="px-8">
                프로젝트로 돌아가기
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
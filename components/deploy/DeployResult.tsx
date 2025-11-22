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

  // Mock data
  const mockEcsRevision = "arn:aws:ecs:ap-northeast-2:123456789:task-definition/frontend-app:42";
  const mockCodeDeployId = "d-X9Y8Z7W6V5";
  const mockServiceName = "frontend-app-service";
  const mockClusterName = "production-cluster";
  const mockDeploymentGroup = "frontend-prod-deploy-group";

  // Failure analysis mock data
  const failureAnalysis = {
    failedStage: stages.find(s => s.status === "failed")?.name || "Test",
    summary: "2 unit tests failed in the test stage. The Header component's title text does not match the expected value.",
    suggestions: [
      "Update test cases in Header.test.tsx to match the latest component changes",
      "Verify that the NEXT_PUBLIC_APP_TITLE environment variable is properly set in the test environment",
      "Check for possible dependency package version conflicts (especially @testing-library/react)"
    ]
  };

  useEffect(() => {
    // Result screen display animation
    setTimeout(() => setShowResult(true), 100);

    // Celebration effect on success
    if (status === "success") {
      setTimeout(() => {
        // Left cannon
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.1, y: 0.6 },
          colors: ["#10b981", "#22c55e", "#86efac"],
        });

        // Right cannon
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.9, y: 0.6 },
          colors: ["#10b981", "#22c55e", "#86efac"],
        });

        // Center cannon
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
      {/* Result header card */}
      <Card
        className={`mb-8 border-4 ${
          status === "success"
            ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
            : "border-red-500 bg-gradient-to-r from-red-50 to-pink-50"
        }`}
      >
        <div className="text-center py-12">
          {/* Status icon */}
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

          {/* Result message */}
          <h1
            className={`text-4xl font-bold mb-4 ${
              status === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {status === "success" ? "⚾ Home Run! Perfect Grand Slam Deployment!" : "⚾ Strike Out! Deployment Failed"}
          </h1>

          {status === "success" && (
            <p className="text-xl text-green-600 mb-2">🏆 Perfect Game! Clean deployment with no errors!</p>
          )}
          {status === "failed" && (
            <p className="text-xl text-red-600 mb-2">😢 Tough game! Try again!</p>
          )}

          <p className="text-xl text-gray-600 mb-2">
            {projectName} • {branch} branch
          </p>

          <p className="text-gray-500">
            Total Duration: {Math.floor(totalDuration / 60)}m {totalDuration % 60}s
          </p>
        </div>
      </Card>

      {/* AWS deployment info on success */}
      {status === "success" && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">🚀 AWS Deployment Info</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ECS info */}
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

            {/* CodeDeploy info */}
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
                  <div className="text-xs text-gray-500 mt-1">Blue/Green deployment complete</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Failure analysis on failed deployment */}
      {status === "failed" && (
        <Card className="mb-8 border-2 border-red-300 bg-red-50">
          <h2 className="text-2xl font-bold mb-6 text-red-700">🔍 Failure Analysis</h2>

          {/* Failed stage */}
          <div className="bg-white/80 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-red-600 text-2xl">⚾</span>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Strike Out Stage: {failureAnalysis.failedStage}</h3>
                <p className="text-gray-600 text-sm mt-1">🎤 "The {failureAnalysis.failedStage} batter struck out!"</p>
                <p className="text-gray-600 text-sm mt-1">{failureAnalysis.summary}</p>
              </div>
            </div>
          </div>

          {/* Improvement suggestions */}
          <div className="bg-white/80 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-gray-800">💡 Improvement Suggestions</h3>
            <ul className="space-y-2">
              {failureAnalysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-1">▸</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Error logs */}
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-3 text-gray-800">📋 Detailed Logs</h3>
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

      {/* Stage detailed results */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">⚾ Inning-by-Inning Results</h2>

        {/* Stage grid */}
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

        {/* Summary statistics */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-gray-600">Success</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{failedCount}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">
              {stages.length - successCount - failedCount}
            </div>
            <div className="text-sm text-gray-600">Skipped</div>
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-4 justify-center">
        {status === "success" ? (
          <>
            <Link href={`/project/${projectId}`}>
              <Button size="lg" className="px-8">
                Back to Project
              </Button>
            </Link>
            <Link href={`/project/${projectId}/reports/deploy-1`}>
              <Button size="lg" variant="secondary" className="px-8">
                View Detailed Report
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
              🔄 Retry
            </Button>
            <Link href={`/project/${projectId}`}>
              <Button size="lg" variant="secondary" className="px-8">
                Back to Project
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
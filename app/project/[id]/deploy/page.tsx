"use client";

// Real-time deployment monitoring page
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
  const [baseballCommentary, setBaseballCommentary] = useState("🎤 Play ball! The deployment game is about to begin!");

  const project = mockProjects.find((p) => p.id === projectId);
  const deploymentTemplate = mockDeployments[0]; // Used as template

  const stages = [
    { name: "Checkout", duration: 2000, baseball: "Starting pitcher Checkout takes the mound!" },
    { name: "Dependencies", duration: 3000, baseball: "Dependencies strikes out with a fastball!" },
    { name: "Lint", duration: 2000, baseball: "Lint batter hits a clean single!" },
    { name: "Test", duration: 4000, failChance: 0.3, baseball: "Test, full count battle... tension is building!" },
    { name: "Build", duration: 5000, baseball: "Build batter swings the bat powerfully!" },
    { name: "Security Scan", duration: 2000, baseball: "Security Scan, solid defense!" },
    { name: "Push ECR", duration: 2000, baseball: "Push ECR, runner steals a base!" },
    { name: "Deploy", duration: 3000, baseball: "Deploy steps up to the crucial at-bat!" },
    { name: "Health Check", duration: 2000, baseball: "Health Check prepares for the final defense!" },
  ];

  // Retry deployment
  const handleRetry = () => {
    setCurrentStage(0);
    setLogs([]);
    setIsComplete(false);
    setDeployStatus(null);
    setStageResults([]);
    setBaseballCommentary("🎤 Rematch starts! Let's try again!");
  };

  // Deployment simulation
  useEffect(() => {
    if (deployStatus !== null) return; // Don't run if already completed

    if (currentStage >= stages.length) {
      // Deployment complete - all successful
      setIsComplete(true);
      setDeployStatus("success");
      setBaseballCommentary("🏆 Game set! Perfect game! All innings completed perfectly! Home run deployment success!");
      debugLog("Deploy", "Deployment complete - SUCCESS", { projectId });
      return;
    }

    const stage = stages[currentStage];
    const stageStartTime = Date.now();
    const inning = Math.ceil((currentStage + 1) / 2);
    const isTop = currentStage % 2 === 0;

    debugLog("Deploy", "Stage started", { stage: stage.name });

    // Update baseball commentary
    setBaseballCommentary(`🎤 Inning ${inning} ${isTop ? 'Top' : 'Bottom'}, ${stage.baseball}`);

    // Add log
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString('en-US')}] ⏳ ${stage.name} starting...`]);

    const timer = setTimeout(() => {
      // Check failure probability (only for Test stage)
      const failed = stage.failChance && Math.random() < stage.failChance;
      const duration = Math.round((Date.now() - stageStartTime) / 1000);

      if (failed) {
        // Handle failure
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString('en-US')}] ❌ ${stage.name} failed`]);
        setBaseballCommentary(`⚾ Strike out! Struck out at ${stage.name}! Game stopped.`);

        // Save results up to current stage
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
        // Handle success
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString('en-US')}] ✅ ${stage.name} completed`]);

        // Success baseball commentary
        const successComments = [
          `⚾ Hit! ${stage.name} gets on first base!`,
          `🔥 Strike! ${stage.name} gets a strikeout!`,
          `💨 Steal success! ${stage.name} proceeds quickly!`,
          `🎯 Perfect defense! ${stage.name} handled without errors!`
        ];

        const randomComment = successComments[Math.floor(Math.random() * successComments.length)];
        setTimeout(() => setBaseballCommentary(randomComment), 500);

        // Update results
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

  // Show results when deployment is complete
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
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Deployment in Progress</h1>
            <p className="text-gray-600 text-lg">
              {project?.name} • {project?.branch} branch
            </p>
          </div>

          {/* Baseball Scoreboard */}
          <Card className="mb-8 bg-gray-900 border-4 border-gray-700">
            {/* Scoreboard Header */}
            <div className="text-center mb-6 pb-4 border-b-2 border-gray-700">
              <div className="text-yellow-400 text-xs font-bold mb-1">⚾ DEPLOYMENT BASEBALL ⚾</div>
              <div className="text-yellow-400 text-sm font-bold mb-3">Deployment Baseball Stadium Scoreboard</div>

              {/* Baseball Commentary */}
              <div className="bg-gray-800 px-6 py-3 rounded-lg mb-4 mx-4">
                <div className="text-white text-lg font-bold animate-pulse">
                  {baseballCommentary}
                </div>
              </div>

              <div className="flex justify-center gap-8 items-center">
                <Badge variant={isComplete ? "success" : "warning"}>
                  {isComplete ? "GAME OVER" : `Inning ${Math.ceil((currentStage + 1) / 2)} in progress`}
                </Badge>
                <div className="text-white font-mono text-lg">
                  Home Team: {project?.name} • Pitcher: {project?.branch} branch
                </div>
              </div>
            </div>

            {/* Scoreboard Table */}
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
                        Inning {inning}
                      </th>
                    ))}
                    <th className="text-yellow-400 text-xs font-bold py-2 px-4 border border-gray-700 text-center w-20">
                      TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Top */}
                  <tr className="bg-gray-800/50">
                    <td className="text-white font-mono text-sm py-3 px-4 border border-gray-700 font-bold">
                      ▲ Top
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

                  {/* Bottom */}
                  <tr className="bg-gray-800/50">
                    <td className="text-white font-mono text-sm py-3 px-4 border border-gray-700 font-bold">
                      ▼ Bottom
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

            {/* Progress */}
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

          {/* Logs */}
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

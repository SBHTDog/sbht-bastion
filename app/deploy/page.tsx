"use client";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

export default function DeployMonitor() {
  const stages = [
    { name: "Checkout", status: "success", duration: "5s" },
    { name: "Dependencies", status: "success", duration: "45s" },
    { name: "Lint", status: "success", duration: "12s" },
    { name: "Test", status: "in_progress", duration: "-" },
    { name: "Build", status: "pending", duration: "-" },
    { name: "Security Scan", status: "pending", duration: "-" },
    { name: "Push ECR", status: "pending", duration: "-" },
    { name: "Deploy", status: "pending", duration: "-" },
    { name: "Health Check", status: "pending", duration: "-" }
  ];

  const logs = [
    "[14:23:45] Starting deployment...",
    "[14:23:46] Checking out code from main branch",
    "[14:23:51] ✓ Checkout completed",
    "[14:23:51] Installing dependencies...",
    "[14:24:36] ✓ Dependencies installed",
    "[14:24:36] Running linter...",
    "[14:24:48] ✓ Lint passed",
    "[14:24:48] Running tests...",
    "[14:24:52] Test suite started (42 tests)",
    "[14:24:55] ● Running unit tests..."
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Deploy Monitor</h1>
          <p className="text-gray-400">frontend-app • main branch • v1.2.3</p>
        </div>

        {/* Baseball Scoreboard */}
        <Card className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">⚾ Deployment Progress</h2>
            <div className="flex gap-4 items-center">
              <Badge variant="warning">In Progress</Badge>
              <span className="text-gray-400">Stage 4 of 9</span>
              <span className="text-gray-400">• Elapsed: 1m 12s</span>
            </div>
          </div>

          {/* Scoreboard Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {stages.map((stage, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  stage.status === "success"
                    ? "border-green-500 bg-green-500/10"
                    : stage.status === "in_progress"
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-gray-700 bg-gray-800/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold">{index + 1}</span>
                  {stage.status === "success" && (
                    <span className="text-green-500">✓</span>
                  )}
                  {stage.status === "in_progress" && (
                    <span className="text-yellow-500 animate-pulse">⏳</span>
                  )}
                </div>
                <div className="text-sm font-medium mb-1">{stage.name}</div>
                <div className="text-xs text-gray-400">{stage.duration}</div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full blue-gradient"
              style={{ width: "44%" }}
            />
          </div>
        </Card>

        {/* Logs */}
        <Card>
          <h2 className="text-xl font-bold mb-4">📋 Deployment Logs</h2>
          <div className="dev-minimal p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <div className="text-gray-400 text-sm mb-2">Stages Completed</div>
            <div className="text-2xl font-bold">3 / 9</div>
          </Card>
          <Card>
            <div className="text-gray-400 text-sm mb-2">Success Rate</div>
            <div className="text-2xl font-bold text-green-500">100%</div>
          </Card>
          <Card>
            <div className="text-gray-400 text-sm mb-2">Estimated Time</div>
            <div className="text-2xl font-bold">~3m 45s</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

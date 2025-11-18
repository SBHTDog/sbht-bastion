"use client";

import Link from "next/link";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ⚾ Deploy Monitor
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/deploy" className="text-blue-600 font-semibold">
                Deploy
              </Link>
              <Link href="/history" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                History
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-gray-800">⚾ Deploy Monitor</h1>
          <p className="text-gray-600 text-lg">frontend-app • main branch • v1.2.3</p>
        </div>

        {/* Baseball Scoreboard */}
        <Card className="mb-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Deployment Progress</h2>
            <div className="flex gap-4 items-center">
              <Badge variant="warning">In Progress</Badge>
              <span className="text-gray-600 font-medium">Stage 4 of 9</span>
              <span className="text-gray-500">• Elapsed: 1m 12s</span>
            </div>
          </div>

          {/* Scoreboard Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {stages.map((stage, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border-2 transition-all ${
                  stage.status === "success"
                    ? "border-green-400 bg-green-50 shadow-md"
                    : stage.status === "in_progress"
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 bg-white/50"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-lg text-gray-700">{index + 1}</span>
                  {stage.status === "success" && (
                    <span className="text-green-600 text-xl">✓</span>
                  )}
                  {stage.status === "in_progress" && (
                    <span className="text-blue-600 animate-pulse text-xl">⏳</span>
                  )}
                </div>
                <div className="text-base font-bold mb-2 text-gray-800">{stage.name}</div>
                <div className="text-sm text-gray-600 font-medium">{stage.duration}</div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full blue-gradient transition-all duration-500"
              style={{ width: "44%" }}
            />
          </div>
        </Card>

        {/* Logs */}
        <Card>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Deployment Logs</h2>
          <div className="dev-minimal h-64 overflow-y-auto font-mono text-sm">
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
            <div className="text-gray-600 text-sm mb-2 font-medium">Stages Completed</div>
            <div className="text-3xl font-bold text-blue-600">3 / 9</div>
          </Card>
          <Card>
            <div className="text-gray-600 text-sm mb-2 font-medium">Success Rate</div>
            <div className="text-3xl font-bold text-green-600">100%</div>
          </Card>
          <Card>
            <div className="text-gray-600 text-sm mb-2 font-medium">Estimated Time</div>
            <div className="text-3xl font-bold text-blue-600">~3m 45s</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

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

  // Mock data - Failed deployment information
  const failedDeployment = {
    id: deploymentId,
    version: "v1.2.3",
    projectName: "frontend-app",
    projectId: "project-1",
    branch: "main",
    status: "failed",
    deployedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deployedBy: user?.name || "Unknown",
    failedStage: "Test",
    failureTime: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
    commitHash: "abc123def456",
    commitMessage: "feat: Add new deployment monitoring features"
  };

  // Failed stage information
  const stageInfo = {
    stage: failedDeployment.failedStage,
    stageNumber: 4,
    totalStages: 9,
    duration: "58s",
    errorCode: "TEST_FAILURE",
    timestamp: failedDeployment.failureTime
  };

  // LLM analysis results
  const llmAnalysis = {
    summary: `Deployment failed at the ${stageInfo.stage} stage. 2 test suites failed during unit testing, with the main causes identified as Header component props type mismatch and missing environment variables.`,

    rootCause: [
      {
        title: "Test Environment Configuration Error",
        description: "Header.test.tsx expects 'Deploy Monitor' title but it's actually rendered as 'Deploy Monitor Beta'.",
        severity: "high",
        code: `Expected: "Deploy Monitor"\nReceived: "Deploy Monitor Beta"`
      },
      {
        title: "Missing Environment Variables",
        description: "The NEXT_PUBLIC_APP_TITLE environment variable is not set in the test environment, causing an undefined error.",
        severity: "medium",
        code: `Cannot read property 'user' of undefined\nat Header.test.tsx:45`
      }
    ],

    suggestions: [
      {
        priority: "High",
        action: "Update Test Cases",
        description: "Modify the expected values in Header.test.tsx to match the current implementation.",
        command: `jest.mock('@/config', () => ({
  APP_TITLE: 'Deploy Monitor Beta'
}))`
      },
      {
        priority: "Medium",
        action: "Set Environment Variables",
        description: "Add required environment variables to .env.test file.",
        command: `NEXT_PUBLIC_APP_TITLE="Deploy Monitor Beta"
NEXT_PUBLIC_API_URL="http://localhost:3000"`
      },
      {
        priority: "Low",
        action: "Check Dependency Versions",
        description: "Verify compatibility between @testing-library/react and React versions.",
        command: "npm list @testing-library/react react"
      }
    ],

    confidence: 92 // AI analysis confidence
  };

  // Vulnerability summary
  const vulnerabilities = {
    summary: "Security scan found 2 HIGH and 5 MEDIUM vulnerabilities.",
    high: [
      {
        cve: "CVE-2023-44487",
        package: "axios@0.21.1",
        description: "HTTP/2 Rapid Reset Attack - DoS vulnerability",
        fixVersion: "1.6.0",
        impact: "Denial of service attack possible"
      },
      {
        cve: "CVE-2023-45857",
        package: "lodash@4.17.19",
        description: "Prototype Pollution - Code execution vulnerability",
        fixVersion: "4.17.21",
        impact: "Remote code execution possible"
      }
    ],
    medium: [
      {
        cve: "CVE-2023-26159",
        package: "follow-redirects@1.14.0",
        description: "Improper Input Validation",
        fixVersion: "1.15.4"
      },
      {
        cve: "CVE-2023-28155",
        package: "request@2.88.0",
        description: "SSRF vulnerability",
        fixVersion: "deprecated"
      },
      {
        cve: "CVE-2023-26136",
        package: "tough-cookie@2.5.0",
        description: "Regular Expression DoS",
        fixVersion: "4.1.3"
      }
    ],
    critical: 0,
    low: 12
  };

  // Error logs
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
                <h1 className="text-4xl font-bold text-gray-800">Deployment Failure Analysis</h1>
                <Badge variant="error">Failed</Badge>
              </div>
              <Link href="/history">
                <Button variant="secondary">← Back to list</Button>
              </Link>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <span className="text-gray-500 text-sm">Version</span>
                <p className="text-lg font-bold text-gray-800">{failedDeployment.version}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Project</span>
                <p className="text-lg font-bold text-gray-800">{failedDeployment.projectName}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Branch</span>
                <p className="text-lg font-bold text-gray-800">{failedDeployment.branch}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Failure Time</span>
                <p className="text-lg font-bold text-red-600">
                  {new Date(failedDeployment.failureTime).toLocaleTimeString('en-US')}
                </p>
              </div>
            </div>
          </div>

          {/* Failed Stage Information */}
          <Card className="mb-8 border-2 border-red-300 bg-red-50">
            <h2 className="text-2xl font-bold mb-6 text-red-700">❌ Failed Stage</h2>

            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{stageInfo.stageNumber}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{stageInfo.stage}</h3>
                    <p className="text-gray-600">Stage {stageInfo.stageNumber} / {stageInfo.totalStages}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Error Code</div>
                  <div className="text-lg font-mono font-bold text-red-600">{stageInfo.errorCode}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full"
                  style={{ width: `${(stageInfo.stageNumber / stageInfo.totalStages) * 100}%` }}
                />
              </div>

              <div className="text-sm text-gray-600">
                Duration: {stageInfo.duration} •
                Failed At: {new Date(stageInfo.timestamp).toLocaleString('en-US')}
              </div>
            </div>
          </Card>

          {/* LLM Analysis */}
          <Card className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🤖 AI Failure Analysis</h2>
              <Badge variant="success">Confidence {llmAnalysis.confidence}%</Badge>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">{llmAnalysis.summary}</p>
            </div>

            {/* Root Causes */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 text-gray-800">Root Causes</h3>
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

            {/* Suggestions */}
            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-800">💡 Suggestions</h3>
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
                          suggestion.priority === "High" ? "error" :
                          suggestion.priority === "Medium" ? "warning" :
                          "default"
                        }
                      >
                        Priority: {suggestion.priority}
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

          {/* Vulnerability Summary */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🛡️ Security Vulnerability Summary</h2>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <p className="text-yellow-800">{vulnerabilities.summary}</p>
            </div>

            {/* Vulnerability Statistics */}
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

            {/* HIGH Vulnerability Details */}
            {vulnerabilities.high.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-red-700 mb-3">🔴 HIGH Vulnerabilities</h3>
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

            {/* MEDIUM Vulnerability Summary */}
            {vulnerabilities.medium.length > 0 && (
              <div>
                <h3 className="font-bold text-yellow-700 mb-3">🟡 MEDIUM Vulnerabilities ({vulnerabilities.medium.length})</h3>
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

          {/* Error Logs */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Error Logs</h2>
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

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link href="/history">
              <Button size="lg" variant="secondary" className="px-8">
                Back to List
              </Button>
            </Link>
            <Link href={`/history/${deploymentId}`}>
              <Button size="lg" variant="secondary" className="px-8">
                View Full Details
              </Button>
            </Link>
            <Button
              size="lg"
              onClick={handleRetry}
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              🔄 Redeploy
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
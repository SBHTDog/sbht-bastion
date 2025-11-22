"use client";

// Deployment Detail Report Page
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
            <h1 className="text-xl font-bold text-gray-800 mb-4">Report not found</h1>
            <Link href={`/project/${projectId}`}>
              <Button>Back to project</Button>
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
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-800">Deployment Report</h1>
              <Badge variant={isSuccess ? "success" : "error"}>{deployment.status}</Badge>
            </div>
            <p className="text-gray-600 text-lg">
              {project?.name} • {deployment.version} • {deployment.branch}
            </p>
          </div>

          {/* LLM Analysis */}
          {llmAnalysis && (
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">🤖 AI Analysis</h2>
              <p className="text-gray-700 mb-4">{llmAnalysis.summary}</p>
              {llmAnalysis.failureReason && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-bold text-red-800 mb-2">Failure Reason:</h3>
                  <p className="text-red-700">{llmAnalysis.failureReason}</p>
                </div>
              )}
              <div>
                <h3 className="font-bold text-gray-800 mb-2">
                  {isSuccess ? "Optimization Suggestions:" : "Improvement Recommendations:"}
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

          {/* Success Case */}
          {isSuccess && analysis.jobs && (
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">⏱️ Duration by Job</h2>
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

          {/* Failure Case */}
          {!isSuccess && (
            <>
              {/* Test Failure */}
              {analysis.tests && (
                <Card className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">🧪 Test Results</h2>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-2xl font-bold text-gray-800">{analysis.tests.total}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Passed</div>
                      <div className="text-2xl font-bold text-green-600">{analysis.tests.passed}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Failed</div>
                      <div className="text-2xl font-bold text-red-600">{analysis.tests.failed}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-800">Failed Tests:</h3>
                    {analysis.tests.failedTests.map((test, idx) => (
                      <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="font-medium text-red-800 mb-1">{test.name}</div>
                        <pre className="text-xs text-red-700 overflow-x-auto">{test.error}</pre>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Trivy Vulnerabilities */}
              {analysis.trivy && (
                <Card className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">🛡️ Security Scan (Trivy)</h2>
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
                        {vuln.package}@{vuln.version} → {vuln.fixedVersion || "No patch"}
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </>
          )}

          {/* Share Button */}
          <Card className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Share Report</h3>
                <p className="text-gray-600 text-sm">Share deployment results with your team</p>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied!");
                }}
              >
                📤 Copy Link
              </Button>
            </div>
          </Card>

          {/* Additional Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link href={`/project/${projectId}`}>
              <Button size="lg" variant="secondary" className="px-8">
                Back to Project
              </Button>
            </Link>
            <Link href="/history">
              <Button size="lg" variant="secondary" className="px-8">
                View Deployment History
              </Button>
            </Link>
            {!isSuccess && (
              <Link href={`/project/${projectId}/deploy`}>
                <Button size="lg" className="px-8">
                  Redeploy
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

// Project Detail Page
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { mockProjects, mockDeployments } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  debugLog("ProjectDetail", "Loading project", { projectId });

  const project = mockProjects.find((p) => p.id === projectId);
  const deployments = mockDeployments
    .filter((d) => d.projectId === projectId)
    .slice(0, 3); // Only the 3 most recent

  if (!project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
          <Card>
            <h1 className="text-xl font-bold text-gray-800 mb-4">Project not found</h1>
            <Link href="/dashboard">
              <Button>Back to dashboard</Button>
            </Link>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const handleDeploy = () => {
    debugLog("ProjectDetail", "Starting deployment", { projectId });
    router.push(`/project/${projectId}/deploy`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Deploy Monitor
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/history" className="text-gray-600 hover:text-blue-600 font-medium">
                  History
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto p-8">
          {/* Project Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-800">{project.name}</h1>
              <Badge variant={project.status === "healthy" ? "success" : "error"}>
                {project.status}
              </Badge>
            </div>
            <p className="text-gray-600 text-lg mb-2">{project.description}</p>
            <p className="text-gray-500 text-sm">
              Repository: {project.repoFullName} • Branch: {project.branch}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <div className="text-gray-500 text-sm mb-2 font-medium">Total Deploys</div>
              <div className="text-4xl font-bold text-blue-600">{project.deployCount}</div>
            </Card>
            <Card>
              <div className="text-gray-500 text-sm mb-2 font-medium">Success Rate</div>
              <div className="text-4xl font-bold text-green-600">{project.successRate}%</div>
            </Card>
            <Card>
              <div className="text-gray-500 text-sm mb-2 font-medium">Last Deploy</div>
              <div className="text-2xl font-bold text-gray-700">{project.lastDeploy}</div>
            </Card>
          </div>

          {/* Start Deployment Button */}
          <Card className="mb-12">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Start New Deployment</h2>
                <p className="text-gray-600">
                  Current Branch: <strong>{project.branch}</strong>
                </p>
              </div>
              <Button onClick={handleDeploy} size="lg">
                🚀 Start Deployment
              </Button>
            </div>
          </Card>

          {/* Recent Deployments */}
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Recent Deployments</h2>
          <div className="space-y-4">
            {deployments.map((deploy) => (
              <Card key={deploy.id}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-800">{deploy.version}</span>
                      <Badge
                        variant={
                          deploy.status === "success"
                            ? "success"
                            : deploy.status === "failed"
                            ? "error"
                            : "warning"
                        }
                      >
                        {deploy.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {deploy.commitMessage} • {deploy.duration} • {deploy.author}
                    </p>
                  </div>
                  <Link href={`/project/${projectId}/reports/${deploy.id}`}>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

"use client";

// Dashboard - Project creation modal integrated
import { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useMockAuth } from "@/contexts/MockAuthContext";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import { getProjectsByUserId } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

export default function Dashboard() {
  const auth = useAuth();
  const mockAuth = useMockAuth();

  // MockAuth가 인증되어 있으면 MockAuth 사용, 아니면 Auth 사용
  const user = mockAuth.isAuthenticated ? mockAuth.user : auth.user;
  const logout = mockAuth.isAuthenticated ? mockAuth.logout : auth.logout;

  const [showCreateProject, setShowCreateProject] = useState(false);

  const userProjects = user ? getProjectsByUserId(user.id) : [];
  debugLog("Dashboard", "User projects loaded", { count: userProjects.length });

  const totalDeploys = userProjects.reduce((sum, p) => sum + p.deployCount, 0);
  const avgSuccessRate =
    userProjects.reduce((sum, p) => sum + p.successRate, 0) / (userProjects.length || 1);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Deploy Monitor
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/dashboard" className="text-blue-600 font-bold">
                  Dashboard
                </Link>
                <Link href="/history" className="text-gray-600 hover:text-blue-600 font-medium">
                  History
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <Button onClick={() => setShowCreateProject(true)}>+ New Project</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            <Card>
              <div className="text-gray-500 text-sm mb-2 font-medium">Total Deploys</div>
              <div className="text-4xl font-bold font-mono text-blue-600">{totalDeploys}</div>
            </Card>
            <Card>
              <div className="text-gray-500 text-sm mb-2 font-medium">Success Rate</div>
              <div className="text-4xl font-bold font-mono text-green-600">
                {avgSuccessRate.toFixed(0)}%
              </div>
            </Card>
            <Card>
              <div className="text-gray-500 text-sm mb-2 font-medium">Projects</div>
              <div className="text-4xl font-bold font-mono text-blue-600">
                {userProjects.length}
              </div>
            </Card>
          </div>

          {/* Projects */}
          <h2 className="text-xl font-bold mb-4 text-gray-800">Projects</h2>
          {userProjects.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600 mb-4">No projects yet</p>
              <Button onClick={() => setShowCreateProject(true)}>Create Your First Project</Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {userProjects.map((project) => (
                <Card key={project.id}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-gray-800">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                    <Badge
                      variant={
                        project.status === "healthy"
                          ? "success"
                          : project.status === "failed"
                          ? "error"
                          : "warning"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="dev-minimal mb-4 text-xs">
                    <div>Branch: {project.branch}</div>
                    <div>Last: {project.lastDeploy}</div>
                    <div>Success: {project.successRate}%</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/project/${project.id}`}>
                      <Button size="sm">Details</Button>
                    </Link>
                    <Link href={`/project/${project.id}/deploy`}>
                      <Button size="sm" variant="secondary">
                        Deploy
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
      />
    </ProtectedRoute>
  );
}

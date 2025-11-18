import Link from "next/link";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

export default function History() {
  const deployments = [
    {
      id: "1",
      project: "frontend-app",
      version: "v1.2.3",
      status: "success",
      duration: "3m 45s",
      time: "2 hours ago",
      branch: "main"
    },
    {
      id: "2",
      project: "api-server",
      version: "v2.1.0",
      status: "in_progress",
      duration: "1m 12s",
      time: "10 minutes ago",
      branch: "develop"
    },
    {
      id: "3",
      project: "mobile-app",
      version: "v0.9.2",
      status: "failed",
      duration: "2m 30s",
      time: "3 hours ago",
      branch: "feature/auth"
    },
    {
      id: "4",
      project: "analytics-service",
      version: "v1.5.1",
      status: "success",
      duration: "4m 15s",
      time: "1 day ago",
      branch: "main"
    }
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
              <Link href="/deploy" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Deploy
              </Link>
              <Link href="/history" className="text-blue-600 font-semibold">
                History
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Deployment History</h1>
          <p className="text-gray-600 text-lg">View all past deployments</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex gap-4">
            <select className="bg-white border-2 border-blue-200 rounded-lg px-4 py-2.5 text-gray-700 font-medium focus:border-blue-500 focus:outline-none">
              <option>All Projects</option>
              <option>frontend-app</option>
              <option>api-server</option>
              <option>mobile-app</option>
            </select>
            <select className="bg-white border-2 border-blue-200 rounded-lg px-4 py-2.5 text-gray-700 font-medium focus:border-blue-500 focus:outline-none">
              <option>All Status</option>
              <option>Success</option>
              <option>Failed</option>
              <option>In Progress</option>
            </select>
            <select className="bg-white border-2 border-blue-200 rounded-lg px-4 py-2.5 text-gray-700 font-medium focus:border-blue-500 focus:outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </Card>

        {/* Deployment List */}
        <div className="space-y-6">
          {deployments.map((deploy) => (
            <Card key={deploy.id}>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{deploy.project}</h3>
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
                    <span className="text-gray-600 text-sm font-medium">{deploy.version}</span>
                  </div>
                  <div className="dev-minimal text-sm inline-block">
                    <span className="text-gray-400">Branch:</span> {deploy.branch} •
                    <span className="text-gray-400"> Duration:</span> {deploy.duration} •
                    <span className="text-gray-400"> Time:</span> {deploy.time}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-5 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                    View Details
                  </button>
                  {deploy.status === "failed" && (
                    <button className="px-5 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      View Error
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-10">
          <button className="px-5 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-300 transition-colors">
            Previous
          </button>
          <button className="px-5 py-2.5 blue-gradient rounded-lg text-white font-medium shadow-md">
            1
          </button>
          <button className="px-5 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-300 transition-colors">
            2
          </button>
          <button className="px-5 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-300 transition-colors">
            3
          </button>
          <button className="px-5 py-2.5 bg-white border-2 border-blue-200 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:border-blue-300 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

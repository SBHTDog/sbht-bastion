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
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Deployment History</h1>
          <p className="text-gray-400">View all past deployments</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex gap-4">
            <select className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300">
              <option>All Projects</option>
              <option>frontend-app</option>
              <option>api-server</option>
              <option>mobile-app</option>
            </select>
            <select className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300">
              <option>All Status</option>
              <option>Success</option>
              <option>Failed</option>
              <option>In Progress</option>
            </select>
            <select className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </Card>

        {/* Deployment List */}
        <div className="space-y-4">
          {deployments.map((deploy) => (
            <Card key={deploy.id}>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{deploy.project}</h3>
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
                    <span className="text-gray-400 text-sm">{deploy.version}</span>
                  </div>
                  <div className="dev-minimal p-3 rounded text-sm inline-block">
                    <span className="text-gray-400">Branch:</span> {deploy.branch} •
                    <span className="text-gray-400"> Duration:</span> {deploy.duration} •
                    <span className="text-gray-400"> Time:</span> {deploy.time}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm text-gray-300 hover:text-white">
                    View Details
                  </button>
                  {deploy.status === "failed" && (
                    <button className="px-4 py-2 text-sm text-red-500 hover:text-red-400">
                      View Error
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
            Previous
          </button>
          <button className="px-4 py-2 blue-gradient rounded text-white">
            1
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
            2
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
            3
          </button>
          <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

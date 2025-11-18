import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Monitor your deployments</p>
          </div>
          <Button>New Project</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-gray-400 text-sm mb-2">Total Deploys</div>
            <div className="text-3xl font-bold">124</div>
            <div className="text-green-500 text-sm mt-2">↑ 12% this week</div>
          </Card>
          <Card>
            <div className="text-gray-400 text-sm mb-2">Success Rate</div>
            <div className="text-3xl font-bold">87%</div>
            <div className="text-green-500 text-sm mt-2">↑ 5% improvement</div>
          </Card>
          <Card>
            <div className="text-gray-400 text-sm mb-2">Active Projects</div>
            <div className="text-3xl font-bold">8</div>
            <div className="text-gray-400 text-sm mt-2">2 deploying now</div>
          </Card>
          <Card>
            <div className="text-gray-400 text-sm mb-2">Avg. Duration</div>
            <div className="text-3xl font-bold">4m 32s</div>
            <div className="text-red-500 text-sm mt-2">↓ 15s slower</div>
          </Card>
        </div>

        {/* Projects */}
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Project Card 1 */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">frontend-app</h3>
                <p className="text-gray-400 text-sm">React + TypeScript</p>
              </div>
              <Badge variant="success">Production</Badge>
            </div>
            <div className="dev-minimal p-3 rounded mb-4 text-sm">
              <div>Branch: main</div>
              <div>Last Deploy: 2 hours ago</div>
              <div>Status: <span className="text-green-500">Healthy</span></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Deploy</Button>
              <Button variant="ghost" size="sm">Settings</Button>
              <Button variant="ghost" size="sm">History</Button>
            </div>
          </Card>

          {/* Project Card 2 */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">api-server</h3>
                <p className="text-gray-400 text-sm">Node.js + Express</p>
              </div>
              <Badge variant="warning">Staging</Badge>
            </div>
            <div className="dev-minimal p-3 rounded mb-4 text-sm">
              <div>Branch: develop</div>
              <div>Last Deploy: 1 day ago</div>
              <div>Status: <span className="text-yellow-500">Deploying</span></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">View Progress</Button>
              <Button variant="ghost" size="sm">Settings</Button>
              <Button variant="ghost" size="sm">History</Button>
            </div>
          </Card>

          {/* Project Card 3 */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">mobile-app</h3>
                <p className="text-gray-400 text-sm">React Native</p>
              </div>
              <Badge variant="error">Failed</Badge>
            </div>
            <div className="dev-minimal p-3 rounded mb-4 text-sm">
              <div>Branch: feature/auth</div>
              <div>Last Deploy: 3 hours ago</div>
              <div>Status: <span className="text-red-500">Build Failed</span></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="danger">View Error</Button>
              <Button variant="ghost" size="sm">Retry</Button>
              <Button variant="ghost" size="sm">History</Button>
            </div>
          </Card>

          {/* Project Card 4 */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">analytics-service</h3>
                <p className="text-gray-400 text-sm">Python + FastAPI</p>
              </div>
              <Badge variant="success">Production</Badge>
            </div>
            <div className="dev-minimal p-3 rounded mb-4 text-sm">
              <div>Branch: main</div>
              <div>Last Deploy: 5 days ago</div>
              <div>Status: <span className="text-green-500">Healthy</span></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Deploy</Button>
              <Button variant="ghost" size="sm">Settings</Button>
              <Button variant="ghost" size="sm">History</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

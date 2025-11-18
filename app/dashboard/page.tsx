import Link from "next/link";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

export default function Dashboard() {
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
              <Link href="/dashboard" className="text-blue-600 font-semibold">
                Dashboard
              </Link>
              <Link href="/deploy" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
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
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-800">Dashboard</h1>
            <p className="text-gray-600 text-lg">Monitor your deployments</p>
          </div>
          <Button>New Project</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <div className="text-gray-500 text-sm mb-2 font-medium">Total Deploys</div>
            <div className="text-4xl font-bold text-blue-600 mb-2">124</div>
            <div className="text-green-600 text-sm font-medium">↑ 12% this week</div>
          </Card>
          <Card>
            <div className="text-gray-500 text-sm mb-2 font-medium">Success Rate</div>
            <div className="text-4xl font-bold text-blue-600 mb-2">87%</div>
            <div className="text-green-600 text-sm font-medium">↑ 5% improvement</div>
          </Card>
          <Card>
            <div className="text-gray-500 text-sm mb-2 font-medium">Active Projects</div>
            <div className="text-4xl font-bold text-blue-600 mb-2">8</div>
            <div className="text-gray-600 text-sm font-medium">2 deploying now</div>
          </Card>
          <Card>
            <div className="text-gray-500 text-sm mb-2 font-medium">Avg. Duration</div>
            <div className="text-4xl font-bold text-blue-600 mb-2">4m 32s</div>
            <div className="text-red-600 text-sm font-medium">↓ 15s slower</div>
          </Card>
        </div>

        {/* Projects */}
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Projects</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Project Card 1 */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-800">frontend-app</h3>
                <p className="text-gray-600 text-sm">React + TypeScript</p>
              </div>
              <Badge variant="success">Production</Badge>
            </div>
            <div className="dev-minimal mb-4 text-sm">
              <div>Branch: main</div>
              <div>Last Deploy: 2 hours ago</div>
              <div>Status: <span className="text-green-400">Healthy</span></div>
            </div>
            <div className="flex gap-2">
              <Link href="/deploy">
                <Button size="sm">Deploy</Button>
              </Link>
              <Button variant="ghost" size="sm">Settings</Button>
              <Link href="/history">
                <Button variant="ghost" size="sm">History</Button>
              </Link>
            </div>
          </Card>

          {/* Project Card 2 */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-800">api-server</h3>
                <p className="text-gray-600 text-sm">Node.js + Express</p>
              </div>
              <Badge variant="warning">Staging</Badge>
            </div>
            <div className="dev-minimal mb-4 text-sm">
              <div>Branch: develop</div>
              <div>Last Deploy: 1 day ago</div>
              <div>Status: <span className="text-yellow-400">Deploying</span></div>
            </div>
            <div className="flex gap-2">
              <Link href="/deploy">
                <Button size="sm" variant="secondary">View Progress</Button>
              </Link>
              <Button variant="ghost" size="sm">Settings</Button>
              <Link href="/history">
                <Button variant="ghost" size="sm">History</Button>
              </Link>
            </div>
          </Card>

          {/* Project Card 3 */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-800">mobile-app</h3>
                <p className="text-gray-600 text-sm">React Native</p>
              </div>
              <Badge variant="error">Failed</Badge>
            </div>
            <div className="dev-minimal mb-4 text-sm">
              <div>Branch: feature/auth</div>
              <div>Last Deploy: 3 hours ago</div>
              <div>Status: <span className="text-red-400">Build Failed</span></div>
            </div>
            <div className="flex gap-2">
              <Link href="/deploy">
                <Button size="sm" variant="danger">View Error</Button>
              </Link>
              <Button variant="ghost" size="sm">Retry</Button>
              <Link href="/history">
                <Button variant="ghost" size="sm">History</Button>
              </Link>
            </div>
          </Card>

          {/* Project Card 4 */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-800">analytics-service</h3>
                <p className="text-gray-600 text-sm">Python + FastAPI</p>
              </div>
              <Badge variant="success">Production</Badge>
            </div>
            <div className="dev-minimal mb-4 text-sm">
              <div>Branch: main</div>
              <div>Last Deploy: 5 days ago</div>
              <div>Status: <span className="text-green-400">Healthy</span></div>
            </div>
            <div className="flex gap-2">
              <Link href="/deploy">
                <Button size="sm">Deploy</Button>
              </Link>
              <Button variant="ghost" size="sm">Settings</Button>
              <Link href="/history">
                <Button variant="ghost" size="sm">History</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Card, Button } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <main className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-800">
            SBHT Bastion
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            GitHub App Integration Platform
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-slideUp">
          {/* GitHub Dashboard Card */}
          <Card hoverable>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">GitHub Dashboard</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              View your GitHub profile, repositories, and organizations
            </p>
            <Link href="/dashboard/github">
              <Button variant="primary" className="w-full sm:w-auto">
                Open Dashboard
              </Button>
            </Link>
          </Card>

          {/* Webhook Monitor Card */}
          <Card hoverable>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Webhook Monitor</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Real-time GitHub webhook events via Server-Sent Events
            </p>
            <Link href="/webhooks/monitor">
              <Button variant="primary" className="w-full sm:w-auto">
                Open Monitor
              </Button>
            </Link>
          </Card>

          {/* Deploy Monitor Card (Demo) */}
          <Card hoverable className="border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-2xl font-bold text-gray-800">Deploy Monitor</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                Demo
              </span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Real-time deployment monitoring dashboard (mock data)
            </p>
            <Link href="/deploy-monitor">
              <Button variant="secondary" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </Card>
        </div>

        {/* API Endpoints Info */}
        <Card className="animate-fadeIn">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">API Endpoints</h3>
          <div className="space-y-2">
            <code className="block text-sm bg-gray-100 px-3 py-2 rounded text-gray-700 font-mono">
              POST /api/webhooks/github
            </code>
            <code className="block text-sm bg-gray-100 px-3 py-2 rounded text-gray-700 font-mono">
              GET /api/webhooks/events (SSE)
            </code>
            <code className="block text-sm bg-gray-100 px-3 py-2 rounded text-gray-700 font-mono">
              GET /api/github
            </code>
          </div>
        </Card>
      </main>
    </div>
  );
}

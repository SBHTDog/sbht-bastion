import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-2">SBHT Bastion</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            GitHub App Integration Platform
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">GitHub Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              View your GitHub profile, repositories, and organizations
            </p>
            <a
              href="/dashboard/github"
              className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Open Dashboard
            </a>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Webhook Monitor</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Real-time GitHub webhook events via Server-Sent Events
            </p>
            <a
              href="/webhooks/monitor"
              className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Open Monitor
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-500">
          <p>API Endpoints:</p>
          <code className="text-xs">POST /api/webhooks/github</code>
          <code className="text-xs">GET /api/webhooks/events (SSE)</code>
          <code className="text-xs">GET /api/github</code>
        </div>
      </main>
    </div>
  );
}

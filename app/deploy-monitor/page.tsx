'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button, Badge } from '@/components/ui';
import { getMockDeployments, getMockDeploymentStats, type MockDeployment } from '@/lib/mockData';

export default function DeployMonitorPage() {
  const [deployments, setDeployments] = useState<MockDeployment[]>([]);
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0, inProgress: 0, successRate: 0 });

  useEffect(() => {
    // Load mock data
    setDeployments(getMockDeployments());
    setStats(getMockDeploymentStats());
  }, []);

  const getStatusColor = (status: MockDeployment['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusBadge = (status: MockDeployment['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'in_progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'staging':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'development':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">Deploy Monitor</h1>
              <p className="text-gray-600">Real-time deployment monitoring dashboard (Demo)</p>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back to Home
              </Button>
            </Link>
          </div>

          {/* Demo Notice */}
          <Card className="bg-blue-50/50 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Demo Mode</h3>
                <p className="text-sm text-gray-600">
                  This is a demonstration page with mock data. It showcases the Deploy Monitor feature described in the design documentation.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slideUp">
          <Card hoverable>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Deploys</div>
            </div>
          </Card>
          <Card hoverable>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">{stats.successful}</div>
              <div className="text-sm text-gray-600">Successful</div>
            </div>
          </Card>
          <Card hoverable>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">{stats.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </Card>
          <Card hoverable>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">{stats.successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </Card>
        </div>

        {/* Deployments List */}
        <Card className="animate-slideUp">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Recent Deployments</h2>

          {deployments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">📦</div>
              <p>No deployments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deployments.map((deployment) => (
                <div
                  key={deployment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-800">{deployment.projectName}</h3>
                        <Badge variant={getStatusBadge(deployment.status)}>
                          {deployment.status}
                        </Badge>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getEnvironmentColor(deployment.environment)}`}>
                          {deployment.environment}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        <span>Branch: <span className="font-mono text-gray-800">{deployment.branch}</span></span>
                        <span>Started: {new Date(deployment.startedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stages */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {deployment.stages.map((stage, index) => (
                      <div
                        key={index}
                        className={`border-2 rounded-lg p-3 text-center transition-all ${
                          stage.status === 'success'
                            ? 'border-green-500 bg-green-50'
                            : stage.status === 'failed'
                            ? 'border-red-500 bg-red-50'
                            : stage.status === 'in_progress'
                            ? 'border-blue-500 bg-blue-50 animate-pulse'
                            : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="text-xs font-medium text-gray-700 mb-1">{stage.name}</div>
                        {stage.status === 'success' && <span className="text-green-600">✓</span>}
                        {stage.status === 'failed' && <span className="text-red-600">✗</span>}
                        {stage.status === 'in_progress' && <span className="text-blue-600">▶</span>}
                        {stage.status === 'pending' && <span className="text-gray-400">○</span>}
                      </div>
                    ))}
                  </div>

                  {/* Duration */}
                  {deployment.completedAt && (
                    <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                      Duration: {Math.round((new Date(deployment.completedAt).getTime() - new Date(deployment.startedAt).getTime()) / 1000)}s
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Features Info */}
        <Card className="mt-6 animate-slideUp">
          <h3 className="font-semibold mb-4 text-gray-800">Available Features (Demo)</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Real-time deployment status tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Multi-stage pipeline visualization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Environment-based deployment filtering</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Deployment statistics and success rates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">○</span>
              <span className="text-gray-500">Webhook integration (Coming soon)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">○</span>
              <span className="text-gray-500">Log streaming (Coming soon)</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

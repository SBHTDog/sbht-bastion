/**
 * Mock Data Library
 * Simple mock data for Deploy Monitor demo
 */

export interface MockDeployment {
  id: string;
  projectName: string;
  status: 'pending' | 'in_progress' | 'success' | 'failed';
  branch: string;
  environment: 'production' | 'staging' | 'development';
  startedAt: string;
  completedAt?: string;
  stages: MockDeploymentStage[];
}

export interface MockDeploymentStage {
  name: string;
  status: 'pending' | 'in_progress' | 'success' | 'failed';
  duration?: number;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Generate mock deployment data
 */
export function getMockDeployments(): MockDeployment[] {
  return [
    {
      id: 'deploy-1',
      projectName: 'sbht-bastion',
      status: 'success',
      branch: 'main',
      environment: 'production',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3000000).toISOString(),
      stages: [
        {
          name: 'Checkout',
          status: 'success',
          duration: 2000,
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date(Date.now() - 3598000).toISOString(),
        },
        {
          name: 'Install Dependencies',
          status: 'success',
          duration: 15000,
          startedAt: new Date(Date.now() - 3598000).toISOString(),
          completedAt: new Date(Date.now() - 3583000).toISOString(),
        },
        {
          name: 'Build',
          status: 'success',
          duration: 30000,
          startedAt: new Date(Date.now() - 3583000).toISOString(),
          completedAt: new Date(Date.now() - 3553000).toISOString(),
        },
        {
          name: 'Test',
          status: 'success',
          duration: 10000,
          startedAt: new Date(Date.now() - 3553000).toISOString(),
          completedAt: new Date(Date.now() - 3543000).toISOString(),
        },
        {
          name: 'Deploy',
          status: 'success',
          duration: 20000,
          startedAt: new Date(Date.now() - 3543000).toISOString(),
          completedAt: new Date(Date.now() - 3000000).toISOString(),
        },
      ],
    },
    {
      id: 'deploy-2',
      projectName: 'api-gateway',
      status: 'failed',
      branch: 'develop',
      environment: 'staging',
      startedAt: new Date(Date.now() - 7200000).toISOString(),
      completedAt: new Date(Date.now() - 7100000).toISOString(),
      stages: [
        {
          name: 'Checkout',
          status: 'success',
          duration: 2000,
        },
        {
          name: 'Install Dependencies',
          status: 'success',
          duration: 15000,
        },
        {
          name: 'Build',
          status: 'success',
          duration: 30000,
        },
        {
          name: 'Test',
          status: 'failed',
          duration: 5000,
        },
        {
          name: 'Deploy',
          status: 'pending',
        },
      ],
    },
    {
      id: 'deploy-3',
      projectName: 'frontend-app',
      status: 'in_progress',
      branch: 'feature/new-ui',
      environment: 'development',
      startedAt: new Date(Date.now() - 60000).toISOString(),
      stages: [
        {
          name: 'Checkout',
          status: 'success',
          duration: 2000,
        },
        {
          name: 'Install Dependencies',
          status: 'success',
          duration: 15000,
        },
        {
          name: 'Build',
          status: 'in_progress',
        },
        {
          name: 'Test',
          status: 'pending',
        },
        {
          name: 'Deploy',
          status: 'pending',
        },
      ],
    },
  ];
}

/**
 * Get deployment by ID
 */
export function getMockDeploymentById(id: string): MockDeployment | undefined {
  return getMockDeployments().find((d) => d.id === id);
}

/**
 * Get deployment statistics
 */
export function getMockDeploymentStats() {
  const deployments = getMockDeployments();
  const total = deployments.length;
  const successful = deployments.filter((d) => d.status === 'success').length;
  const failed = deployments.filter((d) => d.status === 'failed').length;
  const inProgress = deployments.filter((d) => d.status === 'in_progress').length;

  return {
    total,
    successful,
    failed,
    inProgress,
    successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
  };
}

// ============================================================================
// MOCK DATA
// Mock data used throughout the application
// Clear structure and comments for debugging
// ============================================================================

import {
  User,
  GitHubRepo,
  Project,
  Deployment,
  DeploymentDetail,
  TrivyResults,
  TestSummary,
  LintResults,
  NetworkDiagnostic,
  GitHubActionsJob,
  ECSComparison,
  CodeDeployResult,
  LLMAnalysis,
  SharedReport,
} from "./types";

// ============================================================================
// 1. USERS
// ============================================================================
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Chul-su Kim",
    email: "kim.chulsu@example.com",
    avatar: "https://avatars.githubusercontent.com/u/1",
    githubUsername: "kimcs",
    createdAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "user-2",
    name: "Young-hee Lee",
    email: "lee.younghee@example.com",
    avatar: "https://avatars.githubusercontent.com/u/2",
    githubUsername: "leeyh",
    createdAt: "2024-01-12T10:30:00Z",
  },
  {
    id: "user-3",
    name: "Min-su Park",
    email: "park.minsu@example.com",
    avatar: "https://avatars.githubusercontent.com/u/3",
    githubUsername: "parkms",
    createdAt: "2024-01-15T14:20:00Z",
  },
];

// ============================================================================
// 2. GITHUB REPOSITORIES
// ============================================================================
export const mockGitHubRepos: GitHubRepo[] = [
  {
    id: "repo-1",
    name: "my-awesome-app",
    fullName: "kimcs/my-awesome-app",
    description: "Full-stack web application with Next.js",
    stars: 42,
    language: "TypeScript",
    private: false,
    defaultBranch: "main",
    updatedAt: "2024-01-18T12:00:00Z",
  },
  {
    id: "repo-2",
    name: "api-server",
    fullName: "kimcs/api-server",
    description: "RESTful API server with Express",
    stars: 15,
    language: "JavaScript",
    private: true,
    defaultBranch: "main",
    updatedAt: "2024-01-17T09:30:00Z",
  },
  {
    id: "repo-3",
    name: "mobile-app",
    fullName: "leeyh/mobile-app",
    description: "React Native mobile application",
    stars: 28,
    language: "TypeScript",
    private: false,
    defaultBranch: "develop",
    updatedAt: "2024-01-19T16:45:00Z",
  },
  {
    id: "repo-4",
    name: "analytics-service",
    fullName: "parkms/analytics-service",
    description: "Data analytics microservice with Python",
    stars: 8,
    language: "Python",
    private: true,
    defaultBranch: "main",
    updatedAt: "2024-01-14T11:20:00Z",
  },
  {
    id: "repo-5",
    name: "design-system",
    fullName: "kimcs/design-system",
    description: "Shared UI component library",
    stars: 67,
    language: "TypeScript",
    private: false,
    defaultBranch: "main",
    updatedAt: "2024-01-20T08:15:00Z",
  },
];

// ============================================================================
// 3. PROJECTS
// ============================================================================
export const mockProjects: Project[] = [
  {
    id: "proj-1",
    userId: "user-1",
    name: "frontend-app",
    description: "React + TypeScript",
    repoId: "repo-1",
    repoFullName: "kimcs/my-awesome-app",
    branch: "main",
    environment: "production",
    status: "healthy",
    lastDeploy: "2 hours ago",
    deployCount: 124,
    successRate: 87,
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "proj-2",
    userId: "user-1",
    name: "api-server",
    description: "Node.js + Express",
    repoId: "repo-2",
    repoFullName: "kimcs/api-server",
    branch: "develop",
    environment: "staging",
    status: "deploying",
    lastDeploy: "10 minutes ago",
    deployCount: 89,
    successRate: 92,
    createdAt: "2024-01-11T14:30:00Z",
  },
  {
    id: "proj-3",
    userId: "user-2",
    name: "mobile-app",
    description: "React Native",
    repoId: "repo-3",
    repoFullName: "leeyh/mobile-app",
    branch: "feature/auth",
    environment: "development",
    status: "failed",
    lastDeploy: "3 hours ago",
    deployCount: 56,
    successRate: 78,
    createdAt: "2024-01-12T09:15:00Z",
  },
  {
    id: "proj-4",
    userId: "user-3",
    name: "analytics-service",
    description: "Python + FastAPI",
    repoId: "repo-4",
    repoFullName: "parkms/analytics-service",
    branch: "main",
    environment: "production",
    status: "healthy",
    lastDeploy: "5 days ago",
    deployCount: 203,
    successRate: 95,
    createdAt: "2024-01-08T16:45:00Z",
  },
];

// ============================================================================
// 4. DEPLOYMENTS (Basic)
// ============================================================================
export const mockDeployments: Deployment[] = [
  {
    id: "deploy-1",
    projectId: "proj-1",
    version: "v1.2.3",
    status: "success",
    duration: "3m 45s",
    timestamp: "2024-01-20T10:15:00Z",
    branch: "main",
    commitHash: "abc1234",
    commitMessage: "feat: add user profile page",
    author: "kimcs",
    stages: [
      { name: "Checkout", status: "success", duration: "5s" },
      { name: "Dependencies", status: "success", duration: "45s" },
      { name: "Lint", status: "success", duration: "12s" },
      { name: "Test", status: "success", duration: "1m 8s" },
      { name: "Build", status: "success", duration: "1m 20s" },
      { name: "Security Scan", status: "success", duration: "8s" },
      { name: "Push ECR", status: "success", duration: "3s" },
      { name: "Deploy", status: "success", duration: "2s" },
      { name: "Health Check", status: "success", duration: "2s" },
    ],
  },
  {
    id: "deploy-2",
    projectId: "proj-2",
    version: "v2.1.0",
    status: "in_progress",
    duration: "1m 12s",
    timestamp: "2024-01-20T12:50:00Z",
    branch: "develop",
    commitHash: "def5678",
    commitMessage: "fix: resolve API endpoint bug",
    author: "kimcs",
    stages: [
      { name: "Checkout", status: "success", duration: "5s" },
      { name: "Dependencies", status: "success", duration: "42s" },
      { name: "Lint", status: "success", duration: "10s" },
      { name: "Test", status: "in_progress", duration: "-" },
      { name: "Build", status: "pending", duration: "-" },
      { name: "Security Scan", status: "pending", duration: "-" },
      { name: "Push ECR", status: "pending", duration: "-" },
      { name: "Deploy", status: "pending", duration: "-" },
      { name: "Health Check", status: "pending", duration: "-" },
    ],
  },
  {
    id: "deploy-3",
    projectId: "proj-3",
    version: "v0.9.2",
    status: "failed",
    duration: "2m 30s",
    timestamp: "2024-01-20T09:20:00Z",
    branch: "feature/auth",
    commitHash: "ghi9012",
    commitMessage: "test: add authentication tests",
    author: "leeyh",
    stages: [
      { name: "Checkout", status: "success", duration: "6s" },
      { name: "Dependencies", status: "success", duration: "50s" },
      { name: "Lint", status: "success", duration: "15s" },
      { name: "Test", status: "failed", duration: "1m 19s" },
      { name: "Build", status: "skipped", duration: "-" },
      { name: "Security Scan", status: "skipped", duration: "-" },
      { name: "Push ECR", status: "skipped", duration: "-" },
      { name: "Deploy", status: "skipped", duration: "-" },
      { name: "Health Check", status: "skipped", duration: "-" },
    ],
  },
];

// ============================================================================
// 5. DEPLOYMENT DETAILS (Success Case)
// ============================================================================
const successJobs: GitHubActionsJob[] = [
  {
    name: "checkout",
    status: "success",
    duration: "5s",
    startTime: "2024-01-20T10:15:00Z",
    endTime: "2024-01-20T10:15:05Z",
  },
  {
    name: "dependencies",
    status: "success",
    duration: "45s",
    startTime: "2024-01-20T10:15:05Z",
    endTime: "2024-01-20T10:15:50Z",
  },
  {
    name: "lint",
    status: "success",
    duration: "12s",
    startTime: "2024-01-20T10:15:50Z",
    endTime: "2024-01-20T10:16:02Z",
  },
  {
    name: "test",
    status: "success",
    duration: "1m 8s",
    startTime: "2024-01-20T10:16:02Z",
    endTime: "2024-01-20T10:17:10Z",
  },
  {
    name: "build",
    status: "success",
    duration: "1m 20s",
    startTime: "2024-01-20T10:17:10Z",
    endTime: "2024-01-20T10:18:30Z",
  },
];

const successECS: ECSComparison = {
  previous: {
    revision: 42,
    cpu: "256",
    memory: "512",
    image: "my-app:v1.2.2",
    environment: {
      NODE_ENV: "production",
      DB_HOST: "prod-db.example.com",
    },
  },
  current: {
    revision: 43,
    cpu: "512",
    memory: "1024",
    image: "my-app:v1.2.3",
    environment: {
      NODE_ENV: "production",
      DB_HOST: "prod-db.example.com",
      REDIS_HOST: "prod-redis.example.com",
    },
  },
  diff: [
    { field: "cpu", old: "256", new: "512", changed: true },
    { field: "memory", old: "512", new: "1024", changed: true },
    { field: "image", old: "my-app:v1.2.2", new: "my-app:v1.2.3", changed: true },
    {
      field: "REDIS_HOST",
      old: "",
      new: "prod-redis.example.com",
      changed: true,
    },
  ],
};

const successCodeDeploy: CodeDeployResult = {
  deploymentId: "d-ABCD1234",
  status: "SUCCEEDED",
  trafficRouting: "100% to new tasks",
  oldTasksTerminated: true,
  healthCheck: "HEALTHY",
  rollbackEnabled: true,
};

const successLLM: LLMAnalysis = {
  summary:
    "Deployment completed successfully. All tests passed and no critical vulnerabilities found in security scan.",
  optimizations: [
    "Recommend adding caching strategy to reduce build time by 20%",
    "Increasing ECS Task CPU to 512 was a good decision",
    "Consider Blue/Green deployment strategy for next deployment",
  ],
  relatedIssues: [],
};

// ============================================================================
// 6. DEPLOYMENT DETAILS (Failed Case)
// ============================================================================
const failedTrivy: TrivyResults = {
  critical: 0,
  high: 3,
  medium: 12,
  low: 8,
  vulnerabilities: [
    {
      cve: "CVE-2023-45857",
      severity: "HIGH",
      package: "axios",
      version: "0.21.1",
      fixedVersion: "1.6.0",
      description: "Server-Side Request Forgery (SSRF) vulnerability",
    },
    {
      cve: "CVE-2023-26136",
      severity: "HIGH",
      package: "tough-cookie",
      version: "4.0.0",
      fixedVersion: "4.1.3",
      description: "Prototype Pollution vulnerability",
    },
    {
      cve: "CVE-2023-26115",
      severity: "HIGH",
      package: "word-wrap",
      version: "1.2.3",
      fixedVersion: "1.2.4",
      description: "Regular Expression Denial of Service (ReDoS)",
    },
  ],
};

const failedTests: TestSummary = {
  total: 42,
  passed: 39,
  failed: 3,
  skipped: 0,
  failureRate: 7.1,
  duration: "1m 19s",
  failedTests: [
    {
      name: "UserService › should validate email format",
      status: "failed",
      duration: "120ms",
      error:
        "Expected: valid email\nReceived: undefined\n\nat UserService.test.ts:45:12",
    },
    {
      name: "AuthController › should return 401 for invalid token",
      status: "failed",
      duration: "85ms",
      error: "Timeout: Async callback was not invoked within 5000ms",
    },
    {
      name: "DatabaseService › should handle connection errors",
      status: "failed",
      duration: "200ms",
      error: "Connection pool timeout after 5000ms",
    },
  ],
};

const failedLint: LintResults = {
  errors: 5,
  warnings: 12,
  details: [
    {
      file: "src/services/UserService.ts",
      line: 45,
      column: 12,
      message: "Unsafe assignment of an `any` value",
      rule: "@typescript-eslint/no-unsafe-assignment",
      severity: "error",
    },
    {
      file: "src/controllers/AuthController.ts",
      line: 78,
      column: 5,
      message: "Promise returned in function argument where a void return was expected",
      rule: "@typescript-eslint/no-misused-promises",
      severity: "error",
    },
    {
      file: "src/utils/validation.ts",
      line: 23,
      column: 18,
      message: "Unexpected console statement",
      rule: "no-console",
      severity: "warning",
    },
  ],
};

const failedNetwork: NetworkDiagnostic = {
  hasIssues: false,
  dnsResolution: true,
  externalApiAccess: true,
  failedEndpoints: [],
};

const failedLLM: LLMAnalysis = {
  summary:
    "Deployment failed at Test stage. 3 test cases failed, mainly due to async processing and mock data issues.",
  failureReason:
    "Issues with UserService email validation logic returning undefined, AuthController timeout configuration, and DatabaseService connection pool settings.",
  recommendations: [
    "Need to add email field to mock data in UserService.test.ts",
    "Recommend increasing AuthController test timeout from 5s to 10s",
    "Need to review DatabaseService connection pool timeout settings",
    "Need to immediately patch 3 HIGH severity vulnerabilities found by Trivy (axios, tough-cookie, word-wrap)",
    "Recommend removing TypeScript any types and using explicit type definitions",
  ],
  estimatedFixTime: "Estimated fix time: 2-3 hours",
  relatedIssues: [
    "GitHub Issue #234: Email validation returns undefined",
    "GitHub Issue #189: Test timeout configuration",
  ],
};

// ============================================================================
// 7. COMPLETE DEPLOYMENT DETAILS
// ============================================================================
export const mockDeploymentDetails: Record<string, DeploymentDetail> = {
  "deploy-1": {
    id: "deploy-1",
    projectId: "proj-1",
    deployment: mockDeployments[0],
    analysis: {
      jobs: successJobs,
      ecs: successECS,
      codeDeploy: successCodeDeploy,
    },
    llmAnalysis: successLLM,
    timeline: [
      {
        timestamp: "2024-01-20T10:15:00Z",
        event: "Deployment Started",
        details: "Triggered by push to main branch",
      },
      {
        timestamp: "2024-01-20T10:17:10Z",
        event: "Tests Passed",
        details: "All 42 test cases passed successfully",
      },
      {
        timestamp: "2024-01-20T10:18:30Z",
        event: "Build Completed",
        details: "Production build created successfully",
      },
      {
        timestamp: "2024-01-20T10:18:45Z",
        event: "Deployment Successful",
        details: "Traffic routed to new tasks, health check passed",
      },
    ],
  },
  "deploy-3": {
    id: "deploy-3",
    projectId: "proj-3",
    deployment: mockDeployments[2],
    analysis: {
      failedStage: "Test",
      trivy: failedTrivy,
      tests: failedTests,
      lint: failedLint,
      network: failedNetwork,
    },
    llmAnalysis: failedLLM,
    timeline: [
      {
        timestamp: "2024-01-20T09:20:00Z",
        event: "Deployment Started",
        details: "Triggered by push to feature/auth branch",
      },
      {
        timestamp: "2024-01-20T09:21:11Z",
        event: "Lint Passed",
        details: "Code quality checks completed with 5 errors, 12 warnings",
      },
      {
        timestamp: "2024-01-20T09:22:30Z",
        event: "Tests Failed",
        details: "3 out of 42 tests failed",
      },
      {
        timestamp: "2024-01-20T09:22:30Z",
        event: "Deployment Failed",
        details: "Pipeline stopped due to test failures",
      },
    ],
  },
};

// ============================================================================
// 8. SHARED REPORTS
// ============================================================================
export const mockSharedReports: SharedReport[] = [
  {
    id: "share-1",
    deploymentId: "deploy-1",
    projectName: "frontend-app",
    createdAt: "2024-01-20T10:20:00Z",
    expiresAt: "2024-02-20T10:20:00Z",
    viewCount: 12,
  },
  {
    id: "share-2",
    deploymentId: "deploy-3",
    projectName: "mobile-app",
    createdAt: "2024-01-20T09:25:00Z",
    expiresAt: "2024-02-20T09:25:00Z",
    viewCount: 5,
  },
];

// ============================================================================
// HELPER FUNCTIONS (for debugging)
// ============================================================================

// Find specific user
export function findUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

// Projects for specific user
export function getProjectsByUserId(userId: string): Project[] {
  return mockProjects.filter((p) => p.userId === userId);
}

// Deployment list for specific project
export function getDeploymentsByProjectId(projectId: string): Deployment[] {
  return mockDeployments.filter((d) => d.projectId === projectId);
}

// Get deployment details
export function getDeploymentDetail(deployId: string): DeploymentDetail | undefined {
  return mockDeploymentDetails[deployId];
}

// Search GitHub repos
export function searchRepos(query: string): GitHubRepo[] {
  const lowerQuery = query.toLowerCase();
  return mockGitHubRepos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(lowerQuery) ||
      repo.description.toLowerCase().includes(lowerQuery) ||
      repo.language.toLowerCase().includes(lowerQuery)
  );
}

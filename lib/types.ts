// ============================================================================
// TYPE DEFINITIONS
// Clear type definitions for debugging
// ============================================================================

// ----------------------------------------------------------------------------
// User & Authentication
// ----------------------------------------------------------------------------
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  githubUsername: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ----------------------------------------------------------------------------
// GitHub Repository
// ----------------------------------------------------------------------------
export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  language: string;
  private: boolean;
  defaultBranch: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------------
// Project
// ----------------------------------------------------------------------------
export type ProjectStatus = "healthy" | "deploying" | "failed" | "warning";
export type Environment = "development" | "staging" | "production";

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  repoId: string;
  repoFullName: string;
  branch: string;
  environment: Environment;
  status: ProjectStatus;
  lastDeploy: string;
  deployCount: number;
  successRate: number;
  createdAt: string;
}

// ----------------------------------------------------------------------------
// Deployment
// ----------------------------------------------------------------------------
export type DeploymentStatus = "pending" | "in_progress" | "success" | "failed";
export type StageStatus = "pending" | "in_progress" | "success" | "failed" | "skipped";

export interface DeploymentStage {
  name: string;
  status: StageStatus;
  duration: string;
  startTime?: string;
  endTime?: string;
  logs?: string[];
}

export interface Deployment {
  id: string;
  projectId: string;
  version: string;
  status: DeploymentStatus;
  duration: string;
  timestamp: string;
  branch: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  stages: DeploymentStage[];
}

// ----------------------------------------------------------------------------
// Deployment Analysis
// ----------------------------------------------------------------------------
export interface TrivyVulnerability {
  cve: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  package: string;
  version: string;
  fixedVersion?: string;
  description: string;
}

export interface TrivyResults {
  critical: number;
  high: number;
  medium: number;
  low: number;
  vulnerabilities: TrivyVulnerability[];
}

export interface TestResult {
  name: string;
  status: "passed" | "failed" | "skipped";
  duration: string;
  error?: string;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  failureRate: number;
  duration: string;
  failedTests: TestResult[];
}

export interface LintError {
  file: string;
  line: number;
  column: number;
  message: string;
  rule: string;
  severity: "error" | "warning";
}

export interface LintResults {
  errors: number;
  warnings: number;
  details: LintError[];
}

export interface NetworkDiagnostic {
  hasIssues: boolean;
  dnsResolution: boolean;
  externalApiAccess: boolean;
  failedEndpoints: string[];
}

export interface GitHubActionsJob {
  name: string;
  status: "success" | "failed" | "in_progress";
  duration: string;
  startTime: string;
  endTime: string;
}

export interface ECSTaskRevision {
  revision: number;
  cpu: string;
  memory: string;
  image: string;
  environment: Record<string, string>;
}

export interface ECSComparison {
  previous: ECSTaskRevision;
  current: ECSTaskRevision;
  diff: Array<{
    field: string;
    old: string;
    new: string;
    changed: boolean;
  }>;
}

export interface CodeDeployResult {
  deploymentId: string;
  status: "SUCCEEDED" | "FAILED" | "STOPPED";
  trafficRouting: string;
  oldTasksTerminated: boolean;
  healthCheck: "HEALTHY" | "UNHEALTHY";
  rollbackEnabled: boolean;
}

// ----------------------------------------------------------------------------
// LLM Analysis
// ----------------------------------------------------------------------------
export interface LLMAnalysis {
  summary: string;
  failureReason?: string;
  recommendations: string[];
  optimizations?: string[];
  estimatedFixTime?: string;
  relatedIssues?: string[];
}

// ----------------------------------------------------------------------------
// Deployment Detail (Full Analysis)
// ----------------------------------------------------------------------------
export interface DeploymentDetail {
  id: string;
  projectId: string;
  deployment: Deployment;
  analysis: {
    failedStage?: string;
    trivy?: TrivyResults;
    tests?: TestSummary;
    lint?: LintResults;
    network?: NetworkDiagnostic;
    jobs?: GitHubActionsJob[];
    ecs?: ECSComparison;
    codeDeploy?: CodeDeployResult;
  };
  llmAnalysis?: LLMAnalysis;
  timeline: Array<{
    timestamp: string;
    event: string;
    details: string;
  }>;
}

// ----------------------------------------------------------------------------
// Shared Report
// ----------------------------------------------------------------------------
export interface SharedReport {
  id: string;
  deploymentId: string;
  projectName: string;
  createdAt: string;
  expiresAt?: string;
  viewCount: number;
}

// ----------------------------------------------------------------------------
// Debug & Utility
// ----------------------------------------------------------------------------
export interface DebugLog {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  context: string;
  message: string;
  data?: any;
}

// Debugging helper
export const DEBUG_MODE = process.env.NODE_ENV === "development";

export function debugLog(context: string, message: string, data?: any) {
  if (DEBUG_MODE) {
    const log: DebugLog = {
      timestamp: new Date().toISOString(),
      level: "debug",
      context,
      message,
      data,
    };
    console.log(`[DEBUG][${context}]`, message, data || "");
  }
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getGitHubActionsRuns, getWorkflowRunDetails, getWorkflowRunLogs, getJobLogs, analyzeFailureWithAI, analyzeSuccessfulDeployment } from '../actions/deployment';

interface WorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  created_at: string;
  updated_at: string;
  head_branch: string;
  head_commit: {
    message: string;
  };
  run_number: number;
}

interface WebhookEvent {
  event: string;
  payload: any;
  recordId: number;
  timestamp: string;
}

export default function DeploymentDashboard() {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRun, setExpandedRun] = useState<number | null>(null);
  const [runLogs, setRunLogs] = useState<any>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [jobLogDetails, setJobLogDetails] = useState<{[key: number]: string}>({});
  const [loadingJobLog, setLoadingJobLog] = useState<number | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzingRun, setAnalyzingRun] = useState<number | null>(null);
  const [lastWebhookEvent, setLastWebhookEvent] = useState<WebhookEvent | null>(null);
  const [sseConnected, setSSEConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  // Scoreboard state
  const [liveRunDetails, setLiveRunDetails] = useState<any>(null);
  const [scoreboard, setScoreboard] = useState<any[]>([]);
  const [deploymentAdvice, setDeploymentAdvice] = useState<string | null>(null);
  const [generatingAdvice, setGeneratingAdvice] = useState(false);
  const scoreboardIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Configuration - change these to your repo
  const REPO_OWNER = 'SBHTDog';
  const REPO_NAME = 'sbht-deploy-target';

  // Initial fetch and SSE connection
  useEffect(() => {
    fetchDeployments();
    
    // Connect to SSE for real-time webhook updates
    const connectSSE = () => {
      const eventSource = new EventSource('/api/webhooks/events');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('SSE Connected');
        setSSEConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: WebhookEvent = JSON.parse(event.data);
          setLastWebhookEvent(data);
          
          // If it's a workflow or check event, refresh deployments
          if (data.event === 'workflow_run' || data.event === 'workflow_job' || 
              data.event === 'check_run' || data.event === 'check_suite') {
            console.log('Deployment event received, refreshing...');
            fetchDeployments();
            
            // If we're watching a live run, refresh its details
            if (liveRunDetails) {
              fetchLiveRunDetails(liveRunDetails.run.id);
            }
          }
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        setSSEConnected(false);
        eventSource.close();
        
        // Reconnect after 5 seconds
        setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (scoreboardIntervalRef.current) {
        clearInterval(scoreboardIntervalRef.current);
      }
    };
  }, []);

  // Live scoreboard updates for in-progress runs
  useEffect(() => {
    if (runs.length > 0) {
      const latestRun = runs[0];
      
      // If latest run is in progress, start live updates
      if (latestRun.status === 'in_progress' || latestRun.status === 'queued') {
        fetchLiveRunDetails(latestRun.id);
        
        // Set up interval for live updates every 10 seconds
        if (scoreboardIntervalRef.current) {
          clearInterval(scoreboardIntervalRef.current);
        }
        
        scoreboardIntervalRef.current = setInterval(() => {
          fetchLiveRunDetails(latestRun.id);
        }, 10000);
      } else {
        // Clear interval if run is complete
        if (scoreboardIntervalRef.current) {
          clearInterval(scoreboardIntervalRef.current);
        }
        
        // Fetch details once for completed run
        if (!liveRunDetails || liveRunDetails.run.id !== latestRun.id) {
          fetchLiveRunDetails(latestRun.id);
        }
      }
    }
    
    return () => {
      if (scoreboardIntervalRef.current) {
        clearInterval(scoreboardIntervalRef.current);
      }
    };
  }, [runs]);

  const fetchDeployments = async () => {
    try {
      const data = await getGitHubActionsRuns(REPO_OWNER, REPO_NAME);
      setRuns(data as any);
    } catch (error) {
      console.error('Failed to fetch deployments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveRunDetails = async (runId: number) => {
    try {
      const details = await getWorkflowRunDetails(REPO_OWNER, REPO_NAME, runId);
      setLiveRunDetails(details);
      
      // Build scoreboard from jobs and steps
      if (details.jobs && details.jobs.length > 0) {
        const innings = details.jobs.flatMap((job: any) => {
          if (!job.steps || job.steps.length === 0) {
            return [{
              name: job.name,
              status: job.status,
              conclusion: job.conclusion,
              started_at: job.started_at,
              completed_at: job.completed_at,
            }];
          }
          
          return job.steps.map((step: any) => ({
            name: `${job.name}: ${step.name}`,
            status: step.status,
            conclusion: step.conclusion,
            started_at: step.started_at,
            completed_at: step.completed_at,
            number: step.number,
          }));
        });
        
        setScoreboard(innings);
      }
    } catch (error) {
      console.error('Failed to fetch live run details:', error);
    }
  };

  const handleToggleExpand = async (runId: number) => {
    if (expandedRun === runId) {
      setExpandedRun(null);
      setRunLogs(null);
      setAiAnalysis(null);
      setExpandedJob(null);
      setJobLogDetails({});
    } else {
      setExpandedRun(runId);
      setExpandedJob(null);
      setJobLogDetails({});
      try {
        const logs = await getWorkflowRunLogs(REPO_OWNER, REPO_NAME, runId);
        setRunLogs(logs);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      }
    }
  };

  const handleToggleJobLogs = async (jobId: number) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
    } else {
      setExpandedJob(jobId);
      
      // Fetch logs if not already cached
      if (!jobLogDetails[jobId]) {
        setLoadingJobLog(jobId);
        try {
          const logs = await getJobLogs(REPO_OWNER, REPO_NAME, jobId);
          setJobLogDetails(prev => ({ ...prev, [jobId]: logs }));
        } catch (error) {
          console.error('Failed to fetch job logs:', error);
          setJobLogDetails(prev => ({ ...prev, [jobId]: 'Failed to load logs' }));
        } finally {
          setLoadingJobLog(null);
        }
      }
    }
  };

  const handleAnalyzeFailure = async (runId: number, jobName: string, logs: string) => {
    setAnalyzingRun(runId);
    try {
      const analysis = await analyzeFailureWithAI(logs, jobName);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Failed to analyze:', error);
    } finally {
      setAnalyzingRun(null);
    }
  };

  const handleGenerateDeploymentAdvice = async () => {
    if (!liveRunDetails) return;
    
    setGeneratingAdvice(true);
    setDeploymentAdvice(null);
    
    try {
      // Collect all logs from all jobs
      const allLogs = await Promise.all(
        liveRunDetails.jobs.map(async (job: any) => {
          try {
            const logs = await getJobLogs(REPO_OWNER, REPO_NAME, job.id);
            return `=== ${job.name} ===\n${logs}\n`;
          } catch (error) {
            return `=== ${job.name} ===\nFailed to fetch logs\n`;
          }
        })
      );
      
      const combinedLogs = allLogs.join('\n\n');
      const runSummary = `${liveRunDetails.run.name} #${liveRunDetails.run.run_number} - ${liveRunDetails.run.conclusion}`;
      
      const advice = await analyzeSuccessfulDeployment(combinedLogs, runSummary);
      setDeploymentAdvice(advice.summary);
    } catch (error) {
      console.error('Failed to generate advice:', error);
      setDeploymentAdvice('Failed to generate deployment advice');
    } finally {
      setGeneratingAdvice(false);
    }
  };

  const getStatusColor = (status: string, conclusion: string | null) => {
    if (status === 'in_progress' || status === 'queued') return 'bg-yellow-500';
    if (conclusion === 'success') return 'bg-green-500';
    if (conclusion === 'failure') return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getStatusText = (status: string, conclusion: string | null) => {
    if (status === 'in_progress') return 'In Progress';
    if (status === 'queued') return 'Queued';
    if (conclusion === 'success') return 'Success';
    if (conclusion === 'failure') return 'Failed';
    return 'Unknown';
  };

  // Calculate success/failure stats
  const completedRuns = runs.filter(r => r.status === 'completed');
  const successCount = completedRuns.filter(r => r.conclusion === 'success').length;
  const failureCount = completedRuns.filter(r => r.conclusion === 'failure').length;
  const inProgressCount = runs.filter(r => r.status === 'in_progress').length;

  // Latest run for scoreboard
  const latestRun = runs[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SBHT Bastion
              </Link>
              {/* SSE Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${sseConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                  {sseConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              <a href="/auth/github/logout" className="text-gray-600 hover:text-red-600 font-medium transition-colors">
                Logout
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Deployment Dashboard
          </h1>
          <p className="text-gray-600 text-lg">{REPO_OWNER}/{REPO_NAME} • GitHub Actions Pipeline</p>
        </div>

        {/* Baseball Scoreboard - Latest Run */}
        {latestRun && (
          <div className="mb-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl border-4 border-gray-700">
            <div className="text-center mb-6">
              <div className="text-yellow-400 text-sm font-bold mb-2">⚾ DEPLOYMENT BASEBALL SCOREBOARD ⚾</div>
              <div className="text-white text-2xl font-bold mb-4">
                {latestRun.name} #{latestRun.run_number}
              </div>
              
              {/* Status Banner */}
              <div className={`inline-block px-8 py-3 rounded-lg font-bold text-white text-xl mb-4 ${
                latestRun.status === 'in_progress' ? 'bg-yellow-500 animate-pulse' :
                latestRun.conclusion === 'success' ? 'bg-green-500' :
                latestRun.conclusion === 'failure' ? 'bg-red-500' :
                'bg-gray-500'
              }`}>
                {latestRun.status === 'in_progress' && '⏳ GAME IN PROGRESS'}
                {latestRun.conclusion === 'success' && '🏆 GAME WON!'}
                {latestRun.conclusion === 'failure' && '⚾ STRIKE OUT!'}
              </div>

              <div className="text-gray-400 text-sm">
                Branch: {latestRun.head_branch} • {new Date(latestRun.created_at).toLocaleString()}
              </div>
            </div>

            {/* Baseball Innings - Live Progress */}
            {scoreboard.length > 0 && (
              <div className="mb-6 bg-gray-800/30 rounded-xl p-6 border-2 border-yellow-500">
                <div className="text-yellow-300 font-bold text-center mb-4">⚾ INNINGS (STEPS) ⚾</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {scoreboard.map((inning, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        inning.status === 'completed' && inning.conclusion === 'success' ? 'bg-green-900/30 border-green-500' :
                        inning.status === 'completed' && inning.conclusion === 'failure' ? 'bg-red-900/30 border-red-500' :
                        inning.status === 'in_progress' ? 'bg-yellow-900/30 border-yellow-500 animate-pulse' :
                        'bg-gray-800/30 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white text-xs font-bold">
                          {index + 1}회 {index % 2 === 0 ? '초' : '말'}
                        </span>
                        <span className="text-xs">
                          {inning.status === 'completed' && inning.conclusion === 'success' && '✓'}
                          {inning.status === 'completed' && inning.conclusion === 'failure' && '✗'}
                          {inning.status === 'in_progress' && '⏳'}
                          {inning.status === 'queued' && '⏸'}
                        </span>
                      </div>
                      <div className="text-gray-300 text-xs mt-1 truncate" title={inning.name}>
                        {inning.name}
                      </div>
                      {inning.completed_at && inning.started_at && (
                        <div className="text-gray-500 text-xs mt-1">
                          {Math.round((new Date(inning.completed_at).getTime() - new Date(inning.started_at).getTime()) / 1000)}s
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Live Update Indicator */}
                {latestRun.status === 'in_progress' && (
                  <div className="text-center mt-4 text-yellow-400 text-sm animate-pulse">
                    🔴 LIVE • Updating every 10 seconds
                  </div>
                )}
              </div>
            )}

            {/* Scoreboard Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-800/50 rounded-xl p-6 text-center border-2 border-green-500">
                <div className="text-green-400 text-4xl font-bold mb-2">{successCount}</div>
                <div className="text-gray-400 text-sm font-semibold">WINS</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 text-center border-2 border-yellow-500">
                <div className="text-yellow-400 text-4xl font-bold mb-2">{inProgressCount}</div>
                <div className="text-gray-400 text-sm font-semibold">IN PLAY</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-6 text-center border-2 border-red-500">
                <div className="text-red-400 text-4xl font-bold mb-2">{failureCount}</div>
                <div className="text-gray-400 text-sm font-semibold">LOSSES</div>
              </div>
            </div>

            {/* AI Deployment Advice - Only for successful deployments */}
            {latestRun.conclusion === 'success' && liveRunDetails && (
              <div className="bg-purple-900/30 border-2 border-purple-500 rounded-xl p-6">
                <div className="text-center mb-4">
                  <h3 className="text-purple-300 font-bold text-lg mb-2">🤖 AI Deployment Analysis</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Get AI-powered insights and optimization suggestions for this deployment
                  </p>
                  
                  {!deploymentAdvice && !generatingAdvice && (
                    <button
                      onClick={handleGenerateDeploymentAdvice}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold"
                    >
                      🧠 Generate Deployment Advice
                    </button>
                  )}
                  
                  {generatingAdvice && (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                      <span className="text-purple-300">Analyzing deployment logs with AI...</span>
                    </div>
                  )}
                </div>
                
                {deploymentAdvice && (
                  <div className="bg-white/10 rounded-lg p-6 mt-4">
                    <div className="text-white whitespace-pre-wrap text-sm">
                      {deploymentAdvice}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Deployment History */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">📊 Deployment History</h2>
              <p className="text-sm text-gray-500 mt-1">
                {sseConnected ? '✓ Auto-updating via webhooks' : '⚠ Manual refresh only'}
              </p>
            </div>
            <button
              onClick={fetchDeployments}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔄 Manual Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading deployments...</p>
            </div>
          ) : runs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No deployments found</p>
              <p className="text-sm mt-2">Make sure you have GitHub Actions configured</p>
            </div>
          ) : (
            <div className="space-y-4">
              {runs.map((run) => (
                <div
                  key={run.id}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                >
                  {/* Run Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleToggleExpand(run.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Status Indicator */}
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(run.status, run.conclusion)}`} />
                        
                        {/* Run Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {run.name} #{run.run_number}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(run.status, run.conclusion)}`}>
                              {getStatusText(run.status, run.conclusion)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-mono">{run.head_branch}</span>
                            {' • '}
                            <span>{run.head_commit.message.split('\n')[0]}</span>
                            {' • '}
                            <span>{new Date(run.created_at).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <div className="text-gray-400">
                          {expandedRun === run.id ? '▼' : '▶'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content - Logs & Analysis */}
                  {expandedRun === run.id && (
                    <div className="border-t-2 border-gray-200 bg-gray-50 p-6">
                      {/* Logs Section */}
                      {runLogs && (
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-gray-800 mb-4">📋 Workflow Jobs</h4>
                          <div className="space-y-3">
                            {runLogs.map((job: any) => (
                              <div key={job.id} className="bg-white rounded-lg border border-gray-200">
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3 flex-1">
                                      <span className="font-bold text-gray-800">{job.name}</span>
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                                        job.conclusion === 'success' ? 'bg-green-500' :
                                        job.conclusion === 'failure' ? 'bg-red-500' :
                                        'bg-gray-500'
                                      }`}>
                                        {job.conclusion || job.status}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleToggleJobLogs(job.id)}
                                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                    >
                                      {expandedJob === job.id ? '▼ Hide Logs' : '▶ View Logs'}
                                    </button>
                                  </div>
                                  <div className="text-sm text-gray-600 mb-2">
                                    Duration: {job.completed_at && job.started_at 
                                      ? Math.round((new Date(job.completed_at).getTime() - new Date(job.started_at).getTime()) / 1000) 
                                      : '?'}s
                                  </div>
                                  
                                  {/* Job Steps Summary */}
                                  {job.steps && job.steps.length > 0 && (
                                    <div className="text-xs text-gray-500 mb-2">
                                      {job.steps.length} steps • Started: {new Date(job.started_at).toLocaleString()}
                                    </div>
                                  )}

                                  {/* Detailed Logs */}
                                  {expandedJob === job.id && (
                                    <div className="mt-3 border-t border-gray-200 pt-3">
                                      {loadingJobLog === job.id ? (
                                        <div className="text-center py-4">
                                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                          <p className="text-sm text-gray-600 mt-2">Loading logs...</p>
                                        </div>
                                      ) : jobLogDetails[job.id] ? (
                                        <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
                                          <pre className="text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                                            {jobLogDetails[job.id]}
                                          </pre>
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-500">No logs available</p>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Analyze Button for Failed Jobs */}
                                  {job.conclusion === 'failure' && (
                                    <button
                                      onClick={() => handleAnalyzeFailure(run.id, job.name, jobLogDetails[job.id] || job.name)}
                                      disabled={analyzingRun === run.id}
                                      className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:bg-gray-400"
                                    >
                                      {analyzingRun === run.id ? '🤖 Analyzing...' : '🤖 Analyze Failure with AI'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Analysis Section */}
                      {aiAnalysis && expandedRun === run.id && (
                        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6">
                          <h4 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                            🤖 AI Failure Analysis
                            <span className="text-sm font-normal text-purple-600">
                              (Confidence: {aiAnalysis.confidence}%)
                            </span>
                          </h4>
                          <div className="bg-white rounded-lg p-4 text-gray-800 whitespace-pre-wrap">
                            {aiAnalysis.summary}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use server';

import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';

export async function getGitHubActionsRuns(owner: string, repo: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const octokit = new Octokit({ auth: token });

  try {
    const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 10,
    });

    return data.workflow_runs;
  } catch (error) {
    console.error('Failed to fetch GitHub Actions runs:', error);
    throw new Error('Failed to fetch deployment history');
  }
}

export async function getWorkflowRunLogs(owner: string, repo: string, runId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const octokit = new Octokit({ auth: token });

  try {
    // Get jobs for the run with steps details
    const { data: jobs } = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
      filter: 'all',
    });

    return jobs.jobs;
  } catch (error) {
    console.error('Failed to fetch workflow logs:', error);
    throw new Error('Failed to fetch logs');
  }
}

export async function getWorkflowRunDetails(owner: string, repo: string, runId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const octokit = new Octokit({ auth: token });

  try {
    // Get detailed run information
    const { data: run } = await octokit.rest.actions.getWorkflowRun({
      owner,
      repo,
      run_id: runId,
    });

    // Get jobs with steps
    const { data: jobs } = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
      filter: 'all',
    });

    return {
      run,
      jobs: jobs.jobs,
    };
  } catch (error) {
    console.error('Failed to fetch workflow run details:', error);
    throw new Error('Failed to fetch run details');
  }
}

export async function getJobLogs(owner: string, repo: string, jobId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const octokit = new Octokit({ auth: token });

  try {
    // Get raw logs for a specific job
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs', {
      owner,
      repo,
      job_id: jobId,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    // The response should be the log text directly
    return response.data as string;
  } catch (error: any) {
    console.error('Failed to fetch job logs:', error);
    
    // If logs are not available yet or expired
    if (error.status === 404) {
      return 'Logs are not available. They may have expired or not been generated yet.';
    }
    
    throw new Error(`Failed to fetch job logs: ${error.message || 'Unknown error'}`);
  }
}

export async function analyzeFailureWithAI(errorLogs: string, jobName: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      summary: 'OpenAI API key not configured',
      rootCauses: [],
      suggestions: [],
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a DevOps expert analyzing CI/CD deployment failures. Provide concise, actionable insights.',
          },
          {
            role: 'user',
            content: `Analyze this GitHub Actions deployment failure for job "${jobName}":\n\n${errorLogs}\n\nProvide: 1) Summary, 2) Root causes, 3) Specific fix suggestions`,
          },
        ],
        max_completion_tokens: 1000,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response data:', data);
    const analysis = data.choices[0].message.content;

    // Parse the AI response
    return {
      summary: analysis,
      confidence: 85,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      summary: 'Failed to analyze with AI',
      rootCauses: [],
      suggestions: [],
    };
  }
}

export async function analyzeSuccessfulDeployment(allLogs: string, runSummary: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      summary: 'OpenAI API key not configured',
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a DevOps expert analyzing successful CI/CD deployments. Provide insights on optimization, best practices, and potential improvements.',
          },
          {
            role: 'user',
            content: `Analyze this successful GitHub Actions deployment:\n\nSummary: ${runSummary}\n\nLogs:\n${allLogs.slice(0, 8000)}\n\nProvide: 1) Overall assessment, 2) Performance observations, 3) Optimization suggestions, 4) Best practice recommendations`,
          },
        ],
        max_completion_tokens: 1500,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response data:', data);
    const analysis = data.choices[0].message.content;

    return {
      summary: analysis,
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      summary: 'Failed to analyze deployment',
    };
  }
}

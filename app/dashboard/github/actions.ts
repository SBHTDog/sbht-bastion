'use server';

import { cookies } from 'next/headers';
import { getAuthenticatedUser, getUserRepositories } from '@/src/github/ghacc';

export async function getGitHubToken() {
  const cookieStore = await cookies();
  return cookieStore.get('github_token')?.value;
}

export async function checkAuthentication() {
  const token = await getGitHubToken();
  return {
    authenticated: !!token,
  };
}

export async function fetchGitHubUser() {
  const token = await getGitHubToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const user = await getAuthenticatedUser(token);
    return user;
  } catch (error) {
    console.error('Failed to fetch GitHub user:', error);
    throw new Error('Failed to fetch user data');
  }
}

export async function fetchGitHubRepos() {
  const token = await getGitHubToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const repos = await getUserRepositories(token, {
      sort: 'updated',
      per_page: 10,
    });
    return repos;
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error);
    throw new Error('Failed to fetch repositories');
  }
}

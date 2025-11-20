import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, getUserRepositories } from '@/src/github/ghacc';

export async function POST(request: NextRequest) {
  try {
    // Get token from HttpOnly cookie
    const token = request.cookies.get('github_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated', message: 'GitHub token not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'getUser': {
        const user = await getAuthenticatedUser(token);
        return NextResponse.json({ data: user });
      }

      case 'getRepos': {
        const repos = await getUserRepositories(token, {
          sort: 'updated',
          per_page: 10,
        });
        return NextResponse.json({ data: repos });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch GitHub data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// New endpoint to check authentication status
export async function GET(request: NextRequest) {
  const token = request.cookies.get('github_token')?.value;
  const expiresAt = request.cookies.get('github_token_expires')?.value;

  return NextResponse.json({
    authenticated: !!token,
    expiresAt: expiresAt || null,
  });
}

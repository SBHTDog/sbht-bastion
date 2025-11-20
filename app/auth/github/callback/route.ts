import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/src/github/ghacc';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    return NextResponse.json(
      { error, description: errorDescription },
      { status: 400 }
    );
  }

  // Validate code parameter
  if (!code) {
    return NextResponse.json(
      { error: 'missing_code', description: 'Authorization code is missing' },
      { status: 400 }
    );
  }

  try {
    // Exchange code for access token
    const tokens = await exchangeCodeForToken(code, {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    });

    // Create redirect response (relative path for nginx reverse proxy)
    const response = NextResponse.redirect(new URL('/dashboard/github', request.url));

    // Store token in HttpOnly cookie
    const isSecure = process.env.COOKIE_SECURE !== 'false';
    response.cookies.set('github_token', tokens.accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Optional: Store token expiry if available
    if (tokens.expiresAt) {
      response.cookies.set('github_token_expires', tokens.expiresAt, {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }

    console.log('GitHub token stored in HttpOnly cookie (secure:', isSecure, ')');
    
    return response;

  } catch (err) {
    console.error('GitHub OAuth callback error:', err);
    return NextResponse.json(
      { 
        error: 'token_exchange_failed', 
        description: err instanceof Error ? err.message : 'Failed to exchange code for token' 
      },
      { status: 500 }
    );
  }
}

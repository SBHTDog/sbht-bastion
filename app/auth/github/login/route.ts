import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationUrl } from '@/src/github/ghacc';

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub Client ID not configured' },
      { status: 500 }
    );
  }

  // Generate redirect URI
  const redirectUri = process.env.NEXTAUTH_URL as string;
  
  // Optional: Generate state for CSRF protection
  const state = Math.random().toString(36).substring(7);
  
  // Get authorization URL
  const authUrl = getAuthorizationUrl(clientId, redirectUri, state);
  
  // Redirect to GitHub OAuth
  return NextResponse.redirect(authUrl);
}

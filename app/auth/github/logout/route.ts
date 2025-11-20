import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Use PUBLIC_URL env var or X-Forwarded-Host header for reverse proxy support
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = process.env.PUBLIC_URL || 
                  (forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.nextUrl.origin);
  
  const response = NextResponse.redirect(new URL('/dashboard/github', baseUrl));

  // Clear GitHub token cookies
  response.cookies.delete('github_token');
  response.cookies.delete('github_token_expires');

  console.log('GitHub token cookies cleared');

  return response;
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out' });

  // Clear GitHub token cookies
  response.cookies.delete('github_token');
  response.cookies.delete('github_token_expires');

  console.log('GitHub token cookies cleared');

  return response;
}

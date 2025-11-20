import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/dashboard/github', request.nextUrl.origin));

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

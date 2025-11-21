import { redirect } from 'next/navigation';
import Link from 'next/link';
import { checkAuthentication, fetchGitHubUser, fetchGitHubRepos } from './actions';
import LogoutButton from './LogoutButton';
import { Card, Button, Badge } from '@/components/ui';

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string | null;
}

export default async function GitHubDashboardPage() {
  // Check authentication on server
  const { authenticated } = await checkAuthentication();

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full animate-fadeIn">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">GitHub Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Connect your GitHub account to view your profile and repositories.
          </p>
          <Link href="/auth/github/login">
            <Button variant="primary" className="w-full">
              Login with GitHub
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Fetch data on server
  let user: GitHubUser | null = null;
  let repos: GitHubRepo[] = [];
  let error: string | null = null;

  try {
    [user, repos] = await Promise.all([
      fetchGitHubUser(),
      fetchGitHubRepos(),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : 'An error occurred';
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full animate-fadeIn">
          <h2 className="text-red-800 font-bold mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/dashboard/github">
            <Button variant="danger" size="sm">
              Try again
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">GitHub Dashboard</h1>
          <p className="text-gray-600">Your GitHub profile and repositories</p>
        </div>

        {user && (
          <Card className="mb-8 animate-slideUp">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-24 h-24 rounded-full border-2 border-white/50 shadow-lg"
              />
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {user.name || user.login}
                  </h2>
                  <LogoutButton />
                </div>
                <p className="text-gray-600 mb-2">@{user.login}</p>
                {user.bio && <p className="text-gray-700 mb-6">{user.bio}</p>}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">{user.public_repos}</div>
                    <div className="text-gray-600 text-sm">Repositories</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">{user.followers}</div>
                    <div className="text-gray-600 text-sm">Followers</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">{user.following}</div>
                    <div className="text-gray-600 text-sm">Following</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">{user.public_gists}</div>
                    <div className="text-gray-600 text-sm">Gists</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {user.company && (
                    <div className="flex items-center gap-1">
                      <span>🏢</span>
                      <span>{user.company}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.blog && (
                    <div className="flex items-center gap-1">
                      <span>🔗</span>
                      <a href={user.blog} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {user.blog}
                      </a>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center gap-1">
                      <span>✉️</span>
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {repos.length > 0 && (
          <Card className="animate-slideUp">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Recent Repositories</h2>
            <div className="space-y-6">
              {repos.map((repo) => (
                <div key={repo.id} className="border-b border-gray-200/50 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 hover:underline font-semibold text-lg inline-block mb-2"
                      >
                        {repo.name}
                      </a>
                      {repo.description && (
                        <p className="text-gray-600 mb-3 leading-relaxed">{repo.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="font-medium">{repo.language}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span>⭐</span>
                          <span>{repo.stargazers_count}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🔀</span>
                          <span>{repo.forks_count}</span>
                        </span>
                        {repo.updated_at && (
                          <span>
                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

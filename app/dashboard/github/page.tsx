import { redirect } from 'next/navigation';
import { checkAuthentication, fetchGitHubUser, fetchGitHubRepos } from './actions';
import LogoutButton from './LogoutButton';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">GitHub Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Connect your GitHub account to view your profile and repositories.
          </p>
          <a
            href="/auth/github/login"
            className="block w-full bg-gray-900 text-white text-center py-3 px-4 rounded-lg hover:bg-gray-800 transition"
          >
            Login with GitHub
          </a>
        </div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-red-800 font-bold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <a
            href="/dashboard/github"
            className="mt-4 inline-block text-red-800 underline"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">GitHub Dashboard</h1>
          <p className="text-gray-600">Your GitHub profile and repositories</p>
        </div>

        {user && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-start gap-6">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-24 h-24 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">
                    {user.name || user.login}
                  </h2>
                  <LogoutButton />
                </div>
                <p className="text-gray-600 mb-2">@{user.login}</p>
                {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-2xl font-bold">{user.public_repos}</div>
                    <div className="text-gray-600 text-sm">Repositories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{user.followers}</div>
                    <div className="text-gray-600 text-sm">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{user.following}</div>
                    <div className="text-gray-600 text-sm">Following</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{user.public_gists}</div>
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
          </div>
        )}

        {repos.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Repositories</h2>
            <div className="space-y-4">
              {repos.map((repo) => (
                <div key={repo.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-semibold text-lg"
                      >
                        {repo.name}
                      </a>
                      {repo.description && (
                        <p className="text-gray-600 mt-1">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            {repo.language}
                          </span>
                        )}
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🔀 {repo.forks_count}</span>
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
          </div>
        )}
      </div>
    </div>
  );
}

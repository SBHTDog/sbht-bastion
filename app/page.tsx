import { checkAuthentication } from './dashboard/github/actions';
import DeploymentDashboard from './components/DeploymentDashboard';
import Link from 'next/link';

export default async function Home() {
  const { authenticated } = await checkAuthentication();

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-2 border-blue-100">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SBHT Bastion
            </h1>
            <p className="text-xl text-gray-600 mb-4">Deployment Dashboard</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-gray-700 text-center">
              🔐 Connect your GitHub account to access the deployment monitoring dashboard
            </p>
          </div>

          <a
            href="/auth/github/login"
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg"
          >
            Login with GitHub
          </a>

          
        </div>
      </div>
    );
  }

  return <DeploymentDashboard />;
}

"use client";

// Onboarding - GitHub Repository Selection
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { mockGitHubRepos, searchRepos } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");

  const filteredRepos = searchQuery ? searchRepos(searchQuery) : mockGitHubRepos;

  const handleSelectRepo = () => {
    if (!selectedRepo) {
      alert("Please select a repository");
      return;
    }

    debugLog("Onboarding", "Repository selected", { selectedRepo });
    router.push(`/project/new?repo=${selectedRepo}`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Deploy Monitor
            </Link>
          </div>
        </nav>

        <div className="container mx-auto p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2 text-gray-800">Select Repository</h1>
            <p className="text-gray-600 text-lg">Choose a GitHub repository to deploy</p>
          </div>

          {/* Search */}
          <Card className="mb-8">
            <input
              type="text"
              placeholder="Search repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-lg text-gray-700 font-medium focus:border-blue-500 focus:outline-none"
            />
          </Card>

          {/* Repository List */}
          <div className="space-y-4 mb-8">
            {filteredRepos.map((repo) => (
              <Card
                key={repo.id}
                className={`cursor-pointer transition-all ${
                  selectedRepo === repo.id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedRepo(repo.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{repo.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{repo.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>⭐ {repo.stars}</span>
                      <span>🔤 {repo.language}</span>
                      <span>{repo.private ? "🔒 Private" : "🌍 Public"}</span>
                    </div>
                  </div>
                  {selectedRepo === repo.id && (
                    <span className="text-blue-600 text-2xl">✓</span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">← Cancel</Button>
            </Link>
            <Button onClick={handleSelectRepo} disabled={!selectedRepo}>
              Next →
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

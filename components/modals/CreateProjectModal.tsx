// Project Creation Modal - Enhanced Glassmorphism + Responsive
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { mockGitHubRepos, searchRepos } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [projectName, setProjectName] = useState("");
  const [branch, setBranch] = useState("main");
  const [environment, setEnvironment] = useState<"development" | "staging" | "production">(
    "production"
  );

  const filteredRepos = searchQuery ? searchRepos(searchQuery) : mockGitHubRepos;
  const repo = mockGitHubRepos.find((r) => r.id === selectedRepo);

  const handleNext = () => {
    if (step === 1 && selectedRepo) {
      const repoName = mockGitHubRepos.find((r) => r.id === selectedRepo)?.name || "";
      setProjectName(repoName);
      setStep(2);
    }
  };

  const handleCreate = () => {
    debugLog("CreateProjectModal", "Creating project", {
      projectName,
      branch,
      environment,
      selectedRepo,
    });

    alert(`Project "${projectName}" created successfully! (Mock data)`);
    onClose();
    setStep(1);
    setSelectedRepo("");
    setSearchQuery("");
    router.refresh();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedRepo("");
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Project">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? "bg-blue-600" : "bg-gray-200"}`} />
        <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
        <span className="text-xs sm:text-sm font-medium text-gray-600 ml-2">
          {step}/2
        </span>
      </div>

      {/* Step 1: Repository Selection */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Repository List */}
          <div className="space-y-2 max-h-60 sm:max-h-72 overflow-y-auto custom-scrollbar">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className={`p-3 sm:p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedRepo === repo.id
                    ? "border-blue-500 bg-blue-50/80 backdrop-blur-sm shadow-sm"
                    : "border-gray-200 bg-white/60 hover:bg-white/80 hover:border-blue-300"
                }`}
                onClick={() => setSelectedRepo(repo.id)}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 truncate">{repo.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600 line-clamp-1">{repo.description}</div>
                    <div className="flex gap-3 text-xs text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        ⭐ {repo.stars}
                      </span>
                      <span>{repo.language}</span>
                      <span>{repo.private ? "🔒" : "🌍"}</span>
                    </div>
                  </div>
                  {selectedRepo === repo.id && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Next */}
          <Button onClick={handleNext} disabled={!selectedRepo} className="w-full justify-center">
            Next
          </Button>
        </div>
      )}

      {/* Step 2: Project Settings */}
      {step === 2 && repo && (
        <div className="space-y-4">
          {/* Repository Info */}
          <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Repository</div>
            <div className="font-bold text-gray-800 truncate">{repo.fullName}</div>
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              placeholder="Project name"
            />
          </div>

          {/* Branch & Environment - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              >
                <option value="main">main</option>
                <option value="develop">develop</option>
                <option value="staging">staging</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
              <select
                value={environment}
                onChange={(e) =>
                  setEnvironment(e.target.value as "development" | "staging" | "production")
                }
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 sm:flex-initial">
              Back
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!projectName}
              className="flex-1 sm:flex-initial justify-center"
            >
              Create
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

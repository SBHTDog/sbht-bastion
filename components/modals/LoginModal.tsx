// Login Modal - Enhanced Glassmorphism + Responsive
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { useMockAuth } from "@/contexts/MockAuthContext";
import { mockUsers } from "@/lib/mockData";
import { debugLog } from "@/lib/types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const { login } = useMockAuth();
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    debugLog("LoginModal", "Attempting login", { selectedUser });
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));
    const success = await login(selectedUser);

    if (success) {
      debugLog("LoginModal", "Login successful");
      onClose();
      router.push("/dashboard");
    } else {
      setIsLoading(false);
      alert("Login failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login">
      <form onSubmit={handleLogin} className="space-y-6">
        {/* GitHub Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-900 flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="white" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
        </div>

        {/* Account selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Test Account
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-lg font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
            disabled={isLoading}
          >
            <option value="">Choose</option>
            {mockUsers.map((user) => (
              <option key={user.id} value={user.githubUsername}>
                {user.name} (@{user.githubUsername})
              </option>
            ))}
          </select>
        </div>

        {/* Login button */}
        <Button
          type="submit"
          disabled={isLoading || !selectedUser}
          className="w-full justify-center flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            "Sign in with GitHub"
          )}
        </Button>

        {/* Info */}
        <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-800">
            💡 Test account for mock data demonstration
          </p>
        </div>
      </form>
    </Modal>
  );
}

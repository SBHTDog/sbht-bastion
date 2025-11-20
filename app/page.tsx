"use client";

// Landing Page - Simple Professional Style
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";
import LoginModal from "@/components/modals/LoginModal";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold text-slate-900">
              Deploy Monitor
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLogin(true)}
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Demo Login
              </button>
              <Link
                href="/auth/login"
                className="text-white bg-slate-900 hover:bg-slate-800 font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Sign in with GitHub
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              CI/CD Deployment
              <span className="block text-slate-300">Monitoring Platform</span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Real-time deployment tracking and analytics for modern DevOps teams
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowLogin(true)}
              className="px-12 py-4 text-lg bg-white text-slate-900 hover:bg-slate-100 shadow-lg font-medium"
            >
              Get Started
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-6">
          <div className="container mx-auto text-center">
            <p className="text-slate-500 text-sm">© 2025 Deploy Monitor. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

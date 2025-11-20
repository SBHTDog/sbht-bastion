"use client";

// 랜딩 페이지 - 로그인 모달 통합
import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";
import LoginModal from "@/components/modals/LoginModal";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Deploy Monitor
            </Link>
            <button
              onClick={() => setShowLogin(true)}
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              로그인
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="flex-1 flex items-center justify-center bg-blue-600 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-6xl font-bold text-white mb-4">
              CI/CD 배포 모니터링
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              배포 현황 실시간 추적 및 분석
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowLogin(true)}
              className="px-12 py-4 text-lg !bg-white !text-blue-600 hover:!bg-gray-50 shadow-lg"
            >
              시작하기
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 px-6">
          <div className="container mx-auto text-center">
            <p className="text-gray-400 text-xs">© 2025 Deploy Monitor</p>
          </div>
        </footer>
      </div>

      {/* 로그인 모달 */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

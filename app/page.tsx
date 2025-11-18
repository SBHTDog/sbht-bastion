import Link from "next/link";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">⚾ Deploy Monitor</Link>
          <nav className="flex gap-6 items-center">
            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="blue-gradient py-32 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
            CI/CD Deploy Monitor
          </h1>
          <p className="text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-light">
            게임화된 배포 모니터링으로 실패를 학습으로 전환하세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">Get Started</Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg">Learn More</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Key Features</h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            강력하고 직관적인 배포 모니터링 도구
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <div className="text-5xl mb-6">⚾</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Real-time Monitoring</h3>
              <p className="text-gray-600 leading-relaxed">
                야구 스코어보드 스타일로 배포 상태를 실시간으로 모니터링
              </p>
            </Card>
            <Card>
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">AI Failure Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                LLM 기반 실패 원인 분석 및 해결 방법 제안
              </p>
            </Card>
            <Card>
              <div className="text-5xl mb-6">📊</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Team Documentation</h3>
              <p className="text-gray-600 leading-relaxed">
                팀과 배포 히스토리를 공유하고 학습 자료로 활용
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Start?</h2>
          <p className="text-white/90 mb-10 text-xl">
            지금 바로 배포 모니터링을 시작하세요
          </p>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg">Start Free Trial</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="container mx-auto text-center text-gray-500">
          <p>&copy; 2025 Deploy Monitor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

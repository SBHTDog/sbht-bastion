import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">⚾ Deploy Monitor</div>
          <nav className="flex gap-4 items-center">
            <a href="#features" className="text-gray-400 hover:text-white">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a>
            <Button variant="outline" size="sm">Login</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="blue-gradient py-24 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            CI/CD Deploy Monitor
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            게임화된 배포 모니터링으로 실패를 학습으로 전환하세요
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <div className="text-4xl mb-4">⚾</div>
              <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
              <p className="text-gray-400">
                야구 스코어보드 스타일로 배포 상태를 실시간으로 모니터링
              </p>
            </Card>
            <Card>
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Failure Analysis</h3>
              <p className="text-gray-400">
                LLM 기반 실패 원인 분석 및 해결 방법 제안
              </p>
            </Card>
            <Card>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Team Documentation</h3>
              <p className="text-gray-400">
                팀과 배포 히스토리를 공유하고 학습 자료로 활용
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-gray-400 mb-8">
            지금 바로 배포 모니터링을 시작하세요
          </p>
          <Button size="lg">Start Free Trial</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="container mx-auto text-center text-gray-500">
          <p>&copy; 2025 Deploy Monitor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

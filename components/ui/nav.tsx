export default function Nav() {
  return (
    <nav className="border-b border-gray-800 bg-gray-900/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold hover:opacity-80">
            ⚾ Deploy Monitor
          </a>
          <div className="flex gap-6 items-center">
            <a href="/dashboard" className="text-gray-400 hover:text-white">
              Dashboard
            </a>
            <a href="/deploy" className="text-gray-400 hover:text-white">
              Deploy
            </a>
            <a href="/history" className="text-gray-400 hover:text-white">
              History
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

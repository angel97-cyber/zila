import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <main className="flex flex-col items-center gap-6 text-center">
        {/* The Logo / Title */}
        <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          ZILA
        </h1>
        
        {/* The Tagline */}
        <p className="text-xl text-gray-400 max-w-md">
          Your Zone. Live.
        </p>

        {/* The Buttons */}
        <div className="flex gap-4 mt-8">
          <Link href="/zone" className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
            Enter Zila
          </Link>
          <button className="px-6 py-3 border border-gray-700 text-white rounded-full hover:bg-gray-900 transition">
            Scan Label
          </button>
        </div>
      </main>

      {/* The Footer */}
      <footer className="absolute bottom-4 text-xs text-gray-600">
        Built by Angel & Gemini • 2026
      </footer>
    </div>
  );
}
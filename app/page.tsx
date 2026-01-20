import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center">
      
      {/* BACKGROUND EFFECTS (The "Expensive" Look) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]" />

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex flex-col items-center gap-8 text-center px-4">
        
        {/* The Brand */}
        <div className="animate-fade-in-up">
          <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
            ZILA
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-400 max-w-lg mx-auto leading-relaxed">
            The internet of <span className="text-blue-400 font-bold">here</span>.
            <br />
            Connect with everyone within 1000m.
          </p>
        </div>

        {/* The Action Buttons (Glassmorphism) */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-sm">
          
          <Link 
            href="/zone" 
            className="group relative w-full px-8 py-4 bg-white text-black font-bold text-lg rounded-2xl hover:scale-105 transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Enter Zone
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <button className="w-full px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 text-white font-medium text-lg rounded-2xl hover:bg-white/20 transition duration-200">
            Scan Label
          </button>
        </div>

        {/* Social Proof / Trust Badge */}
        <div className="mt-12 flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live in Kathmandu & Global
        </div>

      </main>

      {/* Subtle Footer (No more "Built by...") */}
      <footer className="absolute bottom-6 text-xs text-gray-700">
        © 2026 Zila Inc. • Privacy • Terms
      </footer>
    </div>
  );
}
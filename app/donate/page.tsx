import Link from 'next/link';

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* NAVIGATION */}
      <nav className="p-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <Link href="/" className="font-bold text-xl tracking-tighter hover:text-blue-400 transition-colors">
          ZILA / WALLS
        </Link>
        <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex flex-col items-center justify-center p-6 md:p-12 max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* AVATAR / PROFILE */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px] mb-6 shadow-2xl shadow-blue-500/20">
          <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-3xl">
            👷‍♂️
          </div>
        </div>

        {/* HEADLINE */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
          Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Angel.</span>
        </h1>
        
        <p className="text-xl text-zinc-300 font-medium mb-8">
          Civil Engineer. Indie Hacker. Dreamer.
        </p>

        {/* THE STORY (The "Why") */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-12 text-left shadow-lg backdrop-blur-sm">
          <p className="text-zinc-400 leading-relaxed mb-4">
            I built <strong>WALLS</strong> because I believe the internet shouldn&apos;t be lonely. 
            I wanted a place where anyone could leave a mark on any website.
          </p>
          <p className="text-zinc-400 leading-relaxed mb-4">
            Right now, I am a student in Nepal preparing for my <strong>Master&apos;s in Construction Management</strong> in Australia. 
            The tuition is steep ($40k+), and I&apos;m working hard to bridge the gap between physical engineering and digital software.
          </p>
          <p className="text-white font-medium">
            Every dollar you donate buys me coffee while I code, helps pay for the servers, and gets me one step closer to Sydney.
          </p>
        </div>

        {/* DONATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          
          {/* INTERNATIONAL CARD */}
          <div className="group bg-gradient-to-b from-zinc-800 to-zinc-900 p-[1px] rounded-2xl hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-zinc-900 h-full rounded-2xl p-6 flex flex-col items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl text-white tracking-widest">
                GLOBAL
              </div>
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-900/30 group-hover:text-blue-400 transition-colors">
                🌍
              </div>
              <h3 className="text-lg font-bold text-white mb-1">International Support</h3>
              <p className="text-xs text-zinc-500 mb-6">Via Patreon (PayPal / Cards)</p>
              
              <a 
                href="https://www.patreon.com/angelmainali" 
                target="_blank"
                className="mt-auto w-full py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <span>Become a Patron ($5)</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* NEPAL CARD */}
          <div className="group bg-gradient-to-b from-zinc-800 to-zinc-900 p-[1px] rounded-2xl hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-zinc-900 h-full rounded-2xl p-6 flex flex-col items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl text-white tracking-widest">
                NEPAL
              </div>
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:bg-green-900/30 group-hover:text-green-400 transition-colors">
                🇳🇵
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Local Support</h3>
              <p className="text-xs text-zinc-500 mb-6">Direct Transfer (No Fees)</p>
              
              <div className="w-full space-y-3 bg-black/50 p-4 rounded-lg border border-zinc-800/50">
                <div>
                  <p className="text-[10px] uppercase text-green-500 font-bold">eSewa / Khalti</p>
                  <div className="flex justify-between text-sm font-mono text-zinc-300">
                    <span>9840185500</span>
                  </div>
                </div>
                <div className="w-full h-px bg-zinc-800"></div>
                <div>
                  <p className="text-[10px] uppercase text-red-500 font-bold">NIC Asia Bank</p>
                  <p className="text-[10px] text-zinc-500">Angel Mainali • Kadaghari</p>
                  <div className="flex justify-between text-sm font-mono text-zinc-300">
                    <span>2825750952307001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* THANK YOU NOTE */}
        <p className="mt-12 text-zinc-600 text-sm">
          Built with ❤️ (and ☕) in Kathmandu.
        </p>

      </main>
    </div>
  );
}
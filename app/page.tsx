import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
      
      <div className="space-y-6 animate-in fade-in zoom-in duration-1000">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-2xl">
          ZILA
        </h1>
        <p className="text-xl text-gray-400 tracking-[0.5em] uppercase font-light">
          Something is coming.
        </p>

        <div className="flex gap-4 justify-center mt-12">
          <Link 
            href="/donate" 
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all"
          >
            Support the Build
          </Link>
          <a 
            href="https://chromewebstore.google.com/detail/gioidkdmnmfgbehdcnmmccidhgpchhgk" 
            target="_blank"
            className="px-8 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-all"
          >
            Get WALLS Extension
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 text-gray-600 text-xs">
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
      </div>

    </div>
  );
}
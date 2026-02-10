import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      
      {/* BRANDING */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          VERIFY
        </h1>
        <p className="text-gray-400 uppercase tracking-[0.3em] text-xs">
          The Trust Layer of Reality
        </p>
      </div>

      {/* MAIN ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
        
        {/* OPTION 1: REQUEST */}
        <Link href="/request" className="group relative block p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 transition-all duration-300">
          <div className="absolute top-4 right-4 text-2xl group-hover:scale-110 transition-transform">📍</div>
          <h2 className="text-2xl font-bold mb-2 text-white">Request</h2>
          <p className="text-sm text-gray-500">
            Need eyes somewhere? Drop a pin and offer a bounty.
          </p>
        </Link>

        {/* OPTION 2: SCOUT */}
        <Link href="/scout" className="group relative block p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-green-500 transition-all duration-300">
          <div className="absolute top-4 right-4 text-2xl group-hover:scale-110 transition-transform">📸</div>
          <h2 className="text-2xl font-bold mb-2 text-white">Scout</h2>
          <p className="text-sm text-gray-500">
            Earn money by verifying locations near you.
          </p>
        </Link>

      </div>

      {/* FOOTER */}
      <div className="mt-16 text-center opacity-30 text-xs">
        <p>Built on Zila Infrastructure</p>
        <p>Kathmandu • Global</p>
      </div>

    </div>
  );
}
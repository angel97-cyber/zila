import Link from 'next/link';

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center font-sans">
      
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
            FUEL THE SYSTEM
          </h1>
          <p className="text-gray-400 text-lg">
            WALLS is free, but servers cost money. 
            <br/>Your support keeps the lights on and the code shipping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
          
          {/* OPTION 1: INTERNATIONAL (Patreon) */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-white transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl-xl text-white">
              GLOBAL
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🌍</span>
              <div>
                <h3 className="font-bold text-xl">International</h3>
                <p className="text-xs text-gray-500">PayPal / Cards via Patreon</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Join the inner circle. Get early access to updates and keep the servers alive.
            </p>

            {/* UPDATED LINK HERE */}
            {/* UPDATED LINK */}
            <a 
              href="https://www.patreon.com/angelmainali" 
              target="_blank"
              className="block w-full text-center py-3 bg-white text-black font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Become a Patron ($5)
            </a>

          {/* OPTION 2: NEPAL (Direct) */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-green-500 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-600 text-xs font-bold px-3 py-1 rounded-bl-xl text-white">
              NEPAL
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🇳🇵</span>
              <div>
                <h3 className="font-bold text-xl">Local Support</h3>
                <p className="text-xs text-gray-500">eSewa / Khalti / Bank</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm font-mono bg-black p-4 rounded-lg border border-zinc-800">
              <div>
                <p className="text-green-400 font-bold text-xs uppercase mb-1">eSewa / Khalti</p>
                <div className="flex justify-between items-center">
                  <span>9840185500</span>
                  <span className="opacity-50">Angel Mainali</span>
                </div>
              </div>

              <div className="w-full h-px bg-zinc-800 my-2"></div>

              <div>
                <p className="text-red-400 font-bold text-xs uppercase mb-1">NIC Asia Bank</p>
                <p className="text-xs text-gray-500 mb-1">Branch: Kadaghari</p>
                <div className="flex justify-between items-center">
                  <span>2825750952307001</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <Link href="/" className="inline-block text-sm text-gray-600 hover:text-white mt-12 transition-colors">
          ← Return to HQ
        </Link>
      </div>
      </div>
    </div>
  );
}
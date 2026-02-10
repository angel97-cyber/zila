import Link from 'next/link';

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          Fuel the System
        </h1>
        <p className="text-gray-400">
          WALLS and ZILA are free, but servers cost money.
          <br/>Your support keeps the lights on.
        </p>

        {/* NEPAL PAYMENT METHOD */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🇳🇵</span>
            <h3 className="font-bold text-lg">Support from Nepal</h3>
          </div>
          
          <div className="space-y-4 text-sm text-gray-300 font-mono">
            {/* OPTION 1: ESEWA */}
            <div className="p-3 bg-black rounded border border-zinc-700">
              <p className="text-green-400 font-bold mb-1">eSewa / Khalti</p>
              <p>ID: 9840185500</p>
              <p>Name: Angel Mainali</p>
            </div>

            {/* OPTION 2: BANK */}
            <div className="p-3 bg-black rounded border border-zinc-700">
              <p className="text-red-400 font-bold mb-1">NIC Asia Bank</p>
              <p>Acct: 2825750952307001</p>
              <p>Name: Angel Mainali</p>
              <p>Branch: Kadaghari</p>
            </div>
          </div>
        </div>

        {/* INTERNATIONAL (Placeholder) */}
        <div className="opacity-50 border border-dashed border-zinc-700 rounded-2xl p-6">
          <h3 className="font-bold text-gray-500">International (Coming Soon)</h3>
          <p className="text-xs text-gray-600 mt-2">PayPal / Crypto integration in progress.</p>
        </div>

        <Link href="/" className="block text-sm text-gray-500 hover:text-white mt-8">
          ← Return to HQ
        </Link>
      </div>
    </div>
  );
}
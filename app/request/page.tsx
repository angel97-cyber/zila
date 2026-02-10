'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// DYNAMIC IMPORT FIX:
// 1. We changed the path to '../components' (since we moved the folder).
// 2. We explicitly tell TypeScript that this component accepts an 'onSelect' prop.
const MapPicker = dynamic<{ onSelect: (lat: number, lng: number) => void }>(
  () => import('../components/map/MapPicker'), 
  { 
    ssr: false,
    loading: () => <div className="h-64 w-full bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-700">Loading Satellite Link...</div>
  }
);

export default function RequestPage() {
  const router = useRouter();
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [desc, setDesc] = useState('');
  const [bounty, setBounty] = useState('50');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!coords || !desc) return alert("Please select a location and describe the task.");
    
    setLoading(true);

    const { error } = await supabase
      .from('requests')
      .insert([
        { 
          lat: coords.lat, 
          lng: coords.lng, 
          description: desc, 
          bounty: parseInt(bounty), 
          status: 'OPEN' 
        }
      ]);

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    } else {
      alert("Request Broadcasted to Global Network!");
      router.push('/'); // Go back home
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">NEW REQUEST</h1>
        <div className="text-xs text-zinc-500 uppercase tracking-widest">Step 1/2</div>
      </div>

      {/* MAP AREA */}
      <div className="flex-1 min-h-[300px] relative">
        {/* TYPE FIX: We explicitly say lat and lng are numbers */}
        <MapPicker onSelect={(lat: number, lng: number) => setCoords({ lat, lng })} />
        
        {!coords && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full text-xs border border-blue-500/50 animate-bounce z-[1000]">
            Tap map to drop pin
          </div>
        )}
      </div>

      {/* FORM AREA */}
      <div className="bg-zinc-900 p-6 rounded-t-3xl border-t border-zinc-800 shadow-2xl -mx-4 -mb-4">
        <div className="space-y-4 max-w-lg mx-auto">
          
          <div>
            <label className="text-xs text-zinc-500 uppercase block mb-2">Target Coordinates</label>
            <div className="font-mono text-blue-400 text-sm bg-black p-3 rounded border border-zinc-800">
              {coords ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : "WAITING FOR PIN..."}
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase block mb-2">Mission Brief</label>
            <input 
              type="text" 
              placeholder="e.g. Is the momo shop open?"
              className="w-full bg-black border border-zinc-700 p-3 rounded text-white focus:border-blue-500 outline-none"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase block mb-2">Bounty (NPR/Credits)</label>
            <div className="flex gap-2">
              {['50', '100', '500'].map((amt) => (
                <button 
                  key={amt}
                  onClick={() => setBounty(amt)}
                  className={`flex-1 py-2 rounded border ${bounty === amt ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black border-zinc-800 text-zinc-500'}`}
                >
                  {amt}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading || !coords}
            className="w-full py-4 bg-white text-black font-bold rounded-xl mt-4 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "BROADCASTING..." : "DEPLOY SATELLITE REQUEST"}
          </button>

        </div>
      </div>

    </div>
  );
}
'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const ZONE_RADIUS_METERS = 1000; // Only show messages within 1km

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  id?: number;
  user_id: string;
  content: string;
  latitude: number;
  longitude: number;
  created_at?: string;
  distance?: number; // We will calculate this locally
}

interface RealtimePayload {
  new: Message;
  [key: string]: unknown;
}

const ADJECTIVES = ['Neon', 'Cyber', 'Ghost', 'Electric', 'Silent', 'Rapid', 'Local'];
const ANIMALS = ['Yak', 'Tiger', 'Rhino', 'Eagle', 'Cobra', 'Hawk', 'Wolf'];

// --- THE CIVIL ENGINEERING MATH (Haversine Formula) ---
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return Math.round(R * c); // Distance in meters
}

export default function ZonePage() {
  const [identity, setIdentity] = useState('');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeZone = async () => {
      // 1. Generate Identity
      const randomName = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${ANIMALS[Math.floor(Math.random() * ANIMALS.length)]}`;
      setIdentity(randomName);

      // 2. Get GPS
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          setCoords({ lat: userLat, lng: userLng });
          
          console.log(`📍 User Location: ${userLat}, ${userLng}`);

          // 3. FETCH DATA & FILTER BY DISTANCE
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });
          
          // FIX: We now check the error variable so the linter is happy
          if (error) {
            console.error('Error fetching initial messages:', error);
          }

          if (data) {
            // FILTER: Only keep messages within the ZONE_RADIUS_METERS
            const nearbyMessages = data.map(msg => ({
              ...msg,
              distance: getDistanceMeters(userLat, userLng, msg.latitude, msg.longitude)
            })).filter(msg => msg.distance !== undefined && msg.distance <= ZONE_RADIUS_METERS);

            setMessages(nearbyMessages);
          }
        });
      }
    };

    initializeZone();
  }, []);

  // 4. Realtime Subscription (Only add if nearby)
  useEffect(() => {
    if (!coords) return; // Wait until we have user coordinates

    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload: RealtimePayload) => {
          const newMsg = payload.new;
          // Calculate distance for the new message
          const dist = getDistanceMeters(coords.lat, coords.lng, newMsg.latitude, newMsg.longitude);
          
          console.log(`⚡ New Signal detected. Distance: ${dist}m`);

          if (dist <= ZONE_RADIUS_METERS) {
            setMessages((prev) => [...prev, { ...newMsg, distance: dist }]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [coords]); 

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !coords) return;

    const { error } = await supabase
      .from('messages')
      .insert([
        { 
          user_id: identity, 
          content: inputText, 
          latitude: coords.lat, 
          longitude: coords.lng 
        }
      ]);

    if (error) console.error("❌ Send Error:", error.message);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* TOP BAR */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur flex justify-between items-center fixed top-0 w-full z-10">
        <div>
          <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            ZILA
          </h1>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            {coords ? `📍 ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Triangulating...'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase">You are</div>
          <div className="font-bold text-green-400">{identity}</div>
        </div>
      </div>

      {/* MIDDLE: Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pt-20 pb-24 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.user_id === identity;
          return (
            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="text-xs text-gray-500 mb-1 px-1 flex gap-2">
                <span>{msg.user_id}</span>
                {/* Show Distance for Civil Engineering Credibility */}
                <span className="text-green-600 font-mono">
                  {msg.distance !== undefined ? `${msg.distance}m` : ''}
                </span>
              </div>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4">
            <div className="text-4xl">📡</div>
            <p>No signals within 1000m.</p>
            <p className="text-sm">Be the first to broadcast in this zone.</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* BOTTOM: Input Area */}
      <div className="fixed bottom-0 w-full p-4 bg-black border-t border-gray-800">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Broadcast to 1000m radius...`}
            className="flex-1 bg-gray-900 border border-gray-700 text-white pl-12 pr-4 py-3 rounded-full focus:outline-none focus:border-green-500 transition"
          />
          <button type="submit" className="bg-blue-600 text-white p-3 rounded-full font-bold hover:bg-blue-500 transition">➤</button>
        </form>
      </div>
    </div>
  );
}
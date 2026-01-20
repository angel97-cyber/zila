'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Html5QrcodeScanner } from 'html5-qrcode';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProductMessage {
  id?: number;
  user_id: string;
  barcode: string;
  content: string;
  created_at?: string;
}

interface RealtimePayload {
  new: ProductMessage;
  [key: string]: unknown;
}

const ADJECTIVES = ['Neon', 'Cyber', 'Ghost', 'Electric', 'Silent', 'Rapid', 'Local'];
const ANIMALS = ['Yak', 'Tiger', 'Rhino', 'Eagle', 'Cobra', 'Hawk', 'Wolf'];

export default function LabelPage() {
  // FIX: We generate the name HERE instead of inside useEffect. 
  // This satisfies the Linter and is actually faster.
  const [identity] = useState(() => {
    return `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${ANIMALS[Math.floor(Math.random() * ANIMALS.length)]}`;
  });

  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [messages, setMessages] = useState<ProductMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // 1. Setup Scanner
  useEffect(() => {
    if (scannedCode) return; 

    // Small delay to ensure HTML element exists
    const timer = setTimeout(() => {
      // Check if element exists before creating scanner to prevent crashes
      if (!document.getElementById("reader")) return;

      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          console.log("📸 Scanned:", decodedText);
          setScannedCode(decodedText);
          scanner.clear().catch(err => console.debug("Clear error", err)); 
        },
        (err) => {
          if (err) console.debug("Scanning...");
        }
      );

      return () => {
        scanner.clear().catch(error => console.debug("Failed to clear scanner", error));
      };
    }, 500);

    return () => clearTimeout(timer);
  }, [scannedCode]);

  // 2. Fetch Messages & Realtime
  useEffect(() => {
    if (!scannedCode) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('product_chats')
        .select('*')
        .eq('barcode', scannedCode)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel(`product:${scannedCode}`)
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'product_chats', filter: `barcode=eq.${scannedCode}` }, 
        (payload: RealtimePayload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [scannedCode]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !scannedCode) return;

    const { error } = await supabase
      .from('product_chats')
      .insert([
        { 
          user_id: identity, 
          barcode: scannedCode,
          content: inputText, 
        }
      ]);

    if (error) console.error("Error sending:", error);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* TOP BAR */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur flex justify-between items-center fixed top-0 w-full z-10">
        <div>
          <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            LABEL
          </h1>
          <div className="text-xs text-gray-400">
            {scannedCode ? `Product: ${scannedCode}` : 'Scanning...'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase">You are</div>
          <div className="font-bold text-green-400">{identity}</div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 pt-20 pb-24 overflow-y-auto">
        
        {/* VIEW 1: THE SCANNER */}
        {!scannedCode && (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-full max-w-sm bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
              <div id="reader" className="w-full"></div>
            </div>
            <p className="mt-6 text-gray-400 text-center animate-pulse">
              Point camera at a barcode
            </p>
          </div>
        )}

        {/* VIEW 2: THE CHAT */}
        {scannedCode && (
          <div className="p-4 space-y-4 min-h-full">
            {messages.length === 0 && (
              <div className="text-center text-gray-600 mt-10">
                First time this product has been scanned.<br/>Leave a review!
              </div>
            )}
            {messages.map((msg, index) => {
              const isMe = msg.user_id === identity;
              return (
                <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="text-xs text-gray-500 mb-1 px-1">{msg.user_id}</div>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* BOTTOM INPUT */}
      {scannedCode && (
        <div className="fixed bottom-0 w-full p-4 bg-black border-t border-gray-800">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Add a comment on this product..."
              className="flex-1 bg-gray-900 border border-gray-700 text-white pl-12 pr-4 py-3 rounded-full focus:outline-none focus:border-purple-500 transition"
            />
            <button type="submit" className="bg-purple-600 text-white p-3 rounded-full font-bold hover:bg-purple-500 transition">➤</button>
          </form>
        </div>
      )}
    </div>
  );
}
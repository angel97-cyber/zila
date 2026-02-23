"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building, MapPin, Layers, Ruler, CheckCircle2, Lock, Download, Clock, ClipboardList, HardHat } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// --- SUPABASE CLIENT ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- YOUR ENGINEERING BRAIN (RESEARCHED FOR NEPAL 2025) ---
const RATES: Record<string, Record<string, Record<string, number>>> = {
  nepal: {
    kathmandu: { basic: 3200, standard: 4500, premium: 6500, luxury: 8500 },
    lalitpur:  { basic: 3100, standard: 4400, premium: 6400, luxury: 8300 },
    bhaktapur: { basic: 3000, standard: 4300, premium: 6300, luxury: 8200 },
    pokhara:   { basic: 3000, standard: 4200, premium: 6200, luxury: 8000 },
    chitwan:   { basic: 2800, standard: 4000, premium: 5800, luxury: 7500 },
    butwal:    { basic: 2700, standard: 3900, premium: 5600, luxury: 7300 },
    biratnagar:{ basic: 2700, standard: 3900, premium: 5600, luxury: 7300 },
  },
};

const BREAKDOWN = {
  "Foundation & Substructure": 0.18,
  "Superstructure (RCC & Walls)": 0.22,
  "Doors & Windows": 0.10,
  "Plumbing & Sanitary": 0.10,
  "Electrical Works": 0.08,
  "Flooring & Painting": 0.12,
  "Finishing & Woodwork": 0.15,
  "Contingency / Misc": 0.05,
};

const MATERIALS_PER_SQFT = {
  "Cement (OPC & PPC bags)": 0.43,
  "Sand (cu.ft)": 1.85,
  "Aggregate / Gitti (cu.ft)": 1.35,
  "Steel / TMT Rebar (kg)": 4.50,
  "Bricks (pcs)": 8.50,
  "Paint (liters)": 0.18,
  "Tiles / Granite (sq.ft)": 1.30,
};

// --- NEW VALUE ADDS FOR THE PREMIUM PDF ---
const LABOR_MATERIAL_RATIO = {
  "Material Cost (Cement, Steel, Bricks, etc.)": 0.65,
  "Labor & Equipment Cost": 0.28,
  "Contractor Profit & Overhead": 0.07,
};

const TIMELINE = [
  { phase: "Foundation & Plinth", duration: "4 to 6 Weeks" },
  { phase: "Superstructure (RCC Frames & Roof)", duration: "8 to 10 Weeks" },
  { phase: "Brickwork & Plastering", duration: "6 to 8 Weeks" },
  { phase: "Plumbing & Electrical Rough-ins", duration: "3 to 4 Weeks" },
  { phase: "Flooring, Painting & Finishing", duration: "6 to 8 Weeks" },
];

export default function Home() {
  // --- STATE ---
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("nepal");
  const [district, setDistrict] = useState("kathmandu");
  const [floors, setFloors] = useState(2);
  const [area, setArea] = useState(1000);
  const [quality, setQuality] = useState("standard");
  
  const [isPremium, setIsPremium] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [phone, setPhone] = useState("");
  
  // NEW: Security States
  const [isVerifying, setIsVerifying] = useState(false);
  const [estimateId, setEstimateId] = useState<string | null>(null);

  // --- CALCULATION LOGIC ---
  const totalArea = floors * area;
  const ratePerSqft = RATES[country][district][quality];
  const totalCost = totalArea * ratePerSqft;

  // --- SUBMIT PAYMENT LOGIC ---
  const handleUnlock = async () => {
    if (!paymentRef || !phone) return alert("Please enter eSewa Ref and Phone Number.");
    
    // 1. Show verifying screen
    setIsVerifying(true);
    setShowPayment(false);

    // 2. Insert into DB with premium = FALSE
    try {
      const { data } = await supabase.from('estimates').insert([{
        country: country,
        district: district,
        floors: floors,
        area_per_floor: area,
        quality: quality,
        total_cost: totalCost,
        payment_ref: paymentRef,
        phone_number: phone,
        premium: false // Default to false so they can't cheat
      }]).select(); // Select returns the inserted row

      if (data && data.length > 0) {
        setEstimateId(data[0].id); // Save the ID so we can poll it
      }
    } catch (error) {
      console.error("DB Error:", error);
    }
  };

  // --- THE LIVE POLLING SYSTEM ---
  // This constantly checks Supabase to see if YOU checked the box.
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isVerifying && estimateId) {
      interval = setInterval(async () => {
        const { data } = await supabase
          .from('estimates')
          .select('premium')
          .eq('id', estimateId)
          .single();
          
        if (data && data.premium === true) {
          setIsPremium(true);
          setIsVerifying(false); // Stop verifying, show the PDF
          clearInterval(interval);
        }
      }, 3000); // Checks every 3 seconds
    }
    
    return () => clearInterval(interval);
  }, [isVerifying, estimateId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
      
      {/* 
        This wrapper has 'print:hidden'. 
        When they hit download PDF, everything inside this block vanishes, 
        leaving ONLY the beautiful report at the bottom.
      */}
      <div className="print:hidden">
        
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Building className="text-blue-900 h-6 w-6" />
            <span className="font-bold text-xl tracking-tight text-blue-900">ZILA</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">EN / ने</span>
            <Link href="/donate" className="text-slate-500 hover:text-blue-900 transition-colors">Support</Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto p-6 mt-8">
          
          {/* STEP 1: LOCATION */}
          {step === 1 && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Build cost, calculated instantly.</h1>
              <p className="text-slate-500 mb-8">३० सेकेन्डमा घर बनाउन कति खर्च लाग्छ थाहा पाउनुहोस्।</p>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><MapPin className="h-4 w-4"/> Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none">
                    <option value="nepal">Nepal 🇳🇵</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Building className="h-4 w-4"/> District / City</label>
                  <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none capitalize">
                    {Object.keys(RATES.nepal).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <button onClick={() => setStep(2)} className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all mt-4">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-500">
              <button onClick={() => setStep(1)} className="text-sm text-slate-400 mb-6 hover:text-slate-600">← Back</button>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Building Details</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4"><Layers className="h-4 w-4"/> Number of Floors</label>
                  <div className="flex gap-2">
                    {[1, 1.5, 2, 2.5, 3].map(f => (
                      <button key={f} onClick={() => setFloors(f)} className={`flex-1 py-3 rounded-lg font-semibold border transition-all ${floors === f ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-900'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Ruler className="h-4 w-4"/> Built-up Area Per Floor (sq ft)</label>
                  <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-medium outline-none focus:ring-2 focus:ring-blue-900" />
                  <p className="text-sm text-emerald-600 font-medium mt-2">Total Area: {(floors * area).toLocaleString()} sq ft</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4"><CheckCircle2 className="h-4 w-4"/> Finish Quality</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(RATES.nepal.kathmandu).map(q => (
                      <button key={q} onClick={() => setQuality(q)} className={`p-4 rounded-xl border text-left transition-all ${quality === q ? 'border-blue-900 bg-blue-50 ring-1 ring-blue-900' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
                        <div className="font-bold capitalize text-slate-900">{q}</div>
                        <div className="text-sm text-slate-500">Rs. {RATES.nepal.kathmandu[q]}/sqft</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep(3)} className="w-full bg-emerald-600 text-white font-bold text-lg py-5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                  Calculate Cost 🔍
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS (FREE & PAYMENT UI) */}
          {step === 3 && !isPremium && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <button onClick={() => setStep(2)} className="text-sm text-slate-400 hover:text-slate-600">← Edit Details</button>
              
              {/* THE BIG NUMBER */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Building className="h-32 w-32"/></div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Estimated Total Cost</h3>
                <div className="text-5xl font-black text-emerald-700 mb-2">
                  रु. {totalCost.toLocaleString('en-IN')}
                </div>
                <p className="text-slate-500 font-medium pb-6 border-b border-slate-100">
                  📍 <span className="capitalize">{district}</span> • {floors} Floors • {(floors * area).toLocaleString()} sqft • <span className="capitalize">{quality}</span>
                </p>
                
                {/* COST BREAKDOWN (FREE) */}
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Cost Breakdown</h4>
                  {Object.entries(BREAKDOWN).map(([category, pct]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{category}</span>
                        <span className="font-semibold text-slate-900">रु. {Math.round(totalCost * pct).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-900 h-2 rounded-full opacity-80" style={{ width: `${pct * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECURITY / PAYMENT SECTION */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                
                {/* STATE 1: SELLING THE VALUE */}
                {!showPayment && !isVerifying && (
                  <>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Lock className="h-5 w-5 text-emerald-400"/> Get the Official BOQ Report</h3>
                    <ul className="space-y-3 mb-8 text-slate-300 text-sm">
                      <li className="flex items-center gap-2">✓ Exact Material Quantities (Cement, Steel, Bricks)</li>
                      <li className="flex items-center gap-2">✓ Labor vs. Material Cost Distribution</li>
                      <li className="flex items-center gap-2">✓ Construction Timeline & Municipality Checklist</li>
                      <li className="flex items-center gap-2">✓ Downloadable PDF for Banks & Contractors</li>
                    </ul>
                    <p className="text-xs text-slate-400 mb-4 border-t border-slate-800 pt-4">An engineer charges Rs. 10,000+ for this. You pay Rs. 199.</p>
                    <button onClick={() => setShowPayment(true)} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-400 transition-all text-lg shadow-lg shadow-emerald-500/30">
                      Unlock Official Report — रु. 199
                    </button>
                  </>
                )}

                {/* STATE 2: THE ESEWA QR */}
                {showPayment && !isVerifying && (
                  <div className="animate-in fade-in slide-in-from-bottom-4">
                     <h3 className="text-lg font-bold mb-4">Pay via eSewa</h3>
                     <div className="bg-white text-slate-900 p-4 rounded-xl mb-6 text-center">
                        <p className="font-bold text-lg">eSewa ID: 9840185500</p>
                        <p className="text-sm text-slate-500 mb-2">Amount: रु. 199</p>
                        <Image src="/esewa.png" alt="eSewa QR" width={192} height={192} className="object-contain mx-auto rounded-lg border-2 border-slate-100" />
                     </div>
                     <div className="space-y-3 mb-6">
                        <input type="text" placeholder="eSewa Transaction ID (e.g. 0B2V...)" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-emerald-500 text-white" />
                        <input type="text" placeholder="Your Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-emerald-500 text-white" />
                     </div>
                     <button onClick={handleUnlock} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-400 transition-all">
                      I Have Paid — Unlock Now
                    </button>
                    <button onClick={() => setShowPayment(false)} className="w-full text-center text-sm text-slate-400 mt-4 hover:text-white">Cancel</button>
                  </div>
                )}

                {/* STATE 3: VERIFYING (THE WIZARD OF OZ) */}
                {isVerifying && (
                  <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-xl font-bold mb-2">Verifying Payment...</h3>
                    <p className="text-sm text-slate-400 mb-4">We have received your request. Our engineer is manually verifying the transaction.</p>
                    <div className="bg-slate-800 rounded-lg p-4 text-xs text-slate-300">
                      Please do not close this window. It will automatically unlock within 1-2 minutes once approved.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
        
        {/* FOOTER */}
        <div className="text-center py-12 text-sm text-slate-400">
          <p>Built by Er. Angel Mainali, Civil Engineer.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
            <span>•</span>
            <Link href="/donate" className="hover:text-slate-600">Donate</Link>
          </div>
        </div>
      </div>

      {/* =========================================================
          THE PREMIUM PDF REPORT (Visible only when unlocked)
          ========================================================= */}
      {isPremium && (
        <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen">
          
          {/* Action Bar (Hidden in Print) */}
          <div className="print:hidden flex justify-between items-center mb-8 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div>
              <h2 className="text-emerald-800 font-bold text-lg">✅ Payment Verified!</h2>
              <p className="text-emerald-600 text-sm">Your official report is ready. Download it below.</p>
            </div>
            <button onClick={() => window.print()} className="bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
              <Download className="h-5 w-5"/> Download PDF
            </button>
          </div>

          {/* THE ACTUAL PRINTABLE DOCUMENT */}
          <div className="space-y-8 text-slate-900">
            
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">ZILA</h1>
                <p className="text-lg font-bold text-slate-500 mt-1">Official Construction Estimate (BOQ)</p>
              </div>
              <div className="text-right text-sm text-slate-600">
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p>Est. ID: #{estimateId?.split('-')[0].toUpperCase()}</p>
                <p>Prepared by: Er. Angel Mainali</p>
              </div>
            </div>

            {/* Project Summary */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="h-5 w-5"/> Project Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div><p className="text-sm text-slate-500">Location</p><p className="font-bold capitalize">{district}, Nepal</p></div>
                <div><p className="text-sm text-slate-500">Total Area</p><p className="font-bold">{(floors * area).toLocaleString()} sq.ft</p></div>
                <div><p className="text-sm text-slate-500">Structure</p><p className="font-bold">{floors} Floors (RCC)</p></div>
                <div><p className="text-sm text-slate-500">Finish Quality</p><p className="font-bold capitalize">{quality}</p></div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-600">Estimated Total Cost:</span>
                <span className="text-3xl font-black text-slate-900">रु. {totalCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Split Grid: Labor vs Material List */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Left Column: Material Quantities */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2"><HardHat className="h-5 w-5"/> Required Materials</h3>
                <div className="space-y-3">
                  {Object.entries(MATERIALS_PER_SQFT).map(([material, multiplier]) => (
                    <div key={material} className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
                      <span className="text-slate-700">{material}</span>
                      <span className="font-bold text-slate-900">{Math.round(totalArea * multiplier).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Labor Split & Timeline */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2"><Building className="h-5 w-5"/> Cost Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(LABOR_MATERIAL_RATIO).map(([cat, pct]) => (
                      <div key={cat} className="flex justify-between items-center">
                        <span className="text-slate-700 text-sm">{cat} ({(pct*100)}%)</span>
                        <span className="font-bold text-slate-900">रु. {Math.round(totalCost * pct).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2"><Clock className="h-5 w-5"/> Est. Timeline</h3>
                  <div className="space-y-2">
                    {TIMELINE.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">• {item.phase}</span>
                        <span className="font-medium">{item.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Municipality Notes */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2"><ClipboardList className="h-5 w-5"/> Municipality Requirements (नक्सा पास)</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Ensure Land Ownership Document (Lalpurja) and Land Tax Receipt (Tiro) are updated.</li>
                <li>• Hire a registered firm for Architectural and Structural drawings conforming to NBC 105:2020.</li>
                <li>• Soil testing is highly recommended for structures above 2.5 stories.</li>
                <li>• Above estimates do not include furniture, compound walls, or municipality approval fees.</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-slate-200 text-xs text-slate-400">
              <p>Disclaimer: This is a preliminary Bill of Quantities (BOQ) generated based on current market rates in Nepal.</p>
              <p>Actual costs may vary based on exact site conditions, contractor negotiations, and material brand selections.</p>
              <p className="mt-2 font-bold text-slate-500">Generated securely via zila.app</p>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}
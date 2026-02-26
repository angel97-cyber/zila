"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building, MapPin, Layers, Ruler, CheckCircle2, Lock, Download, Clock, ClipboardList, HardHat, ShieldAlert, ArrowRight, Home as HomeIcon } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// --- SUPABASE CLIENT ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- ENGINEERING BRAIN (NEPAL 2082/2083 - NBC 105:2025 COMPLIANT) ---
const RATES: Record<string, Record<string, Record<string, number>>> = {
  nepal: {
    // Valley (High Cost)
    kathmandu: { basic: 3500, standard: 4800, premium: 6800, luxury: 9000 },
    lalitpur: { basic: 3400, standard: 4700, premium: 6700, luxury: 8800 },
    bhaktapur: { basic: 3300, standard: 4600, premium: 6600, luxury: 8700 },
    kavre: { basic: 3200, standard: 4500, premium: 6400, luxury: 8500 },
    // Gandaki / Hills
    pokhara: { basic: 3400, standard: 4600, premium: 6500, luxury: 8500 },
    baglung: { basic: 3300, standard: 4500, premium: 6300, luxury: 8300 },
    gorkha: { basic: 3200, standard: 4400, premium: 6200, luxury: 8200 },
    // Terai / Industrial Hubs
    chitwan: { basic: 3000, standard: 4200, premium: 5800, luxury: 7800 },
    butwal: { basic: 2900, standard: 4100, premium: 5700, luxury: 7600 },
    biratnagar: { basic: 2900, standard: 4100, premium: 5700, luxury: 7600 },
    jhapa: { basic: 2850, standard: 4000, premium: 5600, luxury: 7500 },
    morang: { basic: 2850, standard: 4000, premium: 5600, luxury: 7500 },
    sunsari: { basic: 2850, standard: 4000, premium: 5600, luxury: 7500 },
    parsa: { basic: 2800, standard: 3900, premium: 5500, luxury: 7400 },
    dhanusha: { basic: 2800, standard: 3900, premium: 5500, luxury: 7400 },
    // Mid/Far-West
    dang: { basic: 2950, standard: 4150, premium: 5800, luxury: 7700 },
    banke: { basic: 2900, standard: 4100, premium: 5700, luxury: 7600 },
    surkhet: { basic: 3100, standard: 4300, premium: 6000, luxury: 8000 },
    kailali: { basic: 3000, standard: 4200, premium: 5900, luxury: 7900 },
    kanchanpur: { basic: 3000, standard: 4200, premium: 5900, luxury: 7900 },
  },
};

const QUALITY_INFO: Record<string, { title: string; desc: string; emoji: string }> = {
  basic: { title: "Basic (सामान्य)", desc: "Normal bricks, budget tiles, standard distemper paint. Standard wiring.", emoji: "🧱" },
  standard: { title: "Standard (मध्यम)", desc: "Good quality bricks, standard tiles, emulsion paint, modular kitchen prep.", emoji: "🏠" },
  premium: { title: "Premium (उत्तम)", desc: "Premium paint, false ceiling, granite counters, modern modular kitchen.", emoji: "✨" },
  luxury: { title: "Luxury (विलासी)", desc: "Italian marble, central AC prep, smart home features, premium wood.", emoji: "💎" },
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

const LABOR_MATERIAL_RATIO = {
  "Material Cost (Cement, Steel, etc.)": 0.65,
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

  const [floors, setFloors] = useState<number | string>(2);
  const [area, setArea] = useState<number | string>(1000);
  const [areaUnit, setAreaUnit] = useState("sq.ft");
  const [quality, setQuality] = useState("standard");

  // Checkout States
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Security States
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [estimateId, setEstimateId] = useState<string | null>(null);
  const [verificationTime, setVerificationTime] = useState(0);

  // --- CALCULATION LOGIC ---
  // --- CALCULATION LOGIC ---
  const safeFloors = Number(floors) || 0;
  const safeArea = Number(area) || 0;

  // Convert everything to sq.ft under the hood for our engineering brain
  let areaInSqFt = safeArea;
  if (areaUnit === "sq.m") areaInSqFt = safeArea * 10.7639;
  if (areaUnit === "aana") areaInSqFt = safeArea * 342.25; // Standard Aana
  if (areaUnit === "dhur") areaInSqFt = safeArea * 169.31; // Standard Terai Dhur

  const totalArea = Math.round(safeFloors * areaInSqFt);
  const ratePerSqft = RATES[country][district] ? RATES[country][district][quality] : RATES[country]['kathmandu'][quality];
  const totalCost = totalArea * ratePerSqft;

  // --- LOCAL STORAGE (SAVE STATE) ---
  useEffect(() => {
    const checkSavedReport = async () => {
      const savedId = localStorage.getItem('zila_estimate_id');
      if (!savedId) return;

      const { data } = await supabase.from('estimates').select('*').eq('id', savedId).single();
      if (data) {
        setEstimateId(data.id);
        setDistrict(data.district);
        setFloors(data.floors);
        setArea(data.area_per_floor);
        setQuality(data.quality);

        if (data.premium) {
          setIsPremium(true);
          setStep(3);
        } else if (data.payment_ref) {
          setStep(3);
          setIsVerifying(true);
        }
      }
    };
    checkSavedReport();
  }, []);

  // --- CHECKOUT FLOW ---
  const handleContactSubmit = async () => {
    if (!customerName || !phone) return alert("Please enter your name and phone number.");

    setIsSubmittingContact(true);

    try {
      const { data, error } = await supabase.from('estimates').insert([{
        country, district, floors: safeFloors, area_per_floor: safeArea, quality, total_cost: totalCost,
        phone_number: phone, name: customerName, premium: false
      }]).select();

      if (error) {
        alert("System Error: " + error.message);
        setIsSubmittingContact(false);
        return;
      }

      if (data && data.length > 0) {
        setEstimateId(data[0].id);
        localStorage.setItem('zila_estimate_id', data[0].id);
        setCheckoutStep(2);

        // Let React render the new step 2 first, then scroll to it
        setTimeout(() => {
          document.getElementById('checkout-box')?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (error) {
      console.error("DB Error:", error);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentRef) return alert("Please enter the eSewa Transaction ID.");
    if (!estimateId) return;

    setIsVerifying(true);
    setCheckoutStep(0);

    await supabase.from('estimates').update({ payment_ref: paymentRef }).eq('id', estimateId);
  };

  // --- LIVE POLLING SYSTEM ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVerifying && estimateId) {
      interval = setInterval(async () => {
        setVerificationTime(prev => prev + 3);

        const { data } = await supabase.from('estimates').select('premium').eq('id', estimateId).single();
        if (data && data.premium === true) {
          setIsPremium(true);
          setIsVerifying(false);
          window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top when unlocked
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isVerifying, estimateId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">

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
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><MapPin className="h-4 w-4" /> Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none">
                    <option value="nepal">Nepal 🇳🇵</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"><Building className="h-4 w-4" /> District / City (जिल्ला)</label>
                  <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none capitalize">
                    {Object.keys(RATES.nepal).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all mt-4">Next Step</button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-500">
              <button onClick={() => setStep(1)} className="text-sm text-slate-400 mb-6 hover:text-slate-600">← Back</button>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Building Details (घरको विवरण)</h2>

              <div className="space-y-8">

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Ruler className="h-4 w-4" /> Area Per Floor <span className="text-slate-400 font-normal">(१ तल्लाको क्षेत्रफल)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number" value={area} onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. 1000"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-medium outline-none focus:ring-2 focus:ring-blue-900"
                      />
                      <select
                        value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-900"
                      >
                        <option value="sq.ft">Sq.ft</option>
                        <option value="sq.m">Sq.m</option>
                        <option value="aana">Aana (आना)</option>
                        <option value="dhur">Dhur (धुर)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Ruler className="h-4 w-4" /> Area Per Floor <span className="text-slate-400 font-normal">(तल्लाको क्षेत्रफल)</span>
                    </label>
                    <input
                      type="number" value={area} onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. 1000"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-medium outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm font-semibold text-center border border-emerald-100">
                  Total Built-up Area: {totalArea.toLocaleString()} sq ft
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                    <CheckCircle2 className="h-4 w-4" /> Finish Quality <span className="text-slate-400 font-normal">(फिनिसिङ कस्तो गर्ने?)</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(QUALITY_INFO).map(q => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${quality === q ? 'border-blue-900 bg-blue-50 ring-1 ring-blue-900 shadow-md' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="text-xl">{QUALITY_INFO[q].emoji}</span>
                            {QUALITY_INFO[q].title}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3 h-10">{QUALITY_INFO[q].desc}</p>
                        <div className="text-sm font-bold text-emerald-600 bg-emerald-100/50 inline-block px-2 py-1 rounded">
                          Rs. {RATES.nepal[district] ? RATES.nepal[district][q] : RATES.nepal['kathmandu'][q]}/sqft
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-full bg-emerald-600 text-white font-bold text-lg py-5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                  Calculate Total Cost 🔍
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS & SECURE CHECKOUT */}
          {step === 3 && !isPremium && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              {!isVerifying && <button onClick={() => setStep(2)} className="text-sm text-slate-400 hover:text-slate-600">← Edit Details</button>}

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><HomeIcon className="h-32 w-32" /></div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Estimated Total Cost</h3>
                <div className="text-5xl font-black text-emerald-700 mb-2">रु. {totalCost.toLocaleString('en-IN')}</div>
                <p className="text-slate-500 font-medium pb-6 border-b border-slate-100">
                  📍 <span className="capitalize">{district}</span> • {safeFloors} Floors • {totalArea.toLocaleString()} sqft • <span className="capitalize">{quality}</span>
                </p>

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

              {/* CHECKOUT SYSTEM */}
              <div id="checkout-box" className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">

                {checkoutStep === 0 && !isVerifying && (
                  <>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4"><Lock className="h-5 w-5 text-emerald-400" /> Get the Official BOQ Report</h3>
                    <ul className="space-y-3 mb-8 text-slate-300 text-sm">
                      <li className="flex items-center gap-2">✓ Exact Material Quantities (Cement, Steel, Bricks)</li>
                      <li className="flex items-center gap-2">✓ Labor vs. Material Cost Distribution</li>
                      <li className="flex items-center gap-2 text-emerald-400 font-bold">✓ NEW: Updated to NBC 105:2025 Seismic Codes</li>
                      <li className="flex items-center gap-2">✓ Downloadable PDF for Banks & Contractors</li>
                    </ul>
                    <button onClick={() => setCheckoutStep(1)} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-400 transition-all text-lg shadow-lg shadow-emerald-500/30">
                      Unlock Official Report — रु. 199
                    </button>
                  </>
                )}

                {checkoutStep === 1 && !isVerifying && (
                  <div className="animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-lg font-bold mb-2">Where should we send this?</h3>
                    <p className="text-sm text-slate-400 mb-6">Enter your details to secure your report before payment.</p>
                    <div className="space-y-4 mb-6">
                      <input type="text" placeholder="Your Full Name (तपाईंको नाम)" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-white" />
                      <input type="tel" placeholder="Phone Number (फोन नम्बर)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-white" />
                    </div>
                    <button
                      onClick={handleContactSubmit}
                      disabled={isSubmittingContact}
                      className={`w-full text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 ${isSubmittingContact ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
                    >
                      {isSubmittingContact ? "Securing Report... Please Wait" : "Proceed to Payment"}
                      {!isSubmittingContact && <ArrowRight className="h-5 w-5" />}
                    </button>
                    <button onClick={() => setCheckoutStep(0)} className="w-full text-center text-sm text-slate-400 mt-4 hover:text-white">Cancel</button>
                  </div>
                )}

                {checkoutStep === 2 && !isVerifying && (
                  <div className="animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                      <span>Pay via eSewa</span>
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">ID: #{estimateId?.split('-')[0]}</span>
                    </h3>
                    <div className="bg-white text-slate-900 p-4 rounded-xl mb-6 text-center">
                      <p className="font-bold text-lg">eSewa ID: 9840185500</p>
                      <p className="text-sm text-slate-500 mb-2">Amount: रु. 199</p>
                      <Image src="/esewa.png" alt="eSewa QR" width={192} height={192} className="object-contain mx-auto rounded-lg border-2 border-slate-100" />
                    </div>
                    <div className="space-y-3 mb-6">
                      <label className="text-sm text-slate-300">Enter your eSewa Transaction ID below:</label>
                      <input type="text" placeholder="e.g. 0B2V..." value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-white font-mono" />
                    </div>
                    <button onClick={handlePaymentSubmit} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-400 transition-all">
                      I Have Paid — Unlock Now
                    </button>
                  </div>
                )}

                {isVerifying && (
                  <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-xl font-bold mb-2">Verifying Payment...</h3>

                    {verificationTime < 15 ? (
                      <p className="text-sm text-slate-400 mb-4">Our engineer is manually verifying the transaction.</p>
                    ) : (
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 animate-in fade-in">
                        <p className="font-bold text-emerald-400 mb-2">Taking longer than usual?</p>
                        <p className="mb-2">Our engineer might be asleep or away from the desk. <strong>Your payment is securely logged.</strong></p>
                        <p className="text-xs text-slate-400">You can safely bookmark or close this tab. Your browser will remember you, and it will automatically unlock when verified.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* THIS FIXES BUG 4: Footer is completely hidden in Premium mode */}
        {!isPremium && (
          <div className="text-center py-12 text-sm text-slate-400">
            <p>Built by Er. Angel Mainali, Civil Engineer.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
              <span>•</span>
              <Link href="/donate" className="hover:text-slate-600">Donate</Link>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          THE PREMIUM PDF REPORT
          ========================================================= */}
      {isPremium && (
        <div id="printable-report" className="max-w-4xl mx-auto p-8 bg-white min-h-screen text-slate-900">

          <div className="print:hidden flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div>
              <h2 className="text-emerald-800 font-bold text-lg">✅ Payment Verified!</h2>
              <p className="text-emerald-600 text-sm">Your official report is ready. Download it below.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => { localStorage.removeItem('zila_estimate_id'); window.location.reload(); }}
                className="flex-1 md:flex-none bg-white border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
              >
                Start Over
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 md:flex-none bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-all flex justify-center items-center gap-2 shadow-lg"
              >
                <Download className="h-5 w-5" /> Download PDF
              </button>
            </div>
          </div>

          <div className="space-y-8">
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

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="h-5 w-5" /> Project Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div><p className="text-sm text-slate-500">Location</p><p className="font-bold capitalize">{district}, Nepal</p></div>
                <div><p className="text-sm text-slate-500">Total Area</p><p className="font-bold">{totalArea.toLocaleString()} sq.ft</p></div>
                <div><p className="text-sm text-slate-500">Structure</p><p className="font-bold">{safeFloors} Floors (RCC)</p></div>
                <div><p className="text-sm text-slate-500">Finish Quality</p><p className="font-bold capitalize">{quality}</p></div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-600">Estimated Total Cost:</span>
                <span className="text-3xl font-black text-slate-900">रु. {totalCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2"><Layers className="h-5 w-5" /> Phase-wise Cost Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {Object.entries(BREAKDOWN).map(([category, pct]) => (
                  <div key={category} className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-700 text-sm">{category}</span>
                    <span className="font-bold text-slate-900">रु. {Math.round(totalCost * pct).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2"><HardHat className="h-5 w-5" /> Required Materials</h3>
                <div className="space-y-3">
                  {Object.entries(MATERIALS_PER_SQFT).map(([material, multiplier]) => (
                    <div key={material} className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
                      <span className="text-slate-700 text-sm">{material}</span>
                      <span className="font-bold text-slate-900">{Math.round(totalArea * multiplier).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2"><Building className="h-5 w-5" /> Cost Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(LABOR_MATERIAL_RATIO).map(([cat, pct]) => (
                      <div key={cat} className="flex justify-between items-center">
                        <span className="text-slate-700 text-sm">{cat} ({Math.round(pct * 100)}%)</span>
                        <span className="font-bold text-slate-900">रु. {Math.round(totalCost * pct).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2"><Clock className="h-5 w-5" /> Est. Timeline</h3>
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

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6 print:bg-transparent print:border-slate-300">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><ShieldAlert className="h-5 w-5" /> Structural Safety & Guidelines (Updated for NBC 105:2025)</h3>
              <ul className="text-sm text-slate-700 space-y-2">
                <li>• <strong>Seismic Compliance:</strong> Design forces must align with NBC 105:2025 updates, enforcing stricter displacement checks and soil pressure limits.</li>
                <li>• <strong>Minimum Column Size:</strong> Must not be less than 12&quot; x 12&quot; (300mm x 300mm) for residential buildings in active seismic zones.</li>
                <li>• <strong>Rebar Configuration:</strong> Minimum of 4-16mm Ø and 4-12mm Ø longitudinal bars. Fe500 or Fe550 grade steel highly recommended.</li>
                <li>• <strong>Cement Mix:</strong> Use M20 grade concrete (1:1.5:3 ratio) minimum for all structural RCC members.</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-6 print:bg-transparent print:border-slate-300">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 print:text-slate-900"><ClipboardList className="h-5 w-5" /> Municipality Requirements (नक्सा पास)</h3>
              <ul className="text-sm text-blue-800 space-y-2 print:text-slate-700">
                <li>• Ensure Land Ownership Document (Lalpurja) and Land Tax Receipt (Tiro) are updated.</li>
                <li>• Hire a registered firm for Architectural and Structural drawings. Ensure soil testing for structures above 2.5 stories.</li>
                <li>• Above estimates do not include furniture, compound walls, or municipality approval fees.</li>
              </ul>
            </div>

            <div className="text-center pt-6 border-t border-slate-200 text-xs text-slate-400 mt-8">
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
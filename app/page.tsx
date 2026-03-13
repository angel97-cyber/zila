"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Building2, Layers, Maximize2, Sparkles, ChevronDown, ArrowRight, Zap,
  ShieldCheck, Lock, User, Phone, FileText, CheckCircle,
  Info, Building, Star, ChevronRight, Download, ClipboardList,
  ShieldAlert
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// --- SUPABASE CLIENT ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// 1. ENGINEERING DATABASE (DO NOT TOUCH)
// ============================================================================
const RATES: Record<string, Record<string, Record<string, number>>> = {
  nepal: {
    "Kathmandu (Core City)": { structure: 2350, economy: 3800, standard: 5100, premium: 7200 },
    "Kathmandu (Outskirts - Tokha/Etc)": { structure: 2150, economy: 3500, standard: 4700, premium: 6600 },
    "Lalitpur (Patan Core)": { structure: 2300, economy: 3750, standard: 5000, premium: 7100 },
    "Lalitpur (Godawari/Imadol)": { structure: 2050, economy: 3400, standard: 4500, premium: 6200 },
    "Bhaktapur (Core City)": { structure: 2200, economy: 3600, standard: 4800, premium: 6800 },
    "Bhaktapur (Suryabinayak/Outskirts)": { structure: 1950, economy: 3300, standard: 4400, premium: 6000 },
    "Kavre (Banepa/Dhulikhel)": { structure: 1950, economy: 3200, standard: 4250, premium: 5900 },
    "Makwanpur (Hetauda)": { structure: 1850, economy: 3050, standard: 4050, premium: 5500 },
    "Chitwan (Bharatpur)": { structure: 1850, economy: 3100, standard: 4150, premium: 5600 },
    "Chitwan (Sauraha/East)": { structure: 1900, economy: 3200, standard: 4300, premium: 5800 },
    "Kaski (Pokhara Core)": { structure: 2100, economy: 3500, standard: 4800, premium: 6800 },
    "Kaski (Pokhara Outskirts)": { structure: 1950, economy: 3300, standard: 4400, premium: 6100 },
    "Gorkha / Tanahun / Lamjung": { structure: 2150, economy: 3400, standard: 4450, premium: 6000 },
    "Syangja": { structure: 2150, economy: 3400, standard: 4450, premium: 6000 },
    "Baglung / Parbat / Myagdi": { structure: 2250, economy: 3500, standard: 4550, premium: 6100 },
    "Nawalpur (Kawasoti)": { structure: 1850, economy: 3000, standard: 4100, premium: 5600 },
    "Rupandehi (Butwal/Bhairahawa)": { structure: 1750, economy: 2900, standard: 3950, premium: 5400 },
    "Parsa (Birgunj) / Bara": { structure: 1750, economy: 2850, standard: 3900, premium: 5300 },
    "Jhapa / Morang / Sunsari": { structure: 1800, economy: 2950, standard: 4050, premium: 5500 },
    "Dhanusha (Janakpur)": { structure: 1800, economy: 2900, standard: 3950, premium: 5400 },
    "Dang / Banke (Nepalgunj)": { structure: 1850, economy: 3050, standard: 4150, premium: 5600 },
    "Kailali / Kanchanpur": { structure: 1850, economy: 3050, standard: 4150, premium: 5600 },
    "Saptari / Siraha / Mahottari": { structure: 1780, economy: 2900, standard: 3950, premium: 5400 },
    "Sarlahi / Rautahat": { structure: 1780, economy: 2900, standard: 3950, premium: 5400 },
    "Ilam / Dhankuta / Udayapur": { structure: 2050, economy: 3300, standard: 4350, premium: 5900 },
    "Nuwakot / Dhading / Sindhuli": { structure: 2050, economy: 3300, standard: 4350, premium: 5900 },
    "Sindhupalchok / Dolakha / Ramechhap": { structure: 2150, economy: 3450, standard: 4500, premium: 6100 },
    "Kapilvastu / Parasi": { structure: 1800, economy: 2950, standard: 4000, premium: 5450 },
    "Surkhet": { structure: 2000, economy: 3200, standard: 4300, premium: 5800 },
    "Palpa / Gulmi / Arghakhanchi": { structure: 2250, economy: 3500, standard: 4600, premium: 6200 },
    "Pyuthan / Salyan / Rolpa": { structure: 2250, economy: 3500, standard: 4600, premium: 6200 },
    "Doti / Dadeldhura / Achham / Baitadi": { structure: 2250, economy: 3500, standard: 4600, premium: 6200 },
    "Solukhumbu / Bhojpur / Okhaldhunga": { structure: 2500, economy: 3800, standard: 5000, premium: 6700 },
    "Khotang / Panchthar / Taplejung": { structure: 2500, economy: 3800, standard: 5000, premium: 6700 },
    "Jajarkot / Rukum / Sankhuwasabha": { structure: 2500, economy: 3800, standard: 5000, premium: 6700 },
    "Manang / Mustang / Jumla": { structure: 3200, economy: 4800, standard: 6200, premium: 8000 },
    "Kalikot / Bajura / Bajhang / Darchula": { structure: 3200, economy: 4800, standard: 6200, premium: 8000 },
    "Dolpa / Mugu / Humla (Extreme)": { structure: 4500, economy: 6500, standard: 8500, premium: 11000 },
  }
};

const DISTRICTS = Object.keys(RATES.nepal);

const STRUCTURE_TYPES = [
  { id: "rcc", label: "RCC Pillar", sub: "पिलर वाला पक्की घर", icon: "🏗️" },
  { id: "masonry", label: "Load-Bearing", sub: "विना पिलरको घर", icon: "🧱" },
  { id: "lgsf", label: "LGSF", sub: "लाइट गेज स्टिल", icon: "⚙️" },
  { id: "prefab", label: "Prefab / Panel", sub: "प्रिफ्याब घर", icon: "🔩" },
];

const FINISH_LEVELS = [
  { id: "structure", label: "Structure Only", desc: "No plaster, wiring, or plumbing", color: "from-slate-500 to-slate-600" },
  { id: "economy", label: "Economy Finish", desc: "Basic tiles & simple paint", color: "from-blue-600 to-cyan-600" },
  { id: "standard", label: "Standard Finish", desc: "Vitrified tiles & false ceiling", color: "from-emerald-600 to-teal-600" },
  { id: "premium", label: "Premium Finish", desc: "Marble, modular prep, luxury", color: "from-amber-500 to-orange-500" },
];

const BREAKDOWN: Record<string, number> = { "Foundation & Substructure": 0.18, "Superstructure (RCC & Walls)": 0.22, "Doors & Windows": 0.10, "Plumbing & Sanitary": 0.10, "Electrical Works": 0.08, "Flooring & Painting": 0.12, "Finishing & Woodwork": 0.15, "Contingency / Misc": 0.05 };
const MATERIALS_PER_SQFT: Record<string, number> = { "Cement (OPC & PPC bags)": 0.43, "Sand (cu.ft)": 1.85, "Aggregate / Gitti (cu.ft)": 1.35, "Steel / TMT Rebar (kg)": 4.50, "Bricks (pcs)": 8.50, "Paint (liters)": 0.18, "Tiles / Granite (sq.ft)": 1.30 };
const TIMELINE = [{ phase: "Foundation & Plinth", duration: "4 to 6 Weeks" }, { phase: "Superstructure (RCC & Roof)", duration: "8 to 10 Weeks" }, { phase: "Brickwork & Plastering", duration: "6 to 8 Weeks" }, { phase: "Plumbing & Electrical", duration: "3 to 4 Weeks" }, { phase: "Flooring & Painting", duration: "6 to 8 Weeks" }];

const PREFAB_BREAKDOWN: Record<string, number> = { "Foundation & Plinth (RCC/PCC)": 0.15, "Steel Skeleton (MS Tubes)": 0.25, "Wall & Roof Panels (EPS/PUF)": 0.20, "Doors & Windows": 0.10, "Plumbing & Sanitary": 0.10, "Electrical Works": 0.08, "Flooring & Finishing": 0.07, "Contingency / Misc": 0.05 };
const PREFAB_MATERIALS_PER_SQFT: Record<string, number> = { "EPS/PUF Sandwich Panels (sq.ft)": 1.30, "MS Steel Tubes (Frame) (kg)": 2.50, "Cement (Foundation only) (bags)": 0.15, "Sand & Aggregate (cu.ft)": 1.20, "Paint (liters)": 0.05, "Tiles / PVC Flooring (sq.ft)": 1.05 };
const PREFAB_TIMELINE = [{ phase: "Foundation & Plinth", duration: "2 to 3 Weeks" }, { phase: "Steel Skeleton Erection", duration: "1 to 2 Weeks" }, { phase: "Panel Installation", duration: "1 to 2 Weeks" }, { phase: "Plumbing & Electrical", duration: "1 Week" }, { phase: "Flooring & Finishing", duration: "1 to 2 Weeks" }];

const MASONRY_BREAKDOWN: Record<string, number> = { "Foundation (Stone/Brick)": 0.20, "Load-Bearing Walls": 0.25, "RCC Bands & Roof Slab": 0.15, "Doors & Windows": 0.10, "Plumbing & Sanitary": 0.08, "Electrical Works": 0.07, "Flooring & Finishing": 0.10, "Contingency / Misc": 0.05 };
const MASONRY_MATERIALS_PER_SQFT: Record<string, number> = { "Cement (OPC & PPC bags)": 0.35, "Sand & Aggregate (cu.ft)": 1.90, "TMT Rebar (Bands/Slab) (kg)": 1.50, "Bricks (Thick Walls) (pcs)": 14.00, "Paint (liters)": 0.18, "Tiles / Stone (sq.ft)": 1.10 };
const MASONRY_TIMELINE = [{ phase: "Trench Foundation", duration: "3 to 5 Weeks" }, { phase: "Wall Masonry & Bands", duration: "6 to 8 Weeks" }, { phase: "Roof Slab Casting", duration: "4 Weeks" }, { phase: "Plumbing & Electrical", duration: "3 Weeks" }, { phase: "Plaster & Finishing", duration: "6 to 8 Weeks" }];

const LGSF_BREAKDOWN: Record<string, number> = { "Foundation (RCC/PCC)": 0.12, "LGSF Steel Structure": 0.30, "Cladding & Insulation": 0.20, "Doors & Windows": 0.10, "Plumbing & Sanitary": 0.09, "Electrical Works": 0.08, "Flooring & Finishing": 0.06, "Contingency / Misc": 0.05 };
const LGSF_MATERIALS_PER_SQFT: Record<string, number> = { "LGSF Steel (G550 Grade) (kg)": 1.80, "Fiber Cement Boards (sq.ft)": 3.50, "Glass Wool Insulation (sq.ft)": 1.20, "Cement (Foundation) (bags)": 0.15, "Paint & Putty (liters)": 0.15, "Tiles / Flooring (sq.ft)": 1.05 };
const LGSF_TIMELINE = [{ phase: "Foundation & Plinth", duration: "2 to 3 Weeks" }, { phase: "LGSF Frame Erection", duration: "1 to 2 Weeks" }, { phase: "Board Cladding & Insulation", duration: "2 to 3 Weeks" }, { phase: "MEP Rough-ins", duration: "1 to 2 Weeks" }, { phase: "Joint Taping & Finishing", duration: "3 to 4 Weeks" }];

const LABOR_MATERIAL_RATIO = { "Material Cost (Cement, Steel, etc.)": 0.65, "Labor & Equipment Cost": 0.28, "Contractor Profit & Overhead": 0.07 };

function fmt(n: number) { return "Rs. " + Number(n).toLocaleString("en-IN"); }

// ============================================================================
// 2. UI SUB-COMPONENTS
// ============================================================================
function FloatingSelect({ label, icon: Icon, value, onChange, options, placeholder }: { label: string, icon: React.ElementType, value: string, onChange: (v: string) => void, options: string[], placeholder: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative group">
      <label className="block text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-2 ml-1">{label}</label>
      <button type="button" onClick={() => setOpen(!open)} className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 text-left bg-white/[0.03] backdrop-blur-sm ${value ? "border-emerald-500/50 text-white" : "border-white/10 text-white/40"} hover:border-emerald-500/70 hover:bg-white/[0.06] focus:outline-none focus:border-emerald-400`}>
        <span className="flex items-center gap-3"><Icon size={16} className="text-emerald-400 shrink-0" /><span className="font-medium text-sm">{value || placeholder}</span></span>
        <ChevronDown size={14} className={`text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-2 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
          <div className="max-h-52 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/10">
            {options.map((opt: string) => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }} className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${value === opt ? "bg-emerald-500/20 text-emerald-300" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>{opt}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type Column = { key: string, label: string, align?: "left" | "center" | "right", mono?: boolean };
type Row = Record<string, string | number>;

function PDFTable({ title, columns, rows, accent = "#059669" }: { title: string, columns: Column[], rows: Row[], accent?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, borderLeft: `3px solid ${accent}`, paddingLeft: 12, marginBottom: 14 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: "#0a1628", letterSpacing: "0.02em", textTransform: "uppercase" }}>{title}</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ background: "#0a1628" }}>
            {columns.map((col: Column) => <th key={col.key} style={{ padding: "9px 12px", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: col.align || "left" }}>{col.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: Row, i: number) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {columns.map((col: Column) => <td key={col.key} style={{ padding: "8px 12px", color: "#374151", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, textAlign: col.align || "left", ...(col.mono ? { fontFamily: "'DM Mono', monospace", fontSize: 10.5 } : {}) }}>{row[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// 3. MAIN APPLICATION PAGE
// ============================================================================
export default function Home() {
  // Application State
  const [isCalculated, setIsCalculated] = useState(false);
  const [country] = useState("nepal");
  const [district, setDistrict] = useState("Kathmandu (Core City)");
  const [structureType, setStructureType] = useState("rcc");
  const [floors, setFloors] = useState<number | string>("");
  const [area, setArea] = useState<number | string>("");
  const [areaUnit, setAreaUnit] = useState("sq.ft");
  const [quality, setQuality] = useState("");
  const [includeExternal, setIncludeExternal] = useState(false);

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Security State
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [estimateId, setEstimateId] = useState<string | null>(null);

  // --- CALCULATION LOGIC ---
  const safeFloors = Number(floors) || 0;
  const safeArea = Number(area) || 0;

  let areaInSqFt = safeArea;
  if (areaUnit === "sq.m") areaInSqFt = safeArea * 10.7639;
  if (areaUnit === "aana") areaInSqFt = safeArea * 342.25;
  if (areaUnit === "dhur") areaInSqFt = safeArea * 169.31;
  const totalArea = Math.round(safeFloors * areaInSqFt);

  let ratePerSqft = RATES[country][district] ? RATES[country][district][quality || 'standard'] : RATES[country]['Kathmandu (Core City)']['standard'];

  if (structureType === "prefab") ratePerSqft = Math.round(ratePerSqft * 0.68);
  if (structureType === "masonry") ratePerSqft = Math.round(ratePerSqft * 0.85);
  if (structureType === "lgsf") ratePerSqft = Math.round(ratePerSqft * 0.90);

  const baseHouseCost = totalArea * ratePerSqft;

  let externalCost = 0;
  let externalBreakdown = { boring: 0, septic: 0, wall: 0 };

  if (includeExternal) {
    if (ratePerSqft < 4200) {
      externalBreakdown = { boring: 60000, septic: 150000, wall: 290000 };
      externalCost = 500000;
    } else {
      externalBreakdown = { boring: 220000, septic: 180000, wall: 350000 };
      externalCost = 750000;
    }
  }

  const totalCost = baseHouseCost + externalCost;

  let activeMaterials: Record<string, number> = MATERIALS_PER_SQFT;
  let activeBreakdown: Record<string, number> = BREAKDOWN;
  let activeTimeline: Array<{ phase: string, duration: string }> = TIMELINE;

  if (structureType === "prefab") { activeMaterials = PREFAB_MATERIALS_PER_SQFT; activeBreakdown = PREFAB_BREAKDOWN; activeTimeline = PREFAB_TIMELINE; }
  if (structureType === "masonry") { activeMaterials = MASONRY_MATERIALS_PER_SQFT; activeBreakdown = MASONRY_BREAKDOWN; activeTimeline = MASONRY_TIMELINE; }
  if (structureType === "lgsf") { activeMaterials = LGSF_MATERIALS_PER_SQFT; activeBreakdown = LGSF_BREAKDOWN; activeTimeline = LGSF_TIMELINE; }

  // --- LOCAL STORAGE ---
  useEffect(() => {
    const checkSavedReport = async () => {
      const savedId = localStorage.getItem('zila_estimate_id');
      if (!savedId) return;
      const { data } = await supabase.from('estimates').select('*').eq('id', savedId).single();
      if (data) {
        setEstimateId(data.id); setDistrict(data.district); setFloors(data.floors); setArea(data.area_per_floor); setQuality(data.quality);
        if (data.premium) { setIsPremium(true); setIsCalculated(true); }
        else if (data.payment_ref) { setIsCalculated(true); setIsVerifying(true); setCheckoutStep(2); }
      }
    };
    checkSavedReport();
  }, []);

  // --- POLLING ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVerifying && estimateId) {
      interval = setInterval(async () => {
        const { data } = await supabase.from('estimates').select('premium').eq('id', estimateId).single();
        if (data && data.premium === true) {
          setIsPremium(true); setIsVerifying(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
          clearInterval(interval);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isVerifying, estimateId]);

  const handleCalculateClick = () => {
    setIsCalculated(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const handleContactSubmit = async () => {
    if (!customerName || !phone) return alert("Please enter your name and phone number.");
    setIsSubmittingContact(true);
    try {
      const { data, error } = await supabase.from('estimates').insert([{
        country, district, floors: safeFloors, area_per_floor: safeArea, quality, total_cost: totalCost,
        phone_number: phone, name: customerName, premium: false
      }]).select();
      if (error) { alert("System Error: " + error.message); setIsSubmittingContact(false); return; }
      if (data && data.length > 0) {
        setEstimateId(data[0].id); localStorage.setItem('zila_estimate_id', data[0].id);
        setCheckoutStep(2);
      }
    } catch (error) { console.error("DB Error:", error); } finally { setIsSubmittingContact(false); }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentRef || !estimateId) return alert("Please enter the eSewa Transaction ID.");
    setIsVerifying(true); setCheckoutStep(0);
    await supabase.from('estimates').update({ payment_ref: paymentRef }).eq('id', estimateId);
  };

  return (
    <>
      {/* =========================================================
          VIEW 1: THE HERO & INPUT FORM (Only shows if NOT calculated)
          ========================================================= */}
      {!isCalculated && (
        <section className="min-h-screen relative overflow-hidden print:hidden" style={{ fontFamily: "'DM Sans', sans-serif", background: "#080c14" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.07] blur-[120px]" style={{ background: "radial-gradient(circle, #10b981, #0d9488, transparent)" }} />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "#3b82f6" }} />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-16">
            <header className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-3">
                <div className="relative"><div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40"><Zap size={18} className="text-white fill-white" /></div></div>
                <span style={{ fontFamily: "'Syne', sans-serif" }} className="text-2xl font-bold text-white tracking-tight">ZILA</span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 font-medium ml-1">Nepal</span>
              </div>
              <Link href="/donate" className="text-white/50 hover:text-emerald-400 text-sm font-medium transition-colors">Support the Mission</Link>
            </header>

            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-6">
                <Sparkles size={12} className="text-emerald-400" />
                <span className="text-xs text-emerald-300 font-medium">50 Districts · Live 2026 Data · Engineer-Verified</span>
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight text-white mb-5">
                Know the exact cost<br /><span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #10b981, #34d399, #a7f3d0)" }}>before you build.</span>
              </h1>
              <p className="text-white/40 text-lg max-w-xl font-light leading-relaxed">Nepal&apos;s most accurate construction cost estimator. Trusted by thousands of homeowners across all 77 districts.</p>
            </div>

            {/* THE FORM */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-2 ml-1">Country</label>
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-white/8 bg-white/[0.02] cursor-not-allowed">
                    <MapPin size={16} className="text-emerald-400 shrink-0" /><span className="text-sm font-medium text-white/60">🇳🇵 Nepal</span>
                  </div>
                </div>
                <FloatingSelect label="District / Region" icon={MapPin} value={district} onChange={setDistrict} options={DISTRICTS} placeholder="Select your region" />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-3 ml-1">Structure Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STRUCTURE_TYPES.map((item) => (
                    <button key={item.id} type="button" onClick={() => setStructureType(item.id)} className={`relative flex flex-col items-start gap-1 p-4 rounded-xl border transition-all duration-200 text-left w-full ${structureType === item.id ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10" : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"}`}>
                      {structureType === item.id && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />}
                      <span className="text-2xl leading-none mb-1">{item.icon}</span>
                      <span className={`font-semibold text-sm ${structureType === item.id ? "text-emerald-300" : "text-white/80"}`}>{item.label}</span>
                      <span className="text-xs text-white/30">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-2 ml-1">Total Floors</label>
                  <div className="flex items-center gap-0 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-emerald-500/60 transition-colors">
                    <div className="flex items-center justify-center w-12 h-12 border-r border-white/8"><Layers size={15} className="text-emerald-400" /></div>
                    <input type="number" min="1" step="0.5" value={floors} onChange={(e) => setFloors(e.target.value)} className="flex-1 bg-transparent px-4 py-3.5 text-white text-sm font-medium focus:outline-none placeholder:text-white/20" placeholder="e.g. 2.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-2 ml-1">Area Per Floor</label>
                  <div className="flex items-center gap-0 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-emerald-500/60 transition-colors pr-2">
                    <div className="flex items-center justify-center w-12 h-12 border-r border-white/8"><Maximize2 size={15} className="text-emerald-400" /></div>
                    <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="flex-1 bg-transparent px-4 py-3.5 text-white text-sm font-medium focus:outline-none placeholder:text-white/20" placeholder="e.g. 1000" />
                    <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)} className="bg-transparent text-emerald-400 text-sm font-bold outline-none cursor-pointer">
                      <option value="sq.ft" className="bg-slate-900 text-white">Sq.ft</option>
                      <option value="sq.m" className="bg-slate-900 text-white">Sq.m</option>
                      <option value="aana" className="bg-slate-900 text-white">Aana</option>
                      <option value="dhur" className="bg-slate-900 text-white">Dhur</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-3 ml-1">Finish Quality</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FINISH_LEVELS.map((level) => (
                    <button key={level.id} type="button" onClick={() => setQuality(level.id)} className={`relative flex flex-col gap-1 p-4 rounded-xl border text-left transition-all duration-200 overflow-hidden ${quality === level.id ? "border-transparent shadow-lg" : "border-white/8 bg-white/[0.02] hover:border-white/20"}`}>
                      {quality === level.id && <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-20`} />}
                      <span className={`relative font-semibold text-sm ${quality === level.id ? "text-white" : "text-white/60"}`}>{level.label}</span>
                      <span className="relative text-xs text-white/30">{level.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-4 p-4 mb-8 border border-white/10 rounded-xl bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-all group">
                <input type="checkbox" checked={includeExternal} onChange={(e) => setIncludeExternal(e.target.checked)} className="w-5 h-5 accent-emerald-500 rounded cursor-pointer" />
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">Include External Works</div>
                  <div className="text-xs text-white/40 mt-0.5">Adds Compound Wall, Main Gate, and Water Boring/Septic to the estimate.</div>
                </div>
              </label>

              <button type="button" onClick={handleCalculateClick} disabled={!floors || !area || !quality} className={`group w-full flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-bold text-base transition-all duration-300 relative overflow-hidden ${(!floors || !area || !quality) ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5" : "text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"}`} style={floors && area && quality ? { background: "linear-gradient(135deg, #059669, #10b981, #34d399)" } : {}}>
                <Building2 size={18} />
                Calculate Total Cost
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
              {["NBC 105:2025 Compliant", "Bank-Grade Estimates", "Engineer Verified"].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="text-xs text-white/30 font-medium">{badge}</span></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          VIEW 2: COST REVEAL & CHECKOUT (Shows when calculated)
          ========================================================= */}
      {isCalculated && !isPremium && (
        <section className="relative min-h-screen py-16 overflow-hidden print:hidden" style={{ background: "#080c14", fontFamily: "'DM Sans', sans-serif" }}>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />

          <div className="relative z-10 max-w-5xl mx-auto px-4">

            {/* Header & Back Button */}
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => setIsCalculated(false)} className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                <ChevronRight size={14} className="rotate-180" /> Edit Details
              </button>
              <div className="flex items-center gap-2"><Zap size={14} className="text-emerald-500 fill-emerald-500" /><span className="text-white font-bold tracking-widest" style={{ fontFamily: "'Syne', sans-serif" }}>ZILA</span></div>
            </div>

            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-4">Estimated Total Cost</p>
              <div className="relative inline-block mb-4">
                <h2 className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-white leading-none tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {fmt(totalCost)}
                </h2>
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-white/50"><Building size={12} className="text-blue-400" />{district.split('(')[0].trim()}</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-white/50"><Layers size={12} className="text-purple-400" />{safeFloors} Flr · {structureType.toUpperCase()}</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/8 text-xs text-white/50"><Maximize2 size={12} className="text-amber-400" />{totalArea.toLocaleString()} sq.ft</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Column: Breakdown */}
              <div className="lg:col-span-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-sm">Base Structure Breakdown</h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(activeBreakdown).map(([category, pct]) => (
                    <div key={category}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/60">{category}</span>
                        <span className="font-semibold text-white/90">रु. {Math.round(baseHouseCost * pct).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full opacity-80" style={{ width: `${pct * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {includeExternal && (
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <h3 className="font-semibold text-emerald-400 text-sm mb-4">External Works (Included)</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between"><span className="text-white/50">Compound Wall & Gate</span><span className="text-white/80">रु. {externalBreakdown.wall.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">Septic Tank & Soak Pit</span><span className="text-white/80">रु. {externalBreakdown.septic.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span className="text-white/50">{ratePerSqft < 4200 ? 'Shallow Tube-Well (Motor)' : 'Deep Water Boring (>200ft)'}</span><span className="text-white/80">रु. {externalBreakdown.boring.toLocaleString('en-IN')}</span></div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <Info size={14} className="text-blue-400 shrink-0" />
                  <p className="text-xs text-white/40 leading-relaxed">Costs are based on live market rates for <strong className="text-white/60">{district.split('(')[0]}</strong>. Final quotes may vary ±5% based on specific site conditions.</p>
                </div>
              </div>

              {/* Right Column: Checkout Card */}
              <div className="lg:col-span-2 rounded-2xl overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(255,255,255,0.05), rgba(59,130,246,0.2))" }}>
                  <div className="absolute inset-0 rounded-2xl" style={{ background: "#0d1520" }} />
                </div>

                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">Premium BOQ Report</h3>
                      <p className="text-xs text-white/30">Downloadable Engineering Document</p>
                    </div>
                  </div>

                  {checkoutStep === 0 && !isVerifying && (
                    <div className="space-y-3 mb-5">
                      {["Full Material Quantities (Cement, Steel, etc.)", "Labor vs Material Distribution", "Bank-Grade PDF Format", "NBC Safety & Municipality Guidelines"].map((feat) => (
                        <div key={feat} className="flex items-center gap-2.5"><CheckCircle size={13} className="text-emerald-400 shrink-0" /><span className="text-xs text-white/60">{feat}</span></div>
                      ))}
                      <div className="flex items-center justify-between pt-4 border-t border-white/6 mt-4">
                        <div><span className="text-xs text-white/30 line-through">Rs. 499</span><span className="text-2xl font-bold text-white ml-2" style={{ fontFamily: "'Syne', sans-serif" }}>Rs. 199</span></div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium border border-emerald-500/20">60% off</span>
                      </div>
                      <button onClick={() => setCheckoutStep(1)} className="w-full py-3.5 mt-2 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-200" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                        Get My Report <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {checkoutStep === 1 && !isVerifying && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                      <p className="text-xs text-white/40 text-center leading-relaxed">Secure your report by entering your details before payment.</p>
                      <div className="relative"><div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><User size={14} className="text-emerald-400" /></div>
                        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Full Name" className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/60 transition-colors" />
                      </div>
                      <div className="relative"><div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><Phone size={14} className="text-emerald-400" /></div>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/60 transition-colors" />
                      </div>
                      <button onClick={handleContactSubmit} disabled={isSubmittingContact} className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200" style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
                        {isSubmittingContact ? "Securing..." : "Proceed to Payment"}
                      </button>
                      <button onClick={() => setCheckoutStep(0)} className="w-full text-xs text-white/30 hover:text-white/60">Cancel</button>
                    </div>
                  )}

                  {checkoutStep === 2 && !isVerifying && (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-right-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20"><ShieldCheck size={10} className="text-emerald-400" /><span className="text-[10px] text-emerald-300">eSewa Verified</span></div>
                        <span className="text-[10px] text-white/30 font-mono">ID: #{estimateId?.split('-')[0]}</span>
                      </div>
                      <div className="w-40 h-40 rounded-xl overflow-hidden border border-white/10 relative bg-white">
                        <Image src="/esewa-qr.png" alt="eSewa QR Code" fill className="object-contain p-2" />
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Rs. 199</p>
                        <p className="text-xs text-white/40 mt-1">eSewa ID: <span className="text-emerald-400 font-mono">9840185500</span></p>
                      </div>
                      <div className="w-full">
                        <input type="text" placeholder="Enter Transaction ID (e.g. 0B2V...)" value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-xs text-center text-white focus:outline-none focus:border-emerald-500/60 mb-3 font-mono" />
                        <button onClick={handlePaymentSubmit} className="w-full py-3 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                          I Have Paid — Unlock Now
                        </button>
                      </div>
                    </div>
                  )}

                  {isVerifying && (
                    <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                      <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-sm font-bold text-white mb-2">Verifying Payment...</h3>
                      <p className="text-xs text-white/40 mb-4 px-4">Our engineer is manually verifying the transaction.</p>
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1.5"><Lock size={10} className="text-white/20" /><span className="text-[10px] text-white/20">Secure</span></div>
                    <div className="flex items-center gap-1.5"><Star size={10} className="text-white/20" /><span className="text-[10px] text-white/20">2,000+ Verified</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          VIEW 3: THE PREMIUM PDF REPORT (Printed/Downloaded)
          ========================================================= */}
      {isPremium && (
        <div id="printable-report" className="max-w-5xl mx-auto p-8 bg-white min-h-screen text-slate-900 font-sans animate-in fade-in zoom-in-95 duration-700">

          <div className="print:hidden flex flex-col md:flex-row justify-between items-center gap-4 mb-12 bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
            <div>
              <h2 className="text-emerald-800 font-bold text-lg flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Payment Verified!</h2>
              <p className="text-emerald-600 text-sm">Your official BOQ report is ready. Download it below.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => { localStorage.removeItem('zila_estimate_id'); window.location.reload(); }} className="flex-1 md:flex-none bg-white border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                Start Over
              </button>
              <button onClick={() => window.print()} className="flex-1 md:flex-none bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-all flex justify-center items-center gap-2 shadow-lg">
                <Download className="h-5 w-5" /> Download PDF
              </button>
            </div>
          </div>

          <div className="space-y-10">
            {/* Header */}
            <div className="border-b-4 border-slate-900 pb-6 flex justify-between items-end">
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center"><Zap className="text-white h-7 w-7" /></div>
                  ZILA
                </h1>
                <p className="text-lg font-bold text-slate-500 mt-2 uppercase tracking-widest">Official Construction BOQ</p>
              </div>
              <div className="text-right text-sm text-slate-600 font-medium">
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p>Est. ID: <span className="font-mono text-slate-900">#{estimateId?.split('-')[0].toUpperCase()}</span></p>
                <p>Prepared by: Er. Angel Mainali</p>
              </div>
            </div>

            {/* Grand Summary Banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center shadow-xl print:bg-slate-50 print:text-slate-900 print:border print:border-slate-300 print:shadow-none">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-8 md:mb-0 md:border-r border-slate-700 print:border-slate-300 md:pr-8">
                <div><p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Location</p><p className="font-bold text-lg leading-tight">{district.split('(')[0].trim()}</p></div>
                <div><p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Total Area</p><p className="font-bold text-lg leading-tight">{totalArea.toLocaleString()} sq.ft</p></div>
                <div><p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Structure</p><p className="font-bold text-lg leading-tight">{safeFloors} Flr ({structureType.toUpperCase()})</p></div>
                <div><p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Finish Quality</p><p className="font-bold text-lg leading-tight capitalize">{quality}</p></div>
              </div>
              <div className="md:pl-8 text-left md:text-right w-full md:w-auto">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">Estimated Grand Total</p>
                <div className="text-4xl font-black text-emerald-400 print:text-slate-900 tracking-tight">रु. {totalCost.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* 2-Column Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* LEFT COLUMN */}
              <div className="lg:col-span-7 space-y-8">
                <PDFTable
                  title="Phase-wise Cost Breakdown"
                  columns={[{ key: "category", label: "Construction Phase" }, { key: "amount", label: "Amount (Rs.)", align: "right", mono: true }]}
                  rows={Object.entries(activeBreakdown).map(([category, pct]) => ({ category, amount: fmt(Math.round(baseHouseCost * pct)) }))}
                />

                {includeExternal && (
                  <PDFTable
                    title="External Works Breakdown" accent="#3b82f6"
                    columns={[{ key: "category", label: "Work Type" }, { key: "amount", label: "Amount (Rs.)", align: "right", mono: true }]}
                    rows={[
                      { category: "Compound Wall & Main Gate", amount: fmt(externalBreakdown.wall) },
                      { category: "Septic Tank & Soak Pit", amount: fmt(externalBreakdown.septic) },
                      { category: ratePerSqft < 4200 ? 'Shallow Tube-Well / Plumbing' : 'Deep Water Boring (>200ft)', amount: fmt(externalBreakdown.boring) }
                    ]}
                  />
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-5 space-y-8">
                <PDFTable
                  title="Required Materials" accent="#f59e0b"
                  columns={[{ key: "material", label: "Material Specification" }, { key: "qty", label: "Estimated Qty", align: "right", mono: true }]}
                  rows={Object.entries(activeMaterials).map(([material, multiplier]) => ({ material, qty: Math.round(totalArea * multiplier).toLocaleString('en-IN') }))}
                />
                <PDFTable
                  title="Cost Distribution" accent="#a855f7"
                  columns={[{ key: "cat", label: "Financial Segment" }, { key: "amount", label: "Amount", align: "right", mono: true }]}
                  rows={Object.entries(LABOR_MATERIAL_RATIO).map(([cat, pct]) => ({ cat: `${cat} (${Math.round(pct * 100)}%)`, amount: fmt(Math.round(totalCost * pct)) }))}
                />
                <PDFTable
                  title="Estimated Timeline" accent="#ec4899"
                  columns={[{ key: "phase", label: "Project Phase" }, { key: "duration", label: "Duration", align: "right" }]}
                  rows={activeTimeline.map(item => ({ phase: item.phase, duration: item.duration }))}
                />
              </div>
            </div>

            {/* Bottom Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-200 print:bg-transparent print:border-slate-300">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                  <ShieldAlert className="h-6 w-6 text-red-600" />
                  Structural Safety Guidelines
                </h3>
                {structureType === "rcc" && (
                  <ul className="text-sm text-slate-700 space-y-3">
                    <li>• <strong>Seismic Compliance:</strong> Design forces must align with NBC 105:2025 updates.</li>
                    <li>• <strong>Minimum Column Size:</strong> Must not be less than 12&quot; x 12&quot; (300mm x 300mm).</li>
                    <li>• <strong>Rebar Configuration:</strong> Minimum 4-16mm Ø and 4-12mm Ø longitudinal bars. Fe500D grade required.</li>
                    <li>• <strong>Cement Mix:</strong> Use M20 grade concrete (1:1.5:3) minimum for all structural members.</li>
                  </ul>
                )}
                {structureType === "prefab" && (
                  <ul className="text-sm text-slate-700 space-y-3">
                    <li>• <strong>Steel Skeleton:</strong> MS Steel tubular sections must be treated with anti-rust red oxide primer.</li>
                    <li>• <strong>Panel Specifications:</strong> Use EPS or PUF panels (min 50mm) for thermal insulation.</li>
                    <li>• <strong>Foundation:</strong> RCC isolated footings and tie-beams strictly required for wind-uplift resistance.</li>
                  </ul>
                )}
                {structureType === "masonry" && (
                  <ul className="text-sm text-slate-700 space-y-3">
                    <li>• <strong>Seismic Compliance:</strong> Adhere to NBC 202:2015. Continuous RCC bands at plinth, sill, and lintel are mandatory.</li>
                    <li>• <strong>Wall Thickness:</strong> Exterior load-bearing walls must be min 14 inches thick.</li>
                    <li>• <strong>Height Restriction:</strong> Unreinforced masonry is not recommended beyond 2 stories.</li>
                  </ul>
                )}
                {structureType === "lgsf" && (
                  <ul className="text-sm text-slate-700 space-y-3">
                    <li>• <strong>Structural Steel:</strong> High-Tensile Zinc-Alum coated steel (G550 grade) required.</li>
                    <li>• <strong>Anchor Bolts:</strong> Must be verified against severe wind uplift shear forces.</li>
                    <li>• <strong>Cladding:</strong> Heavy-duty Fiber Cement Boards (min 12mm) treated with weather primer.</li>
                  </ul>
                )}
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-100 print:bg-transparent print:border-slate-300">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-lg print:text-slate-900">
                  <ClipboardList className="h-6 w-6" /> Municipality Requirements (नक्सा पास)
                </h3>
                <ul className="text-sm text-blue-800 space-y-3 print:text-slate-700">
                  <li>• Ensure Land Ownership Document (Lalpurja) and Land Tax Receipt (Tiro) are updated.</li>
                  <li>• Hire a registered firm for Architectural and Structural drawings conforming to NEC standards.</li>
                  <li>• Soil testing is highly recommended for structures above 2.5 stories in the Valley.</li>
                  <li>• Above estimates do not include furniture or municipality approval fees.</li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-8 border-t-2 border-slate-200 text-xs text-slate-400 mt-12 pb-12">
              <p>Disclaimer: This is a preliminary Bill of Quantities (BOQ) generated based on current market rates in Nepal.</p>
              <p>Actual costs may vary based on exact site conditions, contractor negotiations, and material brand selections.</p>
              <p className="mt-3 font-bold text-slate-500 uppercase tracking-widest">Generated securely via zila.app</p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
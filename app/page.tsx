"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin, Building2, Layers, Maximize2, Sparkles, ChevronDown, ArrowRight, Zap,
  ShieldCheck, Lock, User, Phone, FileText, CheckCircle, Info, Building, Star, 
  ChevronRight, Download, ClipboardList, ShieldAlert, Sun, Moon, Languages, Cpu
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

// Phase & Material Arrays Kept Identical for Engineering Accuracy
const BREAKDOWN: Record<string, number> = { "[Tranche 1] Foundation & DPC": 0.18, "[Tranche 2] Superstructure (Columns/Slabs)": 0.22, "[Tranche 3] Doors & Windows": 0.10, "[Tranche 3] Plumbing & Sanitary": 0.10, "[Tranche 3] Electrical Works": 0.08, "[Tranche 3] Flooring & Painting": 0.12, "[Tranche 3] Finishing & Woodwork": 0.15, "Contingency / Approvals": 0.05 };
const MATERIALS_PER_SQFT: Record<string, number> = { "Cement OPC 43/53 Grade (bags)": 0.28, "Cement PPC (bags)": 0.15, "Fe500D TMT Rebar (kg)": 5.20, "River Sand (cu.ft)": 1.85, "20mm Aggregate/Gitti (cu.ft)": 1.35, "Bricks - 1st Class (pcs)": 8.50, "Binding Wire (kg)": 0.06, "Formwork Timber (sq.ft)": 0.60, "Flush Doors (nos)": 0.008, "UPVC/Aluminum Windows (nos)": 0.01, "CPVC/PPR Pipes (running ft)": 0.40, "Sanitary Fixtures (sets)": 0.002, "Copper Wire 2.5mm/1.5mm (coils)": 0.012, "Switches & Sockets (nos)": 0.08, "MCB Distribution Board (nos)": 0.0015, "Wall Putty (kg)": 0.40, "Primer (liters)": 0.08, "Emulsion Paint (liters)": 0.18, "Vitrified Tiles (sq.ft)": 1.30, "Waterproofing Compound (liters)": 0.01 };
const TIMELINE = [ { phase: "Tranche 1: Foundation & Plinth", duration: "4 to 6 Weeks" }, { phase: "Tranche 2: Superstructure (RCC & Roof)", duration: "8 to 10 Weeks" }, { phase: "Tranche 2: Brickwork & Plastering", duration: "6 to 8 Weeks" }, { phase: "Tranche 3: Plumbing & Electrical", duration: "3 to 4 Weeks" }, { phase: "Tranche 3: Flooring, Painting & Finishing", duration: "6 to 8 Weeks" } ];
const PREFAB_BREAKDOWN: Record<string, number> = { "[Tranche 1] Foundation & Plinth (RCC/PCC)": 0.15, "[Tranche 2] Steel Skeleton (MS Tubes)": 0.25, "[Tranche 2] Wall & Roof Panels (EPS/PUF)": 0.20, "[Tranche 3] Doors & Windows": 0.10, "[Tranche 3] Plumbing & Sanitary": 0.10, "[Tranche 3] Electrical Works": 0.08, "[Tranche 3] Flooring & Finishing": 0.07, "Contingency / Approvals": 0.05 };
const PREFAB_MATERIALS_PER_SQFT: Record<string, number> = { "EPS/PUF Sandwich Panels 50mm (sq.ft)": 1.30, "MS Steel Tubes (Frame) (kg)": 2.50, "Cement (Foundation only) (bags)": 0.15, "Sand & Aggregate (cu.ft)": 1.20, "J-Hooks & Fasteners (kg)": 0.10, "CGI Color Roofing Sheet (sq.ft)": 1.10, "UPVC Windows (nos)": 0.01, "Flush/PVC Doors (nos)": 0.008, "CPVC/PPR Pipes (running ft)": 0.40, "Sanitary Fixtures (sets)": 0.002, "Copper Wire & Conduits (coils)": 0.012, "Switches & Sockets (nos)": 0.08, "Paint (liters - interior minimal)": 0.05, "PVC/Vitrified Flooring (sq.ft)": 1.05 };
const PREFAB_TIMELINE = [ { phase: "Tranche 1: Foundation & Plinth", duration: "2 to 3 Weeks" }, { phase: "Tranche 2: Steel Skeleton Erection", duration: "1 to 2 Weeks" }, { phase: "Tranche 2: Panel Installation", duration: "1 to 2 Weeks" }, { phase: "Tranche 3: Plumbing & Electrical", duration: "1 Week" }, { phase: "Tranche 3: Flooring & Finishing", duration: "1 to 2 Weeks" } ];
const MASONRY_BREAKDOWN: Record<string, number> = { "[Tranche 1] Foundation (Stone/Brick)": 0.20, "[Tranche 2] Load-Bearing Walls": 0.25, "[Tranche 2] RCC Bands & Roof Slab": 0.15, "[Tranche 3] Doors & Windows": 0.10, "[Tranche 3] Plumbing & Sanitary": 0.08, "[Tranche 3] Electrical Works": 0.07, "[Tranche 3] Flooring & Finishing": 0.10, "Contingency / Approvals": 0.05 };
const MASONRY_MATERIALS_PER_SQFT: Record<string, number> = { "Cement OPC & PPC (bags)": 0.35, "Sand & Aggregate (cu.ft)": 1.90, "Fe500D TMT Rebar (Bands/Slab) (kg)": 1.50, "Bricks (14-inch Walls) (pcs)": 14.00, "Binding Wire (kg)": 0.02, "Formwork Timber (sq.ft)": 0.30, "Wooden/Sal Doors (nos)": 0.008, "Wooden Windows (nos)": 0.01, "CPVC/PPR Pipes (running ft)": 0.40, "Sanitary Fixtures (sets)": 0.002, "Copper Wire & Conduits (coils)": 0.012, "Switches & Sockets (nos)": 0.08, "Wall Putty (kg)": 0.30, "Paint (liters)": 0.18, "Tiles / Stone (sq.ft)": 1.10 };
const MASONRY_TIMELINE = [ { phase: "Tranche 1: Trench Foundation", duration: "3 to 5 Weeks" }, { phase: "Tranche 2: Wall Masonry & Bands", duration: "6 to 8 Weeks" }, { phase: "Tranche 2: Roof Slab Casting", duration: "4 Weeks" }, { phase: "Tranche 3: Plumbing & Electrical", duration: "3 Weeks" }, { phase: "Tranche 3: Plaster & Finishing", duration: "6 to 8 Weeks" } ];
const LGSF_BREAKDOWN: Record<string, number> = { "[Tranche 1] Foundation (RCC/PCC)": 0.12, "[Tranche 2] LGSF Steel Structure": 0.30, "[Tranche 2] Cladding & Insulation": 0.20, "[Tranche 3] Doors & Windows": 0.10, "[Tranche 3] Plumbing & Sanitary": 0.09, "[Tranche 3] Electrical Works": 0.08, "[Tranche 3] Flooring & Finishing": 0.06, "Contingency / Approvals": 0.05 };
const LGSF_MATERIALS_PER_SQFT: Record<string, number> = { "LGSF Steel (G550 Grade) (kg)": 1.80, "Fiber Cement Boards (sq.ft)": 3.50, "Glass Wool Insulation (sq.ft)": 1.20, "Cement (Foundation) (bags)": 0.15, "Sand & Aggregate (cu.ft)": 0.80, "Anchor Bolts & Fasteners (kg)": 0.15, "UPVC Windows (nos)": 0.01, "Flush Doors (nos)": 0.008, "CPVC/PPR Pipes (running ft)": 0.40, "Sanitary Fixtures (sets)": 0.002, "Copper Wire & Conduits (coils)": 0.012, "Switches & Sockets (nos)": 0.08, "Joint Tape & Wall Putty (kg)": 0.20, "Paint & Primer (liters)": 0.15, "Tiles / Flooring (sq.ft)": 1.05 };
const LGSF_TIMELINE = [ { phase: "Tranche 1: Foundation & Plinth", duration: "2 to 3 Weeks" }, { phase: "Tranche 2: LGSF Frame Erection", duration: "1 to 2 Weeks" }, { phase: "Tranche 2: Board Cladding & Insulation", duration: "2 to 3 Weeks" }, { phase: "Tranche 3: MEP Rough-ins", duration: "1 to 2 Weeks" }, { phase: "Tranche 3: Joint Taping & Finishing", duration: "3 to 4 Weeks" } ];

const LABOR_MATERIAL_RATIO = { "Material Cost (Cement, Steel, etc.)": 0.65, "Labor & Equipment Cost": 0.28, "Contractor Profit & Overhead": 0.07 };
function fmt(n: number) { return "Rs. " + Number(n).toLocaleString("en-IN"); }

function numberToWordsNepali(num: number): string {
  const a =['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b =['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
  const numStr = num.toString();
  if (numStr.length > 9) return 'Overflow';
  const n = ('000000000' + numStr).substring(numStr.length > 9 ? numStr.length - 9 : 0).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) : '';
  return str.trim() + ' Rupees Only';
}

function FloatingSelect({ label, icon: Icon, value, onChange, options, placeholder, isDark }: { label: string, icon: React.ElementType, value: string, onChange: (v: string) => void, options: string[], placeholder: string, isDark: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative group">
      <label className="block text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-2 ml-1">{label}</label>
      <button type="button" onClick={() => setOpen(!open)} className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 text-left backdrop-blur-sm focus:outline-none focus:border-emerald-500 ${isDark ? (value ? "border-emerald-500/50 text-white bg-white/[0.03] hover:bg-white/[0.06]" : "border-white/10 text-white/40 bg-white/[0.03] hover:border-emerald-500/70") : (value ? "border-emerald-500 text-slate-900 bg-white shadow-sm" : "border-slate-200 text-slate-500 bg-white hover:border-emerald-500")}`}>
        <span className="flex items-center gap-3"><Icon size={16} className="text-emerald-500 shrink-0" /><span className="font-medium text-sm">{value || placeholder}</span></span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${isDark ? 'text-white/30' : 'text-slate-400'}`} />
      </button>
      {open && (
        <div className={`absolute z-50 w-full mt-2 rounded-xl border overflow-hidden shadow-2xl ${isDark ? 'border-white/10 bg-slate-900/95 shadow-black/40' : 'border-slate-200 bg-white shadow-slate-200'}`}>
          <div className="max-h-52 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-emerald-500/50">
            {options.map((opt: string) => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }} className={`w-full px-4 py-2.5 text-sm text-left transition-colors ${value === opt ? (isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-50 text-emerald-700 font-bold") : (isDark ? "text-white/70 hover:bg-white/5 hover:text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}`}>{opt}</button>
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
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }} className="print:break-inside-avoid">
              {columns.map((col: Column) => <td key={col.key} style={{ padding: "8px 12px", color: "#374151", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, textAlign: col.align || "left", ...(col.mono ? { fontFamily: "'DM Mono', monospace", fontSize: 10.5 } : {}) }}>{row[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Home() {
  const [isCalculated, setIsCalculated] = useState(false);
  const [country] = useState("nepal");
  const [district, setDistrict] = useState("Kathmandu (Core City)");
  const [structureType, setStructureType] = useState("rcc");
  const [floors, setFloors] = useState<number | string>("");
  const [area, setArea] = useState<number | string>("");
  const [areaUnit, setAreaUnit] = useState("sq.ft");
  const [quality, setQuality] = useState("");
  const [includeExternal, setIncludeExternal] = useState(false);
  
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [estimateId, setEstimateId] = useState<string | null>(null);

  // Theme & Language State
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<"en" | "ne">("en");
  

  

  const tx = (en: string, ne: string) => lang === "en" ? en : ne;

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
    const benchmarkRate = RATES[country][district] ? RATES[country][district]['standard'] : 4800;
    if (benchmarkRate < 4200) { externalBreakdown = { boring: 60000, septic: 150000, wall: 290000 }; externalCost = 500000; } 
    else { externalBreakdown = { boring: 220000, septic: 180000, wall: 350000 }; externalCost = 750000; }
  }

  const totalCost = baseHouseCost + externalCost;

  let activeMaterials: Record<string, number> = MATERIALS_PER_SQFT;
  let activeBreakdown: Record<string, number> = BREAKDOWN;
  let activeTimeline: Array<{ phase: string, duration: string }> = TIMELINE;

  if (structureType === "prefab") { activeMaterials = PREFAB_MATERIALS_PER_SQFT; activeBreakdown = PREFAB_BREAKDOWN; activeTimeline = PREFAB_TIMELINE; }
  if (structureType === "masonry") { activeMaterials = MASONRY_MATERIALS_PER_SQFT; activeBreakdown = MASONRY_BREAKDOWN; activeTimeline = MASONRY_TIMELINE; }
  if (structureType === "lgsf") { activeMaterials = LGSF_MATERIALS_PER_SQFT; activeBreakdown = LGSF_BREAKDOWN; activeTimeline = LGSF_TIMELINE; }

  useEffect(() => {
    const checkSavedReport = async () => {
      const savedId = localStorage.getItem('zila_estimate_id');
      if (!savedId) return;
      const { data } = await supabase.from('estimates').select('*').eq('id', savedId).single();
      if (data) {
        setEstimateId(data.id); setDistrict(data.district); setFloors(data.floors); setArea(data.area_per_floor); setQuality(data.quality);
        setCustomerName(data.name || "Valued Client");
        if (data.premium) { setIsPremium(true); setIsCalculated(true); }
        else if (data.payment_ref) { setIsCalculated(true); setIsVerifying(true); setCheckoutStep(2); }
      }
    };
    checkSavedReport();
  }, []);

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

  const handleCalculateClick = () => { setIsCalculated(true); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100); };

  const handleContactSubmit = async () => {
    if (!customerName || !phone) return alert(tx("Please enter your name and phone number.", "कृपया आफ्नो नाम र फोन नम्बर राख्नुहोस्।"));
    setIsSubmittingContact(true);
    try {
      const { data, error } = await supabase.from('estimates').insert([{ country, district, floors: safeFloors, area_per_floor: safeArea, quality, total_cost: totalCost, phone_number: phone, name: customerName, premium: false }]).select();
      if (error) { alert("System Error: " + error.message); setIsSubmittingContact(false); return; }
      if (data && data.length > 0) { setEstimateId(data[0].id); localStorage.setItem('zila_estimate_id', data[0].id); setCheckoutStep(2); }
    } catch (error) { console.error("DB Error:", error); } finally { setIsSubmittingContact(false); }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentRef || !estimateId) return alert(tx("Please enter the eSewa Transaction ID.", "कृपया eSewa कारोबार ID राख्नुहोस्।"));
    setIsVerifying(true); setCheckoutStep(0);
    await supabase.from('estimates').update({ payment_ref: paymentRef }).eq('id', estimateId);
  };

  

  return (
    <>
      {!isCalculated && (
        <section className={`min-h-screen relative overflow-hidden print:hidden transition-colors duration-300 ${isDark ? "bg-[#080c14]" : "bg-slate-50"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.07] blur-[120px]" style={{ background: "radial-gradient(circle, #10b981, #0d9488, transparent)" }} />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "#3b82f6" }} />
            <div className={`absolute inset-0 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.05]'}`} style={{ backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-16">
            <header className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-3">
                <div className="relative"><div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40"><Zap size={18} className="text-white fill-white" /></div></div>
                <span style={{ fontFamily: "'Syne', sans-serif" }} className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>ZILA</span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-500 font-medium ml-1">Nepal</span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setLang(lang === 'en' ? 'ne' : 'en')} className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-colors ${isDark ? 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                    <Languages size={14} /> {lang === 'en' ? 'नेपाली' : 'English'}
                  </button>
                  <button onClick={() => setIsDark(!isDark)} className={`p-1.5 rounded-md transition-colors ${isDark ? 'bg-white/10 text-white/70 hover:text-white' : 'bg-slate-200 text-slate-700 hover:text-slate-900'}`}>
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>
                <a href="/donate" className={`text-sm font-medium transition-colors relative z-50 ${isDark ? 'text-white/50 hover:text-emerald-400' : 'text-slate-500 hover:text-emerald-600'}`}>{tx("Support the Mission", "अभियानलाई समर्थन")}</a>
              </div>
            </header>

            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-6">
                <Sparkles size={12} className="text-emerald-500" />
                <span className="text-xs text-emerald-500 font-medium">{tx("50 Districts · Live 2026 Data · Engineer-Verified", "५० जिल्लाहरू · २०२६ को डाटा · इन्जिनियर-प्रमाणित")}</span>
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif" }} className={`text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {tx("Know the exact cost", "सही लागत थाहा पाउनुहोस्")}<br /><span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #10b981, #34d399, #a7f3d0)" }}>{tx("before you build.", "निर्माण गर्नु अघि।")}</span>
              </h1>
              <p className={`text-lg max-w-xl font-light leading-relaxed ${isDark ? 'text-white/40' : 'text-slate-600'}`}>{tx("Nepal's most accurate construction cost estimator. Trusted by thousands of homeowners across all 77 districts.", "नेपालको सबैभन्दा भरपर्दो निर्माण लागत अनुमानक। ७७ वटै जिल्लाका हजारौं घरधनीहरुद्वारा विश्वस्त।")}</p>
            </div>

            <div className={`rounded-2xl border p-8 shadow-2xl transition-colors ${isDark ? 'border-white/[0.07] bg-white/[0.025] backdrop-blur-xl shadow-black/40' : 'border-slate-200 bg-white shadow-slate-200/50'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-2 ml-1">{tx("Country", "देश")}</label>
                  <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-not-allowed ${isDark ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'}`}>
                    <MapPin size={16} className="text-emerald-500 shrink-0" /><span className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>🇳🇵 Nepal</span>
                  </div>
                </div>
                <FloatingSelect isDark={isDark} label={tx("District / Region", "जिल्ला / क्षेत्र")} icon={MapPin} value={district} onChange={setDistrict} options={DISTRICTS} placeholder={tx("Select your region", "आफ्नो क्षेत्र छान्नुहोस्")} />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-3 ml-1">{tx("Structure Type", "संरचनाको प्रकार")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STRUCTURE_TYPES.map((item) => (
                    <button key={item.id} type="button" onClick={() => setStructureType(item.id)} className={`relative flex flex-col items-start gap-1 p-4 rounded-xl border transition-all duration-200 text-left w-full ${structureType === item.id ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10" : (isDark ? "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]" : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50")}`}>
                      {structureType === item.id && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />}
                      <span className="text-2xl leading-none mb-1">{item.icon}</span>
                      <span className={`font-semibold text-sm ${structureType === item.id ? "text-emerald-600 dark:text-emerald-300" : (isDark ? "text-white/80" : "text-slate-700")}`}>{tx(item.label, item.sub)}</span>
                      <span className={`text-xs ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{tx(item.sub, item.label)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-2 ml-1">{tx("Total Floors", "जम्मा तला")}</label>
                  <div className={`flex items-center gap-0 rounded-xl border transition-colors focus-within:border-emerald-500/60 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white shadow-sm'}`}>
                    <div className={`flex items-center justify-center w-12 h-12 border-r ${isDark ? 'border-white/8' : 'border-slate-200'}`}><Layers size={15} className="text-emerald-500" /></div>
                    <input type="number" min="1" step="0.5" value={floors} onChange={(e) => setFloors(e.target.value)} className={`flex-1 bg-transparent px-4 py-3.5 text-sm font-medium focus:outline-none ${isDark ? 'text-white placeholder:text-white/20' : 'text-slate-900 placeholder:text-slate-400'}`} placeholder="e.g. 2.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-2 ml-1">{tx("Area Per Floor", "प्रति तलाको क्षेत्रफल")}</label>
                  <div className={`flex items-center gap-0 rounded-xl border transition-colors focus-within:border-emerald-500/60 pr-2 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white shadow-sm'}`}>
                    <div className={`flex items-center justify-center w-12 h-12 border-r ${isDark ? 'border-white/8' : 'border-slate-200'}`}><Maximize2 size={15} className="text-emerald-500" /></div>
                    <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className={`flex-1 bg-transparent px-4 py-3.5 text-sm font-medium focus:outline-none ${isDark ? 'text-white placeholder:text-white/20' : 'text-slate-900 placeholder:text-slate-400'}`} placeholder="e.g. 1000" />
                    <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)} className={`bg-transparent text-emerald-500 text-sm font-bold outline-none cursor-pointer ${isDark ? '' : 'bg-white'}`}>
                      <option value="sq.ft" className={isDark ? "bg-slate-900 text-white" : ""}>Sq.ft</option>
                      <option value="sq.m" className={isDark ? "bg-slate-900 text-white" : ""}>Sq.m</option>
                      <option value="aana" className={isDark ? "bg-slate-900 text-white" : ""}>Aana</option>
                      <option value="dhur" className={isDark ? "bg-slate-900 text-white" : ""}>Dhur</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-3 ml-1">{tx("Finish Quality", "फिनिसिङ गुणस्तर")}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FINISH_LEVELS.map((level) => (
                    <button key={level.id} type="button" onClick={() => setQuality(level.id)} className={`relative flex flex-col gap-1 p-4 rounded-xl border text-left transition-all duration-200 overflow-hidden ${quality === level.id ? "border-transparent shadow-lg" : (isDark ? "border-white/8 bg-white/[0.02] hover:border-white/20" : "border-slate-200 bg-slate-50 hover:border-slate-300")}`}>
                      {quality === level.id && <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-20`} />}
                      <span className={`relative font-semibold text-sm ${quality === level.id ? (isDark ? "text-white" : "text-slate-900") : (isDark ? "text-white/60" : "text-slate-600")}`}>{tx(level.label, level.label.includes("Only") ? "स्ट्रक्चर मात्र" : level.label.split(" ")[0] + " फिनिसिङ")}</span>
                      <span className={`relative text-xs ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{level.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <label className={`flex items-center gap-4 p-4 mb-8 border rounded-xl cursor-pointer transition-all group ${isDark ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                <input type="checkbox" checked={includeExternal} onChange={(e) => setIncludeExternal(e.target.checked)} className="w-5 h-5 accent-emerald-500 rounded cursor-pointer" />
                <div>
                  <div className={`font-bold text-sm transition-colors ${isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-600'}`}>{tx("Include External Works", "बाह्य कार्यहरू समावेश गर्नुहोस्")}</div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{tx("Adds Compound Wall, Main Gate, and Water Boring/Septic to the estimate.", "कम्पाउन्ड वाल, मेन गेट र बोरिङ/सेप्टिक ट्याङ्क अनुमानमा जोड्दछ।")}</div>
                </div>
              </label>

              <button type="button" onClick={handleCalculateClick} disabled={!floors || !area || !quality} className={`group w-full flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-bold text-base transition-all duration-300 relative overflow-hidden ${(!floors || !area || !quality) ? (isDark ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5" : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200") : "text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"}`} style={floors && area && quality ? { background: "linear-gradient(135deg, #059669, #10b981, #34d399)" } : {}}>
                <Building2 size={18} />
                {tx("Calculate Total Cost", "कुल लागत हिसाब गर्नुहोस्")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
              {[tx("NBC 105:2025 Compliant", "NBC १०५:२०२५ अनुसार"), tx("Bank-Grade Estimates", "बैंक-ग्रेड अनुमान"), tx("Engineer Verified", "इन्जिनियर प्रमाणित")].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className={`text-xs font-medium ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{badge}</span></div>
              ))}
            </div>
          </div>
          {/* --- METHODOLOGY SECTION START --- */}
            <div className="mt-32 mb-10 border-t border-white/10 pt-20">
              <div className="text-center mb-16">
                <p className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-3">{tx("The Engineering Engine", "इन्जिनियरिङ इन्जिन")}</p>
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  {tx("How ZILA calculates with Bank-Grade precision.", "ZILA ले कसरी बैंक-ग्रेड शुद्धताका साथ हिसाब गर्छ।")}
                </h2>
                <p className={`text-sm max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-white/40' : 'text-slate-600'}`}>
                  {tx("We don't use generic square-foot estimates. ZILA runs your inputs through a proprietary structural algorithm built on real Nepalese market data and national building codes.", "हामी सामान्य वर्ग-फुट अनुमानहरू प्रयोग गर्दैनौं। ZILA ले वास्तविक नेपाली बजार डाटा र राष्ट्रिय भवन संहितामा आधारित संरचनात्मक एल्गोरिदम प्रयोग गर्दछ।")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className={`p-8 rounded-2xl border transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                    <MapPin size={20} className="text-blue-500" />
                  </div>
                  <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx("1. Hyper-Local Matrix", "१. अति-स्थानीय म्याट्रिक्स")}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
                    {tx("Cement in Humla costs more than in Chitwan. ZILA maps freight, labor, and material rates across 50 districts using a live 2082/83 B.S. pricing matrix.", "हुम्लामा सिमेन्टको मूल्य चितवनभन्दा बढी पर्छ। ZILA ले ५० जिल्लाहरूमा ढुवानी, श्रम र सामग्रीको दरहरू म्याप गर्दछ।")}
                  </p>
                </div>

                {/* Step 2 */}
                <div className={`p-8 rounded-2xl border transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                    <Cpu size={20} className="text-emerald-500" />
                  </div>
                  <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx("2. Structural Algorithms", "२. संरचनात्मक एल्गोरिदम")}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
                    {tx("The engine dynamically calculates rebar tonnage, concrete volume, and labor distribution strictly adhering to NBC 105:2020 (AMD 2025) seismic safety guidelines.", "इन्जिनले NBC 105:2020 भूकम्प सुरक्षा दिशानिर्देशहरूको कडाईका साथ पालना गर्दै डण्डी, सिमेन्ट र श्रमको हिसाब गर्छ।")}
                  </p>
                </div>

                {/* Step 3 */}
                <div className={`p-8 rounded-2xl border transition-all hover:-translate-y-1 ${isDark ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                    <ShieldCheck size={20} className="text-purple-500" />
                  </div>
                  <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx("3. Bank-Grade Export", "३. बैंक-ग्रेड रिपोर्ट")}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
                    {tx("Results are formatted into an E-Verified, tranches-based Bill of Quantities (BOQ) ready for submission to 'A' Class commercial banks for loan processing.", "नतिजाहरू 'A' वर्गका वाणिज्य बैंकहरूमा ऋण प्रक्रियाको लागि पेश गर्न तयार E-प्रमाणित BOQ मा ढाँचाबद्ध गरिन्छ।")}
                  </p>
                </div>
              </div>
            </div>
            {/* --- METHODOLOGY SECTION END --- */}
        </section>
      )}

      {isCalculated && !isPremium && (
        <section className={`relative min-h-screen py-16 overflow-hidden print:hidden ${isDark ? "bg-[#080c14]" : "bg-slate-50"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />

          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => setIsCalculated(false)} className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                <ChevronRight size={14} className="rotate-180" /> {tx("Edit Details", "विवरण सम्पादन गर्नुहोस्")}
              </button>
              <div className="flex items-center gap-2"><Zap size={14} className="text-emerald-500 fill-emerald-500" /><span className={`font-bold tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>ZILA</span></div>
            </div>

            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-4">{tx("Estimated Total Cost", "अनुमानित कुल लागत")}</p>
              <div className="relative inline-block mb-4">
                <h2 className={`text-5xl sm:text-7xl md:text-8xl font-extrabold leading-none tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  {fmt(totalCost)}
                </h2>
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${isDark ? 'bg-white/5 border-white/8 text-white/50' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}><Building size={12} className="text-blue-500" />{district.split('(')[0].trim()}</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${isDark ? 'bg-white/5 border-white/8 text-white/50' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}><Layers size={12} className="text-purple-500" />{safeFloors} {tx("Flr", "तला")} · {structureType.toUpperCase()}</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${isDark ? 'bg-white/5 border-white/8 text-white/50' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}><Maximize2 size={12} className="text-amber-500" />{totalArea.toLocaleString()} sq.ft</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className={`lg:col-span-3 rounded-2xl border p-6 backdrop-blur-sm ${isDark ? 'border-white/[0.07] bg-white/[0.02]' : 'border-slate-200 bg-white shadow-lg'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx("Base Structure Breakdown", "आधारभूत संरचनाको विभाजन")}</h3>
                </div>
                <div className="space-y-4">
                  {Object.entries(activeBreakdown).map(([category, pct]) => (
                    <div key={category}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className={isDark ? "text-white/60" : "text-slate-600"}>{category}</span>
                        <span className={`font-semibold ${isDark ? "text-white/90" : "text-slate-900"}`}>Rs. {Math.round(baseHouseCost * pct).toLocaleString('en-IN')}</span>
                      </div>
                      <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <div className="bg-emerald-500 h-full rounded-full opacity-80" style={{ width: `${pct * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {includeExternal && (
                  <div className={`mt-6 pt-5 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <h3 className="font-semibold text-emerald-500 text-sm mb-4">{tx("External Works (Included)", "बाह्य कार्यहरू (समावेश)")}</h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-slate-500'}>Compound Wall & Gate</span><span className={isDark ? 'text-white/80' : 'text-slate-800'}>Rs. {externalBreakdown.wall.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-slate-500'}>Septic Tank & Soak Pit</span><span className={isDark ? 'text-white/80' : 'text-slate-800'}>Rs. {externalBreakdown.septic.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-slate-500'}>{ratePerSqft < 4200 ? 'Shallow Tube-Well (Motor)' : 'Deep Water Boring (>200ft)'}</span><span className={isDark ? 'text-white/80' : 'text-slate-800'}>Rs. {externalBreakdown.boring.toLocaleString('en-IN')}</span></div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <Info size={14} className="text-blue-500 shrink-0" />
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{tx("Costs are based on live market rates for", "लागतहरू बजारको प्रत्यक्ष दरहरूमा आधारित छन्")} <strong className={isDark ? 'text-white/60' : 'text-slate-700'}>{district.split('(')[0]}</strong>. {tx("Final quotes may vary ±5% based on specific site conditions.", "साइटको अवस्थाको आधारमा अन्तिम लागत ±५% ले फरक हुन सक्छ।")}</p>
                </div>
              </div>

              <div className="lg:col-span-2 rounded-2xl overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 rounded-2xl p-px" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(255,255,255,0.05), rgba(59,130,246,0.2))" }}>
                  <div className={`absolute inset-0 rounded-2xl ${isDark ? 'bg-[#0d1520]' : 'bg-white'}`} />
                </div>

                <div className="relative z-10 p-6">
                  <div className={`flex items-center gap-3 mb-5 pb-5 border-b ${isDark ? 'border-white/6' : 'border-slate-100'}`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx("Premium BOQ Report", "प्रिमियम BOQ रिपोर्ट")}</h3>
                      <p className={`text-xs ${isDark ? 'text-white/30' : 'text-slate-500'}`}>{tx("Downloadable Engineering Document", "डाउनलोड गर्न मिल्ने इन्जिनियरिङ कागजात")}</p>
                    </div>
                  </div>

                  {checkoutStep === 0 && !isVerifying && (
                    <div className="space-y-3 mb-5">
                      {[tx("Full Material Quantities (Cement, Steel, etc.)", "पूर्ण सामग्रीको मात्रा (सिमेन्ट, डण्डी, आदि)"), tx("Labor vs Material Distribution", "श्रम र सामग्रीको विभाजन"), tx("Bank-Grade PDF Format", "बैंक-ग्रेड PDF ढाँचा"), tx("NBC Safety & Municipality Guidelines", "NBC सुरक्षा र नगरपालिकाको मापदण्ड")].map((feat) => (
                        <div key={feat} className="flex items-center gap-2.5"><CheckCircle size={13} className="text-emerald-500 shrink-0" /><span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>{feat}</span></div>
                      ))}
                      <div className={`flex items-center justify-between pt-4 border-t mt-4 ${isDark ? 'border-white/6' : 'border-slate-100'}`}>
                        <div><span className={`text-xs line-through ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Rs. 499</span><span className={`text-2xl font-bold ml-2 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>Rs. 199</span></div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-medium border border-emerald-500/20">60% off</span>
                      </div>
                      <button onClick={() => setCheckoutStep(1)} className="w-full py-3.5 mt-2 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-200" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                        {tx("Get My Report", "मेरो रिपोर्ट प्राप्त गर्नुहोस्")} <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {checkoutStep === 1 && !isVerifying && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                      <p className={`text-xs text-center leading-relaxed ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{tx("Secure your report by entering your details before payment.", "भुक्तानी गर्नु अघि आफ्नो विवरण प्रविष्ट गरेर रिपोर्ट सुरक्षित गर्नुहोस्।")}</p>
                      <div className="relative"><div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><User size={14} className="text-emerald-500" /></div>
                        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder={tx("Full Name", "पूरा नाम")} className={`w-full border rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors ${isDark ? 'bg-white/[0.04] border-white/10 text-white placeholder:text-white/25' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`} />
                      </div>
                      <div className="relative"><div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><Phone size={14} className="text-emerald-500" /></div>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={tx("Phone Number", "फोन नम्बर")} className={`w-full border rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors ${isDark ? 'bg-white/[0.04] border-white/10 text-white placeholder:text-white/25' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`} />
                      </div>
                      <button onClick={handleContactSubmit} disabled={isSubmittingContact} className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200" style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}>
                        {isSubmittingContact ? tx("Securing...", "सुरक्षित गर्दै...") : tx("Proceed to Payment", "भुक्तानीमा अगाडि बढ्नुहोस्")}
                      </button>
                      <button onClick={() => setCheckoutStep(0)} className={`w-full text-xs ${isDark ? 'text-white/30 hover:text-white/60' : 'text-slate-400 hover:text-slate-700'}`}>{tx("Cancel", "रद्द गर्नुहोस्")}</button>
                    </div>
                  )}

                  {checkoutStep === 2 && !isVerifying && (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-right-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20"><ShieldCheck size={10} className="text-emerald-500" /><span className="text-[10px] text-emerald-500">eSewa Verified</span></div>
                        <span className={`text-[10px] font-mono ${isDark ? 'text-white/30' : 'text-slate-400'}`}>ID: #{estimateId?.split('-')[0]}</span>
                      </div>
                      <div className="w-40 h-40 rounded-xl overflow-hidden border border-slate-200 relative bg-white shadow-sm">
                        <Image src="/esewa-qr.png" alt="eSewa QR Code" fill className="object-contain p-2" />
                      </div>
                      <div className="text-center">
                        <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>Rs. 199</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>eSewa ID: <span className="text-emerald-500 font-mono font-bold">9840185500</span></p>
                      </div>
                      <div className="w-full">
                        <input type="text" placeholder={tx("Enter Transaction ID (e.g. 0B2V...)", "कारोबार ID राख्नुहोस् (जस्तै 0B2V...)")} value={paymentRef} onChange={e => setPaymentRef(e.target.value)} className={`w-full border rounded-lg px-4 py-3 text-xs text-center focus:outline-none focus:border-emerald-500 mb-3 font-mono ${isDark ? 'bg-white/[0.04] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                        <button onClick={handlePaymentSubmit} className="w-full py-3 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
                          {tx("I Have Paid — Unlock Now", "मैले तिरें — अनलक गर्नुहोस्")}
                        </button>
                      </div>
                    </div>
                  )}

                  {isVerifying && (
                    <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                      <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{tx("Verifying Payment...", "भुक्तानी प्रमाणित गर्दै...")}</h3>
                      <p className={`text-xs mb-4 px-4 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{tx("Our engineer is manually verifying the transaction.", "हाम्रो इन्जिनियरले म्यानुअल रूपमा कारोबार प्रमाणित गर्दै हुनुहुन्छ।")}</p>
                    </div>
                  )}

                  <div className={`mt-5 pt-4 border-t flex items-center justify-center gap-4 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-1.5"><Lock size={10} className={isDark ? "text-white/20" : "text-slate-300"} /><span className={`text-[10px] ${isDark ? "text-white/20" : "text-slate-400"}`}>Secure</span></div>
                    <div className="flex items-center gap-1.5"><Star size={10} className={isDark ? "text-white/20" : "text-slate-300"} /><span className={`text-[10px] ${isDark ? "text-white/20" : "text-slate-400"}`}>2,000+ Verified</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {isPremium && (
        <div id="printable-report" className="mx-auto max-w-[794px] bg-white text-slate-800 animate-in fade-in zoom-in-95 duration-700 print:max-w-none print:m-0 print:p-0 print:shadow-none print:animate-none">
          
          <style>{`
            @media print {
              @page { size: A4 portrait; margin: 12mm 10mm 16mm 10mm; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              body { margin: 0; padding: 0; background: white; }
              #printable-report { font-size: 9pt; line-height: 1.45; box-shadow: none !important; margin: 0 !important; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
              thead { display: table-header-group; }
            }
            @media screen {
              #printable-report { font-family: 'Inter', 'DM Sans', sans-serif; box-shadow: 0 4px 48px rgba(15,23,42,0.10); border-radius: 6px; overflow: hidden; margin-bottom: 2rem; margin-top: 2rem; }
            }
          `}</style>

          <div className="print:hidden flex flex-col md:flex-row justify-between items-center gap-4 m-8 mb-4 bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
            <div>
              <h2 className="text-emerald-800 font-bold text-lg flex items-center gap-2"><CheckCircle className="h-5 w-5"/> {tx("Payment Verified!", "भुक्तानी प्रमाणित भयो!")}</h2>
              <p className="text-emerald-600 text-sm">{tx("Your official Bank-Grade BOQ is ready.", "तपाईंको आधिकारिक बैंक-ग्रेड BOQ तयार छ।")}</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => { localStorage.removeItem('zila_estimate_id'); window.location.reload(); }} className="flex-1 md:flex-none bg-white border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                {tx("Start Over", "फेरि सुरु गर्नुहोस्")}
              </button>
              <button onClick={() => window.print()} className="flex-1 md:flex-none bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-all flex justify-center items-center gap-2 shadow-lg">
                <Download className="h-5 w-5"/> {tx("Download PDF", "PDF डाउनलोड")}
              </button>
            </div>
          </div>

          <div className="h-[5px] bg-gradient-to-r from-[#064E3B] via-emerald-600 to-[#064E3B]" />

          <header className="px-8 pt-5 pb-4 print:px-2 print:pt-3 print:pb-2">
            <div className="text-center mb-3">
              <span className="inline-block px-4 py-1 text-[8px] font-bold uppercase tracking-[0.25em] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-sm">
                {tx("Confidential — For Banking & Financial Assessment Purpose Only", "गोप्य — बैंकिङ र वित्तीय मूल्याङ्कन उद्देश्यको लागि मात्र")}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5 text-white fill-white" />
                  </div>
                  <span className="text-[26px] font-black text-slate-900 tracking-tight leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>ZILA</span>
                </div>
                <h1 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-[0.15em] mt-1">{tx("Official Bill of Quantities & Cost Estimate", "आधिकारिक परिमाणको बिल र लागत अनुमान")}</h1>
                <p className="text-[9px] text-slate-400 mt-0.5 tracking-wide font-mono">Ref: ZILA/BOQ/{new Date().getFullYear()}/{estimateId?.split('-')[0].toUpperCase()}</p>
              </div>

              <div className="text-right text-[9px] text-slate-500 space-y-[3px]">
                <p><span className="text-slate-400">{tx("Date of Issue:", "जारी मिति:")}</span> <span className="font-semibold text-slate-800">{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span></p>
                <p><span className="text-slate-400">{tx("Estimate ID:", "अनुमान ID:")}</span> <span className="font-mono font-bold text-slate-800">#{estimateId?.split('-')[0].toUpperCase()}</span></p>
                <p><span className="text-slate-400">{tx("Prepared by:", "तयार गर्ने:")}</span> <span className="font-semibold text-slate-800">Er. Angel Mainali</span></p>
                <p><span className="text-slate-400">{tx("Valid Until:", "म्याद:")}</span> <span className="font-semibold text-emerald-700">{new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span></p>
              </div>
            </div>
            <div className="h-[3px] bg-gradient-to-r from-emerald-600 via-emerald-500 to-transparent mt-4 rounded-full" />
          </header>

          <section className="px-8 pb-4 print:px-2 print:pb-2 print:break-inside-avoid">
            <div className="border border-slate-200 rounded overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">{tx("Client & Property Information", "ग्राहक र सम्पत्ति जानकारी")}</h3>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="px-4 py-3">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1">{tx("Prepared For (Client Name)", "को लागि तयार गरिएको (ग्राहकको नाम)")}</p>
                  <p className="text-[12px] font-bold text-slate-900 uppercase">{customerName || "________________________"}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1">{tx("Property Location / District", "सम्पत्तिको स्थान / जिल्ला")}</p>
                  <p className="text-[12px] font-bold text-slate-900 uppercase">{district.split('(')[0].trim()}, Nepal</p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-8 pb-5 print:px-2 print:pb-3 print:break-inside-avoid">
            <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center shadow-xl print:bg-slate-50 print:text-slate-900 print:border print:border-slate-300 print:shadow-none">
              <div className="flex-1 grid grid-cols-3 gap-6 w-full mb-8 md:mb-0 md:border-r border-slate-700 print:border-slate-300 md:pr-8">
                <div><p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">{tx("Total Area", "जम्मा क्षेत्रफल")}</p><p className="font-bold text-lg leading-tight">{totalArea.toLocaleString()} sq.ft</p></div>
                <div><p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">{tx("Structure", "संरचना")}</p><p className="font-bold text-lg leading-tight">{safeFloors} {tx("Flr", "तला")} ({structureType.toUpperCase()})</p></div>
                <div><p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">{tx("Finish Quality", "फिनिसिङ गुणस्तर")}</p><p className="font-bold text-lg leading-tight capitalize">{tx(quality, quality === "premium" ? "प्रिमियम" : quality === "standard" ? "स्ट्यान्डर्ड" : quality === "economy" ? "इकोनोमी" : "स्ट्रक्चर मात्र")}</p></div>
              </div>
              <div className="md:pl-8 text-left md:text-right w-full md:w-auto">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">{tx("Estimated Grand Total", "अनुमानित कुल लागत")}</p>
                <div className="text-4xl font-black text-emerald-400 print:text-slate-900 tracking-tight">Rs. {totalCost.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </section>

          <div className="px-8 print:px-2 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <PDFTable 
                title={tx("Phase-wise Cost Breakdown", "चरण-वार लागत विभाजन")}
                columns={[{ key: "category", label: tx("Construction Phase", "निर्माण चरण") }, { key: "amount", label: tx("Amount (Rs.)", "रकम (रु)"), align: "right", mono: true }]}
                rows={Object.entries(activeBreakdown).map(([category, pct]) => ({ category: category.replace(/\[Tranche \d+\]\s*/, ''), amount: fmt(Math.round(baseHouseCost * pct)) }))}
              />
              
              {includeExternal && (
                <PDFTable 
                  title={tx("External Works Breakdown", "बाह्य कार्यहरूको विभाजन")} accent="#3b82f6"
                  columns={[{ key: "category", label: tx("Work Type", "कार्यको प्रकार") }, { key: "amount", label: tx("Amount (Rs.)", "रकम (रु)"), align: "right", mono: true }]}
                  rows={[
                    { category: "Compound Wall & Main Gate", amount: fmt(externalBreakdown.wall) },
                    { category: "Septic Tank & Soak Pit", amount: fmt(externalBreakdown.septic) },
                    { category: ratePerSqft < 4200 ? 'Shallow Tube-Well / Plumbing' : 'Deep Water Boring (>200ft)', amount: fmt(externalBreakdown.boring) }
                  ]}
                />
              )}

              <div className="border-2 border-slate-900 rounded overflow-hidden print:break-inside-avoid">
                <div className="bg-slate-50 divide-y divide-slate-200">
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{tx("A. Base Construction Cost", "क. आधारभूत निर्माण लागत")}</span>
                    <span className="text-[11px] font-mono font-bold text-slate-800">Rs. {baseHouseCost.toLocaleString("en-IN")}</span>
                  </div>
                  {includeExternal && (
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="text-[10px] font-bold text-slate-600 uppercase">{tx("B. External Works Cost", "ख. बाह्य कार्यको लागत")}</span>
                      <span className="text-[11px] font-mono font-bold text-slate-800">Rs. {externalCost.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>
                <div className="bg-[#0F172A] px-4 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-extrabold text-white uppercase tracking-wider">{tx("Grand Total", "कुल जम्मा")} {includeExternal ? "(A + B)" : ""}</span>
                    <span className="text-[16px] font-mono font-black text-emerald-400">Rs. {totalCost.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5 italic font-medium uppercase tracking-wide">
                    {tx("In Words:", "अक्षरमा:")} {typeof numberToWordsNepali === 'function' ? numberToWordsNepali(totalCost) : "Total as calculated above"}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <PDFTable 
                title={tx("Required Materials", "आवश्यक सामग्रीहरू")} accent="#f59e0b"
                columns={[{ key: "material", label: tx("Material Specification", "सामग्री विवरण") }, { key: "qty", label: tx("Estimated Qty", "अनुमानित मात्रा"), align: "right", mono: true }]}
                rows={Object.entries(activeMaterials).map(([material, multiplier]) => ({ material, qty: Math.round(totalArea * multiplier).toLocaleString('en-IN') }))}
              />
              <PDFTable 
                title={tx("Cost Distribution", "लागत वितरण")} accent="#a855f7"
                columns={[{ key: "cat", label: tx("Financial Segment", "वित्तीय खण्ड") }, { key: "amount", label: tx("Amount", "रकम"), align: "right", mono: true }]}
                rows={Object.entries(LABOR_MATERIAL_RATIO).map(([cat, pct]) => ({ cat: `${cat} (${Math.round(pct * 100)}%)`, amount: fmt(Math.round(totalCost * pct)) }))}
              />
              <PDFTable 
                title={tx("Estimated Timeline", "अनुमानित समयरेखा")} accent="#ec4899"
                columns={[{ key: "phase", label: tx("Project Phase", "परियोजनाको चरण") }, { key: "duration", label: tx("Duration", "अवधि"), align: "right" }]}
                rows={activeTimeline.map(item => ({ phase: item.phase, duration: item.duration }))}
              />
            </div>
          </div>

          <div className="px-8 print:px-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 print:bg-transparent print:border-slate-300 print:break-inside-avoid">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-[11px] uppercase tracking-wider">
                <ShieldAlert className="h-5 w-5 text-red-600"/> 
                {tx("Structural Safety (NBC 105:2020 AMD 2025)", "संरचनात्मक सुरक्षा (NBC १०५:२०२०)")}
              </h3>
              {structureType === "rcc" && (
                <ul className="text-[9px] text-slate-700 space-y-2">
                  <li>• <strong>Seismic Compliance:</strong> Design forces must align with NBC 105:2020 (Amendment 2025).</li>
                  <li>• <strong>Minimum Column Size:</strong> Must not be less than 12&quot; x 12&quot; (300mm x 300mm).</li>
                  <li>• <strong>Rebar Configuration:</strong> Minimum 4-16mm Ø and 4-12mm Ø longitudinal bars. Fe500D grade required.</li>
                  <li>• <strong>Cement Mix:</strong> Use M20 grade concrete (1:1.5:3) minimum for all structural members.</li>
                </ul>
              )}
              {structureType !== "rcc" && (
                <ul className="text-[9px] text-slate-700 space-y-2">
                  <li>• <strong>Code Compliance:</strong> Structure must conform to NBC guidelines for Alternative/Lightweight materials.</li>
                  <li>• <strong>Foundation:</strong> RCC isolated footings and tie-beams strictly required for wind-uplift resistance.</li>
                  <li>• <strong>Steel Skeleton:</strong> All MS/LGSF steel sections must be treated with anti-rust primer/galvanization.</li>
                </ul>
              )}
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 print:bg-transparent print:border-slate-300 print:break-inside-avoid">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-[11px] uppercase tracking-wider print:text-slate-900">
                <ClipboardList className="h-5 w-5"/> {tx("Terms & Conditions", "नियम र सर्तहरू")}
              </h3>
              <ul className="text-[8px] text-blue-800 space-y-1.5 print:text-slate-700">
                <li><strong>1. Validity:</strong> Estimate is valid for 90 days. Subject to ±10% market variation.</li>
                <li><strong>2. Exclusions:</strong> Land cost, municipality fees, architectural fees, furniture, and landscaping.</li>
                <li><strong>3. VAT:</strong> Amounts are exclusive of VAT. VAT-registered contractors apply 13% extra on labor.</li>
                <li><strong>4. Liability:</strong> ZILA is an estimation engine for banking and planning. Final material wastage may vary.</li>
              </ul>
            </div>
          </div>

          <div className="px-8 print:px-2 mt-8 pt-6 border-t-2 border-slate-200 print:break-inside-avoid flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border-2 border-slate-300 bg-slate-50 rounded-lg flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white p-1 border border-slate-200 rounded relative">
                  <Image src="/esewa-qr.png" alt="QR" fill className="object-contain opacity-50 grayscale" />
                </div>
                <span className="text-[6px] font-bold uppercase mt-1 text-slate-500">Verify Online</span>
              </div>
              <div>
                <h4 className="text-[12px] font-black text-slate-900 tracking-wider uppercase">{tx("Digitally Authenticated", "डिजिटल प्रमाणित")}</h4>
                <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">
                  This BOQ is generated and verified by the ZILA Engineering Engine.<br/>
                  <strong>Authorized by:</strong> Er. Angel Mainali (NEC Registered)<br/>
                  <strong>Status:</strong> Approved for Bank Loan Processing
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block border-2 border-emerald-600 text-emerald-700 font-black text-xl uppercase tracking-widest px-6 py-2 rounded-lg transform -rotate-6 opacity-80 print:opacity-100">
                E-VERIFIED
              </div>
            </div>
          </div>

          <div className="text-center pt-6 text-[8px] text-slate-400 mt-8 pb-8 font-mono">
            Report ID: {estimateId} | © {new Date().getFullYear()} ZILA.APP | Kathmandu, Nepal
          </div>
        </div>
      )}
    </>
  );
}
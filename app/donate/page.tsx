"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Shield, Globe, ArrowUpRight, Star, Users, FileText, Mail, Cpu, MapPin, Award, ChevronRight, Sun, Moon, Languages } from "lucide-react";

function StatTile({ value, label, icon: Icon, color, isDark }: { value: string, label: string, icon: React.ElementType, color: string, isDark: boolean }) {
  return (
    <div className={`flex flex-col gap-1 p-5 rounded-2xl border transition-colors ${isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-slate-200 bg-white shadow-sm'}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon size={16} style={{ color }} />
        <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: isDark ? `${color}88` : color }}>{label}</span>
      </div>
      <span className={`text-3xl font-extrabold leading-none ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>{value}</span>
    </div>
  );
}

function TimelineItem({ year, event, detail, active, isDark }: { year: string, event: string, detail: string, active: boolean, isDark: boolean }) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full shrink-0 mt-1 transition-all duration-300 ${active ? "shadow-lg" : isDark ? "bg-white/10" : "bg-slate-300"}`} style={active ? { background: "#10b981", boxShadow: "0 0 12px #10b981" } : {}} />
        <div className={`w-px flex-1 mt-2 ${isDark ? 'bg-white/5' : 'bg-slate-200'}`} />
      </div>
      <div className="pb-8">
        <span className={`text-xs font-mono ${isDark ? 'text-white/30' : 'text-slate-400'}`}>{year}</span>
        <h4 className={`font-semibold text-sm mt-0.5 ${active ? (isDark ? "text-white" : "text-slate-900") : (isDark ? "text-white/60" : "text-slate-600")}`}>{event}</h4>
        <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-white/30' : 'text-slate-500'}`}>{detail}</p>
      </div>
    </div>
  );
}

function DonationCard({ title, subtitle, badge, cta, action, isDark, accent, children, featured }: { title: string, subtitle: string, badge: React.ReactNode, cta: string, action: () => void, isDark: boolean, accent: string, children: React.ReactNode, featured: boolean }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${featured ? "" : (isDark ? "border border-white/[0.07]" : "border border-slate-200")}`} style={featured ? { boxShadow: `0 0 0 1px ${accent}44, 0 25px 50px ${accent}15` } : {}}>
      {featured && <div className="absolute inset-0 rounded-2xl" style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}18 0%, transparent 70%)` }} />}
      <div className={`absolute inset-0 ${!featured ? (isDark ? "bg-white/[0.02]" : "bg-white") : (isDark ? "bg-slate-950/60 backdrop-blur-xl" : "bg-emerald-50/90 backdrop-blur-xl")}`} />
      <div className="relative z-10 p-7">
        {badge && <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-5" style={{ borderColor: `${accent}44`, color: accent, background: `${accent}10` }}>{badge}</div>}
        <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h3>
        <p className={`text-sm mb-5 leading-relaxed ${isDark ? 'text-white/40' : 'text-slate-600'}`}>{subtitle}</p>
        {children}
        <button onClick={action} className="group mt-6 w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" style={{ background: `linear-gradient(135deg, ${accent}dd, ${accent})` }}>
          {cta}
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}

export default function DonatePage() {
  // Light mode is default
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<"en" | "ne">("en");

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const tx = (en: string, ne: string) => lang === "en" ? en : ne;

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 ${isDark ? "bg-[#060a10]" : "bg-slate-50"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.06] blur-[140px]" style={{ background: "radial-gradient(circle, #10b981, #0d9488)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[120px]" style={{ background: "#3b82f6" }} />
        <div className={`absolute inset-0 ${isDark ? 'opacity-[0.025]' : 'opacity-[0.05]'}`} style={{ backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        <nav className="flex items-center justify-between mb-24">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow">
              <Zap size={15} className="text-white fill-white" />
            </div>
            <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>ZILA</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setLang(lang === 'en' ? 'ne' : 'en')} className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-colors ${isDark ? 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                <Languages size={14} /> {lang === 'en' ? 'नेपाली' : 'English'}
              </button>
              <button onClick={() => setIsDark(!isDark)} className={`p-1.5 rounded-md transition-colors ${isDark ? 'bg-white/10 text-white/70 hover:text-white' : 'bg-slate-200 text-slate-700 hover:text-slate-900'}`}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
            <Link href="/" className={`flex items-center gap-1.5 text-xs transition-colors ${isDark ? 'text-white/30 hover:text-white/70' : 'text-slate-500 hover:text-slate-800'}`}>
              <ChevronRight size={12} className="rotate-180" />
              {tx("Back to Estimator", "क्याल्कुलेटरमा फर्कनुहोस्")}
            </Link>
          </div>
        </nav>

        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-500 font-medium">{tx("Building in public · Kathmandu, Nepal", "सार्वजनिक निर्माण · काठमाडौं, नेपाल")}</span>
          </div>
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>
            {tx("The engineer", "ZILA पछाडिको")}<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)" }}>{tx("behind ZILA.", "इन्जिनियर।")}</span>
          </h1>
          <p className={`text-lg max-w-lg mx-auto font-light leading-relaxed ${isDark ? 'text-white/40' : 'text-slate-600'}`}>
            {tx("Fighting contractor fraud with code. Building the tools I wish existed when my family was quoted 3× the real cost.", "कोडको माध्यमबाट ठेकेदारको ठगीसँग लड्दै। मेरो परिवारलाई वास्तविक लागतभन्दा ३ गुणा बढी भनिंदा मैले खोजेको उपकरण आफै बनाउँदैछु।")}
          </p>
        </div>

        <div className="relative rounded-3xl border overflow-hidden mb-16 p-px" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(255,255,255,0.03), rgba(59,130,246,0.15))", borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
          <div className={`rounded-3xl p-8 md:p-10 ${isDark ? 'bg-slate-950/80 backdrop-blur-xl' : 'bg-white backdrop-blur-xl'}`}>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 relative">
                  <Image src="/me.jpg" alt="Er. Angel Mainali" fill className="object-cover" priority />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 shadow-lg shadow-emerald-400/40 ${isDark ? 'border-slate-950' : 'border-white'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>Er. Angel Mainali</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs border border-blue-500/30 text-blue-500 bg-blue-500/10">B.E. Civil</span>
                </div>
                <div className={`flex items-center gap-2 text-xs mb-4 ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
                  <MapPin size={11} /><span>{tx("Kathmandu Valley, Nepal", "काठमाडौं उपत्यका, नेपाल")}</span><span className="opacity-40">·</span><span>{tx("Age 25", "२५ वर्ष")}</span>
                </div>
                <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-white/50' : 'text-slate-700'}`}>
                  {tx("I'm a registered civil engineer specializing in hydropower projects. After watching my family get deceived by inflated contractor quotes with no way to verify costs, I built ZILA — Nepal's most detailed preliminary construction cost estimator — so that ordinary families can know what their home actually costs before pouring their life savings into it.", "म जलविद्युत परियोजनाहरूमा विशेषज्ञता हासिल गरेको दर्ता सिभिल इन्जिनियर हुँ। मेरो परिवारलाई ठेकेदारले दिएको महँगो कोटेशन हेरेपछि र लागत प्रमाणित गर्ने कुनै उपाय नभएपछि, मैले ZILA बनाएँ — नेपालको सबैभन्दा विस्तृत प्रारम्भिक निर्माण लागत अनुमानक — ताकि सर्वसाधारण परिवारहरूले आफ्नो जीवनभरको बचत ठेल्नु अघि नै घरको वास्तविक लागत थाहा पाउन सकून्।")}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  {[{ icon: Award, label: tx("NEC Registered Engineer", "NEC दर्ता इन्जिनियर") }, { icon: Cpu, label: tx("Indie Builder", "इन्डी बिल्डर") }, { icon: Globe, label: tx("Open to Collaboration", "सहकार्यको लागि खुला") }].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5"><Icon size={12} className="text-emerald-500" /><span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{label}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20">
          <StatTile isDark={isDark} value="50" label={tx("Districts", "जिल्लाहरू")} icon={MapPin} color="#10b981" />
          <StatTile isDark={isDark} value="2K+" label={tx("Reports", "रिपोर्टहरू")} icon={FileText} color="#3b82f6" />
          <StatTile isDark={isDark} value="100%" label={tx("Transparent", "पारदर्शी")} icon={Shield} color="#a855f7" />
          <StatTile isDark={isDark} value="1" label={tx("Engineer", "इन्जिनियर")} icon={Users} color="#f59e0b" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-4">{tx("The Mission", "अभियान")}</p>
            <h2 className={`text-3xl font-bold mb-5 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>{tx("Know your numbers before you pour your savings.", "पैसा ठेल्नु अघि आफ्नो लागत जान्नुहोस्।")}</h2>
            <div className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-white/45' : 'text-slate-700'}`}>
              <p>{tx("In Nepal, the construction industry runs on information asymmetry. Contractors quote wildly inflated prices because homeowners have no benchmark. A Rs. 60 lakh house becomes Rs. 1 crore on paper.", "नेपालमा निर्माण उद्योग सूचनाको असमानतामा चल्छ। घरधनीहरूसँग कुनै मापदण्ड नभएकोले ठेकेदारहरूले धेरै महँगो मूल्य बताउँछन्। ६० लाखको घर कागजमा १ करोड हुन्छ।")}</p>
              <p>{tx("ZILA gives you a detailed Preliminary BOQ — a phase-by-phase breakdown of what your house should actually cost, built on real district-level material and labor rates, and enforcing NBC 105:2025 seismic standards. Walk into your contractor meeting informed.", "ZILA ले तपाईंलाई विस्तृत प्रारम्भिक BOQ दिन्छ — तपाईंको घर वास्तवमा कति पर्नु पर्छ भन्ने चरण-वार विभाजन, वास्तविक जिल्ला-स्तरीय सामग्री र श्रम दरहरूमा आधारित। ठेकेदारसँग भेट्न जानु अघि तयारी गर्नुहोस्।")}</p>
              <p>{tx("Every Rs. 199 report funds server costs, data verification, and keeps this tool free to explore. You're not buying software — you're funding transparency for every Nepali family building a home.", "हरेक १९९ रुपैयाँको रिपोर्टले सर्भर लागत र डाटा प्रमाणीकरणमा मद्दत गर्छ। तपाईं सफ्टवेयर किनिरहनु भएको छैन — घर बनाउने हरेक नेपाली परिवारको लागि पारदर्शितालाई आर्थिक सहयोग गर्दै हुनुहुन्छ।")}</p>
            </div>
          </div>
          <div>
            <p className={`text-xs font-semibold tracking-widest uppercase mb-4 ${isDark ? 'text-white/20' : 'text-slate-400'}`}>{tx("Journey", "यात्रा")}</p>
            <TimelineItem isDark={isDark} year="2020" event={tx("Started Civil Engineering career", "सिभिल इन्जिनियरिङ क्यारियर सुरु")} detail={tx("Joined hydropower sector, worked on penstock design and anchor block analysis.", "जलविद्युत क्षेत्रमा आबद्ध, पेनस्टक डिजाइन र एन्कर ब्लक विश्लेषणमा काम।")} active={false} />
            <TimelineItem isDark={isDark} year="2023" event={tx("Witnessed contractor fraud firsthand", "ठेकेदारको ठगी प्रत्यक्ष देखियो")} detail={tx("Family received wildly inflated construction quotes. Decided to build a solution.", "परिवारले धेरै महँगो निर्माण कोटेशन प्राप्त गर्यो। समाधान बनाउने निर्णय।")} active={false} />
            <TimelineItem isDark={isDark} year="2025" event={tx("Built ZILA from scratch", "ZILA को निर्माण")} detail={tx("Learned Next.js, built a 50-district preliminary cost database, launched first version.", "Next.js सिकेर ५० जिल्लाको प्रारम्भिक लागत डाटाबेस बनाएँ।")} active={true} />
            <TimelineItem isDark={isDark} year="2026 →" event={tx("Improving data, expanding districts", "डाटा सुधार, जिल्लाहरू विस्तार")} detail={tx("Continuously improving the pricing matrix with field-verified data from active hydropower and infrastructure projects.", "सक्रिय जलविद्युत र पूर्वाधार परियोजनाहरूबाट क्षेत्र-प्रमाणित डाटाले मूल्य म्याट्रिक्स निरन्तर सुधार।")} active={false} />
          </div>
        </div>

        <div className="mb-24">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-3">{tx("Support the mission", "अभियानलाई समर्थन गर्नुहोस्")}</p>
            <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>{tx("Keep ZILA alive & free.", "ZILA लाई जीवित र नि:शुल्क राख्नुहोस्।")}</h2>
            <p className={`text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-white/35' : 'text-slate-600'}`}>
              {tx("ZILA's core estimator is free to use forever. Your support covers server costs, data updates, and the engineering hours that go into keeping the numbers accurate.", "ZILA को मूल अनुमानक सधैं नि:शुल्क छ। तपाईंको समर्थनले सर्भर लागत, डाटा अपडेट र सङ्ख्याहरू सटीक राख्न लाग्ने इन्जिनियरिङ समय कभर गर्छ।")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DonationCard isDark={isDark} title={tx("Support Internationally", "अन्तर्राष्ट्रिय समर्थन")} subtitle={tx("Monthly or one-time support for those outside Nepal. Cancel anytime.", "नेपाल बाहिरका लागि मासिक वा एक पटकको समर्थन।")} badge="🌍 International · USD" cta={tx("Support on Patreon", "Patreon मा समर्थन गर्नुहोस्")} action={() => window.open('https://patreon.com/angelmainali', '_blank')} accent="#f96854" featured={false}>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[["$2", tx("Coffee", "कफी")], ["$5", tx("Lattes", "लाटे")], ["$10", tx("Fuel", "इन्धन")]].map(([amt, label]) => (
                  <div key={amt} className={`flex flex-col items-center gap-1 p-3 rounded-xl border ${isDark ? 'border-white/8 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'}`}>
                    <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: "'Syne', sans-serif" }}>{amt}</span>
                    <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-slate-500'}`}>{label}</span>
                  </div>
                ))}
              </div>
            </DonationCard>
            <DonationCard isDark={isDark} title={tx("Support from Nepal", "नेपालबाट समर्थन")} subtitle={tx("Direct eSewa or bank transfer. Every rupee goes to building better, more accurate tools.", "सिधै eSewa वा बैंक ट्रान्सफर। हरेक रुपैयाँले अझ सटीक उपकरण बनाउन मद्दत गर्छ।")} badge={<><Star size={10} className="fill-current" /> Local · Nepali Rupees</>} cta={tx("Use these details directly in your app", "तपाईंको एपमा यी विवरणहरू प्रयोग गर्नुहोस्")} action={() => alert(tx('Open your eSewa or Bank app and use these details.', 'आफ्नो eSewa वा बैंक एप खोल्नुहोस् र यी विवरणहरू प्रयोग गर्नुहोस्।'))} accent="#10b981" featured={true}>
              <div className="space-y-2.5 mb-2">
                {[{ label: "eSewa ID", value: "9840185500", icon: "📱" }, { label: "Bank", value: "NIC Asia · Kathmandu", icon: "🏦" }, { label: "A/C Number", value: "2825750952307001", icon: "💳" }].map(({ label, value, icon }) => (
                  <div key={label} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${isDark ? 'border-white/6 bg-white/[0.03]' : 'border-emerald-500/10 bg-white'}`}>
                    <span className={`text-xs flex items-center gap-2 ${isDark ? 'text-white/40' : 'text-slate-500'}`}><span>{icon}</span>{label}</span>
                    <span className={`text-xs font-mono ${isDark ? 'text-white/70' : 'text-slate-800 font-bold'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </DonationCard>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #064e3b, #065f46, #0d9488)" }} />
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)" }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{tx("Have a construction project in mind?", "कुनै निर्माण परियोजना दिमागमा छ?")}</h3>
              <p className="text-sm text-emerald-100/80">{tx("I consult on structural engineering, hydropower design, and construction cost planning.", "म स्ट्रक्चरल इन्जिनियरिङ, जलविद्युत डिजाइन र निर्माण लागत योजनामा परामर्श दिन्छु।")}</p>
            </div>
            <a href="mailto:er.angel.mainali@gmail.com" className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">
              <Mail size={15} /> {tx("Get in touch", "सम्पर्क गर्नुहोस्")}
            </a>
          </div>
        </div>

        <div className={`mt-16 pt-8 border-t flex items-center justify-between flex-wrap gap-4 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
          <p className={`text-xs ${isDark ? 'text-white/20' : 'text-slate-400'}`}>© {new Date().getFullYear()} ZILA · Built with ♥ in Kathmandu</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className={`text-xs transition-colors ${isDark ? 'text-white/20 hover:text-white/50' : 'text-slate-400 hover:text-slate-700'}`}>Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
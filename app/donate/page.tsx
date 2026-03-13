"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Zap, Shield, Globe, ArrowUpRight, Star, Users, FileText, Mail, Cpu, MapPin, Award, ChevronRight } from "lucide-react";

function StatTile({ value, label, icon: Icon, color }: { value: string, label: string, icon: React.ElementType, color: string }) {
  return (
    <div className="flex flex-col gap-1 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-center justify-between mb-2">
        <Icon size={16} style={{ color }} />
        <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: `${color}88` }}>{label}</span>
      </div>
      <span className="text-3xl font-extrabold text-white leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</span>
    </div>
  );
}

function TimelineItem({ year, event, detail, active }: { year: string, event: string, detail: string, active: boolean }) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full shrink-0 mt-1 transition-all duration-300 ${active ? "shadow-lg" : "bg-white/10"}`} style={active ? { background: "#10b981", boxShadow: "0 0 12px #10b981" } : {}} />
        <div className="w-px flex-1 bg-white/5 mt-2" />
      </div>
      <div className="pb-8">
        <span className="text-xs font-mono text-white/30">{year}</span>
        <h4 className={`font-semibold text-sm mt-0.5 ${active ? "text-white" : "text-white/60"}`}>{event}</h4>
        <p className="text-xs text-white/30 mt-1 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

function DonationCard({ title, subtitle, badge, cta, href, accent, children, featured }: { title: string, subtitle: string, badge: React.ReactNode, cta: string, href: string, accent: string, children: React.ReactNode, featured: boolean }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${featured ? "" : "border border-white/[0.07]"}`} style={featured ? { boxShadow: `0 0 0 1px ${accent}44, 0 25px 50px ${accent}15` } : {}}>
      {featured && <div className="absolute inset-0 rounded-2xl" style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}18 0%, transparent 70%)` }} />}
      <div className={`absolute inset-0 ${!featured ? "bg-white/[0.02]" : "bg-slate-950/60 backdrop-blur-xl"}`} />
      <div className="relative z-10 p-7">
        {badge && <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-5" style={{ borderColor: `${accent}44`, color: accent, background: `${accent}10` }}>{badge}</div>}
        <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h3>
        <p className="text-sm text-white/40 mb-5 leading-relaxed">{subtitle}</p>
        {children}
        <a href={href} target="_blank" rel="noopener noreferrer" className="group mt-6 w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" style={{ background: `linear-gradient(135deg, ${accent}dd, ${accent})` }}>
          {cta}
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "#060a10", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.06] blur-[140px]" style={{ background: "radial-gradient(circle, #10b981, #0d9488)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[120px]" style={{ background: "#3b82f6" }} />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full opacity-[0.03] blur-[80px]" style={{ background: "#a855f7" }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        <nav className="flex items-center justify-between mb-24">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow">
              <Zap size={15} className="text-white fill-white" />
            </div>
            <span className="text-white font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>ZILA</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors">
            <ChevronRight size={12} className="rotate-180" />
            Back to Estimator
          </Link>
        </nav>

        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-300 font-medium">Building in public · Kathmandu, Nepal</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tight text-white mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
            The engineer<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)" }}>behind ZILA.</span>
          </h1>
          <p className="text-white/40 text-lg max-w-lg mx-auto font-light leading-relaxed">Fighting contractor fraud with code. Building the tools I wish existed when my family was quoted 3× the real cost.</p>
        </div>

        <div className="relative rounded-3xl border border-white/[0.06] overflow-hidden mb-16 p-px" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(255,255,255,0.03), rgba(59,130,246,0.15))" }}>
          <div className="rounded-3xl bg-slate-950/80 backdrop-blur-xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 relative">
                  <Image src="/me.jpg" alt="Er. Angel Mainali" fill className="object-cover" priority />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-lg shadow-emerald-400/40" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Er. Angel Mainali</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs border border-blue-500/30 text-blue-300 bg-blue-500/10">B.E. Civil</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30 mb-4">
                  <MapPin size={11} /><span>Kathmandu Valley, Nepal</span><span className="opacity-40">·</span><span>Age 25</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-5">
                  I&apos;m a structural engineer specializing in hydropower projects. After watching my family get deceived by inflated contractor quotes with no way to verify costs, I built ZILA — Nepal&apos;s most accurate construction cost estimator — to give ordinary people the same information contractors try to hide.
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  {[{ icon: Award, label: "Structural Engineer" }, { icon: Cpu, label: "Indie Builder" }, { icon: Globe, label: "Open to Collaboration" }].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5"><Icon size={12} className="text-emerald-400" /><span className="text-xs text-white/40">{label}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20">
          <StatTile value="50" label="Districts" icon={MapPin} color="#10b981" />
          <StatTile value="2K+" label="Reports" icon={FileText} color="#3b82f6" />
          <StatTile value="100%" label="Transparent" icon={Shield} color="#a855f7" />
          <StatTile value="1" label="Engineer" icon={Users} color="#f59e0b" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-4">The Mission</p>
            <h2 className="text-3xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>Transparency is a right, not a luxury.</h2>
            <div className="space-y-4 text-sm text-white/45 leading-relaxed">
              <p>In Nepal, the construction industry runs on information asymmetry. Contractors quote wildly inflated prices because homeowners have no benchmark. A Rs. 60 lakh house becomes Rs. 1 crore on paper.</p>
              <p>ZILA breaks this cycle by providing engineer-verified cost data across 50 districts, factoring in logistics, local material prices, and labour rates — updated regularly.</p>
              <p>Every Rs. 199 report funds server costs, data collection, and keeps this tool free to explore. You&apos;re not buying software — you&apos;re funding transparency.</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest text-white/20 uppercase mb-4">Journey</p>
            <TimelineItem year="2020" event="Started Civil Engineering career" detail="Joined hydropower sector, worked on penstock design and anchor block analysis." active={false} />
            <TimelineItem year="2023" event="Witnessed contractor fraud firsthand" detail="Family received wildly inflated construction quotes. Decided to build a solution." active={false} />
            <TimelineItem year="2025" event="Built ZILA from scratch" detail="Learned Next.js, built a 50-district cost database, launched first version." active={true} />
            <TimelineItem year="2026 →" event="Pursuing Masters in Australia" detail="Continuing to build ZILA remotely while advancing structural engineering research." active={false} />
          </div>
        </div>

        <div className="mb-24">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-3">Support the mission</p>
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Keep ZILA alive & free.</h2>
            <p className="text-white/35 text-sm max-w-md mx-auto leading-relaxed">ZILA&apos;s core tool is free forever. Your support covers server costs, data updates, and the time that goes into building tools for Nepal.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DonationCard title="Support Internationally" subtitle="Monthly or one-time support for those outside Nepal. Cancel anytime." badge="🌍 International · USD" cta="Support on Patreon" href="https://patreon.com/angelmainali" accent="#f96854" featured={false}>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[["$2", "Coffee"], ["$5", "Lattes"], ["$10", "Fuel"]].map(([amt, label]) => (
                  <div key={amt} className="flex flex-col items-center gap-1 p-3 rounded-xl border border-white/8 bg-white/[0.02]">
                    <span className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{amt}</span>
                    <span className="text-[10px] text-white/30">{label}</span>
                  </div>
                ))}
              </div>
            </DonationCard>
            <DonationCard title="Support from Nepal" subtitle="Direct eSewa or bank transfer. Every rupee goes to building better tools." badge={<><Star size={10} className="fill-current" /> Local · Nepali Rupees</>} cta="Use these details directly in your app" href="#" accent="#10b981" featured={true}>
              <div className="space-y-2.5 mb-2">
                {[{ label: "eSewa ID", value: "9840185500", icon: "📱" }, { label: "Bank", value: "NIC Asia · Kathmandu", icon: "🏦" }, { label: "A/C Number", value: "2825750952307001", icon: "💳" }].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/6 bg-white/[0.03]">
                    <span className="text-xs text-white/40 flex items-center gap-2"><span>{icon}</span>{label}</span>
                    <span className="text-xs font-mono text-white/70">{value}</span>
                  </div>
                ))}
              </div>
            </DonationCard>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #064e3b, #065f46, #0d9488)" }} />
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)" }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Have a project in mind?</h3>
              <p className="text-sm text-emerald-100/60">I consult on structural engineering, hydropower design, and engineering SaaS products.</p>
            </div>
            <a href="mailto:er.angel.mainali@gmail.com" className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">
              <Mail size={15} /> Get in touch
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} ZILA · Built with ♥ in Kathmandu</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/20 hover:text-white/50 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
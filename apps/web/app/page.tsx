import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center">

      {/* Glowing orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-400/5 blur-2xl" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top-left logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M2 12h3l3-8 4 16 3-8 2 4h5"
            stroke="#22d3ee"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-white font-semibold text-sm tracking-tight">StreamPulse</span>
      </div>

      {/* Top-right live badge */}
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <span className="text-cyan-400/70 text-xs font-mono tracking-widest uppercase">Live</span>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">

        <div className="flex items-center gap-2 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-8 bg-cyan-500/5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Uptime Intelligence</span>
        </div>

        {/* Heading */}
        <h1 className="text-7xl font-bold tracking-tight leading-none mb-2">
          <span className="text-white">Stream</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Pulse</span>
        </h1>

        {/* Subheading */}
        <p className="text-white/40 text-lg font-light tracking-wide mt-6 mb-12">
          Track your website's uptime.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3 rounded-lg text-sm font-semibold tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-cyan-500/25"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-lg text-sm font-semibold tracking-wide text-white/70 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
          >
            Login
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-10 border-t border-white/5 pt-10 w-full">
          {[
            { value: "99.9%", label: "Avg Uptime" },
            { value: "30s", label: "Check Interval" },
            { value: "< 1ms", label: "Alert Speed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-white tabular-nums">{stat.value}</div>
              <div className="text-white/30 text-xs mt-1 font-mono tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom waveform */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[3px] px-8 pb-4 h-20 opacity-20">
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            className="w-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              height: `${Math.abs(Math.sin(i * 0.45)) * 60 + 15}%`,
              animationDelay: `${(i * 0.05) % 2}s`,
            }}
          />
        ))}
      </div>
    </main>
  );
}
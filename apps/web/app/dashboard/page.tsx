"use client";

import { useState } from "react";

const monitors = [
    { name: "api.streampulse.io", url: "https://api.streampulse.io", status: "up", uptime: 99.98, latency: 42, lastChecked: "10s ago", incidents: 0, region: "US East" },
    { name: "app.streampulse.io", url: "https://app.streampulse.io", status: "up", uptime: 99.91, latency: 78, lastChecked: "10s ago", incidents: 1, region: "EU West" },
    { name: "dashboard.streampulse.io", url: "https://dashboard.streampulse.io", status: "up", uptime: 100, latency: 31, lastChecked: "10s ago", incidents: 0, region: "US West" },
    { name: "auth.streampulse.io", url: "https://auth.streampulse.io", status: "down", uptime: 97.43, latency: 0, lastChecked: "10s ago", incidents: 3, region: "US East" },
    { name: "cdn.streampulse.io", url: "https://cdn.streampulse.io", status: "up", uptime: 99.99, latency: 18, lastChecked: "10s ago", incidents: 0, region: "Global" },
    { name: "billing.streampulse.io", url: "https://billing.streampulse.io", status: "degraded", uptime: 98.12, latency: 340, lastChecked: "10s ago", incidents: 2, region: "EU West" },
];

const incidents = [
    { id: 1, monitor: "auth.streampulse.io", type: "Outage", duration: "14m 32s", time: "2h ago", resolved: true },
    { id: 2, monitor: "billing.streampulse.io", type: "High Latency", duration: "Ongoing", time: "23m ago", resolved: false },
    { id: 3, monitor: "app.streampulse.io", type: "Timeout", duration: "2m 10s", time: "6h ago", resolved: true },
    { id: 4, monitor: "auth.streampulse.io", type: "Outage", duration: "5m 47s", time: "1d ago", resolved: true },
];

const uptimeBars = Array.from({ length: 60 }, (_, i) => {
    if (i > 55) return "down";
    if (i === 40 || i === 41) return "degraded";
    return "up";
});

const latencyData = [38, 42, 35, 50, 44, 39, 41, 78, 45, 42, 38, 36, 40, 44, 31, 35, 42, 38, 44, 41];

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        up: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        down: "bg-red-500/10 text-red-400 border-red-500/20",
        degraded: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full border ${styles[status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === "up" ? "bg-cyan-400" : status === "down" ? "bg-red-400" : "bg-yellow-400"} ${status !== "down" ? "animate-pulse" : ""}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("monitors");
    const totalUp = monitors.filter((m) => m.status === "up").length;
    const totalDown = monitors.filter((m) => m.status === "down").length;
    const totalDegraded = monitors.filter((m) => m.status === "degraded").length;
    const avgUptime = (monitors.reduce((a, m) => a + m.uptime, 0) / monitors.length).toFixed(2);
    const avgLatency = Math.round(monitors.filter((m) => m.latency > 0).reduce((a, m) => a + m.latency, 0) / monitors.filter((m) => m.latency > 0).length);

    const maxLatency = Math.max(...latencyData);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">

            {/* Sidebar */}
            <aside className="w-60 shrink-0 border-r border-white/5 flex flex-col bg-slate-950/80 backdrop-blur-sm">
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M2 12h3l3-8 4 16 3-8 2 4h5" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white font-semibold text-sm tracking-tight">StreamPulse</span>
                    <span className="ml-auto flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-cyan-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {[
                        { id: "monitors", label: "Monitors", icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" },
                        { id: "incidents", label: "Incidents", icon: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" },
                        { id: "analytics", label: "Analytics", icon: "M3 3v18h18M7 16l4-4 4 4 4-8" },
                        { id: "settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${activeTab === item.id
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                : "text-white/40 hover:text-white/70 hover:bg-white/5"
                                }`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d={item.icon} />
                            </svg>
                            {item.label}
                            {item.id === "incidents" && totalDown + totalDegraded > 0 && (
                                <span className="ml-auto bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full border border-red-500/20">
                                    {totalDown + totalDegraded}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User */}
                <div className="px-4 py-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 text-xs font-bold shrink-0">
                            JD
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-xs font-medium truncate">John Doe</p>
                            <p className="text-white/30 text-xs truncate">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Header */}
                <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-slate-950/60 backdrop-blur-sm shrink-0">
                    <div>
                        <h1 className="text-white font-semibold text-lg tracking-tight capitalize">{activeTab}</h1>
                        <p className="text-white/30 text-xs mt-0.5">Last updated just now · Auto-refreshes every 30s</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all duration-200">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-cyan-500/20">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add Monitor
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8 space-y-6">

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                        {[
                            { label: "Monitors Up", value: `${totalUp}/${monitors.length}`, sub: "All systems checked", color: "cyan", icon: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" },
                            { label: "Avg Uptime", value: `${avgUptime}%`, sub: "Last 30 days", color: "blue", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
                            { label: "Avg Latency", value: `${avgLatency}ms`, sub: "Across all monitors", color: "cyan", icon: "M13 2 3 14h9l-1 8 10-12h-9l1-8z" },
                            { label: "Active Incidents", value: `${incidents.filter(i => !i.resolved).length}`, sub: `${incidents.filter(i => i.resolved).length} resolved today`, color: "red", icon: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" },
                        ].map((card) => (
                            <div key={card.label} className="bg-white/5 border border-white/8 rounded-xl p-5 hover:border-white/15 transition-all duration-200">
                                <div className="flex items-start justify-between mb-3">
                                    <p className="text-white/40 text-xs font-mono uppercase tracking-widest">{card.label}</p>
                                    <div className={`p-1.5 rounded-lg ${card.color === "red" ? "bg-red-500/10" : "bg-cyan-500/10"}`}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={card.color === "red" ? "#f87171" : "#22d3ee"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d={card.icon} />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-white tabular-nums">{card.value}</p>
                                <p className="text-white/25 text-xs mt-1">{card.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Latency sparkline */}
                    <div className="bg-white/5 border border-white/8 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-white text-sm font-medium">Response Time</p>
                                <p className="text-white/30 text-xs mt-0.5">Last 20 checks · api.streampulse.io</p>
                            </div>
                            <span className="text-cyan-400 text-xs font-mono">{avgLatency}ms avg</span>
                        </div>
                        <div className="flex items-end gap-1.5 h-16">
                            {latencyData.map((val, i) => (
                                <div
                                    key={i}
                                    className="flex-1 rounded-sm transition-all duration-200 hover:opacity-80"
                                    style={{
                                        height: `${(val / maxLatency) * 100}%`,
                                        background: val > 200 ? "#f87171" : val > 80 ? "#facc15" : "#22d3ee",
                                        opacity: 0.5 + (i / latencyData.length) * 0.5,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Monitors table */}
                    <div className="bg-white/5 border border-white/8 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                            <p className="text-white text-sm font-medium">All Monitors</p>
                            <div className="flex items-center gap-2">
                                <span className="text-white/30 text-xs">{monitors.length} total</span>
                            </div>
                        </div>
                        <div className="divide-y divide-white/5">
                            {monitors.map((monitor) => (
                                <div key={monitor.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition-colors duration-150 group">
                                    {/* Status dot */}
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${monitor.status === "up" ? "bg-cyan-400" : monitor.status === "down" ? "bg-red-400" : "bg-yellow-400"} ${monitor.status !== "down" ? "animate-pulse" : ""}`} />

                                    {/* Name */}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-white text-sm font-medium truncate">{monitor.name}</p>
                                        <p className="text-white/25 text-xs truncate">{monitor.url}</p>
                                    </div>

                                    {/* Uptime bar (60 dots) */}
                                    <div className="hidden lg:flex items-center gap-px">
                                        {uptimeBars.map((bar, i) => (
                                            <div
                                                key={i}
                                                className={`w-1 h-4 rounded-sm ${monitor.status === "down" && i > 50
                                                    ? "bg-red-400/70"
                                                    : bar === "up"
                                                        ? "bg-cyan-400/40 group-hover:bg-cyan-400/60"
                                                        : bar === "degraded"
                                                            ? "bg-yellow-400/60"
                                                            : "bg-red-400/70"
                                                    } transition-colors duration-200`}
                                            />
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden md:flex items-center gap-6 shrink-0 text-right">
                                        <div>
                                            <p className="text-white text-sm tabular-nums">{monitor.uptime}%</p>
                                            <p className="text-white/25 text-xs">uptime</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm tabular-nums ${monitor.latency === 0 ? "text-red-400" : monitor.latency > 200 ? "text-yellow-400" : "text-white"}`}>
                                                {monitor.latency === 0 ? "—" : `${monitor.latency}ms`}
                                            </p>
                                            <p className="text-white/25 text-xs">latency</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-xs">{monitor.lastChecked}</p>
                                            <p className="text-white/25 text-xs">{monitor.region}</p>
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <div className="shrink-0">
                                        <StatusBadge status={monitor.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent incidents */}
                    <div className="bg-white/5 border border-white/8 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                            <p className="text-white text-sm font-medium">Recent Incidents</p>
                            <button className="text-cyan-400/60 text-xs hover:text-cyan-400 transition-colors duration-200">View all</button>
                        </div>
                        <div className="divide-y divide-white/5">
                            {incidents.map((incident) => (
                                <div key={incident.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition-colors duration-150">
                                    <div className={`p-2 rounded-lg shrink-0 ${incident.resolved ? "bg-white/5" : "bg-red-500/10"}`}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={incident.resolved ? "#ffffff40" : "#f87171"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium">{incident.type}</p>
                                        <p className="text-white/30 text-xs">{incident.monitor}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-white/50 text-xs">{incident.duration}</p>
                                        <p className="text-white/25 text-xs">{incident.time}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border font-mono shrink-0 ${incident.resolved
                                        ? "bg-white/5 text-white/30 border-white/10"
                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                        }`}>
                                        {incident.resolved ? "Resolved" : "Ongoing"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
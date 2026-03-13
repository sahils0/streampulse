"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const passwordStrength = (pwd: string) => {
        if (!pwd) return 0;
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const strength = passwordStrength(form.password);
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
    const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-blue-400", "bg-cyan-400"][strength];

    const passwordMatch = form.confirm.length > 0 && form.password === form.confirm;
    const passwordMismatch = form.confirm.length > 0 && form.password !== form.confirm;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed || passwordMismatch) return;
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-4 py-12">

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
                <Link href="/" className="flex items-center gap-2">
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
                </Link>
            </div>

            {/* Top-right live badge */}
            <div className="absolute top-8 right-8 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                <span className="text-cyan-400/70 text-xs font-mono tracking-widest uppercase">Live</span>
            </div>

            {/* Register card */}
            <div className="relative z-10 w-full max-w-md mt-8">

                {/* Card header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">Get started free</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create your account</h1>
                    <p className="text-white/40 text-sm mt-2">Start monitoring your websites in minutes</p>
                </div>

                {/* Card body */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-black/40">

                    {/* OAuth buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm transition-all duration-200">
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm transition-all duration-200">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-white/20 text-xs font-mono">or continue with email</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Full name */}
                        <div className="space-y-1.5">
                            <label className="text-white/60 text-xs font-mono tracking-widest uppercase">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-white/60 text-xs font-mono tracking-widest uppercase">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-white/60 text-xs font-mono tracking-widest uppercase">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-11 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3.5 flex items-center text-white/30 hover:text-white/60 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Password strength bar */}
                            {form.password.length > 0 && (
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-white/10"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-mono ${strength <= 1 ? "text-red-400" :
                                            strength === 2 ? "text-yellow-400" :
                                                strength === 3 ? "text-blue-400" : "text-cyan-400"
                                        }`}>
                                        {strengthLabel} password
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div className="space-y-1.5">
                            <label className="text-white/60 text-xs font-mono tracking-widest uppercase">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirm"
                                    value={form.confirm}
                                    onChange={handleChange}
                                    placeholder="Re-enter password"
                                    required
                                    className={`w-full bg-white/5 border rounded-lg pl-10 pr-11 py-3 text-sm text-white placeholder-white/20 focus:outline-none transition-all duration-200 ${passwordMismatch
                                            ? "border-red-500/50 focus:border-red-500/70 bg-red-500/5"
                                            : passwordMatch
                                                ? "border-cyan-500/50 focus:border-cyan-500/70 bg-cyan-500/5"
                                                : "border-white/10 focus:border-cyan-500/50 focus:bg-cyan-500/5"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute inset-y-0 right-3.5 flex items-center text-white/30 hover:text-white/60 transition-colors duration-200"
                                >
                                    {showConfirm ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>

                                {/* Match indicator */}
                                {passwordMatch && (
                                    <div className="absolute inset-y-0 right-10 flex items-center">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {passwordMismatch && (
                                <p className="text-red-400 text-xs font-mono">Passwords do not match</p>
                            )}
                        </div>

                        {/* Terms checkbox */}
                        <div className="flex items-start gap-2.5 pt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded border border-white/20 bg-white/5 accent-cyan-400 cursor-pointer shrink-0"
                            />
                            <label htmlFor="terms" className="text-white/40 text-sm cursor-pointer select-none leading-relaxed hover:text-white/60 transition-colors duration-200">
                                I agree to the{" "}
                                <Link href="/terms" className="text-cyan-400/80 hover:text-cyan-400 transition-colors duration-200">Terms of Service</Link>
                                {" "}and{" "}
                                <Link href="/privacy" className="text-cyan-400/80 hover:text-cyan-400 transition-colors duration-200">Privacy Policy</Link>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !agreed || passwordMismatch}
                            className="w-full py-3 rounded-lg text-sm font-semibold tracking-wide text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer link */}
                <p className="text-center text-white/30 text-sm mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-cyan-400/80 hover:text-cyan-400 transition-colors duration-200 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}